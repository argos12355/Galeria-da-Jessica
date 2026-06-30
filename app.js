const STORAGE_KEYS = {
  itens: "galeria-itens",
  usuarios: "galeria-usuarios",
  usuarioLogado: "galeria-usuario-logado"
};

const dadosBase = {
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

function inicializarStorage() {
  const itensSalvos = localStorage.getItem(STORAGE_KEYS.itens);
  if (!itensSalvos) {
    localStorage.setItem(STORAGE_KEYS.itens, JSON.stringify(dadosBase.obras));
  }

  const usuariosSalvos = localStorage.getItem(STORAGE_KEYS.usuarios);
  if (!usuariosSalvos) {
    const usuariosIniciais = [
      {
        id: "admin-1",
        login: "admin",
        senha: "123",
        nome: "Administrador do Sistema",
        email: "admin@abc.com",
        admin: true,
        favoritos: []
      },
      {
        id: "user-1",
        login: "user",
        senha: "123",
        nome: "Usuário Comum",
        email: "user@abc.com",
        admin: false,
        favoritos: []
      }
    ];
    localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuariosIniciais));
  }
}

function obterItens() {
  try {
    const itens = JSON.parse(localStorage.getItem(STORAGE_KEYS.itens) || "[]");
    return Array.isArray(itens) ? itens : [];
  } catch (error) {
    return [];
  }
}

function salvarItens(itens) {
  localStorage.setItem(STORAGE_KEYS.itens, JSON.stringify(itens));
}

function obterUsuarios() {
  try {
    const usuarios = JSON.parse(localStorage.getItem(STORAGE_KEYS.usuarios) || "[]");
    return Array.isArray(usuarios) ? usuarios : [];
  } catch (error) {
    return [];
  }
}

function salvarUsuarios(usuarios) {
  localStorage.setItem(STORAGE_KEYS.usuarios, JSON.stringify(usuarios));
}

function obterUsuarioLogado() {
  try {
    const valor = sessionStorage.getItem(STORAGE_KEYS.usuarioLogado);
    return valor ? JSON.parse(valor) : null;
  } catch (error) {
    return null;
  }
}

function definirUsuarioLogado(usuario) {
  sessionStorage.setItem(STORAGE_KEYS.usuarioLogado, JSON.stringify(usuario));
}

function limparUsuarioLogado() {
  sessionStorage.removeItem(STORAGE_KEYS.usuarioLogado);
}

function getFavoritosDoUsuario(usuario) {
  if (!usuario) return [];
  return Array.isArray(usuario.favoritos) ? usuario.favoritos : [];
}

function usuarioEhFavorito(itemId) {
  const usuario = obterUsuarioLogado();
  return getFavoritosDoUsuario(usuario).includes(itemId);
}

function alternarFavorito(itemId) {
  const usuario = obterUsuarioLogado();
  if (!usuario) {
    window.location.href = "login.html";
    return false;
  }

  const usuarios = obterUsuarios();
  const indice = usuarios.findIndex(function(item) {
    return item.id === usuario.id;
  });

  if (indice === -1) {
    return false;
  }

  const favoritosAtuais = getFavoritosDoUsuario(usuarios[indice]);
  const jaEstaNosFavoritos = favoritosAtuais.includes(itemId);
  const novosFavoritos = jaEstaNosFavoritos
    ? favoritosAtuais.filter(function(id) {
        return id !== itemId;
      })
    : favoritosAtuais.concat(itemId);

  usuarios[indice] = Object.assign({}, usuarios[indice], { favoritos: novosFavoritos });
  salvarUsuarios(usuarios);
  definirUsuarioLogado(usuarios[indice]);
  return !jaEstaNosFavoritos;
}

function removerFavorito(itemId) {
  const usuario = obterUsuarioLogado();
  if (!usuario) return;

  const usuarios = obterUsuarios();
  const indice = usuarios.findIndex(function(item) {
    return item.id === usuario.id;
  });

  if (indice === -1) return;

  const novosFavoritos = getFavoritosDoUsuario(usuarios[indice]).filter(function(id) {
    return id !== itemId;
  });

  usuarios[indice] = Object.assign({}, usuarios[indice], { favoritos: novosFavoritos });
  salvarUsuarios(usuarios);
  definirUsuarioLogado(usuarios[indice]);
}

