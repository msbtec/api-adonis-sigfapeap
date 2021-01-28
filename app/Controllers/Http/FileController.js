'use strict'

const File = use('App/Models/File')
const Helpers = use('Helpers')

class FileController {

  async index({ params, response }) {
    let files = await File.query().where({ program_id: params.id }).fetch();
    return response.json(files);
  }

  async store({ request, response }) {
    try {
      if (!request.file('file')) return;

      const { title, program_id } = request.all();

      const upload = request.file('file', { size: '20mb' });
      const fileName = `${Date.now()}.${upload.subtype}`;

      await upload.move(Helpers.tmpPath('uploads'), { name: fileName });
      if (!upload.moved()) {
        throw upload.error();
      }

      const file = await File.create({
        title,
        program_id,
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      });

      return file;
    } catch (err) {
      return response.status(err.status).send({ error: { message: 'Erro no upload do arquivo!' } });
    }
  }

  async show({ params, response }) {
    try {
      response.download(Helpers.tmpPath(`uploads/${params.name}`))
    } catch (e) {
      response.status(e.status).send({ error: 'File is not exists!' })
    }
  }

  async destroy({ params, response }) {
    const file = await File.find(params.id);
    if (!file) {
      return response.status(404).json({ data: 'File not found' });
    }
    await file.delete();

    return response.status(204).json(null);
  }
}

module.exports = FileController
