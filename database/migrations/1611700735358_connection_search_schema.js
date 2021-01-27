'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ConnectionSearchSchema extends Schema {
  up () {
    this.create('connection_searches', (table) => {
      table.increments()

      table.string('name')

      table.timestamps()
    })
  }

  down () {
    this.drop('connection_searches')
  }
}

module.exports = ConnectionSearchSchema
