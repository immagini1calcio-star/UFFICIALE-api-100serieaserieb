const { espnFetch } = require("../lib/espn");

/* ============================================================
   API CALCIO 100%SERIEA&SERIEB
   ENDPOINT:

   /api/partita?id=ID_PARTITA&competizione=CODICE_ESPN

   Esempio:
   /api/partita?id=401882897&competizione=esp.1

   ============================================================ */


/* ============================================================
   COMPETIZIONI
   ============================================================ */

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
  }

};


/* ============================================================
   ULTIMO COGNOME
   ============================================================ */

function ultimoCognome(nome) {

  if (!nome) return null;

  const testo = String(nome)
    .trim()
    .replace(/\s+/g, " ");

  if (!testo) return null;

  return testo.split(" ").pop();

}


/* ============================================================
   NOME GIOCATORE
   ============================================================ */

function nomeGiocatore(p) {

  if (!p) return null;

  const atleta =
    p?.athlete ||
    p?.athletesInvolved?.[0] ||
    p?.participants?.[0]?.athlete ||
    p;

  const nome =
    atleta?.displayName ||
    atleta?.fullName ||
    atleta?.shortName ||
    atleta?.name ||
    "";

  return ultimoCognome(nome);

}


/* ============================================================
   ASSIST
   ============================================================ */

function assistGiocatore(p) {

  if (!p) return null;

  const atleta =
    p?.assistedBy ||
    p?.assist ||
    p?.athletesInvolved?.[1] ||
    p?.participants?.[1]?.athlete;

  if (!atleta) return null;

  const nome =
    atleta?.displayName ||
    atleta?.fullName ||
    atleta?.shortName ||
    atleta?.name ||
    "";

  return ultimoCognome(nome);

}


/* ============================================================
   MINUTO
   ============================================================ */

function minutoEvento(p) {

  if (!p) return null;

  return (
    p?.clock?.displayValue ||
    p?.clock?.value ||
    p?.time?.displayValue ||
    p?.time?.value ||
    null
  );

}


/* ============================================================
   SQUADRA EVENTO
   ============================================================ */

function squadraEvento(p) {

  if (!p) return null;

  return (
    p?.team?.displayName ||
    p?.team?.name ||
    p?.team?.shortDisplayName ||
    null
  );

}


/* ============================================================
   TIPO EVENTO ESPN
   ============================================================ */

function tipoEvento(p) {

  if (!p) return "";

  return String(
    p?.type?.text ||
    p?.type?.description ||
    p?.type?.name ||
    p?.alternativeType?.text ||
    p?.text ||
    ""
  ).toLowerCase();

}


/* ============================================================
   TRADUZIONE EVENTI
   ============================================================ */

function tipoEventoItaliano(p) {

  const tipo = tipoEvento(p);

  if (
    tipo.includes("goal") ||
    tipo.includes("gol") ||
    tipo.includes("score")
  ) {
    return "Gol";
  }

  if (
    tipo.includes("yellow") ||
    tipo.includes("giallo")
  ) {
    return "Cartellino giallo";
  }

  if (
    tipo.includes("red") ||
    tipo.includes("rosso")
  ) {
    return "Cartellino rosso";
  }

  if (
    tipo.includes("substitution") ||
    tipo.includes("sostituzione")
  ) {
    return "Sostituzione";
  }

  if (tipo.includes("kickoff")) {
    return "Inizio partita";
  }

  if (
    tipo.includes("halftime") ||
    tipo.includes("half time")
  ) {
    return "Fine primo tempo";
  }

  if (
    tipo.includes("start 2nd half") ||
    tipo.includes("second half")
  ) {
    return "Inizio secondo tempo";
  }

  if (
    tipo.includes("end regular time") ||
    tipo.includes("full time") ||
    tipo.includes("match ended")
  ) {
    return "Fine partita";
  }

  if (
    tipo.includes("start delay")
  ) {
    return "Interruzione";
  }

  if (
    tipo.includes("end delay")
  ) {
    return "Ripresa del gioco";
  }

  if (tipo.includes("penalty")) {
    return "Rigore";
  }

  return "Evento";

}


/* ============================================================
   RUOLO ITALIANO
   ============================================================ */

