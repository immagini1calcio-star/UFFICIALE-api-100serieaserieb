const { espnFetch } = require("../lib/espn");

/*
============================================================
API CALCIO 100%SERIEA&SERIEB
============================================================

Endpoint:

/api/partita?id=ID_PARTITA&competizione=CODICE_ESPN

Esempio:

/api/partita?id=401874758&competizione=ita.1

ESPN = unica fonte dati
============================================================
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

  "ita.fifa": {
    nome: "Nazionale Italia",
    paese: "Italia"
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
  },

  "fra.1": {
    nome: "Ligue 1",
    paese: "Francia"
  },

  "esp.1": {
    nome: "La Liga",
    paese: "Spagna"
  },

  "eng.1": {
    nome: "Premier League",
    paese: "Inghilterra"
  },

  "ksa.1": {
    nome: "Saudi Pro League",
    paese: "Arabia Saudita"
  },

  "por.1": {
    nome: "Liga Portugal",
    paese: "Portogallo"
  },

  "ned.1": {
    nome: "Eredivisie",
    paese: "Paesi Bassi"
  },

  "ger.1": {
    nome: "Bundesliga",
    paese: "Germania"
  }
};


/* ============================================================
   FINESTRE GIORNATE
============================================================ */

const FINESTRE_GIORNATE = {

  "ita.1": [
    ["2026-08-20","2026-08-25"],
    ["2026-08-27","2026-09-01"],
    ["2026-09-03","2026-09-08"],
    ["2026-09-10","2026-09-15"],
    ["2026-09-17","2026-09-22"],
    ["2026-10-08","2026-10-13"],
    ["2026-10-15","2026-10-20"],
    ["2026-10-22","2026-10-26"],
    ["2026-10-27","2026-10-30"],
    ["2026-10-31","2026-11-03"],
    ["2026-11-05","2026-11-10"],
    ["2026-11-19","2026-11-24"],
    ["2026-11-26","2026-12-01"],
    ["2026-12-03","2026-12-08"],
    ["2026-12-10","2026-12-15"],
    ["2026-12-17","2026-12-22"],
    ["2026-12-31","2027-01-05"],
    ["2027-01-06","2027-01-09"],
    ["2027-01-10","2027-01-12"],
    ["2027-01-14","2027-01-19"],
    ["2027-01-21","2027-01-26"],
    ["2027-01-28","2027-02-02"],
    ["2027-02-04","2027-02-09"],
    ["2027-02-11","2027-02-16"],
    ["2027-02-18","2027-02-23"],
    ["2027-02-25","2027-03-02"],
    ["2027-03-04","2027-03-09"],
    ["2027-03-11","2027-03-16"],
    ["2027-03-18","2027-03-23"],
    ["2027-04-01","2027-04-06"],
    ["2027-04-08","2027-04-13"],
    ["2027-04-15","2027-04-20"],
    ["2027-04-22","2027-04-27"],
    ["2027-04-29","2027-05-04"],
    ["2027-05-06","2027-05-11"],
    ["2027-05-13","2027-05-18"],
    ["2027-05-20","2027-05-25"],
    ["2027-05-27","2027-06-01"]
  ],

  "ita.2": [
    ["2026-08-20","2026-08-25"],
    ["2026-08-27","2026-09-01"],
    ["2026-09-03","2026-09-08"],
    ["2026-09-10","2026-09-15"],
    ["2026-09-16","2026-09-22"],
    ["2026-10-08","2026-10-13"],
    ["2026-10-15","2026-10-20"],
    ["2026-10-22","2026-10-26"],
    ["2026-10-27","2026-10-30"],
    ["2026-10-31","2026-11-03"],
    ["2026-11-05","2026-11-10"],
    ["2026-11-19","2026-11-23"],
    ["2026-11-24","2026-11-27"],
    ["2026-11-28","2026-12-01"],
    ["2026-12-03","2026-12-07"],
    ["2026-12-08","2026-12-11"],
    ["2026-12-12","2026-12-15"],
    ["2026-12-17","2026-12-22"],
    ["2026-12-24","2026-12-29"],
    ["2027-01-07","2027-01-12"],
    ["2027-01-14","2027-01-19"],
    ["2027-01-21","2027-01-26"],
    ["2027-01-28","2027-02-02"],
    ["2027-02-04","2027-02-09"],
    ["2027-02-11","2027-02-16"],
    ["2027-02-18","2027-02-23"],
    ["2027-02-25","2027-03-01"],
    ["2027-03-02","2027-03-05"],
    ["2027-03-06","2027-03-09"],
    ["2027-03-11","2027-03-16"],
    ["2027-03-18","2027-03-23"],
    ["2027-04-01","2027-04-06"],
    ["2027-04-08","2027-04-13"],
    ["2027-04-15","2027-04-20"],
    ["2027-04-22","2027-04-27"],
    ["2027-04-29","2027-05-04"],
    ["2027-05-06","2027-05-11"],
    ["2027-05-13","2027-05-18"]
  ],

  "fra.1": [
    ["2026-08-20","2026-08-25"],
    ["2026-08-27","2026-09-01"],
    ["2026-09-03","2026-09-08"],
    ["2026-09-10","2026-09-15"],
    ["2026-09-17","2026-09-22"],
    ["2026-10-08","2026-10-13"],
    ["2026-10-15","2026-10-20"],
    ["2026-10-22","2026-10-27"],
    ["2026-10-29","2026-11-03"],
    ["2026-11-05","2026-11-10"],
    ["2026-11-19","2026-11-24"],
    ["2026-11-26","2026-12-01"],
    ["2026-12-03","2026-12-08"],
    ["2026-12-10","2026-12-15"],
    ["2026-12-31","2027-01-05"],
    ["2027-01-14","2027-01-19"],
    ["2027-01-21","2027-01-26"],
    ["2027-01-28","2027-02-02"],
    ["2027-02-04","2027-02-09"],
    ["2027-02-11","2027-02-16"],
    ["2027-02-18","2027-02-23"],
    ["2027-02-25","2027-03-02"],
    ["2027-03-04","2027-03-09"],
    ["2027-03-11","2027-03-16"],
    ["2027-03-18","2027-03-23"],
    ["2027-04-01","2027-04-06"],
    ["2027-04-08","2027-04-13"],
    ["2027-04-15","2027-04-20"],
    ["2027-04-22","2027-04-27"],
    ["2027-04-29","2027-05-04"],
    ["2027-05-06","2027-05-11"],
    ["2027-05-13","2027-05-18"],
    ["2027-05-20","2027-05-25"],
    ["2027-05-27","2027-05-31"]
  ],

  "eng.1": [
    ["2026-08-20","2026-08-25"],
    ["2026-08-27","2026-09-01"],
    ["2026-09-03","2026-09-08"],
    ["2026-09-10","2026-09-15"],
    ["2026-09-17","2026-09-22"],
    ["2026-10-08","2026-10-13"],
    ["2026-10-15","2026-10-20"],
    ["2026-10-22","2026-10-27"],
    ["2026-10-29","2026-11-03"],
    ["2026-11-05","2026-11-10"],
    ["2026-11-19","2026-11-24"],
    ["2026-11-26","2026-12-01"],
    ["2026-12-01","2026-12-04"],
    ["2026-12-05","2026-12-08"],
    ["2026-12-10","2026-12-15"],
    ["2026-12-17","2026-12-22"],
    ["2026-12-24","2026-12-28"],
    ["2026-12-29","2027-01-01"],
    ["2027-01-01","2027-01-04"],
    ["2027-01-05","2027-01-08"],
    ["2027-01-16","2027-01-19"],
    ["2027-01-21","2027-01-26"],
    ["2027-01-28","2027-02-02"],
    ["2027-02-04","2027-02-09"],
    ["2027-02-09","2027-02-12"],
    ["2027-02-20","2027-02-23"],
    ["2027-02-25","2027-03-02"],
    ["2027-03-02","2027-03-05"],
    ["2027-03-11","2027-03-16"],
    ["2027-03-18","2027-03-23"],
    ["2027-04-08","2027-04-13"],
    ["2027-04-15","2027-04-20"],
    ["2027-04-22","2027-04-27"],
    ["2027-04-29","2027-05-04"],
    ["2027-05-06","2027-05-11"],
    ["2027-05-13","2027-05-18"],
    ["2027-05-20","2027-05-25"],
    ["2027-05-27","2027-05-30"]
  ],

  "esp.1": [
    ["2026-08-13","2026-08-27"],
    ["2026-08-20","2026-08-25"],
    ["2026-08-27","2026-09-01"],
    ["2026-09-03","2026-09-08"],
    ["2026-09-11","2026-09-14"],
    ["2026-09-15","2026-09-18"],
    ["2026-09-19","2026-09-22"],
    ["2026-10-09","2026-10-13"],
    ["2026-10-16","2026-10-20"],
    ["2026-10-23","2026-10-27"],
    ["2026-10-30","2026-11-03"],
    ["2026-11-06","2026-11-10"],
    ["2026-11-19","2026-11-24"],
    ["2026-11-26","2026-12-01"],
    ["2026-12-03","2026-12-08"],
    ["2026-12-10","2026-12-15"],
    ["2026-12-17","2026-12-22"],
    ["2026-12-31","2027-01-05"],
    ["2027-01-07","2027-01-12"],
    ["2027-01-14","2027-01-19"],
    ["2027-01-21","2027-01-26"],
    ["2027-01-28","2027-02-02"],
    ["2027-02-04","2027-02-09"],
    ["2027-02-11","2027-02-16"],
    ["2027-02-18","2027-02-23"],
    ["2027-02-25","2027-03-02"],
    ["2027-03-04","2027-03-09"],
    ["2027-03-11","2027-03-16"],
    ["2027-03-18","2027-03-23"],
    ["2027-04-01","2027-04-06"],
    ["2027-04-08","2027-04-13"],
    ["2027-04-15","2027-04-20"],
    ["2027-04-22","2027-04-27"],
    ["2027-04-29","2027-05-04"],
    ["2027-05-06","2027-05-11"],
    ["2027-05-13","2027-05-18"],
    ["2027-05-20","2027-05-25"],
    ["2027-05-27","2027-05-31"]
  ],

  "ger.1": [
    ["2026-08-27","2026-09-01"],
    ["2026-09-03","2026-09-08"],
    ["2026-09-10","2026-09-15"],
    ["2026-09-17","2026-09-22"],
    ["2026-10-08","2026-10-13"],
    ["2026-10-15","2026-10-20"],
    ["2026-10-22","2026-10-27"],
    ["2026-10-29","2026-11-03"],
    ["2026-11-05","2026-11-10"],
    ["2026-11-19","2026-11-24"],
    ["2026-11-26","2026-12-01"],
    ["2026-12-03","2026-12-08"],
    ["2026-12-10","2026-12-15"],
    ["2026-12-17","2026-12-22"],
    ["2027-01-07","2027-01-11"],
    ["2027-01-12","2027-01-15"],
    ["2027-01-16","2027-01-19"],
    ["2027-01-21","2027-01-26"],
    ["2027-01-28","2027-02-02"],
    ["2027-02-04","2027-02-09"],
    ["2027-02-11","2027-02-16"],
    ["2027-02-18","2027-02-23"],
    ["2027-02-25","2027-03-02"],
    ["2027-03-02","2027-03-05"],
    ["2027-03-06","2027-03-09"],
    ["2027-03-11","2027-03-16"],
    ["2027-03-18","2027-03-23"],
    ["2027-04-01","2027-04-06"],
    ["2027-04-08","2027-04-13"],
    ["2027-04-15","2027-04-20"],
    ["2027-04-22","2027-04-27"],
    ["2027-05-06","2027-05-11"],
    ["2027-05-13","2027-05-18"],
    ["2027-05-20","2027-05-25"]
  ],

  "por.1": [
    ["2026-08-06","2026-08-11"],
    ["2026-08-13","2026-08-18"],
    ["2026-08-20","2026-08-25"],
    ["2026-08-27","2026-09-01"],
    ["2026-09-03","2026-09-08"],
    ["2026-09-10","2026-09-15"],
    ["2026-09-17","2026-09-22"],
    ["2026-10-08","2026-10-13"],
    ["2026-10-22","2026-10-27"],
    ["2026-10-29","2026-11-03"],
    ["2026-11-05","2026-11-10"],
    ["2026-11-26","2026-12-01"],
    ["2026-12-03","2026-12-08"],
    ["2026-12-10","2026-12-15"],
    ["2026-12-17","2026-12-22"],
    ["2026-12-24","2026-12-29"],
    ["2027-01-07","2027-01-12"],
    ["2027-01-14","2027-01-19"],
    ["2027-01-21","2027-01-26"],
    ["2027-01-28","2027-02-02"],
    ["2027-02-04","2027-02-09"],
    ["2027-02-11","2027-02-16"],
    ["2027-02-18","2027-02-23"],
    ["2027-02-25","2027-03-02"],
    ["2027-03-04","2027-03-09"],
    ["2027-03-11","2027-03-16"],
    ["2027-03-18","2027-03-23"],
    ["2027-04-01","2027-04-06"],
    ["2027-04-09","2027-04-12"],
    ["2027-04-16","2027-04-19"],
    ["2027-04-22","2027-04-27"],
    ["2027-04-29","2027-05-04"],
    ["2027-05-06","2027-05-11"],
    ["2027-05-13","2027-05-18"]
  ],

  "ned.1": [
    ["2026-08-06","2026-08-11"],
    ["2026-08-13","2026-08-18"],
    ["2026-08-20","2026-08-25"],
    ["2026-08-27","2026-09-01"],
    ["2026-09-03","2026-09-08"],
    ["2026-09-10","2026-09-15"],
    ["2026-09-17","2026-09-22"],
    ["2026-10-08","2026-10-13"],
    ["2026-10-15","2026-10-20"],
    ["2026-10-22","2026-10-27"],
    ["2026-10-29","2026-11-03"],
    ["2026-11-05","2026-11-10"],
    ["2026-11-19","2026-11-24"],
    ["2026-11-26","2026-12-01"],
    ["2026-12-03","2026-12-08"],
    ["2026-12-10","2026-12-15"],
    ["2026-12-17","2026-12-22"],
    ["2027-01-07","2027-01-12"],
    ["2027-01-14","2027-01-19"],
    ["2027-01-21","2027-01-26"],
    ["2027-01-28","2027-02-02"],
    ["2027-02-11","2027-02-16"],
    ["2027-02-18","2027-02-23"],
    ["2027-02-25","2027-03-02"],
    ["2027-03-04","2027-03-09"],
    ["2027-03-11","2027-03-16"],
    ["2027-03-18","2027-03-23"],
    ["2027-04-01","2027-04-06"],
    ["2027-04-08","2027-04-13"],
    ["2027-04-22","2027-04-27"],
    ["2027-04-29","2027-05-04"],
    ["2027-05-06","2027-05-11"],
    ["2027-05-13","2027-05-18"],
    ["2027-05-20","2027-05-25"]
  ],

  "uefa.champions": [
    ["2026-09-08","2026-09-11"],
    ["2026-10-13","2026-10-16"],
    ["2026-10-20","2026-10-23"],
    ["2026-11-03","2026-11-06"],
    ["2026-11-24","2026-11-27"],
    ["2026-12-08","2026-12-11"],
    ["2027-01-19","2027-01-22"],
    ["2027-01-27","2027-01-30"]
  ],

  "uefa.europa": [
    ["2026-09-15","2026-09-18"],
    ["2026-10-13","2026-10-16"],
    ["2026-10-20","2026-10-23"],
    ["2026-11-03","2026-11-06"],
    ["2026-11-24","2026-11-27"],
    ["2026-12-08","2026-12-11"],
    ["2027-01-19","2027-01-22"],
    ["2027-01-27","2027-01-30"]
  ],

  "uefa.europa.conf": [
    ["2026-10-13","2026-10-16"],
    ["2026-10-20","2026-10-23"],
    ["2026-11-03","2026-11-06"],
    ["2026-11-24","2026-11-27"],
    ["2026-12-08","2026-12-11"],
    ["2026-12-15","2026-12-18"]
  ],

  "ksa.1": [
    ["2026-08-13","2026-08-18"],
    ["2026-08-20","2026-08-25"],
    ["2026-08-27","2026-09-01"],
    ["2026-09-03","2026-09-08"],
    ["2026-09-10","2026-09-15"],
    ["2026-09-17","2026-09-22"],
    ["2026-09-24","2026-09-29"],
    ["2026-10-09","2026-10-11"],
    ["2026-10-15","2026-10-17"],
    ["2026-10-18","2026-10-20"],
    ["2026-10-23","2026-10-27"],
    ["2026-10-29","2026-11-03"],
    ["2026-11-05","2026-11-10"],
    ["2026-11-19","2026-11-24"],
    ["2026-11-26","2026-12-01"],
    ["2026-12-03","2026-12-08"],
    ["2026-12-10","2026-12-15"],
    ["2026-12-17","2026-12-22"],
    ["2026-12-24","2026-12-29"],
    ["2027-02-04","2027-02-09"],
    ["2027-02-11","2027-02-16"],
    ["2027-02-25","2027-03-02"],
    ["2027-03-04","2027-03-09"],
    ["2027-03-11","2027-03-16"],
    ["2027-03-18","2027-03-23"],
    ["2027-04-01","2027-04-06"],
    ["2027-04-08","2027-04-13"],
    ["2027-04-15","2027-04-20"],
    ["2027-04-22","2027-04-27"],
    ["2027-04-29","2027-05-04"],
    ["2027-05-06","2027-05-11"],
    ["2027-05-13","2027-05-18"],
    ["2027-05-27","2027-05-29"]
  ]
};


