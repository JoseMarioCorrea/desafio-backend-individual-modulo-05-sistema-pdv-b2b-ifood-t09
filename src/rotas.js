const express = require('express');
const multer = require('./middleware/multer');
const { cadastrarUsuario, detalharUsuario, editarUsuario } = require('./controller/usuario');
const validarToken = require('./middleware/middleware');
const { cadastrarPedido, listarPedidos } = require('./controller/pedidos');
const { fazerLogin } = require('./controller/login');
const { cadastrarProduto, listarProdutos, detalharProduto, excluirProduto } = require('./controller/produtos');

const routes = express()

routes.post('/login', fazerLogin);
routes.post('/usuario', cadastrarUsuario);

routes.use(validarToken);

routes.get('/usuario', detalharUsuario);
routes.put('/usuario', editarUsuario);

routes.post('/produtos', multer.single('produto_imagem'), cadastrarProduto);
routes.get('/produtos', listarProdutos);
routes.get('/produtos/:id', detalharProduto);
routes.delete('/produtos/:id', excluirProduto);

routes.post('/pedidos', cadastrarPedido);
routes.get('/pedidos', listarPedidos);

module.exports = routes
