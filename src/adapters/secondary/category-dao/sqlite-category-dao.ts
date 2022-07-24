import { Knex } from 'knex';
import { Category } from 'src/hexagon/models/category';
import { CategoryDAO } from '../../../hexagon/secondary-ports/category-dao';
import { CategoryEntity, categoryTableName } from '../sqlite/entities/category.entity';

export class SqliteCategoryDao implements CategoryDAO {
  public constructor(private knex: Knex) {}

  public findMany(): Promise<Category[]> {
    return this.knex<CategoryEntity>(categoryTableName).select('id', 'name');
  }
}
