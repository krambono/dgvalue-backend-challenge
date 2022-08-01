import { Knex } from 'knex';
import { categories } from './data/categories.json';
import { volumes } from './data/volumes.json';

interface CategoryEntity {
  id: number;
  name: string;
  parent_id: number | null;
}

interface CategoryClosureEntity {
  ancestor_id: number;
  descendant_id: number;
}

interface VolumeEntity {
  category_id: number;
  date: string;
  volume: number;
}

export async function seed(knex: Knex): Promise<void> {
  await cleanTables(knex);
  await insertCategories(knex);
  await insertCategoriesClosure(knex);
  await insertVolumes(knex);
}

async function cleanTables(knex: Knex) {
  await knex('volumes').del();
  await knex('categories_closure').del();
  await knex('categories').del();
}

async function insertCategories(knex: Knex) {
  const rawCategories = categories.map(category => ({
    id: category.id,
    name: category.name,
    parent_id: category.ancestors[category.depth - 1]?.id ?? null
  }));
  await knex<CategoryEntity>('categories').insert(rawCategories);
}

async function insertCategoriesClosure(knex: Knex) {
  const rawCategoriesClosure = categories.reduce(
    (ancestors, category) =>
      ancestors.concat(category.ancestors.map(ancestor => ({ ancestor_id: ancestor.id, descendant_id: category.id }))),
    [] as { ancestor_id: number; descendant_id: number }[]
  );

  await knex<CategoryClosureEntity>('categories_closure').insert(rawCategoriesClosure);
}

async function insertVolumes(knex: Knex) {
  await knex<VolumeEntity>('volumes').insert(volumes);
}
