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

    const [idProduto] = await knex('produtos')
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id
      })
      .returning('id');

    let produto = {
      id: idProduto,
      descricao,
      quantidade_estoque,
      valor,
      categoria_id,
    };

    if (req.file) {
      const imagem = await uploadImagem(`produtos/${idProduto}/${originalname}`, buffer, mimetype);
      produto.produto_imagem = imagem.url;

      await knex('produtos')
        .update({
          produto_imagem: imagem.url
        })
        .where({ id: idProduto });
    }

    return res.status(200).json(produto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrarProduto,
};
