const { espnFetch } = require("../lib/espn");

/*

API CALCIO 100%SERIEA&SERIEB
/api/partita

FONTE UNICA:
ESPN

NESSUN BASE44
NESSUNA API CALCIO ESTERNA

*/

/* ============================================================
   COMPETIZIONI
============================================================ */

const COMPETIZIONI = {

  "ita.1": {
    nome: "Serie A",
    paese: "Italia",
    tipo: "campionato",
    giornate: 38
  },

  "ita.2": {
    nome: "Serie B",
    paese: "Italia",
    tipo: "campionato",
    giornate: 38
  },

  "ita.coppa_italia": {
    nome: "Coppa Italia",
    paese: "Italia",
    tipo: "coppa"
  },

  "ita.fifa": {
    nome: "Nazionale Italia",
    paese: "Italia",
    tipo: "nazionale"
  },

  "uefa.champions": {
    nome: "Champions League",
    paese: "Europa",
    tipo: "coppa",
    giornate: 8
  },

  "uefa.europa": {
    nome: "Europa League",
    paese: "Europa",
    tipo: "coppa",
    giornate: 8
  },

  "uefa.europa.conf": {
    nome: "Conference League",
    paese: "Europa",
    tipo: "coppa",
    giornate: 6
  },

  "fra.1": {
    nome: "Ligue 1",
    paese: "Francia",
    tipo: "campionato",
    giornate: 34
  },

  "esp.1": {
    nome: "La Liga",
    paese: "Spagna",
    tipo: "campionato",
    giornate: 38
  },

  "eng.1": {
    nome: "Premier League",
    paese: "Inghilterra",
    tipo: "campionato",
    giornate: 38
  },

  "ksa.1": {
    nome: "Saudi Pro League",
    paese: "Arabia Saudita",
    tipo: "campionato",
    giornate: 34
  },

  "por.1": {
    nome: "Liga Portugal",
    paese: "Portogallo",
    tipo: "campionato",
    giornate: 34
  },

  "ned.1": {
    nome: "Eredivisie",
    paese: "Paesi Bassi",
    tipo: "campionato",
    giornate: 34
  },

  "ger.1": {
    nome: "Bundesliga",
    paese: "Germania",
    tipo: "campionato",
    giornate: 34
  }
};

/* ============================================================
   FINESTRE GIORNATE
   Ogni finestra ha già il Fase/Turno corretto.
============================================================ */

