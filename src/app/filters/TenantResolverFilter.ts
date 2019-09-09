import { decorators as d } from '@micro-fleet/common'
import { Request, Response, IActionFilter, ActionFilterBase } from '@micro-fleet/web'

import { Types as T } from '../constants/Types'
import { ITenantService } from '../services/TenantService'


/**
 * Gets tenant ID from slug and assign to `request.extras`.
 */
@d.injectable()
export class TenantResolverFilter
    extends ActionFilterBase
    implements IActionFilter {

    constructor(
        @d.inject(T.TENANT_SVC) private _tenantSvc: ITenantService,
    ) {
        super()
    }

    public async execute(req: Request, res: Response, next: Function): Promise<void> {
        const result = await this._tenantSvc.getBySlug({ slug: req.params.tenant })

        if (result.hasData) {
            this.addReadonlyProp(req.extras, 'tenantId', result.id)
            next()
            return
        }
        res.status(404).send('TENANT_NOT_FOUND')
    }
}
