import { Translatable } from '@micro-fleet/common'


export enum UserStatus { ACTIVE = 'active', LOCKED = 'locked', DELETED = 'deleted' }

export class User extends Translatable {

    public id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
    public name: string = undefined
    public status: UserStatus = undefined
}
