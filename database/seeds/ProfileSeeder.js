'use strict'

/*
|--------------------------------------------------------------------------
| ProfileSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class ProfileSeeder {
  async run () {
    await Factory.model('App/Models/Profile').createMany(3)
    console.log('Profile created')
  }
}

module.exports = ProfileSeeder
