'use strict'

const User = use('App/Models/User');
const Helpers = use('Helpers')

class AuthController {

  async register({ request }) {
    const { data } = request.all();

    let avatar = null;
    if (request.file('avatar')) {
      const upload = request.file('avatar', { size: '20mb' });
      avatar = `${Date.now()}.${upload.subtype}`;
      await upload.move(Helpers.tmpPath('uploads'), { name: avatar });
      if (!upload.moved()) {
        throw upload.error();
      }
    }

    const final = JSON.parse(data);

    const user = await User.create({ ...final, avatar });

    let user_created = await User.query().where({ cpf: user.cpf }).with('profile').with('office').first();

    return user_created;
  }

  async login({ request, auth }) {
    const { cpf, password } = request.all();
    const token = await auth.attempt(cpf, password);

    const user = await User.query().where({ cpf }).with('profile').with('office').first();

    return { user, auth: token };
  }

}

module.exports = AuthController
