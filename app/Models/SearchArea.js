'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SearchArea extends Model {
  connection_area () {
    return this.belongsTo('App/Models/ConnectionSearch', 'connection_area_id', 'id')
  }
}

module.exports = SearchArea
