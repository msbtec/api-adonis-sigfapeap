'use strict'

const Office = use('App/Models/Office')

class OfficeController {
  async index ({ response }) {
    let offices = await Office.all();

    return response.json(offices);
  }

  async show ({ params, response }) {
    const office = await Office.find(params.id);

    return response.json(office);
  }

  async store ({ request, response }) {
    const data = request.all();

    const office = await Office.create(data);

    await office.save();

    return response.status(201).json(office);
  }

  async update ({ params, request, response }) {
    const data = request.all();

    const office = await Office.find(params.id);
    if (!office) {
      return response.status(404).json({ data: 'Office not found' });
    }

    await office.merge(data);
    await office.save();

    return response.status(200).json(office)
  }

  async destroy({ params, response }) {
    const office = await Office.find(params.id);
    if (!office) {
      return response.status(404).json({ data: 'Office not found' });
    }
    await office.delete();

    return response.status(204).json(null);
  }
}

module.exports = OfficeController
