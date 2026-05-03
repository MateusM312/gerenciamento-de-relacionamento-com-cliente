let assigned = -1;
let elements = [];

function openForms() {
    const getForm = document.getElementById('form');
    if (getForm.style.display === 'flex') {
        getForm.style.display = 'none';
    } else {
        getForm.style.display = 'flex';
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

let clienteStorage = JSON.parse(localStorage.getItem('clienteStorage')) || [];

function salvarClientes() {
    localStorage.setItem('clienteStorage', JSON.stringify(clienteStorage));
}

function criarCliente() {
    const nome = document.getElementById('contatoAdd').value || "!nome...";
    const empresa = document.getElementById('empresaAdd').value || "!empresa...";
    const departamento = document.getElementById('departamentoAdd').value || "!departamento...";
    const adicional = document.getElementById('informacoesAdd').value || "!informação...";
    const statusClasses = ['status-ball', 'status-ball-ausente', 'status-ball-inativo'];
    const statusClass = assigned !== -1 ? statusClasses[assigned] : 'status-ball';
    const cores = ['#D1E0FF', '#FFD1D1', '#D1FFD6', '#FFE8D1', '#E8D1FF', '#D1F5FF', '#FFD1F0'];
    const corPerfil = cores[Math.floor(Math.random() * cores.length)];

    const novoCliente = { nome, empresa, departamento, adicional, statusClass, corPerfil };
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

function deletar(botao) {
    const cliente = botao.closest('.cliente');
    const nome = cliente.querySelector('.dado-item').textContent; // era .dados, agora é .dado-item
    clienteStorage = clienteStorage.filter(c => c.nome !== nome);
    salvarClientes();
    cliente.remove();
}

window.onload = function() {
    clienteStorage.forEach(c => renderizarCliente(c));
    assigneCheck();
}