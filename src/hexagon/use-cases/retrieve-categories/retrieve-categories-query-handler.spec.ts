import { FakeCategoryDAO } from '../../../adapters/secondary/category-dao/fake-category-dao';
import { RetrieveCategoriesQueryHandler } from './retrieve-categories-query-handler';
import { Category } from '../../models/category';

describe('Retrieve categories query handler', () => {
  let categoryDAO: FakeCategoryDAO;
  let retrieveCategoriesQueryHanler: RetrieveCategoriesQueryHandler;

  beforeEach(() => {
    categoryDAO = new FakeCategoryDAO();
    retrieveCategoriesQueryHanler = new RetrieveCategoriesQueryHandler(categoryDAO);
  });

  it('should retrieve no category if there is none', async () => {
    const outputCategories = await retrieveCategoriesQueryHanler.handle();

    expect(outputCategories).toStrictEqual([]);
  });

  it('should retrieve all categories', async () => {
    const categories: Category[] = [
      { id: 'cat1-id', name: 'Products' },
      { id: 'cat2-id', name: 'Chocolate' }
    ];

    categoryDAO.feedWith(...categories);

    const ouputCategories = await retrieveCategoriesQueryHanler.handle();

    expect(ouputCategories).toStrictEqual(categories);
  });
});
