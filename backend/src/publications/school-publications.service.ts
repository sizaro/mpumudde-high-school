import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { validateCommunicationDocument } from "../communications/email-templates/communication-content.js";
import { CreateSchoolPublicationDto } from "./dto/create-school-publication.dto.js";
import { UpdateSchoolPublicationDto } from "./dto/update-school-publication.dto.js";

type Actor = { id: string };

@Injectable()
export class SchoolPublicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublicAlumniStories(page = 1, pageSize = 9, featured?: boolean) {
    const safePage = Math.max(1, page);
    const safePageSize = Math.min(50, Math.max(1, pageSize));
    const where = {
      kind: "ALUMNI_STORY",
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
      ...(featured === undefined ? {} : { isFeatured: featured }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.schoolPublication.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
        skip: (safePage - 1) * safePageSize,
        take: safePageSize,
        include: { alumni: { select: { id: true, fullName: true, profileImageUrl: true } }, images: { orderBy: { sortOrder: "asc" } } },
      }),
      this.prisma.schoolPublication.count({ where }),
    ]);
    return { items, total, page: safePage, pageSize: safePageSize, totalPages: Math.max(1, Math.ceil(total / safePageSize)) };
  }

  async getPublicAlumniStory(slug: string) {
    const story = await this.prisma.schoolPublication.findFirst({
      where: { slug, kind: "ALUMNI_STORY", status: "PUBLISHED", publishedAt: { lte: new Date() } },
      include: { alumni: { select: { id: true, fullName: true, profileImageUrl: true } }, images: { orderBy: { sortOrder: "asc" } } },
    });
    if (!story) throw new NotFoundException("Published alumni story not found.");
    return story;
  }

  async listForManagement() {
    return this.prisma.schoolPublication.findMany({
      orderBy: { updatedAt: "desc" },
      include: { alumni: { select: { id: true, fullName: true } }, author: { select: { id: true, email: true } }, images: { orderBy: { sortOrder: "asc" } } },
    });
  }

  async getForManagement(id: string) {
    const story = await this.prisma.schoolPublication.findUnique({
      where: { id },
      include: { alumni: { select: { id: true, fullName: true } }, author: { select: { id: true, email: true } }, images: { orderBy: { sortOrder: "asc" } } },
    });
    if (!story) throw new NotFoundException("School publication not found.");
    return story;
  }

  async create(dto: CreateSchoolPublicationDto, actor: Actor) {
    const values = await this.normalize(dto, actor, true);
    const slug = await this.availableSlug(dto.slug || dto.title);
    const publication = await this.prisma.schoolPublication.create({
      data: { ...values, slug, authorUserId: actor.id, publishedAt: values.status === "PUBLISHED" ? new Date() : undefined } as any,
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
    return publication;
  }

  async update(id: string, dto: UpdateSchoolPublicationDto, actor: Actor) {
    const existing = await this.getForManagement(id);
    const values = await this.normalize(dto, actor, false, existing);
    const slug = dto.slug || dto.title ? await this.availableSlug(dto.slug || dto.title || existing.title, id) : undefined;
    return this.prisma.schoolPublication.update({
      where: { id },
      data: { ...values, ...(slug ? { slug } : {}) } as any,
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
  }

  async moveToReview(id: string) { return this.changeStatus(id, "IN_REVIEW"); }

  async publish(id: string) {
    const publication = await this.getForManagement(id);
    this.assertPublishable(publication);
    return this.prisma.schoolPublication.update({ where: { id }, data: { status: "PUBLISHED", publishedAt: new Date(), archivedAt: null } });
  }

  async unpublish(id: string) { return this.changeStatus(id, "DRAFT", { publishedAt: null }); }
  async archive(id: string) { return this.changeStatus(id, "ARCHIVED", { archivedAt: new Date() }); }

  private async changeStatus(id: string, status: string, extra: Record<string, unknown> = {}) {
    await this.getForManagement(id);
    return this.prisma.schoolPublication.update({ where: { id }, data: { status, ...extra } });
  }

  private async normalize(dto: Partial<CreateSchoolPublicationDto>, actor: Actor, creating: boolean, existing?: any) {
    const contentDocument = dto.contentDocument === undefined
      ? undefined
      : this.safeDocument(dto.contentDocument);
    const alumniId = dto.alumniId === undefined ? existing?.alumniId : dto.alumniId || null;
    if (alumniId) {
      const alumni = await this.prisma.alumni.findUnique({ where: { id: alumniId }, select: { id: true } });
      if (!alumni) throw new BadRequestException("Selected alumnus was not found.");
    }
    const requestedStatus = dto.status ?? (creating ? "DRAFT" : existing?.status);
    const consentConfirmed = dto.consentConfirmed === true;
    const consentConfirmedAt = consentConfirmed ? new Date() : existing?.consentConfirmedAt;
    const consentConfirmedByUserId = consentConfirmed ? actor.id : existing?.consentConfirmedByUserId;
    const values: Record<string, unknown> = {
      ...(dto.kind ? { kind: dto.kind } : {}),
      ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
      ...(dto.summary !== undefined ? { summary: dto.summary.trim() } : {}),
      ...(dto.category !== undefined ? { category: dto.category.trim() || null } : {}),
      ...(contentDocument !== undefined ? { contentDocument } : {}),
      ...(dto.alumniId !== undefined ? { alumniId } : {}),
      ...(dto.isFeatured !== undefined ? { isFeatured: dto.isFeatured } : {}),
      ...(dto.featuredImageUrl !== undefined ? { featuredImageUrl: dto.featuredImageUrl || null } : {}),
      ...(dto.featuredImagePublicId !== undefined ? { featuredImagePublicId: dto.featuredImagePublicId || null } : {}),
      ...(dto.featuredImageAlt !== undefined ? { featuredImageAlt: dto.featuredImageAlt?.trim() || null } : {}),
      ...(dto.consentNote !== undefined ? { consentNote: dto.consentNote.trim() || null } : {}),
      ...(consentConfirmed ? { consentConfirmedAt, consentConfirmedByUserId } : {}),
      ...(dto.images !== undefined ? { images: { deleteMany: {}, create: dto.images.map((image, index) => ({ ...image, sortOrder: index })) } } : {}),
      ...(creating ? { status: requestedStatus } : {}),
    };
    if (requestedStatus === "PUBLISHED") this.assertPublishable({ ...existing, ...values, alumniId, consentConfirmedAt });
    return values;
  }

  private safeDocument(input: Record<string, unknown>) {
    try { return validateCommunicationDocument(input); }
    catch (error) { throw new BadRequestException(error instanceof Error ? error.message : "Invalid publication content."); }
  }

  private assertPublishable(publication: any) {
    if (!publication.title?.trim() || !publication.summary?.trim() || !publication.contentDocument) {
      throw new BadRequestException("A published story needs a title, summary, and approved structured content.");
    }
    if (publication.alumniId && !publication.consentConfirmedAt) {
      throw new BadRequestException("Record publication consent before publishing a story about a named alumnus.");
    }
    if (publication.featuredImageUrl && !publication.featuredImageAlt?.trim()) {
      throw new BadRequestException("Provide alternative text for the featured image before publishing.");
    }
  }

  private async availableSlug(value: string, ignoreId?: string) {
    const base = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 180) || "school-story";
    let candidate = base;
    let number = 2;
    while (await this.prisma.schoolPublication.findFirst({ where: { slug: candidate, ...(ignoreId ? { id: { not: ignoreId } } : {}) }, select: { id: true } })) {
      candidate = `${base}-${number++}`;
    }
    return candidate;
  }
}
