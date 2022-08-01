import { Module } from '@nestjs/common';
import { CategoryController } from './adapters/primary/category.controller';
import { RetrieveCategoriesQueryHandler } from './hexagon/use-cases/retrieve-categories/retrieve-categories-query-handler';
import { CategoryDAO } from './hexagon/secondary-ports/category-dao';
import { DependenciesModule } from './dependencies.module';

@Module({
  imports: [DependenciesModule],
  controllers: [CategoryController],
  providers: [
    {
      provide: RetrieveCategoriesQueryHandler,
      useFactory: (categoryDao: CategoryDAO) => new RetrieveCategoriesQueryHandler(categoryDao),
      inject: ['CATEGORY_DAO']
    }
  ]
})
export class AppModule {}
