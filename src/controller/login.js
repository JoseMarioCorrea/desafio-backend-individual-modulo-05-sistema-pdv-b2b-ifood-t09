const jwt = require('jsonwebtoken');
const db = require('../database');
const { verificarSenha } = require('../senhaUtils');

const senhaHash = process.env.SENHA_JWT;

const fazerLogin = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const stmt = db.prepare('SELECT * FROM usuarios WHERE email = ?');
    stmt.get(email, async (err, usuario) => {
      if (err) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
      }

      if (!usuario) {
        return res.status(404).json({ mensagem: 'Email ou senha inválido' });
      }

      const senhaValida = await verificarSenha(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ mensagem: 'Email ou senha inválido' });
      }

      const token = jwt.sign({ id: usuario.id }, senhaHash, { expiresIn: '30d' });
      const { senha: _, ...usuarioLogado } = usuario;

      res.json({ usuario: usuarioLogado, token });
    });
    stmt.finalize();
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }
};

module.exports = {
  fazerLogin,
};
