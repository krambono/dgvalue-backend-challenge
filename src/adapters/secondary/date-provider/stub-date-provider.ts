import { DateProvider } from 'src/hexagon/secondary-ports/date-provider';

export class StubDateProvider implements DateProvider {
  public constructor(private date?: Date) {}

  public now(): Date {
    if (!this.date) {
      throw new Error('Date must be set');
    }
    return this.date;
  }

  public set currentDate(date: Date) {
    this.date = date;
  }
}
