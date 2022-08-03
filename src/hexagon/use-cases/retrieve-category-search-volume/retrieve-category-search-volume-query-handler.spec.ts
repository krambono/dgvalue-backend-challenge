import { FakeCategoryDAO } from 'src/adapters/secondary/category-dao/fake-category-dao';
import { StubDateProvider } from 'src/adapters/secondary/date-provider/stub-date-provider';
import { CategoryWithVolume } from 'src/hexagon/models/category';
import { RetrieveCategorySearchVolumeQuery } from './retrieve-category-search-volume-query';
import { RetrieveCategorySearchVolumeQueryHandler } from './retrieve-category-search-volume-query-handler';

describe('Retrieve category search volume query handler', () => {
  let categoryDao: FakeCategoryDAO;
  let dateProvider: StubDateProvider;
  let retrieveCategorySearchVolumeQueryHandler: RetrieveCategorySearchVolumeQueryHandler;

  const validCategoryWithVolume: CategoryWithVolume = {
    category: { id: 4, name: 'Chocolate' },
    averageMonthlyVolume: 540
  };

  beforeEach(() => {
    categoryDao = new FakeCategoryDAO();
    dateProvider = new StubDateProvider();
    retrieveCategorySearchVolumeQueryHandler = new RetrieveCategorySearchVolumeQueryHandler(categoryDao, dateProvider);
    dateProvider.currentDate = new Date(2022, 3, 16, 15, 0); // 2022/03/16 15:00:00
    categoryDao.feedCategoriesVolumeWith(validCategoryWithVolume);
  });

  it('should retrieve nothing if given category is not found', async () => {
    const query: RetrieveCategorySearchVolumeQuery = {
      categoryId: 1
    };

    expect(await retrieveCategorySearchVolumeQueryHandler.handle(query)).toBeUndefined();
  });

  it('should retrieve the search volume over the last 24 months for a given category', async () => {
    const query: RetrieveCategorySearchVolumeQuery = {
      categoryId: 4
    };

    const categoryWithVolume = await retrieveCategorySearchVolumeQueryHandler.handle(query);

    expect(categoryDao.searchVolumeDate.toISOString()).toBe(new Date(2020, 3, 1, 0, 0).toISOString());
    expect(categoryWithVolume).toStrictEqual(validCategoryWithVolume);
  });
});
