const knex = require('knex');

const cadastrarPedido = async (req, res) => {
  const { data, pedido_produtos } = req.body;

  const dataPedido = data || new Date().toISOString().split('T')[0];

  if (!pedido_produtos || pedido_produtos.length === 0) {
    return res.status(400).json({ mensagem: 'O pedido deve conter ao menos um produto vinculado.' });
  }

  try {
    let valorTotal = 0;

    for (const itemPedido of pedido_produtos) {
      const { produto_id, quantidade_produto } = itemPedido;
      const produto = await knex('produtos').where({ id: produto_id }).first();

      if (!produto) {
        return res.status(400).json({ mensagem: `Produto com ID ${produto_id} não encontrado.` });
      }

      if (quantidade_produto <= 0) {
        return res.status(400).json({ mensagem: 'A quantidade do produto deve ser um número positivo.' });
      }

      valorTotal += produto.preco * quantidade_produto;
    }

    const [idPedido] = await knex('pedidos')
      .insert({
        data: dataPedido,
        valor_total: valorTotal,
      })
      .returning('id');

    for (const itemPedido of pedido_produtos) {
      const { produto_id, quantidade_produto } = itemPedido;

      await knex('pedido_produtos').insert({
        quantidade_produto,
        produto_id,
        pedido_id: idPedido,
      });
    }

    return res.status(201).json({ mensagem: 'Pedido cadastrado com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

module.exports = {
  cadastrarPedido,
};
