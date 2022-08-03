import { Controller, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { RetrieveCategorySearchVolumeQueryHandler } from 'src/hexagon/use-cases/retrieve-category-search-volume/retrieve-category-search-volume-query-handler';
import { Category, CategoryWithVolume } from '../../hexagon/models/category';
import { RetrieveCategoriesQueryHandler } from '../../hexagon/use-cases/retrieve-categories/retrieve-categories-query-handler';

@Controller('categories')
export class CategoryController {
  public constructor(
    private retrieveCategoriesQueryHandler: RetrieveCategoriesQueryHandler,
    private retrieveCategorySearchVolumeQueryHandler: RetrieveCategorySearchVolumeQueryHandler
  ) {}

  @Get()
  public findMandy(): Promise<Category[]> {
    return this.retrieveCategoriesQueryHandler.handle();
  }

  @Get(':id')
  public async findCategoryWithAverageVolume(@Param('id', ParseIntPipe) id: number): Promise<CategoryWithVolume> {
    const result = await this.retrieveCategorySearchVolumeQueryHandler.handle({ categoryId: id });

    if (!result) {
      throw new NotFoundException('Category not found');
    }

    return result;
  }
}
