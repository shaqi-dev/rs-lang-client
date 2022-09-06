export const timeFormatter = (time: string): string => {
  const date = new Date(time);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString('en', { month: 'short' });

  if (day !== 1) {
    return `${month}-${day}`;
  }

  if (month !== 'Jan') {
    return month;
  }

  return year.toString();
};