const FINESTRE_GIORNATE = {

  /* =========================
     SERIE A
  ========================= */

  "ita.1": [
    { inizio:"2026-08-20", fine:"2026-08-25", faseTurno:"Giornata 1" },
    { inizio:"2026-08-27", fine:"2026-09-01", faseTurno:"Giornata 2" },
    { inizio:"2026-09-03", fine:"2026-09-08", faseTurno:"Giornata 3" },
    { inizio:"2026-09-10", fine:"2026-09-15", faseTurno:"Giornata 4" },
    { inizio:"2026-09-17", fine:"2026-09-22", faseTurno:"Giornata 5" },
    { inizio:"2026-10-08", fine:"2026-10-13", faseTurno:"Giornata 6" },
    { inizio:"2026-10-15", fine:"2026-10-20", faseTurno:"Giornata 7" },
    { inizio:"2026-10-22", fine:"2026-10-26", faseTurno:"Giornata 8" },
    { inizio:"2026-10-27", fine:"2026-10-30", faseTurno:"Giornata 9" },
    { inizio:"2026-10-31", fine:"2026-11-03", faseTurno:"Giornata 10" },
    { inizio:"2026-11-05", fine:"2026-11-10", faseTurno:"Giornata 11" },
    { inizio:"2026-11-19", fine:"2026-11-24", faseTurno:"Giornata 12" },
    { inizio:"2026-11-26", fine:"2026-12-01", faseTurno:"Giornata 13" },
    { inizio:"2026-12-03", fine:"2026-12-08", faseTurno:"Giornata 14" },
    { inizio:"2026-12-10", fine:"2026-12-15", faseTurno:"Giornata 15" },
    { inizio:"2026-12-17", fine:"2026-12-22", faseTurno:"Giornata 16" },
    { inizio:"2026-12-31", fine:"2027-01-05", faseTurno:"Giornata 17" },
    { inizio:"2027-01-06", fine:"2027-01-09", faseTurno:"Giornata 18" },
    { inizio:"2027-01-10", fine:"2027-01-12", faseTurno:"Giornata 19" },
    { inizio:"2027-01-14", fine:"2027-01-19", faseTurno:"Giornata 20" },
    { inizio:"2027-01-21", fine:"2027-01-26", faseTurno:"Giornata 21" },
    { inizio:"2027-01-28", fine:"2027-02-02", faseTurno:"Giornata 22" },
    { inizio:"2027-02-04", fine:"2027-02-09", faseTurno:"Giornata 23" },
    { inizio:"2027-02-11", fine:"2027-02-16", faseTurno:"Giornata 24" },
    { inizio:"2027-02-18", fine:"2027-02-23", faseTurno:"Giornata 25" },
    { inizio:"2027-02-25", fine:"2027-03-02", faseTurno:"Giornata 26" },
    { inizio:"2027-03-04", fine:"2027-03-09", faseTurno:"Giornata 27" },
    { inizio:"2027-03-11", fine:"2027-03-16", faseTurno:"Giornata 28" },
    { inizio:"2027-03-18", fine:"2027-03-23", faseTurno:"Giornata 29" },
    { inizio:"2027-04-01", fine:"2027-04-06", faseTurno:"Giornata 30" },
    { inizio:"2027-04-08", fine:"2027-04-13", faseTurno:"Giornata 31" },
    { inizio:"2027-04-15", fine:"2027-04-20", faseTurno:"Giornata 32" },
    { inizio:"2027-04-22", fine:"2027-04-27", faseTurno:"Giornata 33" },
    { inizio:"2027-04-29", fine:"2027-05-04", faseTurno:"Giornata 34" },
    { inizio:"2027-05-06", fine:"2027-05-11", faseTurno:"Giornata 35" },
    { inizio:"2027-05-13", fine:"2027-05-18", faseTurno:"Giornata 36" },
    { inizio:"2027-05-20", fine:"2027-05-25", faseTurno:"Giornata 37" },
    { inizio:"2027-05-27", fine:"2027-06-01", faseTurno:"Giornata 38" }
  ],

  /* =========================
     SERIE B
  ========================= */

  "ita.2": [
    { inizio:"2026-08-20", fine:"2026-08-25", faseTurno:"Giornata 1" },
    { inizio:"2026-08-27", fine:"2026-09-01", faseTurno:"Giornata 2" },
    { inizio:"2026-09-03", fine:"2026-09-08", faseTurno:"Giornata 3" },
    { inizio:"2026-09-10", fine:"2026-09-15", faseTurno:"Giornata 4" },
    { inizio:"2026-09-16", fine:"2026-09-22", faseTurno:"Giornata 5" },
    { inizio:"2026-10-08", fine:"2026-10-13", faseTurno:"Giornata 6" },
    { inizio:"2026-10-15", fine:"2026-10-20", faseTurno:"Giornata 7" },
    { inizio:"2026-10-22", fine:"2026-10-26", faseTurno:"Giornata 8" },
    { inizio:"2026-10-27", fine:"2026-10-30", faseTurno:"Giornata 9" },
    { inizio:"2026-10-31", fine:"2026-11-03", faseTurno:"Giornata 10" },
    { inizio:"2026-11-05", fine:"2026-11-10", faseTurno:"Giornata 11" },
    { inizio:"2026-11-19", fine:"2026-11-23", faseTurno:"Giornata 12" },
    { inizio:"2026-11-24", fine:"2026-11-27", faseTurno:"Giornata 13" },
    { inizio:"2026-11-28", fine:"2026-12-01", faseTurno:"Giornata 14" },
    { inizio:"2026-12-03", fine:"2026-12-07", faseTurno:"Giornata 15" },
    { inizio:"2026-12-08", fine:"2026-12-11", faseTurno:"Giornata 16" },
    { inizio:"2026-12-12", fine:"2026-12-15", faseTurno:"Giornata 17" },
    { inizio:"2026-12-17", fine:"2026-12-22", faseTurno:"Giornata 18" },
    { inizio:"2026-12-24", fine:"2026-12-29", faseTurno:"Giornata 19" },
    { inizio:"2027-01-07", fine:"2027-01-12", faseTurno:"Giornata 20" },
    { inizio:"2027-01-14", fine:"2027-01-19", faseTurno:"Giornata 21" },
    { inizio:"2027-01-21", fine:"2027-01-26", faseTurno:"Giornata 22" },
    { inizio:"2027-01-28", fine:"2027-02-02", faseTurno:"Giornata 23" },
    { inizio:"2027-02-04", fine:"2027-02-09", faseTurno:"Giornata 24" },
    { inizio:"2027-02-11", fine:"2027-02-16", faseTurno:"Giornata 25" },
    { inizio:"2027-02-18", fine:"2027-02-23", faseTurno:"Giornata 26" },
    { inizio:"2027-02-25", fine:"2027-03-01", faseTurno:"Giornata 27" },
    { inizio:"2027-03-02", fine:"2027-03-05", faseTurno:"Giornata 28" },
    { inizio:"2027-03-06", fine:"2027-03-09", faseTurno:"Giornata 29" },
    { inizio:"2027-03-11", fine:"2027-03-16", faseTurno:"Giornata 30" },
    { inizio:"2027-03-18", fine:"2027-03-23", faseTurno:"Giornata 31" },
    { inizio:"2027-04-01", fine:"2027-04-06", faseTurno:"Giornata 32" },
    { inizio:"2027-04-08", fine:"2027-04-13", faseTurno:"Giornata 33" },
    { inizio:"2027-04-15", fine:"2027-04-20", faseTurno:"Giornata 34" },
    { inizio:"2027-04-22", fine:"2027-04-27", faseTurno:"Giornata 35" },
    { inizio:"2027-04-29", fine:"2027-05-04", faseTurno:"Giornata 36" },
    { inizio:"2027-05-06", fine:"2027-05-11", faseTurno:"Giornata 37" },
    { inizio:"2027-05-13", fine:"2027-05-18", faseTurno:"Giornata 38" }
  ],

    /* =========================
     LA LIGA
  ========================= */

  "esp.1": [
    { inizio:"2026-08-13", fine:"2026-08-27", faseTurno:"Giornata 1" },
    { inizio:"2026-08-20", fine:"2026-08-25", faseTurno:"Giornata 2" },
    { inizio:"2026-08-27", fine:"2026-09-01", faseTurno:"Giornata 3" },
    { inizio:"2026-09-03", fine:"2026-09-08", faseTurno:"Giornata 4" },
    { inizio:"2026-09-11", fine:"2026-09-14", faseTurno:"Giornata 5" },
    { inizio:"2026-09-15", fine:"2026-09-18", faseTurno:"Giornata 6" },
    { inizio:"2026-09-19", fine:"2026-09-22", faseTurno:"Giornata 7" },
    { inizio:"2026-10-09", fine:"2026-10-13", faseTurno:"Giornata 8" },
    { inizio:"2026-10-16", fine:"2026-10-20", faseTurno:"Giornata 9" },
    { inizio:"2026-10-23", fine:"2026-10-27", faseTurno:"Giornata 10" },
    { inizio:"2026-10-30", fine:"2026-11-03", faseTurno:"Giornata 11" },
    { inizio:"2026-11-06", fine:"2026-11-10", faseTurno:"Giornata 12" },
    { inizio:"2026-11-19", fine:"2026-11-24", faseTurno:"Giornata 13" },
    { inizio:"2026-11-26", fine:"2026-12-01", faseTurno:"Giornata 14" },
    { inizio:"2026-12-03", fine:"2026-12-08", faseTurno:"Giornata 15" },
    { inizio:"2026-12-10", fine:"2026-12-15", faseTurno:"Giornata 16" },
    { inizio:"2026-12-17", fine:"2026-12-22", faseTurno:"Giornata 17" },
    { inizio:"2026-12-31", fine:"2027-01-05", faseTurno:"Giornata 18" },
    { inizio:"2027-01-07", fine:"2027-01-12", faseTurno:"Giornata 19" },
    { inizio:"2027-01-14", fine:"2027-01-19", faseTurno:"Giornata 20" },
    { inizio:"2027-01-21", fine:"2027-01-26", faseTurno:"Giornata 21" },
    { inizio:"2027-01-28", fine:"2027-02-02", faseTurno:"Giornata 22" },
    { inizio:"2027-02-04", fine:"2027-02-09", faseTurno:"Giornata 23" },
    { inizio:"2027-02-11", fine:"2027-02-16", faseTurno:"Giornata 24" },
    { inizio:"2027-02-18", fine:"2027-02-23", faseTurno:"Giornata 25" },
    { inizio:"2027-02-25", fine:"2027-03-02", faseTurno:"Giornata 26" },
    { inizio:"2027-03-04", fine:"2027-03-09", faseTurno:"Giornata 27" },
    { inizio:"2027-03-11", fine:"2027-03-16", faseTurno:"Giornata 28" },
    { inizio:"2027-03-18", fine:"2027-03-23", faseTurno:"Giornata 29" },
    { inizio:"2027-04-01", fine:"2027-04-06", faseTurno:"Giornata 30" },
    { inizio:"2027-04-08", fine:"2027-04-13", faseTurno:"Giornata 31" },
    { inizio:"2027-04-15", fine:"2027-04-20", faseTurno:"Giornata 32" },
    { inizio:"2027-04-22", fine:"2027-04-27", faseTurno:"Giornata 33" },
    { inizio:"2027-04-29", fine:"2027-05-04", faseTurno:"Giornata 34" },
    { inizio:"2027-05-06", fine:"2027-05-11", faseTurno:"Giornata 35" },
    { inizio:"2027-05-13", fine:"2027-05-18", faseTurno:"Giornata 36" },
    { inizio:"2027-05-20", fine:"2027-05-25", faseTurno:"Giornata 37" },
    { inizio:"2027-05-27", fine:"2027-05-31", faseTurno:"Giornata 38" }
  ],

  /* =========================
     PREMIER LEAGUE
  ========================= */

  "eng.1": [
    { inizio:"2026-08-20", fine:"2026-08-25", faseTurno:"Giornata 1" },
    { inizio:"2026-08-27", fine:"2026-09-01", faseTurno:"Giornata 2" },
    { inizio:"2026-09-03", fine:"2026-09-08", faseTurno:"Giornata 3" },
    { inizio:"2026-09-10", fine:"2026-09-15", faseTurno:"Giornata 4" },
    { inizio:"2026-09-17", fine:"2026-09-22", faseTurno:"Giornata 5" },
    { inizio:"2026-10-08", fine:"2026-10-13", faseTurno:"Giornata 6" },
    { inizio:"2026-10-15", fine:"2026-10-20", faseTurno:"Giornata 7" },
    { inizio:"2026-10-22", fine:"2026-10-27", faseTurno:"Giornata 8" },
    { inizio:"2026-10-29", fine:"2026-11-03", faseTurno:"Giornata 9" },
    { inizio:"2026-11-05", fine:"2026-11-10", faseTurno:"Giornata 10" },
    { inizio:"2026-11-19", fine:"2026-11-24", faseTurno:"Giornata 11" },
    { inizio:"2026-11-26", fine:"2026-12-01", faseTurno:"Giornata 12" },
    { inizio:"2026-12-01", fine:"2026-12-04", faseTurno:"Giornata 13" },
    { inizio:"2026-12-05", fine:"2026-12-08", faseTurno:"Giornata 14" },
    { inizio:"2026-12-10", fine:"2026-12-15", faseTurno:"Giornata 15" },
    { inizio:"2026-12-17", fine:"2026-12-22", faseTurno:"Giornata 16" },
    { inizio:"2026-12-24", fine:"2026-12-28", faseTurno:"Giornata 17" },
    { inizio:"2026-12-29", fine:"2027-01-01", faseTurno:"Giornata 18" },
    { inizio:"2027-01-01", fine:"2027-01-04", faseTurno:"Giornata 19" },
    { inizio:"2027-01-05", fine:"2027-01-08", faseTurno:"Giornata 20" },
    { inizio:"2027-01-16", fine:"2027-01-19", faseTurno:"Giornata 21" },
    { inizio:"2027-01-21", fine:"2027-01-26", faseTurno:"Giornata 22" },
    { inizio:"2027-01-28", fine:"2027-02-02", faseTurno:"Giornata 23" },
    { inizio:"2027-02-04", fine:"2027-02-09", faseTurno:"Giornata 24" },
    { inizio:"2027-02-09", fine:"2027-02-12", faseTurno:"Giornata 25" },
    { inizio:"2027-02-20", fine:"2027-02-23", faseTurno:"Giornata 26" },
    { inizio:"2027-02-25", fine:"2027-03-02", faseTurno:"Giornata 27" },
    { inizio:"2027-03-02", fine:"2027-03-05", faseTurno:"Giornata 28" },
    { inizio:"2027-03-11", fine:"2027-03-16", faseTurno:"Giornata 29" },
    { inizio:"2027-03-18", fine:"2027-03-23", faseTurno:"Giornata 30" },
    { inizio:"2027-04-08", fine:"2027-04-13", faseTurno:"Giornata 31" },
    { inizio:"2027-04-15", fine:"2027-04-20", faseTurno:"Giornata 32" },
    { inizio:"2027-04-22", fine:"2027-04-27", faseTurno:"Giornata 33" },
    { inizio:"2027-04-29", fine:"2027-05-04", faseTurno:"Giornata 34" },
    { inizio:"2027-05-06", fine:"2027-05-11", faseTurno:"Giornata 35" },
    { inizio:"2027-05-13", fine:"2027-05-18", faseTurno:"Giornata 36" },
    { inizio:"2027-05-20", fine:"2027-05-25", faseTurno:"Giornata 37" },
    { inizio:"2027-05-27", fine:"2027-05-30", faseTurno:"Giornata 38" }
  ],

  /* =========================
     LIGUE 1
  ========================= */

  "fra.1": [
    { inizio:"2026-08-20", fine:"2026-08-25", faseTurno:"Giornata 1" },
    { inizio:"2026-08-27", fine:"2026-09-01", faseTurno:"Giornata 2" },
    { inizio:"2026-09-03", fine:"2026-09-08", faseTurno:"Giornata 3" },
    { inizio:"2026-09-10", fine:"2026-09-15", faseTurno:"Giornata 4" },
    { inizio:"2026-09-17", fine:"2026-09-22", faseTurno:"Giornata 5" },
    { inizio:"2026-10-08", fine:"2026-10-13", faseTurno:"Giornata 6" },
    { inizio:"2026-10-15", fine:"2026-10-20", faseTurno:"Giornata 7" },
    { inizio:"2026-10-22", fine:"2026-10-27", faseTurno:"Giornata 8" },
    { inizio:"2026-10-29", fine:"2026-11-03", faseTurno:"Giornata 9" },
    { inizio:"2026-11-05", fine:"2026-11-10", faseTurno:"Giornata 10" },
    { inizio:"2026-11-19", fine:"2026-11-24", faseTurno:"Giornata 11" },
    { inizio:"2026-11-26", fine:"2026-12-01", faseTurno:"Giornata 12" },
    { inizio:"2026-12-03", fine:"2026-12-08", faseTurno:"Giornata 13" },
    { inizio:"2026-12-10", fine:"2026-12-15", faseTurno:"Giornata 14" },
    { inizio:"2026-12-31", fine:"2027-01-05", faseTurno:"Giornata 15" },
    { inizio:"2027-01-14", fine:"2027-01-19", faseTurno:"Giornata 16" },
    { inizio:"2027-01-21", fine:"2027-01-26", faseTurno:"Giornata 17" },
    { inizio:"2027-01-28", fine:"2027-02-02", faseTurno:"Giornata 18" },
    { inizio:"2027-02-04", fine:"2027-02-09", faseTurno:"Giornata 19" },
    { inizio:"2027-02-11", fine:"2027-02-16", faseTurno:"Giornata 20" },
    { inizio:"2027-02-18", fine:"2027-02-23", faseTurno:"Giornata 21" },
    { inizio:"2027-02-25", fine:"2027-03-02", faseTurno:"Giornata 22" },
    { inizio:"2027-03-04", fine:"2027-03-09", faseTurno:"Giornata 23" },
    { inizio:"2027-03-11", fine:"2027-03-16", faseTurno:"Giornata 24" },
    { inizio:"2027-03-18", fine:"2027-03-23", faseTurno:"Giornata 25" },
    { inizio:"2027-04-01", fine:"2027-04-06", faseTurno:"Giornata 26" },
    { inizio:"2027-04-08", fine:"2027-04-13", faseTurno:"Giornata 27" },
    { inizio:"2027-04-15", fine:"2027-04-20", faseTurno:"Giornata 28" },
    { inizio:"2027-04-22", fine:"2027-04-27", faseTurno:"Giornata 29" },
    { inizio:"2027-04-29", fine:"2027-05-04", faseTurno:"Giornata 30" },
    { inizio:"2027-05-06", fine:"2027-05-11", faseTurno:"Giornata 31" },
    { inizio:"2027-05-13", fine:"2027-05-18", faseTurno:"Giornata 32" },
    { inizio:"2027-05-20", fine:"2027-05-25", faseTurno:"Giornata 33" },
    { inizio:"2027-05-27", fine:"2027-05-31", faseTurno:"Giornata 34" }
  ],

  /* =========================
     BUNDESLIGA
  ========================= */

  "ger.1": [
    { inizio:"2026-08-27", fine:"2026-09-01", faseTurno:"Giornata 1" },
    { inizio:"2026-09-03", fine:"2026-09-08", faseTurno:"Giornata 2" },
    { inizio:"2026-09-10", fine:"2026-09-15", faseTurno:"Giornata 3" },
    { inizio:"2026-09-17", fine:"2026-09-22", faseTurno:"Giornata 4" },
    { inizio:"2026-10-08", fine:"2026-10-13", faseTurno:"Giornata 5" },
    { inizio:"2026-10-15", fine:"2026-10-20", faseTurno:"Giornata 6" },
    { inizio:"2026-10-22", fine:"2026-10-27", faseTurno:"Giornata 7" },
    { inizio:"2026-10-29", fine:"2026-11-03", faseTurno:"Giornata 8" },
    { inizio:"2026-11-05", fine:"2026-11-10", faseTurno:"Giornata 9" },
    { inizio:"2026-11-19", fine:"2026-11-24", faseTurno:"Giornata 10" },
    { inizio:"2026-11-26", fine:"2026-12-01", faseTurno:"Giornata 11" },
    { inizio:"2026-12-03", fine:"2026-12-08", faseTurno:"Giornata 12" },
    { inizio:"2026-12-10", fine:"2026-12-15", faseTurno:"Giornata 13" },
    { inizio:"2026-12-17", fine:"2026-12-22", faseTurno:"Giornata 14" },
    { inizio:"2027-01-07", fine:"2027-01-11", faseTurno:"Giornata 15" },
    { inizio:"2027-01-12", fine:"2027-01-15", faseTurno:"Giornata 16" },
    { inizio:"2027-01-16", fine:"2027-01-19", faseTurno:"Giornata 17" },
    { inizio:"2027-01-21", fine:"2027-01-26", faseTurno:"Giornata 18" },
    { inizio:"2027-01-28", fine:"2027-02-02", faseTurno:"Giornata 19" },
    { inizio:"2027-02-04", fine:"2027-02-09", faseTurno:"Giornata 20" },
    { inizio:"2027-02-11", fine:"2027-02-16", faseTurno:"Giornata 21" },
    { inizio:"2027-02-18", fine:"2027-02-23", faseTurno:"Giornata 22" },
    { inizio:"2027-02-25", fine:"2027-03-02", faseTurno:"Giornata 23" },
    { inizio:"2027-03-02", fine:"2027-03-05", faseTurno:"Giornata 24" },
    { inizio:"2027-03-06", fine:"2027-03-09", faseTurno:"Giornata 25" },
    { inizio:"2027-03-11", fine:"2027-03-16", faseTurno:"Giornata 26" },
    { inizio:"2027-03-18", fine:"2027-03-23", faseTurno:"Giornata 27" },
    { inizio:"2027-04-01", fine:"2027-04-06", faseTurno:"Giornata 28" },
    { inizio:"2027-04-08", fine:"2027-04-13", faseTurno:"Giornata 29" },
    { inizio:"2027-04-15", fine:"2027-04-20", faseTurno:"Giornata 30" },
    { inizio:"2027-04-22", fine:"2027-04-27", faseTurno:"Giornata 31" },
    { inizio:"2027-05-06", fine:"2027-05-11", faseTurno:"Giornata 32" },
    { inizio:"2027-05-13", fine:"2027-05-18", faseTurno:"Giornata 33" },
    { inizio:"2027-05-20", fine:"2027-05-25", faseTurno:"Giornata 34" }
  ],

  /* =========================
     LIGA PORTUGAL
  ========================= */

  "por.1": [
    { inizio:"2026-08-06", fine:"2026-08-11", faseTurno:"Giornata 1" },
    { inizio:"2026-08-13", fine:"2026-08-18", faseTurno:"Giornata 2" },
    { inizio:"2026-08-20", fine:"2026-08-25", faseTurno:"Giornata 3" },
    { inizio:"2026-08-27", fine:"2026-09-01", faseTurno:"Giornata 4" },
    { inizio:"2026-09-03", fine:"2026-09-08", faseTurno:"Giornata 5" },
    { inizio:"2026-09-10", fine:"2026-09-15", faseTurno:"Giornata 6" },
    { inizio:"2026-09-17", fine:"2026-09-22", faseTurno:"Giornata 7" },
    { inizio:"2026-10-08", fine:"2026-10-13", faseTurno:"Giornata 8" },
    { inizio:"2026-10-22", fine:"2026-10-27", faseTurno:"Giornata 9" },
    { inizio:"2026-10-29", fine:"2026-11-03", faseTurno:"Giornata 10" },
    { inizio:"2026-11-05", fine:"2026-11-10", faseTurno:"Giornata 11" },
    { inizio:"2026-11-26", fine:"2026-12-01", faseTurno:"Giornata 12" },
    { inizio:"2026-12-03", fine:"2026-12-08", faseTurno:"Giornata 13" },
    { inizio:"2026-12-10", fine:"2026-12-15", faseTurno:"Giornata 14" },
    { inizio:"2026-12-17", fine:"2026-12-22", faseTurno:"Giornata 15" },
    { inizio:"2026-12-24", fine:"2026-12-29", faseTurno:"Giornata 16" },
    { inizio:"2027-01-07", fine:"2027-01-12", faseTurno:"Giornata 17" },
    { inizio:"2027-01-14", fine:"2027-01-19", faseTurno:"Giornata 18" },
    { inizio:"2027-01-21", fine:"2027-01-26", faseTurno:"Giornata 19" },
    { inizio:"2027-01-28", fine:"2027-02-02", faseTurno:"Giornata 20" },
    { inizio:"2027-02-04", fine:"2027-02-09", faseTurno:"Giornata 21" },
    { inizio:"2027-02-11", fine:"2027-02-16", faseTurno:"Giornata 22" },
    { inizio:"2027-02-18", fine:"2027-02-23", faseTurno:"Giornata 23" },
    { inizio:"2027-02-25", fine:"2027-03-02", faseTurno:"Giornata 24" },
    { inizio:"2027-03-04", fine:"2027-03-09", faseTurno:"Giornata 25" },
    { inizio:"2027-03-11", fine:"2027-03-16", faseTurno:"Giornata 26" },
    { inizio:"2027-03-18", fine:"2027-03-23", faseTurno:"Giornata 27" },
    { inizio:"2027-04-01", fine:"2027-04-06", faseTurno:"Giornata 28" },

    /* CORRETTO COME RICHIESTO */
    { inizio:"2027-04-09", fine:"2027-04-12", faseTurno:"Giornata 29" },
    { inizio:"2027-04-16", fine:"2027-04-19", faseTurno:"Giornata 30" },

    { inizio:"2027-04-22", fine:"2027-04-27", faseTurno:"Giornata 31" },
    { inizio:"2027-04-29", fine:"2027-05-04", faseTurno:"Giornata 32" },
    { inizio:"2027-05-06", fine:"2027-05-11", faseTurno:"Giornata 33" },
    { inizio:"2027-05-13", fine:"2027-05-18", faseTurno:"Giornata 34" }
  ],

  /* =========================
     EREDIVISIE
  ========================= */

  "ned.1": [
    { inizio:"2026-08-06", fine:"2026-08-11", faseTurno:"Giornata 1" },
    { inizio:"2026-08-13", fine:"2026-08-18", faseTurno:"Giornata 2" },
    { inizio:"2026-08-20", fine:"2026-08-25", faseTurno:"Giornata 3" },
    { inizio:"2026-08-27", fine:"2026-09-01", faseTurno:"Giornata 4" },
    { inizio:"2026-09-03", fine:"2026-09-08", faseTurno:"Giornata 5" },
    { inizio:"2026-09-10", fine:"2026-09-15", faseTurno:"Giornata 6" },
    { inizio:"2026-09-17", fine:"2026-09-22", faseTurno:"Giornata 7" },
    { inizio:"2026-10-08", fine:"2026-10-13", faseTurno:"Giornata 8" },
    { inizio:"2026-10-15", fine:"2026-10-20", faseTurno:"Giornata 9" },
    { inizio:"2026-10-22", fine:"2026-10-27", faseTurno:"Giornata 10" },
    { inizio:"2026-10-29", fine:"2026-11-03", faseTurno:"Giornata 11" },
    { inizio:"2026-11-05", fine:"2026-11-10", faseTurno:"Giornata 12" },
    { inizio:"2026-11-19", fine:"2026-11-24", faseTurno:"Giornata 13" },
    { inizio:"2026-11-26", fine:"2026-12-01", faseTurno:"Giornata 14" },
    { inizio:"2026-12-03", fine:"2026-12-08", faseTurno:"Giornata 15" },
    { inizio:"2026-12-10", fine:"2026-12-15", faseTurno:"Giornata 16" },
    { inizio:"2026-12-17", fine:"2026-12-22", faseTurno:"Giornata 17" },
    { inizio:"2027-01-07", fine:"2027-01-12", faseTurno:"Giornata 18" },
    { inizio:"2027-01-14", fine:"2027-01-19", faseTurno:"Giornata 19" },
    { inizio:"2027-01-21", fine:"2027-01-26", faseTurno:"Giornata 20" },
    { inizio:"2027-01-28", fine:"2027-02-02", faseTurno:"Giornata 21" },
    { inizio:"2027-02-11", fine:"2027-02-16", faseTurno:"Giornata 22" },
    { inizio:"2027-02-18", fine:"2027-02-23", faseTurno:"Giornata 23" },
    { inizio:"2027-02-25", fine:"2027-03-02", faseTurno:"Giornata 24" },
    { inizio:"2027-03-04", fine:"2027-03-09", faseTurno:"Giornata 25" },
    { inizio:"2027-03-11", fine:"2027-03-16", faseTurno:"Giornata 26" },
    { inizio:"2027-03-18", fine:"2027-03-23", faseTurno:"Giornata 27" },
    { inizio:"2027-04-01", fine:"2027-04-06", faseTurno:"Giornata 28" },
    { inizio:"2027-04-08", fine:"2027-04-13", faseTurno:"Giornata 29" },
    { inizio:"2027-04-22", fine:"2027-04-27", faseTurno:"Giornata 30" },
    { inizio:"2027-04-29", fine:"2027-05-04", faseTurno:"Giornata 31" },
    { inizio:"2027-05-06", fine:"2027-05-11", faseTurno:"Giornata 32" },
    { inizio:"2027-05-13", fine:"2027-05-18", faseTurno:"Giornata 33" },
    { inizio:"2027-05-20", fine:"2027-05-25", faseTurno:"Giornata 34" }
  ],

  /* =========================
     SAUDI PRO LEAGUE
  ========================= */

  "ksa.1": [
    { inizio:"2026-08-13", fine:"2026-08-18", faseTurno:"Giornata 1" },
    { inizio:"2026-08-20", fine:"2026-08-25", faseTurno:"Giornata 2" },
    { inizio:"2026-08-27", fine:"2026-09-01", faseTurno:"Giornata 3" },
    { inizio:"2026-09-03", fine:"2026-09-08", faseTurno:"Giornata 4" },
    { inizio:"2026-09-10", fine:"2026-09-15", faseTurno:"Giornata 5" },
    { inizio:"2026-09-17", fine:"2026-09-22", faseTurno:"Giornata 6" },
    { inizio:"2026-09-24", fine:"2026-09-29", faseTurno:"Giornata 7" },
    { inizio:"2026-10-09", fine:"2026-10-11", faseTurno:"Giornata 8" },
    { inizio:"2026-10-15", fine:"2026-10-17", faseTurno:"Giornata 9" },
    { inizio:"2026-10-18", fine:"2026-10-20", faseTurno:"Giornata 10" },
    { inizio:"2026-10-23", fine:"2026-10-27", faseTurno:"Giornata 11" },
    { inizio:"2026-10-29", fine:"2026-11-03", faseTurno:"Giornata 12" },
    { inizio:"2026-11-05", fine:"2026-11-10", faseTurno:"Giornata 13" },
    { inizio:"2026-11-19", fine:"2026-11-24", faseTurno:"Giornata 14" },
    { inizio:"2026-11-26", fine:"2026-12-01", faseTurno:"Giornata 15" },
    { inizio:"2026-12-03", fine:"2026-12-08", faseTurno:"Giornata 16" },
    { inizio:"2026-12-10", fine:"2026-12-15", faseTurno:"Giornata 17" },
    { inizio:"2026-12-17", fine:"2026-12-22", faseTurno:"Giornata 18" },
    { inizio:"2026-12-24", fine:"2026-12-29", faseTurno:"Giornata 19" },
    { inizio:"2027-02-04", fine:"2027-02-09", faseTurno:"Giornata 20" },
    { inizio:"2027-02-11", fine:"2027-02-16", faseTurno:"Giornata 21" },
    { inizio:"2027-02-18", fine:"2027-02-23", faseTurno:"Giornata 22" },
    { inizio:"2027-02-25", fine:"2027-03-02", faseTurno:"Giornata 23" },
    { inizio:"2027-03-04", fine:"2027-03-09", faseTurno:"Giornata 24" },
    { inizio:"2027-03-11", fine:"2027-03-16", faseTurno:"Giornata 25" },
    { inizio:"2027-03-18", fine:"2027-03-23", faseTurno:"Giornata 26" },
    { inizio:"2027-04-01", fine:"2027-04-06", faseTurno:"Giornata 27" },
    { inizio:"2027-04-08", fine:"2027-04-13", faseTurno:"Giornata 28" },
    { inizio:"2027-04-15", fine:"2027-04-20", faseTurno:"Giornata 29" },
    { inizio:"2027-04-22", fine:"2027-04-27", faseTurno:"Giornata 30" },
    { inizio:"2027-04-29", fine:"2027-05-04", faseTurno:"Giornata 31" },
    { inizio:"2027-05-06", fine:"2027-05-11", faseTurno:"Giornata 32" },
    { inizio:"2027-05-13", fine:"2027-05-18", faseTurno:"Giornata 33" },
    { inizio:"2027-05-27", fine:"2027-05-29", faseTurno:"Giornata 34" }
  ]
};

