import { Controller, Get, Query, Param } from '@nestjs/common';
import { CommerceService } from './commerce.service';
import { GetCommercesDto } from './dto/get-commerces.dto';

@Controller()
export class CommerceController {
  constructor(private readonly commerceService: CommerceService) {}

  @Get()
  async getCommerces(@Query() query: GetCommercesDto) {
    return this.commerceService.findNearby(
      query.latitude,
      query.longitude,
      query.category,
    );
  }

  @Get(':id')
  async getCommerceById(@Param('id') id: string) {
    return this.commerceService.findOneWithRating(id);
  }
}
