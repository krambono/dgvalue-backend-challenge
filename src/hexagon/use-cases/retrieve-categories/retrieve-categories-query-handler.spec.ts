import { FakeCategoryDAO } from '../../../adapters/secondary/category-dao/fake-category-dao';
import { RetrieveCategoriesQueryHandler } from './retrieve-categories-query-handler';
import { Category } from '../../models/category';

describe('Retrieve categories query handler', () => {
  let categoryDAO: FakeCategoryDAO;
  let retrieveCategoriesQueryHandler: RetrieveCategoriesQueryHandler;

  beforeEach(() => {
    categoryDAO = new FakeCategoryDAO();
    retrieveCategoriesQueryHandler = new RetrieveCategoriesQueryHandler(categoryDAO);
  });

  it('should retrieve no category if there is none', async () => {
    const outputCategories = await retrieveCategoriesQueryHandler.handle();

    expect(outputCategories).toStrictEqual([]);
  });

  it('should retrieve all categories', async () => {
    const categories: Category[] = [
      { id: 1, name: 'Products', children: [{ id: 2, name: 'Chocolate' }] },
      { id: 2, name: 'Chocolate' }
    ];

    categoryDAO.feedWith(...categories);

    const outputCategories = await retrieveCategoriesQueryHandler.handle();

    expect(outputCategories).toStrictEqual(categories);
  });
});
