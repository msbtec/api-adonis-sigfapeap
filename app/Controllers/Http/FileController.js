'use strict'

const Helpers = use('Helpers')

class FileController {

  async show({ params, response }) {
    try {
      response.download(Helpers.tmpPath(`uploads/${params.name}`))
    } catch (e) {
      response.status(e.status).send({ error: 'File is not exists!' })
    }
  }
}

module.exports = FileController