/* ============================================================
   CREA LE ETICHETTE DELLE GIORNATE
============================================================ */

for (const codice of Object.keys(FINESTRE_GIORNATE)) {

  FINESTRE_GIORNATE[codice] =
    FINESTRE_GIORNATE[codice].map(
      function (x, i) {

        return {
          inizio: x[0],
          fine: x[1],
          faseTurno: "Giornata " + (i + 1)
        };

      }
    );

}


/* ============================================================
   FUNZIONI GENERALI
============================================================ */

function ultimoCognome(nome) {

  if (!nome) return null;

  const testo =
    String(nome)
      .trim()
      .replace(/\s+/g, " ");

  if (!testo) return null;

  const parti = testo.split(" ");

  return parti[parti.length - 1];

}


function nomeCompletoAtleta(atleta) {

  if (!atleta) return "";

  return (
    atleta.displayName ||
    atleta.fullName ||
    atleta.shortName ||
    atleta.name ||
    atleta.longName ||
    ""
  );

}


function dataISO(valore) {

  if (!valore) return null;

  const testo =
    String(valore).trim();

  if (!testo) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(testo)) {
    return testo;
  }

  const data =
    new Date(testo);

  if (isNaN(data.getTime())) {
    return null;
  }

  return (
    data.getUTCFullYear() +
    "-" +
    String(data.getUTCMonth() + 1).padStart(2, "0") +
    "-" +
    String(data.getUTCDate()).padStart(2, "0")
  );

}


