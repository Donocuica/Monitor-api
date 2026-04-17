const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const { monitor } = require("./middleware/monitor");
const guiaRoutes = require("./routes/guiaRoutes");
const { generarArchivo } = require("./services/systemService");

const app = express();

app.use(express.json());
app.use(cors());

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(morgan("dev"));
app.use(monitor);

app.get("/files", (req, res) => {
  const dir = path.join(__dirname, "storage/tmp");

  if (!fs.existsSync(dir)) return res.json([]);

  let files = fs.readdirSync(dir);

  files = files.sort((a, b) => {
    return fs.statSync(path.join(dir, b)).mtime -
           fs.statSync(path.join(dir, a)).mtime;
  });

  console.log("📂 Archivos enviados:", files);

  res.setHeader("Cache-Control", "no-store");
  res.json(files);
});

app.get("/view/:name", (req, res) => {
  const filePath = path.join(__dirname, "storage/tmp", req.params.name);

  if (!fs.existsSync(filePath)) {
    return res.send("Archivo no encontrado");
  }

  const content = fs.readFileSync(filePath, "utf-8");

  res.send(content); 
});


app.get("/download/:name", (req, res) => {
  const filePath = path.join(__dirname, "storage/tmp", req.params.name);

  if (!fs.existsSync(filePath)) {
    return res.send("Archivo no encontrado");
  }

  res.download(filePath);
});


app.use(express.static("public"));

app.listen(3000, "0.0.0.0", () => {
  console.log("🔥 Servidor activo");

  generarArchivo();

  setInterval(() => {
    generarArchivo();
  }, 180000);
});