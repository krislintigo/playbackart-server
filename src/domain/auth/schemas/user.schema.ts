import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Item } from '../../item/schemas/item.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [] })
  items: Item[];

  @Prop({ default: '' })
  watching: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
