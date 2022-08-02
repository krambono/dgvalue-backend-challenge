import { Knex } from 'knex';
import { clearTables, getKnexConnection, migrateToLatest } from '../sqlite/utils';
import { SqliteCategoryDao } from './sqlite-category-dao';
import { CategoryEntity, categoryTableName } from '../sqlite/entities/category.entity';
import { CategoryClosureEntity, categoryClosureTableName } from '../sqlite/entities/category-closure.entity';

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
      { id: 1, name: 'Products', ancestors: [], children: [{ id: 2, name: 'Spread' }] },
      { id: 2, name: 'Spread', ancestors: [{ id: 1, name: 'Products' }], children: [{ id: 3, name: 'Jam' }] },
      {
        id: 3,
        name: 'Jam',
        ancestors: [
          { id: 1, name: 'Products' },
          { id: 2, name: 'Spread' }
        ]
      }
    ]);
  });

  async function insertCategories() {
    await knex<CategoryEntity>(categoryTableName).insert([
      { id: 1, name: 'Products', parent_id: null },
      { id: 2, name: 'Spread', parent_id: 1 },
      { id: 3, name: 'Jam', parent_id: 2 }
    ]);

    await knex<CategoryClosureEntity>(categoryClosureTableName).insert([
      { ancestor_id: 1, descendant_id: 1 },
      { ancestor_id: 1, descendant_id: 2 },
      { ancestor_id: 1, descendant_id: 3 },
      { ancestor_id: 2, descendant_id: 2 },
      { ancestor_id: 2, descendant_id: 3 },
      { ancestor_id: 3, descendant_id: 3 }
    ]);
  }
});
