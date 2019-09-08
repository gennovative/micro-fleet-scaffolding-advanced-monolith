import { PagedData, TenantId, Maybe,
    decorators as d } from '@micro-fleet/common'
import { AtomicSessionFactory, AtomicSession, RepositoryFindOptions, Types as pT } from '@micro-fleet/persistence'

import { Types as T } from '../constants/Types'
import { ResultResponseConstructor, MaybeResponseConstructor, ListResponseConstructor,
    IAtomicRequest, IMultiIds } from '../models/dto/dto-base'
import { Tenant } from '../models/domain/Tenant'
import * as dto from '../models/dto/tenant'
import { momentify } from '../utils/date-utils'
import { ManagementServiceBase } from './ManagementServiceBase'
import { ITenantRepository } from '../repositories/TenantRepository'


/**
 * Provides methods for common CRUD operations
 */
@d.injectable()
export class TenantService extends ManagementServiceBase<Tenant> {

    constructor(
        @d.inject(T.TENANT_REPO) repo: ITenantRepository,
        @d.inject(pT.ATOMIC_SESSION_FACTORY) sessionFactory: AtomicSessionFactory,
    ) {
        super(Tenant, repo, sessionFactory)
    }


    //#region Create

    public create(params: dto.CreateTenantRequest): Promise<dto.CreateTenantResponse> {
        return this.$create(params, dto.CreateTenantResponse)
    }

    /**
     * @override
     */
    protected async $checkCreateViolation(params: dto.CreateTenantRequest): Promise<Maybe<string>> {
        if (await this.$repo.exists({ slug: params.slug })) {
            return Maybe.Just('TENANT_SLUG_ALREADY_EXISTING')
        }
        return Maybe.Nothing()
    }

    //#endregion Create


    //#region Delete

    protected async $hardDeleteSingle<T extends InstanceType<ResultResponseConstructor>>(params: IMultiIds,
            ResponseClass: ResultResponseConstructor): Promise<T> {
        const violation = await this.$checkDeleteSingleViolation(params)
        if (violation.isJust) {
            return new ResponseClass(false, violation.value) as T
        }

        const tenantPk = new TenantId(params.ids[0], params.tenantId)
        const affectedCount: number = await this.$repo.deleteSingle(tenantPk)
        if (affectedCount) {
            const result = ResponseClass.from({
                deletedAt: momentify().format(),
            })
            return result
        }
        return new ResponseClass(false) as T
    }

    /**
     * Can be overriden by derived class to check business rule for deleting.
     */
    protected $checkDeleteSingleViolation(params: any): Promise<Maybe> {
        return Promise.resolve(Maybe.Nothing())
    }


    protected async $hardDeleteMany<T extends InstanceType<ResultResponseConstructor>>(params: IAtomicRequest & IMultiIds,
            ResponseClass: ResultResponseConstructor): Promise<T> {
        const violation = await this.$checkDeleteManyViolation(params)
        if (violation.isJust) {
            return new ResponseClass(false, violation.value) as T
        }

        const tenantPks = params.ids.map(id => new TenantId(id, params.tenantId))
        let task: Promise<number>
        if (params.isAtomic) {
            task = this.$sessionFactory.startSession()
                .pipe((atomicSession: AtomicSession) => {
                    return this.$repo.deleteMany(tenantPks, { atomicSession })
                })
                .closePipe()
        }
        else {
            task = this.$repo.deleteMany(tenantPks)
        }
        const affectedCount: number = await task
        if (affectedCount) {
            const result = ResponseClass.from({
                deletedAt: momentify().format(),
            })
            return result
        }
        return new ResponseClass(false) as T
    }

    /**
     * Can be overriden by derived class to check business rule for deleting.
     */
    protected $checkDeleteManyViolation(params: any): Promise<Maybe> {
        return Promise.resolve(Maybe.Nothing())
    }

    //#endregion Delete


    //#region Edit

    protected async $edit<CT extends InstanceType<ResultResponseConstructor>>(params: any,
            ResponseClass: ResultResponseConstructor): Promise<CT> {
        const violation = await this.$checkEditViolation(params)
        if (violation.isJust) {
            return new ResponseClass(false, violation.value) as CT
        }

        const partialDomainModel = this.$DomainClass.from(params)
        const maybe = await this.$repo.patch(partialDomainModel)
        if (maybe.isJust) {
            const result = ResponseClass.from(maybe.value)
            return result
        }
        return new ResponseClass(false) as CT
    }

    /**
     * Can be overriden by derived class to check business rule for editing.
     */
    protected $checkEditViolation(params: any): Promise<Maybe> {
        return Promise.resolve(Maybe.Nothing())
    }

    //#endregion Edit


    //#region Get

    protected async $getDetails<CT extends InstanceType<MaybeResponseConstructor>>(params: any,
            ResponseClass: MaybeResponseConstructor): Promise<CT> {
        type SpreadParam = {id: string, tenantId?: string} & RepositoryFindOptions
        const { id, tenantId, ...opts }: SpreadParam = params

        const tenantPk = new TenantId(id, tenantId)
        const maybe = await this.$repo.findById(tenantPk, opts)
        if (maybe.isJust) {
            const result = ResponseClass.from(maybe.value)
            return result
        }
        return new ResponseClass(false) as CT
    }

    protected async $getList<CT extends InstanceType<ListResponseConstructor>>(params: any,
            ResponseClass: ListResponseConstructor): Promise<CT> {
        const fetchedDomainModels: PagedData<TDomain> = await this.$repo.page(params)

        if (fetchedDomainModels.length) {
            const result = ResponseClass.from(fetchedDomainModels)
            return result
        }
        return new ResponseClass() as CT
    }

    //#endregion Get

}
