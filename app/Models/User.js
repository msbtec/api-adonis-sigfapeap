'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Env = use('Env')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class User extends Model {

  static get hidden () {
    return ['password']
  }

  static get computed () {
    return ['url']
  }

  profile () {
    return this.belongsTo('App/Models/Profile', 'profile_id', 'id')
  }

  office () {
    return this.belongsTo('App/Models/Office', 'office_id', 'id')
  }

  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  getUrl ({ avatar }) {
    return `${Env.get('APP_URL')}/files/${avatar || 'default.png'}`
  }
}

module.exports = User
