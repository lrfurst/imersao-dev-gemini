const cardContainer = document.querySelector(".cards-container");
const campoBusca = document.querySelector("#campo-busca");
const botaoLimpar = document.querySelector("#botao-limpar");
const filterContainer = document.querySelector("#filter-container");
let dados = [];

async function carregarDados() {
    const resposta = await fetch("data.json");
    dados = await resposta.json();
    renderizarCards(dados);
}

function buscar() {
    const termoBuscado = campoBusca.value.toLowerCase();
    const categoriaAtiva = document.querySelector(".filter-btn.active").dataset.category;

    const resultados = dados.filter(dado => {
        let correspondeCategoria = false;
        if (categoriaAtiva === 'all') {
            correspondeCategoria = true;
        } else if (categoriaAtiva === 'Geração de Imagem') {
            correspondeCategoria = dado.categoria === 'Geração de Imagem' || dado.categoria === 'Edição de Imagem';
        } else {
            correspondeCategoria = dado.categoria === categoriaAtiva;
        }

        const correspondeBusca = dado.nome.toLowerCase().includes(termoBuscado) || 
                                 dado.descricao.toLowerCase().includes(termoBuscado) ||
                                 dado.tags.some(tag => tag.toLowerCase().includes(termoBuscado));
        return correspondeCategoria && correspondeBusca;
    });

    renderizarCards(resultados);
}

function filtrarPorCategoria(evento) {
    if (!evento.target.matches('.filter-btn')) return;

    const botaoClicado = evento.target;
    
    // Remove a classe 'active' de todos os botões e a adiciona ao botão clicado
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    botaoClicado.classList.add('active');

    // re-executa a busca para aplicar o filtro de categoria junto com o termo de busca atual
    buscar();
}

function limparBusca() {
    campoBusca.value = '';
    buscar(); // Usa a função buscar para renderizar com o filtro de categoria correto
    campoBusca.focus();
}

function renderizarCards(items) {
    cardContainer.innerHTML = ''; // Limpa os cards existentes

    if (items.length === 0) {
        cardContainer.innerHTML = `
            <div class="not-found-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                IA não localizada
            </div>
        `;
        return;
    }

    for (const item of items) {
        const article = document.createElement("article");
        article.classList.add("card");
        article.dataset.category = item.categoria;

        // Gera o HTML para as tags
        const tagsHtml = item.tags.map(tag => `<span class="tag" data-category="${item.categoria.toLowerCase().replace(/ /g, '-')}">#${tag}</span>`).join('');

        article.innerHTML = `
            <div class="card-header">
                <img src="${item.logo}" alt="Logo de ${item.nome}" class="card-logo">
                <div class="card-title-group">
                    <h2 class="card-title">${item.nome}</h2>
                    <span class="card-category">${item.categoria}</span>
                </div>
            </div>
            <div class="card-tags">${tagsHtml}</div>
            <p>${item.descricao}</p>
            <a href="${item.link}" target="_blank" class="card-link">Acesse aqui</a>
        `;
        cardContainer.appendChild(article);
    }

    // Adiciona o card decorativo com o ícone de rede neural no final
    adicionarIconeDecorativo();
}

function adicionarIconeDecorativo() {
    const neuralCard = document.createElement("article");
    neuralCard.classList.add("card", "neural-icon-card");
    neuralCard.setAttribute("aria-hidden", "true"); // Esconde de leitores de tela, pois é decorativo

    neuralCard.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="5" r="2.5"></circle>
            <circle cx="5" cy="12" r="2.5"></circle>
            <circle cx="19" cy="12" r="2.5"></circle>
            <path d="M12 7.5v10m-7-5h14"></path>
        </svg>
    `;
    cardContainer.appendChild(neuralCard);
}

// Adiciona os event listeners
campoBusca.addEventListener('input', buscar);
botaoLimpar.addEventListener('click', limparBusca);
filterContainer.addEventListener('click', filtrarPorCategoria);

function adicionarAssinatura() {
    const footer = document.querySelector('.footer');
    if (footer) {
        const signature = document.createElement('div');
        signature.classList.add('footer-signature');
        signature.textContent = 'Produzido by Luis Furst';
        footer.appendChild(signature);
    }
}

carregarDados(); // Chama a função para carregar os dados assim que o script for executado
adicionarAssinatura(); // Adiciona a assinatura no rodapé
