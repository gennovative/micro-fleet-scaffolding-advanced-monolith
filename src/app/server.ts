import { MicroServiceBase } from '@micro-fleet/microservice'
import { registerDbAddOn } from '@micro-fleet/persistence'
import { registerWebAddOn } from '@micro-fleet/web'

import { Types as T } from './constants/Types'
import { TenantResolverFilter } from './filters/TenantResolverFilter'
import { IUserRepository, UserRepository } from './repositories/UserRepository'
import { ITenantRepository, TenantRepository } from './repositories/TenantRepository'
import { ITenantService, TenantService } from './services/TenantService'
import { IUserService, UserService } from './services/UserService'


class App extends MicroServiceBase {

    /**
     * @override
     */
    public $registerDependencies(): void {
        super.$registerDependencies()

        const dc = this._depContainer
        dc.bind<ITenantRepository>(T.TENANT_REPO, TenantRepository).asSingleton()
        dc.bind<IUserRepository>(T.USER_REPO, UserRepository).asSingleton()

        dc.bind<ITenantService>(T.TENANT_SVC, TenantService).asSingleton()
        dc.bind<IUserService>(T.USER_SVC, UserService).asSingleton()
    }

    /**
     * @override
     */
    public $onStarting(): void {
        super.$onStarting()

        this.attachAddOn(registerDbAddOn())
        const webAddOn = registerWebAddOn()
        webAddOn.addGlobalFilter(TenantResolverFilter)
        this.attachAddOn(webAddOn)
    }
}

new App().start()
