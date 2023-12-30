const knex = require('knex');

const cadastrarProduto = async (req, res) => {
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { originalname, mimetype, buffer } = req.file;

  if (!descricao || !quantidade_estoque || !valor || !categoria_id || !originalname || !mimetype || !buffer) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  if (isNaN(valor) || isNaN(quantidade_estoque) || isNaN(categoria_id)) {
    return res.status(400).json({ mensagem: 'Os campos quantidade_estoque, valor e categoria_id devem ser numéricos.' });
  }

  try {
    
    const categoriaSelecionada = await knex("categorias").where({ id: categoria_id }).first();

    if (!categoriaSelecionada) {
      return res.status(400).json({ mensagem: "Informe uma categoria válida" });
    }

    let produto = await knex('produtos')
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id
      }).returning('*');

    if (!produto || !produto[0]) {
      return res.status(400).json({ mensagem: 'O produto não foi cadastrado' });
    }

    const id = produto[0].id;

    if (req.file) {
      const imagem = await uploadImagem(`produtos/${id}/${originalname}`, buffer, mimetype);
      produto = await knex('produtos')
        .update({
          produto_imagem: imagem.url
        })
        .where({ id })
        .returning(['descricao', 'quantidade_estoque', 'valor', 'categoria_id', 'produto_imagem']);
    }

    return res.status(200).json(produto[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: error.message });
  }
};


const listarProdutos = async (req, res) => {
	try {
		const produtos = await knex('produtos').select('*');
		return res.status(200).json(produtos);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensagem: "Erro interno do servidor" });
	}
};

const detalharProduto = async (req, res) => {
	const { id } = req.params;

	try {
		const produto = await knex('produtos').where({ id }).first();

		if (!produto) {
			return res.status(404).json({ mensagem: "Produto não encontrado" });
		}

		return res.status(200).json(produto);
	} catch (error) {
		console.error(error);
		res.status(500).json({ mensagem: "Erro interno do servidor" });
	}
};

const excluirProduto = async (req, res) => {
    const { id } = req.params;
  
    try {
      const pedidoEncontrado = await knex("pedido_produtos").where("produto_id", "=", id)
  
      if (pedidoEncontrado.length > 0) {
        return res.status(404).json({ mensagem: 'Produto não pode ser excluido' })
      }
      const produtoEncontrado = await knex('produtos').where({ id }).first();
  
      if (!produtoEncontrado) {
        return res.status(404).json('Produto não encontrado');
      }
  
      if (produtoEncontrado.produto_imagem !== null) {
        await excluirImagem(produtoEncontrado.produto_imagem)
      };
  
      const produto = await knex("produtos").where({ id }).del();
  
      if (!produto) {
        return res.status(400).json('A exclusão do produto não foi efetivada');
      }
  
      return res.status(204).send()
    } catch (error) {
      return res.status(500).json({ mensagem: 'Erro interno do servidor' })
    }
  };


module.exports = {
  cadastrarProduto,
  listarProdutos,
  detalharProduto,
  excluirProduto
};