/* ============================================================
   FINESTRE UEFA
============================================================ */

FINESTRE_GIORNATE["uefa.champions"] = [
  { inizio:"2026-09-08", fine:"2026-09-11", faseTurno:"Giornata 1" },
  { inizio:"2026-10-13", fine:"2026-10-16", faseTurno:"Giornata 2" },
  { inizio:"2026-10-20", fine:"2026-10-23", faseTurno:"Giornata 3" },
  { inizio:"2026-11-03", fine:"2026-11-06", faseTurno:"Giornata 4" },
  { inizio:"2026-11-24", fine:"2026-11-27", faseTurno:"Giornata 5" },
  { inizio:"2026-12-08", fine:"2026-12-11", faseTurno:"Giornata 6" },
  { inizio:"2027-01-19", fine:"2027-01-22", faseTurno:"Giornata 7" },
  { inizio:"2027-01-27", fine:"2027-01-30", faseTurno:"Giornata 8" }
];

FINESTRE_GIORNATE["uefa.europa"] = [
  { inizio:"2026-09-15", fine:"2026-09-18", faseTurno:"Giornata 1" },
  { inizio:"2026-10-13", fine:"2026-10-16", faseTurno:"Giornata 2" },
  { inizio:"2026-10-20", fine:"2026-10-23", faseTurno:"Giornata 3" },
  { inizio:"2026-11-03", fine:"2026-11-06", faseTurno:"Giornata 4" },
  { inizio:"2026-11-24", fine:"2026-11-27", faseTurno:"Giornata 5" },
  { inizio:"2026-12-08", fine:"2026-12-11", faseTurno:"Giornata 6" },
  { inizio:"2027-01-19", fine:"2027-01-22", faseTurno:"Giornata 7" },
  { inizio:"2027-01-27", fine:"2027-01-30", faseTurno:"Giornata 8" }
];

