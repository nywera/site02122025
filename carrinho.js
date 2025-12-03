// Sistema de Carrinho de Compras
class Carrinho {
  constructor() {
    this.itens = this.carregarCarrinho();
    this.atualizarContador();
  }

  // Dados dos produtos
  produtos = {
    'bolo-classico': {
      id: 'bolo-classico',
      nome: 'Bolo Clássico',
      preco: 70,
      imagem: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      sabores: 'Chocolate, Baunilha, Cenoura'
    },
    'bolo-recheado': {
      id: 'bolo-recheado',
      nome: 'Bolo Recheado',
      preco: 90,
      imagem: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
      sabores: 'Brigadeiro, Doce de Leite, Ninho com Morango'
    },
    'bolo-gelado': {
      id: 'bolo-gelado',
      nome: 'Bolo Gelado',
      preco: 85,
      imagem: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop',
      sabores: 'Coco, Abacaxi, Limão'
    },
    'bolo-personalizado': {
      id: 'bolo-personalizado',
      nome: 'Bolo Decorado Personalizado',
      preco: 120,
      imagem: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=300&fit=crop',
      sabores: 'Tema infantil, casamento, aniversário'
    },
    'bolo-fit': {
      id: 'bolo-fit',
      nome: 'Bolo Fit/Integral',
      preco: 95,
      imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop',
      sabores: 'Banana com Aveia, Cacau 70%'
    }
  };

  carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
  }

  salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(this.itens));
    this.atualizarContador();
  }

  adicionarItem(produtoId, quantidade = 1, observacoes = '', sabor = '') {
    const produto = this.produtos[produtoId];
    if (!produto) return false;

    const itemExistente = this.itens.find(item => 
      item.id === produtoId && item.sabor === sabor && item.observacoes === observacoes
    );

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      this.itens.push({
        id: produtoId,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem,
        quantidade: quantidade,
        sabor: sabor,
        observacoes: observacoes,
        sabores: produto.sabores
      });
    }

    this.salvarCarrinho();
    this.mostrarNotificacao(`${produto.nome} adicionado ao carrinho!`);
    return true;
  }

  removerItem(index) {
    this.itens.splice(index, 1);
    this.salvarCarrinho();
    if (typeof this.renderizarCarrinho === 'function') {
      this.renderizarCarrinho();
    }
  }

  atualizarQuantidade(index, novaQuantidade) {
    if (novaQuantidade <= 0) {
      this.removerItem(index);
      return;
    }
    this.itens[index].quantidade = novaQuantidade;
    this.salvarCarrinho();
    if (typeof this.renderizarCarrinho === 'function') {
      this.renderizarCarrinho();
    }
  }

  calcularTotal() {
    return this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  }

  limparCarrinho() {
    this.itens = [];
    this.salvarCarrinho();
    if (typeof this.renderizarCarrinho === 'function') {
      this.renderizarCarrinho();
    }
  }

  atualizarContador() {
    const contador = document.getElementById('carrinho-contador');
    if (contador) {
      const totalItens = this.itens.reduce((sum, item) => sum + item.quantidade, 0);
      contador.textContent = totalItens;
      if (totalItens > 0) {
        contador.classList.add('show');
      } else {
        contador.classList.remove('show');
      }
    }
  }

  mostrarNotificacao(mensagem) {
    // Criar notificação visual
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao';
    notificacao.textContent = mensagem;
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
      notificacao.classList.add('show');
    }, 10);

    setTimeout(() => {
      notificacao.classList.remove('show');
      setTimeout(() => notificacao.remove(), 300);
    }, 3000);
  }

  renderizarCarrinho() {
    const container = document.getElementById('carrinho-itens');
    const totalElement = document.getElementById('carrinho-total');
    
    if (!container) return;

    if (this.itens.length === 0) {
      container.innerHTML = `
        <div class="carrinho-vazio">
          <div class="carrinho-vazio-icon">🛒</div>
          <h3>Seu carrinho está vazio</h3>
          <p>Adicione bolos deliciosos ao seu carrinho!</p>
          <a href="catalogo.html" class="btn">Ver Catálogo</a>
        </div>
      `;
      if (totalElement) totalElement.textContent = 'R$ 0,00';
      return;
    }

    container.innerHTML = this.itens.map((item, index) => `
      <div class="carrinho-item">
        <div class="carrinho-item-imagem">
          <img src="${item.imagem}" alt="${item.nome}">
        </div>
        <div class="carrinho-item-info">
          <h3>${item.nome}</h3>
          ${item.sabor ? `<p class="carrinho-item-sabor"><strong>Sabor:</strong> ${item.sabor}</p>` : ''}
          ${item.observacoes ? `<p class="carrinho-item-obs"><strong>Observações:</strong> ${item.observacoes}</p>` : ''}
          <p class="carrinho-item-preco">R$ ${item.preco.toFixed(2)}/kg</p>
        </div>
        <div class="carrinho-item-controles">
          <div class="quantidade-controle">
            <button onclick="carrinho.atualizarQuantidade(${index}, ${item.quantidade - 1})" class="qty-btn">-</button>
            <input type="number" value="${item.quantidade}" min="1" 
                   onchange="carrinho.atualizarQuantidade(${index}, parseInt(this.value))">
            <button onclick="carrinho.atualizarQuantidade(${index}, ${item.quantidade + 1})" class="qty-btn">+</button>
          </div>
          <p class="carrinho-item-subtotal">R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
          <button onclick="carrinho.removerItem(${index})" class="btn-remover">🗑️ Remover</button>
        </div>
      </div>
    `).join('');

    const total = this.calcularTotal();
    if (totalElement) {
      totalElement.textContent = `R$ ${total.toFixed(2)}`;
    }
  }
}