function ruoloItaliano(ruolo) {

  if (!ruolo) return null;

  const r = String(ruolo).toUpperCase();

  const mappa = {

    "G": "Portiere",
    "GK": "Portiere",

    "CB": "Difensore",
    "CD": "Difensore",
    "CD-L": "Difensore",
    "CD-R": "Difensore",

    "LB": "Difensore",
    "RB": "Difensore",
    "LWB": "Difensore",
    "RWB": "Difensore",

    "DM": "Centrocampista",
    "CM": "Centrocampista",
    "CM-L": "Centrocampista",
    "CM-R": "Centrocampista",

    "LM": "Centrocampista",
    "RM": "Centrocampista",

    "AM": "Centrocampista",
    "CAM": "Centrocampista",

    "LW": "Attaccante",
    "RW": "Attaccante",

    "CF": "Attaccante",
    "CF-L": "Attaccante",
    "CF-R": "Attaccante",

    "ST": "Attaccante",
    "FW": "Attaccante",

    "SUB": "Riserva"

  };

  return mappa[r] || ruolo;

}


/* ============================================================
   DATI SQUADRA
   ============================================================ */

function datiSquadra(x) {

  if (!x) {

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
      x?.team?.id ||
      null,

    nome:
      x?.team?.displayName ||
      x?.team?.fullName ||
      x?.team?.name ||
      null,

    abbreviazione:
      x?.team?.abbreviation ||
      x?.team?.shortDisplayName ||
      null,

    logo:
      x?.team?.logo ||
      x?.team?.logos?.[0]?.href ||
      null,

    gol:
      Number(x?.score || 0)

  };

}


/* ============================================================
   MARCATORI
   ============================================================ */

function creaMarcatori(plays) {

  return plays

    .filter((p) => {

      const tipo = tipoEvento(p);

      return (
        p?.scoringPlay === true ||
        tipo.includes("goal") ||
        tipo.includes("gol")
      );

    })

    .map((p) => ({

      minuto:
        minutoEvento(p),

      giocatore:
        nomeGiocatore(p),

      assist:
        assistGiocatore(p),

      squadra:
        squadraEvento(p),

      autorete:
        p?.ownGoal === true ||
        tipoEvento(p).includes("own") ||
        tipoEvento(p).includes("autogol")

    }));

}


/* ============================================================
   CARTELLINI
   ============================================================ */

function creaCartellini(plays) {

  return plays

    .filter((p) => {

      const tipo = tipoEvento(p);

      return (
        tipo.includes("yellow") ||
        tipo.includes("red") ||
        tipo.includes("giallo") ||
        tipo.includes("rosso")
      );

    })

    .map((p) => {

      const tipo = tipoEvento(p);

      return {

        minuto:
          minutoEvento(p),

        giocatore:
          nomeGiocatore(p),

        squadra:
          squadraEvento(p),

        tipo:
          tipo.includes("red") ||
          tipo.includes("rosso")
            ? "rosso"
            : "giallo"

      };

    });

}


/* ============================================================
   SOSTITUZIONI
   ============================================================ */

function creaSostituzioni(plays) {

  return plays

    .filter((p) => {

      const tipo = tipoEvento(p);

      return (
        tipo.includes("substitution") ||
        tipo.includes("sostituzione")
      );

    })

    .map((p) => {

      const entrato =
        p?.substitution?.in ||
        p?.participants?.[0]?.athlete ||
        p?.athletesInvolved?.[0];

      const uscito =
        p?.substitution?.out ||
        p?.participants?.[1]?.athlete ||
        p?.athletesInvolved?.[1];

      return {

        minuto:
          minutoEvento(p),

        entra:
          ultimoCognome(
            entrato?.displayName ||
            entrato?.fullName ||
            entrato?.shortName ||
            entrato?.name ||
            entrato
          ),

        esce:
          ultimoCognome(
            uscito?.displayName ||
            uscito?.fullName ||
            uscito?.shortName ||
            uscito?.name ||
            uscito
          ),

        squadra:
          squadraEvento(p)

      };

    });

}


/* ============================================================
   CRONACA COMPLETA
   ============================================================ */

