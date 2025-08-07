import { Module } from '@nestjs/common';
import { AuthModule } from '../../backend/src/modules/auth/';

@Module({
  imports: [AuthModule],
})
export class AppModule {}