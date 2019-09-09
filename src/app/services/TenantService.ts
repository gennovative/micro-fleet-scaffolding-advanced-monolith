import { Maybe, decorators as d } from '@micro-fleet/common'
import { AtomicSessionFactory, Types as pT } from '@micro-fleet/persistence'

import { Types as T } from '../constants/Types'
import { Tenant } from '../models/domain/Tenant'
import * as dto from '../models/dto/tenant'
import { ITenantRepository } from '../repositories/TenantRepository'
import { ManagementServiceBase } from './ManagementServiceBase'
import { IUserService } from './UserService'


/**
 * Provides methods for common CRUD operations
 */
export interface ITenantService {
    /**
     * Creates new tenant
     */
    create(params: dto.CreateTenantRequest): Promise<dto.CreateTenantResponse>

    /**
     * Modifies some properties of a tenant
     */
    edit(params: dto.EditTenantRequest): Promise<dto.EditTenantResponse>

    /**
     * Checks if a tenant with specified slug exists
     */
    exists(params: dto.ExistTenantRequest): Promise<dto.ExistTenantResponse>

    /**
     * Gets a tenant's details by ID
     */
    getById(params: dto.GetTenantByIdRequest): Promise<dto.GetSingleTenantResponse>

    /**
     * Gets a tenant's details by slug
     */
    getBySlug(params: dto.GetTenantBySlugRequest): Promise<dto.GetSingleTenantResponse>

    /**
     * Gets a paged list of tenants
     */
    getList(params: dto.GetTenantListRequest): Promise<dto.GetTenantListResponse>

    /**
     * Permanently deletes a tenant and optionally its associated users.
     */
    hardDeleteSingle(params: dto.DeleteTenantRequest): Promise<dto.DeleteTenantResponse>

    /**
     * Permanently deletes many tenants and optionally their associated users.
     */
    hardDeleteMany(params: dto.DeleteTenantRequest): Promise<dto.DeleteTenantResponse>
}


export class TenantService
    extends ManagementServiceBase<Tenant>
    implements ITenantService {

    // Lazy injection to avoid circular dependency in constructor
    @d.lazyInject(T.USER_SVC)
    private _userSvc: IUserService

    constructor(
        @d.inject(T.TENANT_REPO) repo: ITenantRepository,
        @d.inject(pT.ATOMIC_SESSION_FACTORY) sessionFactory: AtomicSessionFactory,
    ) {
        super(Tenant, repo, sessionFactory)
    }


    //#region Create

    /**
     * @see ITenantService.create
     */
    public create(params: dto.CreateTenantRequest): Promise<dto.CreateTenantResponse> {
        return this.$create(params, dto.CreateTenantResponse)
    }

    /**
     * @override
     */
    protected async $checkCreateViolation(params: dto.CreateTenantRequest): Promise<Maybe<string>> {
        if (await this.$repo.exists({ slug: params.slug })) {
            return Maybe.Just('TENANT_SLUG_ALREADY_EXISTS')
        }
        return Maybe.Nothing()
    }

    //#endregion Create


    //#region Edit

    /**
     * @see ITenantService.edit
     */
    public async edit(params: dto.EditTenantRequest): Promise<dto.EditTenantResponse> {
        return this.$edit(params, dto.EditTenantResponse)
    }

    /**
     * @override
     */
    protected $checkEditViolation(params: dto.EditTenantRequest): Promise<Maybe> {
        return Promise.resolve(Maybe.Nothing())
    }

    //#endregion Edit


    /**
     * @see ITenantService.exists
     */
    public async exists(params: dto.ExistTenantRequest): Promise<dto.ExistTenantResponse> {
        return new dto.ExistTenantResponse(
            await this.$repo.exists(params)
        )
    }


    //#region Delete

    /**
     * @see ITenantService.hardDeleteSingle
     */
    public async hardDeleteSingle(params: dto.DeleteTenantRequest): Promise<dto.DeleteTenantResponse> {
        return this.$hardDeleteSingle(params, dto.DeleteTenantResponse)
    }

    /**
     * @override
     */
    protected async $checkDeleteSingleViolation(params: dto.DeleteTenantRequest): Promise<Maybe> {
        if (params.isCascading) {
            const result = await this._userSvc.count({ tenantId: params.ids[0] })
            return (result.total > 0) ? Maybe.Just('TENANT_IS_ASSOCIATED_BY_USERS') : Maybe.Nothing()
        }
        return Maybe.Nothing()
    }

    /**
     * @see ITenantService.hardDeleteMany
     */
    public async hardDeleteMany(params: dto.DeleteTenantRequest): Promise<dto.DeleteTenantResponse> {
        return this.$hardDeleteMany(params, dto.DeleteTenantResponse)
    }

    /**
     * @override
     */
    protected $checkDeleteManyViolation(params: dto.DeleteTenantRequest): Promise<Maybe> {
        return Promise.resolve(Maybe.Nothing())
    }

    //#endregion Delete


    //#region Get

    /**
     * @see ITenantService.getById
     */
    public async getById(params: dto.GetTenantByIdRequest): Promise<dto.GetSingleTenantResponse> {
        return this.$getById(params, dto.GetSingleTenantResponse)
    }

    /**
     * @see ITenantService.getBySlug
     */
    public async getBySlug(params: dto.GetTenantBySlugRequest): Promise<dto.GetSingleTenantResponse> {
        return this.$getById(params, dto.GetSingleTenantResponse)
    }

    /**
     * @see ITenantService.getList
     */
    public async getList(params: dto.GetTenantListRequest): Promise<dto.GetTenantListResponse> {
        return this.$getList(params, dto.GetTenantListResponse)
    }

    //#endregion Get

}
