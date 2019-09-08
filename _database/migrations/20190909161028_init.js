const fs = require('fs')
const path = require('path')
const util = require('util')

const readFileAsync = util.promisify(fs.readFile)

exports.up = async function(knex) {
    const schema = knex.schema

    console.log('** Dropping tables **')
    await Promise.all([
        schema.dropTableIfExists('mcft_users'),
        schema.dropTableIfExists('mcft_tenants'),
    ])

    const sql = await readFileAsync(path.resolve(__dirname, '../sql/functions.pgsql'), 'utf8')
    console.log('** Executing custom SQL **')
    await schema.raw(sql)

    console.log('** Creating tables **')
    await tenants()
    await users()


    async function tenants() {
        await schema.createTable('mcft_tenants', tbl => {
            tbl.bigInteger('id')
                .primary()
                .defaultTo(knex.raw("public.next_id('mcft_tenants')"))

            tbl.string('name', 100).notNullable()
            tbl.string('slug', 100).notNullable().unique().index()
        })
    }

    async function users() {
        await schema.createTable('mcft_users', tbl => {
            tbl.bigInteger('id')
            tbl.bigInteger('tenant_id')
            tbl.primary(['id', 'tenant_id'])

            tbl.string('name', 100).notNullable().index()
            tbl.string('status', 20).defaultTo('active').notNullable()

            tbl.foreign('tenant_id')
                .references('id').inTable('mcft_tenants')
                .onDelete('CASCADE')
        })

        await schema.raw('ALTER TABLE public.mcft_users' +
            " ADD CONSTRAINT mcft_users_status CHECK (status::text = ANY (ARRAY['active'::text, 'locked'::text, 'deleted'::text]))")
    }

};

exports.down = function(knex) {
    
};
