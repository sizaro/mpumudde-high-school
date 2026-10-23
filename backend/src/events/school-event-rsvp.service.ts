import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash, randomBytes } from "crypto";
import { PrismaService } from "../prisma/prisma.service.js";
import { SchoolEmailService } from "../communications/school-email.service.js";
import { CreateEventRsvpDto } from "./dto/create-event-rsvp.dto.js";
import { UpdateEventRsvpDto } from "./dto/update-event-rsvp.dto.js";

const CONFIRMATION_LIFETIME_MS = 60 * 60 * 1000;
const MANAGEMENT_LIFETIME_MS = 180 * 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
type Attendance = "GOING" | "MAYBE" | "DECLINED";

@Injectable()
export class SchoolEventRsvpService {
  constructor(private readonly prisma: PrismaService, private readonly email: SchoolEmailService, private readonly config: ConfigService) {}

  async request(slug: string, dto: CreateEventRsvpDto) {
    const event = await this.rsvpEvent(slug);
    const normalizedEmail = this.normalizeEmail(dto.email);
    const attendance = dto.attendance ?? "GOING";
    const alumni = await this.matchEligibleAlumnus(event, normalizedEmail);
    const existing = await this.prisma.schoolEventRsvp.findUnique({ where: { eventId_normalizedEmail: { eventId: event.id, normalizedEmail } } });
    if (existing && existing.status !== "PENDING_CONFIRMATION") {
      return { success: true, message: "This email already has a confirmed response for this event. Use the attendance-management link in the confirmation email if you need to change it." };
    }
    if (existing?.confirmationSentAt && existing.confirmationSentAt.getTime() > Date.now() - RESEND_COOLDOWN_MS) {
      throw new BadRequestException("A confirmation email was recently sent. Please check that inbox before requesting another one.");
    }
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + CONFIRMATION_LIFETIME_MS);
    const response = await this.prisma.schoolEventRsvp.upsert({
      where: { eventId_normalizedEmail: { eventId: event.id, normalizedEmail } },
      create: { eventId: event.id, alumniId: alumni?.id ?? null, fullName: dto.fullName.trim(), email: normalizedEmail, normalizedEmail, guestCount: dto.guestCount ?? 0, note: dto.note?.trim() || null, requestedAttendance: attendance, confirmationTokenHash: this.hash(token), confirmationExpiresAt: expiresAt, confirmationSentAt: new Date() },
      update: { alumniId: alumni?.id ?? null, fullName: dto.fullName.trim(), email: normalizedEmail, guestCount: dto.guestCount ?? 0, note: dto.note?.trim() || null, requestedAttendance: attendance, confirmationTokenHash: this.hash(token), confirmationExpiresAt: expiresAt, confirmationSentAt: new Date(), updatedAt: new Date() },
    });
    const confirmUrl = `${this.frontendUrl()}/alumni/events/rsvp/confirm?token=${encodeURIComponent(token)}`;
    const delivery = await this.email.sendTextEmail({ to: normalizedEmail, subject: `Confirm your attendance: ${event.title}`, text: ["Hello " + response.fullName + ",", "", `You selected ${attendance.toLowerCase()} for ${event.title}.`, "", "Confirm this attendance response:", confirmUrl, "", "This link expires in 60 minutes. If you did not submit this response, you can ignore this email.", ...(event.organiserEmail ? ["", `Planning contact: ${event.organiserEmail}`] : []), ...(event.whatsappGroupUrl ? [`Event updates: ${event.whatsappGroupUrl}`] : []), "", "Mpumudde High School"].join("\n") });
    if (delivery.status !== "SENT") throw new BadRequestException(delivery.error ?? "The confirmation email could not be sent. Please try again later.");
    return { success: true, message: "Check your email and confirm your attendance response. Your place is not recorded until you confirm." };
  }

  async confirm(token: string) {
    const item = await this.prisma.schoolEventRsvp.findFirst({ where: { confirmationTokenHash: this.hash(token), confirmationExpiresAt: { gt: new Date() }, status: "PENDING_CONFIRMATION" }, include: { event: true } });
    if (!item) throw new BadRequestException("This attendance confirmation link is invalid, expired, or has already been used.");
    const event = item.event;
    this.assertEventAcceptingResponses(event);
    let status = item.requestedAttendance;
    if (status === "GOING") {
      const capacity = event.rsvpCapacity;
      if (capacity) {
        const confirmed = await this.prisma.schoolEventRsvp.findMany({ where: { eventId: event.id, status: "GOING" }, select: { guestCount: true } });
        const people = confirmed.reduce((sum, row) => sum + row.guestCount + 1, 0);
        if (people + item.guestCount + 1 > capacity) {
          if (!event.waitlistEnabled) throw new BadRequestException("This event is now at capacity. The school is not accepting a waitlist for it.");
          status = "WAITLISTED";
        }
      }
    }
    const manageToken = randomBytes(32).toString("hex");
    const saved = await this.prisma.schoolEventRsvp.update({ where: { id: item.id }, data: { status, confirmedAt: new Date(), confirmationTokenHash: null, confirmationExpiresAt: null, manageTokenHash: this.hash(manageToken), manageTokenExpiresAt: new Date(Date.now() + MANAGEMENT_LIFETIME_MS) } });
    const manageUrl = `${this.frontendUrl()}/alumni/events/rsvp/manage?token=${encodeURIComponent(manageToken)}`;
    await this.email.sendTextEmail({ to: saved.email, subject: `Attendance recorded: ${event.title}`, text: ["Hello " + saved.fullName + ",", "", status === "WAITLISTED" ? `You are on the waitlist for ${event.title}.` : `Your response for ${event.title} is recorded as ${status.toLowerCase()}.`, "", "To review or change your response:", manageUrl, ...(event.organiserEmail ? ["", `Planning contact: ${event.organiserEmail}`] : []), ...(event.whatsappGroupUrl ? [`Event updates: ${event.whatsappGroupUrl}`] : []), "", "Mpumudde High School"].join("\n") });
    return { success: true, status, message: status === "WAITLISTED" ? "The event is full. Your confirmed response is on the waitlist." : "Your attendance response has been confirmed." };
  }

  async manage(token: string) { const item = await this.manageRecord(token); return this.safeRecord(item); }
  async updateManagedResponse(token: string, dto: UpdateEventRsvpDto) {
    const item = await this.manageRecord(token);
    const event = item.event;
    this.assertEventAcceptingResponses(event);
    const requestedAttendance = dto.attendance;
    const guestCount = dto.guestCount ?? item.guestCount;
    let status: string = requestedAttendance;
    if (requestedAttendance === "GOING" && event.rsvpCapacity) {
      const confirmed = await this.prisma.schoolEventRsvp.findMany({ where: { eventId: event.id, status: "GOING", id: { not: item.id } }, select: { guestCount: true } });
      const people = confirmed.reduce((sum, row) => sum + row.guestCount + 1, 0);
      if (people + guestCount + 1 > event.rsvpCapacity) {
        if (!event.waitlistEnabled) throw new BadRequestException("This event is now at capacity. The school is not accepting a waitlist for it.");
        status = "WAITLISTED";
      }
    }
    const saved = await this.prisma.schoolEventRsvp.update({ where: { id: item.id }, data: { requestedAttendance, status, guestCount, note: dto.note === undefined ? item.note : dto.note.trim() || null } });
    return this.safeRecord({ ...item, ...saved });
  }

  async forManagement(eventId: string) {
    const event = await this.prisma.schoolEvent.findUnique({ where: { id: eventId }, select: { id: true, title: true } });
    if (!event) throw new NotFoundException("School event not found.");
    const items = await this.prisma.schoolEventRsvp.findMany({ where: { eventId }, orderBy: { updatedAt: "desc" }, include: { alumni: { select: { id: true, fullName: true, profileImageUrl: true, graduationYear: true, isActive: true } } } });
    const counts = items.reduce<Record<string, number>>((result, item) => ({ ...result, [item.status]: (result[item.status] ?? 0) + 1 }), {});
    const peopleAttending = items.filter((item) => item.status === "GOING").reduce((total, item) => total + item.guestCount + 1, 0);
    return { event, counts, peopleAttending, items: items.map((item) => this.safeRecord(item)) };
  }

  private async rsvpEvent(slug: string) {
    const event = await this.prisma.schoolEvent.findFirst({ where: { slug, publicationStatus: "PUBLISHED", visibility: "PUBLIC", operationalStatus: "SCHEDULED", rsvpEnabled: true, audiences: { some: { audience: { in: ["ALUMNI", "WHOLE_SCHOOL"] } } } } });
    if (!event) throw new NotFoundException("This public event is unavailable for attendance responses.");
    this.assertEventAcceptingResponses(event);
    return event;
  }
  private async matchEligibleAlumnus(event: any, normalizedEmail: string) {
    if (event.rsvpMode !== "ALUMNI_ONLY") return null;
    const contact = await this.prisma.communicationContact.findFirst({ where: { ownerType: "ALUMNI", kind: "EMAIL", normalizedValue: normalizedEmail, isActive: true, isVerified: true }, select: { ownerId: true } });
    const alumnus = contact ? await this.prisma.alumni.findFirst({ where: { id: contact.ownerId, isActive: true }, select: { id: true } }) : null;
    if (!alumnus) throw new BadRequestException({ code: "ALUMNI_EMAIL_NOT_VERIFIED", message: "This email is not an active verified Mpumudde Alumni email." });
    return alumnus;
  }
  private async manageRecord(token: string) {
    const item = await this.prisma.schoolEventRsvp.findFirst({ where: { manageTokenHash: this.hash(token), manageTokenExpiresAt: { gt: new Date() } }, include: { event: true } });
    if (!item) throw new BadRequestException("This attendance-management link is invalid or expired.");
    return item;
  }
  private safeRecord(item: any) { return { id: item.id, fullName: item.fullName, email: item.email, status: item.status, requestedAttendance: item.requestedAttendance, guestCount: item.guestCount, note: item.note, confirmedAt: item.confirmedAt, updatedAt: item.updatedAt, alumni: item.alumni ? { id: item.alumni.id, fullName: item.alumni.fullName, profileImageUrl: item.alumni.profileImageUrl, graduationYear: item.alumni.graduationYear, isActive: item.alumni.isActive } : null, event: item.event ? { title: item.event.title, slug: item.event.slug, startsAt: item.event.startsAt, venue: item.event.venue } : undefined }; }
  private assertEventAcceptingResponses(event: any) { if (!event.rsvpEnabled || event.publicationStatus !== "PUBLISHED" || event.operationalStatus !== "SCHEDULED" || event.startsAt <= new Date()) throw new BadRequestException("This event is not accepting attendance responses."); if (event.rsvpDeadline && event.rsvpDeadline <= new Date()) throw new BadRequestException("The attendance response deadline has passed."); }
  private normalizeEmail(value: string) { const normalized = value.trim().toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new BadRequestException("Enter a valid email address."); return normalized; }
  private hash(value: string) { return createHash("sha256").update(value).digest("hex"); }
  private frontendUrl() { return (this.config.get<string>("FRONTEND_URL") || "http://localhost:5173").replace(/\/$/, ""); }
}
