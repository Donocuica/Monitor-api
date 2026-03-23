const enviarSAP = async (data) => {
  console.log("📦 Enviando a SAP...");

  return {
    estado: "OK",
    mensaje: "Datos enviados a SAP"
  };
};

module.exports = { enviarSAP };