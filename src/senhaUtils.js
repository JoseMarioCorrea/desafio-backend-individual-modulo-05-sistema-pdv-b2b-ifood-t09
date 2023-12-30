const bcrypt = require('bcryptjs');

const verificarSenha = async (senhaDigitada, senhaHash) => {
  try {
    const senhaCorreta = await bcrypt.compare(senhaDigitada, senhaHash);
    return senhaCorreta;
  } catch (error) {
    throw new Error('Erro ao verificar a senha');
  }
};

module.exports = {
  verificarSenha,
};