function creaCronaca(plays) {

  return plays

    .map((p) => {

      const tipo = tipoEventoItaliano(p);

      const minuto = minutoEvento(p);

      const giocatore = nomeGiocatore(p);

      const assist = assistGiocatore(p);

      const squadra = squadraEvento(p);

      let descrizione = tipo;

      if (tipo === "Gol") {

        descrizione =
          giocatore
            ? `Gol di ${giocatore}`
            : "Gol";

        if (assist) {
          descrizione += `, assist di ${assist}`;
        }

      }

      else if (tipo === "Cartellino giallo") {

        descrizione =
          giocatore
            ? `Cartellino giallo per ${giocatore}`
            : "Cartellino giallo";

      }

      else if (tipo === "Cartellino rosso") {

        descrizione =
          giocatore
            ? `Cartellino rosso per ${giocatore}`
            : "Cartellino rosso";

      }

      else if (tipo === "Sostituzione") {

        const entrato =
          p?.substitution?.in ||
          p?.participants?.[0]?.athlete ||
          p?.athletesInvolved?.[0];

        const uscito =
          p?.substitution?.out ||
          p?.participants?.[1]?.athlete ||
          p?.athletesInvolved?.[1];

        const entra =
          ultimoCognome(
            entrato?.displayName ||
            entrato?.fullName ||
            entrato?.shortName ||
            entrato?.name ||
            entrato
          );

        const esce =
          ultimoCognome(
            uscito?.displayName ||
            uscito?.fullName ||
            uscito?.shortName ||
            uscito?.name ||
            uscito
          );

        descrizione =
          `Sostituzione: entra ${entra || "?"}, esce ${esce || "?"}`;

      }

      return {

        minuto,
        tipo,
        giocatore,
        assist,
        squadra,
        descrizione

      };

    });

}


/* ============================================================
   STATISTICHE
   ============================================================ */

function creaStatistiche(data) {

  const risultato = {

    casa: [],
    trasferta: []

  };

  const traduzioni = {

    foulsCommitted: "Falli",
    yellowCards: "Cartellini gialli",
    redCards: "Cartellini rossi",
    offsides: "Fuorigioco",
    wonCorners: "Calci d'angolo",
    saves: "Parate",
    possessionPct: "Possesso palla",
    totalShots: "Tiri",
    shotsOnTarget: "Tiri in porta",
    shotPct: "Tiri in porta %",
    penaltyKickGoals: "Gol su rigore",
    penaltyKickShots: "Rigori calciati",
    accuratePasses: "Passaggi riusciti",
    totalPasses: "Passaggi",
    passPct: "Precisione passaggi %",
    accurateCrosses: "Cross riusciti",
    totalCrosses: "Cross",
    crossPct: "Precisione cross %",
    totalLongBalls: "Lanci lunghi",
    accurateLongBalls: "Lanci lunghi riusciti",
    longballPct: "Precisione lanci lunghi %",
    blockedShots: "Tiri bloccati",
    effectiveTackles: "Contrasti riusciti",
    totalTackles: "Contrasti",
    tacklePct: "Precisione contrasti %",
    interceptions: "Intercetti",
    effectiveClearance: "Spazzate riuscite",
    totalClearance: "Spazzate"

  };

  for (const team of data?.boxscore?.teams || []) {

    const statistiche =
      (team?.statistics || []).map((x) => {

        const nome =
          x?.name || null;

        return {

          nome,

          label:
            traduzioni[nome] ||
            x?.label ||
            nome,

          valore:
            x?.displayValue ??
            x?.value ??
            null

        };

      });

    if (team?.homeAway === "home") {
      risultato.casa = statistiche;
    }

    if (team?.homeAway === "away") {
      risultato.trasferta = statistiche;
    }

  }

  return risultato;

}


/* ============================================================
   FORMAZIONI
   ============================================================ */

