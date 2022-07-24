import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        parent_id INTEGER,
        FOREIGN KEY (parent_id) REFERENCES categories (id)
    )`);

  await knex.raw(`
    CREATE TABLE categories_closure (
        ancestor_id INTEGER,
        descendant_id INTEGER,
        FOREIGN KEY (ancestor_id) REFERENCES categories (id)
        FOREIGN KEY (descendant_id) REFERENCES categories (id)
    )`);

  await knex.raw(`
    CREATE TABLE volumes (
        category_id INTEGER,
        date DATE,
        volume INTEGER,
        FOREIGN KEY (category_id) REFERENCES categories (id)
    )`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('volumes');
  await knex.schema.dropTable('categories_closure');
  await knex.schema.dropTable('categories');
}
