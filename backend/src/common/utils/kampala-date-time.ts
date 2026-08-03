import { DateTime } from 'luxon';

export const KAMPALA_ZONE = 'Africa/Kampala';
export const PAYMENT_DATE_TIME_FORMAT = "yyyy-LL-dd'T'HH:mm:ss";

export function toKampalaLocalDateTime(value?: string): string {
  const parsed = value
    ? DateTime.fromISO(value, { zone: KAMPALA_ZONE })
    : DateTime.now().setZone(KAMPALA_ZONE);
  if (!parsed.isValid) throw new Error('Invalid Kampala payment date and time');
  return parsed.setZone(KAMPALA_ZONE).toFormat(PAYMENT_DATE_TIME_FORMAT);
}

export function paymentDateBoundary(value: string, endOfDay = false): string {
  const parsed = DateTime.fromISO(value, { zone: KAMPALA_ZONE });
  if (!parsed.isValid) throw new Error('Invalid finance period date');
  return parsed.setZone(KAMPALA_ZONE)[endOfDay ? 'endOf' : 'startOf']('day').toFormat(PAYMENT_DATE_TIME_FORMAT);
}
