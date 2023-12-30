const jwt = require('jsonwebtoken');
const knex = require('knex');
const senhaHash = process.env.SENHA_JWT;

const fazerLogin = async (req, res) => {
	const { email, senha } = req.body

	try {
		const usuario = await knex('usuario').where({email}).first()

		if (!usuario) {
			return res.status(404).json({ messagem: "email ou senha inválido" })
		}

		await verificarSenha(senha, usuario)


		const token = jwt.sign({ id: usuario.id }, senhaHash, { expiresIn: '30d' })
		const { senha: _, ...usuarioLogado } = usuario


		return res.json({ usuario: usuarioLogado, token })

	} catch (error) {
		res.status(500).json({ mensagem: "Erro interno do servidor" })
	}
}

module.exports = {
    fazerLogin
}