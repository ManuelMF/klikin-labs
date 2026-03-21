import { Test, TestingModule } from '@nestjs/testing';
import { CommerceController } from './commerce.controller';
import { CommerceService } from './commerce.service';

describe('CommerceController', () => {
  let controller: CommerceController;
  let service: CommerceService;

  const mockCommerceService = {
    findNearby: jest.fn(),
    findOneWithRating: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommerceController],
      providers: [
        {
          provide: CommerceService,
          useValue: mockCommerceService,
        },
      ],
    }).compile();

    controller = module.get<CommerceController>(CommerceController);
    service = module.get<CommerceService>(CommerceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCommerces', () => {
    it('should call getComerces with the rigth params', async () => {
      const mockDto = {
        latitude: 40.4167,
        longitude: -3.7037,
        category: 'CAFE',
      };
      const expectedResult = [{ name: 'Cafe Ramon' }];

      mockCommerceService.findNearby.mockResolvedValue(expectedResult);

      const result = await controller.getCommerces(mockDto);

      expect(service.findNearby).toHaveBeenCalledWith(40.4167, -3.7037, 'CAFE');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getCommerceById', () => {
    it('should call findOneWithRating of the service', async () => {
      const mockId = '12345';
      const expectedResult = { name: 'Pub Manacor', rating: 4.5 };

      mockCommerceService.findOneWithRating.mockResolvedValue(expectedResult);

      const result = await controller.getCommerceById(mockId);

      expect(service.findOneWithRating).toHaveBeenCalledWith(mockId);
      expect(result).toEqual(expectedResult);
    });
  });
});