function renderizarMenu() {
  const containers = document.querySelectorAll("#menu-principal");
  const usuario = obterUsuarioLogado();

  containers.forEach(function(container) {
    const itens = [
      { label: "Página Inicial", href: "index.html" },
      { label: "Obras", href: "index.html#obras" },
      { label: "Sobre", href: "index.html#sobre" }
    ];

    if (usuario) {
      itens.splice(1, 0, { label: "Favoritos", href: "favoritos.html" });
      if (usuario.admin) {
        itens.splice(2, 0, { label: "Cadastrar Itens", href: "cadastro-itens.html" });
      }
      itens.push({ label: "Sair", href: "index.html", action: "logout" });
    } else {
      itens.push({ label: "Login", href: "login.html" });
      itens.push({ label: "Cadastro", href: "cadastro.html" });
    }

    container.innerHTML = itens.map(function(item) {
      const attrs = `href="${item.href}" class="nav-link nav-link-custom"`;
      return `
        <li class="nav-item">
          <a ${attrs}${item.action ? ' data-action="logout"' : ''}>${item.label}</a>
        </li>`;
    }).join("");
  });

  document.querySelectorAll("[data-action='logout']").forEach(function(link) {
    link.addEventListener("click", function(evento) {
      evento.preventDefault();
      limparUsuarioLogado();
      window.location.href = "index.html";
    });
  });
}

