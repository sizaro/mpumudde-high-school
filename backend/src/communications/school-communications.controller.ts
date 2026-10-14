import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { Roles } from "../common/decorators/roles.decorator.js";
import { CommunicationsService } from "./communications.service.js";
import { SendSchoolCommunicationDto } from "./dto/send-school-communication.dto.js";
import { SaveSchoolCommunicationDraftDto, SendSchoolCommunicationTestDto } from "./dto/save-school-communication-draft.dto.js";

type RequestUser = { id: string; roles?: string[] };

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("SUPER_ADMIN")
@Controller("communications")
export class SchoolCommunicationsController {
  constructor(private readonly communications: CommunicationsService) {}

  @Get("drafts")
  listDrafts(@CurrentUser() user: RequestUser) {
    return this.communications.listSchoolCommunicationDrafts(user);
  }

  @Post("drafts")
  saveDraft(@Body() dto: SaveSchoolCommunicationDraftDto, @CurrentUser() user: RequestUser) {
    return this.communications.saveSchoolCommunicationDraft(dto, user);
  }

  @Put("drafts/:id")
  updateDraft(@Param("id") id: string, @Body() dto: SaveSchoolCommunicationDraftDto, @CurrentUser() user: RequestUser) {
    return this.communications.saveSchoolCommunicationDraft(dto, user, id);
  }

  @Post("drafts/:id/send")
  sendDraft(@Param("id") id: string, @CurrentUser() user: RequestUser) {
    return this.communications.sendDraftSchoolCommunication(id, user);
  }

  @Post("preview-render")
  renderPreview(@Body() dto: SendSchoolCommunicationDto, @CurrentUser() user: RequestUser) {
    return this.communications.renderSchoolCommunicationPreview(dto, user);
  }

  @Post("test-email")
  testEmail(@Body() dto: SendSchoolCommunicationTestDto, @CurrentUser() user: RequestUser) {
    return this.communications.sendSchoolCommunicationTest(dto, user);
  }

  @Get()
  list() { return this.communications.listSchoolCommunications(); }

  @Get(":id")
  findOne(@Param("id") id: string) { return this.communications.getSchoolCommunication(id); }

  @Post("preview")
  preview(@Body() dto: SendSchoolCommunicationDto) { return this.communications.previewSchoolCommunication(dto); }

  @Post()
  send(@Body() dto: SendSchoolCommunicationDto, @CurrentUser() user: RequestUser) {
    return this.communications.sendSchoolCommunication(dto, user);
  }
}
