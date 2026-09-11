const { espnFetch } = require("../lib/espn");

/*
============================================================
API CALCIO 100%SERIEA&SERIEB
API PARTITA

Endpoint:

/api/partita?id=ID_PARTITA&competizione=CODICE_ESPN

Esempio:

/api/partita?id=401874945&competizione=ita.1

============================================================
REGOLA FONDAMENTALE FASE/TURNO

1. PRIMA viene controllata FINESTRE_GIORNATE.
2. Se la data della partita rientra in una finestra,
   viene utilizzato ESCLUSIVAMENTE il faseTurno della finestra.
3. SOLO se nessuna finestra corrisponde, viene utilizzato
   il dato della giornata eventualmente fornito da ESPN.
4. Se anche ESPN non fornisce la giornata:
   faseTurno = "".

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


/* =========================
   ALIAS SQUADRE
   ESPN → NOMI PERSONALIZZATI
   VALIDI IN TUTTE LE COMPETIZIONI
========================= */

const ALIAS_SQUADRE = {

  /* =========================
     ITALIA
  ========================= */

  "atalanta": "Atalanta",
  "atalanta bc": "Atalanta",

  "bologna": "Bologna",
  "bologna fc": "Bologna",

  "cagliari": "Cagliari",
  "cagliari calcio": "Cagliari",

  "como": "Como",
  "como 1907": "Como",

  "fiorentina": "Fiorentina",
  "acf fiorentina": "Fiorentina",

  "frosinone": "Frosinone",
  "frosinone calcio": "Frosinone",

  "genoa": "Genoa",
  "genoa cfc": "Genoa",

  "inter": "Inter",
  "inter milan": "Inter",
  "internazionale": "Inter",
  "internazionale milano": "Inter",
  "fc internazionale": "Inter",
  "internazionale fc": "Inter",

  "juventus": "Juventus",
  "juventus fc": "Juventus",
  "juventus turin": "Juventus",

  "lazio": "Lazio",
  "ss lazio": "Lazio",

  "lecce": "Lecce",
  "us lecce": "Lecce",

  "milan": "Milan",
  "ac milan": "Milan",
  "milan ac": "Milan",

  "monza": "Monza",
  "ac monza": "Monza",

  "napoli": "Napoli",
  "ssc napoli": "Napoli",

  "parma": "Parma",
  "parma calcio": "Parma",

  "roma": "Roma",
  "as roma": "Roma",

  "sassuolo": "Sassuolo",
  "us sassuolo": "Sassuolo",

  "torino": "Torino",
  "torino fc": "Torino",

  "udinese": "Udinese",
  "udinese calcio": "Udinese",

  "venezia": "Venezia",
  "venezia fc": "Venezia",

  "arezzo": "Arezzo",
  "ss arezzo": "Arezzo",

  "ascoli": "Ascoli",
  "ascoli calcio": "Ascoli",

  "avellino": "Avellino",
  "us avellino": "Avellino",

  "benevento": "Benevento",
  "benevento calcio": "Benevento",

  "carrarese": "Carrarese",

  "catania": "Catania",
  "catania fc": "Catania",

  "catanzaro": "Catanzaro",
  "us catanzaro": "Catanzaro",

  "cesena": "Cesena",
  "ac cesena": "Cesena",

  "cremonese": "Cremonese",
  "us cremonese": "Cremonese",

  "da definire": "Da Definire",

  "empoli": "Empoli",
  "empoli fc": "Empoli",

  "hellas verona": "Hellas Verona",
  "hellas verona fc": "Hellas Verona",
  "verona": "Hellas Verona",

  "juve stabia": "Juve Stabia",
  "ss juve stabia": "Juve Stabia",

  "mantova": "Mantova",
  "mantova 1911": "Mantova",

  "modena": "Modena",
  "modena fc": "Modena",

  "padova": "Padova",
  "calcio padova": "Padova",

  "palermo": "Palermo",
  "palermo fc": "Palermo",

  "pisa": "Pisa",
  "pisa sc": "Pisa",

  "potenza": "Potenza",
  "potenza calcio": "Potenza",

  "ravenna": "Ravenna",

  "sampdoria": "Sampdoria",
  "uc sampdoria": "Sampdoria",

  "sudtirol": "Sudtirol",
  "fc sudtirol": "Sudtirol",

  "vicenza": "Vicenza",
  "l.r. vicenza": "Vicenza",

  "virtus entella": "Virtus Entella",
  "entella": "Virtus Entella",

  "union brescia": "Union Brescia",

  /* =========================
     SPAGNA
  ========================= */

  "alaves": "Alaves",
  "deportivo alaves": "Alaves",

  "athletic club": "Atletico Bilbao",
  "athletic bilbao": "Atletico Bilbao",

  "atletico bilbao": "Atletico Bilbao",

  "atletico madrid": "Atletico Madrid",
  "club atletico de madrid": "Atletico Madrid",

  "barcelona": "Barcellona",
  "fc barcelona": "Barcellona",

  "betis": "Betis",
  "real betis": "Betis",

  "celta vigo": "Celta Vigo",
  "rc celta": "Celta Vigo",

  "deportivo la coruna": "Deportivo La Coruña",
  "deportivo la coruña": "Deportivo La Coruña",

  "elche": "Elche",
  "elche cf": "Elche",

  "espanyol": "Espanyol",
  "rcd espanyol": "Espanyol",

  "getafe": "Getafe",
  "getafe cf": "Getafe",

  "levante": "Levante",
  "levante ud": "Levante",

  "malaga": "Malaga",
  "malaga cf": "Malaga",

  "osasuna": "Osasuna",
  "ca osasuna": "Osasuna",

  "racing santander": "Racing Santander",
  "real racing club": "Racing Santander",

  "rayo vallecano": "Rayo Vallecano",

  "real madrid": "Real Madrid",

  "real sociedad": "Real Sociedad",

  "sevilla": "Siviglia",
  "sevilla fc": "Siviglia",

  "valencia": "Valencia",
  "valencia cf": "Valencia",

  "villarreal": "Villarreal",
  "villarreal cf": "Villarreal",

  /* =========================
     INGHILTERRA
  ========================= */

  "arsenal": "Arsenal",
  "arsenal fc": "Arsenal",

  "aston villa": "Aston Villa",

  "bournemouth": "Bournemouth",
  "afc bournemouth": "Bournemouth",

  "brentford": "Brentford",
  "brentford fc": "Brentford",

  "brighton": "Brighton",
  "brighton and hove albion": "Brighton",

  "chelsea": "Chelsea",
  "chelsea fc": "Chelsea",

  "coventry city": "Coventry City",
  "coventry city fc": "Coventry City",

  "crystal palace": "Crystal Palace",

  "everton": "Everton",
  "everton fc": "Everton",

  "fulham": "Fulham",
  "fulham fc": "Fulham",

  "hull city": "Hull City",

  "ipswich town": "Ipswich Town",
  "ipswich town fc": "Ipswich Town",

  "leeds": "Leeds",
  "leeds united": "Leeds",

  "liverpool": "Liverpool",
  "liverpool fc": "Liverpool",

  "manchester city": "Manchester City",
  "manchester city fc": "Manchester City",

  "manchester united": "Manchester United",
  "manchester united fc": "Manchester United",

  "newcastle": "Newcastle",
  "newcastle united": "Newcastle",

  "nottingham forest": "Nottingham Forest",

  "sunderland": "Sunderland",
  "sunderland afc": "Sunderland",

  "tottenham": "Tottenham",
  "tottenham hotspur": "Tottenham",

  /* =========================
     GERMANIA
  ========================= */

  "hamburg": "Amburgo",
  "hamburger sv": "Amburgo",

  "augsburg": "Augsburg",
  "fc augsburg": "Augsburg",

  "bayer leverkusen": "Bayer Leverkusen",

  "bayern munich": "Bayern Monaco",
  "bayern munchen": "Bayern Monaco",

  "borussia dortmund": "Borussia Dortmund",

  "borussia monchengladbach": "Borussia Monchengladbach",
  "borussia mönchengladbach": "Borussia Monchengladbach",

  "koln": "Colonia",
  "köln": "Colonia",
  "fc koln": "Colonia",
  "1. fc koln": "Colonia",

  "elversberg": "Elversberg",
  "sv elversberg": "Elversberg",

  "eintracht frankfurt": "Francoforte",
  "frankfurt": "Francoforte",

  "freiburg": "Friburgo",
  "sc freiburg": "Friburgo",

  "hoffenheim": "Hoffenheim",
  "tsg hoffenheim": "Hoffenheim",

  "rb leipzig": "Lipsia",
  "rasenballsport leipzig": "Lipsia",

  "mainz": "Mainz",
  "mainz 05": "Mainz",

  "schalke": "Schalke 04",
  "schalke 04": "Schalke 04",

  "stuttgart": "Stoccarda",
  "vfb stuttgart": "Stoccarda",

  "union berlin": "Union Berlino",
  "1. fc union berlin": "Union Berlino",

  "werder bremen": "Werder Brema",

  "wolfsburg": "Wolfsburg",
  "vfl wolfsburg": "Wolfsburg",

  /* =========================
     FRANCIA
  ========================= */

  "angers": "Angers",
  "angers sco": "Angers",

  "auxerre": "Auxerre",
  "aj auxerre": "Auxerre",

  "brest": "Brest",
  "stade brestois": "Brest",

  "le havre": "Le Havre",
  "le havre ac": "Le Havre",

  "le mans": "Le Mans",
  "le mans fc": "Le Mans",

  "lens": "Lens",
  "rc lens": "Lens",

  "lille": "Lilla",
  "lille osc": "Lilla",

  "lyon": "Lione",
  "olympique lyonnais": "Lione",

  "lorient": "Lorient",
  "fc lorient": "Lorient",

  "marseille": "Marsiglia",
  "olympique marseille": "Marsiglia",

  "monaco": "Monaco",
  "as monaco": "Monaco",

  "nice": "Nizza",
  "ogc nice": "Nizza",

  "psg": "PSG",
  "paris saint-germain": "PSG",
  "paris saint germain": "PSG",
  "paris saint-germain fc": "PSG",

  "paris fc": "Paris FC",

  "rennes": "Rennes",
  "stade rennais": "Rennes",

  "strasbourg": "Strasburgo",
  "rc strasbourg": "Strasburgo",

  "toulouse": "Tolosa",
  "toulouse fc": "Tolosa",

  "troyes": "Troyes",
  "estac troyes": "Troyes",

  /* =========================
     OLANDA
  ========================= */

  "az": "AZ",
  "az alkmaar": "AZ",

  "ajax": "Ajax",
  "afc ajax": "Ajax",

  "cambuur": "Cambuur",
  "sc cambuur": "Cambuur",

  "den haag": "Den Haag",
  "ado den haag": "Den Haag",

  "excelsior": "Excelsior",
  "excelsior rotterdam": "Excelsior",

  "feyenoord": "Feyenoord",
  "feyenoord rotterdam": "Feyenoord",

  "fortuna sittard": "Fortuna Sittard",

  "go ahead eagles": "Go Ahead Eagles",

  "groningen": "Groningen",
  "fc groningen": "Groningen",

  "heerenveen": "Heerenveen",
  "sc heerenveen": "Heerenveen",

  "nec": "NEC",
  "nec nijmegen": "NEC",

  "psv": "PSV Eindhoven",
  "psv eindhoven": "PSV Eindhoven",

  "sparta rotterdam": "Sparta Rotterdam",

  "telstar": "Telstar",

  "twente": "Twente",
  "fc twente": "Twente",

  "utrecht": "Utrecht",
  "fc utrecht": "Utrecht",

  "willem ii": "Willem II",

  "zwolle": "Zwolle",
  "pec zwolle": "Zwolle",

  /* =========================
     PORTOGALLO
  ========================= */

  "academico de viseu": "Académico de Viseu Futebol Clube",
  "académico de viseu": "Académico de Viseu Futebol Clube",
  "academico viseu": "Académico de Viseu Futebol Clube",

  "arouca": "Arouca",
  "fc arouca": "Arouca",

  "benfica": "Benfica",
  "sl benfica": "Benfica",

  "braga": "Braga",
  "sc braga": "Braga",

  "nacional": "CD Nacional",
  "cd nacional": "CD Nacional",

  "casa pia": "Casa Pia",
  "casa pia ac": "Casa Pia",

  "estoril": "Estoril Praia",
  "estoril praia": "Estoril Praia",

  "estrela amadora": "Estrela Amadora",
  "estrela da amadora": "Estrela Amadora",

  "famalicao": "Famalicão",
  "famalicão": "Famalicão",
  "fc famalicao": "Famalicão",

  "alverca": "Futebol Clube de Alverca",
  "fc alverca": "Futebol Clube de Alverca",
  "futebol clube de alverca": "Futebol Clube de Alverca",

  "gil vicente": "Gil Vicente",
  "gil vicente fc": "Gil Vicente",

  "maritimo": "Marítimo",
  "marítimo": "Marítimo",

  "moreirense": "Moreirense",
  "moreirense fc": "Moreirense",

  "porto": "Porto",
  "fc porto": "Porto",

  "rio ave": "Rio Ave",
  "rio ave fc": "Rio Ave",

  "santa clara": "Santa Clara",
  "cd santa clara": "Santa Clara",

  "sporting": "Sporting Lisbona",
  "sporting cp": "Sporting Lisbona",
  "sporting lisbon": "Sporting Lisbona",
  "sporting lisbona": "Sporting Lisbona",

  "vitoria guimaraes": "Vitoria Guimaraes",
  "vitoria sc": "Vitoria Guimaraes",
  "vitoria de guimaraes": "Vitoria Guimaraes",

  /* =========================
     CHAMPIONS / EUROPA / CONFERENCE
  ========================= */

  "aek athens": "AEK Atene",
  "aek": "AEK Atene",

  "bodø/glimt": "Bodø/Glimt",
  "bodo/glimt": "Bodø/Glimt",

  "club brugge": "Club Brugge",
  "club brugge kv": "Club Brugge",

  "fenerbahce": "Fenerbahce",
  "fenerbahçe": "Fenerbahce",

  "galatasaray": "Galatasaray",

  "lask": "LASK",

  "sturm graz": "Sturm Graz",

  "shakhtar donetsk": "Shakhtar Donetsk",

  "slavia prague": "Slavia Praga",
  "slavia praha": "Slavia Praga",

  "slovan bratislava": "Slovan Bratislava",

  "viking": "Viking",

  "lens": "Lens",

  "anderlecht": "Anderlecht",
  "rsc anderlecht": "Anderlecht",

  "ararat-armenia": "Ararat-Armenia",

  "bournemouth": "Bournemouth",

  "celje": "Celje",

  "celtic": "Celtic",

  "crystal palace": "Crystal Palace",

  "dinamo zagreb": "Dinamo Zagabria",

  "ferencvaros": "Ferencváros",
  "ferencváros": "Ferencváros",

  "hapoel beer sheva": "Hapoel Beer-Sheva",

  "jagiellonia": "Jagiellonia",

  "lech poznan": "Lech Poznań",
  "lech poznań": "Lech Poznań",

  "levski sofia": "Levski Sofia",

  "lillestrom": "Lillestrøm",
  "lillestrøm": "Lillestrøm",

  "nec nijmegen": "NEC",

  "ofi": "OFI Creta",
  "ofi crete": "OFI Creta",

  "olympiacos": "Olympiacos",

  "omonia": "Omonia",

  "salzburg": "Salisburgo",
  "red bull salzburg": "Salisburgo",

  "sparta prague": "Sparta Praga",
  "sparta praha": "Sparta Praga",

  "torreense": "Torreense",

  "union saint-gilloise": "Union Saint-Gilloise",
  "union sg": "Union Saint-Gilloise",

  "viktoria plzen": "Viktoria Plzeň",
  "viktoria plzeň": "Viktoria Plzeň",

  "aarhus": "Aarhus",
  "agf": "Aarhus",

  "borac": "Borac",

  "brann": "Brann",

  "copenhagen": "Copenhagen",
  "fc copenhagen": "Copenhagen",

  "egnatia": "Egnatia",

  "gent": "Gent",
  "kaa gent": "Gent",

  "hajduk split": "Hajduk Spalato",

  "hearts": "Hearts",

  "iberia tbilisi": "Iberia Tbilisi",

  "inter escaldes": "Inter Escaldes",

  "jablonec": "Jablonec",

  "kairat almaty": "Kairat Almaty",

  "kauno zalgiris": "Kauno Žalgiris",
  "kauno žalgiris": "Kauno Žalgiris",

  "kups": "KuPS Kuopio",
  "kups kuopio": "KuPS Kuopio",

  "lincoln red imps": "Lincoln Red Imps",

  "lugano": "Lugano",

  "midtjylland": "Midtjylland",
  "fc midtjylland": "Midtjylland",

  "mjallby": "Mjällby",
  "mjällby": "Mjällby",

  "nordsjaelland": "Nordsjælland",
  "nordsjælland": "Nordsjælland",

  "pafos": "Pafos",

  "panathinaikos": "Panathinaikos",

  "riga": "Riga",

  "sint-truiden": "Sint-Truidense",
  "sint-truidense": "Sint-Truidense",

  "red star belgrade": "Stella Rossa",
  "crvena zvezda": "Stella Rossa",
  "stella rossa": "Stella Rossa",

  "thun": "Thun",

  "trabzonspor": "Trabzonspor",

  "universitatea craiova": "Universitatea Craiova",

  /* =========================
     ARABIA SAUDITA
  ========================= */

  "abha": "Abha Club",
  "abha club": "Abha Club",

  "al ahli": "Al Ahli",
  "al-ahli": "Al Ahli",

  "al diriyah": "Al Diriyah",

  "al ettifaq": "Al Ettifaq",

  "al faisaly": "Al Faisaly",

  "al fateh": "Al Fateh",

  "al fayha": "Al Fayha",

  "al hazem": "Al Hazem",

  "al hilal": "Al Hilal",
  "al hilal saudi": "Al Hilal",
  "al hilal saudi fc": "Al Hilal",

  "al ittihad": "Al Ittihad",
  "al ittihad club": "Al Ittihad",

  "al khaleej": "Al Khaleej",

  "al kholood": "Al Kholood",

  "al nassr": "Al Nassr",
  "al nassr fc": "Al Nassr",

  "al qadisiyah": "Al Qadisiyah",
  "al qadsiah": "Al Qadisiyah",

  "al shabab": "Al Shabab",

  "al taawon": "Al Taawon",
  "al taawoun": "Al Taawon",

  "neom": "Neom SC",
  "neom sc": "Neom SC",

  "riyadh": "Riyadh SC",
  "riyadh sc": "Riyadh SC"
};


