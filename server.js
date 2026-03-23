const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { monitor, metrics } = require("./middleware/monitor");
const auth = require("./middleware/auth");
const db = require("./db/database");
const guiaRoutes = require("./routes/guiaRoutes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(monitor);

// ruta segura
app.get("/api/data", auth, (req, res) => {
  res.json({ mensaje: "OK seguro" });
});

// error
app.get("/api/error", (req, res) => {
  res.status(500).json({ error: "Error interno" });
});

// rutas empresariales
app.use("/api", guiaRoutes);

// dashboard data
app.get("/dashboard-data", (req, res) => {
  db.all(`SELECT * FROM logs ORDER BY id DESC LIMIT 20`, [], (err, rows) => {
    res.json({
      total: metrics.total,
      exitos: metrics.exitos,
      errores: metrics.errores,
      logs: rows
    });
  });
});

// frontend
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("🔥 Servidor en http://localhost:3000");
});