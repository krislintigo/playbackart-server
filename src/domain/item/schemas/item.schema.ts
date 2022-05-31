import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ItemDocument = Item & Document;

export type Time = {
  count: number;
  duration: number;
};

const Time: Time = {
  count: 0,
  duration: 0,
};

@Schema()
export class Item {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
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

  @Prop({ type: [Time] })
  time: Time;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
