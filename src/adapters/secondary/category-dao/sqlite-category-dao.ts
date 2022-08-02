import { Knex } from 'knex';
import { Category } from 'src/hexagon/models/category';
import { CategoryDAO } from '../../../hexagon/secondary-ports/category-dao';

type SerializedCategory = { id: number; name: string; children: string | null };

export class SqliteCategoryDao implements CategoryDAO {
  public constructor(private knex: Knex) {}

  public async findMany(): Promise<Category[]> {
    const res: SerializedCategory[] = await this.knex.raw(`
        SELECT c1.id,
            c1.name,
            iif(COUNT(c2.id), (SELECT json_group_array(json_object('id', c.id, 'name', c.name)) FROM categories c WHERE c.parent_id = c1.id ), null) as children
        FROM categories c1
              LEFT JOIN categories c2 ON c2.parent_id = c1.id
        GROUP BY c1.id, c1.name;
    `);
    return this.deserialize(res);
  }

  private deserialize(serializedCategories: SerializedCategory[]): Category[] {
    return serializedCategories.map(({ id, name, children }) =>
      children ? { id, name, children: JSON.parse(children) } : { id, name }
    );
  }
}
