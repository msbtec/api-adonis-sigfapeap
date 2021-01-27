'use strict'

const User = use('App/Models/User');
const Helpers = use('Helpers')

class UserController {

  async index({ response }) {
    let users = await User.query().with('profile').with('office').fetch();
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

    return user_updated;
  }

  async destroy({ params, response }) {
    const user = await User.find(params.id);
    if (!user) {
      return response.status(404).json({ data: 'User not found' });
    }
    await user.delete();

    return response.status(204).json(null);
  }

}

module.exports = UserController
