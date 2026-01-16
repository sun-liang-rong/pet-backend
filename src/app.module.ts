import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PetsModule } from './pets/pets.module';
import { RescuesModule } from './rescues/rescues.module';
import { AdoptionsModule } from './adoptions/adoptions.module';
import { AdoptionRecordsModule } from './adoption-records/adoption-records.module';
import { VolunteersModule } from './volunteers/volunteers.module';
import { ActivitiesModule } from './activities/activities.module';
import { DonationsModule } from './donations/donations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import {
  User,
  Pet,
  Adoption,
  AdoptionRecord,
  Rescue,
  Activity,
  Volunteer,
  Donation,
  Notification,
} from './entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_DATABASE'),
        autoLoadEntities: true,
        entities: [
          User,
          Pet,
          Adoption,
          AdoptionRecord,
          Rescue,
          Activity,
          Volunteer,
          Donation,
          Notification,
        ],
        synchronize: config.get('NODE_ENV') === 'development',
        logging: config.get('NODE_ENV') === 'development',
      }),
    }),
    AuthModule,
    UsersModule,
    PetsModule,
    RescuesModule,
    AdoptionsModule,
    AdoptionRecordsModule,
    VolunteersModule,
    ActivitiesModule,
    DonationsModule,
    NotificationsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// trigger restart
export class AppModule {}
