import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RescuesService } from './rescues.service';
import { RescuesController } from './rescues.controller';
import { Rescue } from '../entities/rescue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rescue])],
  controllers: [RescuesController],
  providers: [RescuesService],
  exports: [RescuesService],
})
export class RescuesModule {}