function faseDaFinestra(
  competizione,
  valoreData
) {

  const data = dataISO(valoreData);

  if (!data) return null;

  const finestre =
    FINESTRE_GIORNATE[
      competizione
    ];

  if (!Array.isArray(finestre)) {
    return null;
  }

  for (const finestra of finestre) {

    if (
      data >= finestra.inizio &&
      data <= finestra.fine
    ) {

      return finestra.faseTurno;

    }

  }

  return null;

}


function convertiDataOraItaliana(
  valore
) {

  if (!valore) {

    return {
      data: null,
      ora: null
    };

  }

  const d =
    new Date(valore);

  if (isNaN(d.getTime())) {

    return {
      data: null,
      ora: null
    };

  }

  const giorno =
    String(
      new Intl.DateTimeFormat(
        "it-IT",
        {
          timeZone: "Europe/Rome",
          day: "2-digit"
        }
      ).format(d)
    );

  const mese =
    String(
      new Intl.DateTimeFormat(
        "it-IT",
        {
          timeZone: "Europe/Rome",
          month: "2-digit"
        }
      ).format(d)
    );

  const anno =
    String(
      new Intl.DateTimeFormat(
        "it-IT",
        {
          timeZone: "Europe/Rome",
          year: "numeric"
        }
      ).format(d)
    );

  const ora =
    new Intl.DateTimeFormat(
      "it-IT",
      {
        timeZone: "Europe/Rome",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }
    ).format(d);

  return {
    data:
      giorno +
      "/" +
      mese +
      "/" +
      anno,

    ora
  };

}


/* ============================================================
   SQUADRE
============================================================ */

function datiSquadra(
  competitor
) {

  if (!competitor) {
    return null;
  }

  const team =
    competitor.team ||
    {};

  return {

    id:
      team.id ||
      null,

    nome:
      nomeSquadraItaliano(
        team.displayName ||
        team.name ||
        ""
      ),

    nomeESPN:
      team.displayName ||
      team.name ||
      null,

    abbreviazione:
      team.abbreviation ||
      null,

    logo:
      team.logo ||
      null,

    punteggio:
      competitor.score ??
      0,

    vincitore:
      competitor.winner === true

  };

}


