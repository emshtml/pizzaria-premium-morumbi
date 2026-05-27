// "Banco de dados" dos produtos
const produtos = [
    { id: 1, nome: "Margherita Premium", descricao: "Molho de tomate artesanal, mozzarella búfala, manjericão fresco e azeite trufado.", preco: 45.90, imagem: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=500" },
    { id: 2, nome: "Pepperoni Especial", descricao: "Molho rústico, mozzarella, fatias de pepperoni premium e um toque de geleia de pimenta.", preco: 49.90, imagem: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500" },
    { id: 3, nome: "Quatro Queijos di Parma", descricao: "Gorgonzola Dolce, provolone defumado, mozzarella, parmesão e finalizado com chips de Parma.", preco: 54.90, imagem: "https://images.unsplash.com/photo-1573821663912-569905455b1c?q=80&w=500" },
    { id: 4, nome: "Frango com Catupiry Original", descricao: "Peito de frango desfiado artesanal, tempero da casa e o legítimo Catupiry.", preco: 44.90, imagem: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500" },
    { id: 5, nome: "Coca-Cola Lata", descricao: "350ml trincando de gelada.", preco: 6.00, imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500" }
];

let carrinho = [];

// Seleção de elementos do DOM
const cardapioContainer = document.getElementById("cardapio");
const modalCarrinho = document.getElementById("modal-carrinho");
const btnVerCarrinho = document.getElementById("btn-ver-carrinho");
const btnFecharModal = document.getElementById("btn-fechar-modal");
const itensCarrinhoContainer = document.getElementById("itens-carrinho");
const totalBarra = document.getElementById("total-barra");
const totalModal = document.getElementById("total-modal");
const contadorCarrinho = document.getElementById("contador-carrinho");
const inputEndereco = document.getElementById("input-endereco");
const avisoEndereco = document.getElementById("aviso-endereco");
const btnFinalizarPedido = document.getElementById("btn-finalizar-pedido");

// 1. Renderizar o Cardápio na tela
function renderizarCardapio() {
    cardapioContainer.innerHTML = "";
    produtos.forEach(produto => {
        const div = document.createElement("div");
        div.className = "bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col";
        div.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="w-full h-48 object-cover">
            <div class="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <h3 class="font-bold text-lg text-gray-900 mb-1">${produto.nome}</h3>
                    <p class="text-gray-500 text-xs leading-relaxed mb-4">${produto.descricao}</p>
                </div>
                <div class="flex items-center justify-between mt-auto">
                    <span class="font-bold text-xl text-red-600">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                    <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow transition-all active:scale-95 btn-add" data-id="${produto.id}">
                        <i class="fa-solid fa-plus mr-1"></i> Adicionar
                    </button>
                </div>
            </div>
        `;
        cardapioContainer.appendChild(div);
    });
}

// 2. Gerenciar cliques de adição ao carrinho
cardapioContainer.addEventListener("click", (e) => {
    const botao = e.target.closest(".btn-add");
    if (botao) {
        const id = parseInt(botao.getAttribute("data-id"));
        adicionarAoCarrinho(id);
    }
});

function adicionarAoCarrinho(id) {
    const produto = produtos.find(p => p.id === id);
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    atualizarInterface();
}

// 3. Atualizar totais e contadores da página
function atualizarInterface() {
    let total = 0;
    let totalItens = 0;

    carrinho.forEach(item => {
        total += item.preco * item.quantidade;
        totalItens += item.quantidade;
    });

    const totalFormatado = `R$ ${total.toFixed(2).replace('.', ',')}`;
    totalBarra.textContent = totalFormatado;
    totalModal.textContent = totalFormatado;
    contadorCarrinho.textContent = totalItens;
}

// 4. Modal abrir/fechar
btnVerCarrinho.addEventListener("click", () => {
    renderizarCarrinhoModal();
    modalCarrinho.classList.remove("hidden");
});

btnFecharModal.addEventListener("click", () => {
    modalCarrinho.classList.add("hidden");
});

modalCarrinho.addEventListener("click", (e) => {
    if (e.target === modalCarrinho) modalCarrinho.classList.add("hidden");
});

// 5. Renderizar lista dentro do modal do carrinho
function renderizarCarrinhoModal() {
    itensCarrinhoContainer.innerHTML = "";
    
    if (carrinho.length === 0) {
        itensCarrinhoContainer.innerHTML = `<p class="text-gray-500 text-center py-4">Seu carrinho está vazio.</p>`;
        return;
    }

    carrinho.forEach(item => {
        const div = document.createElement("div");
        div.className = "flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100";
        div.innerHTML = `
            <div class="flex-1">
                <h4 class="font-bold text-gray-900 text-sm">${item.nome}</h4>
                <span class="text-xs text-gray-500">R$ ${item.preco.toFixed(2).replace('.', ',')} un.</span>
            </div>
            <div class="flex items-center gap-3">
                <button class="text-red-500 hover:text-red-700 px-1 font-bold btn-diminuir" data-id="${item.id}">-</button>
                <span class="font-semibold text-sm bg-white border px-2 py-0.5 rounded-md">${item.quantidade}</span>
                <button class="text-green-500 hover:text-green-700 px-1 font-bold btn-aumentar" data-id="${item.id}">+</button>
            </div>
        `;
        itensCarrinhoContainer.appendChild(div);
    });
}

// 6. Alterar quantidade dentro do modal
itensCarrinhoContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-aumentar")) {
        const id = parseInt(e.target.getAttribute("data-id"));
        const item = carrinho.find(i => i.id === id);
        item.quantidade++;
        atualizarInterface();
        renderizarCarrinhoModal();
    }
    if (e.target.classList.contains("btn-diminuir")) {
        const id = parseInt(e.target.getAttribute("data-id"));
        const idx = carrinho.findIndex(i => i.id === id);
        if (carrinho[idx].quantidade > 1) {
            carrinho[idx].quantidade--;
        } else {
            carrinho.splice(idx, 1);
        }
        atualizarInterface();
        renderizarCarrinhoModal();
    }
});

// 7. Envio para o WhatsApp
btnFinalizarPedido.addEventListener("click", () => {
    if (carrinho.length === 0) return alert("Seu carrinho está vazio!");
    
    if (inputEndereco.value.trim() === "") {
        avisoEndereco.classList.remove("hidden");
        inputEndereco.classList.add("border-red-500");
        return;
    }
    
    avisoEndereco.classList.add("hidden");
    inputEndereco.classList.remove("border-red-500");

    // Montando o texto do pedido
    let msg = `*--- NOVO PEDIDO ---*\n\n`;
    carrinho.forEach(item => {
        msg += `• *${item.quantidade}x* ${item.nome} (R$ ${(item.preco * item.quantidade).toFixed(2)})\n`;
    });
    
    let total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    msg += `\n*Total:* R$ ${total.toFixed(2)}`;
    msg += `\n\n*Endereço de Entrega:* ${inputEndereco.value}`;

    // Número fictício - Substitua pelo seu celular de atendimento (ex: 5511999999999)
    const telefone = "5511976794749"; 
    const url = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(msg)}`;
    
    // Limpa carrinho e redireciona
    carrinho = [];
    atualizarInterface();
    inputEndereco.value = "";
    modalCarrinho.classList.add("hidden");
    
    window.open(url, "_blank");
});

// Inicialização
renderizarCardapio();
