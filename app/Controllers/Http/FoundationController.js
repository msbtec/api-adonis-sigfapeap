'use strict'

const Foundation = use('App/Models/Foundation')

class FoundationController {
  async index ({ response }) {
    let foundations = await Foundation.all();

    return response.json(foundations);
  }

  async show ({ params, response }) {
    const foundation = await Foundation.find(params.id);

    return response.json(foundation);
  }

  async store ({ request, response }) {
    const data = request.all();

    const foundation = await Foundation.create(data);

    await foundation.save();

    return response.status(201).json(foundation);
  }

  async update ({ params, request, response }) {
    const data = request.all();

    const foundation = await Foundation.find(params.id);
    if (!foundation) {
      return response.status(404).json({ data: 'Foundation not found' });
    }

    await foundation.merge(data);
    await foundation.save();

    return response.status(200).json(foundation)
  }

  async destroy({ params, response }) {
    const foundation = await Foundation.find(params.id);
    if (!foundation) {
      return response.status(404).json({ data: 'Foundation not found' });
    }
    await foundation.delete();

    return response.status(204).json(null);
  }
}

module.exports = FoundationController
