'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProgramSchema extends Schema {
  up () {
    this.create('programs', (table) => {
      table.increments()

      table.string('title')
      table.text('description')
      table.string('file')
      table.string('evaluators')

      table.timestamps()
    })
  }

  down () {
    this.drop('programs')
  }
}

module.exports = ProgramSchema
