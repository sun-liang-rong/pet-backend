import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { VolunteersService } from './volunteers.service';
import {
  CreateVolunteerDto,
  UpdateVolunteerDto,
  VolunteerQueryDto,
} from './dto/volunteer.dto';

@Controller('volunteers')
export class VolunteersController {
  constructor(private readonly volunteersService: VolunteersService) {}

  @Post()
  create(@Body() createVolunteerDto: CreateVolunteerDto) {
    return this.volunteersService.create(createVolunteerDto);
  }

  @Get()
  findAll(@Query() query: VolunteerQueryDto) {
    return this.volunteersService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.volunteersService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.volunteersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVolunteerDto: UpdateVolunteerDto,
  ) {
    return this.volunteersService.update(+id, updateVolunteerDto);
  }

  @Post(':id/hours')
  incrementHours(@Param('id') id: string, @Body() body: { hours: number }) {
    return this.volunteersService.incrementHours(+id, body.hours);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.volunteersService.remove(+id);
  }
}
