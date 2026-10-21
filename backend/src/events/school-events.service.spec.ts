import { BadRequestException } from "@nestjs/common";
import { SchoolEventsService } from "./school-events.service.js";

describe("SchoolEventsService", () => {
  const actor = { id: "director-1" };

  it("does not allow a postponement without an accountable reason", async () => {
    const event = {
      id: "event-1", title: "Alumni reunion", startsAt: new Date("2027-06-12T09:00:00.000Z"), endsAt: null,
      publicationStatus: "PUBLISHED", operationalStatus: "SCHEDULED", visibility: "PUBLIC",
      audiences: [], images: [], changes: [],
    };
    const prisma = { schoolEvent: { findUnique: jest.fn().mockResolvedValue(event), update: jest.fn() } } as any;
    const service = new SchoolEventsService(prisma);

    await expect(service.postpone("event-1", {}, actor)).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.schoolEvent.update).not.toHaveBeenCalled();
  });

  it("keeps publication and operational state separate when an event is postponed", async () => {
    const before = {
      id: "event-1", title: "Alumni reunion", startsAt: new Date("2027-06-12T09:00:00.000Z"), endsAt: null,
      publicationStatus: "PUBLISHED", operationalStatus: "SCHEDULED", visibility: "PUBLIC",
      audiences: [], images: [], changes: [],
    };
    const after = { ...before, operationalStatus: "POSTPONED" };
    const prisma = {
      schoolEvent: { findUnique: jest.fn().mockResolvedValue(before), update: jest.fn().mockResolvedValue(after) },
      schoolEventChange: { create: jest.fn().mockResolvedValue({ id: "change-1" }) },
    } as any;
    const service = new SchoolEventsService(prisma);

    await service.postpone("event-1", { reason: "Severe weather" }, actor);

    expect(prisma.schoolEvent.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ operationalStatus: "POSTPONED" }),
    }));
    expect(prisma.schoolEventChange.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ action: "POSTPONED", reason: "Severe weather" }),
    }));
  });
});
