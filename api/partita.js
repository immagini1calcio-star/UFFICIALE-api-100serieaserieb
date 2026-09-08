const { espnFetch } = require("../lib/espn");

/*

API CALCIO 100%SERIEA&SERIEB


Endpoint:

/api/partita?id=ID_PARTITA&competizione=CODICE_ESPN

Esempio:

/api/partita?id=401874945&competizione=ita.1

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

/*

FINESTRE UFFICIALI


REGOLA:

1. Leggere competizione dall'URL
2. Cercare quella competizione in questo elenco
3. Leggere la data reale della partita da ESPN
4. Cercare la data nella relativa finestra
5. Restituire la Giornata associata alla finestra

ESPN NON PUÒ SOVRASCRIVERE UNA FINESTRA VALIDA.

*/

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

/*

CREAZIONE DELLE FINESTRE


Ogni finestra viene trasformata in:

{
  inizio: data iniziale,
  fine: data finale,
  faseTurno: "Giornata X"
}

La posizione della finestra nell'elenco è quella ufficiale
fornita per la competizione.

*/

for (const codice of Object.keys(FINESTRE_GIORNATE)) {

  FINESTRE_GIORNATE[codice] =
    FINESTRE_GIORNATE[codice].map(
      function (finestra, indice) {

        return {
          inizio: finestra[0],
          fine: finestra[1],
          faseTurno: "Giornata " + (indice + 1)
        };

      }
    );

}

/*

DATA ISO

*/