FINESTRE_GIORNATE["uefa.europa.conf"] = [
  { inizio:"2026-10-13", fine:"2026-10-16", faseTurno:"Giornata 1" },
  { inizio:"2026-10-20", fine:"2026-10-23", faseTurno:"Giornata 2" },
  { inizio:"2026-11-03", fine:"2026-11-06", faseTurno:"Giornata 3" },
  { inizio:"2026-11-24", fine:"2026-11-27", faseTurno:"Giornata 4" },
  { inizio:"2026-12-08", fine:"2026-12-11", faseTurno:"Giornata 5" },
  { inizio:"2026-12-15", fine:"2026-12-18", faseTurno:"Giornata 6" }
];

/* ============================================================
   UTILITÀ
============================================================ */

function testoValido(valore) {

  if (
    valore === null ||
    valore === undefined
  ) {
    return null;
  }

  const testo =
    String(valore).trim();

  return testo || null;
}

function normalizzaTesto(valore) {

  return String(valore || "")
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g, "")
   .toLowerCase()
   .replace(/[^a-z0-9]+/g, " ")
   .trim();
}

function ultimoCognome(nome) {

  const testo =
    testoValido(nome);

  if (!testo) {
    return null;
  }

  const parti =
    testo
     .replace(/\s+/g, " ")
     .trim()
     .split(" ");

  return parti[parti.length - 1];
}

function nomeAtleta(atleta) {

  if (!atleta) {
    return null;
  }

  if (atleta.athlete) {
    atleta = atleta.athlete;
  }

  if (atleta.player) {
    atleta = atleta.player;
  }

  return (
    atleta.displayName ||
    atleta.fullName ||
    atleta.shortName ||
    atleta.name ||
    null
  );
}

function cognomeAtleta(atleta) {

  if (!atleta) {
    return null;
  }

  return ultimoCognome(
    nomeAtleta(atleta)
  );
}

/* ============================================================
   NOMI SQUADRE
============================================================ */

const ALIAS_SQUADRE = {

  "athletic club": "Atletico Bilbao",
  "athletic bilbao": "Atletico Bilbao",

  "internazionale": "Inter",
  "internazionale milano": "Inter",
  "inter milan": "Inter",
  "internazionale fc": "Inter",
  "fc internazionale": "Inter",

  "al riyadh": "Riyadh",
  "al riyaadh": "Riyadh",
  "riyadh sc": "Riyadh",

  "ac milan": "Milan",
  "milan ac": "Milan",

  "ssc napoli": "Napoli",

  "as roma": "Roma",

  "ss lazio": "Lazio",

  "como 1907": "Como",

  "acf fiorentina": "Fiorentina",

  "genoa cfc": "Genoa",

  "parma calcio": "Parma",

  "us sassuolo": "Sassuolo",

  "us lecce": "Lecce",

  "cagliari calcio": "Cagliari",

  "ac monza": "Monza",

  "venezia fc": "Venezia",

  "frosinone calcio": "Frosinone",

  "juventus fc": "Juventus",

  "juventus turin": "Juventus",

  "real betis": "Betis",

  "sevilla fc": "Siviglia",

  "athletic": "Atletico Bilbao",

  "rb leipzig": "Lipsia",
  "rasenballsport leipzig": "Lipsia",

  "bayern munich": "Bayern Monaco",
  "bayern munchen": "Bayern Monaco",

  "eintracht frankfurt": "Francoforte",

  "sc freiburg": "Friburgo",

  "vfb stuttgart": "Stoccarda",

  "union berlin": "Union Berlino",

  "werder bremen": "Werder Brema",

  "tottenham hotspur": "Tottenham",

  "newcastle united": "Newcastle",

  "brighton and hove albion": "Brighton",

  "manchester united fc": "Manchester United",

  "manchester city fc": "Manchester City",

  "paris saint germain": "PSG",
  "paris saint germain fc": "PSG",

  "olympique lyonnais": "Lione",

  "olympique marseille": "Marsiglia",

  "lille osc": "Lilla",

  "ogc nice": "Nizza",

  "psv eindhoven": "PSV Eindhoven",

  "sl benfica": "Benfica",

  "fc porto": "Porto",

  "sporting cp": "Sporting",

  "sporting lisbon": "Sporting",

  "sc braga": "Braga",

  "vitoria sc": "Vitoria Guimaraes",

  "al ahli": "Al Ahli",

  "al ahly": "Al Ahli",

  "al nassr fc": "Al Nassr",

  "al hilal saudi fc": "Al Hilal",

  "al ittihad club": "Al Ittihad"
};

function normalizzaNomeSquadra(nome) {

  const originale =
    testoValido(nome);

  if (!originale) {
    return null;
  }

  const chiave =
    normalizzaTesto(
      originale
    );

  if (
    ALIAS_SQUADRE[chiave]
  ) {
    return ALIAS_SQUADRE[chiave];
  }

  return originale;
}

/* ============================================================
   SQUADRA EVENTO
============================================================ */

function squadraEvento(play) {

  if (!play) {
    return null;
  }

  const nome =
    play.team?.displayName ||
    play.team?.fullName ||
    play.team?.name ||
    play.team?.shortDisplayName ||
    play.team?.abbreviation ||
    null;

  return normalizzaNomeSquadra(
    nome
  );
}

/* ============================================================
   MINUTO
============================================================ */

function minutoEvento(play) {

  if (!play) {
    return null;
  }

  return (
    testoValido(
      play.clock?.displayValue
    ) ||
    testoValido(
      play.clock?.value
    ) ||
    testoValido(
      play.time?.displayValue
    ) ||
    testoValido(
      play.time?.value
    ) ||
    testoValido(
      play.displayClock
    ) ||
    testoValido(
      play.minute
    ) ||
    null
  );
}

/* ============================================================
   TIPO EVENTO
============================================================ */

function tipoEvento(play) {

  if (!play) {
    return "";
  }

  return String(

    play.type?.text ||

    play.type?.description ||

    play.type?.name ||

    play.type?.id ||

    play.alternativeType?.text ||

    ""
  ).toLowerCase();
}

function testoEvento(play) {

  return String(

    play?.text ||

    play?.description ||

    play?.type?.text ||

    ""

  ).trim();
}

function atletaEvento(play) {

  if (!play) {
    return null;
  }

  return (

    play.athlete ||

    play.player ||

    play.participants?.[0]?.athlete ||

    play.participants?.[0]?.player ||

    play.athletesInvolved?.[0] ||

    null
  );
}

/* ============================================================
   ESPN CORE
============================================================ */

async function espnCoreFetch(path) {

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

      console.error(
        "ESPN CORE HTTP",
        response.status,
        path
      );

      return null;
    }

    return await response.json();

  } catch (errore) {

    console.error(
      "Errore ESPN CORE:",
      errore?.message ||
      errore
    );

    return null;
  }
}

/* ============================================================
   ESPN CDN
============================================================ */

