import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Commerce extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: ['SHOPPING', 'CAFE', 'PUB'] })
  category: string;

  @Prop({
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [longitud, latitud]
  })
  location: Record<string, any>;
}

export const CommerceSchema = SchemaFactory.createForClass(Commerce);

// index for the search
CommerceSchema.index({ location: '2dsphere' });
