import { Maybe, Result, PagedData, ITranslatable,
    Translatable, decorators as d } from '@micro-fleet/common'
import { SortType } from '@micro-fleet/persistence'


export abstract class GetListRequestBase extends Translatable {

    @d.number({ min: 1, max: 100 })
    @d.defaultAs(1)
    public pageIndex: number

    @d.number({ min: 3, max: 100 })
    @d.defaultAs(10)
    public pageSize: number

    @d.string({ maxLength: 50 })
    public sortBy: string

    @d.string()
    @d.only(SortType.ASC, SortType.DESC)
    public sortType: string
}


// tslint:disable-next-line:interface-name
export interface ListResponseConstructor {
    new (items?: object[], total?: number): any
    from(source: object): any
}

export abstract class DTOListBase<LT> {
    public readonly items: LT[] = undefined
    public readonly total: number = undefined

    public static from<FT extends DTOListBase<any>>(this: new (...args: any[]) => FT, source: object): FT {
        // In this case, "this" refers to the derived class, whose constructor should only accept 2 parameters.
        return new this(source['items'], source['total'])
    }

    public constructor(ItemClass: ITranslatable<LT>, items: object[] = [], total?: number) {
        this.items = ItemClass.fromMany(items)
        this.total = (total != null) ? total : this.items.length
    }

    public toPagedData(): PagedData<LT> {
        return new PagedData(this.items, this.total)
    }
}


export type MaybeResponseConstructor = (new (hasData?: boolean) => MaybeResponse) & ITranslatable

export abstract class MaybeResponse extends Translatable {

    /**
     * If `false`, other properties are unusable.
     */
    public hasData: boolean = undefined

    constructor(hasData: boolean = true) {
        super()
        this.hasData = hasData
    }

    public toMaybe<MT extends ResultResponse>(this: MT): Maybe<MT> {
        return this.hasData
            ? Maybe.Just(this)
            : Maybe.Nothing()
    }
}

export type ResultResponseConstructor = (new (isOk?: boolean, error?: any) => ResultResponse) & ITranslatable

export abstract class ResultResponse extends Translatable {

    /**
     * If `false`, other properties, except `error`, are unusable.
     */
    public hasData: boolean = undefined

    /**
     * Error object or message. Only usable when `hasData` is `false.
     */
    public error: any = undefined

    constructor(isOk: boolean = true, error?: any) {
        super()
        this.hasData = isOk
        this.error = error
    }

    public toResult<RT extends ResultResponse>(this: RT): Result<RT> {
        if (this.hasData) {
            const { hasData, error, ...props }: any = this
            return Result.Ok(props)
        }
        return Result.Failure(this.error)
    }
}

export interface IAtomicRequest {
    readonly isAtomic?: boolean
}

export interface IMultiIds {
    readonly ids: string[]
    readonly tenantId?: string
}
