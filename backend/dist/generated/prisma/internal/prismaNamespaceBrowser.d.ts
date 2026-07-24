import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client/runtime/client").DbNullClass;
export declare const JsonNull: import("@prisma/client/runtime/client").JsonNullClass;
export declare const AnyNull: import("@prisma/client/runtime/client").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Role: "Role";
    readonly Permission: "Permission";
    readonly UserRole: "UserRole";
    readonly RolePermission: "RolePermission";
    readonly Director: "Director";
    readonly Teacher: "Teacher";
    readonly Parent: "Parent";
    readonly Student: "Student";
    readonly StudentParent: "StudentParent";
    readonly AcademicYear: "AcademicYear";
    readonly Term: "Term";
    readonly SchoolClass: "SchoolClass";
    readonly StudentCategory: "StudentCategory";
    readonly FeeType: "FeeType";
    readonly FinanceStructure: "FinanceStructure";
    readonly StudentTermFee: "StudentTermFee";
    readonly Payment: "Payment";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly password: "password";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const RoleScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum];
export declare const PermissionScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PermissionScalarFieldEnum = (typeof PermissionScalarFieldEnum)[keyof typeof PermissionScalarFieldEnum];
export declare const UserRoleScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly roleId: "roleId";
    readonly createdAt: "createdAt";
};
export type UserRoleScalarFieldEnum = (typeof UserRoleScalarFieldEnum)[keyof typeof UserRoleScalarFieldEnum];
export declare const RolePermissionScalarFieldEnum: {
    readonly id: "id";
    readonly roleId: "roleId";
    readonly permissionId: "permissionId";
    readonly createdAt: "createdAt";
};
export type RolePermissionScalarFieldEnum = (typeof RolePermissionScalarFieldEnum)[keyof typeof RolePermissionScalarFieldEnum];
export declare const DirectorScalarFieldEnum: {
    readonly id: "id";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly phone: "phone";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type DirectorScalarFieldEnum = (typeof DirectorScalarFieldEnum)[keyof typeof DirectorScalarFieldEnum];
export declare const TeacherScalarFieldEnum: {
    readonly id: "id";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly phone: "phone";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TeacherScalarFieldEnum = (typeof TeacherScalarFieldEnum)[keyof typeof TeacherScalarFieldEnum];
export declare const ParentScalarFieldEnum: {
    readonly id: "id";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly phone: "phone";
    readonly relationship: "relationship";
    readonly userId: "userId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ParentScalarFieldEnum = (typeof ParentScalarFieldEnum)[keyof typeof ParentScalarFieldEnum];
export declare const StudentScalarFieldEnum: {
    readonly id: "id";
    readonly admissionNumber: "admissionNumber";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly dateOfBirth: "dateOfBirth";
    readonly gender: "gender";
    readonly isActive: "isActive";
    readonly academicYearId: "academicYearId";
    readonly termId: "termId";
    readonly classId: "classId";
    readonly studentCategoryId: "studentCategoryId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type StudentScalarFieldEnum = (typeof StudentScalarFieldEnum)[keyof typeof StudentScalarFieldEnum];
export declare const StudentParentScalarFieldEnum: {
    readonly id: "id";
    readonly studentId: "studentId";
    readonly parentId: "parentId";
    readonly relationship: "relationship";
    readonly createdAt: "createdAt";
};
export type StudentParentScalarFieldEnum = (typeof StudentParentScalarFieldEnum)[keyof typeof StudentParentScalarFieldEnum];
export declare const AcademicYearScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AcademicYearScalarFieldEnum = (typeof AcademicYearScalarFieldEnum)[keyof typeof AcademicYearScalarFieldEnum];
export declare const TermScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly academicYearId: "academicYearId";
    readonly feeAmount: "feeAmount";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type TermScalarFieldEnum = (typeof TermScalarFieldEnum)[keyof typeof TermScalarFieldEnum];
export declare const SchoolClassScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type SchoolClassScalarFieldEnum = (typeof SchoolClassScalarFieldEnum)[keyof typeof SchoolClassScalarFieldEnum];
export declare const StudentCategoryScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type StudentCategoryScalarFieldEnum = (typeof StudentCategoryScalarFieldEnum)[keyof typeof StudentCategoryScalarFieldEnum];
export declare const FeeTypeScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly isActive: "isActive";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type FeeTypeScalarFieldEnum = (typeof FeeTypeScalarFieldEnum)[keyof typeof FeeTypeScalarFieldEnum];
export declare const FinanceStructureScalarFieldEnum: {
    readonly id: "id";
    readonly academicYearId: "academicYearId";
    readonly termId: "termId";
    readonly classId: "classId";
    readonly studentCategoryId: "studentCategoryId";
    readonly feeTypeId: "feeTypeId";
    readonly expectedAmount: "expectedAmount";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type FinanceStructureScalarFieldEnum = (typeof FinanceStructureScalarFieldEnum)[keyof typeof FinanceStructureScalarFieldEnum];
export declare const StudentTermFeeScalarFieldEnum: {
    readonly id: "id";
    readonly studentId: "studentId";
    readonly termId: "termId";
    readonly amountOwed: "amountOwed";
    readonly amountPaid: "amountPaid";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type StudentTermFeeScalarFieldEnum = (typeof StudentTermFeeScalarFieldEnum)[keyof typeof StudentTermFeeScalarFieldEnum];
export declare const PaymentScalarFieldEnum: {
    readonly id: "id";
    readonly studentId: "studentId";
    readonly studentTermFeeId: "studentTermFeeId";
    readonly financeStructureId: "financeStructureId";
    readonly amount: "amount";
    readonly method: "method";
    readonly status: "status";
    readonly description: "description";
    readonly date: "date";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type PaymentScalarFieldEnum = (typeof PaymentScalarFieldEnum)[keyof typeof PaymentScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
