var lista = document.getElementById("lista-tarefas");

function adicionarTarefa() {
    // Capturar os inputs do formulário
    var titulo = document.getElementById("titulo-tarefa").value.trim();
    var data = document.getElementById("data-tarefa").value;
    var descricao = document.getElementById("descricao-tarefa").value.trim();
    var comentario = document.getElementById("comentario-tarefa").value.trim();
    var prioridade = document.getElementById("prioridade-tarefa").value;
    var notificacao = document.getElementById("notificacao-tarefa").value;

    // Validação dos campos obrigatórios
    if (titulo === "" || data === "" || descricao === "") {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    if (comentario === "") {
        comentario = "Nenhum comentário adicionado.";
    }

    // Capturar a data de criação com hora/minutos/segundos (formato completo)
    const dataCriacao = new Date();
    const dataCriacaoISO = dataCriacao.toISOString(); // Mantém o formato completo
    const dataCriacaoFormatada = dataCriacao.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Criar elemento da tarefa
    var li = document.createElement("li");
    li.className = "list-group-item d-flex flex-column";

    // Conteúdo da tarefa com parâmetros codificados
    li.innerHTML = `
        <strong>
            <a href="detalhes_tarefa.html?titulo=${encodeURIComponent(titulo)}&data=${encodeURIComponent(data)}&descricao=${encodeURIComponent(descricao)}&comentario=${encodeURIComponent(comentario)}&prioridade=${encodeURIComponent(prioridade)}&notificacao=${encodeURIComponent(notificacao)}&dataCriacao=${encodeURIComponent(dataCriacaoISO)}">
                ${titulo}
            </a>
        </strong>
        ${data} - Descrição: ${descricao} - Prioridade: ${prioridade}
    `;

    // Detalhes ocultos
    var detalhes = document.createElement("div");
    detalhes.style.display = "none";
    detalhes.innerHTML = `
        <p><strong>Comentário:</strong> ${comentario}</p>
        <p><strong>Data de criação:</strong> ${dataCriacaoFormatada}</p>
    `;

    // Botões de ação
    var botaoDetalhes = criarBotao("Detalhes", "btn-outline-info", function() {
        detalhes.style.display = detalhes.style.display === "none" ? "block" : "none";
        this.textContent = detalhes.style.display === "none" ? "Detalhes" : "Ocultar";
    });

    var botaoRemover = criarBotao("Remover", "btn-outline-danger", function() {
        lista.removeChild(li);
        atualizarMensagemVazia();
    });

    var botaoEditar = criarBotao("Editar", "btn-outline-warning", function() {
        preencherFormularioEdicao(titulo, data, descricao, comentario, prioridade, notificacao);
        lista.removeChild(li);
        atualizarMensagemVazia();
    });

    // Container para os botões
    var containerBotoes = document.createElement("div");
    containerBotoes.className = "d-flex gap-2 mt-2";
    containerBotoes.append(botaoDetalhes, botaoRemover, botaoEditar);

    // Montagem final do elemento
    li.append(document.createElement("br"), containerBotoes, detalhes, document.createElement("br"));
    lista.appendChild(li);
    atualizarMensagemVazia();

    // Limpar formulário e mostrar confirmação
    document.querySelector("form").reset();
    mostrarMensagemConfirmacao("Tarefa adicionada com sucesso!");
}

// Funções auxiliares (mantidas as mesmas)
function criarBotao(texto, classe, onClick) {
    var botao = document.createElement("button");
    botao.textContent = texto;
    botao.className = `btn ${classe} btn-sm`;
    botao.onclick = onClick;
    return botao;
}

function preencherFormularioEdicao(titulo, data, descricao, comentario, prioridade, notificacao) {
    document.getElementById("titulo-tarefa").value = titulo;
    document.getElementById("data-tarefa").value = data;
    document.getElementById("descricao-tarefa").value = descricao;
    document.getElementById("comentario-tarefa").value = comentario;
    document.getElementById("prioridade-tarefa").value = prioridade;
    document.getElementById("notificacao-tarefa").value = notificacao;
}

function mostrarMensagemConfirmacao(mensagem) {
    var confirmacao = document.createElement("div");
    confirmacao.className = "alert alert-success mt-3";
    confirmacao.textContent = mensagem;
    document.querySelector("form").after(confirmacao);
    setTimeout(() => confirmacao.remove(), 2000);
}

function atualizarMensagemVazia() {
    const mensagem = document.getElementById("mensagem-vazia");
    mensagem.style.display = lista.children.length === 0 ? "block" : "none";
}

function voltar() {
    window.location.href = "index.html";
}

// Funções de filtro atualizadas
function filtrarDataCriacao() {
    const tarefas = Array.from(document.querySelectorAll("#lista-tarefas li"));
    
    tarefas.sort((a, b) => {
        const urlA = a.querySelector("a").href;
        const urlB = b.querySelector("a").href;
        const dataA = new URL(urlA).searchParams.get("dataCriacao");
        const dataB = new URL(urlB).searchParams.get("dataCriacao");
        
        if (!dataA || !dataB) return 0;
        return new Date(dataB) - new Date(dataA); // Mais recente primeiro
    });
    
    const lista = document.getElementById("lista-tarefas");
    lista.innerHTML = '';
    tarefas.forEach(tarefa => lista.appendChild(tarefa));
}

// Outras funções de filtro (mantidas as mesmas)
function filtrarDataTarefa() {
    const tarefas = Array.from(document.querySelectorAll("#lista-tarefas li"));
    
    tarefas.sort((a, b) => {
        const textoA = a.textContent;
        const textoB = b.textContent;
        const dataA = textoA.match(/\d{4}-\d{2}-\d{2}/)[0];
        const dataB = textoB.match(/\d{4}-\d{2}-\d{2}/)[0];
        return new Date(dataA) - new Date(dataB); // Mais próxima primeiro
    });
    
    const lista = document.getElementById("lista-tarefas");
    lista.innerHTML = '';
    tarefas.forEach(tarefa => lista.appendChild(tarefa));
}

function filtrarPrioridade() {
    const ordemPrioridade = { "alta": 1, "media": 2, "baixa": 3 };
    const tarefas = Array.from(document.querySelectorAll("#lista-tarefas li"));
    
    tarefas.sort((a, b) => {
        const urlA = a.querySelector("a").href;
        const urlB = b.querySelector("a").href;
        const prioridadeA = new URL(urlA).searchParams.get("prioridade").toLowerCase();
        const prioridadeB = new URL(urlB).searchParams.get("prioridade").toLowerCase();
        return ordemPrioridade[prioridadeA] - ordemPrioridade[prioridadeB];
    });
    
    const lista = document.getElementById("lista-tarefas");
    lista.innerHTML = '';
    tarefas.forEach(tarefa => lista.appendChild(tarefa));
}

function filtrarOrdemAlfabetica() {
    const tarefas = Array.from(document.querySelectorAll("#lista-tarefas li"));
    
    tarefas.sort((a, b) => {
        const descricaoA = a.textContent.match(/Descrição: (.+?) - Prioridade:/)[1].toLowerCase();
        const descricaoB = b.textContent.match(/Descrição: (.+?) - Prioridade:/)[1].toLowerCase();
        return descricaoA.localeCompare(descricaoB);
    });
    
    const lista = document.getElementById("lista-tarefas");
    lista.innerHTML = '';
    tarefas.forEach(tarefa => lista.appendChild(tarefa));
}