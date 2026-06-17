// ESTRUTURA DE DADOS - Galeria da Jessica
const dados = {
  artista: {
    nome: "Jessica",
    foto: "imagem/ProfileJessica.png",
    estilo: "Ilustradora Digital · Criadora de Personagens",
    bio: "Jessica é uma artista digital especializada em ilustrações de personagens com cores vivas e traços expressivos. Seu trabalho mistura influências do estilo anime com técnicas de pintura digital moderna.",
    ferramentas: "Clip Studio Paint, Medibang",
    especialidade: "Personagens e Ilustrações",
    desde: "2024"
  },

  obras: [
    {
      id: 0,
      titulo: "Madoka — Obra Principal",
      descricao: "Arte especial de Madoka, obra que define a identidade artística da galeria.",
      conteudo: "Esta é a obra mais especial da galeria — uma ilustração de Madoka que representa a evolução do estilo artístico da Jessica. Com traços delicados, paleta de cores vibrante e atenção minuciosa aos detalhes, essa arte captura a essência do trabalho da artista. O processo envolveu esboço, linha-arte e colorização em camadas digitais.",
      categoria: "Arte Digital Especial",
      autor: "Jessica",
      data: "2026-05-18",
      tecnica: "Pintura Digital com camadas",
      dimensoes: "4000 x 4000 px (4K)",
      destaque: true,
      principal: true,
      imagem: "imagem/madoka2.png",
      fotos: [
        { id: 1, titulo: "Esboço inicial do personagem", imagem: "imagem/.png" },
        { id: 2, titulo: "Linha-arte finalizada", imagem: "imagem/.png" },
        { id: 3, titulo: "Versão colorida final", imagem: "imagem/madoka2.png" }
      ]
    },
    {
      id: 1,
      titulo: "Obra 1 - Personagem Colorida",
      descricao: "Uma ilustração com estilo colorido e foco no personagem.",
      conteudo: "Essa obra foi feita para mostrar uma personagem com uma composição simples, usando cores fortes e um visual chamativo. A ideia principal é destacar a arte e o estilo da artista. O processo envolveu diversas camadas de cor digital e atenção especial à iluminação do personagem.",
      categoria: "Ilustração",
      autor: "Jessica",
      data: "2026-05-20",
      tecnica: "Pintura Digital",
      dimensoes: "3000 x 4000 px",
      destaque: true,
      principal: false,
      imagem: "imagem/Obra1.png",
      fotos: [
        { id: 1, titulo: "Esboço inicial", imagem: "imagem/.png" },
        { id: 2, titulo: "Linha-arte finalizada", imagem: "imagem/.png" },
        { id: 3, titulo: "Versão colorida", imagem: "imagem/Obra1.png" }
      ]
    },
    {
      id: 2,
      titulo: "Obra 2 - Arte Expressiva",
      descricao: "Arte com um visual mais expressivo e detalhes no desenho.",
      conteudo: "Essa segunda obra mostra melhor os detalhes do traço e da pintura. Ela pode ser usada como exemplo de evolução do estilo artístico da Jessica. Os traços foram feitos com pincel de textura para criar uma sensação de movimento e profundidade na composição.",
      categoria: "Personagem",
      autor: "Jessica",
      data: "2026-05-21",
      tecnica: "Ilustração Digital",
      dimensoes: "2800 x 3500 px",
      destaque: true,
      principal: false,
      imagem: "imagem/Obra2.png",
      fotos: [
        { id: 1, titulo: "Rascunho", imagem: "imagem/Obra2rascunho.png" },
        { id: 2, titulo: "Detalhes do traço", imagem: "imagem/Obra2detalhamento.png" },
        { id: 3, titulo: "Arte final", imagem: "imagem/Obra2.png" }
      ]
    },
    {
      id: 3,
      titulo: "Obra 3 - Composição Visual",
      descricao: "Uma obra com foco em criatividade e composição visual.",
      conteudo: "A terceira obra apresenta uma proposta visual diferente, mantendo a identidade da galeria. Ela ajuda a mostrar a variedade das artes criadas pela artista. A composição explora o uso de perspectiva e profundidade para criar uma cena dinâmica e envolvente.",
      categoria: "Arte Digital",
      autor: "Jessica",
      data: "2026-05-22",
      tecnica: "Arte Digital Mista",
      dimensoes: "4000 x 4000 px",
      destaque: true,
      principal: false,
      imagem: "imagem/Obra3.png",
      fotos: [
        { id: 1, titulo: "Composição base", imagem: "imagem/.png" },
        { id: 2, titulo: "Aplicação de cores", imagem: "imagem/.png" },
        { id: 3, titulo: "Resultado final", imagem: "imagem/Obra3.png" }
      ]
    }
  ]
};

