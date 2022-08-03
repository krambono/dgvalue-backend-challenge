import { CategoryWithVolume } from 'src/hexagon/models/category';
import { CategoryDAO } from 'src/hexagon/secondary-ports/category-dao';
import { DateProvider } from 'src/hexagon/secondary-ports/date-provider';
import { RetrieveCategorySearchVolumeQuery } from './retrieve-category-search-volume-query';
import { startOfMonth, subYears } from 'date-fns/fp';
import { pipe } from 'src/shared/pipe';
import { removeTime } from 'src/shared/remove-time';

export class RetrieveCategorySearchVolumeQueryHandler {
  public constructor(private categoryDao: CategoryDAO, private dateProvider: DateProvider) {}

  public handle({ categoryId }: RetrieveCategorySearchVolumeQuery): Promise<CategoryWithVolume | undefined> {
    const date2YearsBefore = pipe(this.dateProvider.now(), removeTime, startOfMonth, subYears(2));
    return this.categoryDao.getCategoryWithAverageSearchVolume(categoryId, date2YearsBefore);
  }
}
