import { Category, CategoryWithVolume } from 'src/hexagon/models/category';
import { CategoryDAO } from '../../../hexagon/secondary-ports/category-dao';

export class FakeCategoryDAO implements CategoryDAO {
  private _categories: Map<number, Category> = new Map();
  private _categoriesWithVolume: Map<number, CategoryWithVolume> = new Map();
  private _searchVolumeDate: Date;

  public async findMany(): Promise<Category[]> {
    return Array.from(this._categories.values());
  }

  public async getCategoryWithAverageSearchVolume(
    categoryId: number,
    from: Date
  ): Promise<CategoryWithVolume | undefined> {
    this._searchVolumeDate = from;
    return this._categoriesWithVolume.get(categoryId);
  }

  public feedCategoriesWith(...categories: Category[]): void {
    for (const category of categories) {
      this._categories.set(category.id, category);
    }
  }

  public feedCategoriesVolumeWith(...categories: CategoryWithVolume[]): void {
    for (const category of categories) {
      this._categoriesWithVolume.set(category.category.id, category);
    }
  }

  public get searchVolumeDate(): Date {
    return this._searchVolumeDate;
  }
}
