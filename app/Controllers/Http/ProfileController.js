'use strict'

const Profile = use('App/Models/Profile')

class ProfileController {
  async index ({ response }) {
    let profiles = await Profile.all();

    return response.json(profiles);
  }

  async show ({ params, response }) {
    const profile = await Profile.find(params.id);

    return response.json(profile);
  }

  async store ({ request, response }) {
    const data = request.all();

    const profile = await Profile.create(data);

    await profile.save();

    return response.status(201).json(profile);
  }

  async update ({ params, request, response }) {
    const data = request.all();

    const profile = await Profile.find(params.id);
    if (!profile) {
      return response.status(404).json({ data: 'Profile not found' });
    }

    await profile.merge(data);
    await profile.save();

    return response.status(200).json(profile)
  }

  async destroy({params, response}) {
    const profile = await Profile.find(params.id);
    if (!profile) {
      return response.status(404).json({ data: 'Profile not found' });
    }
    await profile.delete();

    return response.status(204).json(null);
  }
}

module.exports = ProfileController
