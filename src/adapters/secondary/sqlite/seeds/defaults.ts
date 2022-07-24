import { Knex } from 'knex';
import { categories } from './data/categories.json';
import { volumes } from './data/volumes.json';

export async function seed(knex: Knex): Promise<void> {
  await knex('volumes').del();
  await knex('categories_closure').del();
  await knex('categories').del();

  for (const category of categories) {
    await knex.raw('INSERT INTO categories (id, name, parent_id) VALUES (?, ?, ?)', [
      category.id,
      category.name,
      category.ancestors[category.depth - 1]?.id ?? null
    ]);

    for (const ancestor of category.ancestors) {
      await knex.raw('INSERT INTO categories_closure (ancestor_id, descendant_id) VALUES (?, ?)', [
        ancestor.id,
        category.id
      ]);
    }
  }

  for (const volume of volumes) {
    await knex.raw('INSERT INTO volumes (category_id, date, volume) VALUES (?, ?, ?)', [
      volume.category_id,
      volume.date,
      volume.volume
    ]);
  }
}
