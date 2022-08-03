import { FakeCategoryDAO } from 'src/adapters/secondary/category-dao/fake-category-dao';
import { StubDateProvider } from 'src/adapters/secondary/date-provider/stub-date-provider';
import { CategoryWithVolume } from 'src/hexagon/models/category';
import { createDate } from 'src/shared/create-date';
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
    dateProvider.currentDate = createDate('16/04/2022', '15h20');
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

    expect(categoryDao.searchVolumeDate.toISOString()).toBe(createDate('01/04/2020').toISOString());
    expect(categoryDao.monthDifference).toBe(24);
    expect(categoryWithVolume).toStrictEqual(validCategoryWithVolume);
  });
});
