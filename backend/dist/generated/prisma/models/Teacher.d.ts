import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TeacherModel = runtime.Types.Result.DefaultSelection<Prisma.$TeacherPayload>;
export type AggregateTeacher = {
    _count: TeacherCountAggregateOutputType | null;
    _min: TeacherMinAggregateOutputType | null;
    _max: TeacherMaxAggregateOutputType | null;
};
export type TeacherMinAggregateOutputType = {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TeacherMaxAggregateOutputType = {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type TeacherCountAggregateOutputType = {
    id: number;
    firstName: number;
    lastName: number;
    phone: number;
    userId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type TeacherMinAggregateInputType = {
    id?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TeacherMaxAggregateInputType = {
    id?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type TeacherCountAggregateInputType = {
    id?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type TeacherAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeacherWhereInput;
    orderBy?: Prisma.TeacherOrderByWithRelationInput | Prisma.TeacherOrderByWithRelationInput[];
    cursor?: Prisma.TeacherWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TeacherCountAggregateInputType;
    _min?: TeacherMinAggregateInputType;
    _max?: TeacherMaxAggregateInputType;
};
export type GetTeacherAggregateType<T extends TeacherAggregateArgs> = {
    [P in keyof T & keyof AggregateTeacher]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTeacher[P]> : Prisma.GetScalarType<T[P], AggregateTeacher[P]>;
};
export type TeacherGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeacherWhereInput;
    orderBy?: Prisma.TeacherOrderByWithAggregationInput | Prisma.TeacherOrderByWithAggregationInput[];
    by: Prisma.TeacherScalarFieldEnum[] | Prisma.TeacherScalarFieldEnum;
    having?: Prisma.TeacherScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TeacherCountAggregateInputType | true;
    _min?: TeacherMinAggregateInputType;
    _max?: TeacherMaxAggregateInputType;
};
export type TeacherGroupByOutputType = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: TeacherCountAggregateOutputType | null;
    _min: TeacherMinAggregateOutputType | null;
    _max: TeacherMaxAggregateOutputType | null;
};
export type GetTeacherGroupByPayload<T extends TeacherGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TeacherGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TeacherGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TeacherGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TeacherGroupByOutputType[P]>;
}>>;
export type TeacherWhereInput = {
    AND?: Prisma.TeacherWhereInput | Prisma.TeacherWhereInput[];
    OR?: Prisma.TeacherWhereInput[];
    NOT?: Prisma.TeacherWhereInput | Prisma.TeacherWhereInput[];
    id?: Prisma.StringFilter<"Teacher"> | string;
    firstName?: Prisma.StringFilter<"Teacher"> | string;
    lastName?: Prisma.StringFilter<"Teacher"> | string;
    phone?: Prisma.StringNullableFilter<"Teacher"> | string | null;
    userId?: Prisma.StringFilter<"Teacher"> | string;
    createdAt?: Prisma.DateTimeFilter<"Teacher"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Teacher"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type TeacherOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type TeacherWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId?: string;
    AND?: Prisma.TeacherWhereInput | Prisma.TeacherWhereInput[];
    OR?: Prisma.TeacherWhereInput[];
    NOT?: Prisma.TeacherWhereInput | Prisma.TeacherWhereInput[];
    firstName?: Prisma.StringFilter<"Teacher"> | string;
    lastName?: Prisma.StringFilter<"Teacher"> | string;
    phone?: Prisma.StringNullableFilter<"Teacher"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Teacher"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Teacher"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "userId">;
export type TeacherOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.TeacherCountOrderByAggregateInput;
    _max?: Prisma.TeacherMaxOrderByAggregateInput;
    _min?: Prisma.TeacherMinOrderByAggregateInput;
};
export type TeacherScalarWhereWithAggregatesInput = {
    AND?: Prisma.TeacherScalarWhereWithAggregatesInput | Prisma.TeacherScalarWhereWithAggregatesInput[];
    OR?: Prisma.TeacherScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TeacherScalarWhereWithAggregatesInput | Prisma.TeacherScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Teacher"> | string;
    firstName?: Prisma.StringWithAggregatesFilter<"Teacher"> | string;
    lastName?: Prisma.StringWithAggregatesFilter<"Teacher"> | string;
    phone?: Prisma.StringNullableWithAggregatesFilter<"Teacher"> | string | null;
    userId?: Prisma.StringWithAggregatesFilter<"Teacher"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Teacher"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Teacher"> | Date | string;
};
export type TeacherCreateInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutTeacherInput;
};
export type TeacherUncheckedCreateInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeacherUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutTeacherNestedInput;
};
export type TeacherUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeacherCreateManyInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeacherUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeacherUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeacherNullableScalarRelationFilter = {
    is?: Prisma.TeacherWhereInput | null;
    isNot?: Prisma.TeacherWhereInput | null;
};
export type TeacherCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TeacherMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TeacherMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type TeacherCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TeacherCreateWithoutUserInput, Prisma.TeacherUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.TeacherCreateOrConnectWithoutUserInput;
    connect?: Prisma.TeacherWhereUniqueInput;
};
export type TeacherUncheckedCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.TeacherCreateWithoutUserInput, Prisma.TeacherUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.TeacherCreateOrConnectWithoutUserInput;
    connect?: Prisma.TeacherWhereUniqueInput;
};
export type TeacherUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TeacherCreateWithoutUserInput, Prisma.TeacherUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.TeacherCreateOrConnectWithoutUserInput;
    upsert?: Prisma.TeacherUpsertWithoutUserInput;
    disconnect?: Prisma.TeacherWhereInput | boolean;
    delete?: Prisma.TeacherWhereInput | boolean;
    connect?: Prisma.TeacherWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeacherUpdateToOneWithWhereWithoutUserInput, Prisma.TeacherUpdateWithoutUserInput>, Prisma.TeacherUncheckedUpdateWithoutUserInput>;
};
export type TeacherUncheckedUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.TeacherCreateWithoutUserInput, Prisma.TeacherUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.TeacherCreateOrConnectWithoutUserInput;
    upsert?: Prisma.TeacherUpsertWithoutUserInput;
    disconnect?: Prisma.TeacherWhereInput | boolean;
    delete?: Prisma.TeacherWhereInput | boolean;
    connect?: Prisma.TeacherWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TeacherUpdateToOneWithWhereWithoutUserInput, Prisma.TeacherUpdateWithoutUserInput>, Prisma.TeacherUncheckedUpdateWithoutUserInput>;
};
export type TeacherCreateWithoutUserInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeacherUncheckedCreateWithoutUserInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type TeacherCreateOrConnectWithoutUserInput = {
    where: Prisma.TeacherWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeacherCreateWithoutUserInput, Prisma.TeacherUncheckedCreateWithoutUserInput>;
};
export type TeacherUpsertWithoutUserInput = {
    update: Prisma.XOR<Prisma.TeacherUpdateWithoutUserInput, Prisma.TeacherUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.TeacherCreateWithoutUserInput, Prisma.TeacherUncheckedCreateWithoutUserInput>;
    where?: Prisma.TeacherWhereInput;
};
export type TeacherUpdateToOneWithWhereWithoutUserInput = {
    where?: Prisma.TeacherWhereInput;
    data: Prisma.XOR<Prisma.TeacherUpdateWithoutUserInput, Prisma.TeacherUncheckedUpdateWithoutUserInput>;
};
export type TeacherUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeacherUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type TeacherSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teacher"]>;
export type TeacherSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teacher"]>;
export type TeacherSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["teacher"]>;
export type TeacherSelectScalar = {
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type TeacherOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "firstName" | "lastName" | "phone" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["teacher"]>;
export type TeacherInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TeacherIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type TeacherIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $TeacherPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Teacher";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["teacher"]>;
    composites: {};
};
export type TeacherGetPayload<S extends boolean | null | undefined | TeacherDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TeacherPayload, S>;
export type TeacherCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TeacherFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TeacherCountAggregateInputType | true;
};
export interface TeacherDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Teacher'];
        meta: {
            name: 'Teacher';
        };
    };
    findUnique<T extends TeacherFindUniqueArgs>(args: Prisma.SelectSubset<T, TeacherFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TeacherClient<runtime.Types.Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TeacherFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TeacherFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeacherClient<runtime.Types.Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TeacherFindFirstArgs>(args?: Prisma.SelectSubset<T, TeacherFindFirstArgs<ExtArgs>>): Prisma.Prisma__TeacherClient<runtime.Types.Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TeacherFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TeacherFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TeacherClient<runtime.Types.Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TeacherFindManyArgs>(args?: Prisma.SelectSubset<T, TeacherFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TeacherCreateArgs>(args: Prisma.SelectSubset<T, TeacherCreateArgs<ExtArgs>>): Prisma.Prisma__TeacherClient<runtime.Types.Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TeacherCreateManyArgs>(args?: Prisma.SelectSubset<T, TeacherCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TeacherCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TeacherCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TeacherDeleteArgs>(args: Prisma.SelectSubset<T, TeacherDeleteArgs<ExtArgs>>): Prisma.Prisma__TeacherClient<runtime.Types.Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TeacherUpdateArgs>(args: Prisma.SelectSubset<T, TeacherUpdateArgs<ExtArgs>>): Prisma.Prisma__TeacherClient<runtime.Types.Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TeacherDeleteManyArgs>(args?: Prisma.SelectSubset<T, TeacherDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TeacherUpdateManyArgs>(args: Prisma.SelectSubset<T, TeacherUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TeacherUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TeacherUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TeacherUpsertArgs>(args: Prisma.SelectSubset<T, TeacherUpsertArgs<ExtArgs>>): Prisma.Prisma__TeacherClient<runtime.Types.Result.GetResult<Prisma.$TeacherPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TeacherCountArgs>(args?: Prisma.Subset<T, TeacherCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TeacherCountAggregateOutputType> : number>;
    aggregate<T extends TeacherAggregateArgs>(args: Prisma.Subset<T, TeacherAggregateArgs>): Prisma.PrismaPromise<GetTeacherAggregateType<T>>;
    groupBy<T extends TeacherGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TeacherGroupByArgs['orderBy'];
    } : {
        orderBy?: TeacherGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TeacherGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTeacherGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TeacherFieldRefs;
}
export interface Prisma__TeacherClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TeacherFieldRefs {
    readonly id: Prisma.FieldRef<"Teacher", 'String'>;
    readonly firstName: Prisma.FieldRef<"Teacher", 'String'>;
    readonly lastName: Prisma.FieldRef<"Teacher", 'String'>;
    readonly phone: Prisma.FieldRef<"Teacher", 'String'>;
    readonly userId: Prisma.FieldRef<"Teacher", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Teacher", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Teacher", 'DateTime'>;
}
export type TeacherFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherSelect<ExtArgs> | null;
    omit?: Prisma.TeacherOmit<ExtArgs> | null;
    include?: Prisma.TeacherInclude<ExtArgs> | null;
    where: Prisma.TeacherWhereUniqueInput;
};
export type TeacherFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherSelect<ExtArgs> | null;
    omit?: Prisma.TeacherOmit<ExtArgs> | null;
    include?: Prisma.TeacherInclude<ExtArgs> | null;
    where: Prisma.TeacherWhereUniqueInput;
};
export type TeacherFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherSelect<ExtArgs> | null;
    omit?: Prisma.TeacherOmit<ExtArgs> | null;
    include?: Prisma.TeacherInclude<ExtArgs> | null;
    where?: Prisma.TeacherWhereInput;
    orderBy?: Prisma.TeacherOrderByWithRelationInput | Prisma.TeacherOrderByWithRelationInput[];
    cursor?: Prisma.TeacherWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeacherScalarFieldEnum | Prisma.TeacherScalarFieldEnum[];
};
export type TeacherFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherSelect<ExtArgs> | null;
    omit?: Prisma.TeacherOmit<ExtArgs> | null;
    include?: Prisma.TeacherInclude<ExtArgs> | null;
    where?: Prisma.TeacherWhereInput;
    orderBy?: Prisma.TeacherOrderByWithRelationInput | Prisma.TeacherOrderByWithRelationInput[];
    cursor?: Prisma.TeacherWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeacherScalarFieldEnum | Prisma.TeacherScalarFieldEnum[];
};
export type TeacherFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherSelect<ExtArgs> | null;
    omit?: Prisma.TeacherOmit<ExtArgs> | null;
    include?: Prisma.TeacherInclude<ExtArgs> | null;
    where?: Prisma.TeacherWhereInput;
    orderBy?: Prisma.TeacherOrderByWithRelationInput | Prisma.TeacherOrderByWithRelationInput[];
    cursor?: Prisma.TeacherWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TeacherScalarFieldEnum | Prisma.TeacherScalarFieldEnum[];
};
export type TeacherCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherSelect<ExtArgs> | null;
    omit?: Prisma.TeacherOmit<ExtArgs> | null;
    include?: Prisma.TeacherInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeacherCreateInput, Prisma.TeacherUncheckedCreateInput>;
};
export type TeacherCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TeacherCreateManyInput | Prisma.TeacherCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TeacherCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TeacherOmit<ExtArgs> | null;
    data: Prisma.TeacherCreateManyInput | Prisma.TeacherCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.TeacherIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type TeacherUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherSelect<ExtArgs> | null;
    omit?: Prisma.TeacherOmit<ExtArgs> | null;
    include?: Prisma.TeacherInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeacherUpdateInput, Prisma.TeacherUncheckedUpdateInput>;
    where: Prisma.TeacherWhereUniqueInput;
};
export type TeacherUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TeacherUpdateManyMutationInput, Prisma.TeacherUncheckedUpdateManyInput>;
    where?: Prisma.TeacherWhereInput;
    limit?: number;
};
export type TeacherUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TeacherOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TeacherUpdateManyMutationInput, Prisma.TeacherUncheckedUpdateManyInput>;
    where?: Prisma.TeacherWhereInput;
    limit?: number;
    include?: Prisma.TeacherIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type TeacherUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherSelect<ExtArgs> | null;
    omit?: Prisma.TeacherOmit<ExtArgs> | null;
    include?: Prisma.TeacherInclude<ExtArgs> | null;
    where: Prisma.TeacherWhereUniqueInput;
    create: Prisma.XOR<Prisma.TeacherCreateInput, Prisma.TeacherUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TeacherUpdateInput, Prisma.TeacherUncheckedUpdateInput>;
};
export type TeacherDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherSelect<ExtArgs> | null;
    omit?: Prisma.TeacherOmit<ExtArgs> | null;
    include?: Prisma.TeacherInclude<ExtArgs> | null;
    where: Prisma.TeacherWhereUniqueInput;
};
export type TeacherDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TeacherWhereInput;
    limit?: number;
};
export type TeacherDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TeacherSelect<ExtArgs> | null;
    omit?: Prisma.TeacherOmit<ExtArgs> | null;
    include?: Prisma.TeacherInclude<ExtArgs> | null;
};
