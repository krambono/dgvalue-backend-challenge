import { Module } from '@nestjs/common';
import { SqliteCategoryDao } from './adapters/secondary/category-dao/sqlite-category-dao';
import { Knex } from 'knex';
import { getKnexConnection } from './adapters/secondary/sqlite/utils';

@Module({
  providers: [
    {
      provide: 'KNEX',
      useValue: getKnexConnection()
    },
    {
      provide: 'CATEGORY_DAO',
      useFactory: (knex: Knex) => new SqliteCategoryDao(knex),
      inject: ['KNEX']
    }
  ],
  exports: ['CATEGORY_DAO']
})
export class DependenciesModule {}
