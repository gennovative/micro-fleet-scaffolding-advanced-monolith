import { MicroServiceBase } from '@micro-fleet/microservice'
import { registerDbAddOn } from '@micro-fleet/persistence'
import { registerWebAddOn } from '@micro-fleet/web'

import { Types as T } from './constants/Types'
import { IUserRepository, UserRepository } from './repositories/UserRepository'


class App extends MicroServiceBase {

    /**
     * @override
     */
    public $registerDependencies(): void {
        super.$registerDependencies()

        const dc = this._depContainer
        dc.bind<IUserRepository>(T.USER_REPO, UserRepository).asSingleton()
    }

    /**
     * @override
     */
    public $onStarting(): void {
        super.$onStarting()

        this.attachAddOn(registerDbAddOn())
        this.attachAddOn(registerWebAddOn())
    }
}

new App().start()
