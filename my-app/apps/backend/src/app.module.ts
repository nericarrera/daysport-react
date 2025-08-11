import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../src/modules/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
})
export class AppModule {}