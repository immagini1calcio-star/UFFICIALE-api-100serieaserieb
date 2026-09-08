/**
 * ============================================================
 * API CALCIO 100%SerieA&SerieB
 * FILE: api/partita.js
 *
 * FONTE DATI: SOLO ESPN
 *
 * LOGICA FASE/TURNO:
 * 1) identifica la competizione ESPN
 * 2) trova il codice competizione (es. ita.1)
 * 3) cerca quel codice in FINESTRE_GIORNATE
 * 4) legge la DATA REALE della partita da ESPN
 * 5) cerca la finestra che contiene quella data
 * 6) restituisce ESATTAMENTE la faseTurno della finestra
 *
 * Per i campionati:
 *   ita.1  -> Serie A
 *   ita.2  -> Serie B
 *   fra.1  -> Ligue 1
 *   esp.1  -> La Liga
 *   eng.1  -> Premier League
 *   ksa.1  -> Saudi Pro League
 *   por.1  -> Liga Portugal
 *   ned.1  -> Eredivisie
 *   ger.1  -> Bundesliga
 *
 * NESSUN BASE44
 * NESSUNA API A PAGAMENTO
 * NESSUNA API KEY ESPN
 * ============================================================
 */

const ESPN_BASE =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

const ESPN_CORE =
  "https://sports.core.api.espn.com/v2/sports/soccer";

// ============================================================
// COMPETIZIONI
// ============================================================

const COMPETIZIONI = {
  "ita.1": {
    nome: "Serie A",
    slug: "ita.1",
    paese: "Italia"
  },

  "ita.2": {
    nome: "Serie B",
    slug: "ita.2",
    paese: "Italia"
  },

  "ita.coppa_italia": {
    nome: "Coppa Italia",
    slug: "ita.coppa_italia",
    paese: "Italia"
  },

  "ita.fifa": {
    nome: "Nazionale Italia",
    slug: "ita.fifa",
    paese: "Italia"
  },

  "uefa.champions": {
    nome: "Champions League",
    slug: "uefa.champions",
    paese: "Europa"
  },

  "uefa.europa": {
    nome: "Europa League",
    slug: "uefa.europa",
    paese: "Europa"
  },

  "uefa.europa.conf": {
    nome: "Conference League",
    slug: "uefa.europa.conf",
    paese: "Europa"
  },

  "fra.1": {
    nome: "Ligue 1",
    slug: "fra.1",
    paese: "Francia"
  },

  "esp.1": {
    nome: "La Liga",
    slug: "esp.1",
    paese: "Spagna"
  },

  "eng.1": {
    nome: "Premier League",
    slug: "eng.1",
    paese: "Inghilterra"
  },

  "ksa.1": {
    nome: "Saudi Pro League",
    slug: "ksa.1",
    paese: "Arabia Saudita"
  },

  "por.1": {
    nome: "Liga Portugal",
    slug: "por.1",
    paese: "Portogallo"
  },

  "ned.1": {
    nome: "Eredivisie",
    slug: "ned.1",
    paese: "Paesi Bassi"
  },

  "ger.1": {
    nome: "Bundesliga",
    slug: "ger.1",
    paese: "Germania"
  }
};

// ============================================================
// FINESTRE UFFICIALI
//
// IMPORTANTE:
// Ogni elemento contiene:
//   competizione
//   giornata
//   dal
//   al
//   faseTurno
//
// La data viene confrontata con queste finestre.
// ============================================================

