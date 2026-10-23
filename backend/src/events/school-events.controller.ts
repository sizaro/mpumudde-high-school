import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { Permissions } from "../common/decorators/permissions.decorator.js";
import { SchoolEventsService } from "./school-events.service.js";
import { CreateSchoolEventDto } from "./dto/create-school-event.dto.js";
import { UpdateSchoolEventDto } from "./dto/update-school-event.dto.js";
import { EventDecisionDto } from "./dto/event-decision.dto.js";
import { CreateEventRsvpDto } from "./dto/create-event-rsvp.dto.js";
import { UpdateEventRsvpDto } from "./dto/update-event-rsvp.dto.js";
import { SchoolEventRsvpService } from "./school-event-rsvp.service.js";

@Controller("events")
export class PublicSchoolEventsController {
  constructor(private readonly events: SchoolEventsService, private readonly rsvpService: SchoolEventRsvpService) {}
  @Get("alumni") list(@Query("page") page?: string, @Query("pageSize") pageSize?: string) { return this.events.listPublicAlumniEvents(Number(page) || 1, Number(pageSize) || 9); }
  @Get("alumni/:slug") get(@Param("slug") slug: string) { return this.events.getPublicAlumniEvent(slug); }
  @Post("alumni/:slug/rsvp") requestRsvp(@Param("slug") slug: string, @Body() dto: CreateEventRsvpDto) { return this.rsvpService.request(slug, dto); }
  @Post("rsvp/confirm") confirmRsvp(@Body("token") token: string) { return this.rsvpService.confirm(token); }
  @Get("rsvp/manage") manageRsvp(@Query("token") token: string) { return this.rsvpService.manage(token); }
  @Patch("rsvp/manage") updateRsvp(@Query("token") token: string, @Body() dto: UpdateEventRsvpDto) { return this.rsvpService.updateManagedResponse(token, dto); }
}

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("director/events")
export class DirectorSchoolEventsController {
  constructor(private readonly events: SchoolEventsService, private readonly rsvpService: SchoolEventRsvpService) {}
  @Get() @Permissions("content.events.view") list() { return this.events.listForManagement(); }
  @Get(":id") @Permissions("content.events.view") get(@Param("id") id: string) { return this.events.getForManagement(id); }
  @Get(":id/history") @Permissions("content.events.view") history(@Param("id") id: string) { return this.events.listChanges(id); }
  @Get(":id/rsvps") @Permissions("content.events.view") rsvps(@Param("id") id: string) { return this.rsvpService.forManagement(id); }
  @Post() @Permissions("content.events.manage") create(@Body() dto: CreateSchoolEventDto, @CurrentUser() user: { id: string }) { return this.events.create(dto, user); }
  @Patch(":id") @Permissions("content.events.manage") update(@Param("id") id: string, @Body() dto: UpdateSchoolEventDto, @CurrentUser() user: { id: string }) { return this.events.update(id, dto, user); }
  @Post(":id/publish") @Permissions("content.events.publish") publish(@Param("id") id: string, @CurrentUser() user: { id: string }) { return this.events.publish(id, user); }
  @Post(":id/unpublish") @Permissions("content.events.publish") unpublish(@Param("id") id: string, @CurrentUser() user: { id: string }) { return this.events.unpublish(id, user); }
  @Post(":id/archive") @Permissions("content.events.publish") archive(@Param("id") id: string, @CurrentUser() user: { id: string }) { return this.events.archive(id, user); }
  @Delete(":id") @Permissions("content.events.manage") deleteDraft(@Param("id") id: string) { return this.events.deleteDraft(id); }
  @Post(":id/postpone") @Permissions("content.events.manage") postpone(@Param("id") id: string, @Body() dto: EventDecisionDto, @CurrentUser() user: { id: string }) { return this.events.postpone(id, dto, user); }
  @Post(":id/reschedule") @Permissions("content.events.manage") reschedule(@Param("id") id: string, @Body() dto: EventDecisionDto, @CurrentUser() user: { id: string }) { return this.events.reschedule(id, dto, user); }
  @Post(":id/cancel") @Permissions("content.events.manage") cancel(@Param("id") id: string, @Body() dto: EventDecisionDto, @CurrentUser() user: { id: string }) { return this.events.cancel(id, dto, user); }
  @Post(":id/complete") @Permissions("content.events.manage") complete(@Param("id") id: string, @Body() dto: EventDecisionDto, @CurrentUser() user: { id: string }) { return this.events.complete(id, dto, user); }
}
