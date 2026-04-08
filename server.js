const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const { monitor } = require("./middleware/monitor");
const auth = require("./middleware/auth");
const guiaRoutes = require("./routes/guiaRoutes");
const { generarArchivo } = require("./services/systemService");

const app = express();

// ======================
// MIDDLEWARES
// ======================
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(monitor);

// ======================
// RUTA SEGURA
// ======================
app.get("/api/data", auth, (req, res) => {
  res.json({ mensaje: "OK seguro" });
});

// ======================
// ERROR SIMULADO
// ======================
app.get("/api/error", (req, res) => {
  res.status(500).json({ error: "Error interno" });
});

// ======================
// RUTAS API
// ======================
app.use("/api", guiaRoutes);

// ======================
// LISTAR ARCHIVOS
// ======================
app.get("/archivos", (req, res) => {
  const dir = path.join(__dirname, "storage/tmp");

  if (!fs.existsSync(dir)) {
    return res.json([]);
  }

  const files = fs.readdirSync(dir);
  res.json(files);
});

// ======================
// FRONTEND STATIC
// ======================
app.use(express.static("public"));

// ======================
// INICIAR SERVIDOR
// ======================
app.listen(3000, () => {
  console.log("🔥 Servidor en http://localhost:3000");
  console.log("🚀 Monitor iniciado...");

  // ======================
  // PROCESO AUTOMÁTICO
  // ======================

  if (typeof generarArchivo === "function") {
    // ejecutar una vez al iniciar
    generarArchivo();

    // cada 3 minutos
    setInterval(() => {
      generarArchivo();
    }, 180000);

  } else {
    console.log("⚠️ generarArchivo no está definido");
  }
});