import { decorators as d } from '@micro-fleet/common'
import { ORMModelBase } from '@micro-fleet/persistence'


export enum UserStatus { ACTIVE = 'active', LOCKED = 'locked', DELETED = 'deleted' }

@d.translatable()
export class UserORM extends ORMModelBase {

    public id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
    public name: string = undefined
    public status: UserStatus = undefined


    /**
     * @override
     */
    public static get tableName(): string {
        return 'public.mcft_users'
    }

}