function nomeSquadraItaliano(
  nome
) {

  if (!nome) return null;

  const testo =
    String(nome).trim();

  const mappa = {

    "Athletic Club":
      "Atletico Bilbao",

    "Internazionale":
      "Inter",

    "Inter Milan":
      "Inter",

    "Al Riyadh":
      "Riyadh",

    "AC Milan":
      "Milan",

    "Como 1907":
      "Como",

    "Hellas Verona":
      "Hellas Verona",

    "Paris Saint-Germain":
      "PSG",

    "Paris Saint-Germain FC":
      "PSG"

  };

  return (
    mappa[testo] ||
    testo
  );

}


/* ============================================================
   STATO
============================================================ */

function traduciStato(
  status
) {

  if (!status) {
    return "Non disponibile";
  }

  const tipo =
    String(
      status.type ||
      status.name ||
      status.state ||
      ""
    ).toLowerCase();

  if (
    tipo.includes("post") ||
    tipo.includes("final") ||
    tipo.includes("closed")
  ) {
    return "Finita";
  }

  if (
    tipo.includes("in") ||
    tipo.includes("live")
  ) {
    return "In corso";
  }

  if (
    tipo.includes("pre") ||
    tipo.includes("scheduled")
  ) {
    return "Programmata";
  }

  if (
    tipo.includes("cancel")
  ) {
    return "Annullata";
  }

  if (
    tipo.includes("postpon")
  ) {
    return "Rinviata";
  }

  return (
    status.description ||
    status.detail ||
    status.shortDetail ||
    status.name ||
    "Non disponibile"
  );

}


/* ============================================================
   EVENTI
============================================================ */

function tipoEvento(p) {

  return String(
    p?.type?.text ||
    p?.type?.name ||
    p?.type?.id ||
    p?.text ||
    p?.description ||
    ""
  ).toLowerCase();

}


function nomeGiocatore(p) {

  const atleta =
    p?.athlete ||
    p?.player ||
    p?.scoringPlayer ||
    p?.participants?.[0]?.athlete ||
    null;

  if (atleta) {

    return ultimoCognome(
      nomeCompletoAtleta(atleta)
    );

  }

  return ultimoCognome(
    p?.player?.displayName ||
    p?.playerName ||
    p?.athleteName ||
    ""
  );

}


function assistGiocatore(p) {

  const assist =
    p?.assist ||
    p?.assistPlayer ||
    p?.participants?.find(
      x =>
        x?.role === "assist" ||
        x?.type === "assist"
    )?.athlete;

  if (!assist) {
    return null;
  }

  return ultimoCognome(
    nomeCompletoAtleta(assist)
  );

}


function minutoEvento(p) {

  if (!p) return null;

  if (
    p?.clock?.displayValue
  ) {
    return p.clock.displayValue;
  }

  if (
    p?.displayClock
  ) {
    return p.displayClock;
  }

  if (
    p?.clock?.value !== undefined
  ) {

    const secondi =
      Number(p.clock.value);

    if (!isNaN(secondi)) {

      const minuti =
        Math.floor(secondi / 60);

      const secondiRimasti =
        secondi % 60;

      return (
        minuti +
        ":" +
        String(secondiRimasti)
          .padStart(2, "0")
      );

    }

  }

  return (
    p?.minute ||
    p?.period?.displayValue ||
    null
  );

}


function squadraEvento(p) {

  const team =
    p?.team ||
    p?.competitor ||
    p?.scoringTeam ||
    null;

  if (!team) {
    return null;
  }

  return nomeSquadraItaliano(
    team.displayName ||
    team.name ||
    team.team?.displayName ||
    team.team?.name ||
    ""
  );

}


function traduciEvento(tipo) {

  const t =
    String(tipo || "")
      .toLowerCase();

  if (
    t.includes("goal") ||
    t.includes("score") ||
    t.includes("gol")
  ) {
    return "Gol";
  }

  if (
    t.includes("yellow")
  ) {
    return "Cartellino giallo";
  }

  if (
    t.includes("red")
  ) {
    return "Cartellino rosso";
  }

  if (
    t.includes("substitution") ||
    t.includes("sub")
  ) {
    return "Sostituzione";
  }

  if (
    t.includes("penalty")
  ) {
    return "Rigore";
  }

  if (
    t.includes("var")
  ) {
    return "VAR";
  }

  return tipo || "Evento";

}


/* ============================================================
   MARCATORI
============================================================ */

function creaMarcatori(
  plays
) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays
    .filter(function (p) {

      return (
        p?.scoringPlay === true ||
        p?.isScoringPlay === true ||
        tipoEvento(p).includes("goal") ||
        tipoEvento(p).includes("gol") ||
        tipoEvento(p).includes("score")
      );

    })
    .map(function (p) {

      return {

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
          p?.isOwnGoal === true ||
          tipoEvento(p).includes("own goal")

      };

    });

}


/* ============================================================
   CARTELLINI
============================================================ */

function creaCartellini(
  plays
) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays
    .filter(function (p) {

      const tipo =
        tipoEvento(p);

      const testo =
        String(
          p?.text ||
          p?.description ||
          ""
        ).toLowerCase();

      return (
        tipo.includes("yellow") ||
        tipo.includes("red") ||
        tipo.includes("card") ||
        testo.includes("yellow card") ||
        testo.includes("red card")
      );

    })
    .map(function (p) {

      let cartellino =
        "Cartellino";

      const tipo =
        (
          tipoEvento(p) +
          " " +
          String(
            p?.text ||
            p?.description ||
            ""
          ).toLowerCase()
        );

      if (
        tipo.includes("yellow")
      ) {
        cartellino =
          "Giallo";
      }

      if (
        tipo.includes("red")
      ) {
        cartellino =
          "Rosso";
      }

      return {

        minuto:
          minutoEvento(p),

        giocatore:
          nomeGiocatore(p),

        squadra:
          squadraEvento(p),

        tipo:
          cartellino

      };

    });

}


/* ============================================================
   SOSTITUZIONI
============================================================ */

