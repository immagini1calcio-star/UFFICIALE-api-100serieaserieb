const { espnFetch } = require("../lib/espn");

/*
|--------------------------------------------------------------------------
| COMPETIZIONI
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| FUNZIONI GENERALI
|--------------------------------------------------------------------------
*/

function nomeCompetizione(id) {
  return COMPETIZIONI[id] || {
    nome: id || "Sconosciuta",
    paese: null
  };
}


function ultimoNome(athlete) {
  if (!athlete) return null;

  const nome =
    athlete.displayName ||
    athlete.fullName ||
    athlete.name ||
    "";

  const parti = nome.trim().split(/\s+/);

  return parti.length
    ? parti[parti.length - 1]
    : null;
}


function getGiocatore(obj) {
  if (!obj) return null;

  return ultimoNome(
    obj.athlete ||
    obj.athletesInvolved?.[0] ||
    obj.participants?.[0]?.athlete ||
    obj
  );
}


function getAssist(obj) {
  if (!obj) return null;

  return ultimoNome(
    obj.assistedBy ||
    obj.assist ||
    obj.athletesInvolved?.[1] ||
    obj.participants?.[1]?.athlete
  );
}


function getMinuto(obj) {
  return (
    obj?.clock?.displayValue ||
    obj?.time?.displayValue ||
    obj?.clock?.value ||
    obj?.time?.value ||
    null
  );
}


function getSquadra(obj) {
  return (
    obj?.team?.displayName ||
    obj?.team?.name ||
    obj?.team?.shortDisplayName ||
    null
  );
}


function getTipo(obj) {
  return String(
    obj?.type?.text ||
    obj?.type?.description ||
    obj?.type?.name ||
    obj?.alternativeType?.text ||
    obj?.text ||
    ""
  ).toLowerCase();
}


function getLogo(team) {
  return (
    team?.logo ||
    team?.logos?.[0]?.href ||
    team?.logos?.[0]?.url ||
    null
  );
}


/*
|--------------------------------------------------------------------------
| SQUADRA
|--------------------------------------------------------------------------
*/

function convertiSquadra(competitor) {

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

    id:
      competitor.team?.id ||
      null,

    nome:
      competitor.team?.displayName ||
      competitor.team?.name ||
      competitor.team?.shortDisplayName ||
      null,

    abbreviazione:
      competitor.team?.abbreviation ||
      null,

    logo:
      getLogo(competitor.team),

    gol:
      competitor.score !== undefined &&
      competitor.score !== null
        ? Number(competitor.score)
        : 0
  };
}


/*
|--------------------------------------------------------------------------
| MARCATORI
|--------------------------------------------------------------------------
*/

function estraiMarcatori(plays) {

  return plays
    .filter(play => {

      const tipo = getTipo(play);

      return (
        play.scoringPlay === true ||
        tipo.includes("goal") ||
        tipo.includes("gol") ||
        tipo.includes("own goal") ||
        tipo.includes("autogol")
      );

    })
    .map(play => ({

      minuto:
        getMinuto(play),

      giocatore:
        getGiocatore(play),

      assist:
        getAssist(play),

      squadra:
        getSquadra(play),

      autorete:
        play.ownGoal === true ||
        getTipo(play).includes("own goal") ||
        getTipo(play).includes("autogol")

    }));

}


/*
|--------------------------------------------------------------------------
| CARTELLINI
|--------------------------------------------------------------------------
*/

function estraiCartellini(plays) {

  return plays
    .filter(play => {

      const tipo = getTipo(play);

      return (
        tipo.includes("yellow") ||
        tipo.includes("red") ||
        tipo.includes("giallo") ||
        tipo.includes("rosso")
      );

    })
    .map(play => {

      const tipo = getTipo(play);

      return {

        minuto:
          getMinuto(play),

        giocatore:
          getGiocatore(play),

        squadra:
          getSquadra(play),

        tipo:
          (
            tipo.includes("red") ||
            tipo.includes("rosso")
          )
            ? "rosso"
            : "giallo"

      };

    });

}


