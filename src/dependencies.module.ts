import { Inject, Module, OnModuleDestroy } from '@nestjs/common';
import { Knex } from 'knex';
import { SqliteCategoryDao } from './adapters/secondary/category-dao/sqlite-category-dao';
import { RealDateProvider } from './adapters/secondary/date-provider/real-date-provider';
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
    },
    {
      provide: 'DATE_PROVIDER',
      useValue: new RealDateProvider()
    }
  ],
  exports: ['CATEGORY_DAO', 'DATE_PROVIDER']
})
export class DependenciesModule implements OnModuleDestroy {
  public constructor(@Inject('KNEX') private knex: Knex) {}

  async onModuleDestroy() {
    await this.knex.destroy();
  }
}
