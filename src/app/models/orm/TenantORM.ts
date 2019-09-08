import { decorators as d } from '@micro-fleet/common'
import { ORMModelBase } from '@micro-fleet/persistence'


@d.translatable()
export class TenantORM extends ORMModelBase {

    public id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
    public name: string = undefined
    public slug: string = undefined


    /**
     * @override
     */
    public static get tableName(): string {
        return 'public.mcft_tenants'
    }

}
