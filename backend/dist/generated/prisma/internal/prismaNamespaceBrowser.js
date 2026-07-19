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
    StudentParent: 'StudentParent'
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