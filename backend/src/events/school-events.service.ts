import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { validateCommunicationDocument } from "../communications/email-templates/communication-content.js";
import { EVENT_AUDIENCES } from "../content/content.constants.js";
import { CreateSchoolEventDto } from "./dto/create-school-event.dto.js";
import { UpdateSchoolEventDto } from "./dto/update-school-event.dto.js";
import { EventDecisionDto } from "./dto/event-decision.dto.js";

type Actor = { id: string };

@Injectable()
export class SchoolEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async listPublicAlumniEvents(page = 1, pageSize = 9) {
    const safePage = Math.max(1, page);
    const safePageSize = Math.min(50, Math.max(1, pageSize));
    const where = {
      publicationStatus: "PUBLISHED",
      visibility: "PUBLIC",
      operationalStatus: { in: ["SCHEDULED", "POSTPONED"] },
      startsAt: { gte: new Date() },
      audiences: { some: { audience: { in: ["ALUMNI", "WHOLE_SCHOOL"] } } },
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.schoolEvent.findMany({ where, orderBy: { startsAt: "asc" }, skip: (safePage - 1) * safePageSize, take: safePageSize, include: { audiences: true, images: { orderBy: { sortOrder: "asc" } } } }),
      this.prisma.schoolEvent.count({ where }),
    ]);
    return { items, total, page: safePage, pageSize: safePageSize, totalPages: Math.max(1, Math.ceil(total / safePageSize)) };
  }

  async getPublicAlumniEvent(slug: string) {
    const event = await this.prisma.schoolEvent.findFirst({
      where: { slug, publicationStatus: "PUBLISHED", visibility: "PUBLIC", audiences: { some: { audience: { in: ["ALUMNI", "WHOLE_SCHOOL"] } } } },
      include: { audiences: true, images: { orderBy: { sortOrder: "asc" } }, series: true },
    });
    if (!event) throw new NotFoundException("Published alumni event not found.");
    return event;
  }

  async listForManagement() {
    return this.prisma.schoolEvent.findMany({
      orderBy: { startsAt: "desc" },
      include: { audiences: true, images: { orderBy: { sortOrder: "asc" } }, series: true, createdBy: { select: { id: true, email: true } }, updatedBy: { select: { id: true, email: true } } },
    });
  }

  async getForManagement(id: string) {
    const event = await this.prisma.schoolEvent.findUnique({
      where: { id },
      include: { audiences: true, images: { orderBy: { sortOrder: "asc" } }, series: true, changes: { orderBy: { createdAt: "desc" }, include: { actor: { select: { id: true, email: true } } } }, createdBy: { select: { id: true, email: true } }, updatedBy: { select: { id: true, email: true } } },
    });
    if (!event) throw new NotFoundException("School event not found.");
    return event;
  }

  async create(dto: CreateSchoolEventDto, actor: Actor) {
    this.assertTiming(dto.startsAt, dto.endsAt);
    await this.assertTargets(dto.audiences);
    const recurrenceRule = dto.recurrenceRule ?? "ONE_TIME";
    const series = recurrenceRule === "ONE_TIME" ? null : await this.prisma.schoolEventSeries.create({ data: { title: dto.seriesTitle?.trim() || dto.title.trim(), recurrenceRule, createdByUserId: actor.id } });
    const publicationStatus = dto.publicationStatus ?? "DRAFT";
    const created = await this.prisma.schoolEvent.create({
      data: {
        title: dto.title.trim(), slug: await this.availableSlug(dto.slug || dto.title), type: dto.type.trim(), venue: dto.venue?.trim() || null,
        descriptionDocument: dto.descriptionDocument ? this.safeDocument(dto.descriptionDocument) : undefined,
        startsAt: new Date(dto.startsAt), endsAt: dto.endsAt ? new Date(dto.endsAt) : null, recurrenceRule, visibility: dto.visibility ?? "PUBLIC", publicationStatus,
        seriesId: series?.id, featuredImageUrl: dto.featuredImageUrl || null, featuredImagePublicId: dto.featuredImagePublicId || null, featuredImageAlt: dto.featuredImageAlt?.trim() || null,
        createdByUserId: actor.id, updatedByUserId: actor.id, publishedAt: publicationStatus === "PUBLISHED" ? new Date() : null,
        audiences: { create: dto.audiences.map((target) => ({ audience: target.audience, schoolClassId: target.schoolClassId || null, academicYearId: target.academicYearId || null, stream: target.stream?.trim() || null })) },
        images: dto.images ? { create: dto.images.map((image, index) => ({ ...image, sortOrder: index })) } : undefined,
      }, include: { audiences: true, images: true },
    });
    await this.recordChange(created.id, actor.id, "CREATED", undefined, { publicationStatus: created.publicationStatus, operationalStatus: created.operationalStatus, startsAt: created.startsAt, endsAt: created.endsAt });
    return created;
  }

  async update(id: string, dto: UpdateSchoolEventDto, actor: Actor) {
    const existing = await this.getForManagement(id);
    this.assertTiming(dto.startsAt ?? existing.startsAt.toISOString(), dto.endsAt === undefined ? existing.endsAt?.toISOString() : dto.endsAt);
    if (dto.audiences) await this.assertTargets(dto.audiences);
    const next = await this.prisma.schoolEvent.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.slug || dto.title ? { slug: await this.availableSlug(dto.slug || dto.title || existing.title, id) } : {}),
        ...(dto.type !== undefined ? { type: dto.type.trim() } : {}),
        ...(dto.venue !== undefined ? { venue: dto.venue.trim() || null } : {}),
        ...(dto.descriptionDocument !== undefined ? { descriptionDocument: this.safeDocument(dto.descriptionDocument) } : {}),
        ...(dto.startsAt !== undefined ? { startsAt: new Date(dto.startsAt) } : {}),
        ...(dto.endsAt !== undefined ? { endsAt: dto.endsAt ? new Date(dto.endsAt) : null } : {}),
        ...(dto.recurrenceRule !== undefined ? { recurrenceRule: dto.recurrenceRule } : {}),
        ...(dto.visibility !== undefined ? { visibility: dto.visibility } : {}),
        ...(dto.featuredImageUrl !== undefined ? { featuredImageUrl: dto.featuredImageUrl || null } : {}),
        ...(dto.featuredImagePublicId !== undefined ? { featuredImagePublicId: dto.featuredImagePublicId || null } : {}),
        ...(dto.featuredImageAlt !== undefined ? { featuredImageAlt: dto.featuredImageAlt.trim() || null } : {}),
        ...(dto.audiences ? { audiences: { deleteMany: {}, create: dto.audiences.map((target) => ({ audience: target.audience, schoolClassId: target.schoolClassId || null, academicYearId: target.academicYearId || null, stream: target.stream?.trim() || null })) } } : {}),
        ...(dto.images ? { images: { deleteMany: {}, create: dto.images.map((image, index) => ({ ...image, sortOrder: index })) } } : {}),
        updatedByUserId: actor.id,
      }, include: { audiences: true, images: true },
    });
    await this.recordChange(id, actor.id, "UPDATED", this.snapshot(existing), this.snapshot(next));
    return next;
  }

  async publish(id: string, actor: Actor) {
    const existing = await this.getForManagement(id);
    const event = await this.prisma.schoolEvent.update({ where: { id }, data: { publicationStatus: "PUBLISHED", publishedAt: new Date(), archivedAt: null, updatedByUserId: actor.id } });
    await this.recordChange(id, actor.id, "PUBLISHED", this.snapshot(existing), this.snapshot(event));
    return event;
  }
  async unpublish(id: string, actor: Actor) { return this.transitionPublication(id, actor, "DRAFT", "UNPUBLISHED"); }
  async archive(id: string, actor: Actor) { return this.transitionPublication(id, actor, "ARCHIVED", "ARCHIVED", { archivedAt: new Date() }); }

  async postpone(id: string, dto: EventDecisionDto, actor: Actor) {
    const existing = await this.getForManagement(id);
    if (!dto.reason?.trim()) throw new BadRequestException("Explain why the event is postponed.");
    this.assertTiming(dto.startsAt ?? existing.startsAt.toISOString(), dto.endsAt === undefined ? existing.endsAt?.toISOString() : dto.endsAt);
    const event = await this.prisma.schoolEvent.update({ where: { id }, data: { operationalStatus: "POSTPONED", ...(dto.startsAt ? { startsAt: new Date(dto.startsAt) } : {}), ...(dto.endsAt !== undefined ? { endsAt: dto.endsAt ? new Date(dto.endsAt) : null } : {}), updatedByUserId: actor.id } });
    await this.recordChange(id, actor.id, "POSTPONED", this.snapshot(existing), this.snapshot(event), dto.reason);
    return event;
  }

  async reschedule(id: string, dto: EventDecisionDto, actor: Actor) {
    if (!dto.startsAt) throw new BadRequestException("Provide the new event start date and time.");
    if (!dto.reason?.trim()) throw new BadRequestException("Explain why the event is rescheduled.");
    const existing = await this.getForManagement(id);
    const endsAt = dto.endsAt === undefined ? existing.endsAt?.toISOString() : dto.endsAt;
    this.assertTiming(dto.startsAt, endsAt);
    const event = await this.prisma.schoolEvent.update({ where: { id }, data: { startsAt: new Date(dto.startsAt), endsAt: endsAt ? new Date(endsAt) : null, operationalStatus: "SCHEDULED", updatedByUserId: actor.id } });
    await this.recordChange(id, actor.id, "RESCHEDULED", this.snapshot(existing), this.snapshot(event), dto.reason);
    return event;
  }

  async cancel(id: string, dto: EventDecisionDto, actor: Actor) { return this.transitionOperational(id, actor, "CANCELLED", "CANCELLED", dto.reason); }
  async complete(id: string, dto: EventDecisionDto, actor: Actor) { return this.transitionOperational(id, actor, "COMPLETED", "COMPLETED", dto.reason); }
  async listChanges(id: string) { await this.getForManagement(id); return this.prisma.schoolEventChange.findMany({ where: { eventId: id }, include: { actor: { select: { id: true, email: true } } }, orderBy: { createdAt: "desc" } }); }

  private async transitionPublication(id: string, actor: Actor, publicationStatus: string, action: string, extra: Record<string, unknown> = {}) {
    const existing = await this.getForManagement(id);
    const event = await this.prisma.schoolEvent.update({ where: { id }, data: { publicationStatus, updatedByUserId: actor.id, ...extra } });
    await this.recordChange(id, actor.id, action, this.snapshot(existing), this.snapshot(event));
    return event;
  }
  private async transitionOperational(id: string, actor: Actor, operationalStatus: string, action: string, reason?: string) {
    const existing = await this.getForManagement(id);
    if (!reason?.trim()) throw new BadRequestException(`Explain why the event is ${action.toLowerCase()}.`);
    const event = await this.prisma.schoolEvent.update({ where: { id }, data: { operationalStatus, updatedByUserId: actor.id } });
    await this.recordChange(id, actor.id, action, this.snapshot(existing), this.snapshot(event), reason);
    return event;
  }
  private async recordChange(eventId: string, actorUserId: string, action: string, previousValues?: object, nextValues?: object, reason?: string) { return this.prisma.schoolEventChange.create({ data: { eventId, actorUserId, action, reason: reason?.trim() || null, previousValues, nextValues } }); }
  private snapshot(event: any) { return { publicationStatus: event.publicationStatus, operationalStatus: event.operationalStatus, startsAt: event.startsAt, endsAt: event.endsAt, visibility: event.visibility }; }
  private safeDocument(input: Record<string, unknown>) { try { return validateCommunicationDocument(input); } catch (error) { throw new BadRequestException(error instanceof Error ? error.message : "Invalid event description."); } }
  private assertTiming(startsAt: string, endsAt?: string | null) { const start = new Date(startsAt); const end = endsAt ? new Date(endsAt) : null; if (Number.isNaN(start.getTime()) || (end && Number.isNaN(end.getTime())) || (end && end <= start)) throw new BadRequestException("An event end time must be after its start time."); }
  private async assertTargets(targets: Array<{ audience: string; schoolClassId?: string; academicYearId?: string }>) {
    if (!targets.length) throw new BadRequestException("Choose at least one event audience.");
    if (targets.some((target) => !EVENT_AUDIENCES.includes(target.audience as any))) throw new BadRequestException("An event audience is not supported.");
    const classIds = [...new Set(targets.map((target) => target.schoolClassId).filter(Boolean))] as string[];
    const yearIds = [...new Set(targets.map((target) => target.academicYearId).filter(Boolean))] as string[];
    const [classes, years] = await Promise.all([classIds.length ? this.prisma.schoolClass.count({ where: { id: { in: classIds } } }) : 0, yearIds.length ? this.prisma.academicYear.count({ where: { id: { in: yearIds } } }) : 0]);
    if (classes !== classIds.length || years !== yearIds.length) throw new BadRequestException("One or more event audience targets no longer exist.");
  }
  private async availableSlug(value: string, ignoreId?: string) { const base = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 180) || "school-event"; let candidate = base; let number = 2; while (await this.prisma.schoolEvent.findFirst({ where: { slug: candidate, ...(ignoreId ? { id: { not: ignoreId } } : {}) }, select: { id: true } })) candidate = `${base}-${number++}`; return candidate; }
}
