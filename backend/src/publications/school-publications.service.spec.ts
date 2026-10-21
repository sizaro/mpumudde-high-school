import { BadRequestException } from "@nestjs/common";
import { SchoolPublicationsService } from "./school-publications.service.js";

describe("SchoolPublicationsService", () => {
  const actor = { id: "director-1" };

  it("refuses to publish a named alumni story without recorded publication consent", async () => {
    const prisma = {
      schoolPublication: {
        findUnique: jest.fn().mockResolvedValue({
          id: "publication-1",
          title: "A journey",
          summary: "A verified alumni story.",
          contentDocument: { version: 1, blocks: [{ type: "paragraph", text: "Story" }] },
          alumniId: "alumni-1",
          consentConfirmedAt: null,
          featuredImageUrl: null,
          featuredImageAlt: null,
        }),
        update: jest.fn(),
      },
    } as any;
    const service = new SchoolPublicationsService(prisma);

    await expect(service.publish("publication-1")).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.schoolPublication.update).not.toHaveBeenCalled();
  });

  it("creates a draft using validated structured content without publishing it", async () => {
    const prisma = {
      alumni: { findUnique: jest.fn().mockResolvedValue(null) },
      schoolPublication: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: "publication-1", status: "DRAFT" }),
      },
    } as any;
    const service = new SchoolPublicationsService(prisma);

    await service.create({
      title: "Alumni career story",
      summary: "A concise, approved summary.",
      contentDocument: { version: 1, blocks: [{ type: "paragraph", text: "Approved story content." }] },
    }, actor);

    expect(prisma.schoolPublication.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: "DRAFT", authorUserId: actor.id, slug: "alumni-career-story" }),
    }));
  });
});
