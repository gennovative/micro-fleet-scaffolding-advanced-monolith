import { Translatable } from '@micro-fleet/common'


export class Tenant extends Translatable {

    public id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
    public name: string = undefined
    public slug: string = undefined

}
