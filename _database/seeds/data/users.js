const moment = require('moment')

const { TENANTS } = require('./tenants')


module.exports = {
    USERS: [
        {
            id: '8254662178485830658',
            tenantId: TENANTS[0].id,
            name: 'Superman',
            status: 'active',
            createdAt: moment.utc().format(),
        },
        {
            id: '8259744598599926789',
            tenantId: TENANTS[0].id,
            name: 'Winter Soldier',
            status: 'locked',
            createdAt: moment.utc().format(),
        },
        {
            id: '8259756591356576774',
            tenantId: TENANTS[0].id,
            name: 'Iron Man',
            status: 'deleted',
            createdAt: moment.utc().format(),
        },
    ]
}
