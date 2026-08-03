export const formatNewsDate = (value: string) => new Intl.DateTimeFormat("en-UG", { dateStyle: "long", timeZone: "Africa/Kampala" }).format(new Date(value));
export const formatNewsDateTime = (value: string) => new Intl.DateTimeFormat("en-UG", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Kampala" }).format(new Date(value));
