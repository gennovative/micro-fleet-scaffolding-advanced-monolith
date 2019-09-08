/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('scaffold:repo:user')

import { decorators as cd } from '@micro-fleet/common'
import { IRepository, PgCrudRepositoryBase, IDatabaseConnector, Types as T } from '@micro-fleet/persistence'

import { User } from '../models/domain/User'
import { UserORM } from '../models/orm/UserORM'


/*
 * Provides methods to manage users.
 */
export interface IUserRepository extends IRepository<User> {
    // Extra methods to manipulate user
}

export class UserRepository
    extends PgCrudRepositoryBase<UserORM, User>
    implements IUserRepository {

    constructor(
        @cd.inject(T.DB_CONNECTOR) connector: IDatabaseConnector,
    ) {
        super(UserORM, User, connector)
        debug('UserRepository instantiated')
    }

    // Implemenent extra methods here
}
