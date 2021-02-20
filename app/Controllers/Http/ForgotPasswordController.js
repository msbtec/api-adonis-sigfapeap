'use strict'

const moment = require('moment');
const crypto = require('crypto');
const User = use('App/Models/User');
const Mail = use('Mail');

class ForgotPasswordController {

  async store({ request, response }){
    try {
      const email = request.input('email');
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex');
      user.token_created_at = new Date();

      await user.save();

      await Mail.send(['emails.forgot_password'],
      {
        email,
        token: user.token,
        link: `https://front-sigfapeap.msbtec.com.br/resetar-senha?token=${user.token}`
      }, (message) => {
        message.from('naoresponda.sigfapeap@gmail.com')
        message.to(user.email)
        message.subject('Recuperação de senha')
      })
    } catch (error) {
      console.log(error)
      return response.status(error.status).send({
        message: 'E-mail não encontrado!'
      })
    }
  }

  async update({ request, response }){
    try {
      const { token, password } = request.all();

      const user = await User.findByOrFail('token', token);

      const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at);

      if(tokenExpired){
        return response.status(401).send({
          message: 'O token de recuperação está expirado!'
        })
      }

      user.token = null;
      user.token_created_at = null;
      user.password = password;

      await user.save()
    } catch (error) {
      return response.status(error.status).send({
        message: 'Não foi possível resetar sua senha!'
      })
    }
  }

}

module.exports = ForgotPasswordController
