import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard.js";
import { PermissionsGuard } from "../auth/guards/permissions.guard.js";
import { CurrentUser } from "../common/decorators/current-user.decorator.js";
import { Permissions } from "../common/decorators/permissions.decorator.js";
import { SchoolPublicationsService } from "./school-publications.service.js";
import { CreateSchoolPublicationDto } from "./dto/create-school-publication.dto.js";
import { UpdateSchoolPublicationDto } from "./dto/update-school-publication.dto.js";

@Controller("publications")
export class PublicSchoolPublicationsController {
  constructor(private readonly publications: SchoolPublicationsService) {}
  @Get("alumni-stories") list(@Query("page") page?: string, @Query("pageSize") pageSize?: string, @Query("featured") featured?: string) {
    return this.publications.listPublicAlumniStories(Number(page) || 1, Number(pageSize) || 9, featured === undefined ? undefined : featured === "true");
  }
  @Get("alumni-stories/:slug") get(@Param("slug") slug: string) { return this.publications.getPublicAlumniStory(slug); }
}

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller("director/publications")
export class DirectorSchoolPublicationsController {
  constructor(private readonly publications: SchoolPublicationsService) {}
  @Get() @Permissions("content.publications.view") list() { return this.publications.listForManagement(); }
  @Get(":id") @Permissions("content.publications.view") get(@Param("id") id: string) { return this.publications.getForManagement(id); }
  @Post() @Permissions("content.publications.manage") create(@Body() dto: CreateSchoolPublicationDto, @CurrentUser() user: { id: string }) { return this.publications.create(dto, user); }
  @Patch(":id") @Permissions("content.publications.manage") update(@Param("id") id: string, @Body() dto: UpdateSchoolPublicationDto, @CurrentUser() user: { id: string }) { return this.publications.update(id, dto, user); }
  @Post(":id/review") @Permissions("content.publications.manage") review(@Param("id") id: string) { return this.publications.moveToReview(id); }
  @Post(":id/publish") @Permissions("content.publications.publish") publish(@Param("id") id: string) { return this.publications.publish(id); }
  @Post(":id/unpublish") @Permissions("content.publications.publish") unpublish(@Param("id") id: string) { return this.publications.unpublish(id); }
  @Post(":id/archive") @Permissions("content.publications.publish") archive(@Param("id") id: string) { return this.publications.archive(id); }
  @Delete(":id") @Permissions("content.publications.manage") deleteDraft(@Param("id") id: string) { return this.publications.deleteDraft(id); }
}
