export const PUBLICATION_KINDS = ["ALUMNI_STORY"] as const;
export const PUBLICATION_STATUSES = ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"] as const;
export const EVENT_AUDIENCES = ["ALUMNI", "PARENTS", "STUDENTS", "TEACHERS", "WHOLE_SCHOOL"] as const;
export const EVENT_VISIBILITIES = ["PUBLIC", "RESTRICTED"] as const;
export const EVENT_PUBLICATION_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export const EVENT_OPERATIONAL_STATUSES = ["SCHEDULED", "POSTPONED", "CANCELLED", "COMPLETED"] as const;
export const EVENT_RECURRENCE_RULES = ["ONE_TIME", "ANNUAL", "BIENNIAL", "IRREGULAR"] as const;

export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];
export type EventAudienceType = (typeof EVENT_AUDIENCES)[number];
export type EventVisibility = (typeof EVENT_VISIBILITIES)[number];
export type EventPublicationStatus = (typeof EVENT_PUBLICATION_STATUSES)[number];
export type EventOperationalStatus = (typeof EVENT_OPERATIONAL_STATUSES)[number];
export type EventRecurrenceRule = (typeof EVENT_RECURRENCE_RULES)[number];