function dataISO(valore) {

  if (!valore) {
    return null;
  }

  const data = new Date(valore);

  if (isNaN(data.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "Europe/Rome",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).format(data);

}

/*

FASE DA FINESTRA

QUESTA È LA FUNZIONE FONDAMENTALE.

NON GUARDA ESPN PER DECIDERE LA GIORNATA.

GUARDA:

COMPETIZIONE
↓
FINESTRE DELLA COMPETIZIONE
↓
DATA ESPN
↓
FINESTRA
↓
FASE/TURNO

*/

function faseDaFinestra(
  competitionId,
  dataESPN
) {

  const codice =
    String(
      competitionId || ""
    )
    .trim()
    .toLowerCase();

  const finestre =
    FINESTRE_GIORNATE[codice];

  if (
  !Array.isArray(finestre) ||
    finestre.length === 0
  ) {
    return null;
  }

  const giorno =
    dataISO(dataESPN);

  if (!giorno) {
    return null;
  }

  for (
    const finestra of finestre
  ) {

    if (
      giorno >= finestra.inizio &&
      giorno <= finestra.fine
    ) {

      return {
        faseTurno:
          finestra.faseTurno,

        inizio:
          finestra.inizio,

        fine:
          finestra.fine,

        dataESPN:
          giorno,

        competizione:
          codice
      };

    }

  }

  return null;

}

/*

FUNZIONI GENERALI

*/

function ultimoCognome(nome) {

  if (!nome) {
    return null;
  }

  const testo =
    String(nome)
    .trim()
    .replace(/\s+/g, " ");

  if (!testo) {
    return null;
  }

  return testo
  .split(" ")
  .pop();

}

function nomeCompletoAtleta(atleta) {

  if (!atleta) {
    return null;
  }

  return (
    atleta.displayName ||
    atleta.fullName ||
    atleta.shortName ||
    atleta.name ||
    null
  );

}

function nomeGiocatore(p) {

  if (!p) {
    return null;
  }

  const atleta =
    p.athlete ||
    p.player ||
    p.athletesInvolved?.[0] ||
    p.participants?.[0]?.athlete ||
    p.participants?.[0]?.player ||
    null;

  return ultimoCognome(
    nomeCompletoAtleta(atleta)
  );

}

function assistGiocatore(p) {

  if (!p) {
    return null;
  }

  const atleta =
    p.assistedBy ||
    p.assist ||
    p.assistBy ||
    p.athletesInvolved?.[1] ||
    p.participants?.[1]?.athlete ||
    p.participants?.[1]?.player ||
    null;

  return ultimoCognome(
    nomeCompletoAtleta(atleta)
  );

}

function minutoEvento(p) {

  if (!p) {
    return null;
  }

  return (
    p.clock?.displayValue ||
    p.clock?.value ||
    p.time?.displayValue ||
    p.time?.value ||
    p.displayClock ||
    null
  );

}

function squadraEvento(p) {

  if (!p) {
    return null;
  }

  return (
    p.team?.displayName ||
    p.team?.name ||
    p.team?.shortDisplayName ||
    p.team?.abbreviation ||
    null
  );

}

function tipoEvento(p) {

  if (!p) {
    return "";
  }

  return String(
    p.type?.text ||
    p.type?.description ||
    p.type?.name ||
    p.type?.id ||
    p.alternativeType?.text ||
    p.text ||
    ""
  ).toLowerCase();

}

/*

TRADUZIONE EVENTI

*/

function traduciEvento(tipo) {

  const t =
    String(tipo || "")
    .toLowerCase();

  if (
    t.includes("goal") ||
    t.includes("gol") ||
    t.includes("score")
  ) {
    return "Gol";
  }

  if (
    t.includes("yellow") ||
    t.includes("giallo")
  ) {
    return "Ammonizione";
  }

  if (
    t.includes("red") ||
    t.includes("rosso")
  ) {
    return "Espulsione";
  }

  if (
    t.includes("substitution") ||
    t.includes("sostituzione") ||
    t.includes("sub")
  ) {
    return "Sostituzione";
  }

  if (
    t.includes("penalty") ||
    t.includes("rigore")
  ) {
    return "Rigore";
  }

  if (t.includes("var")) {
    return "VAR";
  }

  if (
    t.includes("half") ||
    t.includes("intermission")
  ) {
    return "Intervallo";
  }

  if (
    t.includes("kickoff") ||
    t.includes("start")
  ) {
    return "Inizio partita";
  }

  if (
    t.includes("full time") ||
    t.includes("end")
  ) {
    return "Fine partita";
  }

  return tipo || "";

}

/*

DATI SQUADRA

*/

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

  let gol = 0;

  if (
    typeof x.score === "object" &&
    x.score!== null
  ) {

    gol =
      x.score.value??
      x.score.displayValue??
      0;

  } else {

    gol =
      x.score??
      0;

  }

  const numeroGol =
    Number(gol);

  return {

    id:
      x.team?.id ||
      null,

    nome:
      x.team?.displayName ||
      x.team?.fullName ||
      x.team?.name ||
      null,

    abbreviazione:
      x.team?.abbreviation ||
      x.team?.shortDisplayName ||
      null,

    logo:
      x.team?.logo ||
      x.team?.logos?.[0]?.href ||
      null,

    gol:
      Number.isFinite(numeroGol)
      ? numeroGol
        : 0

  };

    }

/*

MARCATORI

*/

function creaMarcatori(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays

 .filter(
      function (p) {

        const tipo =
          tipoEvento(p);

        return (
          p?.scoringPlay === true ||
          p?.isScoringPlay === true ||
          tipo.includes("goal") ||
          tipo.includes("gol") ||
          tipo.includes("score")
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
            p?.ownGoal === "true" ||
            tipoEvento(p).includes("own") ||
            tipoEvento(p).includes("autogol")

        };

      }
    );

}

/*

CARTELLINI

*/

function creaCartellini(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays

 .filter(
      function (p) {

        const tipo =
          tipoEvento(p);

        return (
          tipo.includes("yellow") ||
          tipo.includes("red") ||
          tipo.includes("giallo") ||
          tipo.includes("rosso")
        );

      }
    )

 .map(
      function (p) {

        const tipo =
          tipoEvento(p);

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

      }
    );

}

