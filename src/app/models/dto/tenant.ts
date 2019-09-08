
import { Translatable, decorators as d } from '@micro-fleet/common'
import { ResultResponse } from './dto-base'


export class CreateTenantRequest extends Translatable {

    @d.required()
    @d.string({ minLength: 3, maxLength: 100 })
    public readonly name: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it

    @d.required()
    @d.string({
        minLength: 3,
        maxLength: 100,
        pattern: /^[a-z][a-z0-9]+$/, // Must begin with a letter. Only allows lowercase alphanumeric characters.
    })
    public readonly slug: string = undefined
}

export class CreateTenantResponse extends ResultResponse<CreateTenantResponse> {
    public id: string
    public createdAt: string
}
