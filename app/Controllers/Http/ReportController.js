'use strict'

const fs = require("fs");
const moment = require('moment')
const PDFDocument = require("pdfkit");
const User = use('App/Models/User');
const Env = use('Env')

class ReportController {
  async generate({ request, response }){
    try{
      const { nameOrCpf, school, type_personal, knowledgesArea } = request.all().params;

      let users = await User.query()
        .where((builder) => {
          if(type_personal){
            builder
                .where('type_personal', '=', type_personal)
          }else{
            builder
                .where({ type_personal: 'Pesquisador' })
                .orWhere({ type_personal: 'Pesquisador estrangeiro' })
          }
        })
        .where((builder) => {
          if(nameOrCpf){
            builder
                .where('name', 'LIKE', '%' + nameOrCpf + '%')
                .orWhere('cpf', 'LIKE', '%' + nameOrCpf + '%')
          }
        })
        .where((builder) => {
          if(school){
            builder
              .where('school', 'like', '%'+school+"%")
          }
        })
        .where((builder) => {
          if(knowledgesArea){
            builder
              .where('knowledgesArea', 'like', '%'+knowledgesArea+"%")
          }
        })
        .with('profile').with('office').fetch();

      let doc = new PDFDocument({ margin: 50 });

      moment.locale('pt-br')

      doc
        .image(`${require('path').dirname(require.main.filename)}/reports/logo.png`, 50, 45, { width: 150 })
        .fillColor("#444444")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Relatório de pesquisadores da Fapeap", 200, 50, { align: "right" })
        .font("Helvetica")
        .text(`${moment().format('LLLL')}`, 200, 65, { align: "right" })
        .moveDown();





      doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, 140)
        .lineTo(565, 140)
        .stroke();

      const customerInformationTop = 150;

      doc
        .fontSize(8)
        .text("Tipo de usuário:", 50, customerInformationTop)
        .text(type_personal || "Todos", 150, customerInformationTop)
        .text("Área de conhecimento:", 50, customerInformationTop + 15)
        .text(knowledgesArea || "Todos", 150, customerInformationTop + 15)
        .text("Nível acadêmico:", 50, customerInformationTop + 30)
        .text(school || "Todos",150,customerInformationTop + 30)

      doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, 200)
        .lineTo(565, 200)
        .stroke();








      let i;
      const invoiceTableTop = 240;

      doc.font("Helvetica-Bold");

      doc
        .fontSize(10)
        .text("#", 50, invoiceTableTop)
        .text("Nome", 80, invoiceTableTop)
        .text("E-mail", 240, invoiceTableTop)
        .text("Nível acadêmico", 400, invoiceTableTop)
        .text("Avaliador", 510, invoiceTableTop);

      doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, invoiceTableTop + 20)
        .lineTo(565, invoiceTableTop + 20)
        .stroke();

      doc.font("Helvetica");

      for (i = 0; i < users.toJSON().length; i++) {
        const item = users.toJSON()[i];
        const position = invoiceTableTop + (i + 1) * 30;

        doc
          .fontSize(8)
          .text(item.id, 50, position)
          .text(item.name, 80, position)
          .text(item.email.split(',')[0], 240, position)
          .text(item.school, 400, position)
          .text(item.evaluator ? 'Sim' : 'Não', 510, position);

        doc
          .strokeColor("#aaaaaa")
          .lineWidth(1)
          .moveTo(50, position + 20)
          .lineTo(565, position + 20)
          .stroke();
      }


      const fileName = `${Date.now()}.pdf`;


      doc.end();
      doc.pipe(fs.createWriteStream(`${require('path').dirname(require.main.filename)}/reports/${fileName}`));

      return response.json({
        url: `${Env.get('APP_URL')}/report/${fileName}`
      });
    } catch (err) {
      return response.status(500).send({  message: 'Erro na geração do arquivo!' });
    }
  }

  async show({ params, response }) {
    try {
      response.download(`${require('path').dirname(require.main.filename)}/reports/${params.name}`)
    } catch (e) {
      response.status(e.status).send({ error: 'File is not exists!' })
    }
  }
}

module.exports = ReportController
