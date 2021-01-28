'use strict'

/*
|--------------------------------------------------------------------------
| OfficeSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class OfficeSeeder {
  async run () {
    await Factory.model('App/Models/Office').createMany(1)
    console.log('Office created')
  }
}

module.exports = OfficeSeeder
