// src/app.module.ts
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { AuthModule } from './presentation/auth/auth.module';
import { ProfileModule } from './presentation/profile/profile.module';

@Module({
  imports: [AuthModule, ProfileModule],
  controllers: [AppController],
  providers: [
    PrismaService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