/*

ESTRAZIONE ATLETA

*/

function estraiAtleta(obj) {

  if (!obj) {
    return null;
  }

  if (obj.athlete) {
    return obj.athlete;
  }

  if (obj.player) {
    return obj.player;
  }

  if (obj.participant) {
    return obj.participant;
  }

  if (
    obj.displayName ||
    obj.fullName ||
    obj.shortName ||
    obj.name
  ) {
    return obj;
  }

  return null;

}

function cognomeAtleta(obj) {

  const atleta =
    estraiAtleta(obj);

  if (!atleta) {
    return null;
  }

  return ultimoCognome(
    nomeCompletoAtleta(atleta)
  );

}

/*

SOSTITUZIONI

*/

function creaSostituzioni(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  const risultati = [];

  for (const p of plays) {

    const tipo =
      tipoEvento(p);

    const testoEvento =
      String(
        p?.text ||
        p?.description ||
        p?.type?.text ||
        ""
      ).toLowerCase();

    const eSostituzione =
      tipo.includes("substitution") ||
      tipo.includes("sostituzione") ||
      tipo.includes("sub") ||
      testoEvento.includes("substitution") ||
      testoEvento.includes("sostituzione") ||
      testoEvento.includes("entra") ||
      testoEvento.includes("esce") ||
      testoEvento.includes("replaces") ||
      testoEvento.includes("replaced");

    if (!eSostituzione) {
      continue;
    }

    let entrato = null;
    let uscito = null;

    entrato =
      p?.substitution?.in ||
      p?.substitution?.entered ||
      p?.substitution?.playerIn ||
      p?.substitution?.incoming ||
      p?.substitution?.playerInvolved ||
      null;

    uscito =
      p?.substitution?.out ||
      p?.substitution?.exited ||
      p?.substitution?.playerOut ||
      p?.substitution?.outgoing ||
      null;

    if (
      (!entrato ||!uscito) &&
      Array.isArray(
        p?.athletesInvolved
      )
    ) {

      const lista =
        p.athletesInvolved;

      for (
        const atleta of lista
      ) {

        const ruolo =
          String(
            atleta?.role ||
            atleta?.type ||
            atleta?.status ||
            atleta?.substitutionType ||
            ""
          ).toLowerCase();

        if (
          ruolo.includes("in") ||
          ruolo.includes("entered")
        ) {
          entrato = atleta;
        }

        if (
          ruolo.includes("out") ||
          ruolo.includes("exited")
        ) {
          uscito = atleta;
        }

      }

      if (
        (!entrato ||!uscito) &&
        lista.length >= 2
      ) {

        if (!entrato) {
          entrato = lista[0];
        }

        if (!uscito) {
          uscito = lista[1];
        }

      }

    }

    if (
      (!entrato ||!uscito) &&
      Array.isArray(
        p?.participants
      )
    ) {

      const lista =
        p.participants;

      for (
        const partecipante of lista
      ) {

        const ruolo =
          String(
            partecipante?.role ||
            partecipante?.type ||
            partecipante?.status ||
            partecipante?.substitutionType ||
            ""
          ).toLowerCase();

        if (
          ruolo.includes("in") ||
          ruolo.includes("entered")
        ) {
          entrato = partecipante;
        }

        if (
          ruolo.includes("out") ||
          ruolo.includes("exited")
        ) {
          uscito = partecipante;
        }

      }

      if (
        (!entrato ||!uscito) &&
        lista.length >= 2
      ) {

        if (!entrato) {
          entrato = lista[0];
        }

        if (!uscito) {
          uscito = lista[1];
        }

      }

    }

    if (
      (!entrato ||!uscito) &&
      p?.text
    ) {

      const testo =
        String(p.text);

      const match =
        testo.match(
          /^(.+?)\s+(?:for|replaces|replaced by|entra per|al posto di)\s+(.+)$/i
        );

      if (match) {

        if (!entrato) {
          entrato = {
            name:
              match[1].trim()
          };
        }

        if (!uscito) {
          uscito = {
            name:
              match[2].trim()
          };
        }

      }

    }

    risultati.push({

      minuto:
        minutoEvento(p),

      entrato:
        cognomeAtleta(
          entrato
        ),

      uscito:
        cognomeAtleta(
          uscito
        ),

      squadra:
        squadraEvento(p)

    });

  }

  return risultati;

}

