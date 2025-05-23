// Carrega os detalhes da tarefa quando a página é aberta
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);

    const dataTarefaStr = params.get('data');
    const dataTarefa = new Date(dataTarefaStr);
    const dataAtual = new Date();
    var status = '';
    const statusTarefa = document.getElementById('status-tarefa');
    if (dataTarefa < dataAtual){
        status = 'Atrasada';
        statusTarefa.textContent = status;
        statusTarefa.style.color = 'red';
    } else{
        status = 'Em andamento';
        statusTarefa.textContent = status;
        statusTarefa.style.color = 'green';
    }
    
    document.getElementById('titulo-tarefa').textContent = params.get('titulo');
    document.getElementById('data-tarefa').textContent = params.get('data');
    document.getElementById('descricao-tarefa').textContent = params.get('descricao');
    document.getElementById('comentario-tarefa').textContent = params.get('comentario') || 'Nenhum comentário adicionado.';
    document.getElementById('prioridade-tarefa').textContent = params.get('prioridade');
    document.getElementById('notificacao-tarefa').textContent = params.get('notificacao') === 'sim' ? 'Sim' : 'Não';
    
    // Formata a data de criação para exibição
    const dataCriacaoISO = params.get('dataCriacao');
    const dataCriacaoFormatada = new Date(dataCriacaoISO).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('data-criacao').textContent = dataCriacaoFormatada;
})

function voltar() {
    window.history.back();
}