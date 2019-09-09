/// <reference types="debug" />
const debug: debug.IDebugger = require('debug')('scaffold:ctrl:user')

import { decorators as cd, TenantId } from '@micro-fleet/common'
import { decorators as wd, Request, Response, RestControllerBase } from '@micro-fleet/web'
import { SortType, Types as pT, AtomicSessionFactory, AtomicSession } from '@micro-fleet/persistence'

import { Types as T } from '../constants/Types'
import { User } from '../models/domain/User'
import { IUserRepository } from '../repositories/UserRepository'


@wd.controller('users')
export default class UserController extends RestControllerBase {

    constructor(
        @cd.inject(T.USER_REPO) private _userRepo: IUserRepository,
        @cd.inject(pT.ATOMIC_SESSION_FACTORY) private _sessionFactory: AtomicSessionFactory,
    ) {
        super()
        debug('UserController instantiated')
    }

    /**
     * GET {prefix}/users/:id
     * @example /api/v1/users/123654
     */
    @wd.GET(':id')
    public getOne(@wd.param('id') id: string, @wd.extras('tenantId') tenantId: string) {
        return this._userRepo.findById(new TenantId(id, tenantId))
    }

    /**
     * GET {prefix}/users/
     * @example /api/v1/users?pageIndex=2&pageSize=10
     */
    @wd.GET('/')
    public getList(
        @wd.query('pageIndex') index: number,
        @wd.query('pageSize') size: number,
        @wd.extras('tenantId') tenantId: string,
    ) {
        return this._userRepo.page({
            pageIndex: index,
            pageSize: size,
            fields: ['id', 'name'],
            sortBy: 'name',
            sortType: SortType.DESC,
            tenantId,
        })
    }

    /**
     * POST {prefix}/users
     * @example /api/v1/users
     *
     * Request body for creating a single user:
     * {
     *    name: 'John Nemo',
     * }
     *
     * or
     *
     * {
     *    name: 'John Nemo',
     *    status: 'active',
     * }
     */
    @wd.POST('/')
    public async create(
        @wd.model({
            postProcessFn: (m: User, r: Request) => m.tenantId = r.extras.tenantId,
        }) user: User,
        @wd.response() res: Response
    ) {
        const result = await this._userRepo.create(user)
        return this.created(res, result)
    }

    /**
     * POST {prefix}/users/many
     * @example /api/v1/users/many
     *
     * Request body for creating multiple users:
     * [
     *   {
     *      name: 'John Nemo',
     *   },
     *   {
     *      name: 'Capt. Doe',
     *      status: 'active',
     *   }
     * ]
     */
    @wd.POST('/many')
    public async createMany(
        @wd.model({
            ItemClass: User,
            postProcessFn: (m: User, r: Request) => m.tenantId = r.extras.tenantId,
        }) users: User[],
        @wd.response() res: Response
    ) {
        // Starts a transaction
        // Making sure all users are either created or not created.
        const results = await this._sessionFactory.startSession()
            .pipe((atomicSession: AtomicSession) => {
                return this._userRepo.createMany(users, { atomicSession })
            })
            .closePipe()
        return this.created(res, results)
    }

    /**
     * PATCH {prefix}/users
     * @example /api/v1/users
     *
     * {
     *    id: '123498765',
     *    name: 'Nemo Doe',
     * }
     */
    @wd.PATCH('/')
    public edit(
        @wd.model({
            isPartial: true,
            ItemClass: User,
            postProcessFn: (m: User, r: Request) => m.tenantId = r.extras.tenantId,
        }) user: Partial<User>,
    ) {
        return this._userRepo.patch(user)
    }

    /**
     * DELETE {prefix}/users/:id
     * @example /api/v1/users/123654
     */
    @wd.DELETE(':id')
    public delete(@wd.param('id') id: string, @wd.extras('tenantId') tenantId: string) {
        return this._userRepo.deleteSingle(new TenantId(id, tenantId))
    }
}