/*

ARBITRI

*/

function creaArbitri(
  data,
  competition
) {

  const ufficiali =
    competition?.officials ||
    data?.officials ||
    data?.gameInfo?.officials ||
    [];

  if (!Array.isArray(ufficiali)) {
    return "";
  }

  const risultati = {

    arbitro: null,
    assistente1: null,
    assistente2: null,
    quartoUfficiale: null,
    var: null,
    avar: null

  };

  for (
    const ufficiale of ufficiali
  ) {

    const nome =
      ufficiale?.displayName ||
      ufficiale?.fullName ||
      ufficiale?.name ||
      null;

    if (!nome) {
      continue;
    }

    const ruolo =
      String(
        ufficiale?.role ||
        ufficiale?.type?.text ||
        ufficiale?.type?.name ||
        ufficiale?.position ||
        ""
      ).toLowerCase();

    if (
      ruolo.includes("referee") &&
   !ruolo.includes("assistant")
    ) {

      if (!risultati.arbitro) {
        risultati.arbitro = nome;
      }

      continue;

    }

    if (
      ruolo.includes("arbitro") &&
   !ruolo.includes("assistente")
    ) {

      if (!risultati.arbitro) {
        risultati.arbitro = nome;
      }

      continue;

    }

    if (
      ruolo.includes("assistant referee") ||
      ruolo === "assistant" ||
      ruolo.includes("assistant")
    ) {

      if (!risultati.assistente1) {
        risultati.assistente1 = nome;
      } else if (!risultati.assistente2) {
        risultati.assistente2 = nome;
      }

      continue;

    }

    if (
      ruolo.includes("fourth") ||
      ruolo.includes("4th") ||
      ruolo.includes("quarto")
    ) {

      risultati.quartoUfficiale =
        nome;

      continue;

    }

    if (
      ruolo === "var" ||
      ruolo.includes("video assistant referee") ||
      ruolo.includes("video referee")
    ) {

      risultati.var =
        nome;

      continue;

    }

    if (
      ruolo.includes("avar") ||
      ruolo.includes("assistant video assistant")
    ) {

      risultati.avar =
        nome;

    }

  }

  if (
 !risultati.arbitro &&
    ufficiali.length > 0
  ) {

    risultati.arbitro =
      ufficiali[0]?.displayName ||
      ufficiali[0]?.fullName ||
      ufficiali[0]?.name ||
      null;

  }

  const testo = [];

  if (risultati.arbitro) {
    testo.push(
      "Arbitro: " +
      risultati.arbitro
    );
  }

  if (risultati.assistente1) {
    testo.push(
      "Assistente 1: " +
      risultati.assistente1
    );
  }

  if (risultati.assistente2) {
    testo.push(
      "Assistente 2: " +
      risultati.assistente2
    );
  }

  if (risultati.quartoUfficiale) {
    testo.push(
      "Quarto ufficiale: " +
      risultati.quartoUfficiale
    );
  }

  if (risultati.var) {
    testo.push(
      "VAR: " +
      risultati.var
    );
  }

  if (risultati.avar) {
    testo.push(
      "AVAR: " +
      risultati.avar
    );
  }

  return testo.join(", ");

    }

/*

STATO

*/

