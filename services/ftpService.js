const ftp = require("basic-ftp");

const subirFTP = async (localPath, fileName) => {
  const client = new ftp.Client();

  try {
    await client.access({
      host: "172.235.38.212",
      user: "root",
      password: "dddd",
      secure: false
    });

    await client.ensureDir("/home/monitor");

    await client.uploadFrom(localPath, fileName);

    console.log("📤 Subido al VPS:", fileName);

  } catch (error) {
    console.error("❌ Error FTP:", error.message);
  }

  client.close();
};

module.exports = { subirFTP };