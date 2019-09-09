import * as joi from '@hapi/joi'

import { Translatable, decorators as d } from '@micro-fleet/common'

import { UserStatus } from '../domain/User'
import { ResultResponse, MaybeResponse, GetListRequestBase, DTOListBase } from './dto-base'


const USER_FIELDS = [ 'id', 'name', 'status', 'tenantName']
const FIELDS_RULE = { items: joi.string().only(USER_FIELDS) }


//#region Create

export class CreateUserRequest extends Translatable {

    @d.required()
    @d.string({ minLength: 3, maxLength: 100 })
    public readonly name: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it

    @d.required()
    @d.only(UserStatus.ACTIVE, UserStatus.LOCKED, UserStatus.DELETED)
    public readonly status: string = undefined

    @d.required()
    @d.bigInt()
    public readonly tenantId: string = undefined
}

export class CreateUserResponse extends ResultResponse {
    public id: string
    public createdAt: string
}

//#endregion Create


//#region Delete

export class DeleteUserRequest extends Translatable {

    @d.required()
    @d.array({
        items: joi.string().regex(/\d+/).required(),
        allowSingle: true,
        maxLength: 10,
    })
    public readonly ids: string[] = undefined

    /**
     * If `true`, when failed to delete one ID, the whole operation is
     * considered failure, all changes are rolled back.
     *
     * Default is `true`
     */
    @d.boolean()
    public readonly isAtomic?: boolean = undefined
}

export class DeleteUserResponse extends ResultResponse {
    public deletedAt: string
}

//#endregion Delete


//#region Edit

export class EditUserRequest extends Translatable {

    @d.required()
    @d.bigInt()
    public readonly id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it

    @d.string({ minLength: 3, maxLength: 100 })
    public readonly name?: string = undefined
}

export class EditUserResponse extends ResultResponse {
    public updatedAt: string
}

//#endregion Edit


//#region Get by ID

export class GetUserByIdRequest extends Translatable {
    @d.required()
    @d.bigInt()
    public readonly id: string = undefined

    @d.array(FIELDS_RULE)
    public readonly fields?: string[] = undefined
}

export class GetSingleUserResponse extends MaybeResponse {

    public id: string = undefined
    public name?: string = undefined
    public status?: string = undefined
    public tenantName?: string = undefined
}

//#endregion Get by ID


//#region Count

export class CountUserRequest extends Translatable {
    @d.required()
    @d.bigInt()
    public readonly tenantId: string = undefined
}

export class CountUserResponse {
    constructor(
        public total: number,
    ) {
    }
}

//#endregion Count


//#region Get List

export class GetUserListRequest extends GetListRequestBase {

    @d.array(FIELDS_RULE)
    public readonly fields?: string[] = undefined
}

export class UserListItem extends Translatable {

    public id: string = undefined
    public name?: string = undefined
    public status?: string = undefined
}

export class GetUserListResponse extends DTOListBase<UserListItem> {
    public constructor(users: object[], total: number) {
        super(UserListItem, users, total)
    }
}

//#endregion Get List
