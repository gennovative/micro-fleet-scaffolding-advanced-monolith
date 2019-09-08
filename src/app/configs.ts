import { constants } from '@micro-fleet/common'

const {
    DbClient,
    Database: D,
    Service: S,
    Web: W,
} = constants

export = {
    [S.SERVICE_SLUG]: 'monolith-advanced-rest-server',
    [D.DB_ENGINE]: DbClient.POSTGRESQL,
    [D.DB_HOST]: 'localhost',
    [D.DB_USER]: 'postgres',
    [D.DB_PASSWORD]: 'postgres',
    [D.DB_NAME]: 'mcft_monolith',
    [W.WEB_PORT]: 3000,
    [W.WEB_URL_PREFIX]: '/api/v1/:tenant',
    [W.WEB_CORS]: '*',
}
