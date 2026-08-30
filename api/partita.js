const { espnFetch } = require("../lib/espn");

module.exports = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        errore: "Parametro id obbligatorio"
      });
    }

    const data = await espnFetch(
      `/ita.1/summary?event=${encodeURIComponent(id)}`
    );

    const header = data.header;
    const competizione = header?.competitions?.[0];

    if (!header || !competizione) {
      return res.status(404).json({
        success: false,
        errore: "Partita non trovata"
      });
    }

    const squadre = competizione.competitors || [];

    const casa = squadre.find(
      (squadra) => squadra.homeAway === "home"
    );

    const trasferta = squadre.find(
      (squadra) => squadra.homeAway === "away"
    );

    const stato = competizione.status || header.status;

    const partita = {
      id: header.id || id,

      data: competizione.date || null,

      competizione: {
        id: "ita.1",
        nome: "Serie A"
      },

      stato: {
        nome: stato?.type?.name || null,
        descrizione: stato?.type?.description || null,
        stato: stato?.type?.state || null,
        completata: stato?.type?.completed || false,
        minuto: stato?.displayClock || null
      },

      casa: {
        id: casa?.team?.id || null,
        nome: casa?.team?.displayName || null,
        abbreviazione: casa?.team?.abbreviation || null,
        logo: casa?.team?.logo || null,
        gol: Number(casa?.score || 0)
      },

      trasferta: {
        id: trasferta?.team?.id || null,
        nome: trasferta?.team?.displayName || null,
        abbreviazione: trasferta?.team?.abbreviation || null,
        logo: trasferta?.team?.logo || null,
        gol: Number(trasferta?.score || 0)
      },

      stadio:
        data.gameInfo?.venue?.fullName ||
        competizione.venue?.fullName ||
        null,

      nome: header.competitions?.[0]?.competitors
        ? `${trasferta?.team?.displayName || ""} at ${casa?.team?.displayName || ""}`
        : null,

      link: {
        partita: `https://www.espn.com/soccer/match/_/gameId/${id}`,
        statistiche: `https://www.espn.com/soccer/matchstats/_/gameId/${id}`
      }
    };

    return res.status(200).json({
      success: true,
      partita
    });

  } catch (errore) {
    return res.status(500).json({
      success: false,
      errore: errore.message
    });
  }
};
