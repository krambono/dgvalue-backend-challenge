import { Controller, Get } from '@nestjs/common';
import { RetrieveCategoriesQueryHandler } from '../../hexagon/use-cases/retrieve-categories/retrieve-categories-query-handler';
import { Category } from '../../hexagon/models/category';

@Controller('categories')
export class CategoryController {
  public constructor(private retrieveCategoriesQueryHandler: RetrieveCategoriesQueryHandler) {}

  @Get()
  public findMandy(): Promise<Category[]> {
    return this.retrieveCategoriesQueryHandler.handle();
  }
}
