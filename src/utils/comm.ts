import { format } from 'date-fns';

export const generateOrderNo = (date: Date = new Date()) => {
  const prefix = format(date, 'yyyyMMdd');
  const lastSix = Math.random().toString(36).substring(2, 6);

  return `${prefix}_${lastSix}`;
};
