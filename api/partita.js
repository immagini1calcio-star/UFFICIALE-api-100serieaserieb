const { espnFetch } = require("../lib/espn");

module.exports = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        errore: "Parametro id obbligatorio"
      });
    }

    const data = await espnFetch(
      `/summary?event=${encodeURIComponent(id)}`
    );

    const header = data.header || {};
    const competition = header.competitions?.[0];
    const competitors = competition?.competitors || [];

    const casa = competitors.find(
      (team) => team.homeAway === "home"
    );

    const trasferta = competitors.find(
      (team) => team.homeAway === "away"
    );

    const risultato = {
      casa: casa?.score != null ? Number(casa.score) : null,
      trasferta:
        trasferta?.score != null
          ? Number(trasferta.score)
          : null
    };

    const stato = competition?.status || header.status;

    res.status(200).json({
      success: true,

      partita: {
        id: id,

        nome: header.competitions?.[0]?.competitors
          ? `${casa?.team?.displayName || ""} - ${trasferta?.team?.displayName || ""}`
          : null,

        data: competition?.date || header.date || null,

        competizione: {
          id:
            competition?.league?.id ||
            header.season?.leagueId ||
            null,
          nome:
            competition?.league?.name ||
            null
        },

        stato: {
          nome: stato?.type?.name || null,
          descrizione: stato?.type?.description || null,
          stato: stato?.type?.state || null,
          completata: stato?.type?.completed || false,
          minuto: stato?.displayClock || null
        },

        casa: casa
          ? {
              id: casa.team?.id || null,
              nome: casa.team?.displayName || null,
              abbreviazione: casa.team?.abbreviation || null,
              logo: casa.team?.logo || null,
              gol:
                casa.score != null
                  ? Number(casa.score)
                  : null
            }
          : null,

        trasferta: trasferta
          ? {
              id: trasferta.team?.id || null,
              nome: trasferta.team?.displayName || null,
              abbreviazione: trasferta.team?.abbreviation || null,
              logo: trasferta.team?.logo || null,
              gol:
                trasferta.score != null
                  ? Number(trasferta.score)
                  : null
            }
          : null,

        risultato,

        stadio:
          competition?.venue?.fullName ||
          competition?.venue?.displayName ||
          null
      },

      eventi: data.plays || [],

      statistiche: data.boxscore?.teams || [],

      formazioni: data.rosters || [],

      leaders: data.leaders || [],

      odds: data.odds || []
    });

  } catch (error) {
    console.error("Errore API partita:", error);

    res.status(500).json({
      success: false,
      errore: error.message
    });
  }
};
