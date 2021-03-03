'use strict'

const User = use('App/Models/User');
const Helpers = use('Helpers')
const Mail = use('Mail');

const moment = require('moment');
const crypto = require('crypto');

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

    const user = await User.create({ ...final, token_first_access: crypto.randomBytes(10).toString('hex'), avatar });

    try {
      await Mail.send(['emails.new_account'],
      {
        name: user.name,
        password: final.password,
        link: `https://front-sigfapeap.msbtec.com.br/ativar-conta?token=${user.token_first_access}`
      }, (message) => {
        message.from('naoresponda.sigfapeap@gmail.com')
        message.to(String(user.email).split(',')[0].trim())
        message.subject('Criação de conta')
      })
    } catch (error) {}

    let user_created = await User.query().where({ cpf: user.cpf }).with('profile').with('office').first();

    return user_created;
  }

  async login({ request, auth, response }) {
    const { cpf, password } = request.all();
    const token = await auth.attempt(cpf, password);

    const user = await User.query().where({ cpf }).where({ status: 'ativo' }).with('profile').with('office').first();

    if(user){
      return { user, auth: token };
    }else{
      return response.status(404).json({ data: 'Usuário não encontrado!' });
    }
  }

}

module.exports = AuthController
