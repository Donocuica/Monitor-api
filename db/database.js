const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT,
      metodo TEXT,
      ruta TEXT,
      status INTEGER,
      tiempo INTEGER,
      fecha DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;