function creaFormazioni(data, home, away) {

  const risultato = {

    casa: null,
    trasferta: null

  };

  const rosters =
    data?.rosters ||
    data?.lineups ||
    [];

  for (const r of rosters) {

    const formazione = {

      modulo:
        r?.formation ||
        r?.formationUsed ||
        r?.formation?.displayName ||
        null,

      allenatore:
        ultimoCognome(
          r?.coach?.displayName ||
          r?.coaches?.[0]?.displayName ||
          ""
        ),

      titolari: [],

      riserve: []

    };

    const giocatori =
      r?.roster ||
      r?.athletes ||
      [];

    for (const p of giocatori) {

      const atleta =
        p?.athlete ||
        p;

      const cognome =
        ultimoCognome(
          atleta?.displayName ||
          atleta?.fullName ||
          atleta?.shortName ||
          atleta?.name ||
          ""
        );

      const numero =
        p?.jersey ||
        atleta?.jersey ||
        null;

      const ruoloOriginale =
        p?.position?.abbreviation ||
        atleta?.position?.abbreviation ||
        p?.position?.displayName ||
        atleta?.position?.displayName ||
        null;

      const titolare =
        p?.starter === true ||
        p?.lineupStatus === "starter";

      const giocatore = {

        cognome,

        numero,

        ruolo:
          ruoloItaliano(ruoloOriginale),

        ruoloESPN:
          ruoloOriginale,

        titolare

      };

      if (titolare) {

        formazione.titolari.push(
          giocatore
        );

      } else {

        formazione.riserve.push(
          giocatore
        );

      }

    }

    const idSquadra =
      r?.team?.id;

    if (
      idSquadra &&
      idSquadra === home?.team?.id
    ) {

      risultato.casa =
        formazione;

    }

    if (
      idSquadra &&
      idSquadra === away?.team?.id
    ) {

      risultato.trasferta =
        formazione;

    }

  }

  return risultato;

}


/* ============================================================
   ARBITRI
   ============================================================ */

function creaArbitri(competition) {

  const ufficiali =
    competition?.officials ||
    [];

  const risultato = {

    arbitro: null,

    assistente1: null,

    assistente2: null,

    quartoUfficiale: null,

    var: null,

    avar: null

  };

  for (const ufficiale of ufficiali) {

    const nome =
      ufficiale?.displayName ||
      ufficiale?.fullName ||
      ufficiale?.name ||
      null;

    if (!nome) continue;

    const posizione = String(

      ufficiale?.position ||
      ufficiale?.position?.displayName ||
      ufficiale?.role ||
      ufficiale?.type ||
      ufficiale?.description ||
      ""

    ).toLowerCase();

    if (
      posizione.includes("referee") ||
      posizione.includes("arbitro")
    ) {

      risultato.arbitro =
        nome;

    }

    else if (
      posizione.includes("assistant referee") ||
      posizione.includes("assistant1") ||
      posizione.includes("assistente 1")
    ) {

      risultato.assistente1 =
        nome;

    }

    else if (
      posizione.includes("assistant referee 2") ||
      posizione.includes("assistant2") ||
      posizione.includes("assistente 2")
    ) {

      risultato.assistente2 =
        nome;

    }

    else if (
      posizione.includes("fourth") ||
      posizione.includes("quarto")
    ) {

      risultato.quartoUfficiale =
        nome;

    }

    else if (
      posizione === "var" ||
      posizione.includes("video assistant referee")
    ) {

      risultato.var =
        nome;

    }

    else if (
      posizione === "avar" ||
      posizione.includes("assistant video assistant")
    ) {

      risultato.avar =
        nome;

    }

  }

  return risultato;

}


/* ============================================================
   STATO PARTITA
   ============================================================ */

function statoItaliano(competition) {

  const status =
    competition?.status?.type;

  const state =
    String(
      status?.state ||
      ""
    ).toLowerCase();

  const completed =
    status?.completed === true;

  if (completed || state === "post") {

    return "Finita";

  }

  if (
    state === "in" ||
    state === "live"
  ) {

    return "LIVE";

  }

  return "In programma";

}


/* ============================================================
   DATA E ORARIO ITALIANI
   ============================================================ */

function dataItaliana(data) {

  if (!data) return null;

  const d =
    new Date(data);

  if (isNaN(d.getTime())) {
    return data;
  }

  return new Intl.DateTimeFormat(
    "it-IT",
    {
      timeZone: "Europe/Rome",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }
  ).format(d);

}


/* ============================================================
   ENDPOINT
   ============================================================ */