function traduciStato(stato) {

  if (!stato) {
    return "In programma";
  }

  if (
    stato.completed === true ||
    stato.completata === true
  ) {
    return "Finita";
  }

  const nome =
    String(
      stato.name || ""
    ).toLowerCase();

  const descrizione =
    String(
      stato.description || ""
    ).toLowerCase();

  const statoInterno =
    String(
      stato.state || ""
    ).toLowerCase();

  if (
    statoInterno === "in" ||
    statoInterno === "live" ||
    statoInterno === "inprogress" ||
    nome.includes("progress") ||
    nome.includes("live") ||
    descrizione.includes("progress")
  ) {
    return "Live";
  }

  if (
    statoInterno === "post" ||
    nome.includes("final") ||
    nome.includes("post") ||
    descrizione.includes("final")
  ) {
    return "Finita";
  }

  if (
    nome.includes("postponed") ||
    nome.includes("posticip") ||
    descrizione.includes("postponed") ||
    descrizione.includes("posticip")
  ) {
    return "Posticipata";
  }

  if (
    nome.includes("canceled") ||
    nome.includes("cancelled") ||
    descrizione.includes("canceled") ||
    descrizione.includes("cancelled")
  ) {
    return "Annullata";
  }

  return "In programma";

}

/*

DATA E ORA ITALIANA

*/

function convertiDataOraItaliana(
  valore
) {

  if (!valore) {

    return {
      data: "",
      ora: ""
    };

  }

  try {

    const data =
      new Date(valore);

    if (
      isNaN(
        data.getTime()
      )
    ) {

      return {
        data: "",
        ora: ""
      };

    }

    return {

      data:
        new Intl.DateTimeFormat(
          "it-IT",
          {
            timeZone: "Europe/Rome",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          }
        ).format(data),

      ora:
        new Intl.DateTimeFormat(
          "it-IT",
          {
            timeZone: "Europe/Rome",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          }
        ).format(data)

    };

  } catch (errore) {

    return {
      data: "",
      ora: ""
    };

  }

}

/*

STATISTICHE

*/

function normalizzaNomeStatistica(
  nome
) {

  if (!nome) {
    return "";
  }

  return String(nome)
 .toLowerCase()
 .normalize("NFD")
 .replace(
      /[\u0300-\u036f]/g,
      ""
    )
 .replace(
      /[\s_\-\/.%]+/g,
      ""
    )
 .replace(
      /[^\w]/g,
      ""
    );

}

function trovaStatistica(
  lista,
  possibiliNomi
) {

  if (!Array.isArray(lista)) {
    return null;
  }

  const nomi =
    possibiliNomi.map(
      normalizzaNomeStatistica
    );

  for (
    const stat of lista
  ) {

    const nome =
      normalizzaNomeStatistica(
        stat?.name
      );

    const label =
      normalizzaNomeStatistica(
        stat?.label
      );

    const abbreviazione =
      normalizzaNomeStatistica(
        stat?.abbreviation
      );

    if (
      nomi.includes(nome) ||
      nomi.includes(label) ||
      nomi.includes(abbreviazione)
    ) {

      return (
        stat?.displayValue??
        stat?.value??
        null
      );

    }

  }

  return null;

}

