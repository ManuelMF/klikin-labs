import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from './app.module';
import { Commerce } from './commerce/commerce.schema';

const seedCommerces = [
  {
    name: 'Cafeteria Ramon',
    description: 'Cafeteria estandar en el centro',
    category: 'CAFE',
    location: { type: 'Point', coordinates: [-3.70379, 40.416775] },
  },
  {
    name: 'Pub Manacor',
    description: 'Cerveceria artesanal desde 1950',
    category: 'PUB',
    location: { type: 'Point', coordinates: [-3.63509, 40.54015] },
  },
  {
    name: 'Festival Park',
    description: 'Consigue lo que necesitas al mejor precio',
    category: 'SHOPPING',
    location: { type: 'Point', coordinates: [-4.027323, 39.862832] },
  },
  {
    name: 'Cafeteria el serrano',
    description: 'El mejor cafe de la ciudad',
    category: 'CAFE',
    location: { type: 'Point', coordinates: [2.173404, 41.385064] },
  },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const commerceModel = app.get<Model<Commerce>>(getModelToken(Commerce.name));

  try {
    await commerceModel.deleteMany({});
    await commerceModel.insertMany(seedCommerces);

    console.log(`Commerces inserted`);
  } catch (error) {
    console.error('error seending:', error);
  } finally {
    await app.close();
    process.exit();
  }
}

bootstrap();
