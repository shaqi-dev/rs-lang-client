const getCurrentDate = (): string => new Date().toISOString().slice(0, 10);

export default getCurrentDate;
