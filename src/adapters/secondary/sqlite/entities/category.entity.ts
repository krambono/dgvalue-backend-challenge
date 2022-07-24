export interface CategoryEntity {
  id: number;
  name: string;
  parent_id: number | null;
}

export const categoryTableName = 'categories';