const FINESTRE_GIORNATE = {

  // ==========================================================
  // SERIE A
  // ==========================================================

  "ita.1": [
    ["2026-08-20", "2026-08-25", "Giornata 1"],
    ["2026-08-27", "2026-09-01", "Giornata 2"],
    ["2026-09-03", "2026-09-08", "Giornata 3"],
    ["2026-09-10", "2026-09-15", "Giornata 4"],
    ["2026-09-17", "2026-09-22", "Giornata 5"],
    ["2026-10-08", "2026-10-13", "Giornata 6"],
    ["2026-10-15", "2026-10-20", "Giornata 7"],
    ["2026-10-22", "2026-10-26", "Giornata 8"],
    ["2026-10-27", "2026-10-30", "Giornata 9"],
    ["2026-10-31", "2026-11-03", "Giornata 10"],
    ["2026-11-05", "2026-11-10", "Giornata 11"],
    ["2026-11-19", "2026-11-24", "Giornata 12"],
    ["2026-11-26", "2026-12-01", "Giornata 13"],
    ["2026-12-03", "2026-12-08", "Giornata 14"],
    ["2026-12-10", "2026-12-15", "Giornata 15"],
    ["2026-12-17", "2026-12-22", "Giornata 16"],
    ["2026-12-31", "2027-01-05", "Giornata 17"],
    ["2027-01-06", "2027-01-09", "Giornata 18"],
    ["2027-01-10", "2027-01-12", "Giornata 19"],
    ["2027-01-14", "2027-01-19", "Giornata 20"],
    ["2027-01-21", "2027-01-26", "Giornata 21"],
    ["2027-01-28", "2027-02-02", "Giornata 22"],
    ["2027-02-04", "2027-02-09", "Giornata 23"],
    ["2027-02-11", "2027-02-16", "Giornata 24"],
    ["2027-02-18", "2027-02-23", "Giornata 25"],
    ["2027-02-25", "2027-03-02", "Giornata 26"],
    ["2027-03-04", "2027-03-09", "Giornata 27"],
    ["2027-03-11", "2027-03-16", "Giornata 28"],
    ["2027-03-18", "2027-03-23", "Giornata 29"],
    ["2027-04-01", "2027-04-06", "Giornata 30"],
    ["2027-04-08", "2027-04-13", "Giornata 31"],
    ["2027-04-15", "2027-04-20", "Giornata 32"],
    ["2027-04-22", "2027-04-27", "Giornata 33"],
    ["2027-04-29", "2027-05-04", "Giornata 34"],
    ["2027-05-06", "2027-05-11", "Giornata 35"],
    ["2027-05-13", "2027-05-18", "Giornata 36"],
    ["2027-05-20", "2027-05-25", "Giornata 37"],
    ["2027-05-27", "2027-06-01", "Giornata 38"]
  ],

  // ==========================================================
  // SERIE B
  // ==========================================================

  "ita.2": [
    ["2026-08-20", "2026-08-25", "Giornata 1"],
    ["2026-08-27", "2026-09-01", "Giornata 2"],
    ["2026-09-03", "2026-09-08", "Giornata 3"],
    ["2026-09-10", "2026-09-15", "Giornata 4"],
    ["2026-09-16", "2026-09-22", "Giornata 5"],
    ["2026-10-08", "2026-10-13", "Giornata 6"],
    ["2026-10-15", "2026-10-20", "Giornata 7"],
    ["2026-10-22", "2026-10-26", "Giornata 8"],
    ["2026-10-27", "2026-10-30", "Giornata 9"],
    ["2026-10-31", "2026-11-03", "Giornata 10"],
    ["2026-11-05", "2026-11-10", "Giornata 11"],
    ["2026-11-19", "2026-11-23", "Giornata 12"],
    ["2026-11-24", "2026-11-27", "Giornata 13"],
    ["2026-11-28", "2026-12-01", "Giornata 14"],
    ["2026-12-03", "2026-12-07", "Giornata 15"],
    ["2026-12-08", "2026-12-11", "Giornata 16"],
    ["2026-12-12", "2026-12-15", "Giornata 17"],
    ["2026-12-17", "2026-12-22", "Giornata 18"],
    ["2026-12-24", "2026-12-29", "Giornata 19"],
    ["2027-01-07", "2027-01-12", "Giornata 20"],
    ["2027-01-14", "2027-01-19", "Giornata 21"],
    ["2027-01-21", "2027-01-26", "Giornata 22"],
    ["2027-01-28", "2027-02-02", "Giornata 23"],
    ["2027-02-04", "2027-02-09", "Giornata 24"],
    ["2027-02-11", "2027-02-16", "Giornata 25"],
    ["2027-02-18", "2027-02-23", "Giornata 26"],
    ["2027-02-25", "2027-03-01", "Giornata 27"],
    ["2027-03-02", "2027-03-05", "Giornata 28"],
    ["2027-03-06", "2027-03-09", "Giornata 29"],
    ["2027-03-11", "2027-03-16", "Giornata 30"],
    ["2027-03-18", "2027-03-23", "Giornata 31"],
    ["2027-04-01", "2027-04-06", "Giornata 32"],
    ["2027-04-08", "2027-04-13", "Giornata 33"],
    ["2027-04-15", "2027-04-20", "Giornata 34"],
    ["2027-04-22", "2027-04-27", "Giornata 35"],
    ["2027-04-29", "2027-05-04", "Giornata 36"],
    ["2027-05-06", "2027-05-11", "Giornata 37"],
    ["2027-05-13", "2027-05-18", "Giornata 38"]
  ],

  // ==========================================================
  // PREMIER LEAGUE
  // ==========================================================

  "eng.1": [
    ["2026-08-20", "2026-08-25", "Giornata 1"],
    ["2026-08-27", "2026-09-01", "Giornata 2"],
    ["2026-09-03", "2026-09-08", "Giornata 3"],
    ["2026-09-10", "2026-09-15", "Giornata 4"],
    ["2026-09-17", "2026-09-22", "Giornata 5"],
    ["2026-10-08", "2026-10-13", "Giornata 6"],
    ["2026-10-15", "2026-10-20", "Giornata 7"],
    ["2026-10-22", "2026-10-27", "Giornata 8"],
    ["2026-10-29", "2026-11-03", "Giornata 9"],
    ["2026-11-05", "2026-11-10", "Giornata 10"],
    ["2026-11-19", "2026-11-24", "Giornata 11"],
    ["2026-11-26", "2026-12-01", "Giornata 12"],
    ["2026-12-01", "2026-12-04", "Giornata 13"],
    ["2026-12-05", "2026-12-08", "Giornata 14"],
    ["2026-12-10", "2026-12-15", "Giornata 15"],
    ["2026-12-17", "2026-12-22", "Giornata 16"],
    ["2026-12-24", "2026-12-28", "Giornata 17"],
    ["2026-12-29", "2027-01-01", "Giornata 18"],
    ["2027-01-01", "2027-01-04", "Giornata 19"],
    ["2027-01-05", "2027-01-08", "Giornata 20"],
    ["2027-01-16", "2027-01-19", "Giornata 21"],
    ["2027-01-21", "2027-01-26", "Giornata 22"],
    ["2027-01-28", "2027-02-02", "Giornata 23"],
    ["2027-02-04", "2027-02-09", "Giornata 24"],
    ["2027-02-09", "2027-02-12", "Giornata 25"],
    ["2027-02-20", "2027-02-23", "Giornata 26"],
    ["2027-02-25", "2027-03-02", "Giornata 27"],
    ["2027-03-02", "2027-03-05", "Giornata 28"],
    ["2027-03-11", "2027-03-16", "Giornata 29"],
    ["2027-03-18", "2027-03-23", "Giornata 30"],
    ["2027-04-08", "2027-04-13", "Giornata 31"],
    ["2027-04-15", "2027-04-20", "Giornata 32"],
    ["2027-04-22", "2027-04-27", "Giornata 33"],
    ["2027-04-29", "2027-05-04", "Giornata 34"],
    ["2027-05-06", "2027-05-11", "Giornata 35"],
    ["2027-05-13", "2027-05-18", "Giornata 36"],
    ["2027-05-20", "2027-05-25", "Giornata 37"],
    ["2027-05-27", "2027-05-30", "Giornata 38"]
  ],

  // ==========================================================
  // LA LIGA
  // ==========================================================

  "esp.1": [
    ["2026-08-13", "2026-08-27", "Giornata 1"],
    ["2026-08-20", "2026-08-25", "Giornata 2"],
    ["2026-08-27", "2026-09-01", "Giornata 3"],
    ["2026-09-03", "2026-09-08", "Giornata 4"],
    ["2026-09-11", "2026-09-14", "Giornata 5"],
    ["2026-09-15", "2026-09-18", "Giornata 6"],
    ["2026-09-19", "2026-09-22", "Giornata 7"],
    ["2026-10-09", "2026-10-13", "Giornata 8"],
    ["2026-10-16", "2026-10-20", "Giornata 9"],
    ["2026-10-23", "2026-10-27", "Giornata 10"],
    ["2026-10-30", "2026-11-03", "Giornata 11"],
    ["2026-11-06", "2026-11-10", "Giornata 12"],
    ["2026-11-19", "2026-11-24", "Giornata 13"],
    ["2026-11-26", "2026-12-01", "Giornata 14"],
    ["2026-12-03", "2026-12-08", "Giornata 15"],
    ["2026-12-10", "2026-12-15", "Giornata 16"],
    ["2026-12-17", "2026-12-22", "Giornata 17"],
    ["2026-12-31", "2027-01-05", "Giornata 18"],
    ["2027-01-07", "2027-01-12", "Giornata 19"],
    ["2027-01-14", "2027-01-19", "Giornata 20"],
    ["2027-01-21", "2027-01-26", "Giornata 21"],
    ["2027-01-28", "2027-02-02", "Giornata 22"],
    ["2027-02-04", "2027-02-09", "Giornata 23"],
    ["2027-02-11", "2027-02-16", "Giornata 24"],
    ["2027-02-18", "2027-02-23", "Giornata 25"],
    ["2027-02-25", "2027-03-02", "Giornata 26"],
    ["2027-03-04", "2027-03-09", "Giornata 27"],
    ["2027-03-11", "2027-03-16", "Giornata 28"],
    ["2027-03-18", "2027-03-23", "Giornata 29"],
    ["2027-04-01", "2027-04-06", "Giornata 30"],
    ["2027-04-08", "2027-04-13", "Giornata 31"],
    ["2027-04-15", "2027-04-20", "Giornata 32"],
    ["2027-04-22", "2027-04-27", "Giornata 33"],
    ["2027-04-29", "2027-05-04", "Giornata 34"],
    ["2027-05-06", "2027-05-11", "Giornata 35"],
    ["2027-05-13", "2027-05-18", "Giornata 36"],
    ["2027-05-20", "2027-05-25", "Giornata 37"],
    ["2027-05-27", "2027-05-31", "Giornata 38"]
  ],

  // ==========================================================
  // LIGUE 1
  // ==========================================================

  "fra.1": [
    ["2026-08-20", "2026-08-25", "Giornata 1"],
    ["2026-08-27", "2026-09-01", "Giornata 2"],
    ["2026-09-03", "2026-09-08", "Giornata 3"],
    ["2026-09-10", "2026-09-15", "Giornata 4"],
    ["2026-09-17", "2026-09-22", "Giornata 5"],
    ["2026-10-08", "2026-10-13", "Giornata 6"],
    ["2026-10-15", "2026-10-20", "Giornata 7"],
    ["2026-10-22", "2026-10-27", "Giornata 8"],
    ["2026-10-29", "2026-11-03", "Giornata 9"],
    ["2026-11-05", "2026-11-10", "Giornata 10"],
    ["2026-11-19", "2026-11-24", "Giornata 11"],
    ["2026-11-26", "2026-12-01", "Giornata 12"],
    ["2026-12-03", "2026-12-08", "Giornata 13"],
    ["2026-12-10", "2026-12-15", "Giornata 14"],
    ["2026-12-31", "2027-01-05", "Giornata 15"],
    ["2027-01-14", "2027-01-19", "Giornata 16"],
    ["2027-01-21", "2027-01-26", "Giornata 17"],
    ["2027-01-28", "2027-02-02", "Giornata 18"],
    ["2027-02-04", "2027-02-09", "Giornata 19"],
    ["2027-02-11", "2027-02-16", "Giornata 20"],
    ["2027-02-18", "2027-02-23", "Giornata 21"],
    ["2027-02-25", "2027-03-02", "Giornata 22"],
    ["2027-03-04", "2027-03-09", "Giornata 23"],
    ["2027-03-11", "2027-03-16", "Giornata 24"],
    ["2027-03-18", "2027-03-23", "Giornata 25"],
    ["2027-04-01", "2027-04-06", "Giornata 26"],
    ["2027-04-08", "2027-04-13", "Giornata 27"],
    ["2027-04-15", "2027-04-20", "Giornata 28"],
    ["2027-04-22", "2027-04-27", "Giornata 29"],
    ["2027-04-29", "2027-05-04", "Giornata 30"],
    ["2027-05-06", "2027-05-11", "Giornata 31"],
    ["2027-05-13", "2027-05-18", "Giornata 32"],
    ["2027-05-20", "2027-05-25", "Giornata 33"],
    ["2027-05-27", "2027-05-31", "Giornata 34"]
  ],

  // ==========================================================
  // BUNDESLIGA
  // ==========================================================

  "ger.1": [
    ["2026-08-27", "2026-09-01", "Giornata 1"],
    ["2026-09-03", "2026-09-08", "Giornata 2"],
    ["2026-09-10", "2026-09-15", "Giornata 3"],
    ["2026-09-17", "2026-09-22", "Giornata 4"],
    ["2026-10-08", "2026-10-13", "Giornata 5"],
    ["2026-10-15", "2026-10-20", "Giornata 6"],
    ["2026-10-22", "2026-10-27", "Giornata 7"],
    ["2026-10-29", "2026-11-03", "Giornata 8"],
    ["2026-11-05", "2026-11-10", "Giornata 9"],
    ["2026-11-19", "2026-11-24", "Giornata 10"],
    ["2026-11-26", "2026-12-01", "Giornata 11"],
    ["2026-12-03", "2026-12-08", "Giornata 12"],
    ["2026-12-10", "2026-12-15", "Giornata 13"],
    ["2026-12-17", "2026-12-22", "Giornata 14"],
    ["2027-01-07", "2027-01-11", "Giornata 15"],
    ["2027-01-12", "2027-01-15", "Giornata 16"],
    ["2027-01-16", "2027-01-19", "Giornata 17"],
    ["2027-01-21", "2027-01-26", "Giornata 18"],
    ["2027-01-28", "2027-02-02", "Giornata 19"],
    ["2027-02-04", "2027-02-09", "Giornata 20"],
    ["2027-02-11", "2027-02-16", "Giornata 21"],
    ["2027-02-18", "2027-02-23", "Giornata 22"],
    ["2027-02-25", "2027-03-02", "Giornata 23"],
    ["2027-03-02", "2027-03-05", "Giornata 24"],
    ["2027-03-06", "2027-03-09", "Giornata 25"],
    ["2027-03-11", "2027-03-16", "Giornata 26"],
    ["2027-03-18", "2027-03-23", "Giornata 27"],
    ["2027-04-01", "2027-04-06", "Giornata 28"],
    ["2027-04-08", "2027-04-13", "Giornata 29"],
    ["2027-04-15", "2027-04-20", "Giornata 30"],
    ["2027-04-22", "2027-04-27", "Giornata 31"],
    ["2027-05-06", "2027-05-11", "Giornata 32"],
    ["2027-05-13", "2027-05-18", "Giornata 33"],
    ["2027-05-20", "2027-05-25", "Giornata 34"]
  ],

  // ==========================================================
  // LIGA PORTUGAL
  // ==========================================================

  "por.1": [
    ["2026-08-06", "2026-08-11", "Giornata 1"],
    ["2026-08-13", "2026-08-18", "Giornata 2"],
    ["2026-08-20", "2026-08-25", "Giornata 3"],
    ["2026-08-27", "2026-09-01", "Giornata 4"],
    ["2026-09-03", "2026-09-08", "Giornata 5"],
    ["2026-09-10", "2026-09-15", "Giornata 6"],
    ["2026-09-17", "2026-09-22", "Giornata 7"],
    ["2026-10-08", "2026-10-13", "Giornata 8"],
    ["2026-10-22", "2026-10-27", "Giornata 9"],
    ["2026-10-29", "2026-11-03", "Giornata 10"],
    ["2026-11-05", "2026-11-10", "Giornata 11"],
    ["2026-11-26", "2026-12-01", "Giornata 12"],
    ["2026-12-03", "2026-12-08", "Giornata 13"],
    ["2026-12-10", "2026-12-15", "Giornata 14"],
    ["2026-12-17", "2026-12-22", "Giornata 15"],
    ["2026-12-24", "2026-12-29", "Giornata 16"],
    ["2027-01-07", "2027-01-12", "Giornata 17"],
    ["2027-01-14", "2027-01-19", "Giornata 18"],
    ["2027-01-21", "2027-01-26", "Giornata 19"],
    ["2027-01-28", "2027-02-02", "Giornata 20"],
    ["2027-02-04", "2027-02-09", "Giornata 21"],
    ["2027-02-11", "2027-02-16", "Giornata 22"],
    ["2027-02-18", "2027-02-23", "Giornata 23"],
    ["2027-02-25", "2027-03-02", "Giornata 24"],
    ["2027-03-04", "2027-03-09", "Giornata 25"],
    ["2027-03-11", "2027-03-16", "Giornata 26"],
    ["2027-03-18", "2027-03-23", "Giornata 27"],
    ["2027-04-01", "2027-04-06", "Giornata 28"],
    ["2027-04-09", "2027-04-12", "Giornata 29"],
    ["2027-04-16", "2027-04-19", "Giornata 30"],
    ["2027-04-22", "2027-04-27", "Giornata 31"],
    ["2027-04-29", "2027-05-04", "Giornata 32"],
    ["2027-05-06", "2027-05-11", "Giornata 33"],
    ["2027-05-13", "2027-05-18", "Giornata 34"]
  ],

     // ==========================================================
  // EREDIVISIE
  // ==========================================================

  "ned.1": [
    ["2026-08-06", "2026-08-11", "Giornata 1"],
    ["2026-08-13", "2026-08-18", "Giornata 2"],
    ["2026-08-20", "2026-08-25", "Giornata 3"],
    ["2026-08-27", "2026-09-01", "Giornata 4"],
    ["2026-09-03", "2026-09-08", "Giornata 5"],
    ["2026-09-10", "2026-09-15", "Giornata 6"],
    ["2026-09-17", "2026-09-22", "Giornata 7"],
    ["2026-10-08", "2026-10-13", "Giornata 8"],
    ["2026-10-15", "2026-10-20", "Giornata 9"],
    ["2026-10-22", "2026-10-27", "Giornata 10"],
    ["2026-10-29", "2026-11-03", "Giornata 11"],
    ["2026-11-05", "2026-11-10", "Giornata 12"],
    ["2026-11-19", "2026-11-24", "Giornata 13"],
    ["2026-11-26", "2026-12-01", "Giornata 14"],
    ["2026-12-03", "2026-12-08", "Giornata 15"],
    ["2026-12-10", "2026-12-15", "Giornata 16"],
    ["2026-12-17", "2026-12-22", "Giornata 17"],
    ["2027-01-07", "2027-01-12", "Giornata 18"],
    ["2027-01-14", "2027-01-19", "Giornata 19"],
    ["2027-01-21", "2027-01-26", "Giornata 20"],
    ["2027-01-28", "2027-02-02", "Giornata 21"],
    ["2027-02-11", "2027-02-16", "Giornata 22"],
    ["2027-02-18", "2027-02-23", "Giornata 23"],
    ["2027-02-25", "2027-03-02", "Giornata 24"],
    ["2027-03-04", "2027-03-09", "Giornata 25"],
    ["2027-03-11", "2027-03-16", "Giornata 26"],
    ["2027-03-18", "2027-03-23", "Giornata 27"],
    ["2027-04-01", "2027-04-06", "Giornata 28"],
    ["2027-04-08", "2027-04-13", "Giornata 29"],
    ["2027-04-22", "2027-04-27", "Giornata 30"],
    ["2027-04-29", "2027-05-04", "Giornata 31"],
    ["2027-05-06", "2027-05-11", "Giornata 32"],
    ["2027-05-13", "2027-05-18", "Giornata 33"],
    ["2027-05-20", "2027-05-25", "Giornata 34"]
  ],

  // ==========================================================
  // SAUDI PRO LEAGUE
  // ==========================================================

  "ksa.1": [
    ["2026-08-13", "2026-08-18", "Giornata 1"],
    ["2026-08-20", "2026-08-25", "Giornata 2"],
    ["2026-08-27", "2026-09-01", "Giornata 3"],
    ["2026-09-03", "2026-09-08", "Giornata 4"],
    ["2026-09-10", "2026-09-15", "Giornata 5"],
    ["2026-09-17", "2026-09-22", "Giornata 6"],
    ["2026-09-24", "2026-09-29", "Giornata 7"],
    ["2026-10-09", "2026-10-11", "Giornata 8"],
    ["2026-10-15", "2026-10-17", "Giornata 9"],
    ["2026-10-18", "2026-10-20", "Giornata 10"],
    ["2026-10-23", "2026-10-27", "Giornata 11"],
    ["2026-10-29", "2026-11-03", "Giornata 12"],
    ["2026-11-05", "2026-11-10", "Giornata 13"],
    ["2026-11-19", "2026-11-24", "Giornata 14"],
    ["2026-11-26", "2026-12-01", "Giornata 15"],
    ["2026-12-03", "2026-12-08", "Giornata 16"],
    ["2026-12-10", "2026-12-15", "Giornata 17"],
    ["2026-12-17", "2026-12-22", "Giornata 18"],
    ["2026-12-24", "2026-12-29", "Giornata 19"],
    ["2027-02-04", "2027-02-09", "Giornata 20"],
    ["2027-02-11", "2027-02-16", "Giornata 21"],
    ["2027-02-25", "2027-03-02", "Giornata 22"],
    ["2027-03-04", "2027-03-09", "Giornata 23"],
    ["2027-03-11", "2027-03-16", "Giornata 24"],
    ["2027-03-18", "2027-03-23", "Giornata 25"],
    ["2027-04-01", "2027-04-06", "Giornata 26"],
    ["2027-04-08", "2027-04-13", "Giornata 27"],
    ["2027-04-15", "2027-04-20", "Giornata 28"],
    ["2027-04-22", "2027-04-27", "Giornata 29"],
    ["2027-04-29", "2027-05-04", "Giornata 30"],
    ["2027-05-06", "2027-05-11", "Giornata 31"],
    ["2027-05-13", "2027-05-18", "Giornata 32"],
    ["2027-05-20", "2027-05-25", "Giornata 33"],
    ["2027-05-27", "2027-05-29", "Giornata 34"]
  ],

  // ==========================================================
  // CHAMPIONS LEAGUE
  // ==========================================================

  "uefa.champions": [
    ["2026-09-08", "2026-09-11", "Giornata 1"],
    ["2026-10-13", "2026-10-16", "Giornata 2"],
    ["2026-10-20", "2026-10-23", "Giornata 3"],
    ["2026-11-03", "2026-11-06", "Giornata 4"],
    ["2026-11-24", "2026-11-27", "Giornata 5"],
    ["2026-12-08", "2026-12-11", "Giornata 6"],
    ["2027-01-19", "2027-01-22", "Giornata 7"],
    ["2027-01-27", "2027-01-30", "Giornata 8"]
  ],

  // ==========================================================
  // EUROPA LEAGUE
  // ==========================================================

  "uefa.europa": [
    ["2026-09-15", "2026-09-18", "Giornata 1"],
    ["2026-10-13", "2026-10-16", "Giornata 2"],
    ["2026-10-20", "2026-10-23", "Giornata 3"],
    ["2026-11-03", "2026-11-06", "Giornata 4"],
    ["2026-11-24", "2026-11-27", "Giornata 5"],
    ["2026-12-08", "2026-12-11", "Giornata 6"],
    ["2027-01-19", "2027-01-22", "Giornata 7"],
    ["2027-01-27", "2027-01-30", "Giornata 8"]
  ],

  // ==========================================================
  // CONFERENCE LEAGUE
  // ==========================================================

  "uefa.europa.conf": [
    ["2026-10-13", "2026-10-16", "Giornata 1"],
    ["2026-10-20", "2026-10-23", "Giornata 2"],
    ["2026-11-03", "2026-11-06", "Giornata 3"],
    ["2026-11-24", "2026-11-27", "Giornata 4"],
    ["2026-12-08", "2026-12-11", "Giornata 5"],
    ["2026-12-15", "2026-12-18", "Giornata 6"]
  ]

};

