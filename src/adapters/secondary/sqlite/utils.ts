import knex, { Knex } from 'knex';
import { getEnvironment } from 'src/shared/get-environment';
import { categoryTableName } from './entities/category.entity';
import config from './knexfile';

export function getKnexConnection() {
  return knex(config[getEnvironment()]);
}

export async function migrateToLatest(knex: Knex) {
  await knex.migrate.latest();
}

export async function clearTables(knex: Knex) {
  const tables = [categoryTableName];
  for (const table of tables) {
    await knex(table).del();
  }
}
