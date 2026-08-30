module.exports = function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: "100%SerieA&SerieB API",
    version: "V1",
    message: "API funzionante"
  });
};