// CARROSSEL — slider de destaques (index.html)
function montarCarrossel() {
  const inner = document.getElementById("carrossel-inner");
  const indicators = document.getElementById("carrossel-indicators");
  if (!inner) return;

  // Exclui a obra principal do carrossel (ela já tem seção própria)
  const destaques = dados.obras.filter(function(obra) {
    return obra.destaque === true && obra.principal !== true;
  });

  if (destaques.length === 0) {
    inner.innerHTML = "<p class='text-center text-white p-4'>Nenhum destaque cadastrado.</p>";
    return;
  }

  let htmlIndicators = "";
  let htmlSlides = "";

  for (let i = 0; i < destaques.length; i++) {
    const ativo = i === 0 ? "active" : "";

    htmlIndicators += `
      <button type="button" data-bs-target="#carrossel-destaques" data-bs-slide-to="${i}"
        class="${ativo}" aria-label="Slide ${i + 1}" ${ativo ? 'aria-current="true"' : ""}></button>
    `;

    htmlSlides += `
      <div class="carousel-item ${ativo}">
        <img src="${destaques[i].imagem}" class="d-block w-100 carousel-img" alt="${destaques[i].titulo}" />
        <div class="carousel-caption d-block">
          <h5>${destaques[i].titulo}</h5>
          <p class="d-none d-md-block">${destaques[i].descricao}</p>
          <a href="detalhes.html?id=${destaques[i].id}" class="btn btn-destaque btn-sm mt-1">Ver detalhes</a>
        </div>
      </div>
    `;
  }

  if (indicators) indicators.innerHTML = htmlIndicators;
  inner.innerHTML = htmlSlides;
}

// CARDS — lista de todas as obras (index.html)
function pegarObrasFiltradas() {
  const campoPesquisa = document.getElementById("campo-pesquisa");
  const filtroCategoria = document.getElementById("filtro-categoria");

  let texto = campoPesquisa ? campoPesquisa.value.toLowerCase() : "";
  let categoria = filtroCategoria ? filtroCategoria.value : "todas";

  // Inclui todas as obras (inclusive madoka, id=0) na listagem geral
  return dados.obras.filter(function(obra) {
    const tituloCombina = obra.titulo.toLowerCase().includes(texto) ||
                          obra.descricao.toLowerCase().includes(texto);
    const categoriaCombina = categoria === "todas" || obra.categoria === categoria;
    return tituloCombina && categoriaCombina;
  });
}

function montarCards() {
  const lista = document.getElementById("lista-obras");
  if (!lista) return;

  const obrasFiltradas = pegarObrasFiltradas();

  if (obrasFiltradas.length === 0) {
    lista.innerHTML = `
      <div class="col-12 text-center py-4">
        <p class="texto-sem-resultado">Nenhuma obra encontrada para essa pesquisa.</p>
      </div>`;
    return;
  }

  let html = "";

  for (let i = 0; i < obrasFiltradas.length; i++) {
    const obra = obrasFiltradas[i];
    const badgePrincipal = obra.principal
      ? '<span class="badge-principal">✦ Principal</span>'
      : '';

    html += `
      <div class="col-12 col-sm-6 col-lg-4 mb-4">
        <div class="card obra-card h-100 ${obra.principal ? 'obra-card-principal' : ''}">
          <a href="detalhes.html?id=${obra.id}">
            <img src="${obra.imagem}" class="card-img-top obra-card-img" alt="${obra.titulo}" />
          </a>
          <div class="card-body d-flex flex-column">
            <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <h5 class="card-title mb-0">${obra.titulo}</h5>
              ${badgePrincipal}
            </div>
            <p class="card-text flex-grow-1">${obra.descricao}</p>
            <p class="card-text"><span class="badge-categoria">${obra.categoria}</span></p>
            <a href="detalhes.html?id=${obra.id}" class="btn btn-destaque mt-2">Ver detalhes</a>
          </div>
        </div>
      </div>
    `;
  }

  lista.innerHTML = html;
}

