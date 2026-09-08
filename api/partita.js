const { espnFetch } = require("../lib/espn");

/*

API CALCIO 100%SERIEA&SERIEB


Endpoint:

/api/partita?id=ID_PARTITA&competizione=CODICE_ESPN

Esempio:

/api/partita?id=401874758&competizione=ita.1

ESPN = UNICA FONTE DATI

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
   TRASFORMA LE FINESTRE IN OGGETTI
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

function testoValido(valore) {

  if (
    valore === null ||
    valore === undefined
  ) {
    return false;
  }

  return String(valore).trim()!== "";

}

function normalizzaTesto(valore) {

  return String(valore || "")
   .toLowerCase()
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g, "")
   .replace(/\s+/g, " ")
   .trim();

}

function normalizzaPosizioneTesto(valore) {

  return normalizzaTesto(valore)
   .replace(/[^a-z0-9]+/g, "_")
   .replace(/^_+|_+$/g, "")
   .toUpperCase();

}

function ultimoCognome(nome) {

  if (!nome) return null;

  const testo =
    String(nome)
     .trim()
     .replace(/\s+/g, " ");

  if (!testo) return null;

  const parti =
    testo.split(" ");

  return parti[parti.length - 1];

}

function nomeCompletoAtleta(atleta) {

  if (!atleta) return "";

  return (
    atleta.displayName ||
    atleta.fullName ||
    atleta.longName ||
    atleta.shortName ||
    atleta.name ||
    atleta.preferredName ||
    ""
  );

}

function dataISO(valore) {

  if (!valore) return null;

  const testo =
    String(valore).trim();

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(testo)
  ) {
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

  const data =
    dataISO(valoreData);

  if (!data) return null;

  const finestre =
    FINESTRE_GIORNATE[
      competizione
    ];

  if (!Array.isArray(finestre)) {
    return null;
  }

  for (
    const finestra
    of finestre
  ) {

    if (
      data >= finestra.inizio &&
      data <= finestra.fine
    ) {

      return finestra.faseTurno;

    }

  }

  return null;

}

function numeroGiornataDaFinestra(
  competizione,
  valoreData
) {

  const fase =
    faseDaFinestra(
      competizione,
      valoreData
    );

  if (!fase) {
    return null;
  }

  const match =
    String(fase).match(
      /Giornata\s+(\d+)/i
    );

  return match
   ? Number(match[1])
    : null;

}

/* ============================================================
   DATA E ORA ITALIANA
============================================================ */

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

  const formatterData =
    new Intl.DateTimeFormat(
      "it-IT",
      {
        timeZone: "Europe/Rome",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    );

  const formatterOra =
    new Intl.DateTimeFormat(
      "it-IT",
      {
        timeZone: "Europe/Rome",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }
    );

  return {

    data:
      formatterData.format(d),

    ora:
      formatterOra.format(d)

  };

}

/* ============================================================
   SQUADRE
============================================================ */

function nomeSquadraItaliano(nome) {

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

    "Inter":
      "Inter",

    "Al Riyadh":
      "Riyadh",

    "AC Milan":
      "Milan",

    "Milan":
      "Milan",

    "Como 1907":
      "Como",

    "Como":
      "Como",

    "Paris Saint-Germain":
      "PSG",

    "Paris Saint-Germain FC":
      "PSG",

    "PSG":
      "PSG"

  };

  return (
    mappa[testo] ||
    testo
  );

}

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
      competitor.id ||
      null,

    nome:
      nomeSquadraItaliano(
        team.displayName ||
        team.name ||
        competitor.displayName ||
        competitor.name ||
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
      team.logos?.[0]?.href ||
      null,

    punteggio:
      competitor.score??
      competitor.score?.displayValue??
      0,

    vincitore:
      competitor.winner === true

  };

}

/* ============================================================
   STATO
============================================================ */

function traduciStato(status) {

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
    tipo.includes("inprogress") ||
    tipo.includes("in-progress") ||
    tipo === "in" ||
    tipo.includes("live")
  ) {
    return "In corso";
  }

  if (
    tipo.includes("pre") ||
    tipo.includes("scheduled") ||
    tipo.includes("created")
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
    p?.type?.abbreviation ||
    p?.text ||
    p?.description ||
    ""
  ).toLowerCase();

}

