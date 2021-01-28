'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Env = use('Env')

class Program extends Model {
  static get computed () {
    return ['url']
  }

  getUrl ({ file }) {
    return `${Env.get('APP_URL')}/files/${file || 'default.png'}`
  }
}

module.exports = Program
