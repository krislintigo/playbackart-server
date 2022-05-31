import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ItemDocument = Item & Document;

export type Time = {
  count: number;
  duration: number;
};

@Schema()
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;

  @Prop()
  rating: number;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  type: string;

  @Prop()
  restriction: string;

  @Prop()
  genres: string[];

  @Prop()
  time: Time;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
