import { DateProvider } from 'src/hexagon/secondary-ports/date-provider';

export class RealDateProvider implements DateProvider {
  public now(): Date {
    return new Date();
  }
}
