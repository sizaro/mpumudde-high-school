import * as runtime from "@prisma/client/runtime/index-browser";
export const Decimal = runtime.Decimal;
export const NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
export const DbNull = runtime.DbNull;
export const JsonNull = runtime.JsonNull;
export const AnyNull = runtime.AnyNull;
export const ModelName = {
    User: 'User',
    Role: 'Role',
    Permission: 'Permission',
    UserRole: 'UserRole',
    RolePermission: 'RolePermission',
    Director: 'Director',
    Teacher: 'Teacher',
    Parent: 'Parent',
    Student: 'Student',
    StudentParent: 'StudentParent',
    AcademicYear: 'AcademicYear',
    Term: 'Term',
    SchoolClass: 'SchoolClass',
    StudentCategory: 'StudentCategory',
    FeeType: 'FeeType',
    FinanceStructure: 'FinanceStructure',
    StudentTermFee: 'StudentTermFee',
    Payment: 'Payment'
};
export const TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
export const UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    password: 'password',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const RoleScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const PermissionScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const UserRoleScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    roleId: 'roleId',
    createdAt: 'createdAt'
};
export const RolePermissionScalarFieldEnum = {
    id: 'id',
    roleId: 'roleId',
    permissionId: 'permissionId',
    createdAt: 'createdAt'
};
export const DirectorScalarFieldEnum = {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const TeacherScalarFieldEnum = {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const ParentScalarFieldEnum = {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    relationship: 'relationship',
    userId: 'userId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const StudentScalarFieldEnum = {
    id: 'id',
    admissionNumber: 'admissionNumber',
    firstName: 'firstName',
    lastName: 'lastName',
    dateOfBirth: 'dateOfBirth',
    gender: 'gender',
    isActive: 'isActive',
    academicYearId: 'academicYearId',
    termId: 'termId',
    classId: 'classId',
    studentCategoryId: 'studentCategoryId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const StudentParentScalarFieldEnum = {
    id: 'id',
    studentId: 'studentId',
    parentId: 'parentId',
    relationship: 'relationship',
    createdAt: 'createdAt'
};
export const AcademicYearScalarFieldEnum = {
    id: 'id',
    name: 'name',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const TermScalarFieldEnum = {
    id: 'id',
    name: 'name',
    academicYearId: 'academicYearId',
    feeAmount: 'feeAmount',
    startDate: 'startDate',
    endDate: 'endDate',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const SchoolClassScalarFieldEnum = {
    id: 'id',
    name: 'name',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const StudentCategoryScalarFieldEnum = {
    id: 'id',
    name: 'name',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const FeeTypeScalarFieldEnum = {
    id: 'id',
    name: 'name',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const FinanceStructureScalarFieldEnum = {
    id: 'id',
    academicYearId: 'academicYearId',
    termId: 'termId',
    classId: 'classId',
    studentCategoryId: 'studentCategoryId',
    feeTypeId: 'feeTypeId',
    expectedAmount: 'expectedAmount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const StudentTermFeeScalarFieldEnum = {
    id: 'id',
    studentId: 'studentId',
    termId: 'termId',
    amountOwed: 'amountOwed',
    amountPaid: 'amountPaid',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const PaymentScalarFieldEnum = {
    id: 'id',
    studentId: 'studentId',
    studentTermFeeId: 'studentTermFeeId',
    financeStructureId: 'financeStructureId',
    amount: 'amount',
    method: 'method',
    status: 'status',
    description: 'description',
    date: 'date',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
export const SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
export const QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
export const NullsOrder = {
    first: 'first',
    last: 'last'
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map