/* =========================
   NORMALIZZA CHIAVE
========================= */

function normalizzaChiaveSquadra(nome) {
  return String(nome || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .trim();
}


/* =========================
   TRADUZIONE / NORMALIZZAZIONE
========================= */

function traduciSquadra(nome) {
  if (!nome) return nome;

  const chiave = normalizzaChiaveSquadra(nome);

  return ALIAS_SQUADRE[chiave] || nome;
}


/* ============================================================
   NORMALIZZAZIONE TESTO
============================================================ */

function normalizzaTesto(testo) {

  if (!testo) {
    return "";
  }

  return String(testo)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ");

}


/* ============================================================
   NOME SQUADRA
============================================================ */

function normalizzaNomeSquadra(nome) {

  if (!nome) {
    return null;
  }

  const originale = String(nome).trim();

  const chiave = normalizzaTesto(originale);

  if (ALIAS_SQUADRE[chiave]) {
    return ALIAS_SQUADRE[chiave];
  }

  return originale;

}


/* ============================================================
   COGNOME
============================================================ */

function ultimoCognome(nome) {

  if (!nome) {
    return null;
  }

  const testo = String(nome)
    .trim()
    .replace(/\s+/g, " ");

  if (!testo) {
    return null;
  }

  return testo.split(" ").pop();

}


/* ============================================================
   ATLETA
============================================================ */

function estraiAtleta(obj) {

  if (!obj) {
    return null;
  }

  return (
    obj?.athlete ||
    obj?.player ||
    obj?.participant ||
    obj
  );

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


function cognomeAtleta(obj) {

  const atleta = estraiAtleta(obj);

  return ultimoCognome(
    nomeCompletoAtleta(atleta)
  );

}


function nomeGiocatore(play) {

  return cognomeAtleta(
    play?.athlete ||
    play?.player ||
    play?.athletesInvolved?.[0] ||
    play?.participants?.[0]?.athlete ||
    play?.participants?.[0]?.player
  );

}


function assistGiocatore(play) {

  return cognomeAtleta(
    play?.assistedBy ||
    play?.assist ||
    play?.assistBy ||
    play?.athletesInvolved?.[1] ||
    play?.participants?.[1]?.athlete ||
    play?.participants?.[1]?.player
  );

}


/* ============================================================
   MINUTO EVENTO
============================================================ */

function minutoEvento(play) {

  if (!play) {
    return null;
  }

  return (
    play.clock?.displayValue ||
    play.clock?.value ||
    play.time?.displayValue ||
    play.time?.value ||
    play.displayClock ||
    play.minute ||
    null
  );

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

  return normalizzaNomeSquadra(nome);

}


/* ============================================================
   TIPO EVENTO
============================================================ */

function tipoEvento(play) {

  if (!play) {
    return "";
  }

  const testo = String(
    play.type?.text ||
    play.type?.description ||
    play.type?.name ||
    play.type?.id ||
    play.alternativeType?.text ||
    play.text ||
    ""
  ).toLowerCase();

  /*
  START DELAY = GIOCO INTERROTTO
  END DELAY   = GIOCO RIPRESO
  */

  if (
    /start delay/i.test(testo)
  ) {
    return "Gioco interrotto";
  }

  if (
    /end delay/i.test(testo)
  ) {
    return "Gioco ripreso";
  }

  if (
    /drinks break|injury delay|match delayed|game delayed|match interrupted|game interrupted|interruption|interrupted/i.test(testo)
  ) {
    return "Gioco interrotto";
  }

  if (
    /delay over|ready to continue|ready to resume|match resumes|game resumes|match resumed|game resumed|resume|resumed/i.test(testo)
  ) {
    return "Gioco ripreso";
  }

  return testo;
}

/* ============================================================
   TRADUZIONE EVENTI
============================================================ */

function traduciEvento(tipo) {

  if (tipo === null || tipo === undefined) {
    return "";
  }

  const t = String(tipo)
    .trim()
    .toLowerCase();

  if (!t) {
    return "";
  }

  // =========================================================
  // GIOCO INTERROTTO / RIPRESO
  // =========================================================

  if (
    t.includes("start delay") ||
    t.includes("game delay") ||
    t.includes("match delay") ||
    t.includes("game interrupted") ||
    t.includes("match interrupted") ||
    t.includes("interruption") ||
    t.includes("interrupted") ||
    t.includes("injury delay") ||
    t.includes("drinks break")
  ) {
    return "Gioco interrotto";
  }

  if (
    t.includes("end delay") ||
    t.includes("game resumed") ||
    t.includes("match resumed") ||
    t.includes("game resumes") ||
    t.includes("match resumes") ||
    t.includes("resume") ||
    t.includes("resumed") ||
    t.includes("delay over")
  ) {
    return "Gioco ripreso";
  }

  // =========================================================
  // INIZIO / FINE PARTITA
  // =========================================================

  if (
    t === "kickoff" ||
    t.includes("kickoff") ||
    t.includes("match begins") ||
    t.includes("game begins") ||
    t.includes("match started") ||
    t.includes("game started") ||
    t.includes("first half begins") ||
    t.includes("second half begins")
  ) {
    if (
      t.includes("second half")
    ) {
      return "Inizio secondo tempo";
    }

    return "Inizio partita";
  }

  if (
    t.includes("first half ends") ||
    t.includes("end of first half") ||
    t.includes("halftime") ||
    t === "half time" ||
    t.includes("half-time")
  ) {
    return "Fine primo tempo";
  }

  if (
    t.includes("second half ends") ||
    t.includes("end of second half")
  ) {
    return "Fine secondo tempo";
  }

  if (
    t === "full time" ||
    t.includes("full time") ||
    t.includes("match ends") ||
    t.includes("game ends") ||
    t.includes("match ended") ||
    t.includes("game ended")
  ) {
    return "Fine partita";
  }

  // =========================================================
  // GOL
  // =========================================================
  // IMPORTANTE:
  // AUTOGOL DEVE ESSERE CONTROLLATO PRIMA DI "GOAL"
  // =========================================================

  if (
    t.includes("own goal") ||
    t.includes("own-goal") ||
    t.includes("autogoal") ||
    t.includes("autogol")
  ) {
    return "Autogol";
  }

  if (
    t === "goal" ||
    t.includes("goal!") ||
    t.includes("goal ") ||
    t.startsWith("goal") ||
    t.includes("score")
  ) {
    return "Gol";
  }

  // =========================================================
  // RIGORE
  // =========================================================

  if (
    t.includes("penalty shootout") ||
    t.includes("penalty shoot-out") ||
    t.includes("penalty shoot out") ||
    t.includes("shootout") ||
    t.includes("shoot-out") ||
    t.includes("series of penalties") ||
    t.includes("calci di rigore") ||
    t.includes("serie di rigori")
  ) {
    return "Calci di rigore";
  }

  if (
    t === "penalty" ||
    t.startsWith("penalty") ||
    t.includes("penalty kick")
  ) {
    return "Rigore";
  }

  // =========================================================
  // CARTELLINI
  // =========================================================

  if (
    t.includes("yellow card") ||
    t.includes("yellow-card") ||
    t.includes("caution") ||
    t.includes("booked") ||
    t.includes("ammonizione")
  ) {
    return "Ammonizione";
  }

  if (
    t.includes("second yellow") ||
    t.includes("second-yellow") ||
    t.includes("second yellow card")
  ) {
    return "Seconda ammonizione";
  }

  if (
    t.includes("red card") ||
    t.includes("red-card") ||
    t.includes("sent off") ||
    t.includes("sent-off") ||
    t.includes("straight red") ||
    t.includes("espulsione")
  ) {
    return "Espulsione";
  }

  // =========================================================
  // SOSTITUZIONI
  // =========================================================

  if (
    t.includes("substitution") ||
    t.includes("substitute") ||
    t.includes("subbed") ||
    t.includes("entra") ||
    t.includes("sostituzione")
  ) {
    return "Sostituzione";
  }

  // =========================================================
  // INFORTUNI
  // =========================================================

  if (
    t.includes("injury") ||
    t.includes("injured") ||
    t.includes("injury stoppage")
  ) {
    return "Infortunio";
  }

  // =========================================================
  // VAR
  // =========================================================

  if (
    t.includes("var") ||
    t.includes("video review") ||
    t.includes("video assistant referee") ||
    t.includes("review")
  ) {
    return "VAR";
  }

  // =========================================================
  // FUORIGIOCO
  // =========================================================

  if (
    t.includes("offside") ||
    t.includes("offsides") ||
    t.includes("fuorigioco")
  ) {
    return "Fuorigioco";
  }

  // =========================================================
  // CALCI D'ANGOLO
  // =========================================================

  if (
    t.includes("corner") ||
    t.includes("corner kick") ||
    t.includes("calcio d'angolo")
  ) {
    return "Calcio d'angolo";
  }

  // =========================================================
  // PUNIZIONI
  // =========================================================

  if (
    t.includes("free kick") ||
    t.includes("free-kick") ||
    t.includes("punizione")
  ) {
    return "Punizione";
  }

  // =========================================================
  // RIMESSE LATERALI
  // =========================================================

  if (
    t.includes("throw-in") ||
    t.includes("throw in") ||
    t.includes("rimessa laterale")
  ) {
    return "Rimessa laterale";
  }

  // =========================================================
  // RINVIO DAL FONDO
  // =========================================================

  if (
    t.includes("goal kick") ||
    t.includes("goal-kick") ||
    t.includes("rinvio dal fondo")
  ) {
    return "Rinvio dal fondo";
  }

  // =========================================================
  // PALLA AL CENTRO
  // =========================================================

  if (
    t.includes("kick off") ||
    t.includes("kick-off")
  ) {
    return "Calcio d'inizio";
  }

  // =========================================================
  // FINE TEMPO SUPPLEMENTARE
  // =========================================================

  if (
    t.includes("extra time") &&
    (
      t.includes("end") ||
      t.includes("ends") ||
      t.includes("ended")
    )
  ) {
    return "Fine tempi supplementari";
  }

  // =========================================================
  // INIZIO TEMPI SUPPLEMENTARI
  // =========================================================

  if (
    t.includes("extra time") &&
    (
      t.includes("start") ||
      t.includes("begin") ||
      t.includes("begins")
    )
  ) {
    return "Inizio tempi supplementari";
  }

  // =========================================================
  // INTERVALLO TEMPI SUPPLEMENTARI
  // =========================================================

  if (
    t.includes("extra time") &&
    (
      t.includes("half time") ||
      t.includes("halftime") ||
      t.includes("half-time")
    )
  ) {
    return "Intervallo tempi supplementari";
  }

  // =========================================================
  // AMMONIZIONE / FALLI GENERICI
  // =========================================================

  if (
    t === "foul" ||
    t.includes("foul")
  ) {
    return "Fallo";
  }

  // =========================================================
  // MANO
  // =========================================================

  if (
    t.includes("handball") ||
    t.includes("hand ball") ||
    t.includes("mano")
  ) {
    return "Fallo di mano";
  }

  // =========================================================
  // SALVATAGGIO DEL PORTIERE
  // =========================================================

  if (
    t.includes("save") ||
    t.includes("saved")
  ) {
    return "Parata";
  }

  // =========================================================
  // TIRO BLOCCATO
  // =========================================================

  if (
    t.includes("blocked shot") ||
    t.includes("shot blocked") ||
    t.includes("blocked")
  ) {
    return "Tiro bloccato";
  }

  // =========================================================
  // TIRO FUORI
  // =========================================================

  if (
    t.includes("shot off target") ||
    t.includes("shot wide") ||
    t.includes("missed") ||
    t.includes("wide")
  ) {
    return "Tiro fuori";
  }

  // =========================================================
  // TIRO IN PORTA
  // =========================================================

  if (
    t.includes("shot on target") ||
    t.includes("shot on goal") ||
    t.includes("on target")
  ) {
    return "Tiro in porta";
  }

  // =========================================================
  // PALO / TRAVERSA
  // =========================================================

  if (
    t.includes("hit the post") ||
    t.includes("hits the post") ||
    t.includes("post")
  ) {
    return "Palo";
  }

  if (
    t.includes("crossbar") ||
    t.includes("bar")
  ) {
    return "Traversa";
  }

  // =========================================================
  // PARI
  // =========================================================

  if (
    t.includes("equalizer") ||
    t.includes("equaliser")
  ) {
    return "Pareggio";
  }

  // =========================================================
  // ASSIST
  // =========================================================

  if (
    t.includes("assist")
  ) {
    return "Assist";
  }

  // =========================================================
  // RIGORE PARATO
  // =========================================================

  if (
    t.includes("penalty saved") ||
    t.includes("penalty save")
  ) {
    return "Rigore parato";
  }

  // =========================================================
  // RIGORE SBAGLIATO
  // =========================================================

  if (
    t.includes("penalty missed") ||
    t.includes("penalty miss")
  ) {
    return "Rigore sbagliato";
  }

  // =========================================================
  // TECNICI / PAUSE
  // =========================================================

  if (
    t.includes("water break") ||
    t.includes("drinks break")
  ) {
    return "Pausa per rinfrescarsi";
  }

  // =========================================================
  // CASI GIÀ IN ITALIANO
  // =========================================================

  if (
    t === "gol" ||
    t === "autogol" ||
    t === "ammonizione" ||
    t === "espulsione" ||
    t === "sostituzione" ||
    t === "rigore" ||
    t === "calci di rigore" ||
    t === "gioco interrotto" ||
    t === "gioco ripreso" ||
    t === "fine partita" ||
    t === "fine primo tempo" ||
    t === "inizio partita" ||
    t === "inizio secondo tempo" ||
    t === "fuorigioco" ||
    t === "calcio d'angolo" ||
    t === "fallo" ||
    t === "infortunio" ||
    t === "var"
  ) {
    return String(tipo);
  }

  // =========================================================
  // FALLBACK
  // =========================================================
  // Se ESPN manda un tipo che non conosciamo,
  // non inventiamo una traduzione.
  // Manteniamo il testo originale.
  // =========================================================

  return String(tipo);
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
      gol: null
    };

  }

  let gol = null;

  if (
    typeof x.score === "object" &&
    x.score !== null
  ) {

    gol =
      x.score.value ??
      x.score.displayValue ??
      null;

  } else {

    gol =
      x.score ??
      null;

  }

  const numeroGol = Number(gol);

  return {

    id:
      x.team?.id ||
      null,

    nome:
      normalizzaNomeSquadra(
        x.team?.displayName ||
        x.team?.fullName ||
        x.team?.name ||
        null
      ),

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
        : null

  };

}


