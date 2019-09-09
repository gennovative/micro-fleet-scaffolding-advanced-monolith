import { Model } from 'objection'
import { decorators as d } from '@micro-fleet/common'
import { ORMModelBase } from '@micro-fleet/persistence'

import { UserStatus } from '../domain/User'
import { momentify, toUtcTimeString } from '../../utils/date-utils'


@d.translatable()
export class UserORM extends ORMModelBase {

    public id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
    public tenantId: string = undefined
    public name: string = undefined
    public status: UserStatus = undefined
    public createdAt: string = undefined
    public updatedAt: string = undefined

    // Use ad-hoc import to avoid circular imports
    public tenant?: import('./TenantORM').TenantORM = undefined


    /**
     * @override
     */
    public static get tableName(): string {
        return 'public.mcft_users'
    }

    /**
     * [ObjectionJS]
     * @override
     */
    public static readonly idColumn = ['id', 'tenantId']
    // "tenantId" or "tenant_id" is both OK,
    // since @micro-fleet/persistence's Connector has configured Knex
    // to transform snake case to camel case and vice versa.

    /**
     * [ObjectionJS]
     */
    public static relationMappings(): any {
        const { TenantORM } = require('./TenantORM')
        return {
            // Relation name must be the same with property "tenant"
            tenant: {
                relation: Model.BelongsToOneRelation,
                modelClass: TenantORM,
                join: {
                    from: [
                        `${UserORM.tableName}.tenantId`,
                    ],
                    to: [
                        `${TenantORM.tableName}.id`,
                    ],
                },
            },
        }
    }


    /**
     * [ObjectionJS]
     */
    public $beforeInsert(queryContext: any) {
        super.$beforeInsert(queryContext)
        this.createdAt = momentify().format()
    }

    /**
     * [ObjectionJS]
     */
    public $beforeUpdate(opt: any, queryContext: any) {
        super.$beforeUpdate(opt, queryContext)
        this.updatedAt = momentify().format()
    }

    /**
     * [ObjectionJS]
     * This method converts the JSON object from the database format
     * to the entity class.
     */
    public $parseDatabaseJson(json: any) {
        json = super.$parseDatabaseJson(json)
        return {
            ...json,
            createdAt: toUtcTimeString(json.createdAt),
            updatedAt: toUtcTimeString(json.updatedAt),
        }
    }
}