function creaStatistiche(data) {

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
    const team of teams
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
              x?.displayValue??
              x?.value??
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

/*

FORMAZIONI

*/

function ruoloItaliano(ruolo) {

  if (!ruolo) {
    return null;
  }

  const r =
    String(ruolo)
   .toUpperCase();

  const mappa = {

    G: "Portiere",
    GK: "Portiere",

    CB: "Difensore",
    CD: "Difensore",
    "CD-L": "Difensore",
    "CD-R": "Difensore",

    LB: "Difensore",
    RB: "Difensore",
    LWB: "Difensore",
    RWB: "Difensore",

    DM: "Centrocampista",
    CM: "Centrocampista",
    "CM-L": "Centrocampista",
    "CM-R": "Centrocampista",

    LM: "Centrocampista",
    RM: "Centrocampista",

    AM: "Centrocampista",
    CAM: "Centrocampista",

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
    data?.rosters ||
    data?.lineups ||
    [];

  if (!Array.isArray(rosters)) {
    return risultato;
  }

  for (
    const r of rosters
  ) {

    const formazione = {

      modulo:
        r?.formation?.displayName ||
        r?.formation ||
        r?.formationUsed ||
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

    if (!Array.isArray(giocatori)) {
      continue;
    }

    for (
      const p of giocatori
    ) {

      const atleta =
        p?.athlete ||
        p;

      const nomeCompleto =
        atleta?.displayName ||
        atleta?.fullName ||
        atleta?.shortName ||
        atleta?.name ||
        "";

      const cognome =
        ultimoCognome(
          nomeCompleto
        );

      if (!cognome) {
        continue;
      }

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
        p?.lineupStatus === "starter" ||
        p?.status === "starter";

      const giocatore = {

        cognome:
          cognome,

        numero:
          numero,

        ruolo:
          ruoloItaliano(
            ruoloOriginale
          ),

        ruoloESPN:
          ruoloOriginale,

        titolare:
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
      idSquadra ===
        home?.team?.id
    ) {

      risultato.casa =
        formazione;

    }

    if (
      idSquadra &&
      idSquadra ===
        away?.team?.id
    ) {

      risultato.trasferta =
        formazione;

    }

  }

  return risultato;

}

/*

ESPN CORE

*/

async function espnCoreFetch(
  path
) {

  try {

    const response =
      await fetch(
        "https://sports.core.api.espn.com/v2/sports/soccer" +
        path,
        {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0",
            "Accept":
              "application/json",
            "Accept-Language":
              "it-IT,it;q=0.9"
          }
        }
      );

    if (!response.ok) {
      return null;
    }

    return await response.json();

  } catch (errore) {

    console.error(
      "Errore ESPN Core:",
      errore?.message ||
      errore
    );

    return null;

  }

}

/*

TRADUZIONE FASE ESPN

*/

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
    const [rx, out] of map
  ) {

    if (rx.test(l)) {
      return out;
    }

  }

  return t;

}

/*

FASE/TURNO ESPN DI FALLBACK

*/

function getFaseTurno(
  data,
  competition
) {

  const valori = [];

  function aggiungi(
    valore
  ) {

    if (
      valore === null ||
      valore === undefined
    ) {
      return;
    }

    if (
      typeof valore!== "string" &&
      typeof valore!== "number"
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
      typeof obj!== "object"
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
    );

    const week =
      obj.week;

    if (
      week &&
      typeof week === "object"
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
            typeof valore === "object"
          ) {

            analizza(
              valore,
              profondita + 1
            );

          }

        }
      );

  }

  analizza(
    competition,
    0
  );

  if (
    valori.length === 0
  ) {

    analizza(
      data,
      0
    );

  }

  const numeroGiornata =
    competition?.week?.number??
    data?.header?.competitions?.[0]?.week?.number??
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
    const valore of valori
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
    numeroGiornata!== null &&
    numeroGiornata!== undefined &&
    String(
      numeroGiornata
    ).trim()!== ""
  ) {

    return (
      "Giornata " +
      numeroGiornata
    );

  }

  return "";

}

/*

NUOVA LOGICA DEFINITIVA FASE/TURNO

QUESTA È LA PARTE MODIFICATA.

ORDINE:

COMPETIZIONE
    ↓
DATA REALE ESPN
    ↓
FINESTRE DELLA COMPETIZIONE
    ↓
GIORNATA DELLA FINESTRA

SOLO SE NON TROVA LA FINESTRA:

ESPN CORE
    ↓
FASE/TURNO ESPN

IMPORTANTE:

Se:

competizione = ita.1
data = 28/08/2026

la funzione restituisce:

Giornata 2

anche se ESPN contiene:

Round of 16

oppure:

League Phase

oppure qualsiasi altra fase.

*/

