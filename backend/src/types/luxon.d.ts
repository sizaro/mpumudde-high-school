declare module 'luxon' {
  export class DateTime {
    static fromISO(value: string, options?: { zone?: string }): DateTime;
    static now(): DateTime;
    readonly isValid: boolean;
    setZone(zone: string): DateTime;
    startOf(unit: 'day'): DateTime;
    endOf(unit: 'day'): DateTime;
    toFormat(format: string): string;
  }
}
