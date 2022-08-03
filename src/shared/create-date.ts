/**
 * @param dayString format : "23/02/2022"
 * @param hourString format : "10h22"
 */
export function createDate(dayString: string, hourString?: string): Date {
  const [day, month, year] = dayString.split('/');
  if (!hourString) {
    return new Date(+year, +month - 1, +day);
  }
  const [hour, minute] = hourString.split('h');
  return new Date(+year, +month - 1, +day, +hour, +(minute ?? 0));
}
