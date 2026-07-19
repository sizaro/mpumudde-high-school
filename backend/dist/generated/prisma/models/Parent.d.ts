import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ParentModel = runtime.Types.Result.DefaultSelection<Prisma.$ParentPayload>;
export type AggregateParent = {
    _count: ParentCountAggregateOutputType | null;
    _min: ParentMinAggregateOutputType | null;
    _max: ParentMaxAggregateOutputType | null;
};
export type ParentMinAggregateOutputType = {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    relationship: string | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ParentMaxAggregateOutputType = {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    relationship: string | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ParentCountAggregateOutputType = {
    id: number;
    firstName: number;
    lastName: number;
    phone: number;
    relationship: number;
    userId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ParentMinAggregateInputType = {
    id?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    relationship?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ParentMaxAggregateInputType = {
    id?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    relationship?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ParentCountAggregateInputType = {
    id?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    relationship?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ParentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ParentWhereInput;
    orderBy?: Prisma.ParentOrderByWithRelationInput | Prisma.ParentOrderByWithRelationInput[];
    cursor?: Prisma.ParentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ParentCountAggregateInputType;
    _min?: ParentMinAggregateInputType;
    _max?: ParentMaxAggregateInputType;
};
export type GetParentAggregateType<T extends ParentAggregateArgs> = {
    [P in keyof T & keyof AggregateParent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateParent[P]> : Prisma.GetScalarType<T[P], AggregateParent[P]>;
};
export type ParentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ParentWhereInput;
    orderBy?: Prisma.ParentOrderByWithAggregationInput | Prisma.ParentOrderByWithAggregationInput[];
    by: Prisma.ParentScalarFieldEnum[] | Prisma.ParentScalarFieldEnum;
    having?: Prisma.ParentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ParentCountAggregateInputType | true;
    _min?: ParentMinAggregateInputType;
    _max?: ParentMaxAggregateInputType;
};
export type ParentGroupByOutputType = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    relationship: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: ParentCountAggregateOutputType | null;
    _min: ParentMinAggregateOutputType | null;
    _max: ParentMaxAggregateOutputType | null;
};
export type GetParentGroupByPayload<T extends ParentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ParentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ParentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ParentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ParentGroupByOutputType[P]>;
}>>;
export type ParentWhereInput = {
    AND?: Prisma.ParentWhereInput | Prisma.ParentWhereInput[];
    OR?: Prisma.ParentWhereInput[];
    NOT?: Prisma.ParentWhereInput | Prisma.ParentWhereInput[];
    id?: Prisma.StringFilter<"Parent"> | string;
    firstName?: Prisma.StringFilter<"Parent"> | string;
    lastName?: Prisma.StringFilter<"Parent"> | string;
    phone?: Prisma.StringNullableFilter<"Parent"> | string | null;
    relationship?: Prisma.StringNullableFilter<"Parent"> | string | null;
    userId?: Prisma.StringFilter<"Parent"> | string;
    createdAt?: Prisma.DateTimeFilter<"Parent"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Parent"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    students?: Prisma.StudentParentListRelationFilter;
};
export type ParentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    relationship?: Prisma.SortOrderInput | Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    students?: Prisma.StudentParentOrderByRelationAggregateInput;
};
export type ParentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId?: string;
    AND?: Prisma.ParentWhereInput | Prisma.ParentWhereInput[];
    OR?: Prisma.ParentWhereInput[];
    NOT?: Prisma.ParentWhereInput | Prisma.ParentWhereInput[];
    firstName?: Prisma.StringFilter<"Parent"> | string;
    lastName?: Prisma.StringFilter<"Parent"> | string;
    phone?: Prisma.StringNullableFilter<"Parent"> | string | null;
    relationship?: Prisma.StringNullableFilter<"Parent"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Parent"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Parent"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    students?: Prisma.StudentParentListRelationFilter;
}, "id" | "userId">;
export type ParentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    relationship?: Prisma.SortOrderInput | Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ParentCountOrderByAggregateInput;
    _max?: Prisma.ParentMaxOrderByAggregateInput;
    _min?: Prisma.ParentMinOrderByAggregateInput;
};
export type ParentScalarWhereWithAggregatesInput = {
    AND?: Prisma.ParentScalarWhereWithAggregatesInput | Prisma.ParentScalarWhereWithAggregatesInput[];
    OR?: Prisma.ParentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ParentScalarWhereWithAggregatesInput | Prisma.ParentScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Parent"> | string;
    firstName?: Prisma.StringWithAggregatesFilter<"Parent"> | string;
    lastName?: Prisma.StringWithAggregatesFilter<"Parent"> | string;
    phone?: Prisma.StringNullableWithAggregatesFilter<"Parent"> | string | null;
    relationship?: Prisma.StringNullableWithAggregatesFilter<"Parent"> | string | null;
    userId?: Prisma.StringWithAggregatesFilter<"Parent"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Parent"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Parent"> | Date | string;
};
export type ParentCreateInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    relationship?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutParentInput;
    students?: Prisma.StudentParentCreateNestedManyWithoutParentInput;
};
export type ParentUncheckedCreateInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    relationship?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    students?: Prisma.StudentParentUncheckedCreateNestedManyWithoutParentInput;
};
export type ParentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutParentNestedInput;
    students?: Prisma.StudentParentUpdateManyWithoutParentNestedInput;
};
export type ParentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    students?: Prisma.StudentParentUncheckedUpdateManyWithoutParentNestedInput;
};
export type ParentCreateManyInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    relationship?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ParentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ParentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ParentNullableScalarRelationFilter = {
    is?: Prisma.ParentWhereInput | null;
    isNot?: Prisma.ParentWhereInput | null;
};
export type ParentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    relationship?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ParentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    relationship?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ParentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    relationship?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ParentScalarRelationFilter = {
    is?: Prisma.ParentWhereInput;
    isNot?: Prisma.ParentWhereInput;
};
export type ParentCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ParentCreateWithoutUserInput, Prisma.ParentUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.ParentCreateOrConnectWithoutUserInput;
    connect?: Prisma.ParentWhereUniqueInput;
};
export type ParentUncheckedCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ParentCreateWithoutUserInput, Prisma.ParentUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.ParentCreateOrConnectWithoutUserInput;
    connect?: Prisma.ParentWhereUniqueInput;
};
export type ParentUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ParentCreateWithoutUserInput, Prisma.ParentUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.ParentCreateOrConnectWithoutUserInput;
    upsert?: Prisma.ParentUpsertWithoutUserInput;
    disconnect?: Prisma.ParentWhereInput | boolean;
    delete?: Prisma.ParentWhereInput | boolean;
    connect?: Prisma.ParentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ParentUpdateToOneWithWhereWithoutUserInput, Prisma.ParentUpdateWithoutUserInput>, Prisma.ParentUncheckedUpdateWithoutUserInput>;
};
export type ParentUncheckedUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ParentCreateWithoutUserInput, Prisma.ParentUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.ParentCreateOrConnectWithoutUserInput;
    upsert?: Prisma.ParentUpsertWithoutUserInput;
    disconnect?: Prisma.ParentWhereInput | boolean;
    delete?: Prisma.ParentWhereInput | boolean;
    connect?: Prisma.ParentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ParentUpdateToOneWithWhereWithoutUserInput, Prisma.ParentUpdateWithoutUserInput>, Prisma.ParentUncheckedUpdateWithoutUserInput>;
};
export type ParentCreateNestedOneWithoutStudentsInput = {
    create?: Prisma.XOR<Prisma.ParentCreateWithoutStudentsInput, Prisma.ParentUncheckedCreateWithoutStudentsInput>;
    connectOrCreate?: Prisma.ParentCreateOrConnectWithoutStudentsInput;
    connect?: Prisma.ParentWhereUniqueInput;
};
export type ParentUpdateOneRequiredWithoutStudentsNestedInput = {
    create?: Prisma.XOR<Prisma.ParentCreateWithoutStudentsInput, Prisma.ParentUncheckedCreateWithoutStudentsInput>;
    connectOrCreate?: Prisma.ParentCreateOrConnectWithoutStudentsInput;
    upsert?: Prisma.ParentUpsertWithoutStudentsInput;
    connect?: Prisma.ParentWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ParentUpdateToOneWithWhereWithoutStudentsInput, Prisma.ParentUpdateWithoutStudentsInput>, Prisma.ParentUncheckedUpdateWithoutStudentsInput>;
};
export type ParentCreateWithoutUserInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    relationship?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    students?: Prisma.StudentParentCreateNestedManyWithoutParentInput;
};
export type ParentUncheckedCreateWithoutUserInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    relationship?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    students?: Prisma.StudentParentUncheckedCreateNestedManyWithoutParentInput;
};
export type ParentCreateOrConnectWithoutUserInput = {
    where: Prisma.ParentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ParentCreateWithoutUserInput, Prisma.ParentUncheckedCreateWithoutUserInput>;
};
export type ParentUpsertWithoutUserInput = {
    update: Prisma.XOR<Prisma.ParentUpdateWithoutUserInput, Prisma.ParentUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ParentCreateWithoutUserInput, Prisma.ParentUncheckedCreateWithoutUserInput>;
    where?: Prisma.ParentWhereInput;
};
export type ParentUpdateToOneWithWhereWithoutUserInput = {
    where?: Prisma.ParentWhereInput;
    data: Prisma.XOR<Prisma.ParentUpdateWithoutUserInput, Prisma.ParentUncheckedUpdateWithoutUserInput>;
};
export type ParentUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    students?: Prisma.StudentParentUpdateManyWithoutParentNestedInput;
};
export type ParentUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    students?: Prisma.StudentParentUncheckedUpdateManyWithoutParentNestedInput;
};
export type ParentCreateWithoutStudentsInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    relationship?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutParentInput;
};
export type ParentUncheckedCreateWithoutStudentsInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    relationship?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ParentCreateOrConnectWithoutStudentsInput = {
    where: Prisma.ParentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ParentCreateWithoutStudentsInput, Prisma.ParentUncheckedCreateWithoutStudentsInput>;
};
export type ParentUpsertWithoutStudentsInput = {
    update: Prisma.XOR<Prisma.ParentUpdateWithoutStudentsInput, Prisma.ParentUncheckedUpdateWithoutStudentsInput>;
    create: Prisma.XOR<Prisma.ParentCreateWithoutStudentsInput, Prisma.ParentUncheckedCreateWithoutStudentsInput>;
    where?: Prisma.ParentWhereInput;
};
export type ParentUpdateToOneWithWhereWithoutStudentsInput = {
    where?: Prisma.ParentWhereInput;
    data: Prisma.XOR<Prisma.ParentUpdateWithoutStudentsInput, Prisma.ParentUncheckedUpdateWithoutStudentsInput>;
};
export type ParentUpdateWithoutStudentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutParentNestedInput;
};
export type ParentUncheckedUpdateWithoutStudentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    relationship?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ParentCountOutputType = {
    students: number;
};
export type ParentCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    students?: boolean | ParentCountOutputTypeCountStudentsArgs;
};
export type ParentCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentCountOutputTypeSelect<ExtArgs> | null;
};
export type ParentCountOutputTypeCountStudentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StudentParentWhereInput;
};
export type ParentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    relationship?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    students?: boolean | Prisma.Parent$studentsArgs<ExtArgs>;
    _count?: boolean | Prisma.ParentCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["parent"]>;
