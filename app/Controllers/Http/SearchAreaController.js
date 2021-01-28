'use strict'

const SearchArea = use('App/Models/SearchArea')
const ConnectionSearch = use('App/Models/ConnectionSearch')

class SearchAreaController {
  async index ({ response }) {
    let searches = await SearchArea.query().fetch();

    let final = []
    await Promise.all(searches.toJSON().map(async search => {
      const connections = search.connections_area.split(',').map(s => Number(s.trim()))

      let result = []
      for(let i=0;i<connections.length;i++){
        const connection = await ConnectionSearch.find(connections[i]);
        result.push(connection.toJSON())
      }

      final.push({ ...search, connections: result })
    }))

    return response.json(final);
  }

  async show ({ params, response }) {
    const search = await SearchArea.find(params.id);

    return response.json(search);
  }

  async store ({ request, response }) {
    const data = request.all();

    const search = await SearchArea.create(data);

    await search.save();

    const connections = search.toJSON().connections_area.split(',').map(s => Number(s.trim()))

    let result = []
    for(let i=0;i<connections.length;i++){
      const connection = await ConnectionSearch.find(connections[i]);
      result.push(connection.toJSON())
    }

    return response.status(201).json({ ...search.toJSON(), connections: result })
  }

  async update ({ params, request, response }) {
    const data = request.all();

    const search = await SearchArea.find(params.id);
    if (!search) {
      return response.status(404).json({ data: 'Search not found' });
    }

    await search.merge(data);
    await search.save();

    const connections = search.toJSON().connections_area.split(',').map(s => Number(s.trim()))

    let result = []
    for(let i=0;i<connections.length;i++){
      const connection = await ConnectionSearch.find(connections[i]);
      result.push(connection.toJSON())
    }

    return response.status(200).json({ ...search.toJSON(), connections: result })
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
