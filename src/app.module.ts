import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './domain/auth/auth.controller';
import { AuthService } from './domain/auth/services/auth.service';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
