import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CommerceController } from './commerce.controller';
import { CommerceService } from './commerce.service';
import { Commerce, CommerceSchema } from './commerce.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Commerce.name, schema: CommerceSchema },
    ]),
    HttpModule,
  ],
  controllers: [CommerceController],
  providers: [CommerceService],
})
export class CommerceModule {}
