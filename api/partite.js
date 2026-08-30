const { espnFetch } = require("../lib/espn");

module.exports = async (req, res) => {
  try {
    const competizione = req.query.competizione || "ita.1";
    const data = req.query.data;

    let path = `/${encodeURIComponent(competizione)}/scoreboard`;

    if (data) {
      const dataESPN = data.replace(/-/g, "");
      path += `?dates=${dataESPN}`;
    }

    const dataESPN = await espnFetch(path);

    const partite = (dataESPN.events || []).map((event) => {
      const competition = event.competitions?.[0];
      const competitors = competition?.competitors || [];

      const casa = competitors.find(
        (team) => team.homeAway === "home"
      );

      const trasferta = competitors.find(
        (team) => team.homeAway === "away"
      );

      return {
        id: event.id,

        data: event.date,

        competizione: {
          id: competizione,
          nome: competition?.league?.name || "Serie A"
        },

        stato: {
          nome: event.status?.type?.name || null,
          descrizione: event.status?.type?.description || null,
          stato: event.status?.type?.state || null,
          completata: event.status?.type?.completed || false
        },

        casa: casa
          ? {
              id: casa.team?.id || null,
              nome: casa.team?.displayName || null,
              abbreviazione: casa.team?.abbreviation || null,
              logo: casa.team?.logo || null,
              gol: Number(casa.score || 0)
            }
          : null,

        trasferta: trasferta
          ? {
              id: trasferta.team?.id || null,
              nome: trasferta.team?.displayName || null,
              abbreviazione: trasferta.team?.abbreviation || null,
              logo: trasferta.team?.logo || null,
              gol: Number(trasferta.score || 0)
            }
          : null,

        stadio:
          competition?.venue?.fullName ||
          event.venue?.displayName ||
          null,

        nome: event.name || null,

        link: {
          partita: `https://www.espn.com/soccer/match/_/gameId/${event.id}`,
          statistiche: `https://www.espn.com/soccer/matchstats/_/gameId/${event.id}`
        }
      };
    });

    res.status(200).json({
      success: true,
      competizione,
      data: data || null,
      totale: partite.length,
      partite
    });

  } catch (error) {
    console.error("Errore API partite:", error);

    res.status(500).json({
      success: false,
      errore: error.message
    });
  }
};