function atletaEvento(p) {

  return (
    p?.athlete ||
    p?.player ||
    p?.scoringPlayer ||
    p?.participants?.find(
      function (x) {
        return (
          x?.athlete ||
          x?.player
        );
      }
    )?.athlete ||
    null
  );

}

function nomeGiocatore(p) {

  const atleta =
    atletaEvento(p);

  if (atleta) {

    return ultimoCognome(
      nomeCompletoAtleta(atleta)
    );

  }

  return ultimoCognome(
    p?.player?.displayName ||
    p?.playerName ||
    p?.athleteName ||
    p?.scorer?.displayName ||
    ""
  );

}

function assistGiocatore(p) {

  const assist =
    p?.assist ||
    p?.assistPlayer ||
    p?.assistBy ||
    p?.participants?.find(
      function (x) {

        const ruolo =
          String(
            x?.role ||
            x?.type ||
            ""
          ).toLowerCase();

        return (
          ruolo.includes("assist") &&
          (x?.athlete || x?.player)
        );

      }
    )?.athlete ||
    null;

  if (!assist) {
    return null;
  }

  return ultimoCognome(
    nomeCompletoAtleta(
      assist
    )
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
    p?.clock?.value!== undefined
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

  if (
    p?.minute!== undefined
  ) {

    return String(
      p.minute
    );

  }

  if (
    p?.period?.displayValue
  ) {

    return p.period.displayValue;

  }

  return null;

}

function squadraEvento(p) {

  const team =
    p?.team ||
    p?.competitor ||
    p?.scoringTeam ||
    p?.teamData ||
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

/* ============================================================
   MARCATORI
============================================================ */

function creaMarcatori(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays
   .filter(
      function (p) {

        const tipo =
          tipoEvento(p);

        const testo =
          String(
            p?.text ||
            p?.description ||
            ""
          ).toLowerCase();

        return (
          p?.scoringPlay === true ||
          p?.isScoringPlay === true ||
          tipo.includes("goal") ||
          tipo.includes("gol") ||
          tipo.includes("score") ||
          testo.includes("goal")
        );

      }
    )
   .map(
      function (p) {

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
            tipoEvento(p)
             .includes("own goal") ||
            String(
              p?.text ||
              ""
            )
             .toLowerCase()
             .includes("own goal")

        };

      }
    );

}

/* ============================================================
   CARTELLINI
============================================================ */

function creaCartellini(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays
   .filter(
      function (p) {

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
          testo.includes("red card") ||
          testo.includes("second yellow")
        );

      }
    )
   .map(
      function (p) {

        const testo =
          (
            tipoEvento(p) +
            " " +
            String(
              p?.text ||
              p?.description ||
              ""
            )
          ).toLowerCase();

        let cartellino =
          "Cartellino";

        if (
          testo.includes("second yellow")
        ) {
          cartellino =
            "Seconda ammonizione";
        } else if (
          testo.includes("red")
        ) {
          cartellino =
            "Rosso";
        } else if (
          testo.includes("yellow")
        ) {
          cartellino =
            "Giallo";
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

      }
    );

}

/* ============================================================
   SOSTITUZIONI
============================================================ */

function estraiAtletaDaPartecipante(
  partecipante
) {

  if (!partecipante) {
    return null;
  }

  return (
    partecipante.athlete ||
    partecipante.player ||
    partecipante
  );

}

function creaSostituzioni(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays
   .filter(
      function (p) {

        const tipo =
          tipoEvento(p);

        const testo =
          String(
            p?.text ||
            p?.description ||
            p?.shortText ||
            ""
          ).toLowerCase();

        return (
          tipo.includes("substitution") ||
          tipo.includes("substitution") ||
          tipo === "sub" ||
          testo.includes("substitution") ||
          testo.includes("sostituzione") ||
          testo.includes("replaces")
        );

      }
    )
   .map(
      function (p) {

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
            estraiAtletaDaPartecipante(
              partecipante
            );

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
              participanteTipo(partecipante) ||
              ""
            ).toLowerCase();

          if (
            ruolo.includes("in") ||
            ruolo.includes("enter") ||
            ruolo.includes("on")
          ) {

            entrato =
              entrato ||
              nome;

          }

          if (
            ruolo.includes("out") ||
            ruolo.includes("exit") ||
            ruolo.includes("off")
          ) {

            uscito =
              uscito ||
              nome;

          }

        }

        const testoOriginale =
          String(
            p?.text ||
            p?.description ||
            p?.shortText ||
            ""
          );

        /*
         * Fallback:
         *
         * ESPN può restituire ad esempio:
         *
         * "Player A replaces Player B"
         */

        if (
         !entrato ||
         !uscito
        ) {

          const match =
            testoOriginale.match(
              /^(.+?)\s+(?:replaces|for)\s+(.+)$/i
            );

          if (match) {

            if (!entrato) {

              entrato =
                ultimoCognome(
                  match[1]
                );

            }

            if (!uscito) {

              uscito =
                ultimoCognome(
                  match[2]
                );

            }

          }

        }

        /*
         * Altro fallback ESPN.
         */

        if (
         !uscito
        ) {

          const match =
            testoOriginale.match(
              /(?:for|replace[sd]?)\s+([A-Za-zÀ-ÿ' -]+)$/i
            );

          if (match) {

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
            squadraEvento(p),

          testo:
            testoOriginale || null

        };

      }
    );

}

function participanteTipo(p) {

  return (
    p?.substitutionType ||
    p?.participantType ||
    ""
  );

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

  function aggiungi(elemento) {

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

    const chiave =
      normalizzaTesto(nome);

    if (
      risultati.some(
        function (x) {
          return (
            normalizzaTesto(x.nome) ===
            chiave
          );
        }
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
        elemento?.position?.name ||
        elemento?.role ||
        elemento?.type?.displayName ||
        elemento?.type?.text ||
        null

    });

  }

  for (
    const fonte
    of fonti
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

    const display =
      String(
        stat?.displayName ||
        ""
      ).toLowerCase();

    for (
      const elemento
      of nomi
    ) {

      const n =
        String(elemento)
         .toLowerCase();

      if (
        nome === n ||
        label === n ||
        display === n ||
        nome.includes(n) ||
        label.includes(n) ||
        display.includes(n)
      ) {

        return (
          stat?.displayValue??
          stat?.value??
          null
        );

      }

    }

  }

  return null;

}

function normalizzaValoreStatistica(
  valore
) {

  if (
    valore === null ||
    valore === undefined
  ) {
    return null;
  }

  if (
    typeof valore === "number"
  ) {
    return valore;
  }

  const testo =
    String(valore).trim();

  if (!testo) {
    return null;
  }

  return testo;

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
    data?.boxscore?.teamStatistics ||
    [];

  if (
   !Array.isArray(teams)
  ) {
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
        : Array.isArray(
            team?.stats
          )
         ? team.stats
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

            displayName:
              x?.displayName ||
              null,

            valore:
              normalizzaValoreStatistica(
                x?.displayValue??
                x?.value
              )

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
            "totalShotAttempts",
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
            "shotsOnFrame",
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

    const homeAway =
      team?.homeAway ||
      team?.team?.homeAway ||
      null;

    if (
      homeAway === "home"
    ) {

      risultato.casa =
        statistiche;

      risultato.valori.possessoCasa =
        normalizzaValoreStatistica(
          valori.possesso
        );

      risultato.valori.tiriCasa =
        normalizzaValoreStatistica(
          valori.tiri
        );

      risultato.valori.tiriInPortaCasa =
        normalizzaValoreStatistica(
          valori.tiriInPorta
        );

      risultato.valori.calciDangoloCasa =
        normalizzaValoreStatistica(
          valori.angoli
        );

      risultato.valori.passaggiCasa =
        normalizzaValoreStatistica(
          valori.passaggi
        );

      risultato.valori.fuorigiocoCasa =
        normalizzaValoreStatistica(
          valori.fuorigioco
        );

    }

    if (
      homeAway === "away"
    ) {

      risultato.trasferta =
        statistiche;

      risultato.valori.possessoTrasferta =
        normalizzaValoreStatistica(
          valori.possesso
        );

      risultato.valori.tiriTrasferta =
        normalizzaValoreStatistica(
          valori.tiri
        );

      risultato.valori.tiriInPortaTrasferta =
        normalizzaValoreStatistica(
          valori.tiriInPorta
        );

      risultato.valori.calciDangoloTrasferta =
        normalizzaValoreStatistica(
          valori.angoli
        );

      risultato.valori.passaggiTrasferta =
        normalizzaValoreStatistica(
          valori.passaggi
        );

      risultato.valori.fuorigiocoTrasferta =
        normalizzaValoreStatistica(
          valori.fuorigioco
        );

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

    SUB: "Riserva"

  };

  return (
    mappa[r] ||
    ruolo
  );

}

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
    r.includes("goal keeper") ||
    r.includes("portier")
  ) {
    return "Portiere";
  }

  if (
    r.includes("defender") ||
    r.includes("defens") ||
    r.includes("difensor")
  ) {
    return "Difensore";
  }

  if (
    r.includes("midfielder") ||
    r.includes("midfield") ||
    r.includes("centrocamp")
  ) {
    return "Centrocampista";
  }

  if (
    r.includes("forward") ||
    r.includes("striker") ||
    r.includes("attacc")
  ) {
    return "Attaccante";
  }

  return ruoloItaliano(ruolo);

  }

/* ============================================================
   STRUTTURA MODULO
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
    },

    "3-4-2-1": {
      difensori: 3,
      centrocampisti: 6,
      attaccanti: 1
    }

  };

  return (
    map[m] ||
    null
  );

}

/* ============================================================
   ESTRAZIONE MODULO
   QUESTA ERA LA FUNZIONE MANCANTE
============================================================ */

function estraiModuloFormazione(
  roster
) {

  if (!roster) {
    return null;
  }

  const candidati = [

    roster?.formation,

    roster?.formation?.displayName,

    roster?.formation?.name,

    roster?.formation?.text,

    roster?.formation?.label,

    roster?.formation?.description,

    roster?.formationDisplay,

    roster?.formationName,

    roster?.formationText,

    roster?.module,

    roster?.modulo,

    roster?.tacticalShape,

    roster?.tactics?.formation,

    roster?.tactics?.shape,

    roster?.team?.formation,

    roster?.team?.formation?.displayName,

    roster?.team?.formation?.name,

    roster?.team?.formation?.text

  ];

  for (
    const candidato
    of candidati
  ) {

    if (
      candidato === null ||
      candidato === undefined
    ) {
      continue;
    }

    if (
      typeof candidato === "object"
    ) {

      const valori = [

        candidato.displayName,
        candidato.name,
        candidato.text,
        candidato.label,
        candidato.description,
        candidato.value

      ];

      for (
        const valore
        of valori
      ) {

        if (
          testoValido(valore)
        ) {

          const match =
            String(valore).match(
              /\b\d-\d(?:-\d){1,3}\b/
            );

          if (match) {
            return match[0];
          }

        }

      }

    } else {

      const match =
        String(candidato).match(
          /\b\d-\d(?:-\d){1,3}\b/
        );

      if (match) {
        return match[0];
      }

    }

  }

  /*
   * Ultimo tentativo:
   * cerchiamo una stringa modulo in tutto il roster.
   */

  let trovato = null;

  function cerca(obj, profondita) {

    if (
      trovato ||
      obj === null ||
      obj === undefined ||
      profondita > 8
    ) {
      return;
    }

    if (
      typeof obj === "string"
    ) {

      const match =
        obj.match(
          /\b\d-\d(?:-\d){1,3}\b/
        );

      if (match) {
        trovato =
          match[0];
      }

      return;
    }

    if (
      typeof obj!== "object"
    ) {
      return;
    }

    if (Array.isArray(obj)) {

      for (
        const elemento
        of obj
      ) {

        cerca(
          elemento,
          profondita + 1
        );

        if (trovato) return;

      }

      return;
    }

    for (
      const chiave
      of Object.keys(obj)
    ) {

      const valore =
        obj[chiave];

      if (
        /formation|formationName|module|modulo|shape|tactic/i
         .test(chiave)
      ) {

        cerca(
          valore,
          profondita + 1
        );

        if (trovato) return;

      }

    }

  }

  cerca(
    roster,
    0
  );

  return trovato;

}

/* ============================================================
   ALLENATORE
============================================================ */

function estraiAllenatoreFormazione(
  roster,
  data,
  idSquadra
) {

  const candidati = [

    roster?.coach,

    roster?.coach?.athlete,

    roster?.manager,

    roster?.manager?.athlete,

    roster?.headCoach,

    roster?.headCoach?.athlete,

    roster?.team?.coach,

    roster?.team?.coach?.athlete,

    roster?.team?.manager,

    roster?.team?.manager?.athlete

  ];

  for (
    const candidato
    of candidati
  ) {

    if (!candidato) {
      continue;
    }

    const nome =
      typeof candidato === "string"
       ? candidato
        : (
            candidato.displayName ||
            candidato.fullName ||
            candidato.name ||
            ""
          );

    if (
      testoValido(nome)
    ) {

      return nome;

    }

  }

  /*
   * Cerca eventuali coach dentro gli staff ESPN.
   */

  const staff =
    data?.gameInfo?.officials ||
    data?.coaches ||
    data?.coaching ||
    [];

  if (
    Array.isArray(staff)
  ) {

    for (
      const elemento
      of staff
    ) {

      const teamId =
        elemento?.team?.id ||
        elemento?.teamId ||
        elemento?.competitor?.id ||
        null;

      if (
        idSquadra &&
        teamId &&
        String(teamId)!==
        String(idSquadra)
      ) {
        continue;
      }

      const persona =
        elemento?.athlete ||
        elemento?.coach ||
        elemento;

      const nome =
        persona?.displayName ||
        persona?.fullName ||
        persona?.name ||
        "";

      if (
        testoValido(nome)
      ) {
        return nome;
      }

    }

  }

  return null;

}

/* ============================================================
   CHIAVE GIOCATORE
============================================================ */

function chiaveGiocatore(
  p,
  atleta
) {

  return String(
    atleta?.id ||
    p?.athlete?.id ||
    p?.player?.id ||
    p?.id ||
    nomeCompletoAtleta(atleta)
  )
   .trim()
   .toLowerCase();

}

/* ============================================================
   RUOLO CON MODULO
============================================================ */

function ruoloConModulo(
  p,
  atleta,
  modulo,
  titolare
) {

  const candidati = [

    p?.position?.abbreviation,
    p?.position?.name,
    p?.position?.displayName,

    atleta?.position?.abbreviation,
    atleta?.position?.name,
    atleta?.position?.displayName,

    p?.positionAbbreviation,
    p?.positionName,
    p?.position,

    atleta?.positionAbbreviation,
    atleta?.positionName,

    p?.role,
    p?.roleName

  ];

  for (
    const ruolo
    of candidati
  ) {

    if (
      testoValido(ruolo)
    ) {

      const italiano =
        normalizzaRuolo(ruolo);

      if (italiano) {

        return {

          ruolo:
            italiano,

          ruoloESPN:
            String(ruolo)

        };

      }

    }

  }

  /*
   * Se ESPN non fornisce il ruolo,
   * viene determinato in base al modulo.
   */

  if (titolare) {

    const struttura =
      strutturaModulo(
        modulo
      );

    if (struttura) {

      return {

        ruolo:
          "Giocatore",

        ruoloESPN:
          null

      };

    }

  }

  return {

    ruolo:
      "Riserva",

    ruoloESPN:
      null

  };

}

/* ============================================================
   DEDUPLICA GIOCATORI
============================================================ */

function deduplicaGiocatori(
  giocatori
) {

  if (!Array.isArray(giocatori)) {
    return [];
  }

  const risultati = [];
  const visti = new Set();

  for (
    const giocatore
    of giocatori
  ) {

    const chiave =
      normalizzaTesto(
        giocatore?.cognome ||
        giocatore?.nome ||
        ""
      );

    if (!chiave) {
      continue;
    }

    if (
      visti.has(chiave)
    ) {
      continue;
    }

    visti.add(chiave);

    risultati.push(
      giocatore
    );

  }

  return risultati;

}

/* ============================================================
   RIEQUILIBRIO RUOLI
============================================================ */

function riequilibraRuoliDaModulo(
  titolari,
  modulo
) {

  if (
   !Array.isArray(titolari)
  ) {
    return [];
  }

  /*
   * Non modifichiamo i ruoli già forniti da ESPN.
   *
   * Questa funzione serve solo come sicurezza:
   * se ESPN restituisce "Giocatore" senza ruolo,
   * proviamo a distribuirlo usando il modulo.
   */

  const struttura =
    strutturaModulo(
      modulo
    );

  if (!struttura) {
    return titolari;
  }

  const risultato =
    titolari.map(
      function (g) {

        return {
         ...g
        };

      }
    );

  const senzaRuolo =
    risultato.filter(
      function (g) {

        return (
         !g.ruolo ||
          g.ruolo === "Giocatore"
        );

      }
    );

  if (
    senzaRuolo.length === 0
  ) {
    return risultato;
  }

  /*
   * Non abbiamo coordinate sufficienti:
   * non inventiamo la posizione.
   */

  return risultato;

}

/* ============================================================
   FORMAZIONI
============================================================ */

function estraiRosters(
  data
) {

  const candidati = [

    data?.rosters,

    data?.lineups,

    data?.lineup,

    data?.boxscore?.rosters,

    data?.boxscore?.lineups,

    data?.boxscore?.players

  ];

  for (
    const candidato
    of candidati
  ) {

    if (
      Array.isArray(candidato) &&
      candidato.length > 0
    ) {

      return candidato;

    }

  }

  return [];

}

function creaFormazioni(
  data,
  home,
  away
) {

  const risultato = {

    casa: null,
    trasferta: null

  };

  const rosters =
    estraiRosters(
      data
    );

  if (
   !Array.isArray(rosters)
  ) {
    return risultato;
  }

  for (
    const r
    of rosters
  ) {

    const idSquadra =
      r?.team?.id ||
      r?.teamId ||
      r?.competitor?.id ||
      r?.team?.uid ||
      null;

    if (!idSquadra) {
      continue;
    }

    const modulo =
      estraiModuloFormazione(
        r
      );

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
      r?.entries ||
      [];

    if (
     !Array.isArray(giocatori)
    ) {
      continue;
    }

    const visti =
      new Set();

    for (
      const p
      of giocatori
    ) {

      const atleta =
        p?.athlete ||
        p?.player ||
        p;

      const nomeCompleto =
        nomeCompletoAtleta(
          atleta
        );

      const cognome =
        ultimoCognome(
          nomeCompleto
        );

      if (!cognome) {
        continue;
      }

      const chiave =
        chiaveGiocatore(
          p,
          atleta
        );

      if (
        visti.has(chiave)
      ) {
        continue;
      }

      visti.add(chiave);

      const numero =
        p?.jersey??
        atleta?.jersey??
        p?.uniformNumber??
        null;

      const titolare =
        p?.starter === true ||
        p?.isStarter === true ||
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

    formazione.titolari =
      riequilibraRuoliDaModulo(
        formazione.titolari,
        modulo
      );

    formazione.titolari =
      deduplicaGiocatori(
        formazione.titolari
      );

    formazione.riserve =
      deduplicaGiocatori(
        formazione.riserve
      );

    const titolariChiavi =
      new Set(
        formazione.titolari.map(
          function (g) {

            return normalizzaTesto(
              g?.cognome ||
              ""
            );

          }
        )
      );

    formazione.riserve =
      formazione.riserve.filter(
        function (g) {

          const chiave =
            normalizzaTesto(
              g?.cognome ||
              ""
            );

          return (
           !titolariChiavi.has(
              chiave
            )
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

function traduciEvento(
  tipo
) {

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
    t === "sub"
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

  if (
    t.includes("offside")
  ) {
    return "Fuorigioco";
  }

  return (
    tipo ||
    "Evento"
  );

}

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

  for (
    const escluso
    of esclusi
  ) {

    if (
      normalizzaPosizioneTesto(
        testo
      ) ===
      normalizzaPosizioneTesto(
        escluso
      )
    ) {
      return false;
    }

  }

  if (
   !testo &&
    (
      tipo === "KICKOFF" ||
      tipo === "START" ||
      tipo === "END" ||
      tipo === "HALFTIME"
    )
  ) {
    return false;
  }

  return (
   !!testo ||
   !!nomeGiocatore(p) ||
   !!assistGiocatore(p) ||
   !!squadraEvento(p) ||
   !!tipo
  );

}

function traduciTestoEvento(
  testo
) {

  if (!testo) {
    return testo;
  }

  return String(testo)

   .replace(
      /\bOwn Goal\b/gi,
      "Autogol"
    )

   .replace(
      /\bGoal\b/gi,
      "Gol"
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
    );

}

function creaCronaca(
  plays
) {

  if (!Array.isArray(plays)) {
    return [];
  }

  const cronaca = [];

  for (
    const p
    of plays
  ) {

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

    testo =
      traduciTestoEvento(
        testo
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

      if (
        Number.isNaN(ma)
      ) {
        return 1;
      }

      if (
        Number.isNaN(mb)
      ) {
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

function traduciFase(
  fase
) {

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
      /round of 64|trentaduesimi/,
      "Trentaduesimi di finale"
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
      /^final$|^finale$/,
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
      /qualifying|qualification|qualificazione/,
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
      /league phase|league stage|fase campionato/,
      "Fase campionato"
    ]

  ];

  for (
    const [rx, out]
    of map
  ) {

    if (
      rx.test(l)
    ) {
      return out;
    }

  }

  return t;

      }

/* ============================================================
   SCANSIONE FASE ESPN
============================================================ */

function trovaFaseESPN(
  oggetto
) {

  const trovate = [];

  function aggiungi(
    valore
  ) {

    if (
     !testoValido(valore)
    ) {
      return;
    }

    const testo =
      String(valore)
       .trim();

    if (
     !trovate.includes(testo)
    ) {
      trovate.push(testo);
    }

  }

  function analizza(
    obj,
    profondita
  ) {

    if (
      obj === null ||
      obj === undefined ||
      profondita > 15
    ) {
      return;
    }

    if (
      Array.isArray(obj)
    ) {

      for (
        const elemento
        of obj
      ) {

        analizza(
          elemento,
          profondita + 1
        );

      }

      return;
    }

    if (
      typeof obj!== "object"
    ) {
      return;
    }

    for (
      const campo
      of [
        "round",
        "phase",
        "stage"
      ]
    ) {

      const valore =
        obj[campo];

      if (
        typeof valore === "string"
      ) {

        aggiungi(valore);

      } else if (
        valore &&
        typeof valore === "object"
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

    for (
      const chiave
      of Object.keys(obj)
    ) {

      const valore =
        obj[chiave];

      if (
        valore &&
        typeof valore === "object"
      ) {

        analizza(
          valore,
          profondita + 1
        );

      }

    }

  }

  analizza(
    oggetto,
    0
  );

  /*
   * Cerchiamo prima le fasi veramente significative.
   */

  for (
    const valore
    of trovate
  ) {

    const tradotta =
      traduciFase(
        valore
      );

    if (
      tradotta &&
      (
        tradotta.includes("finale") ||
        tradotta === "Playoff" ||
        tradotta === "Play-in" ||
        tradotta === "Qualificazioni" ||
        tradotta === "Turno preliminare" ||
        tradotta === "Primo turno" ||
        tradotta === "Secondo turno" ||
        tradotta === "Terzo turno" ||
        tradotta === "Quarto turno" ||
        tradotta === "Fase a gironi"
      )
    ) {

      return tradotta;

    }

  }

  /*
   * League Phase viene tenuta come fallback.
   */

  for (
    const valore
    of trovate
  ) {

    const tradotta =
      traduciFase(
        valore
      );

    if (
      tradotta ===
      "Fase campionato"
    ) {

      return tradotta;

    }

  }

  return "";

}

/* ============================================================
   GIORNATA UFFICIALE ESPN
============================================================ */

function trovaGiornataESPN(
  data,
  competition
) {

  const candidati = [

    competition?.week?.number,

    competition?.week?.value,

    competition?.week?.displayValue,

    competition?.week?.text,

    data?.header?.competitions?.[0]?.week?.number,

    data?.header?.competitions?.[0]?.week?.value,

    data?.header?.competitions?.[0]?.week?.displayValue,

    data?.header?.competitions?.[0]?.week?.text

  ];

  for (
    const valore
    of candidati
  ) {

    if (
      valore === null ||
      valore === undefined
    ) {
      continue;
    }

    const match =
      String(valore).match(
        /\d+/
      );

    if (match) {

      return (
        "Giornata " +
        Number(match[0])
      );

    }

  }

  return null;

}

/* ============================================================
   FASE / TURNO COMPLETA
============================================================ */

async function getFaseTurnoESPN(
  data,
  competition,
  competizione,
  id,
  dataPartita
) {

  /*
   * 1.
   * Cerchiamo una vera fase ESPN.
   *
   * Le fasi a eliminazione diretta hanno priorità.
   */

  const faseESPN =
    trovaFaseESPN(
      competition
    );

  const faseESPNData =
    trovaFaseESPN(
      data?.header
    );

  const faseESPNCompleta =
    faseESPN ||
    faseESPNData ||
    trovaFaseESPN(data);

  /*
   * 2.
   * Se ESPN indica una vera fase eliminatoria,
   * questa deve prevalere.
   */

  if (
    faseESPNCompleta &&
    faseESPNCompleta!==
    "Fase campionato"
  ) {

    return faseESPNCompleta;

  }

  /*
   * 3.
   * Competizioni di campionato:
   * prima la giornata ufficiale ESPN.
   */

  const giornataESPN =
    trovaGiornataESPN(
      data,
      competition
    );

  /*
   * La Liga:
   *
   * la giornata ufficiale ESPN prevale
   * sulla sola data.
   */

  if (
    competizione === "esp.1"
  ) {

    if (
      giornataESPN
    ) {

      return giornataESPN;

    }

    const giornataFinestra =
      faseDaFinestra(
        competizione,
        dataPartita
      );

    if (
      giornataFinestra
    ) {

      return giornataFinestra;

    }

  }

  /*
   * 4.
   * Per le altre competizioni di campionato,
   * se ESPN ci dà la giornata la usiamo.
   */

  if (
    giornataESPN
  ) {

    return giornataESPN;

  }

  /*
   * 5.
   * Fallback sulle finestre ufficiali.
   */

  const giornataDaFinestra =
    faseDaFinestra(
      competizione,
      dataPartita
    );

  if (
    giornataDaFinestra
  ) {

    return giornataDaFinestra;

  }

  /*
   * 6.
   * Se ESPN dice genericamente League Phase,
   * restituiamo Fase campionato.
   */

  if (
    faseESPNCompleta ===
    "Fase campionato"
  ) {

    return "Fase campionato";

  }

  /*
   * 7.
   * Ultimo fallback.
   */

  return "";

}

/* ============================================================
   ESTRAZIONE PLAYS
============================================================ */

function estraiPlays(
  data
) {

  const candidati = [

    data?.plays,

    data?.keyEvents,

    data?.gameInfo?.plays,

    data?.commentary?.plays

  ];

  for (
    const candidato
    of candidati
  ) {

    if (
      Array.isArray(candidato)
    ) {

      return candidato;

    }

  }

  return [];

}

/* ============================================================
   EVENTI COMPLETI
============================================================ */

function creaEventi(
  plays
) {

  if (
   !Array.isArray(plays)
  ) {
    return [];
  }

  return plays.map(
    function (p) {

      return {

        id:
          p?.id ||
          null,

        minuto:
          minutoEvento(p),

        tipo:
          traduciEvento(
            tipoEvento(p)
          ),

        giocatore:
          nomeGiocatore(p),

        assist:
          assistGiocatore(p),

        squadra:
          squadraEvento(p)

      };

    }
  );

}

/* ============================================================
   ENDPOINT
============================================================ */

module.exports =
  async function handler(
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

      /* ======================================================
         ESPN
      ====================================================== */

      const data =
        await espnFetch(
          "/" +
          competizione +
          "/summary?event=" +
          encodeURIComponent(id)
        );

      if (
       !data ||
        typeof data!== "object"
      ) {

        return res.status(404).json({

          success: false,

          errore:
            "Risposta ESPN non valida"

        });

      }

      const competition =
        data?.header?.competitions?.[0];

      if (!competition) {

        return res.status(404).json({

          success: false,

          errore:
            "Partita non trovata"

        });

      }

      /* ======================================================
         SQUADRE
      ====================================================== */

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

      /* ======================================================
         PLAYS
      ====================================================== */

      const plays =
        estraiPlays(
          data
        );

      /* ======================================================
         DATI
      ====================================================== */

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
          competition?.status?.type ||
          competition?.status
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

      /* ======================================================
         RISPOSTA
      ====================================================== */

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
              home?.team
               ?.name ||
              ""
            ) +
            " - " +
            (
              away?.team
               ?.displayName ||
              away?.team
               ?.name ||
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

        /* ====================================================
           INFORMAZIONI
        ==================================================== */

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

        /* ====================================================
           EVENTI
        ==================================================== */

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

        /* ====================================================
           STATISTICHE
        ==================================================== */

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

        /* ====================================================
           FORMAZIONI
        ==================================================== */

        formazioni:
          formazioni,

        /* ====================================================
           CRONACA
        ==================================================== */

        cronaca:
          creaCronaca(
            plays
          ),

        /* ====================================================
           EVENTI COMPLETI
        ==================================================== */

        eventi:
          creaEventi(
            plays
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