async function espnCdnFetch(
  competizione,
  eventId
) {

  try {

    const url =
      "https://cdn.espn.com/core/soccer/game" +
      "?xhr=1" +
      "&gameId=" +
      encodeURIComponent(
        eventId
      ) +
      "&league=" +
      encodeURIComponent(
        competizione
      );

    const response =
      await fetch(
        url,
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

    const json =
      await response.json();

    return (
      json?.gamepackageJSON ||
      json ||
      null
    );

  } catch (errore) {

    console.error(
      "Errore ESPN CDN:",
      errore?.message ||
      errore
    );

    return null;
  }
}

/* ============================================================
   SQUADRE
============================================================ */

function datiSquadra(
  competitor
) {

  if (!competitor) {

    return {

      id: null,

      nome: null,

      abbreviazione: null,

      logo: null,

      gol: null
    };
  }

  let gol = null;

  if (
    competitor.score!== null &&
    competitor.score!== undefined
  ) {

    if (
      typeof competitor.score ===
      "object"
    ) {

      gol =
        competitor.score.value??
        competitor.score.displayValue??
        null;

    } else {

      gol =
        competitor.score;
    }
  }

  if (
    gol!== null &&
    gol!== undefined &&
    gol!== ""
  ) {

    const numero =
      Number(gol);

    if (
      Number.isFinite(numero)
    ) {

      gol =
        numero;
    }
  }

  const nomeOriginale =

    competitor.team?.displayName ||

    competitor.team?.fullName ||

    competitor.team?.name ||

    null;

  return {

    id:
      competitor.team?.id ||
      competitor.id ||
      null,

    nome:
      normalizzaNomeSquadra(
        nomeOriginale
      ),

    abbreviazione:
      competitor.team?.abbreviation ||
      competitor.team?.shortDisplayName ||
      null,

    logo:
      competitor.team?.logo ||
      competitor.team?.logos?.[0]?.href ||
      null,

    gol:
      gol
  };
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

  const risultati = [];

  for (
    const play
    of plays
  ) {

    const tipo =
      tipoEvento(play);

    const testo =
      testoEvento(play)
       .toLowerCase();

    const eGol =

      play?.scoringPlay === true ||

      play?.isScoringPlay === true ||

      tipo.includes("goal") ||

      tipo.includes("gol") ||

      tipo.includes("score");

    if (!eGol) {
      continue;
    }

    const atleta =
      atletaEvento(play);

    const giocatore =
      cognomeAtleta(
        atleta
      );

    const assist =
      cognomeAtleta(

        play?.assistedBy ||

        play?.assist ||

        play?.participants?.[1]?.athlete ||

        play?.participants?.[1]?.player ||

        play?.athletesInvolved?.[1]
      );

    const rigore =

      play?.penalty === true ||

      play?.penaltyGoal === true ||

      play?.isPenalty === true ||

      testo.includes("penalty") ||

      testo.includes("rigore");

    const autogol =

      play?.ownGoal === true ||

      play?.ownGoal === "true" ||

      testo.includes("own goal") ||

      testo.includes("autogol");

    let testoOutput =

      (
        minutoEvento(play) ||
        "?"
      ) +

      " - " +

      (
        squadraEvento(play) ||
        "Squadra"
      ) +

      " - " +

      (
        giocatore ||
        "Giocatore"
      );

    if (rigore) {
      testoOutput += " (R.)";
    }

    if (autogol) {
      testoOutput += " (AG.)";
    }

    risultati.push({

      minuto:
        minutoEvento(play),

      squadra:
        squadraEvento(play),

      giocatore:
        giocatore,

      assist:
        assist,

      rigore:
        rigore,

      autogol:
        autogol,

      testo:
        testoOutput
    });
  }

  return risultati;
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

  const risultati = [];

  for (
    const play
    of plays
  ) {

    const tipo =
      tipoEvento(play);

    const testo =
      testoEvento(play)
       .toLowerCase();

    let cartellino = null;

    if (

      tipo.includes("yellow") ||

      tipo.includes("giallo") ||

      testo.includes("yellow card") ||

      testo.includes("ammon")
    ) {

      cartellino =
        "Giallo";
    }

    if (

      tipo.includes("red") ||

      tipo.includes("rosso") ||

      testo.includes("red card") ||

      testo.includes("espuls")
    ) {

      cartellino =
        "Rosso";
    }

    if (!cartellino) {
      continue;
    }

    const minuto =
      minutoEvento(play);

    const giocatore =
      cognomeAtleta(
        atletaEvento(play)
      );

    const squadra =
      squadraEvento(play);

    const simbolo =
      cartellino === "Rosso"
       ? "🟥"
        : "🟨";

    risultati.push({

      minuto:
        minuto,

      giocatore:
        giocatore,

      squadra:
        squadra,

      tipo:
        cartellino,

      simbolo:
        simbolo,

      testo:

        (
          minuto ||
          "?"
        ) +

        " - " +

        (
          giocatore ||
          "Giocatore"
        ) +

        " - " +

        (
          squadra ||
          "Squadra"
        ) +

        " - " +

        simbolo +
        " " +
        cartellino
    });
  }

  return risultati;
}

/* ============================================================
   CERCA GIOCATORI
============================================================ */

function cercaGiocatori(
  obj
) {

  if (!obj) {
    return [];
  }

  const risultati = [];

  function visita(
    valore,
    profondita
  ) {

    if (
      valore === null ||
      valore === undefined ||
      profondita > 10
    ) {
      return;
    }

    if (
      Array.isArray(valore)
    ) {

      for (
        const elemento
        of valore
      ) {

        visita(
          elemento,
          profondita + 1
        );
      }

      return;
    }

    if (
      typeof valore!== "object"
    ) {
      return;
    }

    if (
      valore.athlete ||
      valore.player
    ) {

      const atleta =
        valore.athlete ||
        valore.player;

      if (
        nomeAtleta(atleta)
      ) {

        risultati.push({
          atleta:
            atleta,

          sorgente:
            valore
        });
      }
    }

    for (
      const chiave
      of Object.keys(valore)
    ) {

      const figlio =
        valore[chiave];

      if (
        figlio &&
        typeof figlio === "object"
      ) {

        visita(
          figlio,
          profondita + 1
        );
      }
    }
  }

  visita(obj, 0);

  return risultati;
}

/* ============================================================
   SOSTITUZIONI
============================================================ */

function estraiSostituzioneDaTesto(
  testo
) {

  const valore =
    String(
      testo || ""
    ).trim();

  if (!valore) {

    return {
      entra: null,
      esce: null
    };
  }

  let match =
    valore.match(
      /^(.+?)\s+(?:for|replaces|replaced by)\s+(.+)$/i
    );

  if (match) {

    return {

      entra:
        ultimoCognome(
          match[1]
        ),

      esce:
        ultimoCognome(
          match[2]
        )
    };
  }

  match =
    valore.match(
      /^(.+?)\s+(?:entra per|entra al posto di|al posto di)\s+(.+)$/i
    );

  if (match) {

    return {

      entra:
        ultimoCognome(
          match[1]
        ),

      esce:
        ultimoCognome(
          match[2]
        )
    };
  }

  return {
    entra: null,
    esce: null
  };
}

function creaSostituzioni(
  plays
) {

  if (!Array.isArray(plays)) {
    return [];
  }

  const risultati = [];

  for (
    const play
    of plays
  ) {

    const tipo =
      tipoEvento(play);

    const testo =
      testoEvento(play);

    const lower =
      testo.toLowerCase();

    const eSostituzione =

      tipo.includes("substitution") ||

      tipo.includes("substitute") ||

      tipo.includes("sostituzione") ||

      lower.includes("substitution") ||

      lower.includes("substituted") ||

      lower.includes("replaces") ||

      lower.includes("replaced") ||

      lower.includes("entra") ||

      lower.includes("esce");

    if (!eSostituzione) {
      continue;
    }

    let entrato =

      play?.substitution?.in ||

      play?.substitution?.entered ||

      play?.substitution?.playerIn ||

      play?.substitution?.incoming ||

      play?.playerIn ||

      play?.athleteIn ||

      null;

    let uscito =

      play?.substitution?.out ||

      play?.substitution?.exited ||

      play?.substitution?.playerOut ||

      play?.substitution?.outgoing ||

      play?.playerOut ||

      play?.athleteOut ||

      null;

    /* participants */

    if (
      (!entrato ||!uscito) &&
      Array.isArray(
        play?.participants
      )
    ) {

      for (
        const partecipante
        of play.participants
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

          ruolo.includes("enter") ||

          ruolo.includes("on")
        ) {

          entrato =
            entrato ||
            partecipante;
        }

        if (

          ruolo.includes("out") ||

          ruolo.includes("exit") ||

          ruolo.includes("off")
        ) {

          uscito =
            uscito ||
            partecipante;
        }
      }

      if (
        (!entrato ||!uscito) &&
        play.participants.length >= 2
      ) {

        if (!uscito) {
          uscito =
            play.participants[0];
        }

        if (!entrato) {
          entrato =
            play.participants[1];
        }
      }
    }

    /* athletesInvolved */

    if (
      (!entrato ||!uscito) &&
      Array.isArray(
        play?.athletesInvolved
      )
    ) {

      for (
        const atleta
        of play.athletesInvolved
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

          ruolo.includes("enter") ||

          ruolo.includes("on")
        ) {

          entrato =
            entrato ||
            atleta;
        }

        if (

          ruolo.includes("out") ||

          ruolo.includes("exit") ||

          ruolo.includes("off")
        ) {

          uscito =
            uscito ||
            atleta;
        }
      }

      if (
        (!entrato ||!uscito) &&
        play.athletesInvolved.length >= 2
      ) {

        if (!uscito) {
          uscito =
            play.athletesInvolved[0];
        }

        if (!entrato) {
          entrato =
            play.athletesInvolved[1];
        }
      }
    }

    /* testo */

    if (
     !entrato ||
     !uscito
    ) {

      const estratto =
        estraiSostituzioneDaTesto(
          testo
        );

      if (
       !entrato &&
        estratto.entra
      ) {

        entrato = {
          displayName:
            estratto.entra
        };
      }

      if (
       !uscito &&
        estratto.esce
      ) {

        uscito = {
          displayName:
            estratto.esce
        };
      }
    }

    /* ultimo tentativo */

    if (
     !entrato ||
     !uscito
    ) {

      const giocatori =
        cercaGiocatori(
          play
        );

      if (
        giocatori.length >= 2
      ) {

        if (!uscito) {

          uscito =
            giocatori[0].atleta;
        }

        if (!entrato) {

          entrato =
            giocatori[1].atleta;
        }
      }
    }

    const cognomeEntrato =
      cognomeAtleta(
        entrato
      );

    const cognomeUscito =
      cognomeAtleta(
        uscito
      );

    if (
     !cognomeEntrato &&
     !cognomeUscito
    ) {
      continue;
    }

    const minuto =
      minutoEvento(play);

    const squadra =
      squadraEvento(play);

    risultati.push({

      minuto:
        minuto,

      squadra:
        squadra,

      entra:
        cognomeEntrato,

      esce:
        cognomeUscito,

      entrato:
        cognomeEntrato,

      uscito:
        cognomeUscito,

      testo:

        (
          minuto ||
          "?"
        ) +

        " - " +

        (
          squadra ||
          "Squadra"
        ) +

        " - ENTRA " +

        (
          cognomeEntrato ||
          "?"
        ) +

        " - ESCE " +

        (
          cognomeUscito ||
          "?"
        )
    });
  }

  return risultati;
}

