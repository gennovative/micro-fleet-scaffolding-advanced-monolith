/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('scaffold:repo:tenant')

import { decorators as d, Maybe } from '@micro-fleet/common'
import { IRepository, PgCrudRepositoryBase, IDatabaseConnector, Types as T } from '@micro-fleet/persistence'

import { Tenant } from '../models/domain/Tenant'
import { TenantORM } from '../models/orm/TenantORM'


/*
 * Provides methods to manage tenants.
 */
export interface ITenantRepository extends IRepository<Tenant> {
    /*
     * Looks up a tenant by its slug.
     */
    findBySlug(slug: string): Promise<Maybe<Tenant>>
}

export class TenantRepository
    extends PgCrudRepositoryBase<TenantORM, Tenant>
    implements ITenantRepository {

    constructor(
        @d.inject(T.DB_CONNECTOR) connector: IDatabaseConnector,
    ) {
        super(TenantORM, Tenant, connector)
        debug('TenantRepository instantiated')
    }

    /**
     * @see ITenantRepository.findBySlug
     */
    public async findBySlug(slug: string): Promise<Maybe<Tenant>> {
        const result: TenantORM[] = await this.executeQuery(query => {
            const q = query.where('slug', slug)
            debug('findBySlug: %s', q.toSql())
            return q
        })
        if (!result) {
            return Maybe.Nothing()
        }
        return Maybe.Just(this.toDomainModel(result[0], false))
    }
}
