import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CommunicationsService } from './communications.service.js';
import { CreateCommunicationContactDto } from './dto/create-communication-contact.dto.js';
import { VerifyCommunicationContactDto } from './dto/verify-communication-contact.dto.js';
import { RequestRegistrationEmailVerificationDto } from './dto/request-registration-email-verification.dto.js';
import { ConfirmRegistrationEmailVerificationDto } from './dto/confirm-registration-email-verification.dto.js';

type RequestUser = { id: string; roles?: string[] };

@UseGuards(JwtAuthGuard)
@Controller('communications/contacts')
export class CommunicationsController {
  constructor(private readonly communications: CommunicationsService) {}

  @Get('me')
  listMine(@CurrentUser() user: RequestUser) {
    return this.communications.listMyContacts(user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  listForOwner(
    @Query('ownerType') ownerType: 'PARENT' | 'TEACHER' | 'STUDENT' | 'ALUMNI',
    @Query('ownerId') ownerId: string,
    @CurrentUser() user: RequestUser,
  ) {
    return this.communications.listForOwner(ownerType, ownerId, user);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  create(@Body() dto: CreateCommunicationContactDto, @CurrentUser() user: RequestUser) {
    return this.communications.createContact(dto, user);
  }

  @Post('registration-email-verifications/request')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  requestRegistrationEmailVerification(
    @Body() dto: RequestRegistrationEmailVerificationDto,
  ) {
    return this.communications.requestRegistrationEmailVerification(
      dto.ownerType,
      dto.email,
    );
  }

  @Post('registration-email-verifications/:id/confirm')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN')
  confirmRegistrationEmailVerification(
    @Param('id') id: string,
    @Body() dto: ConfirmRegistrationEmailVerificationDto,
  ) {
    return this.communications.confirmRegistrationEmailVerification(id, dto.code);
  }

  @Post(':id/request-verification')
  requestVerification(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.communications.requestVerification(id, user);
  }

  @Post(':id/confirm-verification')
  confirmVerification(
    @Param('id') id: string,
    @Body() dto: VerifyCommunicationContactDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.communications.confirmVerification(id, dto.code, user);
  }
}
