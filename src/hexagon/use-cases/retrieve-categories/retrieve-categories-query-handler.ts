import { Category } from '../../models/category';
import { CategoryDAO } from '../../secondary-ports/category-dao';

export class RetrieveCategoriesQueryHandler {
  public constructor(private categoryDao: CategoryDAO) {}

  public handle(): Promise<Category[]> {
    return this.categoryDao.findMany();
  }
}