function creaSostituzioni(
  plays
) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays
    .filter(function (p) {

      const tipo =
        tipoEvento(p);

      const testo =
        String(
          p?.text ||
          p?.description ||
          ""
        ).toLowerCase();

      return (
        tipo.includes("substitution") ||
        tipo.includes("sub") ||
        testo.includes("substitution") ||
        testo.includes("sostituzione")
      );

    })
    .map(function (p) {

      const partecipanti =
        Array.isArray(
          p?.participants
        )
          ? p.participants
          : [];

      let entrato = null;
      let uscito = null;

      for (
        const partecipante
        of partecipanti
      ) {

        const atleta =
          partecipante?.athlete ||
          partecipante?.player ||
          partecipante;

        const nome =
          ultimoCognome(
            nomeCompletoAtleta(
              atleta
            )
          );

        if (!nome) continue;

        const ruolo =
          String(
            partecipante?.role ||
            partecipante?.type ||
            partecipante?.substitutionType ||
            ""
          ).toLowerCase();

        if (
          ruolo.includes("in") ||
          ruolo.includes("enter") ||
          ruolo.includes("on")
        ) {
          entrato = nome;
        }

        if (
          ruolo.includes("out") ||
          ruolo.includes("exit") ||
          ruolo.includes("off")
        ) {
          uscito = nome;
        }

      }

      /* Fallback dal testo ESPN */
      if (
        !entrato ||
        !uscito
      ) {

        const testo =
          String(
            p?.text ||
            p?.description ||
            ""
          );

        const match =
          testo.match(
            /(?:for|al posto di|replace[sd]?)\s+([A-Za-zÀ-ÿ' -]+)$/i
          );

        if (
          match &&
          !uscito
        ) {
          uscito =
            ultimoCognome(
              match[1]
            );
        }

      }

      return {

        minuto:
          minutoEvento(p),

        entrato:
          entrato,

        uscito:
          uscito,

        squadra:
          squadraEvento(p)

      };

    });

}


/* ============================================================
   ARBITRI
============================================================ */

function creaArbitri(
  data,
  competition
) {

  const risultati = [];

  const fonti = [

    data?.gameInfo?.officials,

    competition?.officials,

    data?.officials,

    data?.header?.competitions?.[0]?.officials

  ];

  function aggiungi(
    elemento
  ) {

    if (!elemento) return;

    const persona =
      elemento?.athlete ||
      elemento?.official ||
      elemento;

    const nome =
      persona?.displayName ||
      persona?.fullName ||
      persona?.name ||
      "";

    if (!nome) return;

    const chave =
      nome.toLowerCase();

    if (
      risultati.some(
        x =>
          x.nome.toLowerCase() ===
          chave
      )
    ) {
      return;
    }

    risultati.push({

      nome:
        nome,

      cognome:
        ultimoCognome(nome),

      ruolo:
        elemento?.position?.displayName ||
        elemento?.role ||
        elemento?.type?.displayName ||
        elemento?.type?.text ||
        null

    });

  }

  for (
    const fonte of fonti
  ) {

    if (
      Array.isArray(fonte)
    ) {

      fonte.forEach(
        aggiungi
      );

    }

  }

  return risultati;

}


/* ============================================================
   STATISTICHE
============================================================ */

function trovaStatistica(
  lista,
  nomi
) {

  if (!Array.isArray(lista)) {
    return null;
  }

  for (
    const stat
    of lista
  ) {

    const nome =
      String(
        stat?.name ||
        ""
      ).toLowerCase();

    const label =
      String(
        stat?.label ||
        ""
      ).toLowerCase();

    if (
      nomi.some(
        x => {

          const n =
            String(x)
              .toLowerCase();

          return (
            nome === n ||
            label === n ||
            nome.includes(n) ||
            label.includes(n)
          );

        }
      )
    ) {

      return (
        stat?.displayValue ??
        stat?.value ??
        null
      );

    }

  }

  return null;

}


function creaStatistiche(
  data
) {

  const risultato = {

    casa: [],
    trasferta: [],

    valori: {

      possessoCasa: null,
      possessoTrasferta: null,

      tiriCasa: null,
      tiriTrasferta: null,

      tiriInPortaCasa: null,
      tiriInPortaTrasferta: null,

      calciDangoloCasa: null,
      calciDangoloTrasferta: null,

      passaggiCasa: null,
      passaggiTrasferta: null,

      fuorigiocoCasa: null,
      fuorigiocoTrasferta: null

    }

  };

  const teams =
    data?.boxscore?.teams ||
    [];

  if (!Array.isArray(teams)) {
    return risultato;
  }

  for (
    const team
    of teams
  ) {

    const lista =
      Array.isArray(
        team?.statistics
      )
        ? team.statistics
        : [];

    const statistiche =
      lista.map(
        function (x) {

          return {

            nome:
              x?.name ||
              null,

            label:
              x?.label ||
              null,

            valore:
              x?.displayValue ??
              x?.value ??
              null

          };

        }
      );

    const valori = {

      possesso:
        trovaStatistica(
          lista,
          [
            "possessionPct",
            "possessionPercentage",
            "possessionPercent",
            "possession",
            "ballPossession",
            "possesso"
          ]
        ),

      tiri:
        trovaStatistica(
          lista,
          [
            "totalShots",
            "shots",
            "shotsTotal",
            "totalShotsTaken",
            "shotAttempts",
            "tiri"
          ]
        ),

      tiriInPorta:
        trovaStatistica(
          lista,
          [
            "shotsOnTarget",
            "shotsOnGoal",
            "shotsOnTargetTotal",
            "shotsOnGoalTotal",
            "onTarget",
            "tiriInPorta"
          ]
        ),

      angoli:
        trovaStatistica(
          lista,
          [
            "corners",
            "cornerKicks",
            "totalCorners",
            "wonCorners",
            "calciDangolo"
          ]
        ),

      passaggi:
        trovaStatistica(
          lista,
          [
            "passes",
            "totalPasses",
            "completedPasses",
            "totalPass",
            "passaggi"
          ]
        ),

      fuorigioco:
        trovaStatistica(
          lista,
          [
            "offsides",
            "offside",
            "fuorigioco"
          ]
        )

    };

    if (
      team?.homeAway === "home"
    ) {

      risultato.casa =
        statistiche;

      risultato.valori.possessoCasa =
        valori.possesso;

      risultato.valori.tiriCasa =
        valori.tiri;

      risultato.valori.tiriInPortaCasa =
        valori.tiriInPorta;

      risultato.valori.calciDangoloCasa =
        valori.angoli;

      risultato.valori.passaggiCasa =
        valori.passaggi;

      risultato.valori.fuorigiocoCasa =
        valori.fuorigioco;

    }

    if (
      team?.homeAway === "away"
    ) {

      risultato.trasferta =
        statistiche;

      risultato.valori.possessoTrasferta =
        valori.possesso;

      risultato.valori.tiriTrasferta =
        valori.tiri;

      risultato.valori.tiriInPortaTrasferta =
        valori.tiriInPorta;

      risultato.valori.calciDangoloTrasferta =
        valori.angoli;

      risultato.valori.passaggiTrasferta =
        valori.passaggi;

      risultato.valori.fuorigiocoTrasferta =
        valori.fuorigioco;

    }

  }

  return risultato;

}


/* ============================================================
   RUOLI
============================================================ */

function ruoloItaliano(
  ruolo
) {

  if (!ruolo) {
    return null;
  }

  const r =
    String(ruolo)
      .toUpperCase()
      .trim();

  const mappa = {

    G: "Portiere",
    GK: "Portiere",
    GOALKEEPER: "Portiere",

    CB: "Difensore",
    DC: "Difensore",
    CD: "Difensore",
    "CD-L": "Difensore",
    "CD-R": "Difensore",

    LB: "Difensore",
    RB: "Difensore",

    LWB: "Difensore",
    RWB: "Difensore",

    LCB: "Difensore",
    RCB: "Difensore",

    DM: "Centrocampista",
    CDM: "Centrocampista",

    CM: "Centrocampista",
    "CM-L": "Centrocampista",
    "CM-R": "Centrocampista",

    LM: "Centrocampista",
    RM: "Centrocampista",

    AM: "Centrocampista",
    CAM: "Centrocampista",

    LCM: "Centrocampista",
    RCM: "Centrocampista",

    LW: "Attaccante",
    RW: "Attaccante",

    CF: "Attaccante",
    "CF-L": "Attaccante",
    "CF-R": "Attaccante",

    ST: "Attaccante",
    FW: "Attaccante",
    CF: "Attaccante",

    SUB: "Riserva"

  };

  return (
    mappa[r] ||
    ruolo
  );

}


/* ============================================================
   NORMALIZZAZIONE RUOLO
============================================================ */

function normalizzaRuolo(
  ruolo
) {

  if (!ruolo) {
    return null;
  }

  const r =
    String(ruolo)
      .toLowerCase()
      .trim();

  if (
    r.includes("goalkeeper") ||
    r.includes("portier")
  ) {
    return "Portiere";
  }

  if (
    r.includes("defender") ||
    r.includes("difensor")
  ) {
    return "Difensore";
  }

  if (
    r.includes("midfielder") ||
    r.includes("centrocamp")
  ) {
    return "Centrocampista";
  }

  if (
    r.includes("forward") ||
    r.includes("attacc") ||
    r.includes("striker")
  ) {
    return "Attaccante";
  }

  return ruoloItaliano(ruolo);

}


/* ============================================================
   MODULO -> STRUTTURA RUOLI
============================================================ */

function strutturaModulo(
  modulo
) {

  if (!modulo) {
    return null;
  }

  const m =
    String(modulo)
      .trim()
      .replace(/\s+/g, "");

  const map = {

    "4-3-3": {
      difensori: 4,
      centrocampisti: 3,
      attaccanti: 3
    },

    "4-2-3-1": {
      difensori: 4,
      centrocampisti: 5,
      attaccanti: 1
    },

    "4-3-2-1": {
      difensori: 4,
      centrocampisti: 5,
      attaccanti: 1
    },

    "4-4-2": {
      difensori: 4,
      centrocampisti: 4,
      attaccanti: 2
    },

    "4-4-1-1": {
      difensori: 4,
      centrocampisti: 5,
      attaccanti: 1
    },

    "4-1-4-1": {
      difensori: 4,
      centrocampisti: 5,
      attaccanti: 1
    },

    "4-1-3-2": {
      difensori: 4,
      centrocampisti: 4,
      attaccanti: 2
    },

    "3-4-3": {
      difensori: 3,
      centrocampisti: 4,
      attaccanti: 3
    },

    "3-4-2-1": {
      difensori: 3,
      centrocampisti: 6,
      attaccanti: 1
    },

    "3-5-2": {
      difensori: 3,
      centrocampisti: 5,
      attaccanti: 2
    },

    "3-4-1-2": {
      difensori: 3,
      centrocampisti: 5,
      attaccanti: 2
    },

    "5-3-2": {
      difensori: 5,
      centrocampisti: 3,
      attaccanti: 2
    },

    "5-4-1": {
      difensori: 5,
      centrocampisti: 4,
      attaccanti: 1
    },

    "5-2-3": {
      difensori: 5,
      centrocampisti: 2,
      attaccanti: 3
    }

  };

  return map[m] || null;

      }

/* ============================================================
   CONTINUA PARTE 2/2
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

  if (!Array.isArray(rosters)) {
    return risultato;
  }

  for (const r of rosters) {

    const idSquadra =
      r?.team?.id ||
      r?.teamId ||
      r?.competitor?.id ||
      null;

    if (!idSquadra) continue;

    const modulo =
      estraiModuloFormazione(r);

    const formazione = {

      modulo:
        modulo,

      moduloESPN:
        modulo,

      allenatore:
        estraiAllenatoreFormazione(
          r,
          data,
          idSquadra
        ),

      titolari: [],

      riserve: []
    };

    const giocatori =
      r?.roster ||
      r?.athletes ||
      r?.players ||
      [];

    if (!Array.isArray(giocatori)) {
      continue;
    }

    const visti = new Set();

    for (const p of giocatori) {

      const atleta =
        p?.athlete ||
        p?.player ||
        p;

      const nomeCompleto =
        nomeCompletoAtleta(atleta);

      const cognome =
        ultimoCognome(nomeCompleto);

      if (!cognome) continue;

      const chiave =
        chiaveGiocatore(
          p,
          atleta
        );

      if (visti.has(chiave)) {
        continue;
      }

      visti.add(chiave);

      const numero =
        p?.jersey ??
        atleta?.jersey ??
        null;

      const titolare =
        p?.starter === true ||
        p?.lineupStatus === "starter" ||
        p?.status === "starter" ||
        p?.status?.type === "starter";

      const ruolo =
        ruoloConModulo(
          p,
          atleta,
          modulo,
          titolare
        );

      const giocatore = {

        cognome:

          cognome,

        numero:

          numero,

        ruolo:

          ruolo.ruolo,

        ruoloESPN:

          ruolo.ruoloESPN,

        titolare:

          titolare

      };

      if (titolare) {

        formazione.titolari.push(
          giocatore
        );

      } else {

        giocatore.ruolo =
          giocatore.ruolo ||
          "Riserva";

        formazione.riserve.push(
          giocatore
        );
      }
    }

    /*
     * Correzione ruoli:
     *
     * il modulo ESPN viene utilizzato come
     * controllo sulla distribuzione delle linee.
     */
    formazione.titolari =
      riequilibraRuoliDaModulo(
        formazione.titolari,
        modulo
      );

    /*
     * Seconda deduplicazione di sicurezza.
     */
    formazione.titolari =
      deduplicaGiocatori(
        formazione.titolari
      );

    formazione.riserve =
      deduplicaGiocatori(
        formazione.riserve
      );

    /*
     * Se ESPN restituisce lo stesso giocatore
     * sia tra i titolari che tra le riserve,
     * il titolare ha la precedenza.
     */
    const titolariChiavi =
      new Set(
        formazione.titolari.map(
          function (g) {
            return (
              normalizzaPosizioneTesto(
                g?.cognome || ""
              )
            );
          }
        )
      );

    formazione.riserve =
      formazione.riserve.filter(
        function (g) {

          const chiave =
            normalizzaPosizioneTesto(
              g?.cognome || ""
            );

          return !titolariChiavi.has(
            chiave
          );
        }
      );

    const idHome =
      home?.team?.id;

    const idAway =
      away?.team?.id;

    if (
      idHome &&
      String(idSquadra) ===
      String(idHome)
    ) {

      risultato.casa =
        formazione;

    } else if (
      idAway &&
      String(idSquadra) ===
      String(idAway)
    ) {

      risultato.trasferta =
        formazione;
    }
  }

  return risultato;
}


