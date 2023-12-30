const jwt = require('jsonwebtoken');
const knex = require('knex');

console.log("Senha Hash (antes):", process.env.SENHA_JWT);
const senhaHash = process.env.SENHA_JWT;
console.log("Senha Hash (depois):", senhaHash);
const tokenFixo = process.env.TOKEN_FIXO;

const validarToken = async (req, res, next) => {
    const { authorization, params } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }

    const token = authorization;
    const hash = params;

    try {
        console.log("Token:", token);
        console.log("Senha Hash:", hash);

        if (token === tokenFixo) {
            // Se o token fornecido for igual ao token fixo, permite o acesso
            return next();
        }

        const { id } = jwt.verify(token, hash);

        const verificarUsuario = await knex('usuarios').where({ id }).first();
        console.log("verificarUsuario", verificarUsuario);

        if (!verificarUsuario) {
            return res.status(401).json({ message: "Não autorizado" });
        }

        const { senha, ...usuario } = verificarUsuario;

        req.usuario = usuario;

        next();

    } catch (error) {
        console.error("Erro na validação do token:", error); // Adicione esta linha
        return res.status(500).json(error.message);
    }
};

// ...


module.exports = validarToken;
