import * as joi from '@hapi/joi'

import { Translatable, decorators as d } from '@micro-fleet/common'
import { ResultResponse, MaybeResponse, GetListRequestBase, DTOListBase } from './dto-base'


const SLUG_RULE = {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-z][a-z0-9]+$/, // Must begin with a letter. Only allows lowercase alphanumeric characters.
}
const TENANT_FIELDS = [ 'id', 'name', 'slug']
const FIELDS_RULE = { items: joi.string().only(TENANT_FIELDS) }


//#region Create

export class CreateTenantRequest extends Translatable {

    @d.required()
    @d.string({ minLength: 3, maxLength: 100 })
    public readonly name: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it

    @d.required()
    @d.string(SLUG_RULE)
    public readonly slug: string = undefined
}

export class CreateTenantResponse extends ResultResponse {
    public id: string
    public createdAt: string
}

//#endregion Create


//#region Delete

export class DeleteTenantRequest extends Translatable {

    @d.required()
    @d.array({
        items: joi.string().regex(/\d+/).required(),
        allowSingle: true,
        maxLength: 10,
    })
    public readonly ids: string[] = undefined

    /**
     * If `true`, all associated users are deleted also.
     * If `false`, the operation will fail when the tenant is
     *    referenced by at least one user.
     *
     * Default is `false`
     */
    @d.boolean()
    public readonly isCascading?: boolean = undefined

    /**
     * If `true`, when failed to delete one ID, the whole operation is
     * considered failure, all changes are rolled back.
     *
     * Default is `true`
     */
    @d.boolean()
    public readonly isAtomic?: boolean = undefined
}

export class DeleteTenantResponse extends ResultResponse {
    public deletedAt: string
}

//#endregion Delete


//#region Edit

export class EditTenantRequest extends Translatable {

    @d.required()
    @d.bigInt()
    public readonly id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it

    @d.string({ minLength: 3, maxLength: 100 })
    public readonly name?: string = undefined

    @d.string(SLUG_RULE)
    public readonly slug?: string = undefined
}

export class EditTenantResponse extends ResultResponse {
    public updatedAt: string
}

//#endregion Edit


//#region Exist

export class ExistTenantRequest extends Translatable {

    @d.required()
    @d.bigInt()
    public readonly id: string = undefined
}

export class ExistTenantResponse {
    constructor(
        public isExisting: boolean
    ) {
    }
}

//#endregion Exist


//#region Get by ID

export class GetTenantByIdRequest extends Translatable {
    @d.required()
    @d.bigInt()
    public readonly id: string = undefined

    @d.array(FIELDS_RULE)
    public readonly fields?: string[] = undefined
}

export class GetTenantBySlugRequest extends Translatable {
    @d.required()
    @d.string(SLUG_RULE)
    public readonly slug: string = undefined

    @d.array(FIELDS_RULE)
    public readonly fields?: string[] = undefined
}

export class GetSingleTenantResponse extends MaybeResponse {

    public id: string = undefined
    public name?: string = undefined
    public slug?: string = undefined
}

//#endregion Get by ID


//#region Get List

export class GetTenantListRequest extends GetListRequestBase {

    @d.array(FIELDS_RULE)
    public readonly fields?: string[] = undefined
}

export class TenantListItem extends Translatable {

    public id: string = undefined
    public name?: string = undefined
    public slug?: string = undefined
}

export class GetTenantListResponse extends DTOListBase<TenantListItem> {
    public constructor(tenants: object[], total: number) {
        super(TenantListItem, tenants, total)
    }
}

//#endregion Get List
