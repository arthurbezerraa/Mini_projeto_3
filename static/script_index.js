var lista = document.getElementById("lista-tarefas");

function adicionarTarefa() {

    // Capturar os inputs do formulário
    var titulo = document.getElementById("titulo-tarefa").value.trim();
    var data = document.getElementById("data-tarefa").value;
    var descricao = document.getElementById("descricao-tarefa").value.trim();
    var comentario = document.getElementById("comentario-tarefa").value.trim();
    var prioridade = document.getElementById("prioridade-tarefa").value;
    var notificacao = document.getElementById("notificacao-tarefa").value;

    // Tratamento para campos vazios
    if (titulo === "" || data === "" || descricao === "") {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (comentario === "") {
        comentario = "Nenhum comentário adicionado.";
    }

    // Capturar a data de criação
    const now = new Date();
    const dataCriacao = now.toISOString().split('T')[0];

    // Criar elemento da tarefa
    var li = document.createElement("li");
    li.className = "list-group-item d-flex flex-column";

    // Cabeçalho visível da tarefa
    // Usando encodeURIComponent para passar os parâmetros via URL
    li.innerHTML = `<strong><a href="detalhes_tarefa.html?titulo=${encodeURIComponent(titulo)}&data=${encodeURIComponent(data)}&descricao=${encodeURIComponent(descricao)}&comentario=${encodeURIComponent(comentario)}&prioridade=${encodeURIComponent(prioridade)}&notificacao=${encodeURIComponent(notificacao)}&dataCriacao=${encodeURIComponent(dataCriacao)}">${titulo}</a></strong> ${data} - Descrição: ${descricao} - Prioridade: ${prioridade}`;

    // Div oculta com detalhes
    var detalhes = document.createElement("div");
    detalhes.style.display = "none";
    detalhes.innerHTML = `<p><strong>Comentário:</strong> ${comentario}</p><p><strong>Data de criação:</strong> ${dataCriacao}</p>`; 

    // Botão de detalhes
    var botaoDetalhes = document.createElement("button");
    botaoDetalhes.textContent = "Detalhes";
    botaoDetalhes.className = "btn btn-outline-info btn-sm";
    botaoDetalhes.onclick = function () {
        if (detalhes.style.display === "none") {
            detalhes.style.display = "block";
            botaoDetalhes.textContent = "Ocultar";
        } else {
            detalhes.style.display = "none";
            botaoDetalhes.textContent = "Detalhes";
        }
    };

    // Botão de remover
    var botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";
    botaoRemover.className = "btn btn-outline-danger btn-sm";
    botaoRemover.onclick = function () {
        lista.removeChild(li);
        atualizarMensagemVazia();
    };

    // Botão de editar
    var botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar";
    botaoEditar.className = "btn btn-outline-warning btn-sm";
    botaoEditar.onclick = function () {
        document.getElementById("titulo-tarefa").value = titulo;
        document.getElementById("data-tarefa").value = data;
        document.getElementById("descricao-tarefa").value = descricao;
        document.getElementById("comentario-tarefa").value = comentario;
        document.getElementById("prioridade-tarefa").value = prioridade;
        document.getElementById("notificacao-tarefa").value = notificacao;
        lista.removeChild(li);
        atualizarMensagemVazia();
    }

    // Div para alinhar os botões
    var containerBotoes = document.createElement("div");
    containerBotoes.className = "d-flex gap-2 mt-2";  // Alinha na horizontal com espaçamento e margem superior

    // Adiciona os botões ao container
    containerBotoes.appendChild(botaoDetalhes);
    containerBotoes.appendChild(botaoRemover);
    containerBotoes.appendChild(botaoEditar);

    // Adiciona tudo ao <li>
    li.appendChild(document.createElement("br"));
    li.appendChild(containerBotoes);
    li.appendChild(detalhes);
    li.appendChild(document.createElement("br"));

    lista.appendChild(li);
    atualizarMensagemVazia();

    // Limpa o formulário
    document.querySelector("form").reset();

    // Adiciona mensagem de confirmação
    var confirmacao = document.createElement("div");
    confirmacao.className = "alert alert-success mt-3";
    confirmacao.textContent = "Tarefa adicionada com sucesso!";
    var posicao = document.getElementsByTagName("form")[0];
    posicao.parentNode.insertBefore(confirmacao, posicao.nextSibling);
    setTimeout(function () {
        confirmacao.remove();
    }, 2000); // Remove a mensagem após 2 segundos
}

function atualizarMensagemVazia() {
    const lista = document.getElementById("lista-tarefas");
    const mensagem = document.getElementById("mensagem-vazia");
    mensagem.style.display = lista.children.length === 0 ? "block" : "none";
}

function voltar() {
    window.location.href = "index.html";
}


function filtrarDataCriacao() {
    const tarefas = Array.from(document.querySelectorAll("#lista-tarefas li"));
    
    // Ordena por data de criação (mais recente primeiro)
    tarefas.sort((a, b) => {
        const dataA = a.querySelector("div p:nth-child(2)").textContent.split(": ")[1];
        const dataB = b.querySelector("div p:nth-child(2)").textContent.split(": ")[1];
        return new Date(dataB) - new Date(dataA);
    });
    
    // Reorganiza a lista
    const lista = document.getElementById("lista-tarefas");
    lista.innerHTML = '';
    tarefas.forEach(tarefa => lista.appendChild(tarefa));  
}

function filtrarDataTarefa() {
    const tarefas = Array.from(document.querySelectorAll("#lista-tarefas li"));
    
    // Ordena por data da tarefa (mais próxima primeiro)
    tarefas.sort((a, b) => {
        const textoA = a.textContent;
        const textoB = b.textContent;
        const dataA = textoA.match(/\d{4}-\d{2}-\d{2}/)[0];
        const dataB = textoB.match(/\d{4}-\d{2}-\d{2}/)[0];
        return new Date(dataA) - new Date(dataB);
    });
    
    // Reorganiza a lista
    const lista = document.getElementById("lista-tarefas");
    lista.innerHTML = '';
    tarefas.forEach(tarefa => lista.appendChild(tarefa));
}

function filtrarPrioridade() {
    const ordemPrioridade = { "alta": 1, "media": 2, "baixa": 3 };
    const tarefas = Array.from(document.querySelectorAll("#lista-tarefas li"));
    
    // Ordena por prioridade (alta > média > baixa)
    tarefas.sort((a, b) => {
        const prioridadeA = a.textContent.match(/Prioridade: (\w+)/)[1].toLowerCase();
        const prioridadeB = b.textContent.match(/Prioridade: (\w+)/)[1].toLowerCase();
        return ordemPrioridade[prioridadeA] - ordemPrioridade[prioridadeB];
    });
    
    // Reorganiza a lista
    const lista = document.getElementById("lista-tarefas");
    lista.innerHTML = '';
    tarefas.forEach(tarefa => lista.appendChild(tarefa));
}

function filtrarOrdemAlfabetica() {
    const tarefas = Array.from(document.querySelectorAll("#lista-tarefas li"));
    
    // Ordena alfabeticamente pela descrição
    tarefas.sort((a, b) => {
        const descricaoA = a.textContent.match(/Descrição: (.+?) - Prioridade:/)[1].toLowerCase();
        const descricaoB = b.textContent.match(/Descrição: (.+?) - Prioridade:/)[1].toLowerCase();
        return descricaoA.localeCompare(descricaoB);
    });
    
    // Reorganiza a lista
    const lista = document.getElementById("lista-tarefas");
    lista.innerHTML = '';
    tarefas.forEach(tarefa => lista.appendChild(tarefa));
}