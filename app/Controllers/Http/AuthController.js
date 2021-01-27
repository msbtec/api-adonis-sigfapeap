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
    return user;
  }

  async login({ request, auth }) {
    const { cpf, password } = request.all();
    const token = await auth.attempt(cpf, password);

    const user = await User.query().where({ cpf }).with('profile').first();

    return { user, auth: token };
  }

}

module.exports = AuthController
