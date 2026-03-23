const enviarProveedor = async (data) => {
  console.log("📡 Enviando a proveedor...");

  return {
    estado: "OK",
    mensaje: "Proveedor recibió datos"
  };
};

module.exports = { enviarProveedor };