/* ============================================================
   CRONACA
   ============================================================ */

function eventoCronacaUtile(p) {

  if (!p) return false;

  const testo =
    String(
      p?.text ||
      p?.description ||
      p?.shortText ||
      p?.type?.text ||
      ""
    ).trim();

  const tipo =
    normalizzaPosizioneTesto(
      tipoEvento(p)
    );

  const testoNorm =
    normalizzaPosizioneTesto(
      testo
    );

  /*
   * Eventi tecnici che non devono comparire
   * nella cronaca.
   */
  const esclusi = [

    "KICKOFF",
    "START OF MATCH",
    "MATCH START",
    "GAME START",

    "END OF MATCH",
    "MATCH END",
    "GAME END",

    "HALFTIME",
    "HALF TIME",
    "INTERMISSION",

    "PERIOD START",
    "PERIOD END",

    "FIRST HALF",
    "SECOND HALF",

    "INIZIO PARTITA",
    "FINE PARTITA",
    "INTERVALLO"
  ];

  for (const escluso of esclusi) {

    if (
      testoNorm === escluso ||
      testoNorm.includes((
        " " +
        escluso +
        " "
      ))
    ) {
      return false;
    }
  }

  if (
    /^(inizio|fine)\s+(partita|primo tempo|secondo tempo)$/i
      .test(testo)
  ) {
    return false;
  }

  /*
   * Alcuni eventi ESPN hanno solamente
   * il tipo tecnico senza testo utile.
   */
  const tipoTecnico =
    [
      "KICKOFF",
      "START",
      "END",
      "HALFTIME",
      "INTERMISSION",
      "PERIOD_START",
      "PERIOD_END"
    ];

  if (
    tipoTecnico.includes(tipo) &&
    !testo
  ) {
    return false;
  }

  /*
   * Se non esiste nessuna informazione utile,
   * non inseriamo l'evento nella cronaca.
   */
  const haGiocatore =
    !!nomeGiocatore(p);

  const haAssist =
    !!assistGiocatore(p);

  const haSquadra =
    !!squadraEvento(p);

  const haTipo =
    !!tipo;

  const haTesto =
    !!testo;

  if (
    !haGiocatore &&
    !haAssist &&
    !haSquadra &&
    !haTesto &&
    !haTipo
  ) {
    return false;
  }

  return true;
}


