'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()

      table.string('type_personal')
      table.string('name')
      table.string('rg')
      table.string('orger_emitter')
      table.string('uf')
      table.string('date_emitter')
      table.string('email')
      table.string('sex')
      table.string('birthday')
      table.string('race')
      table.string('mother_name')
      table.string('father_name')
      table.string('curriculum')
      table.string('school')
      table.string('rg_foreign')
      table.string('passport')
      table.string('knowledgesArea')

      table.string('zipcode')
      table.string('street')
      table.string('number_street')
      table.string('complete_street')
      table.string('neighborhood')
      table.string('country')
      table.string('state')
      table.string('municipality')
      table.string('phone')

      table.string('connection')
      table.string('institution')
      table.string('connection_institution')
      table.string('generate_connection')
      table.string('service_time')
      table.string('regime_work')
      table.string('office')
      table.string('office_time')

      table.string('professional_zipcode')
      table.string('professional_street')
      table.string('professional_number_street')
      table.string('professional_complete_street')
      table.string('professional_neighborhood')
      table.string('professional_country')
      table.string('professional_state')
      table.string('professional_municipality')
      table.string('professional_phone')
      table.string('professional_phone_cell')
      table.string('professional_fax')

      table.string('address_mail')
      table.string('received_informations')

      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