module.exports = async function handler(req, res) {

  try {

    /* --------------------------------------------------------
       PARAMETRI
       -------------------------------------------------------- */

    const id =
      req.query.id;

    const competizione =
      req.query.competizione ||
      "ita.1";


    /* --------------------------------------------------------
       CONTROLLO ID
       -------------------------------------------------------- */

    if (!id) {

      return res.status(400).json({

        success: false,

        errore:
          "Parametro id obbligatorio"

      });

    }


    /* --------------------------------------------------------
       COMPETIZIONE
       -------------------------------------------------------- */

    const datiCompetizione =
      COMPETIZIONI[competizione] || {

        nome:
          competizione,

        paese:
          null

      };


    /* --------------------------------------------------------
       ESPN
       -------------------------------------------------------- */

    const data =
      await espnFetch(

        `/${competizione}/summary?event=${encodeURIComponent(id)}`

      );


    /* --------------------------------------------------------
       COMPETIZIONE PARTITA
       -------------------------------------------------------- */

    const competition =
      data?.header?.competitions?.[0];

    if (!competition) {

      return res.status(404).json({

        success: false,

        errore:
          "Partita non trovata"

      });

    }


    /* --------------------------------------------------------
       SQUADRE
       -------------------------------------------------------- */

    const teams =
      competition?.competitors ||
      [];

    const home =
      teams.find(
        (x) =>
          x?.homeAway === "home"
      );

    const away =
      teams.find(
        (x) =>
          x?.homeAway === "away"
      );


    /* --------------------------------------------------------
       EVENTI ESPN
       -------------------------------------------------------- */

    const plays =
      data?.plays ||
      data?.keyEvents ||
      [];


    /* --------------------------------------------------------
       VENUE
       -------------------------------------------------------- */

    const venue =
      data?.gameInfo?.venue ||
      competition?.venue ||
      null;


    /* --------------------------------------------------------
       ARBITRI
       -------------------------------------------------------- */

    const arbitri =
      creaArbitri(
        competition
      );


    /* --------------------------------------------------------
       RISPOSTA
       -------------------------------------------------------- */

    return res.status(200).json({

      success: true,


      /* ======================================================
         PARTITA
         ====================================================== */

      partita: {

        id:
          data?.header?.id ||
          id,

        data:
          dataItaliana(
            competition?.date ||
            data?.header?.date
          ),


        competizione: {

          id:
            competizione,

          nome:
            datiCompetizione.nome,

          paese:
            datiCompetizione.paese

        },


        stato:
          statoItaliano(
            competition
          ),


        casa:
          datiSquadra(
            home
          ),


        trasferta:
          datiSquadra(
            away
          ),


        stadio:
          venue?.fullName ||
          venue?.displayName ||
          null,


        nome:

          home?.team &&
          away?.team

            ? `${away.team.displayName || ""} - ${home.team.displayName || ""}`

            : null,


        link: {

          partita:
            `https://www.espn.com/soccer/match/_/gameId/${encodeURIComponent(id)}`,

          statistiche:
            `https://www.espn.com/soccer/matchstats/_/gameId/${encodeURIComponent(id)}`

        }

      },


      /* ======================================================
         INFORMAZIONI GENERALI
         ====================================================== */

      info: {

        arbitro:
          arbitri.arbitro,

        assistente1:
          arbitri.assistente1,

        assistente2:
          arbitri.assistente2,

        quartoUfficiale:
          arbitri.quartoUfficiale,

        var:
          arbitri.var,

        avar:
          arbitri.avar,

        stadio:
          venue?.fullName ||
          venue?.displayName ||
          null,

        citta:
          venue?.address?.city ||
          null,

        paese:
          venue?.address?.country ||
          null

      },


      /* ======================================================
         MARCATORI
         ====================================================== */

      marcatori:
        creaMarcatori(
          plays
        ),


      /* ======================================================
         CARTELLINI
         ====================================================== */

      cartellini:
        creaCartellini(
          plays
        ),


      /* ======================================================
         SOSTITUZIONI
         ====================================================== */

      sostituzioni:
        creaSostituzioni(
          plays
        ),


      /* ======================================================
         CRONACA
         ====================================================== */

      cronaca:
        creaCronaca(
          plays
        ),


      /* ======================================================
         STATISTICHE
         ====================================================== */

      statistiche:
        creaStatistiche(
          data
        ),


      /* ======================================================
         FORMAZIONI
         ====================================================== */

      formazioni:
        creaFormazioni(
          data,
          home,
          away
        ),


      /* ======================================================
         TUTTI GLI EVENTI
         ====================================================== */

      eventi:

        plays.map((p) => ({

          id:
            p?.id ||
            null,

          minuto:
            minutoEvento(p),

          tipo:
            tipoEventoItaliano(p),

          giocatore:
            nomeGiocatore(p),

          assist:
            assistGiocatore(p),

          squadra:
            squadraEvento(p)

        }))

    });


  } catch (errore) {

    console.error(
      "Errore /api/partita:",
      errore
    );

    return res.status(500).json({

      success: false,

      errore:
        errore?.message ||
        "Errore interno del server"

    });

  }

};
