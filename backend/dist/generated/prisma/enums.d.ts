export declare const Role: {
    readonly DIRECTOR: "DIRECTOR";
    readonly TEACHER: "TEACHER";
    readonly PARENT: "PARENT";
};
export type Role = (typeof Role)[keyof typeof Role];
