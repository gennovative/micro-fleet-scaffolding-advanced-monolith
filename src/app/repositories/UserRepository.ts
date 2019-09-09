/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('scaffold:repo:user')

import { QueryBuilder } from 'objection'
import { TenantId, decorators as cd } from '@micro-fleet/common'
import * as p from '@micro-fleet/persistence'

import { User } from '../models/domain/User'
import { UserORM } from '../models/orm/UserORM'


/*
 * Provides methods to manage users.
 */
export interface IUserRepository extends p.IRepository<User, TenantId> {

}

export class UserRepository
    extends p.PgCrudRepositoryBase<UserORM, User>
    implements IUserRepository {

    constructor(
        @cd.inject(p.Types.DB_CONNECTOR) connector: p.IDatabaseConnector,
    ) {
        super(UserORM, User, connector)
        debug('UserRepository instantiated')
    }

    /**
     * @override
     */
    protected $buildFindByIdQuery(query: QueryBuilder<UserORM>, id: TenantId,
            opts: p.RepositoryFindOptions): p.QueryCallbackReturn {
        const q = query.findById(id.toArray())
        if (opts.relations && opts.relations['tenant']) {
            q.eager(
                {
                    tenant: {
                        $relation: 'tenant',
                        $modify: ['selectName'],
                    },
                },
                {
                    selectName: (builder) => builder.select('name'),
                },
            )
        }
        opts.fields && q.select(opts.fields)
        return q
    }

}
