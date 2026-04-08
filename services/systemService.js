const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

// ==============================
// GENERAR ARCHIVO LOG
// ==============================
function generarArchivo() {
  const dir = path.join(__dirname, "../storage/procesado");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const date = new Date().toISOString().split("T")[0];
  const id = process.env.VPS_ID || getIP();

  const fileName = `monitor_${date}_${id}.txt`;
  const filePath = path.join(dir, fileName);

  const line = getMetricsLine();

  fs.appendFileSync(filePath, line + "\n");

  console.log("📊 Log real generado:", fileName);
}

// ==============================
// IP VPS
// ==============================
function getIP() {
  const nets = os.networkInterfaces();

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "unknown";
}

// ==============================
// CPU REAL
// ==============================
function getCPU() {
  try {
    const output = execSync("top -bn1 | grep 'Cpu(s)'").toString();

    const match = output.match(/(\d+\.\d+)\s*id/);

    const idle = match ? parseFloat(match[1]) : 0;

    const usage = (100 - idle).toFixed(1);

    return usage;
  } catch (err) {
    return "0";
  }
}

// ==============================
// RAM REAL
// ==============================
function getRAM() {
  try {
    const output = execSync("free -m").toString();
    const lines = output.split("\n")[1].split(/\s+/);

    const total = lines[1];
    const used = lines[2];

    return { used, total };
  } catch (err) {
    return { used: 0, total: 0 };
  }
}

// ==============================
// APACHE CPU (REAL)
// ==============================
function getApacheCPU() {
  try {
    const output = execSync("ps -C apache2 -o %cpu --no-headers").toString();

    const lines = output.trim().split("\n");

    let total = 0;

    lines.forEach(l => {
      total += parseFloat(l) || 0;
    });

    return total.toFixed(1);
  } catch {
    return "0";
  }
}

// ==============================
// MYSQL CPU (REAL)
// ==============================
function getMySQLCPU() {
  try {
    const output = execSync("ps -C mysqld -o %cpu --no-headers").toString();

    const lines = output.trim().split("\n");

    let total = 0;

    lines.forEach(l => {
      total += parseFloat(l) || 0;
    });

    return total.toFixed(1);
  } catch {
    return "0";
  }
}

// ==============================
// FORMATO FINAL
// ==============================
function getMetricsLine() {
  const cpu = getCPU();
  const ram = getRAM();
  const apache = getApacheCPU();
  const mysql = getMySQLCPU();

  const now = new Date().toISOString().replace("T", " ").substring(0, 19);

  return `${now} | CPU:${cpu}% | MEM:${ram.used}/${ram.total}MB | APACHE_CPU:${apache}% | MYSQL_CPU:${mysql}%`;
}

module.exports = { generarArchivo };