/* ============================================================
   MARCATORI
============================================================ */

function creaMarcatori(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays

    .filter(function (p) {

      const tipo = tipoEvento(p);

      return (
        p?.scoringPlay === true ||
        p?.isScoringPlay === true ||
        tipo.includes("goal") ||
        tipo.includes("gol") ||
        tipo.includes("score")
      );

    })

    .map(function (p) {

      const testoRaw = String(
        p?.text ||
        p?.description ||
        p?.type?.text ||
        ""
      ).toLowerCase();

      /*
      AUTOGOL:
      controllato per primo, dato che
      un autogol non deve mai ricevere
      il suffisso (R.).
      */

      const autorete =
        testoRaw.includes("own goal") ||
        p?.ownGoal === true ||
        p?.ownGoal === "true" ||
        tipoEvento(p).toLowerCase().includes("own goal");

      /*
      RIGORE:
      solo se non è un autogol.
      */

      const rigore =
        !autorete &&
        (
          testoRaw.includes("penalty") ||
          p?.penaltyKick === true ||
          p?.scoringType?.name === "penalty" ||
          p?.scoringType?.abbreviation === "PK"
        );

      let giocatore =
        nomeGiocatore(p);

      if (giocatore) {

        if (autorete) {

          giocatore =
            giocatore + " (AG.)";

        } else if (rigore) {

          giocatore =
            giocatore + " (R.)";

        }

      }

      return {

        minuto:
          minutoEvento(p),

        squadra:
          squadraEvento(p),

        giocatore:
          giocatore

      };

    });

}