/*
|--------------------------------------------------------------------------
| SOSTITUZIONI
|--------------------------------------------------------------------------
*/

function estraiSostituzioni(plays) {

  return plays
    .filter(play => {

      const tipo = getTipo(play);

      return (
        tipo.includes("substitution") ||
        tipo.includes("sostituzione")
      );

    })
    .map(play => {

      let entrato =
        play.substitution?.in ||
        play.substitution?.playerIn ||
        play.participants?.[0]?.athlete ||
        play.athletesInvolved?.[0];

      let uscito =
        play.substitution?.out ||
        play.substitution?.playerOut ||
        play.participants?.[1]?.athlete ||
        play.athletesInvolved?.[1];

      return {

        minuto:
          getMinuto(play),

        entrato:
          ultimoNome(entrato),

        uscito:
          ultimoNome(uscito),

        squadra:
          getSquadra(play)

      };

    });

}


/*
|--------------------------------------------------------------------------
| STATISTICHE
|--------------------------------------------------------------------------
*/

function estraiStatistiche(boxscore) {

  const statistiche = {
    casa: [],
    trasferta: []
  };

  for (const squadra of boxscore?.teams || []) {

    const lista =
      squadra.statistics || [];

    const dati =
      lista.map(stat => ({

        nome:
          stat.name ||
          null,

        label:
          stat.label ||
          stat.displayName ||
          null,

        valore:
          stat.displayValue !== undefined
            ? stat.displayValue
            : stat.value !== undefined
              ? String(stat.value)
              : null

      }));

    if (squadra.homeAway === "home") {
      statistiche.casa = dati;
    }

    if (squadra.homeAway === "away") {
      statistiche.trasferta = dati;
    }

  }

  return statistiche;
}


/*
|--------------------------------------------------------------------------
| FORMAZIONI
|--------------------------------------------------------------------------
*/

function estraiFormazioni(rosters, home, away) {

  const formazioni = {
    casa: null,
    trasferta: null
  };


  for (const roster of rosters || []) {

    const formazione = {

      modulo:
        roster.formation ||
        roster.formationUsed ||
        roster.formation?.displayName ||
        null,

      allenatore:
        roster.coach?.displayName ||
        roster.coaches?.[0]?.displayName ||
        null,

      titolari: [],

      riserve: []

    };


    const giocatori =
      roster.roster ||
      roster.athletes ||
      [];


    for (const giocatore of giocatori) {

      const atleta =
        giocatore.athlete ||
        giocatore;


      const elemento = {

        cognome:
          ultimoNome(atleta),

        numero:
          giocatore.jersey ||
          atleta.jersey ||
          null,

        ruolo:
          giocatore.position?.abbreviation ||
          giocatore.position?.displayName ||
          atleta.position?.abbreviation ||
          null,

        titolare:
          giocatore.starter === true ||
          giocatore.lineupStatus === "starter"

      };


      if (elemento.titolare) {

        formazione.titolari.push(elemento);

      } else {

        formazione.riserve.push(elemento);

      }

    }


    const rosterTeamId =
      roster.team?.id ||
      roster.team?.teamId ||
      null;


    if (
      rosterTeamId &&
      String(rosterTeamId) ===
      String(home?.team?.id)
    ) {

      formazioni.casa = formaçãoSeCorretta(formazione);

    }


    if (
      rosterTeamId &&
      String(rosterTeamId) ===
      String(away?.team?.id)
    ) {

      formazioni.trasferta = formaçãoSeCorretta(formazione);

    }

  }


  return formazioni;
}


/*
|--------------------------------------------------------------------------
| CORREZIONE FORMAZIONE
|--------------------------------------------------------------------------
*/

function formaçãoSeCorretta(formazione) {

  return {

    modulo:
      formazione.modulo,

    allenatore:
      formazione.allenatore,

    titolari:
      formazione.titolari,

    riserve:
      formazione.riserve

  };

}


/*
|--------------------------------------------------------------------------
| EVENTI
|--------------------------------------------------------------------------
*/