// ============================================================
// NORMALIZZAZIONE TESTO
// ============================================================

function testoValido(v) {
  return typeof v === "string" && v.trim()!== "";
}

function normalizzaTesto(v) {
  if (!testoValido(v)) return "";

  return v
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g, "")
   .toLowerCase()
   .trim();
}

// ============================================================
// NOMI SQUADRE
// ============================================================

const MAPPATURA_SQUADRE = {
  "athletic club": "Atletico Bilbao",
  "athletic bilbao": "Atletico Bilbao",

  "internazionale": "Inter",
  "inter milan": "Inter",
  "internazionale milano": "Inter",

  "al riyadh": "Riyadh",
  "al-riyadh": "Riyadh"
};

function normalizzaSquadra(nome) {

  if (!testoValido(nome)) {
    return "";
  }

  const n = normalizzaTesto(nome);

  if (MAPPATURA_SQUADRE[n]) {
    return MAPPATURA_SQUADRE[n];
  }

  return nome.trim();
}

// ============================================================
// FETCH ESPN
// ============================================================

async function espnFetch(url) {

  const risposta = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });

  if (!risposta.ok) {
    throw new Error(
      "ESPN HTTP " + risposta.status + " - " + url
    );
  }

  return await risposta.json();
}

// ============================================================
// DATA PARTITA
// ============================================================

