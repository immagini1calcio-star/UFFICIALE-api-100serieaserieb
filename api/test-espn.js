const { espnFetch } = require("../lib/espn");

module.exports = async function handler(req, res) {
  try {
    const data = await espnFetch(
      "/ita.1/scoreboard"
    );

    res.status(200).json({
      ok: true,
      source: "ESPN",
      competition: "Serie A",
      events: data.events || []
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      source: "ESPN",
      error: error.message
    });

  }
};
