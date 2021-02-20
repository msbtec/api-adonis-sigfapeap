'use strict'

const User = use('App/Models/User');
const Helpers = use('Helpers')
const Mail = use('Mail');

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

    try {
      await Mail.send(['emails.new_account'],
      {
        name: user.name,
        password: final.password
      }, (message) => {
        message.from('naoresponda.sigfapeap@gmail.com')
        message.to(user.email)
        message.subject('Criação de conta')
      })
    } catch (error) {}

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
