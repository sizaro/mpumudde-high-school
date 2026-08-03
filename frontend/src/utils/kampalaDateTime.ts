import { DateTime } from "luxon";

export const KAMPALA_ZONE = "Africa/Kampala";
const INPUT_FORMAT = "yyyy-LL-dd'T'HH:mm";
const STORAGE_FORMAT = "yyyy-LL-dd'T'HH:mm:ss";

export const kampalaNowForInput = () => DateTime.now().setZone(KAMPALA_ZONE).toFormat(INPUT_FORMAT);

export const storageToKampalaInput = (storedValue: string) =>
  DateTime.fromFormat(storedValue, STORAGE_FORMAT, { zone: KAMPALA_ZONE }).toFormat(INPUT_FORMAT);

export const kampalaInputToStorage = (inputValue: string) => {
  const value = DateTime.fromFormat(inputValue, INPUT_FORMAT, { zone: KAMPALA_ZONE });
  if (!value.isValid) throw new Error("Invalid Kampala date and time");
  return value.toFormat(STORAGE_FORMAT);
};

export const formatKampalaDateTime = (storedValue: string) => {
  const value = DateTime.fromFormat(storedValue, STORAGE_FORMAT, { zone: KAMPALA_ZONE });
  return value.isValid ? value.toFormat("dd LLL yyyy, hh:mm a") : storedValue;
};