/* ============================================================
   DATA / ORA
============================================================ */

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
            timeZone:
              "Europe/Rome",

            day:
              "2-digit",

            month:
              "2-digit",

            year:
              "numeric"
          }
        ).format(data),

      ora:

        new Intl.DateTimeFormat(
          "it-IT",
          {
            timeZone:
              "Europe/Rome",

            hour:
              "2-digit",

            minute:
              "2-digit",

            hour12:
              false
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

/* ============================================================
   STATISTICHE
============================================================ */

function normalizzaStatistica(
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

function valoreStatistica(
  stat
) {

  if (!stat) {
    return null;
  }

  const candidati = [

    stat.displayValue,

    stat.value,

    stat.displayValueText,

    stat.text,

    stat.display
  ];

  for (
    const valore
    of candidati
  ) {

    if (
      valore!== null &&
      valore!== undefined &&
      String(valore).trim()!== ""
    ) {

      return valore;
    }
  }

  return null;
}

function trovaStatistica(
  lista,
  nomi
) {

  if (!Array.isArray(lista)) {
    return null;
  }

  const cercati =
    nomi.map(
      normalizzaStatistica
    );

  for (
    const stat
    of lista
  ) {

    const campi = [

      stat?.name,

      stat?.label,

      stat?.displayName,

      stat?.shortDisplayName,

      stat?.abbreviation
    ]
     .filter(Boolean)
     .map(
        normalizzaStatistica
      );

    if (
      campi.some(
        campo =>
          cercati.includes(campo)
      )
    ) {

      const valore =
        valoreStatistica(
          stat
        );

      if (
        valore!== null
      ) {

        return valore;
      }
    }
  }

  return null;
}

function listaStatisticheTeam(
  team
) {

  if (!team) {
    return [];
  }

  const possibili = [

    team.statistics,

    team.stats,

    team.statistic,

    team.statistics?.items
  ];

  for (
    const lista
    of possibili
  ) {

    if (
      Array.isArray(lista)
    ) {

      return lista;
    }
  }

  return [];
}

function valoriStatistiche(
  lista
) {

  return {

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
}

function creaBloccoStatistiche(
  lista
) {

  if (!Array.isArray(lista)) {
    return [];
  }

  return lista

   .map(function(stat) {

      return {

        nome:
          stat?.name ||
          stat?.label ||
          stat?.displayName ||
          null,

        label:
          stat?.label ||
          stat?.displayName ||
          stat?.name ||
          null,

        valore:
          valoreStatistica(
            stat
          )
      };
    })

   .filter(
      stat =>
        stat.valore!== null
    );
}

function statisticheVuote() {

  return {

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
}

/* ============================================================
   SUMMARY STATISTICHE
============================================================ */

function statisticheDaSummary(
  data
) {

  const risultato =
    statisticheVuote();

  const teams =

    data?.boxscore?.teams ||

    data?.boxscore?.statistics ||

    data?.statistics?.teams ||

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
      listaStatisticheTeam(
        team
      );

    if (!lista.length) {
      continue;
    }

    const blocco =
      creaBloccoStatistiche(
        lista
      );

    const valori =
      valoriStatistiche(
        lista
      );

    if (
      team?.homeAway ===
      "home"
    ) {

      risultato.casa =
        blocco;

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
      team?.homeAway ===
      "away"
    ) {

      risultato.trasferta =
        blocco;

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
   CORE STATISTICHE
============================================================ */

async function statisticheDaCore(
  competizione,
  eventId,
  competitionId,
  homeId,
  awayId
) {

  const risultato =
    statisticheVuote();

  if (
   !competitionId ||
   !homeId ||
   !awayId
  ) {

    return risultato;
  }

  const base =

    "/leagues/" +
    encodeURIComponent(
      competizione
    ) +

    "/events/" +
    encodeURIComponent(
      eventId
    ) +

    "/competitions/" +
    encodeURIComponent(
      competitionId
    ) +

    "/competitors/";

  const [
    homeData,
    awayData
  ] =
    await Promise.all([

      espnCoreFetch(
        base +
        encodeURIComponent(
          homeId
        ) +
        "/statistics"
      ),

      espnCoreFetch(
        base +
        encodeURIComponent(
          awayId
        ) +
        "/statistics"
      )
    ]);

  function estraiLista(data) {

    if (!data) {
      return [];
    }

    if (
      Array.isArray(
        data.statistics
      )
    ) {
      return data.statistics;
    }

    if (
      Array.isArray(
        data.stats
      )
    ) {
      return data.stats;
    }

    if (
      Array.isArray(
        data.items
      )
    ) {
      return data.items;
    }

    if (
      Array.isArray(
        data.splits
      )
    ) {
      return data.splits;
    }

    return [];
  }

  const homeLista =
    estraiLista(
      homeData
    );

  const awayLista =
    estraiLista(
      awayData
    );

  risultato.casa =
    creaBloccoStatistiche(
      homeLista
    );

  risultato.trasferta =
    creaBloccoStatistiche(
      awayLista
    );

  const home =
    valoriStatistiche(
      homeLista
    );

  const away =
    valoriStatistiche(
      awayLista
    );

  risultato.valori = {

    possessoCasa:
      home.possesso,

    possessoTrasferta:
      away.possesso,

    tiriCasa:
      home.tiri,

    tiriTrasferta:
      away.tiri,

    tiriInPortaCasa:
      home.tiriInPorta,

    tiriInPortaTrasferta:
      away.tiriInPorta,

    calciDangoloCasa:
      home.angoli,

    calciDangoloTrasferta:
      away.angoli,

    passaggiCasa:
      home.passaggi,

    passaggiTrasferta:
      away.passaggi,

    fuorigiocoCasa:
      home.fuorigioco,

    fuorigiocoTrasferta:
      away.fuorigioco
  };

  return risultato;
}

/* ============================================================
   CDN STATISTICHE
============================================================ */

function statisticheDaCdn(
  pkg
) {

  const risultato =
    statisticheVuote();

  if (!pkg) {
    return risultato;
  }

  const teams =
    pkg?.boxscore?.teams ||
    pkg?.teams ||
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
      listaStatisticheTeam(
        team
      );

    if (!lista.length) {
      continue;
    }

    const blocco =
      creaBloccoStatistiche(
        lista
      );

    const valori =
      valoriStatistiche(
        lista
      );

    const homeAway =
      team?.homeAway ||
      team?.homeaway;

    if (
      homeAway === "home"
    ) {

      risultato.casa =
        blocco;

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
      homeAway === "away"
    ) {

      risultato.trasferta =
        blocco;

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
   UNIONE STATISTICHE
============================================================ */

function primoValore(
 ...valori
) {

  for (
    const valore
    of valori
  ) {

    if (
      valore!== null &&
      valore!== undefined &&
      String(valore).trim()!== ""
    ) {

      return valore;
    }
  }

  return null;
}

function unisciStatistiche(
  summary,
  core,
  cdn
) {

  const risultato =
    statisticheVuote();

  risultato.casa =
    summary.casa.length
     ? summary.casa
      : (
          core.casa.length
           ? core.casa
            : cdn.casa
        );

  risultato.trasferta =
    summary.trasferta.length
     ? summary.trasferta
      : (
          core.trasferta.length
           ? core.trasferta
            : cdn.trasferta
        );

  const campi = [

    "possessoCasa",
    "possessoTrasferta",

    "tiriCasa",
    "tiriTrasferta",

    "tiriInPortaCasa",
    "tiriInPortaTrasferta",

    "calciDangoloCasa",
    "calciDangoloTrasferta",

    "passaggiCasa",
    "passaggiTrasferta",

    "fuorigiocoCasa",
    "fuorigiocoTrasferta"
  ];

  for (
    const campo
    of campi
  ) {

    risultato.valori[campo] =
      primoValore(

        summary.valori?.[campo],

        core.valori?.[campo],

        cdn.valori?.[campo]
      );
  }

  return risultato;
    }

/* ============================================================
   FORMAZIONI
============================================================ */

function ruoloItaliano(ruolo) {

  if (!ruolo) {
    return null;
  }

  const r =
    String(ruolo)
     .toUpperCase()
     .trim();

  const mappa = {

    GK: "Portiere",
    G: "Portiere",

    CB: "Difensore",
    CD: "Difensore",
    LB: "Difensore",
    RB: "Difensore",
    LWB: "Difensore",
    RWB: "Difensore",

    DM: "Centrocampista",
    CM: "Centrocampista",
    LM: "Centrocampista",
    RM: "Centrocampista",
    AM: "Centrocampista",
    CAM: "Centrocampista",
    CDM: "Centrocampista",

    LW: "Attaccante",
    RW: "Attaccante",
    CF: "Attaccante",
    ST: "Attaccante",
    FW: "Attaccante"
  };

  return (
    mappa[r] ||
    ruolo
  );
}

function valoreFormazione(
  giocatore
) {

  if (!giocatore) {
    return {};
  }

  const atleta =
    giocatore?.athlete ||
    giocatore?.player ||
    giocatore;

  const nome =
    nomeAtleta(
      atleta
    );

  const ruolo =

    giocatore?.position?.abbreviation ||

    atleta?.position?.abbreviation ||

    giocatore?.position?.displayName ||

    atleta?.position?.displayName ||

    null;

  return {

    cognome:
      ultimoCognome(
        nome
      ),

    numero:
      giocatore?.jersey ||

      atleta?.jersey ||

      null,

    ruolo:
      ruoloItaliano(
        ruolo
      ),

    ruoloESPN:
      ruolo,

    titolare:
      giocatore?.starter === true ||

      giocatore?.lineupStatus === "starter" ||

      giocatore?.status === "starter"
  };
}

function ordinaGiocatori(
  giocatori
) {

  const ordine = {

    "Portiere": 1,

    "Difensore": 2,

    "Centrocampista": 3,

    "Attaccante": 4
  };

  return giocatori.sort(
    function(a, b) {

      const ruoloA =
        ordine[a.ruolo] ||
        99;

      const ruoloB =
        ordine[b.ruolo] ||
        99;

      if (
        ruoloA!== ruoloB
      ) {

        return ruoloA -
          ruoloB;
      }

      const numeroA =
        Number(
          a.numero
        );

      const numeroB =
        Number(
          b.numero
        );

      if (
        Number.isFinite(numeroA) &&
        Number.isFinite(numeroB)
      ) {

        return numeroA -
          numeroB;
      }

      return String(
        a.cognome ||
        ""
      ).localeCompare(
        String(
          b.cognome ||
          ""
        )
      );
    }
  );
}

function testoFormazione(
  formazione
) {

  if (!formazione) {
    return null;
  }

  const parti = [];

  if (
    formazione.modulo
  ) {

    parti.push(
      "Modulo: " +
      formazione.modulo
    );
  }

  const gruppi = [

    {
      nome: "Portieri",
      lista:
        formazione.titolari
         .filter(
            g =>
              g.ruolo ===
              "Portiere"
          )
    },

    {
      nome: "Difensori",
      lista:
        formazione.titolari
         .filter(
            g =>
              g.ruolo ===
              "Difensore"
          )
    },

    {
      nome: "Centrocampisti",
      lista:
        formazione.titolari
         .filter(
            g =>
              g.ruolo ===
              "Centrocampista"
          )
    },

    {
      nome: "Attaccanti",
      lista:
        formazione.titolari
         .filter(
            g =>
              g.ruolo ===
              "Attaccante"
          )
    }
  ];

  for (
    const gruppo
    of gruppi
  ) {

    if (
      gruppo.lista.length
    ) {

      parti.push(

        gruppo.nome +
        ": " +

        gruppo.lista
         .map(
            g =>
              g.cognome
          )
         .filter(Boolean)
         .join(", ")
      );
    }
  }

  if (
    formazione.allenatore
  ) {

    parti.push(
      "Allenatore: " +
      formazione.allenatore
    );
  }

  return parti.join(
    " | "
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

    data?.boxscore?.players ||

    [];

  if (
   !Array.isArray(rosters)
  ) {

    return risultato;
  }

  for (
    const roster
    of rosters
  ) {

    const idSquadra =

      roster?.team?.id ||

      roster?.teamId ||

      null;

    const giocatori =

      roster?.roster ||

      roster?.athletes ||

      roster?.players ||

      [];

    if (
     !Array.isArray(
        giocatori
      )
    ) {

      continue;
    }

    const formazione = {

      modulo:

        roster?.formation?.displayName ||

        roster?.formation?.name ||

        roster?.formation ||

        roster?.formationUsed ||

        null,

      allenatore:

        roster?.coach?.displayName ||

        roster?.coach?.fullName ||

        roster?.coaches?.[0]?.displayName ||

        roster?.coaches?.[0]?.fullName ||

        null,

      titolari: [],

      riserve: []
    };

    for (
      const giocatore
      of giocatori
    ) {

      const elemento =
        valoreFormazione(
          giocatore
        );

      if (
       !elemento.cognome
      ) {

        continue;
      }

      if (
        elemento.titolare
      ) {

        formazione
         .titolari
         .push(
            elemento
          );

      } else {

        formazione
         .riserve
         .push(
            elemento
          );
      }
    }

    ordinaGiocatori(
      formazione.titolari
    );

    ordinaGiocatori(
      formazione.riserve
    );

    formazione.testo =
      testoFormazione(
        formazione
      );

    if (
      idSquadra &&
      String(idSquadra) ===
      String(home?.team?.id || home?.id)
    ) {

      risultato.casa =
        formazione;
    }

    if (
      idSquadra &&
      String(idSquadra) ===
      String(away?.team?.id || away?.id)
    ) {

      risultato.trasferta =
        formazione;
    }
  }

  return risultato;
      }

/* ============================================================
   ARBITRI / ASSISTENTI / VAR
============================================================ */

function creaArbitri(
  data,
  competition
) {

  const ufficiali =

    competition?.officials ||

    data?.officials ||

    data?.gameInfo?.officials ||

    data?.gameInfo?.officials?.items ||

    [];

  if (
   !Array.isArray(
      ufficiali
    )
  ) {

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
    const ufficiale
    of ufficiali
  ) {

    const nome =

      ufficiale?.displayName ||

      ufficiale?.fullName ||

      ufficiale?.name ||

      ufficiale?.person?.displayName ||

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

        ufficiale?.title ||

        ""

      ).toLowerCase();

    /* AVAR PRIMA DEL VAR */

    if (
      ruolo.includes("avar")
    ) {

      if (
       !risultati.avar
      ) {

        risultati.avar =
          nome;
      }

      continue;
    }

    if (
      ruolo === "var" ||

      ruolo.includes(
        "video assistant referee"
      ) ||

      ruolo.includes(
        "video referee"
      ) ||

      ruolo.includes("video")
    ) {

      if (
       !risultati.var
      ) {

        risultati.var =
          nome;
      }

      continue;
    }

    if (
      ruolo.includes("fourth") ||

      ruolo.includes("4th") ||

      ruolo.includes("quarto")
    ) {

      if (
       !risultati.quartoUfficiale
      ) {

        risultati.quartoUfficiale =
          nome;
      }

      continue;
    }

    if (
      ruolo.includes("assistant") ||

      ruolo.includes("assistente") ||

      ruolo.includes("linesman")
    ) {

      if (
       !risultati.assistente1
      ) {

        risultati.assistente1 =
          nome;

      } else if (
       !risultati.assistente2
      ) {

        risultati.assistente2 =
          nome;
      }

      continue;
    }

    if (
      ruolo.includes("referee") ||

      ruolo.includes("arbitro")
    ) {

      if (
       !risultati.arbitro
      ) {

        risultati.arbitro =
          nome;
      }
    }
  }

  /* FALLBACK: primo ufficiale */

  if (
   !risultati.arbitro &&
    ufficiali.length
  ) {

    risultati.arbitro =

      ufficiali[0]?.displayName ||

      ufficiali[0]?.fullName ||

      ufficiali[0]?.name ||

      null;
  }

  const parti = [];

  if (
    risultati.arbitro
  ) {

    parti.push(
      "Arbitro: " +
      risultati.arbitro
    );
  }

  if (
    risultati.assistente1
  ) {

    parti.push(
      "Assistente 1: " +
      risultati.assistente1
    );
  }

  if (
    risultati.assistente2
  ) {

    parti.push(
      "Assistente 2: " +
      risultati.assistente2
    );
  }

  if (
    risultati.quartoUfficiale
  ) {

    parti.push(
      "Quarto ufficiale: " +
      risultati.quartoUfficiale
    );
  }

  if (
    risultati.var
  ) {

    parti.push(
      "VAR: " +
      risultati.var
    );
  }

  if (
    risultati.avar
  ) {

    parti.push(
      "AVAR: " +
      risultati.avar
    );
  }

  return parti.join(
    ", "
  );
}

/* ============================================================
   STATO
============================================================ */

function traduciStato(
  stato
) {

  if (!stato) {
    return "In programma";
  }

  if (
    stato.completed === true ||
    stato.completata === true
  ) {

    return "Finita";
  }

  const state =
    String(
      stato.state ||
      ""
    ).toLowerCase();

  const name =
    String(
      stato.name ||
      ""
    ).toLowerCase();

  const description =
    String(
      stato.description ||
      ""
    ).toLowerCase();

  if (

    state === "in" ||

    state === "live" ||

    state === "inprogress" ||

    name.includes("live") ||

    name.includes("progress") ||

    description.includes("live") ||

    description.includes("progress")
  ) {

    return "Live";
  }

  if (

    state === "post" ||

    name.includes("final") ||

    name.includes("post") ||

    description.includes("final")
  ) {

    return "Finita";
  }

  if (

    name.includes("postponed") ||

    name.includes("posticip") ||

    description.includes("postponed") ||

    description.includes("posticip")
  ) {

    return "Posticipata";
  }

  if (

    name.includes("canceled") ||

    name.includes("cancelled") ||

    description.includes("canceled") ||

    description.includes("cancelled")
  ) {

    return "Annullata";
  }

  return "In programma";
}

/* ============================================================
   TRADUZIONE FASE / TURNO
============================================================ */

function traduciFase(
  valore
) {

  if (!valore) {
    return null;
  }

  let testo =
    String(
      valore
    ).trim();

  if (!testo) {
    return null;
  }

  const basso =
    testo
     .toLowerCase()
     .normalize("NFD")
     .replace(
        /[\u0300-\u036f]/g,
        ""
      );

  /* OTTAVI */

  if (
    basso.includes(
      "round of 16"
    ) ||

    basso.includes(
      "round-of-16"
    ) ||

    basso.includes(
      "round of sixteen"
    ) ||

    basso.includes(
      "last 16"
    ) ||

    basso.includes(
      "octavos"
    ) ||

    basso.includes(
      "ottavi"
    )
  ) {

    return "Ottavi di finale";
  }

  /* SEDICESIMI */

  if (
    basso.includes(
      "round of 32"
    ) ||

    basso.includes(
      "last 32"
    ) ||

    basso.includes(
      "sedicesimi"
    )
  ) {

    return "Sedicesimi di finale";
  }

  /* QUARTI */

  if (
    basso.includes(
      "quarterfinal"
    ) ||

    basso.includes(
      "quarter-final"
    ) ||

    basso.includes(
      "quarter final"
    ) ||

    basso.includes(
      "quarti"
    )
  ) {

    return "Quarti di finale";
  }

  /* SEMIFINALE */

  if (
    basso.includes(
      "semifinal"
    ) ||

    basso.includes(
      "semi-final"
    ) ||

    basso.includes(
      "semifinale"
    )
  ) {

    return "Semifinale";
  }

  /* FINALE */

  if (
    basso === "final" ||

    basso === "finale" ||

    basso.includes(
      "final match"
    )
  ) {

    return "Finale";
  }

  /* PLAYOFF */

  if (
    basso.includes(
      "playoff"
    ) ||

    basso.includes(
      "play-off"
    )
  ) {

    return "Playoff";
  }

  /* PLAY-IN */

  if (
    basso.includes(
      "play-in"
    ) ||

    basso.includes(
      "play in"
    )
  ) {

    return "Play-in";
  }

  /* QUALIFICAZIONI */

  if (
    basso.includes(
      "qualifying"
    ) ||

    basso.includes(
      "qualification"
    ) ||

    basso.includes(
      "qualificazioni"
    )
  ) {

    return "Qualificazioni";
  }

  /* TURNO PRELIMINARE */

  if (
    basso.includes(
      "preliminary round"
    ) ||

    basso.includes(
      "preliminary"
    ) ||

    basso.includes(
      "turno preliminare"
    )
  ) {

    return "Turno preliminare";
  }

  /* FASE A GIRONI */

  if (
    basso.includes(
      "group stage"
    ) ||

    basso.includes(
      "group-stage"
    ) ||

    basso.includes(
      "fase a gironi"
    )
  ) {

    return "Fase a gironi";
  }

  /* FASE CAMPIONATO UEFA */

  if (
    basso.includes(
      "league phase"
    ) ||

    basso.includes(
      "league-phase"
    ) ||

    basso.includes(
      "fase campionato"
    )
  ) {

    return "Fase campionato";
  }

  /* FASE ELIMINATORIA */

  if (
    basso.includes(
      "knockout phase"
    ) ||

    basso.includes(
      "knockout"
    ) ||

    basso.includes(
      "elimination phase"
    )
  ) {

    return "Fase a eliminazione diretta";
  }

  /* TURNI */

  if (
    basso.includes(
      "first round"
    ) ||
    basso.includes(
      "first-round"
    )
  ) {

    return "Primo turno";
  }

  if (
    basso.includes(
      "second round"
    ) ||
    basso.includes(
      "second-round"
    )
  ) {

    return "Secondo turno";
  }

  if (
    basso.includes(
      "third round"
    ) ||
    basso.includes(
      "third-round"
    )
  ) {

    return "Terzo turno";
  }

  if (
    basso.includes(
      "fourth round"
    ) ||
    basso.includes(
      "fourth-round"
    )
  ) {

    return "Quarto turno";
  }

  return testo;
    }

/* ============================================================
   RICERCA FASE / TURNO NEL JSON ESPN
============================================================ */

function trovaFaseESPN(
  obj
) {

  if (!obj) {
    return null;
  }

  const trovate = [];

  function aggiungi(
    valore
  ) {

    const testo =
      testoValido(
        valore
      );

    if (
      testo &&
     !trovate.includes(
        testo
      )
    ) {

      trovate.push(
        testo
      );
    }
  }

  function visita(
    valore,
    profondita
  ) {

    if (
      valore === null ||
      valore === undefined ||
      profondita > 15
    ) {

      return;
    }

    if (
      Array.isArray(valore)
    ) {

      for (
        const elemento
        of valore
      ) {

        visita(
          elemento,
          profondita + 1
        );
      }

      return;
    }

    if (
      typeof valore!== "object"
    ) {

      return;
    }

    const campi = [

      "round",

      "phase",

      "stage",

      "roundName",

      "phaseName",

      "stageName",

      "roundDisplayName",

      "phaseDisplayName",

      "stageDisplayName"
    ];

    for (
      const campo
      of campi
    ) {

      const dato =
        valore[campo];

      if (
        dato === null ||
        dato === undefined
      ) {

        continue;
      }

      if (
        typeof dato ===
        "object"
      ) {

        aggiungi(
          dato.displayName
        );

        aggiungi(
          dato.name
        );

        aggiungi(
          dato.label
        );

        aggiungi(
          dato.description
        );

        aggiungi(
          dato.text
        );

      } else {

        aggiungi(
          dato
        );
      }
    }

    for (
      const chiave
      of Object.keys(valore)
    ) {

      const dato =
        valore[chiave];

      if (
        typeof dato ===
        "string"
      ) {

        const basso =
          dato
           .toLowerCase()
           .trim();

        const sembraFase =

          basso.includes(
            "round of"
          ) ||

          basso.includes(
            "quarterfinal"
          ) ||

          basso.includes(
            "quarter-final"
          ) ||

          basso.includes(
            "semifinal"
          ) ||

          basso.includes(
            "semi-final"
          ) ||

          basso === "final" ||

          basso.includes(
            "qualifying"
          ) ||

          basso.includes(
            "playoff"
          ) ||

          basso.includes(
            "play-off"
          ) ||

          basso.includes(
            "play-in"
          ) ||

          basso.includes(
            "knockout"
          ) ||

          basso.includes(
            "group stage"
          ) ||

          basso.includes(
            "league phase"
          ) ||

          basso.includes(
            "preliminary round"
          ) ||

          basso.includes(
            "ottavi"
          ) ||

          basso.includes(
            "quarti"
          ) ||

          basso.includes(
            "semifinale"
          ) ||

          basso.includes(
            "finale"
          ) ||

          basso.includes(
            "qualificazioni"
          );

        if (
          sembraFase
        ) {

          aggiungi(
            dato
          );
        }
      }
    }

    for (
      const chiave
      of Object.keys(valore)
    ) {

      const dato =
        valore[chiave];

      if (
        dato &&
        typeof dato ===
        "object"
      ) {

        visita(
          dato,
          profondita + 1
        );
      }
    }
  }

  visita(
    obj,
    0
  );

  /* PRIORITÀ */

  const priorita = [

    "Round of 16",
    "Last 16",

    "Round of 32",
    "Last 32",

    "Quarterfinal",
    "Quarter-final",

    "Semifinal",
    "Semi-final",

    "Final",

    "Playoff",
    "Play-in",

    "Qualifying",

    "Preliminary Round",

    "Knockout Phase",

    "Group Stage",

    "League Phase"
  ];

  for (
    const preferita
    of priorita
  ) {

    const trovata =
      trovate.find(
        valore =>
          normalizzaTesto(
            valore
          ).includes(
            normalizzaTesto(
              preferita
            )
          )
      );

    if (
      trovata
    ) {

      return traduciFase(
        trovata
      );
    }
  }

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
      tradotta!== valore
    ) {

      return tradotta;
    }
  }

  return null;
}

/* ============================================================
   NUMERO GIORNATA ESPN
============================================================ */

function trovaNumeroGiornataESPN(
 ...oggetti
) {

  for (
    const obj
    of oggetti
  ) {

    if (!obj) {
      continue;
    }

    const candidati = [

      obj?.week?.number,

      obj?.week?.value,

      obj?.week?.displayValue,

      obj?.matchday?.number,

      obj?.matchday?.value,

      obj?.matchDay?.number,

      obj?.matchDay?.value,

      obj?.round?.number,

      obj?.stage?.week?.number
    ];

    for (
      const valore
      of candidati
    ) {

      if (
        valore!== null &&
        valore!== undefined &&
        String(valore).trim()!== ""
      ) {

        const numero =
          Number(
            valore
          );

        if (
          Number.isFinite(
            numero
          )
        ) {

          return numero;
        }
      }
    }
  }

  return null;
}

/* ============================================================
   SEGUE REF ESPN CORE
============================================================ */

async function seguiRefEspn(
  obj,
  profondita = 0
) {

  if (
   !obj ||
    profondita > 5
  ) {

    return null;
  }

  if (
    typeof obj!== "string"
  ) {

    return null;
  }

  if (
   !obj.includes(
      "sports.core.api.espn.com"
    )
  ) {

    return null;
  }

  try {

    const response =
      await fetch(
        obj,
        {
          headers: {

            "User-Agent":
              "Mozilla/5.0",

            "Accept":
              "application/json"
          }
        }
      );

    if (
     !response.ok
    ) {

      return null;
    }

    return await response.json();

  } catch (errore) {

    return null;
  }
}

/* ============================================================
   FASE / TURNO DEFINITIVO
============================================================ */

function faseDaFinestra(
  competizione,
  valoreData
) {

  const finestre =
    FINESTRE_GIORNATE[
      competizione
    ];

  if (
   !Array.isArray(
      finestre
    ) ||
   !valoreData
  ) {

    return null;
  }

  const data =
    new Date(
      valoreData
    );

  if (
    isNaN(
      data.getTime()
    )
  ) {

    return null;
  }

  const giorno =
    data.toISOString()
     .slice(
        0,
        10
      );

  for (
    const finestra
    of finestre
  ) {

    if (
      giorno >=
      finestra.inizio &&
      giorno <=
      finestra.fine
    ) {

      return finestra.faseTurno;
    }
  }

  return null;
}

async function getFaseTurnoESPN(
  data,
  competition,
  competizione,
  eventId
) {

  const datiCompetizione =
    COMPETIZIONI[
      competizione
    ] || {

        nome:
          competizione,

        paese:
          null,

        tipo:
          "altro"
      };

  /*

    1. CERCHIAMO PRIMA UNA FASE ELIMINATORIA ESPN

  */

  let fase =
    trovaFaseESPN(
      competition
    );

  if (!fase) {

    fase =
      trovaFaseESPN(
        data?.header
      );
  }

  if (!fase) {

    fase =
      trovaFaseESPN(
        data
      );
  }

  /*
  Se ESPN dice Ottavi / Quarti /
  Semifinale / Finale / Playoff ecc.,
  questa informazione ha sempre priorità.
  */

  if (
    fase
  ) {

    return fase;
  }

  /*

    2. NUMERO GIORNATA UFFICIALE ESPN

  */

  let numeroGiornata =
    trovaNumeroGiornataESPN(
      competition,
      data?.header,
      data
    );

  /*

    3. RECUPERIAMO IL COMPETITION OBJECT DAL CORE ESPN

  */

  const competitionId =

    competition?.id ||

    data?.header?.competitions?.[0]?.id ||

    eventId;

  let coreCompetition =
    null;

  if (
    competitionId
  ) {

    coreCompetition =
      await espnCoreFetch(

        "/leagues/" +

        encodeURIComponent(
          competizione
        ) +

        "/events/" +

        encodeURIComponent(
          eventId
        ) +

        "/competitions/" +

        encodeURIComponent(
          competitionId
        )
      );
  }

  if (
    coreCompetition
  ) {

    fase =
      trovaFaseESPN(
        coreCompetition
      );

    if (
      fase
    ) {

      return fase;
    }

    if (
      numeroGiornata ===
      null
    ) {

      numeroGiornata =
        trovaNumeroGiornataESPN(
          coreCompetition
        );
    }
  }

  /*

    4. EVENT CORE

  */

  let coreEvent =
    null;

  coreEvent =
    await espnCoreFetch(

      "/leagues/" +

      encodeURIComponent(
        competizione
      ) +

      "/events/" +

      encodeURIComponent(
        eventId
      )
    );

  if (
    coreEvent
  ) {

    fase =
      trovaFaseESPN(
        coreEvent
      );

    if (
      fase
    ) {

      return fase;
    }

    if (
      numeroGiornata ===
      null
    ) {

      numeroGiornata =
        trovaNumeroGiornataESPN(
          coreEvent
        );
    }
  }

  /*

    5. PRIORITÀ SPECIALE LA LIGA


  Se ESPN ha la giornata ufficiale,
  la giornata ufficiale prevale sulla
  semplice data della partita.
  */

  if (
    competizione ===
    "esp.1" &&
    numeroGiornata!== null
  ) {

    return (
      "Giornata " +
      numeroGiornata
    );
  }

  /*

    6. PER GLI ALTRI CAMPIONATI

  */

  if (
    numeroGiornata!== null
  ) {

    return (
      "Giornata " +
      numeroGiornata
    );
  }

  /*

    7. FALLBACK: FINESTRA ESPLICITA

  */

  const dataPartita =
    competition?.date ||

    data?.header?.date ||

    null;

  const faseFinestra =
    faseDaFinestra(
      competizione,
      dataPartita
    );

  if (
    faseFinestra
  ) {

    return faseFinestra;
  }

  /*

    8. SE NON TROVIAMO NULLA

  */

  if (
    datiCompetizione.tipo ===
    "coppa" ||
    datiCompetizione.tipo ===
    "nazionale"
  ) {

    return "";
  }

  return "";
}

/* ============================================================
   PLAY ESPN CORE
============================================================ */

async function getPlaysCore(
  competizione,
  eventId,
  competitionId
) {

  if (
   !competitionId
  ) {

    return [];
  }

  const data =
    await espnCoreFetch(

      "/leagues/" +

      encodeURIComponent(
        competizione
      ) +

      "/events/" +

      encodeURIComponent(
        eventId
      ) +

      "/competitions/" +

      encodeURIComponent(
        competitionId
      ) +

      "/plays?limit=500&showsubplays=true"
    );

  if (!data) {
    return [];
  }

  if (
    Array.isArray(
      data.items
    )
  ) {

    return data.items;
  }

  if (
    Array.isArray(
      data.plays
    )
  ) {

    return data.plays;
  }

  return [];
}

/* ============================================================
   TRADUZIONE EVENTI
============================================================ */

function traduciEvento(
  tipo
) {

  const t =
    String(
      tipo || ""
    ).toLowerCase();

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

    t.includes("substitute") ||

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

  if (
    t.includes("var")
  ) {

    return "VAR";
  }

  if (
    t.includes("injury") ||
    t.includes("infortun")
  ) {

    return "Infortunio";
  }

  if (
    t.includes("kickoff") ||
    t.includes("kick-off") ||
    t.includes("start")
  ) {

    return "Inizio partita";
  }

  if (
    t.includes("halftime") ||
    t.includes("half time")
  ) {

    return "Fine primo tempo";
  }

  if (
    t.includes("fulltime") ||
    t.includes("full time") ||
    t.includes("end")
  ) {

    return "Fine partita";
  }

  return tipo || "";
}

/* ============================================================
   EVENTO IMPORTANTE?
============================================================ */

function eventoImportante(
  play
) {

  const tipo =
    tipoEvento(play);

  const testo =
    testoEvento(play)
     .toLowerCase();

  return (

    play?.scoringPlay === true ||

    play?.isScoringPlay === true ||

    tipo.includes("goal") ||

    tipo.includes("gol") ||

    tipo.includes("score") ||

    tipo.includes("yellow") ||

    tipo.includes("red") ||

    tipo.includes("substitution") ||

    tipo.includes("substitute") ||

    tipo.includes("penalty") ||

    tipo.includes("rigore") ||

    tipo.includes("var") ||

    tipo.includes("injury") ||

    tipo.includes("infortun") ||

    tipo.includes("kickoff") ||

    tipo.includes("kick-off") ||

    tipo.includes("halftime") ||

    tipo.includes("fulltime") ||

    tipo.includes("full time") ||

    testo.includes("goal") ||

    testo.includes("gol") ||

    testo.includes("yellow card") ||

    testo.includes("red card") ||

    testo.includes("substitution") ||

    testo.includes("injury") ||

    testo.includes("infortun") ||

    testo.includes("rigore") ||

    testo.includes("penalty") ||

    testo.includes("fine primo tempo") ||

    testo.includes("fine partita")
  );
}

/* ============================================================
   CRONACA
============================================================ */

function creaCronaca(
  plays,
  stato
) {

  if (
   !Array.isArray(
      plays
    )
  ) {

    return [];
  }

  const cronaca = [];

  for (
    const play
    of plays
  ) {

    if (
     !eventoImportante(
        play
      )
    ) {

      continue;
    }

    const tipo =
      tipoEvento(play);

    const atleta =
      atletaEvento(play);

    const assist =
      play?.assistedBy ||

      play?.assist ||

      play?.participants?.[1]?.athlete ||

      play?.participants?.[1]?.player ||

      play?.athletesInvolved?.[1] ||

      null;

    const minuto =
      minutoEvento(play);

    const squadra =
      squadraEvento(play);

    let tipoItaliano =
      traduciEvento(
        tipo
      );

    const testo =
      testoEvento(
        play
      );

    /*
    Se il testo ESPN indica esplicitamente
    la fine del primo tempo.
    */

    const lower =
      testo.toLowerCase();

    if (
      lower.includes(
        "half time"
      ) ||
      lower.includes(
        "halftime"
      ) ||
      lower.includes(
        "fine primo tempo"
      )
    ) {

      tipoItaliano =
        "Fine primo tempo";
    }

    if (
      lower.includes(
        "full time"
      ) ||
      lower.includes(
        "fulltime"
      ) ||
      lower.includes(
        "fine partita"
      )
    ) {

      tipoItaliano =
        "Fine partita";
    }

    cronaca.push({

      minuto:
        minuto,

      tipo:
        tipoItaliano,

      giocatore:
        cognomeAtleta(
          atleta
        ),

      assist:
        cognomeAtleta(
          assist
        ),

      squadra:
        squadra,

      testo:
        testo ||
        null
    });
  }

  /*
  Deduplica
  */

  const vista =
    new Set();

  return cronaca.filter(
    function(evento) {

      const chiave =

        String(
          evento.minuto ||
          ""
        ) +

        "|" +

        String(
          evento.tipo ||
          ""
        ) +

        "|" +

        String(
          evento.giocatore ||
          ""
        ) +

        "|" +

        String(
          evento.squadra ||
          ""
        ) +

        "|" +

        String(
          evento.testo ||
          ""
        );

      if (
        vista.has(
          chiave
        )
      ) {

        return false;
      }

      vista.add(
        chiave
      );

      return true;
    }
  );
}

/* ============================================================
   EVENTI COMPLETI
============================================================ */

function creaEventi(
  plays
) {

  if (
   !Array.isArray(
      plays
    )
  ) {

    return [];
  }

  return plays.map(
    function(play) {

      return {

        id:
          play?.id ||
          null,

        minuto:
          minutoEvento(
            play
          ),

        tipo:
          traduciEvento(
            tipoEvento(
              play
            )
          ),

        giocatore:
          cognomeAtleta(
            atletaEvento(
              play
            )
          ),

        assist:
          cognomeAtleta(

            play?.assistedBy ||

            play?.assist ||

            play?.participants?.[1]?.athlete ||

            play?.participants?.[1]?.player ||

            null
          ),

        squadra:
          squadraEvento(
            play
          ),

        testo:
          testoEvento(
            play
          ) ||
          null
      };
    }
  );
}

/* ============================================================
   ENDPOINT PRINCIPALE
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
          null,

        tipo:
          "altro"
      };

    /*

    SUMMARY ESPN

    */

    const data =
      await espnFetch(

        "/" +

        competizione +

        "/summary?event=" +

        encodeURIComponent(
          id
        )
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

    /*

    SQUADRE

    */

    const teams =
      competition?.competitors ||
      [];

    const home =
      teams.find(
        team =>
          team?.homeAway ===
          "home"
      );

    const away =
      teams.find(
        team =>
          team?.homeAway ===
          "away"
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

    PLAY

    */

    let plays =

      Array.isArray(
        data?.plays
      )
       ? data.plays

        : Array.isArray(
            data?.keyEvents
          )
         ? data.keyEvents

          : [];

    const competitionId =

      competition?.id ||

      data?.header?.competitions?.[0]?.id ||

      id;

    const playsCore =
      await getPlaysCore(

        competizione,

        id,

        competitionId
      );

    if (
      playsCore.length >
      plays.length
    ) {

      plays =
        playsCore;
    }

    /*

    CDN ESPN

    */

    const cdn =
      await espnCdnFetch(

        competizione,

        id
      );

    /*

    STATISTICHE

    */

    const statisticheSummary =
      statisticheDaSummary(
        data
      );

    const statisticheCore =
      await statisticheDaCore(

        competizione,

        id,

        competitionId,

        home?.id ||
        home?.team?.id,

        away?.id ||
        away?.team?.id
      );

    const statisticheCdn =
      statisticheDaCdn(
        cdn
      );

    const statistiche =
      unisciStatistiche(

        statisticheSummary,

        statisticheCore,

        statisticheCdn
      );

    /*

    FORMAZIONI

    */

    const formazioni =
      creaFormazioni(

        data,

        home,

        away
      );

    /*

    STADIO

    */

    const venue =

      data?.gameInfo?.venue ||

      competition?.venue ||

      null;

    /*

    DATA / ORA

    */

    const dataOra =
      convertiDataOraItaliana(

        competition?.date ||

        data?.header?.date ||

        null
      );

    /*

    ARBITRI

    */

    const arbitri =
      creaArbitri(

        data,

        competition
      );

    /*

    STATO

    */

    const stato =
      traduciStato(

        competition?.status?.type
      );

    /*

    FASE / TURNO

    */

    const faseTurno =
      await getFaseTurnoESPN(

        data,

        competition,

        competizione,

        id
      );

    /*

    MARCATORI

    */

    const marcatori =
      creaMarcatori(
        plays
      );

    /*

    CARTELLINI

    */

    const cartellini =
      creaCartellini(
        plays
      );

    /*

    SOSTITUZIONI

    */

    const sostituzioni =
      creaSostituzioni(
        plays
      );

    /*

    CRONACA

    */

    const cronaca =
      creaCronaca(

        plays,

        stato
      );

    /*

    EVENTI

    */

    const eventi =
      creaEventi(
        plays
      );

    /*

    RISPOSTA

    */

    return res
     .status(200)
     .json({

        success:
          true,

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

          /*
          QUI ARRIVA SEMPRE:
          Giornata X
          oppure
          Ottavi di finale
          oppure
          Quarti di finale
          oppure
          Semifinale
          oppure
          Finale
          ecc.
          */

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

              encodeURIComponent(
                id
              ),

            statistiche:

              "https://www.espn.com/soccer/matchstats/_/gameId/" +

              encodeURIComponent(
                id
              )
          }
        },

        /*

        INFO

        */

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

            venue?.address
             ?.city ||

            null,

          paese:

            venue?.address
             ?.country ||

            null
        },

        /*

        MARCATORI

        */

        marcatori:
          marcatori,

        /*

        CARTELLINI

        */

        cartellini:
          cartellini,

        /*

        SOSTITUZIONI

        */

        sostituzioni:
          sostituzioni,

        /*

        STATISTICHE COMPLETE

        */

        statistiche:
          statistiche,

        /*

        STATISTICHE RAPIDE

        */

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

        /*

        FORMAZIONI

        */

        formazioni:
          formazioni,

        /*

        CRONACA

        */

        cronaca:
          cronaca,

        /*

        EVENTI

        */

        eventi:
          eventi
      });

  } catch (
    errore
  ) {

    console.error(
      "Errore /api/partita:",
      errore
    );

    return res
     .status(500)
     .json({

        success:
          false,

        errore:
          errore?.message ||
          "Errore interno del server"
      });
  }
};
