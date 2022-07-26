import { Category, CategoryWithVolume } from '../models/category';

export interface CategoryDAO {
  findMany(): Promise<Category[]>;
  getCategoryWithAverageSearchVolume(
    categoryId: number,
    from: Date,
    monthDifference: number
  ): Promise<CategoryWithVolume | undefined>;
}
