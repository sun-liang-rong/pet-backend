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
import { ActivitiesService } from './activities.service';
import {
  CreateActivityDto,
  UpdateActivityDto,
  ActivityQueryDto,
} from './dto/activity.dto';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @Get()
  findAll(@Query() query: ActivityQueryDto) {
    return this.activitiesService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.activitiesService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(+id, updateActivityDto);
  }

  @Post(':id/join')
  join(@Param('id') id: string) {
    return this.activitiesService.incrementParticipants(+id);
  }

  @Post(':id/leave')
  leave(@Param('id') id: string) {
    return this.activitiesService.decrementParticipants(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(+id);
  }
}
