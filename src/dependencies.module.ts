import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
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
export class DependenciesModule implements OnModuleDestroy {
  public constructor(@Inject('KNEX') private knex: Knex) {}

  async onModuleDestroy() {
    await this.knex.destroy();
  }
}
