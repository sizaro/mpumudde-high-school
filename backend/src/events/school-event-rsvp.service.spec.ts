import { BadRequestException } from "@nestjs/common";
import { SchoolEventRsvpService } from "./school-event-rsvp.service.js";

const futureEvent = {
  id: "event-1", slug: "alumni-reunion", title: "Alumni reunion", startsAt: new Date("2027-06-12T09:00:00.000Z"),
  publicationStatus: "PUBLISHED", visibility: "PUBLIC", operationalStatus: "SCHEDULED", rsvpEnabled: true,
  rsvpMode: "ALUMNI_ONLY", rsvpDeadline: null, rsvpCapacity: null, waitlistEnabled: false,
};

describe("SchoolEventRsvpService", () => {
  const config = { get: jest.fn().mockReturnValue("http://localhost:5173") } as any;

  it("requires an active verified alumni email for an alumni-only event", async () => {
    const prisma = {
      schoolEvent: { findFirst: jest.fn().mockResolvedValue(futureEvent) },
      communicationContact: { findFirst: jest.fn().mockResolvedValue(null) },
      alumni: { findFirst: jest.fn() },
    } as any;
    const service = new SchoolEventRsvpService(prisma, { sendTextEmail: jest.fn() } as any, config);

    await expect(service.request("alumni-reunion", { fullName: "Ada Alumna", email: "ada@example.com" })).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.schoolEventRsvp).toBeUndefined();
  });

  it("creates only a pending response and sends a separate confirmation link", async () => {
    const prisma = {
      schoolEvent: { findFirst: jest.fn().mockResolvedValue(futureEvent) },
      communicationContact: { findFirst: jest.fn().mockResolvedValue({ ownerId: "alumni-1" }) },
      alumni: { findFirst: jest.fn().mockResolvedValue({ id: "alumni-1" }) },
      schoolEventRsvp: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({ id: "rsvp-1", fullName: "Ada Alumna", email: "ada@example.com" }),
      },
    } as any;
    const email = { sendTextEmail: jest.fn().mockResolvedValue({ status: "SENT" }) } as any;
    const service = new SchoolEventRsvpService(prisma, email, config);

    await expect(service.request("alumni-reunion", { fullName: "Ada Alumna", email: "Ada@Example.com", attendance: "GOING", guestCount: 1 })).resolves.toEqual(expect.objectContaining({ success: true }));
    expect(prisma.schoolEventRsvp.upsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ normalizedEmail: "ada@example.com", requestedAttendance: "GOING" }),
    }));
    expect(email.sendTextEmail).toHaveBeenCalledWith(expect.objectContaining({ to: "ada@example.com", text: expect.stringContaining("/alumni/events/rsvp/confirm?token=") }));
  });

  it("moves a confirmed attendee to the waitlist when the capacity is reached", async () => {
    const pending = { id: "rsvp-2", guestCount: 0, requestedAttendance: "GOING", event: { ...futureEvent, rsvpCapacity: 1, waitlistEnabled: true } };
    const prisma = {
      schoolEventRsvp: {
        findFirst: jest.fn().mockResolvedValue(pending),
        findMany: jest.fn().mockResolvedValue([{ guestCount: 0 }]),
        update: jest.fn().mockResolvedValue({ id: "rsvp-2", email: "ada@example.com", fullName: "Ada Alumna", guestCount: 0, status: "WAITLISTED", requestedAttendance: "GOING", confirmedAt: new Date(), updatedAt: new Date() }),
      },
    } as any;
    const service = new SchoolEventRsvpService(prisma, { sendTextEmail: jest.fn().mockResolvedValue({ status: "SENT" }) } as any, config);

    await expect(service.confirm("confirmed-token")).resolves.toEqual(expect.objectContaining({ status: "WAITLISTED" }));
    expect(prisma.schoolEventRsvp.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: "WAITLISTED" }) }));
  });
});
