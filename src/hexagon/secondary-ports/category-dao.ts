import { Category } from '../models/category';

export interface CategoryDAO {
  findMany(): Promise<Category[]>;
}