function creaCronaca(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  const cronaca = [];

  for (const p of plays) {

    if (
      !eventoCronacaUtile(p)
    ) {
      continue;
    }

    const minuto =
      minutoEvento(p);

    const tipo =
      traduciEvento(
        tipoEvento(p)
      );

    const giocatore =
      nomeGiocatore(p);

    const assist =
      assistGiocatore(p);

    const squadra =
      squadraEvento(p);

    let testo =
      p?.text ||
      p?.description ||
      p?.shortText ||
      "";

    testo =
      String(testo)
        .trim();

    /*
     * Se ESPN non fornisce una descrizione,
     * costruiamo una descrizione italiana
     * dall'evento.
     */

    if (!testo) {

      if (
        tipo &&
        giocatore &&
        assist
      ) {

        testo =
          tipo +
          ": " +
          giocatore +
          " (assist di " +
          assist +
          ")";

      } else if (
        tipo &&
        giocatore
      ) {

        testo =
          tipo +
          ": " +
          giocatore;

      } else if (
        tipo
      ) {

        testo =
          tipo;
      }
    }

    /*
     * Traduzione delle principali descrizioni
     * ESPN.
     */
    testo =
      testo
        .replace(
          /\bGoal\b/gi,
          "Gol"
        )
        .replace(
          /\bOwn Goal\b/gi,
          "Autogol"
        )
        .replace(
          /\bYellow Card\b/gi,
          "Ammonizione"
        )
        .replace(
          /\bRed Card\b/gi,
          "Espulsione"
        )
        .replace(
          /\bSecond Yellow\b/gi,
          "Seconda ammonizione"
        )
        .replace(
          /\bSubstitution\b/gi,
          "Sostituzione"
        )
        .replace(
          /\bPenalty\b/gi,
          "Rigore"
        )
        .replace(
          /\bVAR\b/gi,
          "VAR"
        );

    cronaca.push({

      minuto:
        minuto,

      tipo:
        tipo || null,

      giocatore:
        giocatore || null,

      assist:
        assist || null,

      squadra:
        squadra || null,

      testo:
        testo || null
    });
  }

  /*
   * Ordine cronologico.
   */
  cronaca.sort(
    function (a, b) {

      const ma =
        parseInt(
          String(
            a?.minuto || ""
          ).replace(
            /[^0-9]/g,
            ""
          ),
          10
        );

      const mb =
        parseInt(
          String(
            b?.minuto || ""
          ).replace(
            /[^0-9]/g,
            ""
          ),
          10
        );

      if (
        Number.isNaN(ma) &&
        Number.isNaN(mb)
      ) {
        return 0;
      }

      if (Number.isNaN(ma)) {
        return 1;
      }

      if (Number.isNaN(mb)) {
        return -1;
      }

      return ma - mb;
    }
  );

  return cronaca;
}


/* ============================================================
   FASE / TURNO
   ============================================================ */

function traduciFase(fase) {

  if (!fase) {
    return "";
  }

  const t =
    String(fase)
      .trim();

  const l =
    t.toLowerCase();

  const map = [

    [
      /round of 16|ottavi/,
      "Ottavi di finale"
    ],

    [
      /round of 32|sedicesimi/,
      "Sedicesimi di finale"
    ],

    [
      /quarter.?final|quarti/,
      "Quarti di finale"
    ],

    [
      /semi.?final|semifinali/,
      "Semifinali"
    ],

    [
      /final(?!e)|finale/,
      "Finale"
    ],

    [
      /play.?off/,
      "Playoff"
    ],

    [
      /play.?in/,
      "Play-in"
    ],

    [
      /qualifying|qualificazione/,
      "Qualificazioni"
    ],

    [
      /preliminary|preliminare/,
      "Turno preliminare"
    ],

    [
      /first round|primo turno/,
      "Primo turno"
    ],

    [
      /second round|secondo turno/,
      "Secondo turno"
    ],

    [
      /third round|terzo turno/,
      "Terzo turno"
    ],

    [
      /fourth round|quarto turno/,
      "Quarto turno"
    ],

    [
      /group stage|fase a gironi/,
      "Fase a gironi"
    ],

    [
      /league phase|fase campionato/,
      "Fase campionato"
    ]
  ];

  for (
    const [rx, out]
    of map
  ) {

    if (rx.test(l)) {
      return out;
    }
  }

  return t;
}


