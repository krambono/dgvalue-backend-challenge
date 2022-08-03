import { differenceInMonths, startOfMonth, subYears } from 'date-fns/fp';
import { CategoryWithVolume } from 'src/hexagon/models/category';
import { CategoryDAO } from 'src/hexagon/secondary-ports/category-dao';
import { DateProvider } from 'src/hexagon/secondary-ports/date-provider';
import { pipe } from 'src/shared/pipe';
import { removeTime } from 'src/shared/remove-time';
import { RetrieveCategorySearchVolumeQuery } from './retrieve-category-search-volume-query';

export class RetrieveCategorySearchVolumeQueryHandler {
  public constructor(private categoryDao: CategoryDAO, private dateProvider: DateProvider) {}

  public handle({ categoryId }: RetrieveCategorySearchVolumeQuery): Promise<CategoryWithVolume | undefined> {
    const firstDayOfTheMonth = pipe(this.dateProvider.now(), removeTime, startOfMonth);
    const date2YearsBefore = pipe(firstDayOfTheMonth, subYears(2));
    const monthDifference = differenceInMonths(date2YearsBefore, firstDayOfTheMonth);
    return this.categoryDao.getCategoryWithAverageSearchVolume(categoryId, date2YearsBefore, monthDifference);
  }
}
