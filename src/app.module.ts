import { Module } from '@nestjs/common';
import { CategoryController } from './adapters/primary/category.controller';
import { RetrieveCategoriesQueryHandler } from './hexagon/use-cases/retrieve-categories/retrieve-categories-query-handler';
import { CategoryDAO } from './hexagon/secondary-ports/category-dao';
import { DependenciesModule } from './dependencies.module';
import { RetrieveCategorySearchVolumeQueryHandler } from './hexagon/use-cases/retrieve-category-search-volume/retrieve-category-search-volume-query-handler';
import { DateProvider } from './hexagon/secondary-ports/date-provider';

@Module({
  imports: [DependenciesModule],
  controllers: [CategoryController],
  providers: [
    {
      provide: RetrieveCategoriesQueryHandler,
      useFactory: (categoryDao: CategoryDAO) => new RetrieveCategoriesQueryHandler(categoryDao),
      inject: ['CATEGORY_DAO']
    },
    {
      provide: RetrieveCategorySearchVolumeQueryHandler,
      useFactory: (categoryDao: CategoryDAO, dateProvider: DateProvider) =>
        new RetrieveCategorySearchVolumeQueryHandler(categoryDao, dateProvider),
      inject: ['CATEGORY_DAO', 'DATE_PROVIDER']
    }
  ]
})
export class AppModule {}
