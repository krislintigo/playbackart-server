import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './domain/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { serverConfig } from './server.config';
import { ItemService } from './domain/item/services/item.service';
import { ItemModule } from './domain/item/item.module';
import { ItemController } from './domain/item/item.controller';

@Module({
  imports: [
    MongooseModule.forRoot(serverConfig.db.link),
    AuthModule,
    ItemModule,
  ],
  controllers: [AppController, ItemController],
  providers: [AppService, ItemService],
})
export class AppModule {}
