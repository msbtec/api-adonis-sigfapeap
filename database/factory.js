'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
// const Factory = use('Factory')

// Factory.blueprint('App/Models/User', (faker) => {
//   return {
//     username: faker.username()
//   }
// })

const Factory = use('Factory')

Factory.blueprint('App/Models/Office', async (faker, i, data) => {
  return {
    name: ['Procurador de Justiça'][i]
  }
})

Factory.blueprint('App/Models/Profile', async (faker, i, data) => {
  return {
    name: ['Administrador', 'Servidor', 'Pesquisador'][i],
    access: [
      JSON.stringify([
        {
          "label": "Servidores",
          "value": "Servidores"
        },
        {
          "label": "Cargos",
          "value": "Cargos"
        },
        {
          "label": "Perfis de acesso",
          "value": "Perfis de acesso"
        },
        {
          "label": "Área de pesquisa",
          "value": "Área de pesquisa"
        },
        {
          "label": "Instituição de pesquisa",
          "value": "Instituição de pesquisa"
        },
        {
          "label": "Programas",
          "value": "Programas"
        },
        {
          "label": "Avaliadores",
          "value": "Avaliadores"
        },
        {
          "label": "Pesquisadores",
          "value": "Pesquisadores"
        }
      ]) , JSON.stringify([
        {
          "label": "Programas",
          "value": "Programas"
        },
        {
          "label": "Avaliadores",
          "value": "Avaliadores"
        },
        {
          "label": "Pesquisadores",
          "value": "Pesquisadores"
        }
      ]), JSON.stringify([
        {
          "label": "Programas",
          "value": "Programas"
        }
      ])
    ][i]
  }
})

Factory.blueprint('App/Models/ConnectionSearch', async (faker, i, data) => {
  return {
    name: [
      'Ciências Exatas e da Terra',
      'Ciências Biológicas',
      'Engenharias',
      'Ciências da Saúde',
      'Ciências Agrárias',
      'Linguística',
      'Letras e Artes',
      'Ciências Sociais Aplicadas',
      'Ciências Humanas'
    ][i]
  }
})

Factory.blueprint('App/Models/SearchArea', async (faker, i, data) => {
  return {
    name: ['Ciência da Computação','Engenharia Elétrica'][i],
    connections_area: ["1,3", "3"][i]
  }
})

Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return {
    name: ["ADMINISTRADOR"][i],
    status: ["ativo"][i],
    cpf: ["123.456.789-00"][i],
    password: ["password"][i],
    email: ["math.cs.ceil@gmail.com"][i],
    phone: [""][i],
    address: [""][i],
    profile_id: [1][i]
  }
})