function getFaseTurno(
  data,
  competition
) {

  const valori = [];

  function aggiungi(valore) {

    if (
      valore === null ||
      valore === undefined
    ) {
      return;
    }

    if (
      typeof valore !== "string" &&
      typeof valore !== "number"
    ) {
      return;
    }

    const testo =
      String(valore)
        .trim();

    if (!testo) {
      return;
    }

    if (
      !valori.includes(testo)
    ) {
      valori.push(testo);
    }
  }

  function analizza(
    obj,
    profondita
  ) {

    if (
      obj === null ||
      obj === undefined ||
      profondita > 12
    ) {
      return;
    }

    if (Array.isArray(obj)) {

      obj.forEach(
        function (elemento) {

          analizza(
            elemento,
            profondita + 1
          );
        }
      );

      return;
    }

    if (
      typeof obj !== "object"
    ) {
      return;
    }

    [
      "round",
      "phase",
      "stage"
    ].forEach(
      function (campo) {

        const valore =
          obj[campo];

        if (
          valore &&
          typeof valore ===
          "object"
        ) {

          aggiungi(
            valore.displayName
          );

          aggiungi(
            valore.name
          );

          aggiungi(
            valore.label
          );

          aggiungi(
            valore.description
          );

          aggiungi(
            valore.shortName
          );

          aggiungi(
            valore.text
          );
        }
      }
    );

    const week =
      obj.week;

    if (
      week &&
      typeof week ===
      "object"
    ) {

      aggiungi(
        week.text
      );

      aggiungi(
        week.displayName
      );

      aggiungi(
        week.label
      );

      aggiungi(
        week.name
      );

      aggiungi(
        week.description
      );

      aggiungi(
        week.shortName
      );
    }

    Object.keys(obj)
      .forEach(
        function (chiave) {

          const valore =
            obj[chiave];

          if (
            valore &&
            typeof valore ===
            "object"
          ) {

            analizza(
              valore,
              profondita + 1
            );
          }
        }
      );
  }

  /*
   * Prima priorità:
   * dati della singola competizione.
   */
  analizza(
    competition,
    0
  );

  /*
   * Fallback:
   * tutta la risposta ESPN.
   */
  if (
    valori.length === 0
  ) {

    analizza(
      data,
      0
    );
  }

  const numeroGiornata =
    competition?.week?.number ??
    data?.header
      ?.competitions?.[0]
      ?.week?.number ??
    null;

  const esclusi = [

    "regular season",
    "regular-season",
    "season",
    "week",
    "matchday",
    "round",
    "stage",
    "phase"
  ];

  for (
    const valore
    of valori
  ) {

    if (
      !esclusi.includes(
        String(valore)
          .toLowerCase()
          .trim()
      )
    ) {

      return valore;
    }
  }

  if (
    numeroGiornata !== null &&
    numeroGiornata !== undefined &&
    String(
      numeroGiornata
    ).trim() !== ""
  ) {

    return (
      "Giornata " +
      numeroGiornata
    );
  }

  return "";
}


/* ============================================================
   ENDPOINT
   ============================================================ */

module.exports = async function handler(
  req,
  res
) {

  try {

    const id =
      req.query.id;

    const competizione =
      req.query.competizione ||
      "ita.1";

    if (!id) {

      return res.status(400).json({

        success: false,

        errore:
          "Parametro id obbligatorio"
      });
    }

    const datiCompetizione =
      COMPETIZIONI[
        competizione
      ] || {

        nome:
          competizione,

        paese:
          null
      };

    /* ========================================================
       CHIAMATA ESPN
       ======================================================== */

    const data =
      await espnFetch(
        "/" +
        competizione +
        "/summary?event=" +
        encodeURIComponent(id)
      );

    const competition =
      data?.header?.competitions?.[0];

    if (!competition) {

      return res.status(404).json({

        success: false,

        errore:
          "Partita non trovata"
      });
    }

    const teams =
      competition?.competitors ||
      [];

    const home =
      teams.find(
        function (x) {

          return (
            x?.homeAway ===
            "home"
          );
        }
      );

    const away =
      teams.find(
        function (x) {

          return (
            x?.homeAway ===
            "away"
          );
        }
      );

    const plays =
      Array.isArray(data?.plays)
        ? data.plays
        : Array.isArray(
            data?.keyEvents
          )
          ? data.keyEvents
          : [];

    const statistiche =
      creaStatistiche(
        data
      );

    const formazioni =
      creaFormazioni(
        data,
        home,
        away
      );

    const venue =
      data?.gameInfo?.venue ||
      competition?.venue ||
      null;

    const dataOra =
      convertiDataOraItaliana(
        competition?.date ||
        data?.header?.date ||
        null
      );

    const arbitri =
      creaArbitri(
        data,
        competition
      );

    const stato =
      traduciStato(
        competition?.status?.type
      );

    const faseTurno =
      await getFaseTurnoESPN(
        data,
        competition,
        competizione,
        id,
        competition?.date ||
        data?.header?.date ||
        null
      );

    const homeTeam =
      datiSquadra(
        home
      );

    const awayTeam =
      datiSquadra(
        away
      );

    /* ========================================================
       RISPOSTA JSON
       ======================================================== */

    return res.status(200).json({

      success: true,

      partita: {

        id:
          data?.header?.id ||
          id,

        data:
          dataOra.data,

        ora:
          dataOra.ora,

        competizione: {

          id:
            competizione,

          nome:
            datiCompetizione.nome,

          paese:
            datiCompetizione.paese
        },

        faseTurno:
          faseTurno,

        stato: {

          nome:
            stato,

          descrizione:
            stato,

          stato:
            stato,

          completata:
            stato ===
            "Finita",

          minuto:
            competition
              ?.status
              ?.displayClock ||
            null
        },

        casa:
          homeTeam,

        trasferta:
          awayTeam,

        stadio:
          venue?.fullName ||
          venue?.displayName ||
          null,

        nome:
          (
            home?.team
              ?.displayName ||
            ""
          ) +
          " - " +
          (
            away?.team
              ?.displayName ||
            ""
          ),

        link: {

          partita:
            "https://www.espn.com/soccer/match/_/gameId/" +
            encodeURIComponent(id),

          statistiche:
            "https://www.espn.com/soccer/matchstats/_/gameId/" +
            encodeURIComponent(id)
        }
      },

      /* ======================================================
         INFORMAZIONI
         ====================================================== */

      info: {

        arbitro:
          arbitri,

        arbitri:
          arbitri,

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
         EVENTI
         ====================================================== */

      marcatori:
        creaMarcatori(
          plays
        ),

      cartellini:
        creaCartellini(
          plays
        ),

      sostituzioni:
        creaSostituzioni(
          plays
        ),

      /* ======================================================
         STATISTICHE
         ====================================================== */

      statistiche:
        statistiche,

      statistichePartita: {

        possessoCasa:
          statistiche
            .valori
            .possessoCasa,

        possessoTrasferta:
          statistiche
            .valori
            .possessoTrasferta,

        tiriCasa:
          statistiche
            .valori
            .tiriCasa,

        tiriTrasferta:
          statistiche
            .valori
            .tiriTrasferta,

        tiriInPortaCasa:
          statistiche
            .valori
            .tiriInPortaCasa,

        tiriInPortaTrasferta:
          statistiche
            .valori
            .tiriInPortaTrasferta,

        calciDangoloCasa:
          statistiche
            .valori
            .calciDangoloCasa,

        calciDangoloTrasferta:
          statistiche
            .valori
            .calciDangoloTrasferta,

        passaggiCasa:
          statistiche
            .valori
            .passaggiCasa,

        passaggiTrasferta:
          statistiche
            .valori
            .passaggiTrasferta,

        fuorigiocoCasa:
          statistiche
            .valori
            .fuorigiocoCasa,

        fuorigiocoTrasferta:
          statistiche
            .valori
            .fuorigiocoTrasferta
      },

      /* ======================================================
         FORMAZIONI
         ====================================================== */

      formazioni:
        formazioni,

      /* ======================================================
         CRONACA
         ====================================================== */

      cronaca:
        creaCronaca(
          plays
        ),

      /* ======================================================
         EVENTI COMPLETI
         ====================================================== */

      eventi:
        plays.map(
          function (p) {

            return {

              id:
                p?.id ||
                null,

              minuto:
                minutoEvento(
                  p
                ),

              tipo:
                traduciEvento(
                  tipoEvento(
                    p
                  )
                ),

              giocatore:
                nomeGiocatore(
                  p
                ),

              assist:
                assistGiocatore(
                  p
                ),

              squadra:
                squadraEvento(
                  p
                )
            };
          }
        )
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
