const knex = require('knex');

const cadastrarPedido = async (req, res) => {
  const { data, pedido_produtos } = req.body;

  const dataPedido = data || new Date().toISOString().split('T')[0];

  if (!pedido_produtos || pedido_produtos.length === 0) {
    return res.status(400).json({ mensagem: 'O pedido deve conter ao menos um produto vinculado.' });
  }

  try {
 
    for (const itemPedido of pedido_produtos) {
      const { produto_id, quantidade_produto } = itemPedido;
      const produto = await knex('produtos').where({ id: produto_id }).first();

      if (!produto) {
        return res.status(400).json({ mensagem: `Produto com ID ${produto_id} não encontrado.` });
      }
    }

    const [idPedido] = await knex('pedidos')
      .insert({
        data: dataPedido,
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


const listarPedidos = async (req, res) => {
    const { a_partir } = req.query;
  
    try {
      let pedidos;
  
      if (a_partir) {
        pedidos = await knex('pedidos')
          .where('data', '>=', a_partir)
          .select('id', 'valor_total', 'data');
      } else {

        pedidos = await knex('pedidos').select('id', 'valor_total', 'data');
      }
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
  };
  

module.exports = {
  cadastrarPedido,
  listarPedidos
};
