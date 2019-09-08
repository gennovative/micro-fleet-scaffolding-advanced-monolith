const { USERS } = require('./data/users')
const { TENANTS } = require('./data/tenants')

exports.seed = async function(knex, Promise) {
    await knex('mcft_users').del()
    await knex('mcft_tenants').del()
    
    await knex('mcft_tenants').insert(TENANTS)
    await knex('mcft_users').insert(USERS)
}