async function getFaseTurnoESPN(
  data,
  competition,
  competizione,
  id,
  dataESPN
) {

  const codiceCompetizione =
    String(
      competizione || ""
    )
   .trim()
   .toLowerCase();

  if (!codiceCompetizione) {
    return "";
  }

  /*

    1. DATA REALE DELLA PARTITA DA ESPN

  */

  const possibiliDate = [

    dataESPN,

    competition?.date,

    data?.header?.competitions?.[0]?.date,

    data?.header?.date,

    data?.gameInfo?.date,

    data?.date

  ];

  let dataRealeESPN = null;

  for (
    const valore of possibiliDate
  ) {

    if (!valore) {
      continue;
    }

    const dataConvertita =
      dataISO(valore);

    if (dataConvertita) {

      dataRealeESPN =
        dataConvertita;

      break;

    }

  }

  /*

    2. COMPETIZIONE → FINESTRE → DATA

  QUI ESPN NON VIENE ANCORA INTERROGATO PER LA FASE.

  Si prende esclusivamente la competizione passata
  nell'URL e si cercano le sue finestre.

  */

  const finestreCompetizione =
    FINESTRE_GIORNATE[
      codiceCompetizione
    ];

  if (
    Array.isArray(
      finestreCompetizione
    ) &&
    finestreCompetizione.length > 0 &&
    dataRealeESPN
  ) {

    for (
      const finestra of
      finestreCompetizione
    ) {

      if (
        dataRealeESPN >=
          finestra.inizio &&
        dataRealeESPN <=
          finestra.fine
      ) {

        /*

        TROVATA LA FINESTRA.

        RETURN IMMEDIATO.

        Da questo punto ESPN NON PUÒ PIÙ CAMBIARE IL RISULTATO.

        */

        return finestra.faseTurno;

      }

    }

  }

  /*

    3. LA LIGA SPOSTATA

  Se una partita della Liga è fuori dalla finestra,
  utilizziamo la giornata ufficiale ESPN.

  */

  if (
    codiceCompetizione ===
    "esp.1"
  ) {

    const ufficialeLaLiga =
      getFaseTurno(
        data,
        competition
      );

    if (
      ufficialeLaLiga &&
      /giornata\s*\d+/i.test(
        String(
          ufficialeLaLiga
        )
      )
    ) {

      return ufficialeLaLiga;

    }

  }

  /*

    4. NESSUNA FINESTRA

  Solo adesso è consentito interrogare ESPN Core.

  */

  const fonti = [];

  const competitionId =
    competition?.id ||
    data?.header?.competitions?.[0]?.id ||
    id;

  if (competitionId) {

    const coreCompetition =
      await espnCoreFetch(

        "/leagues/" +
        encodeURIComponent(
          codiceCompetizione
        ) +
        "/events/" +
        encodeURIComponent(id) +
        "/competitions/" +
        encodeURIComponent(
          competitionId
        )

      );

    if (coreCompetition) {

      fonti.push(
        coreCompetition
      );

    }

  }

  const coreEvent =
    await espnCoreFetch(

      "/leagues/" +
      encodeURIComponent(
        codiceCompetizione
      ) +
      "/events/" +
      encodeURIComponent(id)

    );

  if (coreEvent) {

    fonti.push(
      coreEvent
    );

  }

  function testoValore(
    valore
  ) {

    if (
      valore === null ||
      valore === undefined
    ) {
      return null;
    }

    if (
      typeof valore === "string" ||
      typeof valore === "number"
    ) {

      const testo =
        String(valore)
       .trim();

      return testo || null;

    }

    if (
      typeof valore!==
      "object"
    ) {
      return null;
    }

    const campi = [

      "displayName",
      "name",
      "label",
      "description",
      "shortName",
      "text",
      "abbreviation"

    ];

    for (
      const campo of campi
    ) {

      if (
        valore[campo]!==
          null &&
        valore[campo]!==
          undefined &&
        String(
          valore[campo]
        ).trim()
      ) {

        return String(
          valore[campo]
        ).trim();

      }

    }

    return null;

  }

  function cercaFase(
    obj,
    profondita
  ) {

    if (
      obj === null ||
      obj === undefined ||
      profondita > 15
    ) {

      return null;

    }

    if (
      Array.isArray(obj)
    ) {

      for (
        const elemento of obj
      ) {

        const trovato =
          cercaFase(
            elemento,
            profondita + 1
          );

        if (trovato) {
          return trovato;
        }

      }

      return null;

    }

    if (
      typeof obj!==
      "object"
    ) {

      return null;

    }

    const campiFase = [

      "round",
      "phase",
      "stage",
      "roundName",
      "phaseName",
      "stageName",
      "matchday",
      "matchDay",
      "week"

    ];

    for (
      const campo of campiFase
    ) {

      if (
        obj[campo] ===
          null ||
        obj[campo] ===
          undefined
      ) {

        continue;

      }

      const valore =
        testoValore(
          obj[campo]
        );

      if (
        valore &&
     !/^(round|phase|stage|week|matchday|season|regular season|regular-season)$/i.test(
          valore
        )
      ) {

        return valore;

      }

      if (
        typeof obj[campo] ===
        "object"
      ) {

        const numero =
          obj[campo]?.number??
          obj[campo]?.value;

        if (
          numero!== null &&
          numero!== undefined &&
          String(
            numero
          ).trim()
        ) {

          return (
            "Giornata " +
            numero
          );

        }

      }

    }

    for (
      const chiave of
      Object.keys(obj)
    ) {

      const valore =
        obj[chiave];

      if (
        valore &&
        typeof valore ===
        "object"
      ) {

        const trovato =
          cercaFase(
            valore,
            profondita + 1
          );

        if (trovato) {
          return trovato;
        }

      }

    }

    return null;

  }

  for (
    const fonte of fonti
  ) {

    const trovato =
      cercaFase(
        fonte,
        0
      );

    if (trovato) {

      return traduciFase(
        trovato
      );

    }

  }

  return (
    getFaseTurno(
      data,
      competition
    ) || ""
  );

}

