const { espnFetch } = require("../lib/espn");

/*
  ============================================================
  API CALCIO 100%SERIEA&SERIEB
  Endpoint:
  /api/partita?id=ID_PARTITA&competizione=CODICE_ESPN

  Esempi:
  /api/partita?id=401874746&competizione=ita.1
  /api/partita?id=401874746
  ============================================================
*/


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
   FUNZIONI UTILI
   ============================================================ */

function ultimoCognome(nome) {
  if (!nome) return null;

  const testo = String(nome)
    .trim()
    .replace(/\s+/g, " ");

  if (!testo) return null;

  return testo.split(" ").pop();
}


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


function squadraEvento(p) {
  if (!p) return null;

  return (
    p?.team?.displayName ||
    p?.team?.name ||
    p?.team?.shortDisplayName ||
    null
  );
}


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


function ruoloGiocatore(p) {
  return (
    p?.position?.abbreviation ||
    p?.athlete?.position?.abbreviation ||
    p?.position?.displayName ||
    p?.athlete?.position?.displayName ||
    null
  );
}


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
    id: x?.team?.id || null,

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

    gol: Number(x?.score || 0)
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
      minuto: minutoEvento(p),

      giocatore: nomeGiocatore(p),

      assist: assistGiocatore(p),

      squadra: squadraEvento(p),

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
        minuto: minutoEvento(p),

        giocatore: nomeGiocatore(p),

        squadra: squadraEvento(p),

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
        minuto: minutoEvento(p),

        entrato: ultimoCognome(
          entrato?.displayName ||
          entrato?.fullName ||
          entrato?.name ||
          entrato
        ),

        uscito: ultimoCognome(
          uscito?.displayName ||
          uscito?.fullName ||
          uscito?.name ||
          uscito
        ),

        squadra: squadraEvento(p)
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

  for (const team of data?.boxscore?.teams || []) {
    const statistiche = (team?.statistics || []).map((x) => ({
      nome: x?.name || null,
      label: x?.label || null,
      valore: x?.displayValue ?? x?.value ?? null
    }));

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
        r?.coach?.displayName ||
        r?.coaches?.[0]?.displayName ||
        null,

      titolari: [],

      riserve: []
    };

    const giocatori =
      r?.roster ||
      r?.athletes ||
      [];

    for (const p of giocatori) {
      const atleta = p?.athlete || p;

      const cognome = ultimoCognome(
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
        ruolo: ruoloItaliano(ruoloOriginale),
        ruoloESPN: ruoloOriginale,
        titolare
      };

      if (titolare) {
        formazione.titolari.push(giocatore);
      } else {
        formazione.riserve.push(giocatore);
      }
    }

    const idSquadra = r?.team?.id;

    if (idSquadra && idSquadra === home?.team?.id) {
      risultato.casa = formazione;
    }

    if (idSquadra && idSquadra === away?.team?.id) {
      risultato.trasferta = formazione;
    }
  }

  return risultato;
}


/* ============================================================
   ENDPOINT
   ============================================================ */

