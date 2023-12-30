const editarUsuario = async (req, res) => {
	const { id } = req.usuario;
	const { nome, email, senha } = req.body;
  
	try {
	  if (email !== req.usuario.email) {
		// Remova ou corrija a linha abaixo, pois não parece necessária
		// const usuario = usuario;
  
		const senhaCriptografada = await bcrypt.hash(senha, 10);
  
		const updatedUsuario = await knex('usuarios')
		  .where({ id })
		  .update({ nome, email, senha: senhaCriptografada })
		  .returning(['nome', 'email']); // Retorne os campos desejados
  
		if (updatedUsuario.length > 0) {
		  return res.status(200).json(updatedUsuario[0]);
		} else {
		  return res.status(404).json({ message: "Usuário não encontrado ou atualização falhou" });
		}
	  }
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ mensagem: "Erro interno do servidor" });
	}
  };
  