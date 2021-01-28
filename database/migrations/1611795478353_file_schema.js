'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FileSchema extends Schema {
  up () {
    this.create('files', (table) => {
      table.increments()

      table.string('title')

      table.string('file').notNullable()
      table.string('name').notNullable()
      table.string('type', 20)
      table.string('subtype', 20)

      table
        .integer('program_id')
        .unsigned()
        .references('id')
        .inTable('programs')
        .onUpdate('CASCADE')
        .onDelete('SET NULL');

      table.timestamps()
    })
  }

  down () {
    this.drop('files')
  }
}

module.exports = FileSchema
