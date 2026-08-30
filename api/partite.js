const { getScoreboard } = require("../lib/espn");

module.exports = async (req, res) => {
  try {
    const competizione = req.query.competizione || "seriea";
    const date = req.query.date || "";

    const data = await getScoreboard(competizione, date);

    const eventi = data.events || [];

    const partite = eventi.map((evento) => {
      const competizioneEvento = evento.competitions?.[0];
      const squadre = competizioneEvento?.competitors || [];

      const casa = squadre.find((squadra) => squadra.homeAway === "home");
      const trasferta = squadre.find(
        (squadra) => squadra.homeAway === "away"
      );

      return {
        id: evento.id || null,
        data: evento.date || null,
        stato: evento.status?.type?.state || null,
        descrizione: evento.status?.type?.description || null,
        dettaglio: evento.status?.type?.detail || null,

        casa: casa
          ? {
              id: casa.team?.id || null,
              nome: casa.team?.displayName || null,
              abbreviazione: casa.team?.abbreviation || null,
              logo: casa.team?.logo || null,
              punteggio: casa.score ?? null
            }
          : null,

        trasferta: trasferta
          ? {
              id: trasferta.team?.id || null,
              nome: trasferta.team?.displayName || null,
              abbreviazione: trasferta.team?.abbreviation || null,
              logo: trasferta.team?.logo || null,
              punteggio: trasferta.score ?? null
            }
          : null,

        stadio: competizioneEvento?.venue?.fullName || null,
        citta: competizioneEvento?.venue?.address?.city || null,

        competizione:
          competizioneEvento?.notes?.[0]?.headline ||
          competizioneEvento?.altGameNote ||
          null
      };
    });

    return res.status(200).json({
      ok: true,
      source: "ESPN",
      competizione,
      date: date || null,
      totale: partite.length,
      partite
    });
  } catch (error) {
    console.error("Errore /api/partite:", error);

    return res.status(500).json({
      ok: false,
      error: "Errore nel recupero delle partite da ESPN"
    });
  }
};