/*

ENDPOINT

*/

module.exports =
  async function handler(
    req,
    res
  ) {

    try {

      const id =
        req.query.id;

      const competizione =
        String(
          req.query.competizione ||
          "ita.1"
        )
       .trim()
       .toLowerCase();

      if (!id) {

        return res
       .status(400)
       .json({

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

      /*

      CHIAMATA ESPN

      */

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

        return res
       .status(404)
       .json({

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
        Array.isArray(
          data?.plays
        )
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

      const dataESPN =
        competition?.date ||
        data?.header?.date ||
        null;

      const dataOra =
        convertiDataOraItaliana(
          dataESPN
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

      /*

      FASE/TURNO

      ATTENZIONE:

      competition code
      →
      ESPN date
      →
      FINESTRA
      →
      giornata

      */

      const faseTurno =
        await getFaseTurnoESPN(

          data,

          competition,

          competizione,

          id,

          dataESPN

        );

      const homeTeam =
        datiSquadra(
          home
        );

      const awayTeam =
        datiSquadra(
          away
        );

      /*

      RISPOSTA

      */

      return res
     .status(200)
     .json({

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
                stato === "Finita",

              minuto:
                competition?.status?.displayClock ||
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
                home?.team?.displayName ||
                ""
              ) +
              " - " +
              (
                away?.team?.displayName ||
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

          formazioni:
            formazioni,

          cronaca:

            plays.map(
              function (p) {

                return {

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
            ),

          eventi:

            plays.map(
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
            )

        });

    } catch (errore) {

      console.error(
        "Errore /api/partita:",
        errore
      );

      return res
     .status(500)
     .json({

          success: false,

          errore:
            errore?.message ||
            "Errore interno del server"

        });

    }

  };
