import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type DirectorModel = runtime.Types.Result.DefaultSelection<Prisma.$DirectorPayload>;
export type AggregateDirector = {
    _count: DirectorCountAggregateOutputType | null;
    _min: DirectorMinAggregateOutputType | null;
    _max: DirectorMaxAggregateOutputType | null;
};
export type DirectorMinAggregateOutputType = {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DirectorMaxAggregateOutputType = {
    id: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    userId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type DirectorCountAggregateOutputType = {
    id: number;
    firstName: number;
    lastName: number;
    phone: number;
    userId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type DirectorMinAggregateInputType = {
    id?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DirectorMaxAggregateInputType = {
    id?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type DirectorCountAggregateInputType = {
    id?: true;
    firstName?: true;
    lastName?: true;
    phone?: true;
    userId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type DirectorAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DirectorWhereInput;
    orderBy?: Prisma.DirectorOrderByWithRelationInput | Prisma.DirectorOrderByWithRelationInput[];
    cursor?: Prisma.DirectorWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DirectorCountAggregateInputType;
    _min?: DirectorMinAggregateInputType;
    _max?: DirectorMaxAggregateInputType;
};
export type GetDirectorAggregateType<T extends DirectorAggregateArgs> = {
    [P in keyof T & keyof AggregateDirector]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDirector[P]> : Prisma.GetScalarType<T[P], AggregateDirector[P]>;
};
export type DirectorGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DirectorWhereInput;
    orderBy?: Prisma.DirectorOrderByWithAggregationInput | Prisma.DirectorOrderByWithAggregationInput[];
    by: Prisma.DirectorScalarFieldEnum[] | Prisma.DirectorScalarFieldEnum;
    having?: Prisma.DirectorScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DirectorCountAggregateInputType | true;
    _min?: DirectorMinAggregateInputType;
    _max?: DirectorMaxAggregateInputType;
};
export type DirectorGroupByOutputType = {
    id: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: DirectorCountAggregateOutputType | null;
    _min: DirectorMinAggregateOutputType | null;
    _max: DirectorMaxAggregateOutputType | null;
};
export type GetDirectorGroupByPayload<T extends DirectorGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DirectorGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DirectorGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DirectorGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DirectorGroupByOutputType[P]>;
}>>;
export type DirectorWhereInput = {
    AND?: Prisma.DirectorWhereInput | Prisma.DirectorWhereInput[];
    OR?: Prisma.DirectorWhereInput[];
    NOT?: Prisma.DirectorWhereInput | Prisma.DirectorWhereInput[];
    id?: Prisma.StringFilter<"Director"> | string;
    firstName?: Prisma.StringFilter<"Director"> | string;
    lastName?: Prisma.StringFilter<"Director"> | string;
    phone?: Prisma.StringNullableFilter<"Director"> | string | null;
    userId?: Prisma.StringFilter<"Director"> | string;
    createdAt?: Prisma.DateTimeFilter<"Director"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Director"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type DirectorOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type DirectorWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId?: string;
    AND?: Prisma.DirectorWhereInput | Prisma.DirectorWhereInput[];
    OR?: Prisma.DirectorWhereInput[];
    NOT?: Prisma.DirectorWhereInput | Prisma.DirectorWhereInput[];
    firstName?: Prisma.StringFilter<"Director"> | string;
    lastName?: Prisma.StringFilter<"Director"> | string;
    phone?: Prisma.StringNullableFilter<"Director"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Director"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Director"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "userId">;
export type DirectorOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrderInput | Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.DirectorCountOrderByAggregateInput;
    _max?: Prisma.DirectorMaxOrderByAggregateInput;
    _min?: Prisma.DirectorMinOrderByAggregateInput;
};
export type DirectorScalarWhereWithAggregatesInput = {
    AND?: Prisma.DirectorScalarWhereWithAggregatesInput | Prisma.DirectorScalarWhereWithAggregatesInput[];
    OR?: Prisma.DirectorScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DirectorScalarWhereWithAggregatesInput | Prisma.DirectorScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Director"> | string;
    firstName?: Prisma.StringWithAggregatesFilter<"Director"> | string;
    lastName?: Prisma.StringWithAggregatesFilter<"Director"> | string;
    phone?: Prisma.StringNullableWithAggregatesFilter<"Director"> | string | null;
    userId?: Prisma.StringWithAggregatesFilter<"Director"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Director"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Director"> | Date | string;
};
export type DirectorCreateInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutDirectorInput;
};
export type DirectorUncheckedCreateInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DirectorUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutDirectorNestedInput;
};
export type DirectorUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DirectorCreateManyInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    userId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DirectorUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DirectorUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DirectorNullableScalarRelationFilter = {
    is?: Prisma.DirectorWhereInput | null;
    isNot?: Prisma.DirectorWhereInput | null;
};
export type DirectorCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DirectorMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DirectorMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    firstName?: Prisma.SortOrder;
    lastName?: Prisma.SortOrder;
    phone?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type DirectorCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.DirectorCreateWithoutUserInput, Prisma.DirectorUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.DirectorCreateOrConnectWithoutUserInput;
    connect?: Prisma.DirectorWhereUniqueInput;
};
export type DirectorUncheckedCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.DirectorCreateWithoutUserInput, Prisma.DirectorUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.DirectorCreateOrConnectWithoutUserInput;
    connect?: Prisma.DirectorWhereUniqueInput;
};
export type DirectorUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.DirectorCreateWithoutUserInput, Prisma.DirectorUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.DirectorCreateOrConnectWithoutUserInput;
    upsert?: Prisma.DirectorUpsertWithoutUserInput;
    disconnect?: Prisma.DirectorWhereInput | boolean;
    delete?: Prisma.DirectorWhereInput | boolean;
    connect?: Prisma.DirectorWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DirectorUpdateToOneWithWhereWithoutUserInput, Prisma.DirectorUpdateWithoutUserInput>, Prisma.DirectorUncheckedUpdateWithoutUserInput>;
};
export type DirectorUncheckedUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.DirectorCreateWithoutUserInput, Prisma.DirectorUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.DirectorCreateOrConnectWithoutUserInput;
    upsert?: Prisma.DirectorUpsertWithoutUserInput;
    disconnect?: Prisma.DirectorWhereInput | boolean;
    delete?: Prisma.DirectorWhereInput | boolean;
    connect?: Prisma.DirectorWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.DirectorUpdateToOneWithWhereWithoutUserInput, Prisma.DirectorUpdateWithoutUserInput>, Prisma.DirectorUncheckedUpdateWithoutUserInput>;
};
export type DirectorCreateWithoutUserInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DirectorUncheckedCreateWithoutUserInput = {
    id?: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type DirectorCreateOrConnectWithoutUserInput = {
    where: Prisma.DirectorWhereUniqueInput;
    create: Prisma.XOR<Prisma.DirectorCreateWithoutUserInput, Prisma.DirectorUncheckedCreateWithoutUserInput>;
};
export type DirectorUpsertWithoutUserInput = {
    update: Prisma.XOR<Prisma.DirectorUpdateWithoutUserInput, Prisma.DirectorUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.DirectorCreateWithoutUserInput, Prisma.DirectorUncheckedCreateWithoutUserInput>;
    where?: Prisma.DirectorWhereInput;
};
export type DirectorUpdateToOneWithWhereWithoutUserInput = {
    where?: Prisma.DirectorWhereInput;
    data: Prisma.XOR<Prisma.DirectorUpdateWithoutUserInput, Prisma.DirectorUncheckedUpdateWithoutUserInput>;
};
export type DirectorUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DirectorUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    firstName?: Prisma.StringFieldUpdateOperationsInput | string;
    lastName?: Prisma.StringFieldUpdateOperationsInput | string;
    phone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type DirectorSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["director"]>;
export type DirectorSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["director"]>;
export type DirectorSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["director"]>;
export type DirectorSelectScalar = {
    id?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    phone?: boolean;
    userId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type DirectorOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "firstName" | "lastName" | "phone" | "userId" | "createdAt" | "updatedAt", ExtArgs["result"]["director"]>;
export type DirectorInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DirectorIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type DirectorIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $DirectorPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Director";
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
    }, ExtArgs["result"]["director"]>;
    composites: {};
};
export type DirectorGetPayload<S extends boolean | null | undefined | DirectorDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DirectorPayload, S>;
export type DirectorCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DirectorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DirectorCountAggregateInputType | true;
};
export interface DirectorDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Director'];
        meta: {
            name: 'Director';
        };
    };
    findUnique<T extends DirectorFindUniqueArgs>(args: Prisma.SelectSubset<T, DirectorFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DirectorClient<runtime.Types.Result.GetResult<Prisma.$DirectorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DirectorFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DirectorFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DirectorClient<runtime.Types.Result.GetResult<Prisma.$DirectorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DirectorFindFirstArgs>(args?: Prisma.SelectSubset<T, DirectorFindFirstArgs<ExtArgs>>): Prisma.Prisma__DirectorClient<runtime.Types.Result.GetResult<Prisma.$DirectorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DirectorFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DirectorFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DirectorClient<runtime.Types.Result.GetResult<Prisma.$DirectorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DirectorFindManyArgs>(args?: Prisma.SelectSubset<T, DirectorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DirectorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DirectorCreateArgs>(args: Prisma.SelectSubset<T, DirectorCreateArgs<ExtArgs>>): Prisma.Prisma__DirectorClient<runtime.Types.Result.GetResult<Prisma.$DirectorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DirectorCreateManyArgs>(args?: Prisma.SelectSubset<T, DirectorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DirectorCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DirectorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DirectorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DirectorDeleteArgs>(args: Prisma.SelectSubset<T, DirectorDeleteArgs<ExtArgs>>): Prisma.Prisma__DirectorClient<runtime.Types.Result.GetResult<Prisma.$DirectorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DirectorUpdateArgs>(args: Prisma.SelectSubset<T, DirectorUpdateArgs<ExtArgs>>): Prisma.Prisma__DirectorClient<runtime.Types.Result.GetResult<Prisma.$DirectorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DirectorDeleteManyArgs>(args?: Prisma.SelectSubset<T, DirectorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DirectorUpdateManyArgs>(args: Prisma.SelectSubset<T, DirectorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DirectorUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DirectorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DirectorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DirectorUpsertArgs>(args: Prisma.SelectSubset<T, DirectorUpsertArgs<ExtArgs>>): Prisma.Prisma__DirectorClient<runtime.Types.Result.GetResult<Prisma.$DirectorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DirectorCountArgs>(args?: Prisma.Subset<T, DirectorCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DirectorCountAggregateOutputType> : number>;
    aggregate<T extends DirectorAggregateArgs>(args: Prisma.Subset<T, DirectorAggregateArgs>): Prisma.PrismaPromise<GetDirectorAggregateType<T>>;
    groupBy<T extends DirectorGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DirectorGroupByArgs['orderBy'];
    } : {
        orderBy?: DirectorGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DirectorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDirectorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DirectorFieldRefs;
}
export interface Prisma__DirectorClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DirectorFieldRefs {
    readonly id: Prisma.FieldRef<"Director", 'String'>;
    readonly firstName: Prisma.FieldRef<"Director", 'String'>;
    readonly lastName: Prisma.FieldRef<"Director", 'String'>;
    readonly phone: Prisma.FieldRef<"Director", 'String'>;
    readonly userId: Prisma.FieldRef<"Director", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Director", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Director", 'DateTime'>;
}
export type DirectorFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DirectorSelect<ExtArgs> | null;
    omit?: Prisma.DirectorOmit<ExtArgs> | null;
    include?: Prisma.DirectorInclude<ExtArgs> | null;
    where: Prisma.DirectorWhereUniqueInput;
};
export type DirectorFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DirectorSelect<ExtArgs> | null;
    omit?: Prisma.DirectorOmit<ExtArgs> | null;
    include?: Prisma.DirectorInclude<ExtArgs> | null;
    where: Prisma.DirectorWhereUniqueInput;
};
export type DirectorFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DirectorSelect<ExtArgs> | null;
    omit?: Prisma.DirectorOmit<ExtArgs> | null;
    include?: Prisma.DirectorInclude<ExtArgs> | null;
    where?: Prisma.DirectorWhereInput;
    orderBy?: Prisma.DirectorOrderByWithRelationInput | Prisma.DirectorOrderByWithRelationInput[];
    cursor?: Prisma.DirectorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DirectorScalarFieldEnum | Prisma.DirectorScalarFieldEnum[];
};
export type DirectorFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DirectorSelect<ExtArgs> | null;
    omit?: Prisma.DirectorOmit<ExtArgs> | null;
    include?: Prisma.DirectorInclude<ExtArgs> | null;
    where?: Prisma.DirectorWhereInput;
    orderBy?: Prisma.DirectorOrderByWithRelationInput | Prisma.DirectorOrderByWithRelationInput[];
    cursor?: Prisma.DirectorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DirectorScalarFieldEnum | Prisma.DirectorScalarFieldEnum[];
};
export type DirectorFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DirectorSelect<ExtArgs> | null;
    omit?: Prisma.DirectorOmit<ExtArgs> | null;
    include?: Prisma.DirectorInclude<ExtArgs> | null;
    where?: Prisma.DirectorWhereInput;
    orderBy?: Prisma.DirectorOrderByWithRelationInput | Prisma.DirectorOrderByWithRelationInput[];
    cursor?: Prisma.DirectorWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DirectorScalarFieldEnum | Prisma.DirectorScalarFieldEnum[];
};
export type DirectorCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DirectorSelect<ExtArgs> | null;
    omit?: Prisma.DirectorOmit<ExtArgs> | null;
    include?: Prisma.DirectorInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DirectorCreateInput, Prisma.DirectorUncheckedCreateInput>;
};
export type DirectorCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DirectorCreateManyInput | Prisma.DirectorCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DirectorCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DirectorSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DirectorOmit<ExtArgs> | null;
    data: Prisma.DirectorCreateManyInput | Prisma.DirectorCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.DirectorIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type DirectorUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DirectorSelect<ExtArgs> | null;
    omit?: Prisma.DirectorOmit<ExtArgs> | null;
    include?: Prisma.DirectorInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DirectorUpdateInput, Prisma.DirectorUncheckedUpdateInput>;
    where: Prisma.DirectorWhereUniqueInput;
};
export type DirectorUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DirectorUpdateManyMutationInput, Prisma.DirectorUncheckedUpdateManyInput>;
    where?: Prisma.DirectorWhereInput;
    limit?: number;
};
export type DirectorUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DirectorSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DirectorOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DirectorUpdateManyMutationInput, Prisma.DirectorUncheckedUpdateManyInput>;
    where?: Prisma.DirectorWhereInput;
    limit?: number;
    include?: Prisma.DirectorIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type DirectorUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DirectorSelect<ExtArgs> | null;
    omit?: Prisma.DirectorOmit<ExtArgs> | null;
    include?: Prisma.DirectorInclude<ExtArgs> | null;
    where: Prisma.DirectorWhereUniqueInput;
    create: Prisma.XOR<Prisma.DirectorCreateInput, Prisma.DirectorUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DirectorUpdateInput, Prisma.DirectorUncheckedUpdateInput>;
};
export type DirectorDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DirectorSelect<ExtArgs> | null;
    omit?: Prisma.DirectorOmit<ExtArgs> | null;
    include?: Prisma.DirectorInclude<ExtArgs> | null;
    where: Prisma.DirectorWhereUniqueInput;
};
export type DirectorDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DirectorWhereInput;
    limit?: number;
};
export type DirectorDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DirectorSelect<ExtArgs> | null;
    omit?: Prisma.DirectorOmit<ExtArgs> | null;
    include?: Prisma.DirectorInclude<ExtArgs> | null;
};
