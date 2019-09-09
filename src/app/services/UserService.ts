import { Maybe, decorators as d, TenantId } from '@micro-fleet/common'
import { AtomicSessionFactory, Types as pT, RepositoryFindOptions } from '@micro-fleet/persistence'

import { Types as T } from '../constants/Types'
import { User } from '../models/domain/User'
import * as dto from '../models/dto/user'
import { IUserRepository } from '../repositories/UserRepository'
import { ManagementServiceBase } from './ManagementServiceBase'
import { ITenantService } from './TenantService'


/**
 * Provides methods for common CRUD operations
 */
export interface IUserService {

    /**
     * Counts number of all users by tenant ID
     */
    count(params: dto.CountUserRequest): Promise<dto.CountUserResponse>

    /**
     * Creates new user
     */
    create(params: dto.CreateUserRequest): Promise<dto.CreateUserResponse>

    /**
     * Modifies some properties of a user
     */
    edit(params: dto.EditUserRequest): Promise<dto.EditUserResponse>

    /**
     * Gets a user's details
     */
    getById(params: dto.GetUserByIdRequest): Promise<dto.GetSingleUserResponse>

    /**
     * Gets a paged list of tenants
     */
    getList(params: dto.GetUserListRequest): Promise<dto.GetUserListResponse>

    /**
     * Permanently deletes a user and optionally its associated users.
     */
    hardDeleteSingle(params: dto.DeleteUserRequest): Promise<dto.DeleteUserResponse>

    /**
     * Permanently deletes many tenants and optionally their associated users.
     */
    hardDeleteMany(params: dto.DeleteUserRequest): Promise<dto.DeleteUserResponse>
}


export class UserService
    extends ManagementServiceBase<User>
    implements IUserService {

    constructor(
        @d.inject(T.TENANT_SVC) private _tenantSvc: ITenantService,
        @d.inject(T.USER_REPO) repo: IUserRepository,
        @d.inject(pT.ATOMIC_SESSION_FACTORY) sessionFactory: AtomicSessionFactory,
    ) {
        super(User, repo, sessionFactory)
    }


    /**
     * @see IUserService.count
     */
    public async count(params: dto.CountUserRequest): Promise<dto.CountUserResponse> {
        return new dto.CountUserResponse(
            await this.$repo.countAll({ tenantId: params.tenantId })
        )
    }

    //#region Create

    /**
     * @see IUserService.create
     */
    public create(params: dto.CreateUserRequest): Promise<dto.CreateUserResponse> {
        return this.$create(params, dto.CreateUserResponse)
    }

    /**
     * @override
     */
    protected async $checkCreateViolation(params: dto.CreateUserRequest): Promise<Maybe<string>> {
        if (await this._tenantSvc.exists({ id: params.tenantId })) {
            return Maybe.Just('TENANT_NOT_EXISTING')
        }
        return Maybe.Nothing()
    }

    //#endregion Create


    //#region Edit

    /**
     * @see IUserService.edit
     */
    public async edit(params: dto.EditUserRequest): Promise<dto.EditUserResponse> {
        return this.$edit(params, dto.EditUserResponse)
    }

    /**
     * @override
     */
    protected $checkEditViolation(params: dto.EditUserRequest): Promise<Maybe> {
        return Promise.resolve(Maybe.Nothing())
    }

    //#endregion Edit


    //#region Delete

    /**
     * @see IUserService.hardDeleteSingle
     */
    public async hardDeleteSingle(params: dto.DeleteUserRequest): Promise<dto.DeleteUserResponse> {
        return this.$hardDeleteSingle(
            params,
            dto.DeleteUserResponse,
            (p) => new TenantId(p.ids[0], p.tenantId),
        )
    }

    /**
     * @see IUserService.hardDeleteMany
     */
    public async hardDeleteMany(params: dto.DeleteUserRequest): Promise<dto.DeleteUserResponse> {
        return this.$hardDeleteMany(
            params,
            dto.DeleteUserResponse,
            (p) => params.ids.map(id => new TenantId(id, p.tenantId))
        )
    }

    /**
     * @override
     */
    protected $checkDeleteManyViolation(params: dto.DeleteUserRequest): Promise<Maybe> {
        return Promise.resolve(Maybe.Nothing())
    }

    //#endregion Delete


    //#region Get

    /**
     * @see IUserService.getById
     */
    public async getById(params: dto.GetUserByIdRequest): Promise<dto.GetSingleUserResponse> {
        const repoParams: dto.GetUserByIdRequest & RepositoryFindOptions = this._rebuildGetParams(params)
        return this.$getById(
            repoParams,
            dto.GetSingleUserResponse,
            (p) => new TenantId(p.ids[0], p.tenantId),
        )
    }

    /**
     * @see IUserService.getList
     */
    public async getList(params: dto.GetUserListRequest): Promise<dto.GetUserListResponse> {
        return this.$getList(params, dto.GetUserListResponse)
    }

    private _rebuildGetParams<U extends { fields?: string[] }>(params: U): U & RepositoryFindOptions {
        if (params.fields && params.fields.includes('tenantName')) {
            return {
                ...params,
                // Remove "tenantName" because it isn't a table column
                fields: params.fields.filter(f => f !== 'tenantName'),
                // ObjectionJS relation object expression
                relations: {
                    tenant: ['name'],
                },
            }
        }
        return params
    }

    //#endregion Get

}
