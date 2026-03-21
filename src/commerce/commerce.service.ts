import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Commerce } from './commerce.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommerceService {
  private readonly logger = new Logger(CommerceService.name);

  constructor(
    @InjectModel(Commerce.name) private commerceModel: Model<Commerce>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findNearby(latitude: number, longitude: number, category?: string) {
    const query: any = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 100000,
        },
      },
    };

    if (category) {
      query.category = category;
    }

    return this.commerceModel.find(query).exec();
  }

  async findOneWithRating(id: string) {
    const commerce = await this.commerceModel.findById(id).exec();

    if (!commerce) {
      throw new NotFoundException(`Commerce not found: ${id}`);
    }

    const rating = await this.getFoodStarsRating(id);

    return {
      ...commerce.toObject(),
      rating,
    };
  }

  private async getFoodStarsRating(id: string): Promise<number | null> {
    try {
      const baseUrl = this.configService.get<string>('FOODSTARS_API_URL');

      const { data } = await firstValueFrom(
        this.httpService.get(`${baseUrl}/${id}/rating`, { timeout: 3000 }),
      );

      return data.rating;
    } catch (error) {
      this.logger.warn(`error getting ratting for the id: ${id}`);
      return null;
    }
  }
}
