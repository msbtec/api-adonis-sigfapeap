'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SearchAreaSchema extends Schema {
  up () {
    this.create('search_areas', (table) => {
      table.increments()

      table.string('name')

      table.text('connections_area')

      // table
      //   .integer('connection_area_id')
      //   .unsigned()
      //   .references('id')
      //   .inTable('connection_searches')
      //   .onUpdate('CASCADE')
      //   .onDelete('SET NULL')

      table.timestamps()
    })
  }

  down () {
    this.drop('search_areas')
  }
}

module.exports = SearchAreaSchema
