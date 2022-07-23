import { Category } from 'src/hexagon/models/category';
import { CategoryDAO } from '../../../hexagon/secondary-ports/category-dao';

export class FakeCategoryDAO implements CategoryDAO {
  private categories: Map<string, Category> = new Map();

  public async findMany(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  public feedWith(...categories: Category[]): void {
    for (const category of categories) {
      this.categories.set(category.id, category);
    }
  }
}
