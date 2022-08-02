import { Knex } from 'knex';
import { clearTables, getKnexConnection, migrateToLatest } from '../sqlite/utils';
import { SqliteCategoryDao } from './sqlite-category-dao';
import { CategoryEntity } from '../sqlite/entities/category.entity';

describe('Sqlite category dao integration tests', () => {
  let knex: Knex;
  let categoryDao: SqliteCategoryDao;

  beforeAll(async () => {
    knex = getKnexConnection();
    await migrateToLatest(knex);
    await clearTables(knex);
    categoryDao = new SqliteCategoryDao(knex);
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
      { id: 1, name: 'Products', children: [{ id: 2, name: 'Spread' }] },
      { id: 2, name: 'Spread', children: [{ id: 3, name: 'Jam' }] },
      { id: 3, name: 'Jam' }
    ]);
  });

  async function insertCategories() {
    await knex<CategoryEntity>('categories').insert([
      { id: 1, name: 'Products', parent_id: null },
      { id: 2, name: 'Spread', parent_id: 1 },
      { id: 3, name: 'Jam', parent_id: 2 }
    ]);
  }
});
