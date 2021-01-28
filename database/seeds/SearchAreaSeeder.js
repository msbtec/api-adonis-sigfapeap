'use strict'

/*
|--------------------------------------------------------------------------
| SearchAreaSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class SearchAreaSeeder {
  async run () {
    //await Factory.model('App/Models/SearchArea').createMany(0)
    console.log('SearchArea created')
  }
}

module.exports = SearchAreaSeeder
