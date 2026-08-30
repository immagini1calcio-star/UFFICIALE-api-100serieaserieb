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
      `/summary?event=${encodeURIComponent(id)}`
    );

    const evento = data.header?.competitions?.[0];

    if (!evento) {
      return res.status(404).json({
        success: false,
        errore: "Partita non trovata"
      });
    }

    const squadre = evento.competitors || [];

    const casa = squadre.find(
      (squadra) => squadra.homeAway === "home"
    );

    const trasferta = squadre.find(
      (squadra) => squadra.homeAway === "away"
    );

    const stato = evento.status || data.header?.status;

    const partita = {
      id: data.header?.id || id,

      data: evento.date || data.header?.competitions?.[0]?.date || null,

      competizione: {
        id: data.header?.season?.slug || null,
        nome: evento.name || null
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
        evento.venue?.fullName ||
        data.header?.competitions?.[0]?.venue?.fullName ||
        null,

      nome: data.header?.competitions?.[0]?.competitors
        ? `${trasferta?.team?.displayName || ""} at ${casa?.team?.displayName || ""}`
        : null,

      link: {
        partita:
          data.meta?.links?.find((link) =>
            link.rel?.includes("summary")
          )?.href ||
          data.header?.links?.find((link) =>
            link.rel?.includes("summary")
          )?.href ||
          null,

        statistiche:
          data.meta?.links?.find((link) =>
            link.rel?.includes("stats")
          )?.href ||
          `https://www.espn.com/soccer/matchstats/_/gameId/${id}`
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
