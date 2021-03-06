'use strict'

const Program = use('App/Models/Program')
const User = use('App/Models/User')
const Helpers = use('Helpers')
const Mail = use('Mail');

class ProgramController {
  async index ({ response }) {
    let programs = await Program.all();

    let final = []
    await Promise.all(programs.toJSON().map(async program => {
      const evaluators = program.evaluators ? program.evaluators.split(',').map(s => Number(s.trim())) : []

      let result = []
      for(let i=0;i<evaluators.length;i++){
        const evaluator = await User.find(evaluators[i]);

        if(evaluator){
          result.push(evaluator.toJSON())
        }
      }

      final.push({ ...program, evaluators: result })
    }))

    return response.json(final);
  }

  async show ({ params, response }) {
    const program = await Program.find(params.id);

    const evaluators = program.toJSON().evaluators ? program.toJSON().evaluators.split(',').map(s => Number(s.trim())) : []

    let result = []
    for(let i=0;i<evaluators.length;i++){
      const evaluator = await User.find(evaluators[i]);
      result.push(evaluator.toJSON())
    }

    return response.json({ ...program.toJSON(), evaluators: result });
  }

  async store ({ request, response }) {
    const { data } = request.all();

    const final = JSON.parse(data);

    const program = await Program.create(final);

    let file = null;
    if (request.file('file')) {
      const upload = request.file('file', { size: '20mb' });
      file = `${Date.now()}.${upload.subtype}`;
      await upload.move(Helpers.tmpPath('uploads'), { name: file });
      if (!upload.moved()) {
        throw upload.error();
      }

      program.file = file
    }


    await program.save();

    // const evaluators = program.toJSON().evaluators.split(',').map(s => Number(s.trim()))

    // let result = []
    // for(let i=0;i<evaluators.length;i++){
    //   const evaluator = await User.find(evaluators[i]);
    //   result.push(evaluator.toJSON())
    // }

    // return response.status(201).json({ ...program.toJSON(), evaluators: result })
    return response.status(201).json(program)
  }

  async update ({ params, request, response }) {
    const data = request.all();

    const program = await Program.find(params.id);
    if (!program) {
      return response.status(404).json({ data: 'Program not found' });
    }

    let file = program.file;

    if (request.file('file')) {
      const upload = request.file('file', { size: '20mb' });
      file = `${Date.now()}.${upload.subtype}`;
      await upload.move(Helpers.tmpPath('uploads'), { name: file });
      if (!upload.moved()) {
        throw upload.error();
      }
    }

    const { name, email } = request.all();

    if(name && email){
      await program.merge({ evaluators: data.evaluators });
      await program.save();

      try {
        await Mail.send(['emails.add_project'],
        {
          name,
          project: program.title
        }, (message) => {
          message.from('naoresponda.sigfapeap@gmail.com')
          message.to(String(email).split(',')[0].trim())
          message.subject('Atualização de perfil')
        })
      } catch (error) {console.log(error)}
    }else{
      await program.merge({ ...data, file });
      await program.save();
    }

    return response.status(201).json(program)
  }

  async destroy({params, response}) {
    const program = await Program.find(params.id);
    if (!program) {
      return response.status(404).json({ data: 'Program not found' });
    }
    await program.delete();

    return response.status(204).json(null);
  }
}

module.exports = ProgramController
