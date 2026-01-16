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
import { DonationsService } from './donations.service';
import {
  CreateDonationDto,
  UpdateDonationDto,
  DonationQueryDto,
} from './dto/donation.dto';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }

  @Get()
  findAll(@Query() query: DonationQueryDto) {
    return this.donationsService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.donationsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDonationDto: UpdateDonationDto,
  ) {
    return this.donationsService.update(+id, updateDonationDto);
  }

  @Post(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.donationsService.confirm(+id);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.donationsService.cancel(+id);
  }

  @Post(':id/receipt')
  issueReceipt(@Param('id') id: string) {
    return this.donationsService.issueReceipt(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.donationsService.remove(+id);
  }
}