/* ============================================================
   CARTELLINI
============================================================ */

function creaCartellini(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays

    .filter(function (p) {

      const tipo = tipoEvento(p);

      return (
        tipo.includes("yellow") ||
        tipo.includes("red") ||
        tipo.includes("giallo") ||
        tipo.includes("rosso")
      );

    })

    .map(function (p) {

      const tipo = tipoEvento(p);

      return {

        minuto:
          minutoEvento(p),

        squadra:
          squadraEvento(p),

        giocatore:
          nomeGiocatore(p),

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

  if (!Array.isArray(plays)) {
    return [];
  }

  const risultati = [];

  for (const p of plays) {

    const tipo = tipoEvento(p);

    const testo = String(
      p?.text ||
      p?.description ||
      p?.type?.text ||
      ""
    ).toLowerCase();

    const eSostituzione =
      tipo.includes("substitution") ||
      tipo.includes("sostituzione") ||
      tipo.includes("sub") ||
      testo.includes("substitution") ||
      testo.includes("sostituzione") ||
      testo.includes("entra") ||
      testo.includes("esce") ||
      testo.includes("replaces") ||
      testo.includes("replaced");

    if (!eSostituzione) {
      continue;
    }

    let entrato =
      p?.substitution?.in ||
      p?.substitution?.entered ||
      p?.substitution?.playerIn ||
      p?.substitution?.incoming ||
      null;

    let uscito =
      p?.substitution?.out ||
      p?.substitution?.exited ||
      p?.substitution?.playerOut ||
      p?.substitution?.outgoing ||
      null;


    if (
      (!entrato || !uscito) &&
      Array.isArray(p?.athletesInvolved)
    ) {

      const lista =
        p.athletesInvolved;

      for (const atleta of lista) {

        const ruolo = String(
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
        (!entrato || !uscito) &&
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
      (!entrato || !uscito) &&
      Array.isArray(p?.participants)
    ) {

      const lista =
        p.participants;

      for (const partecipante of lista) {

        const ruolo = String(
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
        (!entrato || !uscito) &&
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


    risultati.push({

      minuto:
        minutoEvento(p),

      squadra:
        squadraEvento(p),

      entra:
        cognomeAtleta(entrato),

      esce:
        cognomeAtleta(uscito)

    });

  }

  return risultati;

}


/* ============================================================
   ARBITRI
============================================================ */

function puliviNomeArbitro(nome) {

  if (!nome) {
    return null;
  }

  let testo = String(nome);

  /*
  Rimuove parentesi, codici, numeri
  e caratteri non pertinenti a un
  nome e cognome.
  */

  testo = testo
    .replace(/\(.*?\)/g, " ")
    .replace(/\[.*?\]/g, " ")
    .replace(/[0-9]/g, " ")
    .replace(/[_#*]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!testo) {
    return null;
  }

  return testo;

}


function creaArbitri(data, competition) {

  const ufficiali =
    competition?.officials ||
    data?.officials ||
    data?.gameInfo?.officials ||
    [];

  const risultati = {

    arbitro: null,
    assistente1: null,
    assistente2: null,
    quartoUfficiale: null,
    var: null,
    avar: null

  };

  if (!Array.isArray(ufficiali)) {
    return risultati;
  }

  for (const ufficiale of ufficiali) {

    const nome =
      ufficiale?.displayName ||
      ufficiale?.fullName ||
      ufficiale?.name ||
      null;

    if (!nome) {
      continue;
    }

    const ruolo = String(
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
      }

      else if (!risultati.assistente2) {
        risultati.assistente2 = nome;
      }

      continue;

    }


    if (
      ruolo.includes("fourth") ||
      ruolo.includes("4th") ||
      ruolo.includes("quarto")
    ) {

      risultati.quartoUfficiale = nome;

      continue;

    }


    if (
      ruolo === "var" ||
      ruolo.includes("video assistant referee") ||
      ruolo.includes("video referee")
    ) {

      risultati.var = nome;

      continue;

    }


    if (
      ruolo.includes("avar") ||
      ruolo.includes("assistant video assistant")
    ) {

      risultati.avar = nome;

    }

  }


  /*
  Fallback:
  se ESPN non indica il ruolo del primo ufficiale,
  utilizziamo il primo ufficiale disponibile come arbitro.
  */

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


  /*
  Pulizia finale:
  restituiamo solo nome e cognome
  dell'arbitro principale, senza
  codici o caratteri strani.
  */

  risultati.arbitro =
    puliviNomeArbitro(
      risultati.arbitro
    );

  return risultati;

}


/* ============================================================
   STATO
============================================================ */

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
    String(stato.name || "")
      .toLowerCase();

  const descrizione =
    String(stato.description || "")
      .toLowerCase();

  const statoInterno =
    String(stato.state || "")
      .toLowerCase();


  if (
    statoInterno === "in" ||
    statoInterno === "live" ||
    statoInterno === "inprogress" ||
    nome.includes("progress") ||
    nome.includes("live") ||
    descrizione.includes("live") ||
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


/* ============================================================
   DATA E ORA ITALIANA
============================================================ */

function convertiDataOraItaliana(valore) {

  if (!valore) {

    return {
      data: "",
      ora: ""
    };

  }

  try {

    const data =
      new Date(valore);

    if (isNaN(data.getTime())) {

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

  }

  catch (errore) {

    return {
      data: "",
      ora: ""
    };

  }

}


/* ============================================================
   DATA ISO ITALIANA
   Necessaria per controllare le finestre.
============================================================ */

function dataISOItalia(valore) {

  if (!valore) {
    return null;
  }

  try {

    const data =
      new Date(valore);

    if (isNaN(data.getTime())) {
      return null;
    }

    const parti =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone: "Europe/Rome",
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }
      ).formatToParts(data);

    const m = {};

    for (const parte of parti) {
      if (parte.type !== "literal") {
        m[parte.type] = parte.value;
      }
    }

    if (
      !m.year ||
      !m.month ||
      !m.day
    ) {
      return null;
    }

    return (
      m.year +
      "-" +
      m.month +
      "-" +
      m.day
    );

  }

  catch (errore) {

    return null;

  }

}


/* ============================================================
   FINESTRE GIORNATE
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
    { inizio:"2026-09-03", fine:"2026-09-09", faseTurno:"Giornata 5" },
    { inizio:"2026-09-10", fine:"2026-09-16", faseTurno:"Giornata 6" },
    { inizio:"2026-09-17", fine:"2026-09-24", faseTurno:"Giornata 7" },
    { inizio:"2026-10-08", fine:"2026-10-15", faseTurno:"Giornata 8" },
    { inizio:"2026-10-22", fine:"2026-10-28", faseTurno:"Giornata 9" },
    { inizio:"2026-10-29", fine:"2026-11-04", faseTurno:"Giornata 10" },
    { inizio:"2026-11-05", fine:"2026-11-12", faseTurno:"Giornata 11" },
    { inizio:"2026-11-26", fine:"2026-12-02", faseTurno:"Giornata 12" },
    { inizio:"2026-12-03", fine:"2026-12-09", faseTurno:"Giornata 13" },
    { inizio:"2026-12-10", fine:"2026-12-16", faseTurno:"Giornata 14" },
    { inizio:"2026-12-17", fine:"2026-12-23", faseTurno:"Giornata 15" },
    { inizio:"2026-12-24", fine:"2026-12-31", faseTurno:"Giornata 16" },
    { inizio:"2027-01-07", fine:"2027-01-13", faseTurno:"Giornata 17" },
    { inizio:"2027-01-14", fine:"2027-01-20", faseTurno:"Giornata 18" },
    { inizio:"2027-01-21", fine:"2027-01-27", faseTurno:"Giornata 19" },
    { inizio:"2027-01-28", fine:"2027-02-03", faseTurno:"Giornata 20" },
    { inizio:"2027-02-04", fine:"2027-02-10", faseTurno:"Giornata 21" },
    { inizio:"2027-02-11", fine:"2027-02-17", faseTurno:"Giornata 22" },
    { inizio:"2027-02-18", fine:"2027-02-24", faseTurno:"Giornata 23" },
    { inizio:"2027-02-25", fine:"2027-03-03", faseTurno:"Giornata 24" },
    { inizio:"2027-03-04", fine:"2027-03-10", faseTurno:"Giornata 25" },
    { inizio:"2027-03-11", fine:"2027-03-17", faseTurno:"Giornata 26" },
    { inizio:"2027-03-18", fine:"2027-03-25", faseTurno:"Giornata 27" },
    { inizio:"2027-04-01", fine:"2027-04-08", faseTurno:"Giornata 28" },
    { inizio:"2027-04-09", fine:"2027-04-15", faseTurno:"Giornata 29" },
    { inizio:"2027-04-16", fine:"2027-04-21", faseTurno:"Giornata 30" },
    { inizio:"2027-04-22", fine:"2027-04-28", faseTurno:"Giornata 31" },
    { inizio:"2027-04-29", fine:"2027-05-05", faseTurno:"Giornata 32" },
    { inizio:"2027-05-06", fine:"2027-05-12", faseTurno:"Giornata 33" },
    { inizio:"2027-05-13", fine:"2027-05-18", faseTurno:"Giornata 34" }

  ],


  /* =========================
     EREDIVISIE
  ========================= */

  "ned.1": [

    { inizio:"2026-08-06", fine:"2026-08-12", faseTurno:"Giornata 1" },
    { inizio:"2026-08-13", fine:"2026-08-19", faseTurno:"Giornata 2" },
    { inizio:"2026-08-20", fine:"2026-08-26", faseTurno:"Giornata 3" },
    { inizio:"2026-08-27", fine:"2026-09-02", faseTurno:"Giornata 4" },
    { inizio:"2026-09-03", fine:"2026-09-09", faseTurno:"Giornata 5" },
    { inizio:"2026-09-10", fine:"2026-09-16", faseTurno:"Giornata 6" },
    { inizio:"2026-09-17", fine:"2026-09-25", faseTurno:"Giornata 7" },
    { inizio:"2026-10-08", fine:"2026-10-14", faseTurno:"Giornata 8" },
    { inizio:"2026-10-15", fine:"2026-10-21", faseTurno:"Giornata 9" },
    { inizio:"2026-10-22", fine:"2026-10-28", faseTurno:"Giornata 10" },
    { inizio:"2026-10-29", fine:"2026-11-04", faseTurno:"Giornata 11" },
    { inizio:"2026-11-05", fine:"2026-11-12", faseTurno:"Giornata 12" },
    { inizio:"2026-11-19", fine:"2026-11-25", faseTurno:"Giornata 13" },
    { inizio:"2026-11-26", fine:"2026-12-02", faseTurno:"Giornata 14" },
    { inizio:"2026-12-03", fine:"2026-12-09", faseTurno:"Giornata 15" },
    { inizio:"2026-12-10", fine:"2026-12-16", faseTurno:"Giornata 16" },
    { inizio:"2026-12-17", fine:"2026-12-25", faseTurno:"Giornata 17" },
    { inizio:"2027-01-07", fine:"2027-01-13", faseTurno:"Giornata 18" },
    { inizio:"2027-01-14", fine:"2027-01-20", faseTurno:"Giornata 19" },
    { inizio:"2027-01-21", fine:"2027-01-27", faseTurno:"Giornata 20" },
    { inizio:"2027-01-28", fine:"2027-02-04", faseTurno:"Giornata 21" },
    { inizio:"2027-02-11", fine:"2027-02-17", faseTurno:"Giornata 22" },
    { inizio:"2027-02-18", fine:"2027-02-24", faseTurno:"Giornata 23" },
    { inizio:"2027-02-25", fine:"2027-03-03", faseTurno:"Giornata 24" },
    { inizio:"2027-03-04", fine:"2027-03-10", faseTurno:"Giornata 25" },
    { inizio:"2027-03-11", fine:"2027-03-17", faseTurno:"Giornata 26" },
    { inizio:"2027-03-18", fine:"2027-03-25", faseTurno:"Giornata 27" },
    { inizio:"2027-04-01", fine:"2027-04-07", faseTurno:"Giornata 28" },
    { inizio:"2027-04-08", fine:"2027-04-15", faseTurno:"Giornata 29" },
    { inizio:"2027-04-22", fine:"2027-04-28", faseTurno:"Giornata 30" },
    { inizio:"2027-04-29", fine:"2027-05-05", faseTurno:"Giornata 31" },
    { inizio:"2027-05-06", fine:"2027-05-12", faseTurno:"Giornata 32" },
    { inizio:"2027-05-13", fine:"2027-05-19", faseTurno:"Giornata 33" },
    { inizio:"2027-05-20", fine:"2027-05-25", faseTurno:"Giornata 34" }

  ],


  /* =========================
     SAUDI PRO LEAGUE
  ========================= */

  "ksa.1": [

    { inizio:"2026-08-13", fine:"2026-08-19", faseTurno:"Giornata 1" },
    { inizio:"2026-08-20", fine:"2026-08-26", faseTurno:"Giornata 2" },
    { inizio:"2026-08-27", fine:"2026-09-02", faseTurno:"Giornata 3" },
    { inizio:"2026-09-03", fine:"2026-09-09", faseTurno:"Giornata 4" },
    { inizio:"2026-09-10", fine:"2026-09-16", faseTurno:"Giornata 5" },
    { inizio:"2026-09-17", fine:"2026-09-23", faseTurno:"Giornata 6" },
    { inizio:"2026-09-24", fine:"2026-10-01", faseTurno:"Giornata 7" },
    { inizio:"2026-10-09", fine:"2026-10-13", faseTurno:"Giornata 8" },
    { inizio:"2026-10-15", fine:"2026-10-17", faseTurno:"Giornata 9" },
    { inizio:"2026-10-18", fine:"2026-10-22", faseTurno:"Giornata 10" },
    { inizio:"2026-10-23", fine:"2026-10-28", faseTurno:"Giornata 11" },
    { inizio:"2026-10-29", fine:"2026-11-04", faseTurno:"Giornata 12" },
    { inizio:"2026-11-05", fine:"2026-11-12", faseTurno:"Giornata 13" },
    { inizio:"2026-11-19", fine:"2026-11-25", faseTurno:"Giornata 14" },
    { inizio:"2026-11-26", fine:"2026-12-02", faseTurno:"Giornata 15" },
    { inizio:"2026-12-03", fine:"2026-12-09", faseTurno:"Giornata 16" },
    { inizio:"2026-12-10", fine:"2026-12-16", faseTurno:"Giornata 17" },
    { inizio:"2026-12-17", fine:"2026-12-23", faseTurno:"Giornata 18" },
    { inizio:"2026-12-24", fine:"2026-12-31", faseTurno:"Giornata 19" },
    { inizio:"2027-02-04", fine:"2027-02-10", faseTurno:"Giornata 20" },
    { inizio:"2027-02-11", fine:"2027-02-17", faseTurno:"Giornata 21" },
    { inizio:"2027-02-18", fine:"2027-02-24", faseTurno:"Giornata 22" },
    { inizio:"2027-02-25", fine:"2027-03-03", faseTurno:"Giornata 23" },
    { inizio:"2027-03-04", fine:"2027-03-10", faseTurno:"Giornata 24" },
    { inizio:"2027-03-11", fine:"2027-03-17", faseTurno:"Giornata 25" },
    { inizio:"2027-03-18", fine:"2027-03-25", faseTurno:"Giornata 26" },
    { inizio:"2027-04-01", fine:"2027-04-07", faseTurno:"Giornata 27" },
    { inizio:"2027-04-08", fine:"2027-04-14", faseTurno:"Giornata 28" },
    { inizio:"2027-04-15", fine:"2027-04-21", faseTurno:"Giornata 29" },
    { inizio:"2027-04-22", fine:"2027-04-28", faseTurno:"Giornata 30" },
    { inizio:"2027-04-29", fine:"2027-05-05", faseTurno:"Giornata 31" },
    { inizio:"2027-05-06", fine:"2027-05-12", faseTurno:"Giornata 32" },
    { inizio:"2027-05-13", fine:"2027-05-20", faseTurno:"Giornata 33" },
    { inizio:"2027-05-25", fine:"2027-05-30", faseTurno:"Giornata 34" }

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
   CERCA GIORNATA NELLE TUE FINESTRE

   QUESTA FUNZIONE HA PRIORITÀ ASSOLUTA.

   Se una partita rientra in una tua finestra,
   NON viene utilizzata la giornata ESPN.
============================================================ */

function trovaFinestraGiornata(
  competizione,
  dataPartita
) {

  const finestre =
    FINESTRE_GIORNATE[
      competizione
    ];

  if (
    !Array.isArray(finestre) ||
    !dataPartita
  ) {
    return null;
  }

  const data =
    dataISOItalia(dataPartita);

  if (!data) {
    return null;
  }

  /*
  Nel caso improbabile di finestre sovrapposte,
  controlliamo tutte le finestre e scegliamo
  quella con l'intervallo più corto.
  Questo evita che una finestra molto ampia
  copra una finestra specifica.
  */

  const corrispondenti =
    finestre.filter(function (finestra) {

      return (
        data >= finestra.inizio &&
        data <= finestra.fine
      );

    });

  if (corrispondenti.length === 0) {
    return null;
  }

corrispondenti.sort(function (a, b) {

  const start =
    String(b.inizio).localeCompare(
      String(a.inizio)
    );

  if (start !== 0) {
    return start;
  }

  return String(a.fine).localeCompare(
    String(b.fine)
  );

});

  return corrispondenti[0].faseTurno;
}


/* ============================================================
   FALLBACK ESPN

   UTILIZZATO SOLO SE NON ESISTE UNA FINESTRA.
============================================================ */

function estraiGiornataDaNote(
  competition,
  data
) {

  const liste = [

    competition?.notes,

    data?.header?.competitions?.[0]?.notes

  ];

  for (const lista of liste) {

    if (!Array.isArray(lista)) {
      continue;
    }

    for (const nota of lista) {

      const testo =
        nota?.headline ||
        nota?.text ||
        null;

      if (!testo) {
        continue;
      }

      const match =
        String(testo).match(
          /(matchday|giornata|round|week)\s*(\d+)/i
        );

      if (match) {

        return (
          "Giornata " +
          match[2]
        );

      }

    }

  }

  return null;

}


function getFaseTurnoESPN(
  data,
  competition
) {

  /*
  PRIORITÀ:
  proviamo prima a leggere la giornata
  dalle "notes" ESPN (es. "Matchday 5"),
  che è la fonte più affidabile quando
  presente.
  */

  const daNote =
    estraiGiornataDaNote(
      competition,
      data
    );

  if (daNote) {
    return daNote;
  }

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
      String(valore).trim();

    if (!testo) {
      return;
    }

    if (!valori.includes(testo)) {
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
    ].forEach(function (campo) {

      const valore =
        obj[campo];

      if (
        valore &&
        typeof valore === "object"
      ) {

        aggiungi(valore.displayName);
        aggiungi(valore.name);
        aggiungi(valore.label);
        aggiungi(valore.description);
        aggiungi(valore.shortName);
        aggiungi(valore.text);

      }

    });


    const week =
      obj.week;

    if (
      week &&
      typeof week === "object"
    ) {

      aggiungi(week.text);
      aggiungi(week.displayName);
      aggiungi(week.label);
      aggiungi(week.name);
      aggiungi(week.description);
      aggiungi(week.shortName);

    }


    Object.keys(obj)
      .forEach(function (chiave) {

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

      });

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
    competition?.week?.number ??
    data?.header?.competitions?.[0]?.week?.number ??
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

      /*
      Se ESPN restituisce già
      "Giornata 5", lo manteniamo.
      */

      if (
        /^giornata\s+\d+$/i.test(
          String(valore).trim()
        )
      ) {

        return String(valore).trim();

      }

      /*
      Se restituisce solamente un numero,
      trasformiamolo in Giornata X.
      */

      if (
        /^\d+$/.test(
          String(valore).trim()
        )
      ) {

        return (
          "Giornata " +
          String(valore).trim()
        );

      }

      return valore;

    }

  }


  if (
    numeroGiornata !== null &&
    numeroGiornata !== undefined &&
    String(numeroGiornata).trim() !== ""
  ) {

    return (
      "Giornata " +
      numeroGiornata
    );

  }


  return "";

}


/* ============================================================
   FASE / TURNO DEFINITIVO

   ORDINE:

   1. DATA + TUE FINESTRE
   2. ESPN
   3. ""

============================================================ */

function getFaseTurno(
  data,
  competition,
  competizione
) {

const dataPartita =
  competition?.date ||
  competition?.startDate ||
  data?.header?.competitions?.[0]?.date ||
  data?.header?.date ||
  null;


  /*
  PRIORITÀ 1:
  finestre personalizzate
  */

const finestra =
  trovaFinestraGiornata(
    competizione,
    dataPartita
  );

/*
IMPORTANTE:
trovaFinestraGiornata restituisce già
la stringa del faseTurno (es. "Giornata 5"),
NON un oggetto. Controlliamo quindi
direttamente la stringa.
*/

if (finestra) {

  return {

    valore:
      finestra,

    fonte:
      "FINESTRE_GIORNATE"

  };

}


  /*
  PRIORITÀ 2:
  ESPN
  */

  const espn =
    getFaseTurnoESPN(
      data,
      competition
    );


  if (espn) {

    return {

      valore:
        espn,

      fonte:
        "ESPN"

    };

  }


  /*
  Nessuna informazione.
  */

  return {

    valore: "",

    fonte: "NESSUNA"

  };

}


/* ============================================================
   STATISTICHE
============================================================ */

function normalizzaNomeStatistica(nome) {

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
        stat?.displayValue ??
        stat?.value ??
        null
      );

    }

  }

  return null;

}


/* ============================================================
   STATISTICHE COMPLETE
============================================================ */

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
      lista.map(function (x) {

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

      });


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
   FORMAZIONI
============================================================ */

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
    "AM-L": "Centrocampista",
    "AM-R": "Centrocampista",

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
    F: "Attaccante",

    SUB: "Riserva"

  };


  return (
    mappa[r] ||
    ruolo
  );

}


/* ============================================================
   ALLENATORE

   ESPN restituisce spesso "coach"/"coaches" come ARRAY
   di oggetti (es. [{ firstName, lastName, displayName }]),
   non come oggetto singolo. Il vecchio codice leggeva
   direttamente r.coach.displayName, che su un array
   risultava sempre undefined.
============================================================ */

function estraiAllenatore(r, data, idSquadra) {

  const candidati = [

    r?.coach,
    r?.coaches,
    r?.team?.coach,
    r?.team?.coaches

  ];

  for (const candidato of candidati) {

    if (!candidato) {
      continue;
    }

    const lista =
      Array.isArray(candidato)
        ? candidato
        : [candidato];

    for (const elemento of lista) {

      if (!elemento) {
        continue;
      }

      const nome =
        elemento?.displayName ||
        elemento?.fullName ||
        elemento?.name ||
        elemento?.athlete?.displayName ||
        elemento?.athlete?.fullName ||
        (
          elemento?.firstName &&
          elemento?.lastName
            ? elemento.firstName +
              " " +
              elemento.lastName
            : null
        );

      if (nome) {
        return nome;
      }

    }

  }

  /*
  FALLBACK:
  ESPN può mettere il coach dentro boxscore.teams
  */

  const teams =
    data?.boxscore?.teams ||
    [];

  if (Array.isArray(teams)) {

    for (const squadra of teams) {

      if (
        idSquadra &&
        squadra?.team?.id &&
        String(squadra.team.id) !== String(idSquadra)
      ) {
        continue;
      }

      const candidatiBoxscore = [
        squadra?.coach,
        squadra?.coaches
      ];

      for (
        const candidato of candidatiBoxscore
      ) {

        if (!candidato) {
          continue;
        }

        const lista =
          Array.isArray(candidato)
            ? candidato
            : [candidato];

        for (
          const elemento of lista
        ) {

          const nome =
            elemento?.displayName ||
            elemento?.fullName ||
            elemento?.name ||
            elemento?.athlete?.displayName ||
            elemento?.athlete?.fullName ||
            (
              elemento?.firstName &&
              elemento?.lastName
                ? elemento.firstName +
                  " " +
                  elemento.lastName
                : null
            );

          if (nome) {
            return nome;
          }

        }

      }

    }

  }

  return null;

}


/* ============================================================
   FORMAZIONI
============================================================ */

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
  estraiAllenatore(
    r,
    data,
    r?.team?.id
  ),

      titolari: [],

      riserve: []

    };


    const giocatori =
      r?.roster ||
      r?.athletes ||
      [];


    if (
      !Array.isArray(giocatori)
    ) {
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


      /*
      IMPORTANTE:
      nelle formazioni viene restituito
      ESCLUSIVAMENTE IL COGNOME.
      */

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

        cognome,

        numero,

        ruolo:
          ruoloItaliano(
            ruoloOriginale
          ),

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


/* ============================================================
   RIGORI
============================================================ */

function creaRigori(data, competition) {

  /*
   * ============================================================
   * RIGORI / CALCI DI RIGORE
   *
   * La partita viene considerata terminata ai rigori SOLO quando
   * ESPN fornisce un'indicazione esplicita dello shootout.
   *
   * NON usiamo:
   *   - "penalties"
   *   - "pens"
   *
   * da soli, perché possono comparire anche in altri contesti.
   * ============================================================
   */

  const risultatoVuoto = {
    partitaTerminataAiRigori: false,
    casa: null,
    trasferta: null
  };


  if (!data) {
    return risultatoVuoto;
  }


  // ============================================================
  // FUNZIONI INTERNE
  // ============================================================

  function testoCompleto(obj) {

    if (!obj) {
      return "";
    }

    const parti = [

      obj?.status?.type?.text,
      obj?.status?.type?.description,
      obj?.status?.type?.name,
      obj?.status?.type?.id,

      obj?.status?.text,
      obj?.status?.description,

      obj?.header?.competitions?.[0]?.status?.type?.text,
      obj?.header?.competitions?.[0]?.status?.type?.description,

      obj?.header?.competitions?.[0]?.status?.type?.name,

      obj?.header?.competitions?.[0]?.notes,

      obj?.header?.notes,

      obj?.notes,

      obj?.description,
      obj?.text

    ];

    return parti
      .filter(function (x) {
        return x !== null &&
               x !== undefined &&
               String(x).trim() !== "";
      })
      .map(function (x) {
        return String(x);
      })
      .join(" ")
      .toLowerCase();
  }


  function trovaTestoRicorsivo(obj, profondita) {

    if (!obj || profondita > 5) {
      return "";
    }

    if (
      typeof obj === "string" ||
      typeof obj === "number"
    ) {
      return String(obj);
    }

    if (Array.isArray(obj)) {

      return obj
        .map(function (elemento) {
          return trovaTestoRicorsivo(
            elemento,
            profondita + 1
          );
        })
        .filter(Boolean)
        .join(" ");

    }

    if (typeof obj === "object") {

      const chiaviInteressanti = [

        "text",
        "description",
        "name",
        "shortText",
        "detail",
        "shortDetail",
        "type",
        "notes",
        "note"

      ];

      const parti = [];

      for (const chiave of chiaviInteressanti) {

        if (
          obj[chiave] !== undefined &&
          obj[chiave] !== null
        ) {

          parti.push(
            trovaTestoRicorsivo(
              obj[chiave],
              profondita + 1
            )
          );

        }

      }

      return parti
        .filter(Boolean)
        .join(" ");

    }

    return "";

  }


  function numeroValido(valore) {

    if (
      valore === null ||
      valore === undefined ||
      valore === ""
    ) {
      return null;
    }

    const numero =
      Number(valore);

    if (!Number.isFinite(numero)) {
      return null;
    }

    return numero;
  }


  // ============================================================
  // 1. CERCA INDICAZIONI ESPLICITE DI SHOOTOUT
  // ============================================================

  const testiDaControllare = [

    testoCompleto(data),

    trovaTestoRicorsivo(
      data?.header,
      0
    ),

    trovaTestoRicorsivo(
      data?.header?.competitions,
      0
    ),

    trovaTestoRicorsivo(
      data?.competitions,
      0
    ),

    trovaTestoRicorsivo(
      data?.plays,
      0
    ),

    trovaTestoRicorsivo(
      data?.situation,
      0
    )

  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();


  /*
   * SOLO queste espressioni possono confermare
   * che si tratta di uno shootout.
   */

  const shootoutEsplicito =
    /penalty\s*shoot-?out/i.test(
      testiDaControllare
    ) ||
    /shoot-?out/i.test(
      testiDaControllare
    ) ||
    /series\s+of\s+penalties/i.test(
      testiDaControllare
    ) ||
    /penalty\s+shootout/i.test(
      testiDaControllare
    ) ||
    /calci\s+di\s+rigore/i.test(
      testiDaControllare
    ) ||
    /serie\s+di\s+rigori/i.test(
      testiDaControllare
    );


  // ============================================================
  // 2. CERCA I RISULTATI DELLO SHOOTOUT
  // ============================================================

  let casa = null;
  let trasferta = null;


  /*
   * ESPN può usare diversi campi.
   * Li controlliamo senza considerarli da soli come prova
   * che la partita sia terminata ai rigori.
   */

  const competizione =
    data?.header?.competitions?.[0] ||
    data?.competitions?.[0] ||
    competition ||
    null;


  const competitors =
    competizione?.competitors ||
    data?.header?.competitions?.[0]?.competitors ||
    data?.competitors ||
    [];


  if (Array.isArray(competitors)) {

    for (const squadra of competitors) {

      const homeAway =
        String(
          squadra?.homeAway ||
          ""
        ).toLowerCase();

      const shootoutScore =
        numeroValido(
          squadra?.shootoutScore
        );

      const penaltyScore =
        numeroValido(
          squadra?.penaltyScore
        );

      const penalties =
        numeroValido(
          squadra?.penalties
        );

      const rigori =
        shootoutScore !== null
          ? shootoutScore
          : (
              penaltyScore !== null
                ? penaltyScore
                : penalties
            );


      if (rigori === null) {
        continue;
      }


      if (homeAway === "home") {

        casa = rigori;

      } else if (
        homeAway === "away"
      ) {

        trasferta = rigori;

      }

    }

  }


  // ============================================================
  // 3. CERCA EVENTUALI SHOOTOUT NEI PLAY
  // ============================================================

  if (
    casa === null ||
    trasferta === null
  ) {

    const plays =
      Array.isArray(data?.plays)
        ? data.plays
        : [];


    for (const play of plays) {

      const testoPlay =
        trovaTestoRicorsivo(
          play,
          0
        ).toLowerCase();


      if (
        !/shoot-?out|penalty\s*shoot|serie\s+di\s+rigori|calci\s+di\s+rigore/i.test(
          testoPlay
        )
      ) {
        continue;
      }


      const valore =
        numeroValido(
          play?.scoreValue
        );


      const team =
        play?.team?.homeAway ||
        play?.team?.homeAwayType ||
        "";


      if (
        valore !== null &&
        String(team).toLowerCase() === "home"
      ) {

        casa = valore;

      }

      if (
        valore !== null &&
        String(team).toLowerCase() === "away"
      ) {

        trasferta = valore;

      }

    }

  }


  // ============================================================
  // 4. CONTROLLO FINALE
  // ============================================================

  /*
   * Se ESPN dichiara esplicitamente lo shootout,
   * lo consideriamo valido.
   *
   * Se invece abbiamo due punteggi di shootout validi
   * e differenti, lo consideriamo valido anche se il testo
   * non contiene chiaramente "shootout".
   */

  const punteggiShootoutValidi =
    casa !== null &&
    trasferta !== null &&
    casa >= 0 &&
    trasferta >= 0 &&
    casa !== trasferta;


  const partitaTerminataAiRigori =
    shootoutEsplicito ||
    punteggiShootoutValidi;


  // ============================================================
  // 5. PARTITA NON AI RIGORI
  // ============================================================

  if (!partitaTerminataAiRigori) {

    return risultatoVuoto;

  }


  // ============================================================
  // 6. PARTITA AI RIGORI
  // ============================================================

  return {

    partitaTerminataAiRigori: true,

    casa:
      casa !== null
        ? casa
        : null,

    trasferta:
      trasferta !== null
        ? trasferta
        : null

  };

}

/* ============================================================
   MVP
============================================================ */

function trovaMVP(data) {

  const candidates = [

    data?.gameInfo?.mvp,

    data?.header?.competitions?.[0]?.mvp,

    data?.leaders?.mvp,

    data?.leaders?.MVP,

    data?.boxscore?.mvp,

    data?.boxscore?.gameInfo?.mvp

  ];

  function estraiMVP(valore) {

    if (!valore) {
      return null;
    }

    if (typeof valore === "string") {
      return ultimoCognome(valore);
    }

    if (
      valore?.displayName
    ) {
      return ultimoCognome(
        valore.displayName
      );
    }

    if (
      valore?.fullName
    ) {
      return ultimoCognome(
        valore.fullName
      );
    }

    if (
      valore?.athlete?.displayName
    ) {
      return ultimoCognome(
        valore.athlete.displayName
      );
    }

    if (
      valore?.player?.displayName
    ) {
      return ultimoCognome(
        valore.player.displayName
      );
    }

    if (Array.isArray(valore)) {

      for (
        const elemento of valore
      ) {

        const nome =
          elemento?.athlete?.displayName ||
          elemento?.athlete?.fullName ||
          elemento?.player?.displayName ||
          elemento?.player?.fullName ||
          elemento?.displayName ||
          elemento?.fullName ||
          null;

        if (nome) {

          return ultimoCognome(
            nome
          );

        }

      }

    }

    return null;
  }

  for (
    const valore of candidates
  ) {

    const mvp =
      estraiMVP(valore);

    if (mvp) {
      return mvp;
    }

  }

  return null;
}


/* ============================================================
   CRONACA

   MOSTRA SOLO GLI EVENTI RILEVANTI:
   gol, autogol, rigori, cartellini,
   sostituzioni, inizio/fine partita,
   inizio/fine tempi, interruzioni
   (es. infortuni) e tempo di recupero.
============================================================ */

function testoItalianoEvento(evento) {

  const tipo = evento?.tipo || "";
  const giocatore = evento?.giocatore || null;
  const assist = evento?.assist || null;
  const squadra = evento?.squadra || null;

  const suffissoSquadra =
    squadra ? ` (${squadra})` : "";

  switch (tipo) {

    case "Gol":

      return (
        giocatore
          ? `Gol di ${giocatore}${suffissoSquadra}`
          : `Gol${suffissoSquadra}`
      ) + (
        assist
          ? ` - assist di ${assist}`
          : ""
      );

    case "Autogol":

      return giocatore
        ? `Autogol di ${giocatore}${suffissoSquadra}`
        : `Autogol${suffissoSquadra}`;

    case "Rigore":

      return giocatore
        ? `Calcio di rigore per ${giocatore}${suffissoSquadra}`
        : `Calcio di rigore${suffissoSquadra}`;

    case "Ammonizione":

      return giocatore
        ? `Cartellino giallo per ${giocatore}${suffissoSquadra}`
        : `Cartellino giallo${suffissoSquadra}`;

    case "Espulsione":

      return giocatore
        ? `Cartellino rosso per ${giocatore}${suffissoSquadra}`
        : `Cartellino rosso${suffissoSquadra}`;

    case "Sostituzione":

      return (
        squadra
          ? `Sostituzione (${squadra})`
          : "Sostituzione"
      ) + (
        giocatore
          ? `: ${giocatore}`
          : ""
      ) + (
        assist
          ? ` / ${assist}`
          : ""
      );

    case "Inizio partita":

      return "Inizia la partita.";

    case "Fine partita":

      return "Termina la partita.";

    case "Intervallo":

      return "Intervallo.";

    case "Fine primo tempo":

      return "Fine primo tempo.";

    case "Inizio secondo tempo":

      return "Inizia il secondo tempo.";

    case "Tempi supplementari":

      return "Iniziano i tempi supplementari.";

    case "Fine tempi supplementari":

      return "Fine dei tempi supplementari.";

    case "Serie di rigori":

      return "Si va ai calci di rigore.";

    case "Interruzione":

      return "Gioco interrotto.";

    case "Ripresa":

      return "Gioco ripreso.";

    case "Tempo di recupero":

      return "Tempo di recupero.";

    case "Partita posticipata":

      return "Partita posticipata.";

    case "Partita annullata":

      return "Partita annullata.";

    default:

      return tipo || "";

  }

}


const TIPI_EVENTO_CRONACA = [

  // GOL
  "Gol",
  "Autogol",

  // RIGORI
  "Rigore",
  "Rigore parato",
  "Rigore sbagliato",
  "Serie di rigori",

  // CARTELLINI
  "Ammonizione",
  "Seconda ammonizione",
  "Espulsione",

  // SOSTITUZIONI
  "Sostituzione",

  // INIZIO / FINE
  "Inizio partita",
  "Fine partita",
  "Intervallo",
  "Fine primo tempo",
  "Inizio secondo tempo",

  // TEMPI SUPPLEMENTARI
  "Tempi supplementari",
  "Inizio tempi supplementari",
  "Intervallo tempi supplementari",
  "Fine tempi supplementari",

  // INTERRUZIONI
  "Interruzione",
  "Ripresa",
  "Gioco interrotto",
  "Gioco ripreso",

  // PARTITA
  "Tempo di recupero",
  "Partita posticipata",
  "Partita annullata",

  // AZIONI DI GIOCO
  "Fallo",
  "Fallo di mano",
  "Fuorigioco",
  "Calcio d'angolo",
  "Punizione",
  "Rimessa laterale",
  "Rinvio dal fondo",
  "Calcio d'inizio",

  // TIRO
  "Tiro",
  "Tiro in porta",
  "Tiro fuori",
  "Tiro bloccato",
  "Palo",
  "Traversa",
  "Parata",

  // VAR
  "VAR",

  // INFORTUNI
  "Infortunio",

  // ALTRO
  "Assist"

];


function creaCronaca(
  plays
) {

  if (!Array.isArray(plays)) {
    return [];
  }

  const eventiGrezzi =
    plays

      .map(function (p) {

        const tipo =
          traduciEvento(
            tipoEvento(p)
          );

        const evento = {

          minuto:
            minutoEvento(p),

          tipo:
            tipo,

          giocatore:
            nomeGiocatore(p),

          assist:
            assistGiocatore(p),

          squadra:
            squadraEvento(p)

        };

        /*
        Il testo viene generato in italiano
        a partire dai campi strutturati,
        NON copiato dal testo originale ESPN
        (che è in inglese).
        */

        evento.testo =
          testoItalianoEvento(
            evento
          );

        return evento;

      })

      .filter(function (evento) {

        return TIPI_EVENTO_CRONACA.includes(
          evento.tipo
        );

      });


  /* ==========================================================
     RIMOZIONE DUPLICATI CONSECUTIVI

     ESPN a volte restituisce lo stesso evento tecnico
     più volte di seguito (stesso minuto, stesso tipo,
     stesso testo). Li rimuoviamo per non rendere la
     cronaca confusa.
  ========================================================== */

  const eventiPuliti = [];

  for (const evento of eventiGrezzi) {

    const precedente =
      eventiPuliti[eventiPuliti.length - 1];

    const eDuplicato =
      precedente &&
      precedente.minuto === evento.minuto &&
      precedente.tipo === evento.tipo &&
      precedente.testo === evento.testo;

    if (!eDuplicato) {

      eventiPuliti.push(evento);

    }

  }

  return eventiPuliti;

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


    if (
      !COMPETIZIONI[competizione]
    ) {

      return res.status(400).json({

        success: false,

        errore:
          "Competizione non supportata",

        competizione

      });

    }


    const datiCompetizione =
      COMPETIZIONI[
        competizione
      ];


    /* ========================================================
       ESPN SUMMARY
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
      Array.isArray(
        data?.plays
      )
        ? data.plays
        : Array.isArray(
            data?.keyEvents
          )
            ? data.keyEvents
            : [];


    /* ========================================================
       DATA / ORA
    ======================================================== */

    const dataOra =
      convertiDataOraItaliana(
        competition?.date ||
        data?.header?.date ||
        null
      );


    /* ========================================================
       FASE/TURNO

       PRIMA LE FINESTRE
       POI ESPN
    ======================================================== */

    const faseTurno =
      getFaseTurno(
        data,
        competition,
        competizione
      );


    /* ========================================================
       STATO
    ======================================================== */

    const stato =
      traduciStato(
        competition?.status?.type
      );


    /* ========================================================
       SQUADRE
    ======================================================== */

    const homeTeam =
      datiSquadra(home);


    const awayTeam =
      datiSquadra(away);


    /* ========================================================
       GOL "-" SE LA PARTITA È ANCORA IN PROGRAMMA

       Se la partita non è ancora iniziata,
       non mostriamo 0 ma "-".
    ======================================================== */

    if (stato === "In programma") {

      homeTeam.gol = "-";

      awayTeam.gol = "-";

    }


    /* ========================================================
       STATISTICHE
    ======================================================== */

    const statistiche =
      creaStatistiche(data);


    /* ========================================================
       FORMAZIONI
    ======================================================== */

    const formazioni =
      creaFormazioni(
        data,
        home,
        away
      );


    /* ========================================================
       ARBITRI
    ======================================================== */

    const arbitri =
      creaArbitri(
        data,
        competition
      );


    /* ========================================================
       STADIO
    ======================================================== */

    const venue =
      data?.gameInfo?.venue ||
      competition?.venue ||
      null;


    /* ========================================================
       RIGORI
    ======================================================== */

    const rigori =
      creaRigori(
        data,
        competition,
        home,
        away
      );


    /* ========================================================
       MVP
    ======================================================== */

    const mvp =
      trovaMVP(data);


    /* ========================================================
       RISPOSTA
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


        /*
        IMPORTANTE:
        faseTurno.valore viene dalla finestra
        quando disponibile.
        */

        faseTurno:
          faseTurno.valore,

        faseTurnoFonte:
          faseTurno.fonte,


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
            homeTeam?.nome ||
            ""
          ) +
          " - " +
          (
            awayTeam?.nome ||
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

         Nell'arbitro viene mostrato solo
         nome e cognome dell'arbitro principale.
      ====================================================== */

      info: {

        arbitro:
          arbitri.arbitro,

        stadio:
          venue?.fullName ||
          venue?.displayName ||
          null,

        citta:
          venue?.address?.city ||
          null,

        paese:
          venue?.address?.country ||
          null,

        MVP:
          mvp

      },


      /* ======================================================
         MARCATORI
      ====================================================== */

      marcatori:
        creaMarcatori(plays),


      /* ======================================================
         CARTELLINI
      ====================================================== */

      cartellini:
        creaCartellini(plays),


      /* ======================================================
         SOSTITUZIONI
      ====================================================== */

      sostituzioni:
        creaSostituzioni(plays),


      /* ======================================================
         RIGORI
      ====================================================== */

      rigori:
        rigori,


      /* ======================================================
         STATISTICHE COMPLETE
      ====================================================== */

      statistiche:
        statistiche,


      statistichePartita: {

        possessoCasa:
          statistiche.valori.possessoCasa,

        possessoTrasferta:
          statistiche.valori.possessoTrasferta,

        tiriCasa:
          statistiche.valori.tiriCasa,

        tiriTrasferta:
          statistiche.valori.tiriTrasferta,

        tiriInPortaCasa:
          statistiche.valori.tiriInPortaCasa,

        tiriInPortaTrasferta:
          statistiche.valori.tiriInPortaTrasferta,

        calciDangoloCasa:
          statistiche.valori.calciDangoloCasa,

        calciDangoloTrasferta:
          statistiche.valori.calciDangoloTrasferta,

        passaggiCasa:
          statistiche.valori.passaggiCasa,

        passaggiTrasferta:
          statistiche.valori.passaggiTrasferta,

        fuorigiocoCasa:
          statistiche.valori.fuorigiocoCasa,

        fuorigiocoTrasferta:
          statistiche.valori.fuorigiocoTrasferta

      },


      /* ======================================================
         FORMAZIONI
      ====================================================== */

      formazioni:
        formazioni,


      /* ======================================================
         CRONACA (SOLO EVENTI RILEVANTI)
      ====================================================== */

      cronaca:
        creaCronaca(plays),


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
                squadraEvento(p),

              testo:
                p?.text ||
                p?.description ||
                null

            };

          }
        )

    });


  }

  catch (errore) {

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
