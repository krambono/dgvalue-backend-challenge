import { Knex } from 'knex';
import { Category, CategoryWithVolume } from 'src/hexagon/models/category';
import { CategoryDAO } from '../../../hexagon/secondary-ports/category-dao';
import { CategoryEntity, categoryTableName } from '../sqlite/entities/category.entity';

type SerializedCategory = { id: number; name: string; ancestors: string; children: string | null };

export class SqliteCategoryDao implements CategoryDAO {
  public constructor(private knex: Knex) {}

  public async findMany(): Promise<Category[]> {
    const rows: SerializedCategory[] = await this.knex.raw(`
      SELECT c1.id,
             c1.name,
             iif(COUNT(c2.id),
             (SELECT json_group_array(json_object('id', c.id, 'name', c.name)) FROM categories c
                WHERE c.parent_id = c1.id )
             , null) as children,
             (SELECT json_group_array(json_object('id', c.id, 'name', c.name)) FROM categories_closure
                INNER JOIN categories c on categories_closure.ancestor_id = c.id
                AND descendant_id = c1.id
                AND descendant_id != categories_closure.ancestor_id) ancestors
      FROM categories c1
            LEFT JOIN categories c2 ON c2.parent_id = c1.id
      GROUP BY c1.id, c1.name;
    `);
    return this.deserialize(rows);
  }

  private deserialize(serializedCategories: SerializedCategory[]): Category[] {
    return serializedCategories.map(({ id, name, ancestors, children }) =>
      children
        ? { id, name, ancestors: JSON.parse(ancestors), children: JSON.parse(children) }
        : { id, name, ancestors: JSON.parse(ancestors) }
    );
  }

  public async getCategoryWithAverageSearchVolume(
    categoryId: number,
    from: Date,
    monthDifference: number
  ): Promise<CategoryWithVolume | undefined> {
    const categoryName = (
      await this.knex<CategoryEntity>(categoryTableName).select('name').where({ id: categoryId }).first()
    )?.name;

    if (categoryName === undefined) {
      return undefined;
    }

    const { averageMonthlyVolume }: { averageMonthlyVolume: number } = (
      await this.knex.raw(
        `
        SELECT SUM(volume) / CAST(? as INT) as "averageMonthlyVolume"
          FROM volumes
          LEFT JOIN categories c on volumes.category_id = c.id
          WHERE category_id IN (SELECT descendant_id FROM categories_closure WHERE ancestor_id = ?)
            AND date >= ?
      `,
        [monthDifference, categoryId, from.toISOString()]
      )
    )[0];
    return { category: { id: categoryId, name: categoryName }, averageMonthlyVolume };
  }
}
