let assigned = -1;
let elements = [];

function openForms() {
    const getForm = document.getElementById('form');
    const aberto = getForm.style.display === 'flex';
    getForm.style.display = aberto ? 'none' : 'flex';

    if (!aberto) {
        // resetar ao abrir
        assigned = -1;
        elements.forEach(el => el.querySelector('img').src = './imgs/Rectangle 13.png');
    }
}

function assigneCheck() {
    elements = document.querySelectorAll('.rec-check');
    elements.forEach(function(element, index) {
        element.addEventListener('click', function() {
            const img = element.querySelector('img');
            if (assigned === index) {
                img.src = './imgs/Rectangle 13.png';
                assigned = -1;
                return;
            }
            if (assigned !== -1) {
                elements[assigned].querySelector('img').src = './imgs/Rectangle 13.png';
            }
            img.src = './imgs/Active.svg';
            assigned = index;
        });
    });
}

// ===================== STORAGE =====================
let clienteStorage = JSON.parse(localStorage.getItem('clienteStorage')) || [];
let lixeiraStorage = JSON.parse(localStorage.getItem('lixeiraStorage')) || [];

function salvarClientes() {
    localStorage.setItem('clienteStorage', JSON.stringify(clienteStorage));
}

function salvarLixeira() {
    localStorage.setItem('lixeiraStorage', JSON.stringify(lixeiraStorage));
}

function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ===================== CRIAR CLIENTE =====================
function criarCliente() {
    const nome = document.getElementById('contatoAdd').value || "!nome...";
    const empresa = document.getElementById('empresaAdd').value || "!empresa...";
    const departamento = document.getElementById('departamentoAdd').value || "!departamento...";
    const adicional = document.getElementById('informacoesAdd').value || "!informação...";
    const statusClasses = ['status-ball', 'status-ball-ausente', 'status-ball-inativo'];
    const statusClass = assigned !== -1 ? statusClasses[assigned] : 'status-ball';
    const cores = ['#D1E0FF', '#FFD1D1', '#D1FFD6', '#FFE8D1', '#E8D1FF', '#D1F5FF', '#FFD1F0'];
    const corPerfil = cores[Math.floor(Math.random() * cores.length)];

    const novoCliente = { id: gerarId(), nome, empresa, departamento, adicional, statusClass, corPerfil };
    clienteStorage.push(novoCliente);
    salvarClientes();
    renderizarCliente(novoCliente);

    document.getElementById('form').style.display = 'none';
    ['contatoAdd', 'empresaAdd', 'departamentoAdd', 'informacoesAdd'].forEach(id => document.getElementById(id).value = '');

    assigned = -1;
    elements.forEach(el => el.querySelector('img').src = './imgs/Rectangle 13.png');
}

function renderizarCliente(c) {
    const iniciais = c.nome.slice(0, 2).toUpperCase();
    const cliente = document.createElement('div');
    cliente.className = 'cliente';
    cliente.dataset.id = c.id;
    cliente.innerHTML = `
        <div class="profile-pic" style="background-color: ${c.corPerfil};"><p>${iniciais}</p></div>
        <div class="dados-grupo">
            <span class="dado-item">${c.nome}</span>
            <span class="sep">—</span>
            <span class="dado-item">${c.empresa}</span>
            <span class="sep">—</span>
            <span class="dado-item">${c.departamento}</span>
        </div>
        <div class="status">
            <span class="status-label">STATUS</span>
            <div class="${c.statusClass}"></div>
        </div>
        <div class="excluir" onclick="deletar(this)">
            <img src="./imgs/Trash.svg" alt="excluir-card-png" style="pointer-events: none;">
        </div>
    `;
    document.getElementById('contatos').appendChild(cliente);
}

// ===================== EXCLUIR (MANDA PRA LIXEIRA) =====================
function deletar(botao) {
    const clienteEl = botao.closest('.cliente');
    const id = clienteEl.dataset.id;

    const index = clienteStorage.findIndex(c => c.id === id);
    if (index === -1) return;

    const [cliente] = clienteStorage.splice(index, 1);
    lixeiraStorage.push(cliente);

    salvarClientes();
    salvarLixeira();
    clienteEl.remove();
}

// ===================== LIXEIRA =====================
function abrirLixeira() {
    renderizarLixeira();
    document.getElementById('lixo').style.display = 'flex';
}

function fecharLixeira() {
    document.getElementById('lixo').style.display = 'none';
}

function renderizarLixeira() {
    const lista = document.getElementById('listaLixeira');
    lista.innerHTML = '';

    if (lixeiraStorage.length === 0) {
        lista.innerHTML = `
            <div class="lixeira-vazia">
                <i class="fa-solid fa-trash-can"></i>
                <p>A lixeira está vazia</p>
            </div>`;
        return;
    }

    lixeiraStorage.forEach(c => {
        const iniciais = c.nome.slice(0, 2).toUpperCase();
        const item = document.createElement('div');
        item.className = 'item-lixeira';
        item.dataset.id = c.id;
        item.innerHTML = `
            <div class="profile-name-pic" style="background-color: ${c.corPerfil};">${iniciais}</div>
            <div class="info-lixeira">
                <p class="nome-lixo">${c.nome}</p>
                <span class="empresa-lixo">${c.empresa} — ${c.departamento}</span>
            </div>
            <div class="acoes-lixeira">
                <button class="btn-restaurar"><i class="fa-solid fa-rotate-left"></i> Restaurar</button>
                <button class="btn-deletar-perm"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        item.querySelector('.btn-restaurar').addEventListener('click', () => restaurarCliente(c.id));
        item.querySelector('.btn-deletar-perm').addEventListener('click', () => deletarPermanente(c.id));
        lista.appendChild(item);
    });
}

function restaurarCliente(id) {
    const index = lixeiraStorage.findIndex(c => c.id === id);
    if (index === -1) return;

    const [cliente] = lixeiraStorage.splice(index, 1);
    clienteStorage.push(cliente);

    salvarClientes();
    salvarLixeira();

    renderizarCliente(cliente);
    renderizarLixeira();
}

function deletarPermanente(id) {
    lixeiraStorage = lixeiraStorage.filter(c => c.id !== id);
    salvarLixeira();
    renderizarLixeira();
}

// ===================== INICIALIZAÇÃO =====================
window.onload = function() {
    // primeira vez que a página roda (localStorage vazio): cria um contato de exemplo
    const primeiraVez = localStorage.getItem('clienteStorage') === null;
    if (primeiraVez) {
        clienteStorage.push({
            id: gerarId(),
            nome: 'Mark Watney',
            empresa: 'NASA',
            departamento: 'Departamento de botânica',
            adicional: '',
            statusClass: 'status-ball',
            corPerfil: '#D1E0FF'
        });
        salvarClientes();
    }

    // clientes salvos de uma versão anterior podem não ter "id" — corrige isso
    let precisaResalvar = false;
    clienteStorage.forEach(c => {
        if (!c.id) { c.id = gerarId(); precisaResalvar = true; }
    });
    lixeiraStorage.forEach(c => {
        if (!c.id) { c.id = gerarId(); precisaResalvar = true; }
    });
    if (precisaResalvar) {
        salvarClientes();
        salvarLixeira();
    }

    clienteStorage.forEach(c => renderizarCliente(c));
    assigneCheck();
}