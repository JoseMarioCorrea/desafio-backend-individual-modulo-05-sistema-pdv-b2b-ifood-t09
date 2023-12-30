const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:'); // Use ':memory:' para um banco de dados temporário na memória ou substitua por um caminho de arquivo para persistência

// Crie tabelas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      email TEXT UNIQUE,
      senha TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      descricao TEXT,
      preco REAL,
      imagem TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      produto_id INTEGER,
      quantidade INTEGER,
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
      FOREIGN KEY (produto_id) REFERENCES produtos (id)
    )
  `);
});

module.exports = db;
