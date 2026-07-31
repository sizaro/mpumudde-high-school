import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ParentsService } from './parents.service.js';
import { CreateParentDto } from './dto/create-parent.dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Body() createParentDto: CreateParentDto) {
    return this.parentsService.create(createParentDto);
  }

  @Get()
  @Roles('SUPER_ADMIN')
  findAll() {
    return this.parentsService.findAll();
  }

  @Get('me')
  @Roles('PARENT')
  findMe(@Req() req: any) {
    return this.parentsService.findByUserId(req.user.id);
  }

  @Get('me/children')
  @Roles('PARENT')
  findMyChildren(@Req() req: any) {
    return this.parentsService.findByUserId(req.user.id);
  }

  @Get('me/dashboard')
  @Roles('PARENT')
  getDashboard(@Req() req: any, @Query('studentId') studentId?: string) {
    return this.parentsService.getDashboard(req.user.id, studentId);
  }

  @Get(':id')
  @Roles('SUPER_ADMIN')
  findOne(@Param('id') id: string) {
    return this.parentsService.findOne(id);
  }

  @Patch('me')
  @Roles('PARENT')
  updateMyProfile(@Req() req: any, @Body() updateParentDto: UpdateParentDto) {
    return this.parentsService.update(req.user.id, updateParentDto);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN')
  update(@Param('id') id: string, @Body() updateParentDto: UpdateParentDto) {
    return this.parentsService.update(id, updateParentDto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  remove(@Param('id') id: string) {
    return this.parentsService.remove(id);
  }
}
