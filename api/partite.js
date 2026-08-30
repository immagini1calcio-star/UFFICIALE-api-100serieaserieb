const { espnFetch } = require("../lib/espn");

const COMPETIZIONI = {
  "ita.1": {
    nome: "Serie A",
    paese: "Italia"
  },

  "ita.2": {
    nome: "Serie B",
    paese: "Italia"
  },

  "ita.coppa_italia": {
    nome: "Coppa Italia",
    paese: "Italia"
  },

  "ita.nazionale": {
    nome: "Nazionale Italiana",
    paese: "Italia"
  },

  "eng.1": {
    nome: "Premier League",
    paese: "Inghilterra"
  },

  "esp.1": {
    nome: "LaLiga",
    paese: "Spagna"
  },

  "ger.1": {
    nome: "Bundesliga",
    paese: "Germania"
  },

  "fra.1": {
    nome: "Ligue 1",
    paese: "Francia"
  },

  "ned.1": {
    nome: "Eredivisie",
    paese: "Paesi Bassi"
  },

  "por.1": {
    nome: "Liga Portugal",
    paese: "Portogallo"
  },

  "ksa.1": {
    nome: "Saudi Pro League",
    paese: "Arabia Saudita"
  },

  "uefa.champions": {
    nome: "Champions League",
    paese: "Europa"
  },

  "uefa.europa": {
    nome: "Europa League",
    paese: "Europa"
  },

  "uefa.europa.conf": {
    nome: "Conference League",
    paese: "Europa"
  }
};


function getCompetizione(codice) {
  return COMPETIZIONI[codice] || {
    nome: codice,
    paese: null
  };
}


function getLogo(team) {
  return (
    team?.logo ||
    team?.logos?.[0]?.href ||
    team?.logos?.[0]?.url ||
    null
  );
}


function getTeam(competitor) {
  if (!competitor) {
    return {
      id: null,
      nome: null,
      abbreviazione: null,
      logo: null,
      gol: 0
    };
  }

  return {
    id: competitor.team?.id || null,

    nome:
      competitor.team?.displayName ||
      competitor.team?.name ||
      competitor.team?.shortDisplayName ||
      null,

    abbreviazione:
      competitor.team?.abbreviation ||
      null,

    logo: getLogo(competitor.team),

    gol:
      competitor.score !== undefined &&
      competitor.score !== null
        ? Number(competitor.score)
        : 0
  };
}


function getStato(evento) {
  const status = evento?.status || {};
  const type = status.type || {};

  return {
    nome: type.name || null,

    descrizione:
      type.description ||
      type.detail ||
      null,

    stato:
      type.state ||
      null,

    completata:
      type.completed === true,

    minuto:
      status.displayClock ||
      null
  };
}


function getLink(evento, tipo) {
  const links = evento?.links || [];

  if (tipo === "partita") {
    return (
      links.find(link =>
        Array.isArray(link.rel) &&
        (
          link.rel.includes("summary") ||
          link.rel.includes("game")
        )
      )?.href || null
    );
  }

  if (tipo === "statistiche") {
    return (
      links.find(link =>
        Array.isArray(link.rel) &&
        (
          link.rel.includes("stats") ||
          link.rel.includes("statistics")
        )
      )?.href || null
    );
  }

  return null;
}


module.exports = async (req, res) => {
  try {

    const competizione =
      req.query.competizione ||
      "ita.1";

    const data =
      req.query.data ||
      new Date().toISOString().slice(0, 10);


    /*
     * Controllo competizione
     */

    if (!COMPETIZIONI[competizione]) {
      return res.status(400).json({
        success: false,
        errore: "Competizione non supportata",
        competizione,
        competizioni_disponibili: Object.keys(COMPETIZIONI)
      });
    }


    /*
     * Conversione data
     */

    const dataESPN = data.replace(/-/g, "");


    /*
     * Richiesta ESPN
     */

    const path =
      `/${competizione}/scoreboard?dates=${dataESPN}`;

    const risposta =
      await espnFetch(path);


    const eventi =
      risposta.events || [];


    const infoCompetizione =
      getCompetizione(competizione);


    /*
     * Conversione partite
     */

    const partite = eventi.map(evento => {

      const gara =
        evento.competitions?.[0] || {};

      const squadre =
        gara.competitors || [];


      const casa =
        squadre.find(
          squadra =>
            squadra.homeAway === "home"
        );


      const trasferta =
        squadre.find(
          squadra =>
            squadra.homeAway === "away"
        );


      return {

        id:
          evento.id ||
          null,


        data:
          evento.date ||
          gara.date ||
          null,


        competizione: {

          id:
            competizione,

          nome:
            infoCompetizione.nome,

          paese:
            infoCompetizione.paese

        },


        stato:
          getStato(evento),


        casa:
          getTeam(casa),


        trasferta:
          getTeam(trasferta),


        stadio:
          gara.venue?.fullName ||
          gara.venue?.displayName ||
          evento.venue?.displayName ||
          null,


        nome:
          evento.name ||
          `${trasferta?.team?.displayName || ""} at ${casa?.team?.displayName || ""}`.trim(),


        link: {

          partita:
            getLink(evento, "partita") ||
            `https://www.espn.com/soccer/match/_/gameId/${evento.id}`,

          statistiche:
            getLink(evento, "statistiche") ||
            `https://www.espn.com/soccer/matchstats/_/gameId/${evento.id}`

        }

      };

    });


    /*
     * Risposta finale
     */

    return res.status(200).json({

      success: true,

      competizione: {

        id:
          competizione,

        nome:
          infoCompetizione.nome,

        paese:
          infoCompetizione.paese

      },

      data,

      totale:
        partite.length,

      partite

    });


  } catch (errore) {

    return res.status(500).json({

      success: false,

      errore:
        errore.message

    });

  }
};
