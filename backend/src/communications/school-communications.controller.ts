import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CommunicationsService } from './communications.service.js';
import { SendSchoolCommunicationDto } from './dto/send-school-communication.dto.js';

type RequestUser = { id: string; roles?: string[] };

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('communications')
export class SchoolCommunicationsController {
  constructor(private readonly communications: CommunicationsService) {}

  @Get()
  list() {
    return this.communications.listSchoolCommunications();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.communications.getSchoolCommunication(id);
  }

  @Post('preview')
  preview(@Body() dto: SendSchoolCommunicationDto) {
    return this.communications.previewSchoolCommunication(dto);
  }

  @Post()
  send(@Body() dto: SendSchoolCommunicationDto, @CurrentUser() user: RequestUser) {
    return this.communications.sendSchoolCommunication(dto, user);
  }
}