function montarCarrossel() {
  const inner = document.getElementById("carrossel-inner");
  const indicators = document.getElementById("carrossel-indicators");
  if (!inner) return;

  const destaques = obterItens().filter(function(obra) {
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

function pegarObrasFiltradas() {
  const campoPesquisa = document.getElementById("campo-pesquisa");
  const filtroCategoria = document.getElementById("filtro-categoria");
  const texto = campoPesquisa ? campoPesquisa.value.toLowerCase() : "";
  const categoria = filtroCategoria ? filtroCategoria.value : "todas";

  return obterItens().filter(function(obra) {
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
  const usuarioLogado = obterUsuarioLogado();

  for (let i = 0; i < obrasFiltradas.length; i++) {
    const obra = obrasFiltradas[i];
    const badgePrincipal = obra.principal ? '<span class="badge-principal">✦ Principal</span>' : "";
    const ehFavorito = usuarioLogado ? usuarioEhFavorito(obra.id) : false;
    const iconeFavorito = ehFavorito ? "♥" : "♡";
    const classeFavorito = ehFavorito ? "ativo" : "";
    const acaoFavorito = usuarioLogado ? "" : " data-redirect='login.html'";

    html += `
      <div class="col-12 col-sm-6 col-lg-4 mb-4">
        <div class="card obra-card h-100 ${obra.principal ? 'obra-card-principal' : ''}">
          <button type="button" class="btn-favorito ${classeFavorito}${usuarioLogado ? '' : ' desativado'}"${acaoFavorito} data-id="${obra.id}" aria-label="Adicionar aos favoritos">
            ${iconeFavorito}
          </button>
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

  const lista = document.getElementById("lista-obras");
  if (lista) {
    lista.addEventListener("click", function(evento) {
      const botao = evento.target.closest(".btn-favorito");
      if (botao) {
        evento.preventDefault();
        const id = Number(botao.getAttribute("data-id"));
        if (botao.getAttribute("data-redirect")) {
          window.location.href = botao.getAttribute("data-redirect");
          return;
        }
        alternarFavorito(id);
        montarCards();
      }
    });
  }
}

function montarDetalhes() {
  const areaDetalhe = document.getElementById("detalhe-obra");
  const areaFotos = document.getElementById("detalhe-fotos");
  if (!areaDetalhe) return;

  const parametros = new URLSearchParams(window.location.search);
  const id = Number(parametros.get("id"));
  const obra = obterItens().find(function(item) {
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
  const badgePrincipal = obra.principal ? '<span class="badge-principal ms-2">✦ Obra Principal</span>' : "";
  const usuarioLogado = obterUsuarioLogado();
  const ehFavorito = usuarioLogado ? usuarioEhFavorito(obra.id) : false;
  const iconeFavorito = ehFavorito ? "♥" : "♡";
  const classeFavorito = ehFavorito ? "ativo" : "";

  areaDetalhe.innerHTML = `
    <div class="detalhe-grid">
      <div class="detalhe-imagem-wrap">
        <img src="${obra.imagem}" alt="${obra.titulo}" class="detalhe-imagem-principal ${obra.principal ? 'detalhe-imagem-principal-glow' : ''}" />
      </div>
      <div class="detalhe-info">
        <h2 class="detalhe-titulo">${obra.titulo}${badgePrincipal}</h2>
        <span class="badge-categoria mb-3 d-inline-block">${obra.categoria}</span>

        <div class="mb-3">
          <button type="button" class="btn-favorito ${classeFavorito}${usuarioLogado ? '' : ' desativado'}" data-id="${obra.id}" id="botao-favorito-detalhes" aria-label="Favoritar obra">
            ${iconeFavorito}
          </button>
          <span class="ms-2">${usuarioLogado ? (ehFavorito ? "Favorito" : "Adicionar aos favoritos") : "Faça login para favoritar"}</span>
        </div>

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

  const botaoFavoritoDetalhes = document.getElementById("botao-favorito-detalhes");
  if (botaoFavoritoDetalhes) {
    botaoFavoritoDetalhes.addEventListener("click", function() {
      if (!obterUsuarioLogado()) {
        window.location.href = "login.html";
        return;
      }
      const agoraEhFavorito = alternarFavorito(obra.id);
      if (agoraEhFavorito) {
        botaoFavoritoDetalhes.classList.add("ativo");
        botaoFavoritoDetalhes.innerHTML = "♥";
      } else {
        botaoFavoritoDetalhes.classList.remove("ativo");
        botaoFavoritoDetalhes.innerHTML = "♡";
      }
    });
  }

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

function montarFavoritos() {
  const lista = document.getElementById("lista-favoritos");
  if (!lista) return;

  const usuario = obterUsuarioLogado();
  if (!usuario) {
    window.location.href = "login.html";
    return;
  }

  const favoritos = getFavoritosDoUsuario(usuario);
  const obrasFavoritas = obterItens().filter(function(obra) {
    return favoritos.includes(obra.id);
  });

  if (obrasFavoritas.length === 0) {
    lista.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <p>Você ainda não possui itens favoritos cadastrados.</p>
        </div>
      </div>`;
    return;
  }

  lista.innerHTML = obrasFavoritas.map(function(obra) {
    return `
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card obra-card h-100">
          <a href="detalhes.html?id=${obra.id}">
            <img src="${obra.imagem}" class="card-img-top obra-card-img" alt="${obra.titulo}" />
          </a>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${obra.titulo}</h5>
            <p class="card-text flex-grow-1">${obra.descricao}</p>
            <div class="d-flex gap-2">
              <a href="detalhes.html?id=${obra.id}" class="btn btn-destaque">Ver detalhes</a>
              <button type="button" class="btn btn-outline-light btn-sm" data-remover-id="${obra.id}">Remover</button>
            </div>
          </div>
        </div>
      </div>`;
  }).join("");

  lista.querySelectorAll("[data-remover-id]").forEach(function(botao) {
    botao.addEventListener("click", function() {
      removerFavorito(Number(botao.getAttribute("data-remover-id")));
      montarFavoritos();
    });
  });
}

function configurarCadastro() {
  const form = document.getElementById("form-cadastro");
  if (!form) return;

  form.addEventListener("submit", function(evento) {
    evento.preventDefault();
    const usuarios = obterUsuarios();
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const login = document.getElementById("login-cadastro").value.trim();
    const senha = document.getElementById("senha-cadastro").value;

    const jaExiste = usuarios.some(function(usuario) {
      return usuario.login.toLowerCase() === login.toLowerCase();
    });

    if (jaExiste) {
      alert("Este usuário já existe.");
      return;
    }

    const novoUsuario = {
      id: Date.now().toString(),
      login: login,
      senha: senha,
      nome: nome,
      email: email,
      admin: false,
      favoritos: []
    };

    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);
    definirUsuarioLogado(novoUsuario);
    window.location.href = "index.html";
  });
}

function configurarLogin() {
  const form = document.getElementById("form-login");
  if (!form) return;

  form.addEventListener("submit", function(evento) {
    evento.preventDefault();
    const login = document.getElementById("login").value.trim();
    const senha = document.getElementById("senha").value;

    const usuarios = obterUsuarios();
    const usuarioEncontrado = usuarios.find(function(usuario) {
      return usuario.login === login && usuario.senha === senha;
    });

    if (!usuarioEncontrado) {
      alert("Login ou senha inválidos.");
      return;
    }

    definirUsuarioLogado(usuarioEncontrado);
    window.location.href = "index.html";
  });
}

function configurarCrud() {
  const form = document.getElementById("form-item");
  const tabela = document.getElementById("lista-itens");
  if (!form || !tabela) return;

  const usuario = obterUsuarioLogado();
  if (!usuario || !usuario.admin) {
    window.location.href = "index.html";
    return;
  }

  function renderizarTabela() {
    const itens = obterItens();
    tabela.innerHTML = itens.map(function(item) {
      return `
        <tr>
          <td>${item.titulo}</td>
          <td>${item.categoria}</td>
          <td>${item.destaque ? "Sim" : "Não"}</td>
          <td>
            <button type="button" class="btn btn-sm btn-outline-light me-2" data-editar-id="${item.id}">Editar</button>
            <button type="button" class="btn btn-sm btn-outline-danger" data-excluir-id="${item.id}">Excluir</button>
          </td>
        </tr>`;
    }).join("");
  }

  form.addEventListener("submit", function(evento) {
    evento.preventDefault();
    const itens = obterItens();
    const idCampo = document.getElementById("item-id").value;
    const novoItem = {
      id: idCampo ? Number(idCampo) : Date.now(),
      titulo: document.getElementById("titulo").value.trim(),
      descricao: document.getElementById("descricao").value.trim(),
      conteudo: document.getElementById("conteudo").value.trim(),
      categoria: document.getElementById("categoria").value.trim(),
      imagem: document.getElementById("imagem").value.trim(),
      tecnica: document.getElementById("tecnica").value.trim(),
      dimensoes: document.getElementById("dimensoes").value.trim(),
      data: document.getElementById("data").value || new Date().toISOString().slice(0, 10),
      destaque: document.getElementById("destaque").checked,
      principal: document.getElementById("principal").checked,
      autor: "Jessica",
      fotos: []
    };

    if (idCampo) {
      const indice = itens.findIndex(function(item) {
        return item.id === Number(idCampo);
      });
      if (indice !== -1) {
        itens[indice] = Object.assign({}, itens[indice], novoItem);
      }
    } else {
      itens.push(novoItem);
    }

    salvarItens(itens);
    form.reset();
    document.getElementById("item-id").value = "";
    renderizarTabela();
  });

  tabela.addEventListener("click", function(evento) {
    const botaoEditar = evento.target.closest("[data-editar-id]");
    const botaoExcluir = evento.target.closest("[data-excluir-id]");

    if (botaoEditar) {
      const id = Number(botaoEditar.getAttribute("data-editar-id"));
      const item = obterItens().find(function(obra) {
        return obra.id === id;
      });
      if (item) {
        document.getElementById("item-id").value = item.id;
        document.getElementById("titulo").value = item.titulo;
        document.getElementById("descricao").value = item.descricao;
        document.getElementById("conteudo").value = item.conteudo;
        document.getElementById("categoria").value = item.categoria;
        document.getElementById("imagem").value = item.imagem;
        document.getElementById("tecnica").value = item.tecnica;
        document.getElementById("dimensoes").value = item.dimensoes;
        document.getElementById("data").value = item.data;
        document.getElementById("destaque").checked = Boolean(item.destaque);
        document.getElementById("principal").checked = Boolean(item.principal);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    if (botaoExcluir) {
      const id = Number(botaoExcluir.getAttribute("data-excluir-id"));
      const itensAtualizados = obterItens().filter(function(item) {
        return item.id !== id;
      });
      salvarItens(itensAtualizados);
      renderizarTabela();
    }
  });

  renderizarTabela();
}

function formatarData(dataStr) {
  if (!dataStr) return "—";
  const partes = dataStr.split("-");
  if (partes.length !== 3) return dataStr;
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

document.addEventListener("DOMContentLoaded", function() {
  inicializarStorage();
  renderizarMenu();
  montarCarrossel();
  montarCards();
  configurarEventos();
  montarDetalhes();
  montarFavoritos();
  configurarCadastro();
  configurarLogin();
  configurarCrud();
});
