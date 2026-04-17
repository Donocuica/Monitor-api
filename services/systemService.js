const os = require("os");
const fs = require("fs");
const path = require("path");

const TMP = path.join(__dirname, "../storage/tmp");
const VPS_IP = "172.235.38.212";
const getCPU = () => {
  return (Math.random() * 100).toFixed(2);
};


const getMem = () => {
  const total = Math.round(os.totalmem() / 1024 / 1024);
  const usada = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
  return `${usada}/${total}MB`;
};

const generarLinea = () => {
  const fecha = new Date().toISOString().replace("T", " ").substring(0, 19);

  return `${fecha} | CPU:${getCPU()}% | MEM:${getMem()} | APACHE_CPU:${Math.random().toFixed(1)}% | APACHE_MEM:${(Math.random()*200).toFixed(2)}MB | MYSQL_CPU:${(Math.random()*200).toFixed(0)}% | MYSQL_MEM:${(Math.random()*3000).toFixed(2)}MB`;
};

const generarArchivo = () => {
  if (!fs.existsSync(TMP)) fs.mkdirSync(TMP, { recursive: true });

  const fecha = new Date().toISOString().split("T")[0];
  const hora = new Date().toTimeString().split(" ")[0].replace(/:/g, "-");

  const fileName = `monitor_${fecha}_${hora}_${VPS_IP}.txt`;
  const filePath = path.join(TMP, fileName);

  fs.appendFileSync(filePath, generarLinea() + "\n");

  console.log("📄 Generado:", fileName);
};

module.exports = { generarArchivo };