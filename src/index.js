const express = require('express');
const routes = require('./rotas');

const app = express();
app.use(express.json());
app.use(routes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});
