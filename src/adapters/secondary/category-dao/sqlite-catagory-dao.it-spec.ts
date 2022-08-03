import { Knex } from 'knex';
import { clearTables, getKnexConnection, migrateToLatest } from '../sqlite/utils';
import { SqliteCategoryDao } from './sqlite-category-dao';
import { CategoryEntity, categoryTableName } from '../sqlite/entities/category.entity';
import { CategoryClosureEntity, categoryClosureTableName } from '../sqlite/entities/category-closure.entity';
import { VolumeEntity, volumeTableName } from '../sqlite/entities/volume.entity';
import { createDate } from 'src/shared/create-date';

describe('Sqlite category dao integration tests', () => {
  let knex: Knex;
  let categoryDao: SqliteCategoryDao;

  beforeAll(async () => {
    knex = getKnexConnection();
    await migrateToLatest(knex);
    categoryDao = new SqliteCategoryDao(knex);
  });

  beforeEach(async () => {
    await clearTables(knex);
  });

  afterAll(async () => {
    await knex.destroy();
  });

  it('should not find any categories if there are none', async () => {
    const categories = await categoryDao.findMany();

    expect(categories).toEqual([]);
  });

  it('should find many categories', async () => {
    await insertCategories();

    const categories = await categoryDao.findMany();
    expect(categories).toEqual([
      { id: 1, name: 'Products', ancestors: [], children: [{ id: 2, name: 'Spread' }] },
      {
        id: 2,
        name: 'Spread',
        ancestors: [{ id: 1, name: 'Products' }],
        children: [
          { id: 3, name: 'Jam' },
          { id: 4, name: 'Honey' }
        ]
      },
      {
        id: 3,
        name: 'Jam',
        ancestors: [
          { id: 1, name: 'Products' },
          { id: 2, name: 'Spread' }
        ]
      },
      {
        id: 4,
        name: 'Honey',
        ancestors: [
          { id: 1, name: 'Products' },
          { id: 2, name: 'Spread' }
        ]
      }
    ]);
  });

  it('should find nothing if given category does not exist', async () => {
    await insertCategories();

    expect(await categoryDao.getCategoryWithAverageSearchVolume(18, createDate('01/01/2022'), 24)).toBeUndefined();
  });

  it('should find the average search volume for a given leaf category', async () => {
    await insertCategories();
    await insertVolumes();

    expect(await categoryDao.getCategoryWithAverageSearchVolume(3, createDate('01/01/2022'), 2)).toStrictEqual({
      category: { id: 3, name: 'Jam' },
      averageMonthlyVolume: 50
    });

    expect(await categoryDao.getCategoryWithAverageSearchVolume(4, createDate('01/01/2022'), 2)).toStrictEqual({
      category: { id: 4, name: 'Honey' },
      averageMonthlyVolume: 60
    });
  });

  it('should find the average search volume for a given non-leaf category', async () => {
    await insertCategories();
    await insertVolumes();

    expect(await categoryDao.getCategoryWithAverageSearchVolume(1, createDate('01/01/2022'), 2)).toStrictEqual({
      category: { id: 1, name: 'Products' },
      averageMonthlyVolume: 110
    });
  });

  async function insertCategories() {
    await knex<CategoryEntity>(categoryTableName).insert([
      { id: 1, name: 'Products', parent_id: null },
      { id: 2, name: 'Spread', parent_id: 1 },
      { id: 3, name: 'Jam', parent_id: 2 },
      { id: 4, name: 'Honey', parent_id: 2 }
    ]);

    await knex<CategoryClosureEntity>(categoryClosureTableName).insert([
      { ancestor_id: 1, descendant_id: 1 },
      { ancestor_id: 1, descendant_id: 2 },
      { ancestor_id: 1, descendant_id: 3 },
      { ancestor_id: 1, descendant_id: 4 },
      { ancestor_id: 2, descendant_id: 2 },
      { ancestor_id: 2, descendant_id: 3 },
      { ancestor_id: 2, descendant_id: 4 },
      { ancestor_id: 3, descendant_id: 3 },
      { ancestor_id: 4, descendant_id: 4 }
    ]);
  }

  async function insertVolumes() {
    await knex<VolumeEntity>(volumeTableName).insert([
      { category_id: 3, date: createDate('01/01/2022').toISOString(), volume: 40 },
      { category_id: 3, date: createDate('01/02/2022').toISOString(), volume: 60 },
      { category_id: 4, date: createDate('01/01/2022').toISOString(), volume: 90 },
      { category_id: 4, date: createDate('01/02/2022').toISOString(), volume: 30 }
    ]);
  }
});
