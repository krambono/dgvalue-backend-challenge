interface BaseCategory {
  id: number;
  name: string;
}

export interface Category extends BaseCategory {
  ancestors: BaseCategory[];
  children?: BaseCategory[];
}