// Inicializar carrinho global
const carrinho = new Carrinho();

// Event listeners para botões "Adicionar ao Carrinho"
document.addEventListener('DOMContentLoaded', function() {
  // Atualizar contador ao carregar página
  carrinho.atualizarContador();

  // Se estiver na página do carrinho, renderizar
  if (document.getElementById('carrinho-itens')) {
    carrinho.renderizarCarrinho();
  }

  // Adicionar listeners aos botões de adicionar ao carrinho
  document.querySelectorAll('[data-adicionar-carrinho]').forEach(btn => {
    btn.addEventListener('click', function() {
      const produtoId = this.getAttribute('data-produto-id');
      const modal = document.getElementById('modal-adicionar');
      
      if (modal) {
        // Preencher modal com dados do produto
        const produto = carrinho.produtos[produtoId];
        document.getElementById('modal-produto-nome').textContent = produto.nome;
        document.getElementById('modal-produto-preco').textContent = `R$ ${produto.preco.toFixed(2)}/kg`;
        document.getElementById('modal-produto-id').value = produtoId;
        document.getElementById('modal-quantidade').value = 1;
        document.getElementById('modal-sabor').value = '';
        document.getElementById('modal-observacoes').value = '';
        
        // Preencher opções de sabor
        const saborSelect = document.getElementById('modal-sabor');
        saborSelect.innerHTML = '<option value="">Selecione um sabor</option>';
        produto.sabores.split(', ').forEach(sabor => {
          const option = document.createElement('option');
          option.value = sabor.trim();
          option.textContent = sabor.trim();
          saborSelect.appendChild(option);
        });
        
        modal.style.display = 'flex';
      } else {
        // Se não houver modal, adicionar diretamente
        carrinho.adicionarItem(produtoId);
      }
    });
  });
});

// Função para fechar modal
function fecharModal() {
  const modal = document.getElementById('modal-adicionar');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Função para adicionar ao carrinho do modal
function adicionarAoCarrinhoModal() {
  const produtoId = document.getElementById('modal-produto-id').value;
  const quantidade = parseInt(document.getElementById('modal-quantidade').value) || 1;
  const sabor = document.getElementById('modal-sabor').value;
  const observacoes = document.getElementById('modal-observacoes').value;

  if (carrinho.adicionarItem(produtoId, quantidade, observacoes, sabor)) {
    fecharModal();
    // Redirecionar para carrinho se estiver na página do catálogo
    if (window.location.pathname.includes('catalogo.html')) {
      setTimeout(() => {
        window.location.href = 'carrinho.html';
      }, 500);
    }
  }
}

// Fechar modal ao clicar fora
window.addEventListener('click', function(event) {
  const modal = document.getElementById('modal-adicionar');
  if (event.target === modal) {
    fecharModal();
  }
});

