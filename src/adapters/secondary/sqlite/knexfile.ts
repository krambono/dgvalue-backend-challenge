import { join } from 'path';

const currentDir = __dirname;

const defaults = {
  client: 'sqlite3',
  migrations: {
    tableName: 'knex_migrations',
    directory: join(currentDir, 'migrations')
  },
  useNullAsDefault: true
};

export default {
  development: {
    ...defaults,
    connection: {
      filename: join(currentDir, 'db.sqlite').replace('dist', 'src')
    },
    seeds: {
      directory: join(currentDir, 'seeds')
    }
  },
  test: {
    ...defaults,
    connection: {
      filename: join(currentDir, 'db-test.sqlite')
    }
  }
};
