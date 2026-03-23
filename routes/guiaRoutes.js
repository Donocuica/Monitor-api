const express = require("express");
const router = express.Router();

const { guardarArchivo, moverAProcesado } = require("../services/fileService");
const { enviarProveedor } = require("../services/providerService");
const { enviarSAP } = require("../services/sapService");

router.post("/guia", async (req, res) => {
  try {
    const data = req.body;

    const contenido = JSON.stringify(data);
    const nombre = `guia_${Date.now()}.txt`;

    const filePath = guardarArchivo(nombre, contenido);

    const proveedor = await enviarProveedor(data);
    const sap = await enviarSAP(proveedor);

    moverAProcesado(filePath);

    res.json({
      mensaje: "Proceso completo",
      proveedor,
      sap
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;