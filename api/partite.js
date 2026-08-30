const { espnFetch } = require("../lib/espn");

module.exports = async (req, res) => {
  try {
    const competizione = req.query.competizione || "ita.1";
    const data = req.query.data || new Date().toISOString().slice(0, 10);

    const dataESPN = data.replace(/-/g, "");

    const path = `/${competizione}/scoreboard?dates=${dataESPN}`;

    const dataESPNResponse = await espnFetch(path);

    const eventi = dataESPNResponse.events || [];

    const partite = eventi.map((evento) => {
      const competizioneESPN =
        evento.competitions?.[0] || {};

      const squadre =
        competizioneESPN.competitors || [];

      const casa =
        squadre.find((squadra) => squadra.homeAway === "home");

      const trasferta =
        squadre.find((squadra) => squadra.homeAway === "away");

      return {
        id: evento.id,
        data: evento.date,

        competizione: {
          id: competizione,
          nome:
            competizione === "ita.1"
              ? "Serie A"
              : competizione
        },

        stato: {
          nome: evento.status?.type?.name || null,
          descrizione: evento.status?.type?.description || null,
          stato: evento.status?.type?.state || null,
          completata: evento.status?.type?.completed || false
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
          competizioneESPN.venue?.fullName ||
          evento.venue?.displayName ||
          null,

        nome: evento.name || null,

        link: {
          partita:
            evento.links?.find((link) =>
              link.rel?.includes("summary")
            )?.href || null,

          statistiche:
            evento.links?.find((link) =>
              link.rel?.includes("stats")
            )?.href || null
        }
      };
    });

    return res.status(200).json({
      success: true,
      competizione,
      data,
      totale: partite.length,
      partite
    });

  } catch (errore) {
    return res.status(500).json({
      success: false,
      errore: errore.message
    });
  }
};