export type ParentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    relationship?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["parent"]>;
export type ParentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    relationship?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["parent"]>;
export type ParentSelectScalar = {
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    relationship?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ParentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "firstName" | "lastName" | "phone" | "relationship" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["parent"]>;
export type ParentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    students?: boolean | Prisma.Parent$studentsArgs<ExtArgs>;
    _count?: boolean | Prisma.ParentCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ParentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ParentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ParentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Parent";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        students: Prisma.$StudentParentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        relationship: string | null;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["parent"]>;
    composites: {};
};
export type ParentGetPayload<S extends boolean | null | undefined | ParentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ParentPayload, S>;
export type ParentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ParentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ParentCountAggregateInputType | true;
};
export interface ParentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Parent'];
        meta: {
            name: 'Parent';
        };
    };
    findUnique<T extends ParentFindUniqueArgs>(args: Prisma.SelectSubset<T, ParentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ParentClient<runtime.Types.Result.GetResult<Prisma.$ParentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ParentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ParentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ParentClient<runtime.Types.Result.GetResult<Prisma.$ParentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ParentFindFirstArgs>(args?: Prisma.SelectSubset<T, ParentFindFirstArgs<ExtArgs>>): Prisma.Prisma__ParentClient<runtime.Types.Result.GetResult<Prisma.$ParentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ParentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ParentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ParentClient<runtime.Types.Result.GetResult<Prisma.$ParentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ParentFindManyArgs>(args?: Prisma.SelectSubset<T, ParentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ParentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ParentCreateArgs>(args: Prisma.SelectSubset<T, ParentCreateArgs<ExtArgs>>): Prisma.Prisma__ParentClient<runtime.Types.Result.GetResult<Prisma.$ParentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ParentCreateManyArgs>(args?: Prisma.SelectSubset<T, ParentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ParentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ParentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ParentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ParentDeleteArgs>(args: Prisma.SelectSubset<T, ParentDeleteArgs<ExtArgs>>): Prisma.Prisma__ParentClient<runtime.Types.Result.GetResult<Prisma.$ParentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ParentUpdateArgs>(args: Prisma.SelectSubset<T, ParentUpdateArgs<ExtArgs>>): Prisma.Prisma__ParentClient<runtime.Types.Result.GetResult<Prisma.$ParentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ParentDeleteManyArgs>(args?: Prisma.SelectSubset<T, ParentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ParentUpdateManyArgs>(args: Prisma.SelectSubset<T, ParentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ParentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ParentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ParentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ParentUpsertArgs>(args: Prisma.SelectSubset<T, ParentUpsertArgs<ExtArgs>>): Prisma.Prisma__ParentClient<runtime.Types.Result.GetResult<Prisma.$ParentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ParentCountArgs>(args?: Prisma.Subset<T, ParentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ParentCountAggregateOutputType> : number>;
    aggregate<T extends ParentAggregateArgs>(args: Prisma.Subset<T, ParentAggregateArgs>): Prisma.PrismaPromise<GetParentAggregateType<T>>;
    groupBy<T extends ParentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ParentGroupByArgs['orderBy'];
    } : {
        orderBy?: ParentGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ParentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ParentFieldRefs;
}
export interface Prisma__ParentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    students<T extends Prisma.Parent$studentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Parent$studentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StudentParentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ParentFieldRefs {
    readonly id: Prisma.FieldRef<"Parent", 'String'>;
    readonly firstName: Prisma.FieldRef<"Parent", 'String'>;
    readonly lastName: Prisma.FieldRef<"Parent", 'String'>;
    readonly phone: Prisma.FieldRef<"Parent", 'String'>;
    readonly relationship: Prisma.FieldRef<"Parent", 'String'>;
    readonly userId: Prisma.FieldRef<"Parent", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Parent", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Parent", 'DateTime'>;
}
export type ParentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentSelect<ExtArgs> | null;
    omit?: Prisma.ParentOmit<ExtArgs> | null;
    include?: Prisma.ParentInclude<ExtArgs> | null;
    where: Prisma.ParentWhereUniqueInput;
};
export type ParentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentSelect<ExtArgs> | null;
    omit?: Prisma.ParentOmit<ExtArgs> | null;
    include?: Prisma.ParentInclude<ExtArgs> | null;
    where: Prisma.ParentWhereUniqueInput;
};
export type ParentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentSelect<ExtArgs> | null;
    omit?: Prisma.ParentOmit<ExtArgs> | null;
    include?: Prisma.ParentInclude<ExtArgs> | null;
    where?: Prisma.ParentWhereInput;
    orderBy?: Prisma.ParentOrderByWithRelationInput | Prisma.ParentOrderByWithRelationInput[];
    cursor?: Prisma.ParentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ParentScalarFieldEnum | Prisma.ParentScalarFieldEnum[];
};
export type ParentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentSelect<ExtArgs> | null;
    omit?: Prisma.ParentOmit<ExtArgs> | null;
    include?: Prisma.ParentInclude<ExtArgs> | null;
    where?: Prisma.ParentWhereInput;
    orderBy?: Prisma.ParentOrderByWithRelationInput | Prisma.ParentOrderByWithRelationInput[];
    cursor?: Prisma.ParentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ParentScalarFieldEnum | Prisma.ParentScalarFieldEnum[];
};
export type ParentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentSelect<ExtArgs> | null;
    omit?: Prisma.ParentOmit<ExtArgs> | null;
    include?: Prisma.ParentInclude<ExtArgs> | null;
    where?: Prisma.ParentWhereInput;
    orderBy?: Prisma.ParentOrderByWithRelationInput | Prisma.ParentOrderByWithRelationInput[];
    cursor?: Prisma.ParentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ParentScalarFieldEnum | Prisma.ParentScalarFieldEnum[];
};
export type ParentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentSelect<ExtArgs> | null;
    omit?: Prisma.ParentOmit<ExtArgs> | null;
    include?: Prisma.ParentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ParentCreateInput, Prisma.ParentUncheckedCreateInput>;
};
export type ParentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ParentCreateManyInput | Prisma.ParentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ParentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ParentOmit<ExtArgs> | null;
    data: Prisma.ParentCreateManyInput | Prisma.ParentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ParentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ParentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentSelect<ExtArgs> | null;
    omit?: Prisma.ParentOmit<ExtArgs> | null;
    include?: Prisma.ParentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ParentUpdateInput, Prisma.ParentUncheckedUpdateInput>;
    where: Prisma.ParentWhereUniqueInput;
};
export type ParentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ParentUpdateManyMutationInput, Prisma.ParentUncheckedUpdateManyInput>;
    where?: Prisma.ParentWhereInput;
    limit?: number;
};
export type ParentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ParentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ParentUpdateManyMutationInput, Prisma.ParentUncheckedUpdateManyInput>;
    where?: Prisma.ParentWhereInput;
    limit?: number;
    include?: Prisma.ParentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ParentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentSelect<ExtArgs> | null;
    omit?: Prisma.ParentOmit<ExtArgs> | null;
    include?: Prisma.ParentInclude<ExtArgs> | null;
    where: Prisma.ParentWhereUniqueInput;
    create: Prisma.XOR<Prisma.ParentCreateInput, Prisma.ParentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ParentUpdateInput, Prisma.ParentUncheckedUpdateInput>;
};
export type ParentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentSelect<ExtArgs> | null;
    omit?: Prisma.ParentOmit<ExtArgs> | null;
    include?: Prisma.ParentInclude<ExtArgs> | null;
    where: Prisma.ParentWhereUniqueInput;
};
export type ParentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ParentWhereInput;
    limit?: number;
};
export type Parent$studentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StudentParentSelect<ExtArgs> | null;
    omit?: Prisma.StudentParentOmit<ExtArgs> | null;
    include?: Prisma.StudentParentInclude<ExtArgs> | null;
    where?: Prisma.StudentParentWhereInput;
    orderBy?: Prisma.StudentParentOrderByWithRelationInput | Prisma.StudentParentOrderByWithRelationInput[];
    cursor?: Prisma.StudentParentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StudentParentScalarFieldEnum | Prisma.StudentParentScalarFieldEnum[];
};
export type ParentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ParentSelect<ExtArgs> | null;
    omit?: Prisma.ParentOmit<ExtArgs> | null;
    include?: Prisma.ParentInclude<ExtArgs> | null;
};
