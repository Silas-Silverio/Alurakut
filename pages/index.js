import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

function ProfileSidebar(propriedades) {
  return (
    <Box as='aside'>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`htps://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return(
    <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              {propriedades.title} ({propriedades.items.length})
            </h2>
            <ul>
              {propriedades.items.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`https://github.com/${itemAtual.login}.png`}>
                      <img src={itemAtual.avatar_url} />
                      <span>{itemAtual.login}</span>
                    </a>
                  </li>
                )
              })} 
            </ul>
          </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {

  const githubUser = 'Silas-Silverio';
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = [
    'andreluizcosta',
    'lucasamsilva',
    'CarlosH-Gomes',
    'FilipFelipe',
    'juliasilvamoura',
    'iuri-ramon98'
  ]

    const [seguidores, setSeguidores]= React.useState([]);
    React.useEffect(function(){
    // API Github
      fetch('https://api.github.com/users/Silas-Silverio/followers')
      .then(function (respostaDoServidor){
        return respostaDoServidor.json();
      })
      .then(function(respostaConvertida){
        setSeguidores(respostaConvertida);
      })
      // API GraphQL
      fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
          'Authorization': '3039055247b485cd58b3077bfaa509',
          'Content-type':  'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({"query": `query {
          allCommunities {
            title
            id
            imageUrl
            creatorSlug
          }
        }`})
      })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesVindasDoDato);
      })
    }, [])

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem vindo(a)
            </h1>
            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoFrom = new FormData(e.target);

              const comunidade = {
                title: dadosDoFrom.get('title'),
                imageUrl: dadosDoFrom.get('image'),
                creatorSlug: githubUser,
              }

              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
              .then(async (response) => {
                const dados = await response.json();
                const comunidade = dados.registroCriado; 
                const comunidadesAtualizadas = [...comunidades, comunidade]
                setComunidades(comunidadesAtualizadas);
              })
            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa" />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades ({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>

      </MainGrid>
    </>
  )
}
