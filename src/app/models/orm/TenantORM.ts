import { Model } from 'objection'
import { decorators as d } from '@micro-fleet/common'
import { ORMModelBase } from '@micro-fleet/persistence'

import { momentify, toUtcTimeString } from '../../utils/date-utils'


@d.translatable()
export class TenantORM extends ORMModelBase {

    public id: string = undefined // Must be initialized, otherwise TypeScript compiler will remove it
    public name: string = undefined
    public slug: string = undefined
    public createdAt: string = undefined
    public updatedAt: string = undefined
    public users: Array<import('./UserORM').UserORM> = undefined


    /**
     * @override
     */
    public static get tableName(): string {
        return 'public.mcft_tenants'
    }

    /**
     * [ObjectionJS]
     */
    public static relationMappings(): any {
        const { UserORM } = require('./UserORM')
        return {
            // Relation name must be the same with property "users"
            users: {
                relation: Model.HasManyRelation,
                modelClass: UserORM,
                join: {
                    from: [
                        `${TenantORM.tableName}.id`,
                    ],
                    to: [
                        // tenantId or tenant_id is both OK,
                        // since @micro-fleet/persistence's Connector has configured Knex
                        // to transform snake case to camel case and vice versa.
                        `${UserORM.tableName}.tenantId`,
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
