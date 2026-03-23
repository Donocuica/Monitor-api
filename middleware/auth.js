const API_KEY = "123456";

const auth = (req, res, next) => {
  const key = req.headers["x-api-key"];

  if (!key || key !== API_KEY) {
    return res.status(401).json({ error: "No autorizado" });
  }

  next();
};

module.exports = auth;