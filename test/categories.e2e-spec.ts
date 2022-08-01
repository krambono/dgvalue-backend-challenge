import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Knex } from 'knex';
import { CategoryEntity } from 'src/adapters/secondary/sqlite/entities/category.entity';
import { clearTables, migrateToLatest } from 'src/adapters/secondary/sqlite/utils';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Categories (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await initializeDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/categories GET should retrieve all categories', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(200, [
        { id: 1, name: 'Dogs' },
        { id: 2, name: 'Bulldog' }
      ])
      .expect(res => Array.isArray(res.body));
  });

  async function initializeDatabase() {
    const knex = await app.resolve<Knex>('KNEX');
    await migrateToLatest(knex);
    await clearTables(knex);
    await knex<CategoryEntity>('categories').insert([
      { id: 1, name: 'Dogs' },
      { id: 2, name: 'Bulldog', parent_id: 1 }
    ]);
  }
});
