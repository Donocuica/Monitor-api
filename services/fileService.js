const fs = require("fs");
const path = require("path");

const TMP = path.join(__dirname, "../storage/tmp");
const PROCESADO = path.join(__dirname, "../storage/procesado");

const guardarArchivo = (nombre, contenido) => {
  const filePath = path.join(TMP, nombre);
  fs.writeFileSync(filePath, contenido);
  return filePath;
};

const moverAProcesado = (filePath) => {
  const fileName = path.basename(filePath);
  const newPath = path.join(PROCESADO, fileName);
  fs.renameSync(filePath, newPath);
};

module.exports = { guardarArchivo, moverAProcesado };