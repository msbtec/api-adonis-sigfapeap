'use strict'

const User = use('App/Models/User');
const Program = use('App/Models/Program');
const Helpers = use('Helpers')
const Mail = use('Mail');

class UserController {

  async index({ response, request }) {
    const { page, researcher } = request.all();

    let users = await User.query()
      .where((builder) => {
        if(researcher){
          builder
            .where({ type_personal: "Pesquisador" })
            .orWhere({ type_personal: 'Pesquisador estrangeiro' })
            .where({ status: "ativo" })
        } else {
          builder
            .whereNull('type_personal')
            .where({ status: "ativo" })
        }
      })
      .with('profile').with('office').paginate(page, 30);
    return response.json(users);
  }

  async getEvaluators({ response }) {
    let users = await User.query().where({ evaluator: true }).where({ status: "ativo" }).with('profile').with('office').fetch();
    let programs = await Program.all();

    let final = []

    await Promise.all(users.toJSON().map(async user => {

      let programs_from_user = []

      await Promise.all(programs.toJSON().map(async program => {
        const evaluators = program.evaluators ? program.evaluators.split(',').map(s => Number(s.trim())) : []

        for(let i=0;i<evaluators.length;i++){
          await User.find(evaluators[i]);
          if(evaluators[i] == user.id){
            programs_from_user.push(program)
          }
        }
      }))

      final.push({ ...user, programs: programs_from_user })
    }))

    return response.json(final);
  }

  async search({ response, request }) {
    // console.log(request.all().params)
    const { page, nameOrCpf, school, type_personal, knowledgesArea } = request.all().params;

    let users = await User.query()
      .where((builder) => {
        if(type_personal){
          builder
              .where('type_personal', '=', type_personal)
        }else{
          builder
              .where({ type_personal: 'Pesquisador' })
              .orWhere({ type_personal: 'Pesquisador estrangeiro' })
        }
      })
      .where((builder) => {
        if(nameOrCpf){
          builder
              .where('name', 'LIKE', '%' + nameOrCpf + '%')
              .orWhere('cpf', 'LIKE', '%' + nameOrCpf + '%')
        }
      })
      .where((builder) => {
        if(school){
          builder
            .where('school', 'like', '%'+school+"%")
        }
      })
      .where((builder) => {
        if(knowledgesArea){
          builder
            .where('knowledgesArea', 'like', '%'+knowledgesArea+"%")
        }
      })
      .where({ status: "ativo" })
      .with('profile').with('office').paginate(page, 30);

    return response.json(users);
  }

  async update ({ request, params }) {
    const data = request.all();
    const user = await User.findOrFail(params.id);
    let avatar = user.avatar;

    if (request.file('avatar')) {
      const upload = request.file('avatar', { size: '20mb' });
      avatar = `${Date.now()}.${upload.subtype}`;
      await upload.move(Helpers.tmpPath('uploads'), { name: avatar });
      if (!upload.moved()) {
        throw upload.error();
      }
    }

    await user.merge({ ...data, avatar })
    await user.save()

    let user_updated = await User.query().where({ cpf: user.cpf }).with('profile').with('office').first();

    const { evaluator } = data;

    if(String(evaluator) === "true"){
      try {
        await Mail.send(['emails.new_status'],
        {
          name: user.name
        }, (message) => {
          message.from('naoresponda.sigfapeap@gmail.com')
          message.to(String(user.email).split(',')[0].trim())
          message.subject('Atualização de perfil')
        })
      } catch (error) {console.log(error)}
    }

    return user_updated;
  }

  async active({ request, response }){
    try {
      const { token } = request.all();

      const user = await User.findByOrFail('token_first_access', token);

      user.token_first_access = null;
      user.status = 'ativo';

      await user.save()
    } catch (error) {
      return response.status(error.status).send({
        message: 'Não foi possível ativar sua conta. Contate um administrador!'
      })
    }
  }

  async destroy({ params, response, auth }) {
    if(auth.user.id == params.id){
      return response.status(404).json({ message: 'Não é possível apagar o próprio usuário!' });
    }
    const user = await User.find(params.id);
    if (!user) {
      return response.status(404).json({ data: 'Usuário não encontrado!' });
    }
    await user.delete();

    return response.status(204).json(null);
  }

}

module.exports = UserController
