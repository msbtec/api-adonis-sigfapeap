'use strict'

/*
|--------------------------------------------------------------------------
| ConnectionSearchSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class ConnectionSearchSeeder {
  async run () {
    await Factory.model('App/Models/ConnectionSearch').createMany(9)
    console.log('ConnectionSearch created')
  }
}

module.exports = ConnectionSearchSeeder
