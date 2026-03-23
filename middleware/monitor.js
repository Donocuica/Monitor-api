const db = require("../db/database");

let metrics = {
  total: 0,
  exitos: 0,
  errores: 0
};

const monitor = (req, res, next) => {
  const start = Date.now();
  metrics.total++;

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (res.statusCode >= 200 && res.statusCode < 300) {
      metrics.exitos++;
    } else {
      metrics.errores++;
    }

    db.run(
      `INSERT INTO logs (ip, metodo, ruta, status, tiempo)
       VALUES (?, ?, ?, ?, ?)`,
      [req.ip, req.method, req.originalUrl, res.statusCode, duration]
    );
  });

  next();
};

module.exports = { monitor, metrics };