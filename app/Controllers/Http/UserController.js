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

    return user;
  }

  async destroy({ params, response }) {
    await User.find(params.id).delete();
    return response.json({ message: 'Usuário deletado!' });
  }

}

module.exports = UserController