module.exports = async (req, res) => {
  try {

    /* --------------------------------------------------------
       PARAMETRI
       -------------------------------------------------------- */

    const id = req.query.id;

    const competizione =
      req.query.competizione ||
      "ita.1";


    /* --------------------------------------------------------
       CONTROLLO ID
       -------------------------------------------------------- */

    if (!id) {
      return res.status(400).json({
        success: false,
        errore: "Parametro id obbligatorio"
      });
    }


    /* --------------------------------------------------------
       NOME COMPETIZIONE
       -------------------------------------------------------- */

    const datiCompetizione =
      COMPETIZIONI[competizione] || {
        nome: competizione,
        paese: null
      };


    /* --------------------------------------------------------
       CHIAMATA ESPN
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
        errore: "Partita non trovata"
      });
    }


    /* --------------------------------------------------------
       SQUADRE
       -------------------------------------------------------- */

    const teams =
      competition?.competitors || [];

    const home =
      teams.find(
        (x) => x?.homeAway === "home"
      );

    const away =
      teams.find(
        (x) => x?.homeAway === "away"
      );


    /* --------------------------------------------------------
       EVENTI ESPN
       -------------------------------------------------------- */

    const plays =
      data?.plays ||
      data?.keyEvents ||
      [];


    /* --------------------------------------------------------
       STATISTICHE
       -------------------------------------------------------- */

    const statistiche =
      creaStatistiche(data);


    /* --------------------------------------------------------
       FORMAZIONI
       -------------------------------------------------------- */

    const formazioni =
      creaFormazioni(
        data,
        home,
        away
      );


    /* --------------------------------------------------------
       STADIO
       -------------------------------------------------------- */

    const venue =
      data?.gameInfo?.venue ||
      competition?.venue ||
      null;


    /* --------------------------------------------------------
       RISPOSTA
       -------------------------------------------------------- */

    return res.status(200).json({

      success: true,

      partita: {

        id:
          data?.header?.id ||
          id,

        data:
          competition?.date ||
          data?.header?.date ||
          null,

        competizione: {

          id: competizione,

          nome:
            datiCompetizione.nome,

          paese:
            datiCompetizione.paese
        },


        stato: {

          nome:
            competition?.status?.type?.name ||
            null,

          descrizione:
            competition?.status?.type?.description ||
            null,

          stato:
            competition?.status?.type?.state ||
            null,

          completata:
            competition?.status?.type?.completed ||
            false,

          minuto:
            competition?.status?.displayClock ||
            null
        },


        casa:
          datiSquadra(home),

        trasferta:
          datiSquadra(away),


        stadio:
          venue?.fullName ||
          venue?.displayName ||
          null,


        nome:
          data?.header?.competitions?.[0]?.competitors
            ? `${away?.team?.displayName || ""} at ${home?.team?.displayName || ""}`
            : null,


        link: {

          partita:
            `https://www.espn.com/soccer/match/_/gameId/${encodeURIComponent(id)}`,

          statistiche:
            `https://www.espn.com/soccer/matchstats/_/gameId/${encodeURIComponent(id)}`
        }
      },


      /* ------------------------------------------------------
         INFORMAZIONI GENERALI
         ------------------------------------------------------ */

      info: {

        arbitro:
          competition?.officials?.[0]?.displayName ||
          null,

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


      /* ------------------------------------------------------
         EVENTI PRINCIPALI
         ------------------------------------------------------ */

      marcatori:
        creaMarcatori(plays),

      cartellini:
        creaCartellini(plays),

      sostituzioni:
        creaSostituzioni(plays),


      /* ------------------------------------------------------
         STATISTICHE COMPLETE
         ------------------------------------------------------ */

      statistiche,


      /* ------------------------------------------------------
         FORMAZIONI
         ------------------------------------------------------ */

      formazioni,


      /* ------------------------------------------------------
         TUTTI GLI EVENTI ESPN
         ------------------------------------------------------ */

      eventi:
        plays.map((p) => ({

          id:
            p?.id ||
            null,

          minuto:
            minutoEvento(p),

          tipo:
            p?.type?.text ||
            p?.type?.description ||
            p?.type?.name ||
            null,

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
function tipoEventoItaliano(tipo) {
  if (!tipo) return null;

  const t = String(tipo).toLowerCase();

  if (t.includes("goal") || t.includes("gol")) return "Gol";
  if (t.includes("yellow") || t.includes("giallo")) return "Cartellino giallo";
  if (t.includes("red") || t.includes("rosso")) return "Cartellino rosso";
  if (t.includes("substitution") || t.includes("sostituzione")) return "Sostituzione";
  if (t.includes("kickoff")) return "Calcio d'inizio";
  if (t.includes("halftime")) return "Fine primo tempo";
  if (t.includes("start 2nd half")) return "Inizio secondo tempo";
  if (t.includes("end regular time")) return "Fine partita";
  if (t.includes("start delay")) return "Inizio interruzione";
  if (t.includes("end delay")) return "Fine interruzione";

  return tipo;
}
