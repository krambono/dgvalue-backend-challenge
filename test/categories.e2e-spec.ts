import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Knex } from 'knex';
import {
  CategoryClosureEntity,
  categoryClosureTableName
} from 'src/adapters/secondary/sqlite/entities/category-closure.entity';
import { CategoryEntity, categoryTableName } from 'src/adapters/secondary/sqlite/entities/category.entity';
import { clearTables, migrateToLatest } from 'src/adapters/secondary/sqlite/utils';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { StubDateProvider } from '../src/adapters/secondary/date-provider/stub-date-provider';
import { createDate } from '../src/shared/create-date';
import { VolumeEntity, volumeTableName } from '../src/adapters/secondary/sqlite/entities/volume.entity';
import { addMonths, subYears } from 'date-fns';

describe('Categories (e2e)', () => {
  let app: INestApplication;
  const now = createDate('01/04/2022');

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider('DATE_PROVIDER')
      .useValue(new StubDateProvider(now))
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await initializeDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/categories GET should retrieve all categories', async () => {
    const { status, body } = await request(app.getHttpServer()).get('/categories');
    expect(status).toBe(200);
    expect(body).toEqual([
      {
        id: 1,
        name: 'Animals',
        ancestors: [],
        children: [
          { id: 2, name: 'Dogs' },
          { id: 4, name: 'Cats' },
          { id: 6, name: 'Horses' }
        ]
      },
      { id: 2, name: 'Dogs', ancestors: [{ id: 1, name: 'Animals' }], children: [{ id: 3, name: 'Bulldog' }] },
      {
        id: 3,
        ancestors: [
          { id: 1, name: 'Animals' },
          { id: 2, name: 'Dogs' }
        ],
        name: 'Bulldog'
      },
      { id: 4, name: 'Cats', ancestors: [{ id: 1, name: 'Animals' }], children: [{ id: 5, name: 'Bengal cat' }] },
      {
        id: 5,
        ancestors: [
          { id: 1, name: 'Animals' },
          { id: 4, name: 'Cats' }
        ],
        name: 'Bengal cat'
      },
      { id: 6, name: 'Horses', ancestors: [{ id: 1, name: 'Animals' }] }
    ]);
  });

  it('/categories/:id GET should have a not found error if given category does not exist', async () => {
    const { status, body } = await request(app.getHttpServer()).get('/categories/42');
    expect(status).toBe(404);
    expect(body.message).toBe('Category not found');
  });

  it('/categories/:id GET should retrieve a category with its search volume average over the last 24  months', async () => {
    const { status, body } = await request(app.getHttpServer()).get('/categories/1');
    expect(status).toBe(200);
    expect(body).toStrictEqual({ category: { id: 1, name: 'Animals' }, averageMonthlyVolume: 80 });
  });

  async function initializeDatabase() {
    const knex = await app.resolve<Knex>('KNEX');
    await migrateToLatest(knex);
    await clearTables(knex);
    await knex<CategoryEntity>(categoryTableName).insert([
      { id: 1, name: 'Animals' },
      { id: 2, name: 'Dogs', parent_id: 1 },
      { id: 3, name: 'Bulldog', parent_id: 2 },
      { id: 4, name: 'Cats', parent_id: 1 },
      { id: 5, name: 'Bengal cat', parent_id: 4 },
      { id: 6, name: 'Horses', parent_id: 1 }
    ]);
    await knex<CategoryClosureEntity>(categoryClosureTableName).insert([
      { ancestor_id: 1, descendant_id: 1 },
      { ancestor_id: 1, descendant_id: 2 },
      { ancestor_id: 1, descendant_id: 3 },
      { ancestor_id: 1, descendant_id: 4 },
      { ancestor_id: 1, descendant_id: 5 },
      { ancestor_id: 1, descendant_id: 6 },
      { ancestor_id: 2, descendant_id: 2 },
      { ancestor_id: 2, descendant_id: 3 },
      { ancestor_id: 3, descendant_id: 3 },
      { ancestor_id: 4, descendant_id: 4 },
      { ancestor_id: 4, descendant_id: 5 },
      { ancestor_id: 5, descendant_id: 5 },
      { ancestor_id: 6, descendant_id: 6 }
    ]);

    await knex<VolumeEntity>(volumeTableName).insert(createVolumes());
  }

  function createVolumes() {
    const day2YearsBefore = subYears(now, 2);
    let date = day2YearsBefore;
    const volumes: VolumeEntity[] = [];
    while (date < now) {
      volumes.push({ category_id: 3, date: date.toISOString(), volume: 30 });
      volumes.push({ category_id: 5, date: date.toISOString(), volume: 50 });
      date = addMonths(date, 1);
    }
    return volumes;
  }
});
