import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TimeDto } from '../dtos/time.dto';

export type ItemDocument = Item & Document;

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

  @Prop({ type: [TimeDto] })
  time: TimeDto;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
