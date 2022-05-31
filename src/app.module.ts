import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './domain/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { serverConfig } from './server.config';
import { ItemModule } from './domain/item/item.module';

@Module({
  imports: [
    MongooseModule.forRoot(serverConfig.db.link),
    AuthModule,
    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
