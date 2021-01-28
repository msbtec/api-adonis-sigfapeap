'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class File extends Model {

  static get computed () {
    return ['url']
  }

  getUrl ({ file }) {
    return `http://localhost:3333/files/${file || 'default.png'}`
  }
}

module.exports = File
