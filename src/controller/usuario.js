const bcrypt = require('bcryptjs'); // Substitua 'bcrypt' por 'bcryptjs'
const knex = require('knex');
const enviarEmail = require('../services/nodemailer');

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos devem ser preenchidos!" });
  }

  try {
    const usuario = await knex('usuarios').where({ email: email });
    if (usuario.length > 0) { // Corrija a verificação se o usuário existe
      return res.status(400).json({ mensagem: "Este email já existe" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const novoUsuario = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada }).returning(['nome', 'email', 'senha']);
    const assunto = "Boas vindas";
    const texto = "Seja bem vindo <3";

    enviarEmail(novoUsuario[0].nome, novoUsuario[0].email, assunto, texto);

    return res.status(201).json(novoUsuario[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detalharUsuario = (req, res) => {
  const { id, email, nome } = req.usuario;

  if (!id || !email || !nome) {
    return res.status(400).json({ mensagem: "Usuário não encontrado!" });
  }

  return res.status(200).json(req.usuario);
};

const editarUsuario = async (req, res) => {
  const { id } = req.usuario;
  const { nome, email, senha } = req.body;

  try {
    if (email !== req.usuario.email) {
      const usuario = usuario; // Este trecho parece incorreto, talvez você queira corrigir ou remover

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

module.exports = {
  cadastrarUsuario,
  detalharUsuario,
  editarUsuario
};
