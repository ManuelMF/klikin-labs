import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { CommerceService } from './commerce.service';
import { Commerce } from './commerce.schema';

describe('CommerceService', () => {
  let service: CommerceService;
  let httpService: HttpService;

  const mockCommerce = {
    _id: '123',
    name: 'Cafeteria Ramon',
    toObject: jest.fn().mockReturnValue({ name: 'Cafeteria Ramon' }),
  };

  const mockCommerceModel = {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockCommerce]),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockCommerce),
    }),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'FOODSTARS_API_URL') return 'http://mockapi.com';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommerceService,
        { provide: getModelToken(Commerce.name), useValue: mockCommerceModel },
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<CommerceService>(CommerceService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findNearby', () => {
    it('should get a list of commercies', async () => {
      const result = await service.findNearby(40.41, -3.7);
      expect(result).toEqual([mockCommerce]);
      expect(mockCommerceModel.find).toHaveBeenCalled();
    });
  });

  describe('findOneWithRating', () => {
    it('should get the comerce with the rating', async () => {
      mockHttpService.get.mockReturnValueOnce(of({ data: { rating: 4.5 } }));

      const result = await service.findOneWithRating('123');

      expect(result).toEqual({ name: 'Cafeteria Ramon', rating: 4.5 });
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://mockapi.com/123/rating',
        { timeout: 3000 },
      );
    });

    it('should get the comerce with the rating null if the api call get an error', async () => {
      mockHttpService.get.mockReturnValueOnce(
        throwError(() => new Error('API Error')),
      );

      const result = await service.findOneWithRating('123');

      expect(result).toEqual({ name: 'Cafeteria Ramon', rating: null });
    });

    it('should throw NotFoundException if the comerce not exist in the DDBB', async () => {
      mockCommerceModel.findById.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOneWithRating('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