function estraiEventi(plays) {

  return plays.map(play => ({

    id:
      play.id ||
      null,

    minuto:
      getMinuto(play),

    tipo:
      play.type?.text ||
      play.type?.description ||
      play.type?.name ||
      null,

    giocatore:
      getGiocatore(play),

    assist:
      getAssist(play),

    squadra:
      getSquadra(play)

  }));

}


/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

module.exports = async (req, res) => {

  try {

    const id =
      req.query.id;


    /*
     * ID obbligatorio
     */

    if (!id) {

      return res.status(400).json({

        success: false,

        errore:
          "Parametro id obbligatorio"

      });

    }


    /*
     * Recupero dati ESPN
     */

    const data =
      await espnFetch(
        `/ita.1/summary?event=${encodeURIComponent(id)}`
      );


    /*
     * Competizione della partita
     */

    const header =
      data.header || {};

    const competitionHeader =
      header.competitions?.[0] || {};

    const competition =
      competitionHeader.competition || {};

    const competitionId =
      competition.id ||
      header.league?.id ||
      "ita.1";


    const infoCompetizione =
      nomeCompetizione(competitionId);


    /*
     * Partita
     */

    const c =
      header.competitions?.[0];


    if (!c) {

      return res.status(404).json({

        success: false,

        errore:
          "Partita non trovata"

      });

    }


    /*
     * Squadre
     */

    const teams =
      c.competitors || [];


    const home =
      teams.find(
        team =>
          team.homeAway === "home"
      );


    const away =
      teams.find(
        team =>
          team.homeAway === "away"
      );


    /*
     * Eventi ESPN
     */

    const plays =
      data.plays ||
      data.keyEvents ||
      [];


    /*
     * Statistiche
     */

    const statistiche =
      estraiStatistiche(
        data.boxscore
      );


    /*
     * Formazioni
     */

    const formazioni =
      estraiFormazioni(
        data.rosters ||
        data.lineups ||
        [],
        home,
        away
      );


    /*
     * Risposta
     */

    return res.status(200).json({

      success: true,


      partita: {

        id:
          header.id ||
          id,


        data:
          c.date ||
          header.date ||
          null,


        competizione: {

          id:
            competitionId,

          nome:
            infoCompetizione.nome,

          paese:
            infoCompetizione.paese

        },


        stato: {

          nome:
            c.status?.type?.name ||
            null,

          descrizione:
            c.status?.type?.description ||
            c.status?.type?.detail ||
            null,

          stato:
            c.status?.type?.state ||
            null,

          completata:
            c.status?.type?.completed === true,

          minuto:
            c.status?.displayClock ||
            null

        },


        casa:
          convertiSquadra(home),


        trasferta:
          convertiSquadra(away),


        stadio:
          data.gameInfo?.venue?.fullName ||
          c.venue?.fullName ||
          c.venue?.displayName ||
          null,


        nome:
          `${away?.team?.displayName || ""} at ${home?.team?.displayName || ""}`.trim(),


        link: {

          partita:
            `https://www.espn.com/soccer/match/_/gameId/${id}`,

          statistiche:
            `https://www.espn.com/soccer/matchstats/_/gameId/${id}`

        }

      },


      info: {

        arbitro:
          c.officials?.[0]?.displayName ||
          data.gameInfo?.officials?.[0]?.displayName ||
          null,

        stadio:
          data.gameInfo?.venue?.fullName ||
          c.venue?.fullName ||
          null,

        citta:
          data.gameInfo?.venue?.address?.city ||
          null,

        paese:
          data.gameInfo?.venue?.address?.country ||
          null

      },


      marcatori:
        estraiMarcatori(plays),


      cartellini:
        estraiCartellini(plays),


      sostituzioni:
        estraiSostituzioni(plays),


      statistiche,


      formazioni,


      eventi:
        estraiEventi(plays)

    });


  } catch (errore) {

    console.error(
      "ERRORE API PARTITA:",
      errore
    );


    return res.status(500).json({

      success: false,

      errore:
        errore.message ||
        "Errore interno"

    });

  }

};
