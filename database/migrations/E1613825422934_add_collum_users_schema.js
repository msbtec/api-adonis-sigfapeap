'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCollumUsersSchema extends Schema {
  up () {
    this.alter('users', (table) => {
      table.string('token')
      table.timestamp('token_created_at')
    })
  }
}

module.exports = AddCollumUsersSchema