// EVENTOS — pesquisa e filtro (index.html)

function configurarEventos() {
  const formulario = document.querySelector(".search-form");
  const filtroCategoria = document.getElementById("filtro-categoria");
  const campoPesquisa = document.getElementById("campo-pesquisa");

  if (formulario) {
    formulario.addEventListener("submit", function(evento) {
      evento.preventDefault();
      montarCards();
    });
  }

  if (campoPesquisa) {
    campoPesquisa.addEventListener("input", function() {
      montarCards();
    });
  }

  if (filtroCategoria) {
    filtroCategoria.addEventListener("change", function() {
      montarCards();
    });
  }
}

// PÁGINA DE DETALHES (detalhes.html)

function montarDetalhes() {
  const areaDetalhe = document.getElementById("detalhe-obra");
  const areaFotos = document.getElementById("detalhe-fotos");
  if (!areaDetalhe) return;

  const parametros = new URLSearchParams(window.location.search);
  const id = Number(parametros.get("id"));

  const obra = dados.obras.find(function(item) {
    return item.id === id;
  });

  if (!obra) {
    areaDetalhe.innerHTML = `
      <div class="alert-erro text-center py-5">
        <h2>Obra não encontrada</h2>
        <p>Volte para a galeria e escolha uma obra.</p>
        <a href="index.html" class="btn btn-destaque mt-3">Voltar para a galeria</a>
      </div>`;
    return;
  }

  document.title = obra.titulo + " — Galeria da Jessica";

  const badgePrincipal = obra.principal
    ? '<span class="badge-principal ms-2">✦ Obra Principal</span>'
    : '';

  // (1) Informações gerais — 6 campos
  areaDetalhe.innerHTML = `
    <div class="detalhe-grid">
      <div class="detalhe-imagem-wrap">
        <img src="${obra.imagem}" alt="${obra.titulo}"
          class="detalhe-imagem-principal ${obra.principal ? 'detalhe-imagem-principal-glow' : ''}" />
      </div>
      <div class="detalhe-info">
        <h2 class="detalhe-titulo">${obra.titulo}${badgePrincipal}</h2>
        <span class="badge-categoria mb-3 d-inline-block">${obra.categoria}</span>

        <dl class="detalhe-lista">
          <dt>Descrição</dt>
          <dd>${obra.descricao}</dd>

          <dt>Conteúdo</dt>
          <dd>${obra.conteudo}</dd>

          <dt>Artista</dt>
          <dd>${obra.autor}</dd>

          <dt>Técnica</dt>
          <dd>${obra.tecnica}</dd>

          <dt>Dimensões</dt>
          <dd>${obra.dimensoes}</dd>

          <dt>Data de criação</dt>
          <dd>${formatarData(obra.data)}</dd>
        </dl>

        <a href="index.html" class="btn btn-destaque mt-3">← Voltar para a galeria</a>
      </div>
    </div>
  `;

  // (2) Fotos vinculadas
  if (areaFotos && obra.fotos && obra.fotos.length > 0) {
    let htmlFotos = "";
    for (let i = 0; i < obra.fotos.length; i++) {
      const foto = obra.fotos[i];
      htmlFotos += `
        <div class="col-12 col-sm-6 col-md-4 mb-4">
          <div class="foto-card">
            <img src="${foto.imagem}" alt="${foto.titulo}" class="foto-card-img" />
            <p class="foto-titulo">${foto.titulo}</p>
          </div>
        </div>
      `;
    }
    areaFotos.innerHTML = htmlFotos;
  }
}

// UTILITÁRIOS

function formatarData(dataStr) {
  if (!dataStr) return "—";
  const partes = dataStr.split("-");
  if (partes.length !== 3) return dataStr;
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

// INICIALIZAÇÃO

document.addEventListener("DOMContentLoaded", function() {
  montarCarrossel();
  montarCards();
  configurarEventos();
  montarDetalhes();
});