function dataISOdaESPN(data) {

  if (!testoValido(data)) {
    return "";
  }

  const d = new Date(data);

  if (isNaN(d.getTime())) {
    return "";
  }

  return d.toISOString().slice(0, 10);
}

function dataItaliana(data) {

  if (!data) return "";

  const d = new Date(data);

  if (isNaN(d.getTime())) {
    return "";
  }

  return d.toLocaleDateString("it-IT", {
    timeZone: "Europe/Rome",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function oraItaliana(data) {

  if (!data) return "";

  const d = new Date(data);

  if (isNaN(d.getTime())) {
    return "";
  }

  return d.toLocaleTimeString("it-IT", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// ============================================================
// IDENTIFICAZIONE COMPETIZIONE
// ============================================================

function trovaCodiceCompetizione(data) {

  const valori = [];

  if (data && data.league) {

    if (testoValido(data.league.slug)) {
      valori.push(data.league.slug);
    }

    if (testoValido(data.league.abbreviation)) {
      valori.push(data.league.abbreviation);
    }

    if (testoValido(data.league.name)) {
      valori.push(data.league.name);
    }
  }

  if (data && data.header && data.header.league) {

    if (testoValido(data.header.league.slug)) {
      valori.push(data.header.league.slug);
    }

    if (testoValido(data.header.league.name)) {
      valori.push(data.header.league.name);
    }
  }

  if (data && data.competitions && data.competitions[0]) {

    const c = data.competitions[0];

    if (c.league) {

      if (testoValido(c.league.slug)) {
        valori.push(c.league.slug);
      }

      if (testoValido(c.league.name)) {
        valori.push(c.league.name);
      }
    }
  }

  const mappa = {

    "ita.1": "ita.1",
    "serie a": "ita.1",

    "ita.2": "ita.2",
    "serie b": "ita.2",

    "ita.coppa_italia": "ita.coppa_italia",
    "coppa italia": "ita.coppa_italia",

    "ita.fifa": "ita.fifa",
    "italy": "ita.fifa",
    "italia": "ita.fifa",

    "uefa.champions": "uefa.champions",
    "uefa champions league": "uefa.champions",
    "champions league": "uefa.champions",

    "uefa.europa": "uefa.europa",
    "uefa europa league": "uefa.europa",
    "europa league": "uefa.europa",

    "uefa.europa.conf": "uefa.europa.conf",
    "uefa europa conference league": "uefa.europa.conf",
    "conference league": "uefa.europa.conf",

    "fra.1": "fra.1",
    "ligue 1": "fra.1",

    "esp.1": "esp.1",
    "la liga": "esp.1",
    "laliga": "esp.1",

    "eng.1": "eng.1",
    "premier league": "eng.1",

    "ksa.1": "ksa.1",
    "saudi pro league": "ksa.1",

    "por.1": "por.1",
    "liga portugal": "por.1",

    "ned.1": "ned.1",
    "eredivisie": "ned.1",

    "ger.1": "ger.1",
    "bundesliga": "ger.1"
  };

  for (const valore of valori) {

    const n = normalizzaTesto(valore);

    if (mappa[n]) {
      return mappa[n];
    }

    if (COMPETIZIONI[valore]) {
      return valore;
    }
  }

  return "";
}

// ============================================================
// FASE / TURNO DA FINESTRA
//
// QUESTA È LA FUNZIONE PIÙ IMPORTANTE.
//
// NON GUARDA PRIMA "OTTAVI", "QUARTI", ECC.
// PRIMA GUARDA LA COMPETIZIONE.
// POI LA DATA.
// POI LA FINESTRA.
// ============================================================

function faseDaFinestra(codiceCompetizione, dataPartita) {

  if (!codiceCompetizione) {
    return "";
  }

  if (!dataPartita) {
    return "";
  }

  const finestre = FINESTRE_GIORNATE[codiceCompetizione];

  if (!Array.isArray(finestre)) {
    return "";
  }

  const data = dataISOdaESPN(dataPartita);

  if (!data) {
    return "";
  }

  for (const finestra of finestre) {

    const dal = finestra[0];
    const al = finestra[1];
    const faseTurno = finestra[2];

    if (
      data >= dal &&
      data <= al
    ) {
      return faseTurno;
    }
  }

  return "";
}

// ============================================================
// LETTURA MATCHDAY UFFICIALE ESPN
// ============================================================

function estraiNumeroGiornataESPN(data) {

  const candidati = [];

  function cerca(obj) {

    if (!obj || typeof obj!== "object") {
      return;
    }

    if (
      typeof obj === "object" &&
      obj!== null
    ) {

      if (
        typeof obj.number === "number" &&
        obj.number > 0 &&
        obj.number < 100
      ) {
        candidati.push(obj.number);
      }

      if (
        typeof obj.number === "string" &&
        /^\d+$/.test(obj.number)
      ) {
        const n = parseInt(obj.number, 10);

        if (n > 0 && n < 100) {
          candidati.push(n);
        }
      }

      for (const key of Object.keys(obj)) {

        const valore = obj[key];

        if (
          key === "matchday" ||
          key === "matchDay" ||
          key === "week" ||
          key === "weekNumber"
        ) {

          if (typeof valore === "number") {
            candidati.push(valore);
          }

          if (
            typeof valore === "string" &&
            /^\d+$/.test(valore)
          ) {
            candidati.push(
              parseInt(valore, 10)
            );
          }
        }

        if (
          valore &&
          typeof valore === "object"
        ) {
          cerca(valore);
        }
      }
    }
  }

  cerca(data);

  if (candidati.length === 0) {
    return "";
  }

  return "Giornata " + candidati[0];
}

// ============================================================
// TRADUZIONE FASI ESPN
// ============================================================

function traduciFaseESPN(testo) {

  if (!testoValido(testo)) {
    return "";
  }

  const t = normalizzaTesto(testo);

  const map = [

    [/round of 64/, "Sedicesimi di finale"],
    [/round of 32/, "Sedicesimi di finale"],
    [/round of 16/, "Ottavi di finale"],
    [/round of 8/, "Quarti di finale"],
    [/quarterfinal/, "Quarti di finale"],
    [/quarter final/, "Quarti di finale"],
    [/semifinal/, "Semifinali"],
    [/semi final/, "Semifinali"],
    [/final/, "Finale"],

    [/playoff/, "Playoff"],
    [/play-in/, "Play-in"],
    [/play in/, "Play-in"],

    [/qualifying/, "Qualificazione"],
    [/qualification/, "Qualificazione"],
    [/preliminary/, "Turno preliminare"],

    [/first round/, "Primo turno"],
    [/second round/, "Secondo turno"],
    [/third round/, "Terzo turno"],
    [/fourth round/, "Quarto turno"],

    [/group stage/, "Fase a gironi"],
    [/league phase/, "Fase campionato"],
    [/knockout/, "Fase a eliminazione"]
  ];

  for (const [regex, risultato] of map) {

    if (regex.test(t)) {
      return risultato;
    }
  }

  return "";
}

// ============================================================
// RICERCA FASE ESPN
// ============================================================

function trovaFaseESPN(data) {

  const valori = [];

  function aggiungi(v) {

    if (testoValido(v)) {
      valori.push(v);
    }
  }

  function cerca(obj) {

    if (!obj || typeof obj!== "object") {
      return;
    }

    if (obj.phase) {

      if (typeof obj.phase === "string") {
        aggiungi(obj.phase);
      }

      if (typeof obj.phase.name === "string") {
        aggiungi(obj.phase.name);
      }

      if (typeof obj.phase.text === "string") {
        aggiungi(obj.phase.text);
      }
    }

    if (obj.stage) {

      if (typeof obj.stage === "string") {
        aggiungi(obj.stage);
      }

      if (typeof obj.stage.name === "string") {
        aggiungi(obj.stage.name);
      }

      if (typeof obj.stage.text === "string") {
        aggiungi(obj.stage.text);
      }
    }

    if (obj.type) {

      if (typeof obj.type.name === "string") {
        aggiungi(obj.type.name);
      }

      if (typeof obj.type.text === "string") {
        aggiungi(obj.type.text);
      }
    }

    for (const key of Object.keys(obj)) {

      const valore = obj[key];

      if (
        valore &&
        typeof valore === "object"
      ) {
        cerca(valore);
      }
    }
  }

  cerca(data);

  for (const valore of valori) {

    const fase = traduciFaseESPN(valore);

    if (fase) {
      return fase;
    }
  }

  return "";
}

// ============================================================
// FASE/TURNO DEFINITIVO
//
// PRIORITÀ ASSOLUTA:
//
// COMPETIZIONE
// ↓
// FINESTRE DELLA COMPETIZIONE
// ↓
// DATA REALE ESPN
// ↓
// GIORNATA DELLA FINESTRA
//
// SOLO SE NON ESISTE UNA FINESTRA:
// ↓
// FASE ESPN
// ============================================================

function getFaseTurno(data, codiceCompetizione) {

  const competizione =
    codiceCompetizione ||
    trovaCodiceCompetizione(data);

  const dataPartita =
    data && (
      data.date ||
      (
        data.header &&
        data.header.competitions &&
        data.header.competitions[0] &&
        data.header.competitions[0].date
      )
    );

  console.log(
    "FASE/TURNO - competizione:",
    competizione
  );

  console.log(
    "FASE/TURNO - data ESPN:",
    dataPartita
  );

  // ----------------------------------------------------------
  // PRIMA COSA:
  // CERCA LA COMPETIZIONE NELLE FINESTRE
  // ----------------------------------------------------------

  if (
    competizione &&
    FINESTRE_GIORNATE[competizione]
  ) {

    const faseFinestra =
      faseDaFinestra(
        competizione,
        dataPartita
      );

    console.log(
      "FASE/TURNO - risultato finestra:",
      faseFinestra
    );

    if (faseFinestra) {

      // ------------------------------------------------------
      // QUESTO RETURN BLOCCA QUALSIASI "OTTAVI DI FINALE"
      // PROVENIENTE DA ESPN.
      // ------------------------------------------------------

      return faseFinestra;
    }

    // --------------------------------------------------------
    // CASO SPECIALE LA LIGA:
    // se una partita viene spostata fuori dalla finestra,
    // prevale il matchday ufficiale ESPN.
    // --------------------------------------------------------

    if (competizione === "esp.1") {

      const giornataESPN =
        estraiNumeroGiornataESPN(data);

      if (giornataESPN) {
        return giornataESPN;
      }
    }

    // Per un campionato, se non è stata trovata la finestra,
    // NON dobbiamo trasformarlo in Ottavi/Quarti/Finale.
    if (
      [
        "ita.1",
        "ita.2",
        "fra.1",
        "eng.1",
        "esp.1",
        "ksa.1",
        "por.1",
        "ned.1",
        "ger.1"
      ].includes(competizione)
    ) {

      return "";
    }
  }

  // ----------------------------------------------------------
  // SOLO PER COMPETIZIONI SENZA FINESTRE:
  // USIAMO LA FASE DI ESPN.
  // ----------------------------------------------------------

  const faseESPN =
    trovaFaseESPN(data);

  if (faseESPN) {
    return faseESPN;
  }

  return "";
}

// ============================================================
// STATO PARTITA
// ============================================================

function traduciStato(data) {

  const stato =
    data &&
    data.header &&
    data.header.competitions &&
    data.header.competitions[0] &&
    data.header.competitions[0].status;

  if (!stato) {
    return "";
  }

  const type =
    stato.type &&
    stato.type.name
     ? stato.type.name
      : "";

  const detail =
    stato.type &&
    stato.type.detail
     ? stato.type.detail
      : "";

  const map = {
    STATUS_SCHEDULED: "Programmato",
    STATUS_IN_PROGRESS: "In corso",
    STATUS_FINAL: "Terminata",
    STATUS_POSTPONED: "Posticipata",
    STATUS_CANCELED: "Annullata",
    STATUS_CANCELLED: "Annullata",
    STATUS_DELAYED: "Rinviata"
  };

  if (map[type]) {
    return map[type];
  }

  if (testoValido(detail)) {
    return detail;
  }

  return type;
}

// ============================================================
// SQUADRE
// ============================================================

function estraiSquadre(data) {

  const risultato = {
    casa: "",
    trasferta: "",
    casaLogo: "",
    trasfertaLogo: "",
    casaScore: 0,
    trasfertaScore: 0
  };

  const competizione =
    data &&
    data.header &&
    data.header.competitions &&
    data.header.competitions[0];

  if (!competizione) {
    return risultato;
  }

  const competitors =
    competizione.competitors || [];

  for (const squadra of competitors) {

    const home =
      squadra.homeAway === "home";

    const nome =
      squadra.team &&
      (
        squadra.team.displayName ||
        squadra.team.shortDisplayName ||
        squadra.team.name
      );

    const logo =
      squadra.team &&
      (
        squadra.team.logo ||
        (
          squadra.team.logos &&
          squadra.team.logos[0] &&
          squadra.team.logos[0].href
        )
      );

    const score =
      Number(squadra.score || 0);

    if (home) {

      risultato.casa =
        normalizzaSquadra(nome);

      risultato.casaLogo =
        logo || "";

      risultato.casaScore =
        score;

    } else {

      risultato.trasferta =
        normalizzaSquadra(nome);

      risultato.trasfertaLogo =
        logo || "";

      risultato.trasfertaScore =
        score;
    }
  }

  return risultato;
}

// ============================================================
// MARCATORI
// ============================================================

function creaMarcatori(data) {

  const lista = [];

  const competizione =
    data &&
    data.header &&
    data.header.competitions &&
    data.header.competitions[0];

  if (!competizione) {
    return lista;
  }

  const competitors =
    competizione.competitors || [];

  for (const squadra of competitors) {

    const nomeSquadra =
      normalizzaSquadra(
        squadra.team &&
        squadra.team.displayName
      );

    const records =
      squadra.records || [];

    for (const record of records) {

      if (!record) continue;

      const athlete =
        record.athlete ||
        record.player ||
        {};

      const nome =
        athlete.displayName ||
        athlete.fullName ||
        athlete.shortName ||
        "";

      const minuti =
        record.minute ||
        record.time ||
        "";

      if (!nome) continue;

      lista.push({
        squadra: nomeSquadra,
        giocatore: ultimoCognome(nome),
        minuto: String(minuti || "")
      });
    }
  }

  // fallback sui plays
  if (
    lista.length === 0 &&
    Array.isArray(data.plays)
  ) {

    for (const play of data.plays) {

      const text =
        play.text ||
        play.shortText ||
        "";

      const type =
        play.type &&
        (
          play.type.text ||
          play.type.name
        );

      if (
        /goal|gol|scored/i.test(
          String(type) + " " + text
        )
      ) {

        const athlete =
          play.athletes &&
          play.athletes[0];

        const nome =
          athlete &&
          (
            athlete.displayName ||
            athlete.fullName
          );

        if (nome) {

          lista.push({
            squadra:
              play.team &&
              normalizzaSquadra(
                play.team.displayName
              ),
            giocatore:
              ultimoCognome(nome),
            minuto:
              play.clock &&
              play.clock.displayValue
               ? play.clock.displayValue
                : ""
          });
        }
      }
    }
  }

  return lista;
}

// ============================================================
// COGNOME
// ============================================================

function ultimoCognome(nome) {

  if (!testoValido(nome)) {
    return "";
  }

  const parti =
    nome
     .trim()
     .split(/\s+/);

  return parti[parti.length - 1];
}

// ============================================================
// CARTELLINI
// ============================================================

function creaCartellini(data) {

  const lista = [];

  const plays =
    Array.isArray(data.plays)
     ? data.plays
      : [];

  for (const play of plays) {

    const text =
      play.text ||
      play.shortText ||
      "";

    const tipo =
      play.type &&
      (
        play.type.text ||
        play.type.name ||
        ""
      );

    const combinato =
      normalizzaTesto(
        String(tipo) + " " + text
      );

    let cartellino = "";

    if (
      combinato.includes("second yellow") ||
      combinato.includes("seconda ammonizione")
    ) {
      cartellino = "Rosso per doppia ammonizione";
    }
    else if (
      combinato.includes("red card") ||
      combinato.includes("red card")
    ) {
      cartellino = "Rosso";
    }
    else if (
      combinato.includes("yellow card") ||
      combinato.includes("yellow")
    ) {
      cartellino = "Giallo";
    }

    if (!cartellino) {
      continue;
    }

    const athlete =
      play.athletes &&
      play.athletes[0];

    const nome =
      athlete &&
      (
        athlete.displayName ||
        athlete.fullName
      );

    lista.push({
      giocatore:
        ultimoCognome(nome || ""),
      cartellino,
      minuto:
        play.clock &&
        play.clock.displayValue
         ? play.clock.displayValue
          : "",
      squadra:
        play.team
         ? normalizzaSquadra(
              play.team.displayName
            )
          : ""
    });
  }

  return lista;
}

// ============================================================
// SOSTITUZIONI
// ============================================================

function creaSostituzioni(data) {

  const lista = [];

  const plays =
    Array.isArray(data.plays)
     ? data.plays
      : [];

  for (const play of plays) {

    const text =
      play.text ||
      play.shortText ||
      "";

    const tipo =
      play.type &&
      (
        play.type.text ||
        play.type.name ||
        ""
      );

    const combinato =
      normalizzaTesto(
        String(tipo) + " " + text
      );

    if (
     !(
        combinato.includes("substitution") ||
        combinato.includes("sostituzione") ||
        combinato.includes("substitutes")
      )
    ) {
      continue;
    }

    let entrato = "";
    let uscito = "";

    if (play.substitution) {

      const sub =
        play.substitution;

      const entra =
        sub.in ||
        sub.entered ||
        sub.inPlayer;

      const esce =
        sub.out ||
        sub.exited ||
        sub.outPlayer;

      if (entra) {

        entrato =
          ultimoCognome(
            entra.displayName ||
            entra.fullName ||
            entra.shortName ||
            ""
          );
      }

      if (esce) {

        uscito =
          ultimoCognome(
            esce.displayName ||
            esce.fullName ||
            esce.shortName ||
            ""
          );
      }
    }

    // Cerca i giocatori direttamente nel testo
    if (
      (!entrato ||!uscito) &&
      testoValido(text)
    ) {

      const parti =
        text
         .replace(/\s+/g, " ")
         .trim();

      const match =
        parti.match(
          /(?:substitution|sostituzione).*?([A-Za-zÀ-ÿ' -]+)(?: for | al posto di | per )([A-Za-zÀ-ÿ' -]+)/i
        );

      if (match) {

        if (!entrato) {
          entrato =
            ultimoCognome(
              match[1].trim()
            );
        }

        if (!uscito) {
          uscito =
            ultimoCognome(
              match[2].trim()
            );
        }
      }
    }

    lista.push({
      entrato,
      uscito,
      minuto:
        play.clock &&
        play.clock.displayValue
         ? play.clock.displayValue
          : "",
      squadra:
        play.team
         ? normalizzaSquadra(
              play.team.displayName
            )
          : ""
    });
  }

  return lista;
}

// ============================================================
// FORMAZIONI
// ============================================================

function creaFormazioni(data) {

  const risultato = {
    casa: [],
    trasferta: []
  };

  const competizione =
    data &&
    data.header &&
    data.header.competitions &&
    data.header.competitions[0];

  if (!competizione) {
    return risultato;
  }

  const competitors =
    competizione.competitors || [];

  for (const squadra of competitors) {

    const isHome =
      squadra.homeAway === "home";

    const roster =
      squadra.roster ||
      squadra.formation ||
      [];

    const formazione = [];

    if (Array.isArray(roster)) {

      for (const elemento of roster) {

        const athlete =
          elemento.athlete ||
          elemento.player ||
          elemento;

        if (!athlete) continue;

        const nome =
          athlete.displayName ||
          athlete.fullName ||
          athlete.shortName ||
          "";

        if (!nome) continue;

        let ruolo = "";

        if (elemento.position) {

          ruolo =
            elemento.position.displayName ||
            elemento.position.name ||
            elemento.position.abbreviation ||
            "";
        }

        formazione.push({
          cognome: ultimoCognome(nome),
          ruolo: ruolo || ""
        });
      }
    }

    if (isHome) {
      risultato.casa = formazione;
    } else {
      risultato.trasferta = formazione;
    }
  }

  return risultato;
    }

// ============================================================
// ALLENATORI
// ============================================================

function creaAllenatori(data) {

  const risultato = {
    casa: "",
    trasferta: ""
  };

  const competizione =
    data &&
    data.header &&
    data.header.competitions &&
    data.header.competitions[0];

  if (!competizione) {
    return risultato;
  }

  const competitors =
    competizione.competitors || [];

  for (const squadra of competitors) {

    const coaches =
      squadra.coaches ||
      squadra.coach ||
      [];

    if (!Array.isArray(coaches)) {
      continue;
    }

    const coach =
      coaches[0];

    if (!coach) continue;

    const nome =
      coach.displayName ||
      coach.fullName ||
      "";

    if (
      squadra.homeAway === "home"
    ) {
      risultato.casa = nome;
    }
    else {
      risultato.trasferta = nome;
    }
  }

  return risultato;
}

// ============================================================
// ARBITRI
// ============================================================

function creaArbitri(data) {

  const lista = [];

  const competizione =
    data &&
    data.header &&
    data.header.competitions &&
    data.header.competitions[0];

  if (!competizione) {
    return lista;
  }

  const officials =
    competizione.officials || [];

  for (const ufficiale of officials) {

    const nome =
      ufficiale.displayName ||
      ufficiale.fullName ||
      ufficiale.name ||
      "";

    if (!nome) continue;

    const ruolo =
      ufficiale.position &&
      (
        ufficiale.position.name ||
        ufficiale.position.displayName
      )
       ? (
          ufficiale.position.name ||
          ufficiale.position.displayName
        )
        : (
          ufficiale.role ||
          ufficiale.type &&
          (
            ufficiale.type.text ||
            ufficiale.type.name
          ) ||
          ""
        );

    lista.push({
      nome,
      ruolo
    });
  }

  return lista;
}

// ============================================================
// STATISTICHE
// ============================================================

function estraiStatistiche(data) {

  const risultato = {
    possessoCasa: 0,
    possessoTrasferta: 0,
    tiriCasa: 0,
    tiriTrasferta: 0,
    tiriPortaCasa: 0,
    tiriPortaTrasferta: 0,
    angoliCasa: 0,
    angoliTrasferta: 0,
    passaggiCasa: 0,
    passaggiTrasferta: 0,
    fuorigiocoCasa: 0,
    fuorigiocoTrasferta: 0
  };

  const competizione =
    data &&
    data.header &&
    data.header.competitions &&
    data.header.competitions[0];

  if (!competizione) {
    return risultato;
  }

  const competitors =
    competizione.competitors || [];

  function leggiStatistiche(stats) {

    const output = {};

    if (!Array.isArray(stats)) {
      return output;
    }

    for (const stat of stats) {

      const nome =
        normalizzaTesto(
          stat.name ||
          stat.displayName ||
          stat.label ||
          ""
        );

      const valore =
        stat.displayValue ||
        stat.value ||
        "";

      output[nome] = valore;
    }

    return output;
  }

  for (const squadra of competitors) {

    const stats =
      leggiStatistiche(
        squadra.statistics || []
      );

    const possesso =
      parseFloat(
        String(
          stats.possession ||
          stats["possession pct"] ||
          "0"
        ).replace("%", "")
      ) || 0;

    const tiri =
      parseFloat(
        stats.total_shots ||
        stats.shots ||
        stats["total shots"] ||
        "0"
      ) || 0;

    const tiriPorta =
      parseFloat(
        stats.shots_on_target ||
        stats["shots on target"] ||
        stats["shots on goal"] ||
        "0"
      ) || 0;

    const angoli =
      parseFloat(
        stats.corner_kicks ||
        stats.corners ||
        stats["corner kicks"] ||
        "0"
      ) || 0;

    const passaggi =
      parseFloat(
        stats.total_passes ||
        stats.passes ||
        stats["total passes"] ||
        "0"
      ) || 0;

    const fuorigioco =
      parseFloat(
        stats.offsides ||
        "0"
      ) || 0;

    if (
      squadra.homeAway === "home"
    ) {

      risultato.possessoCasa = possesso;
      risultato.tiriCasa = tiri;
      risultato.tiriPortaCasa = tiriPorta;
      risultato.angoliCasa = angoli;
      risultato.passaggiCasa = passaggi;
      risultato.fuorigiocoCasa = fuorigioco;

    } else {

      risultato.possessoTrasferta = possesso;
      risultato.tiriTrasferta = tiri;
      risultato.tiriPortaTrasferta = tiriPorta;
      risultato.angoliTrasferta = angoli;
      risultato.passaggiTrasferta = passaggi;
      risultato.fuorigiocoTrasferta = fuorigioco;
    }
  }

  return risultato;
}

// ============================================================
// STADIO
// ============================================================

function estraiStadio(data) {

  const competizione =
    data &&
    data.header &&
    data.header.competitions &&
    data.header.competitions[0];

  if (!competizione) {
    return {
      nome: "",
      citta: ""
    };
  }

  const venue =
    competizione.venue ||
    {};

  return {
    nome:
      venue.fullName ||
      venue.displayName ||
      venue.name ||
      "",

    citta:
      venue.address &&
      (
        venue.address.city ||
        ""
      )
       ? venue.address.city
        : ""
  };
}

// ============================================================
// TESTO CRONACA
// ============================================================

function creaCronaca(data) {

  const lista = [];

  const plays =
    Array.isArray(data.plays)
     ? data.plays
      : [];

  for (const play of plays) {

    const text =
      play.text ||
      play.shortText ||
      "";

    if (!text) {
      continue;
    }

    lista.push({
      minuto:
        play.clock &&
        play.clock.displayValue
         ? play.clock.displayValue
          : "",

      testo: text
    });
  }

  return lista;
}

// ============================================================
// WINNER / QUALIFICAZIONE
// ============================================================

function estraiVincitore(data) {

  const competizione =
    data &&
    data.header &&
    data.header.competitions &&
    data.header.competitions[0];

  if (!competizione) {
    return "";
  }

  if (
    competizione.status &&
    competizione.status.type &&
    competizione.status.type.completed
  ) {

    const competitors =
      competizione.competitors || [];

    for (const squadra of competitors) {

      if (
        squadra.winner === true
      ) {

        return normalizzaSquadra(
          squadra.team &&
          squadra.team.displayName
        );
      }
    }
  }

  return "";
}

// ============================================================
// PENALTY
// ============================================================

function estraiRigori(data) {

  const risultato = {
    casa: 0,
    trasferta: 0
  };

  const competizione =
    data &&
    data.header &&
    data.header.competitions &&
    data.header.competitions[0];

  if (!competizione) {
    return risultato;
  }

  const competitors =
    competizione.competitors || [];

  for (const squadra of competitors) {

    const score =
      squadra.score;

    const shootout =
      squadra.shootout ||
      squadra.penaltyScore ||
      squadra.penaltyShots;

    let valore = 0;

    if (
      typeof shootout === "number"
    ) {
      valore = shootout;
    }
    else if (
      typeof squadra.score === "object"
    ) {
      valore =
        Number(
          squadra.score.penalty ||
          squadra.score.shootout ||
          0
        );
    }

    if (
      squadra.homeAway === "home"
    ) {
      risultato.casa = valore;
    }
    else {
      risultato.trasferta = valore;
    }
  }

  return risultato;
}

// ============================================================
// ULTIMO COGNOME
// ============================================================

function nomeAtleta(obj) {

  if (!obj) return "";

  return (
    obj.displayName ||
    obj.fullName ||
    obj.shortName ||
    obj.name ||
    ""
  );
}

// ============================================================
// CREA EVENTI
// ============================================================

function creaEventi(data) {

  return {
    marcatori: creaMarcatori(data),
    cartellini: creaCartellini(data),
    sostituzioni: creaSostituzioni(data)
  };
}

// ============================================================
// ENDPOINT
// ============================================================

export default async function handler(req, res) {

  try {

    const id =
      req.query &&
      (
        req.query.id ||
        req.query.event
      );

    if (!id) {

      return res.status(400).json({
        errore:
          "Parametro id obbligatorio"
      });
    }

    // ========================================================
    // 1. PRENDIAMO LA PARTITA DIRETTAMENTE DA ESPN
    // ========================================================

    const url =
      ESPN_BASE +
      "/summary?event=" +
      encodeURIComponent(id);

    const data =
      await espnFetch(url);

    // ========================================================
    // 2. IDENTIFICHIAMO LA COMPETIZIONE
    // ========================================================

    const codiceCompetizione =
      trovaCodiceCompetizione(data);

    const infoCompetizione =
      COMPETIZIONI[codiceCompetizione] ||
      {
        nome:
          data &&
          data.header &&
          data.header.league &&
          data.header.league.name
           ? data.header.league.name
            : "",

        slug:
          codiceCompetizione || "",

        paese: ""
      };

    // ========================================================
    // 3. DATA REALE ESPN
    // ========================================================

    const dataPartita =
      data.date ||
      (
        data.header &&
        data.header.competitions &&
        data.header.competitions[0] &&
        data.header.competitions[0].date
      ) ||
      "";

    // ========================================================
    // 4. FASE/TURNO
    //
    // QUI VIENE USATA LA NUOVA LOGICA.
    //
    // NON:
    // data -> Ottavi
    //
    // MA:
    //
    // competizione -> finestra -> data -> giornata
    // ========================================================

    const faseTurno =
      getFaseTurno(
        data,
        codiceCompetizione
      );

    // ========================================================
    // 5. SQUADRE
    // ========================================================

    const squadre =
      estraiSquadre(data);

    // ========================================================
    // 6. EVENTI
    // ========================================================

    const eventi =
      creaEventi(data);

    // ========================================================
    // 7. FORMAZIONI
    // ========================================================

    const formazioni =
      creaFormazioni(data);

    // ========================================================
    // 8. ALLENATORI
    // ========================================================

    const allenatori =
      creaAllenatori(data);

    // ========================================================
    // 9. ARBITRI
    // ========================================================

    const arbitri =
      creaArbitri(data);

    // ========================================================
    // 10. STATISTICHE
    // ========================================================

    const statistiche =
      estraiStatistiche(data);

    // ========================================================
    // 11. STADIO
    // ========================================================

    const stadio =
      estraiStadio(data);

    // ========================================================
    // 12. CRONACA
    // ========================================================

    const cronaca =
      creaCronaca(data);

    // ========================================================
    // 13. VINCITORE
    // ========================================================

    const vincitore =
      estraiVincitore(data);

    // ========================================================
    // 14. RIGORI
    // ========================================================

    const rigori =
      estraiRigori(data);

    // ========================================================
    // RISPOSTA API
    // ========================================================

    return res.status(200).json({

      id: String(id),

      external_id:
        String(id),

      competizione:
        infoCompetizione.nome,

      competition_id:
        codiceCompetizione,

      paese:
        infoCompetizione.paese,

      // ======================================================
      // FASE/TURNO
      // ======================================================

      faseTurno:

        faseTurno || "",

      // ======================================================
      // DATA / ORA
      // ======================================================

      data:
        dataItaliana(dataPartita),

      data_iso:
        dataISOdaESPN(dataPartita),

      ora:
        oraItaliana(dataPartita),

      // ======================================================
      // STATO
      // ======================================================

      stato:
        traduciStato(data),

      // ======================================================
      // SQUADRE
      // ======================================================

      casa:
        squadre.casa,

      trasferta:
        squadre.trasferta,

      casaLogo:
        squadre.casaLogo,

      trasfertaLogo:
        squadre.trasfertaLogo,

      // ======================================================
      // RISULTATO
      // ======================================================

      golCasa:
        squadre.casaScore,

      golTrasferta:
        squadre.trasfertaScore,

      rigoriCasa:
        rigori.casa,

      rigoriTrasferta:
        rigori.trasferta,

      vincitore:
        vincitore,

      // ======================================================
      // STADIO
      // ======================================================

      stadio:
        stadio.nome,

      citta:
        stadio.citta,

      // ======================================================
      // ARBITRI
      // ======================================================

      arbitri:
        arbitri,

      // ======================================================
      // ALLENATORI
      // ======================================================

      allenatoreCasa:
        allenatori.casa,

      allenatoreTrasferta:
        allenatori.trasferta,

      // ======================================================
      // MARCATORI
      // ======================================================

      marcatori:
        eventi.marcatori,

      // ======================================================
      // CARTELLINI
      // ======================================================

      cartellini:
        eventi.cartellini,

      // ======================================================
      // SOSTITUZIONI
      // ======================================================

      sostituzioni:
        eventi.sostituzioni,

      // ======================================================
      // FORMAZIONI
      //
      // SOLO COGNOMI
      // ======================================================

      formazioneCasa:
        formazioni.casa,

      formazioneTrasferta:
        formazioni.trasferta,

      // ======================================================
      // STATISTICHE
      // ======================================================

      possessoCasa:
        statistiche.possessoCasa,

      possessoTrasferta:
        statistiche.possessoTrasferta,

      tiriCasa:
        statistiche.tiriCasa,

      tiriTrasferta:
        statistiche.tiriTrasferta,

      tiriPortaCasa:
        statistiche.tiriPortaCasa,

      tiriPortaTrasferta:
        statistiche.tiriPortaTrasferta,

      angoliCasa:
        statistiche.angoliCasa,

      angoliTrasferta:
        statistiche.angoliTrasferta,

      passaggiCasa:
        statistiche.passaggiCasa,

      passaggiTrasferta:
        statistiche.passaggiTrasferta,

      fuorigiocoCasa:
        statistiche.fuorigiocoCasa,

      fuorigiocoTrasferta:
        statistiche.fuorigiocoTrasferta,

      // ======================================================
      // CRONACA
      // ======================================================

      cronaca:
        cronaca,

      // ======================================================
      // LINK ESPN
      // ======================================================

      linkPartita:
        "https://www.espn.com/soccer/match/_/gameId/" +
        encodeURIComponent(id),

      linkStatistiche:
        "https://www.espn.com/soccer/match/_/gameId/" +
        encodeURIComponent(id)
    });

  }
  catch (errore) {

    console.error(
      "ERRORE API PARTITA:",
      errore
    );

    return res.status(500).json({

      errore:
        "Errore nel recupero della partita da ESPN",

      dettaglio:
        errore &&
        errore.message
         ? errore.message
          : String(errore)
    });
  }
}
