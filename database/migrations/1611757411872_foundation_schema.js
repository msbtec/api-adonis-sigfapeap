'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class FoundationSchema extends Schema {
  up () {
    this.create('foundations', (table) => {
      table.increments()

      table.string('cnpj')
      table.string('type_institution')
      table.string('name')
      table.string('social_name')
      table.string('address')
      table.string('site')
      table.string('phone')
      table.string('email')
      table.string('observation')

      table.timestamps()
    })
  }

  down () {
    this.drop('foundations')
  }
}

module.exports = FoundationSchema
