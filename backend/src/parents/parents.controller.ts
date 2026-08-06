import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ParentsService } from "./parents.service.js";
import { CreateParentDto } from "./dto/create-parent.dto.js";
import { UpdateParentDto } from "./dto/update-parent.dto.js";
import { CreateParentPortalAccountDto } from "./dto/create-parent-portal-account.dto.js";
import { LinkParentStudentDto } from "./dto/link-parent-student.dto.js";
import { UpdateParentAccountStatusDto } from "./dto/update-parent-account-status.dto.js";
import { GuardianDocumentDto } from "./dto/guardian-document.dto.js";
import { UnlinkParentStudentDto } from "./dto/unlink-parent-student.dto.js";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { RolesGuard } from "../auth/guards/roles.guard.js";
import { Roles } from "../common/decorators/roles.decorator.js";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("parents")
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  @Roles("SUPER_ADMIN")
  create(@Req() req: any, @Body() createParentDto: CreateParentDto) {
    return this.parentsService.create(createParentDto, req.user.id);
  }

  @Get()
  @Roles("SUPER_ADMIN")
  findAll() {
    return this.parentsService.findAll();
  }

  @Get("me")
  @Roles("PARENT")
  findMe(@Req() req: any) {
    return this.parentsService.findByUserId(req.user.id);
  }

  @Get("me/children")
  @Roles("PARENT")
  findMyChildren(@Req() req: any) {
    return this.parentsService.findByUserId(req.user.id);
  }

  @Get("me/dashboard")
  @Roles("PARENT")
  getDashboard(@Req() req: any, @Query("studentId") studentId?: string) {
    return this.parentsService.getDashboard(req.user.id, studentId);
  }

  @Get("me/children/:studentId/attendance")
  @Roles("PARENT")
  getChildAttendance(
    @Req() req: any,
    @Param("studentId") studentId: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string,
    @Query("subjectId") subjectId?: string,
  ) {
    return this.parentsService.getChildAttendance(req.user.id, studentId, {
      startDate,
      endDate,
      subjectId,
    });
  }

  @Get("me/finance")
  @Roles("PARENT")
  getMyFinance(@Req() req: any) {
    return this.parentsService.getMyFinance(req.user.id);
  }

  @Get(":id")
  @Roles("SUPER_ADMIN")
  findOne(@Param("id") id: string) {
    return this.parentsService.findOne(id);
  }

  @Patch("me")
  @Roles("PARENT")
  updateMyProfile(@Req() req: any, @Body() updateParentDto: UpdateParentDto) {
    return this.parentsService.updateMyProfile(req.user.id, updateParentDto);
  }

  @Patch(":id")
  @Roles("SUPER_ADMIN")
  update(@Param("id") id: string, @Body() updateParentDto: UpdateParentDto) {
    return this.parentsService.updateById(id, updateParentDto);
  }

  @Put(":id/complete")
  @Roles("SUPER_ADMIN")
  updateComplete(
    @Req() req: any,
    @Param("id") id: string,
    @Body() dto: CreateParentDto,
  ) {
    return this.parentsService.updateComplete(id, dto, req.user.id);
  }

  @Post(":id/students")
  @Roles("SUPER_ADMIN")
  linkStudent(@Param("id") id: string, @Body() dto: LinkParentStudentDto) {
    return this.parentsService.linkStudent(id, dto);
  }

  @Delete(":id/students/:studentId")
  @Roles("SUPER_ADMIN")
  unlinkStudent(
    @Req() req: any,
    @Param("id") id: string,
    @Param("studentId") studentId: string,
    @Body() dto: UnlinkParentStudentDto,
  ) {
    return this.parentsService.unlinkStudent(
      id,
      studentId,
      req.user.id,
      dto.reason,
    );
  }

  @Post(":id/documents")
  @Roles("SUPER_ADMIN")
  addDocument(
    @Req() req: any,
    @Param("id") id: string,
    @Body() dto: GuardianDocumentDto,
  ) {
    return this.parentsService.addDocument(id, dto, req.user.id);
  }

  @Delete(":id/documents/:documentId")
  @Roles("SUPER_ADMIN")
  removeDocument(
    @Param("id") id: string,
    @Param("documentId") documentId: string,
  ) {
    return this.parentsService.removeDocument(id, documentId);
  }

  @Post(":id/portal-account")
  @Roles("SUPER_ADMIN")
  createPortalAccount(
    @Param("id") id: string,
    @Body() dto: CreateParentPortalAccountDto,
  ) {
    return this.parentsService.createPortalAccount(id, dto.loginEmail);
  }

  @Post(":id/reset-password")
  @Roles("SUPER_ADMIN")
  resetPassword(
    @Param("id") id: string,
    @Body() dto: CreateParentPortalAccountDto,
  ) {
    return this.parentsService.resetPortalPassword(id, dto.loginEmail);
  }

  @Patch(":id/account-status")
  @Roles("SUPER_ADMIN")
  updateAccountStatus(
    @Param("id") id: string,
    @Body() dto: UpdateParentAccountStatusDto,
  ) {
    return this.parentsService.updatePortalStatus(id, dto.isActive);
  }

  @Delete(":id")
  @Roles("SUPER_ADMIN")
  remove(@Req() req: any, @Param("id") id: string) {
    return this.parentsService.remove(id, req.user.id);
  }
}
