// ===================== IDENTIFICAR CLIENTE PELA URL =====================
const params = new URLSearchParams(window.location.search);
const clienteId = params.get('id');

function carregarClientes() {
    return JSON.parse(localStorage.getItem('clienteStorage')) || [];
}

function salvarClientesGlobal(clientes) {
    localStorage.setItem('clienteStorage', JSON.stringify(clientes));
}

let clienteAtual = carregarClientes().find(c => c.id === clienteId);

// Se o cliente não existir (id inválido, foi excluído, etc.) avisa e manda de volta
if (!clienteAtual) {
    document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:14px;color:#9C94B8;font-family:Inter,sans-serif;">
            <p style="font-size:15px;">Cliente não encontrado.</p>
            <a href="../index.html" style="color:#9B7BFF;text-decoration:none;font-weight:600;">← Voltar para os contatos</a>
        </div>`;
    throw new Error('Cliente não encontrado');
}

function salvarClienteAtual() {
    const clientes = carregarClientes();
    const idx = clientes.findIndex(c => c.id === clienteId);
    if (idx !== -1) {
        clientes[idx] = clienteAtual;
        salvarClientesGlobal(clientes);
    }
}

// ===================== CABEÇALHO =====================
function preencherHeader() {
    document.title = `${clienteAtual.nome} — ${clienteAtual.empresa}`;
    document.getElementById('clienteNomeHeader').textContent = clienteAtual.nome;
    document.getElementById('clienteEmpresaHeader').textContent = clienteAtual.empresa;
    document.getElementById('infoDepartamento').textContent = clienteAtual.departamento;
    document.getElementById('infoAdicional').value = clienteAtual.adicional && clienteAtual.adicional !== '!informação...' ? clienteAtual.adicional : '';

    const pic = document.getElementById('profilePicHeader');
    pic.textContent = clienteAtual.nome.slice(0, 2).toUpperCase();
    pic.style.backgroundColor = clienteAtual.corPerfil;

    document.getElementById('statusBall').className = clienteAtual.statusClass;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('infoAdicional').addEventListener('blur', () => {
        clienteAtual.adicional = document.getElementById('infoAdicional').value;
        salvarClienteAtual();
    });
    document.getElementById('statusPillHeader').addEventListener('click', alternarStatus);
});

function alternarStatus() {
    const ordem = ['status-ball', 'status-ball-ausente', 'status-ball-inativo'];
    const atual = ordem.indexOf(clienteAtual.statusClass);
    clienteAtual.statusClass = ordem[(atual + 1) % ordem.length];
    document.getElementById('statusBall').className = clienteAtual.statusClass;
    salvarClienteAtual();
}

// ===================== CALENDÁRIO DE REUNIÕES =====================
let reunioes = JSON.parse(localStorage.getItem(`reunioes_${clienteId}`)) || {};
const hoje = new Date();
let mesAtual = hoje.getMonth();
let anoAtual = hoje.getFullYear();
let diaSelecionado = null;

const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function salvarReunioes() {
    localStorage.setItem(`reunioes_${clienteId}`, JSON.stringify(reunioes));
}

function formatarDataChave(ano, mes, dia) {
    return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
}

function renderizarCalendario() {
    document.getElementById('mesAnoLabel').textContent = `${nomesMeses[mesAtual]} ${anoAtual}`;
    const grid = document.getElementById('calendarioGrid');
    grid.innerHTML = '';

    const primeiroDiaSemana = new Date(anoAtual, mesAtual, 1).getDay();
    const totalDias = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const hojeChave = formatarDataChave(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    for (let i = 0; i < primeiroDiaSemana; i++) {
        const vazio = document.createElement('div');
        vazio.className = 'dia-vazio';
        grid.appendChild(vazio);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        const chave = formatarDataChave(anoAtual, mesAtual, dia);
        const celula = document.createElement('div');
        celula.className = 'dia-cel';
        if (chave === hojeChave) celula.classList.add('dia-hoje');
        if (reunioes[chave]) celula.classList.add('dia-marcado');

        celula.innerHTML = `<span>${dia}</span>${reunioes[chave] ? '<div class="dot-reuniao"></div>' : ''}`;
        celula.title = reunioes[chave] ? reunioes[chave].titulo : 'Marcar reunião';
        celula.addEventListener('click', () => abrirModalReuniao(chave));
        grid.appendChild(celula);
    }
}

function mudarMes(delta) {
    mesAtual += delta;
    if (mesAtual < 0) { mesAtual = 11; anoAtual--; }
    if (mesAtual > 11) { mesAtual = 0; anoAtual++; }
    renderizarCalendario();
}

function abrirModalReuniao(chave) {
    diaSelecionado = chave;
    const [ano, mes, dia] = chave.split('-');
    const reuniao = reunioes[chave];

    document.getElementById('modalReuniaoData').textContent = `${dia}/${mes}/${ano}`;
    document.getElementById('reuniaoTitulo').value = reuniao ? reuniao.titulo : '';
    document.getElementById('reuniaoHorario').value = reuniao ? reuniao.horario : '';
    document.getElementById('reuniaoObs').value = reuniao ? reuniao.obs : '';
    document.getElementById('btnRemoverReuniao').style.display = reuniao ? 'inline-flex' : 'none';
    document.getElementById('modalReuniao').style.display = 'flex';
}

function fecharModalReuniao() {
    document.getElementById('modalReuniao').style.display = 'none';
    diaSelecionado = null;
}

function salvarReuniao() {
    const titulo = document.getElementById('reuniaoTitulo').value.trim();
    const horario = document.getElementById('reuniaoHorario').value;
    const obs = document.getElementById('reuniaoObs').value.trim();

    if (!titulo) {
        alert('Digite um título para a reunião.');
        return;
    }

    reunioes[diaSelecionado] = { titulo, horario, obs };
    salvarReunioes();
    renderizarCalendario();
    fecharModalReuniao();
}

function removerReuniao() {
    delete reunioes[diaSelecionado];
    salvarReunioes();
    renderizarCalendario();
    fecharModalReuniao();
}

// ===================== EDITOR DE NOTAS (ESTILO NOTION) =====================
const notasKey = `notas_${clienteId}`;
let salvarNotasTimeout = null;

function iniciarEditorNotas() {
    const editor = document.getElementById('editorNotas');
    const salvo = localStorage.getItem(notasKey);
    if (salvo) editor.innerHTML = salvo;

    editor.addEventListener('input', () => {
        document.getElementById('statusSalvo').textContent = 'Salvando...';
        clearTimeout(salvarNotasTimeout);
        salvarNotasTimeout = setTimeout(() => {
            localStorage.setItem(notasKey, editor.innerHTML);
            const agora = new Date();
            const hh = String(agora.getHours()).padStart(2, '0');
            const mm = String(agora.getMinutes()).padStart(2, '0');
            document.getElementById('statusSalvo').textContent = `Salvo às ${hh}:${mm}`;
        }, 500);
    });
}

function formatarTexto(comando, valor = null) {
    document.execCommand(comando, false, valor);
    document.getElementById('editorNotas').focus();
}

function inserirChecklist() {
    document.execCommand('insertHTML', false, '<div class="check-item"><input type="checkbox"><span contenteditable="true">Novo item</span></div>');
    document.getElementById('editorNotas').focus();
}

// ===================== INICIALIZAÇÃO =====================
window.onload = function () {
    preencherHeader();
    renderizarCalendario();
    iniciarEditorNotas();
};
