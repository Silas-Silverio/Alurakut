import {SiteClient} from 'datocms-client';

export default async function recebedorDeRequest(request, response){

  if(request.method === 'POST') {
    const TOKEN = 'e13b2d9f57ccba16a744d5f9f3228f'
    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      itemType: "967767",
      ...request.body,
      // title: "Comunidade de Teste",
      // ImageUrl: "https://github.com/Silas-Silverio.png",
      // creatorSlug: "Silas-Silverio"
    })
    
    response.json({
      dados: 'algum dado qualquer',
      registroCriado: registroCriado,
    })
    return;
  }

  response.status(404).json({
    message: 'Ainda não temos nada no GET, mas no POST tem!'
  })
}