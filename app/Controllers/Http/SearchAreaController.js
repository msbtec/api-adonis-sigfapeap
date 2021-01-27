'use strict'

const SearchArea = use('App/Models/SearchArea')

class SearchAreaController {
  async index ({ response }) {
    //let searches = await SearchArea.all();
    let searches = await SearchArea.query().with('connection_area').fetch();

    return response.json(searches);
  }

  async show ({ params, response }) {
    const search = await SearchArea.find(params.id);

    return response.json(search);
  }

  async store ({ request, response }) {
    const data = request.all();

    const search = await SearchArea.create(data);

    await search.save();

    return response.status(201).json(search);
  }

  async update ({ params, request, response }) {
    const data = request.all();

    const search = await SearchArea.find(params.id);
    if (!search) {
      return response.status(404).json({ data: 'Search not found' });
    }

    await search.merge(data);
    await search.save();

    return response.status(200).json(search)
  }

  async destroy({ params, response }) {
    const search = await SearchArea.find(params.id);
    if (!search) {
      return response.status(404).json({ data: 'Search not found' });
    }
    await search.delete();

    return response.status(204).json(null);
  }
}

module.exports = SearchAreaController
