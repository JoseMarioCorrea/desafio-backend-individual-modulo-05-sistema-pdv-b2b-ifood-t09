const express = require('express');
const routes = require('./rotas');
const knex = require('knex');

// Configurar a conexão com o SQLite
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './mydatabase.sqlite' // Nome do arquivo do banco de dados SQLite
  },
  useNullAsDefault: true // Necessário para o SQLite
});

// Adicionar a instância do Knex ao objeto de solicitação para que você possa usá-lo em suas rotas
app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use(express.json());
app.use(routes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});
