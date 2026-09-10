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

  const squadra =
    play.team ||
    play.teamId ||
    play.competitor ||
    play.competitorId ||
    null;

  if (typeof squadra === "object") {

    return normalizzaNomeSquadra(
      squadra.displayName ||
      squadra.name ||
      squadra.team?.displayName ||
      squadra.team?.name
    );

  }

  return squadra;
}


/* ============================================================
   EVENTI
============================================================ */

function creaEventi(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays.map((p) => {

    let tipo = "altro";

    if (p?.scoringPlay) {
      tipo = "gol";
    }

    if (
      p?.type?.text &&
      /substitution|sostituzione/i.test(p.type.text)
    ) {
      tipo = "sostituzione";
    }

    if (
      p?.type?.text &&
      /yellow card|ammonizione/i.test(p.type.text)
    ) {
      tipo = "ammonizione";
    }

    if (
      p?.type?.text &&
      /red card|espulsione/i.test(p.type.text)
    ) {
      tipo = "espulsione";
    }

    return {

      minuto: minutoEvento(p),

      tipo,

      giocatore: nomeGiocatore(p),

      assist: assistGiocatore(p),

      squadra: squadraEvento(p),

      autorete:
        !!p?.ownGoal ||
        !!p?.isOwnGoal,

      testo:
        p?.text ||
        p?.description ||
        p?.type?.text ||
        null

    };

  });

}


/* ============================================================
   GOL
============================================================ */

function creaGol(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays
    .filter((p) =>
      p?.scoringPlay ||
      p?.type?.id === "1"
    )
    .map((p) => ({

      minuto: minutoEvento(p),

      giocatore: nomeGiocatore(p),

      squadra: squadraEvento(p),

      assist:
        assistGiocatore(p),

      autorete:
        !!p?.ownGoal ||
        !!p?.isOwnGoal

    }));

}


/* ============================================================
   CARTELLINI
============================================================ */

function creaCartellini(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays
    .filter((p) => {

      const testo = normalizzaTesto(
        p?.type?.text ||
        p?.text ||
        p?.description ||
        ""
      );

      return (
        testo.includes("yellow card") ||
        testo.includes("red card") ||
        testo.includes("ammonizione") ||
        testo.includes("espulsione")
      );

    })
    .map((p) => {

      const testo = normalizzaTesto(
        p?.type?.text ||
        p?.text ||
        p?.description ||
        ""
      );

      let tipo = "ammonizione";

      if (
        testo.includes("red card") ||
        testo.includes("espulsione")
      ) {
        tipo = "espulsione";
      }

      return {

        minuto: minutoEvento(p),

        tipo,

        giocatore: nomeGiocatore(p),

        squadra: squadraEvento(p)

      };

    });

}


/* ============================================================
   ESPULSIONI
============================================================ */

function creaEspulsioni(plays) {

  return creaCartellini(plays)
    .filter((c) => c.tipo === "espulsione");

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

    const testo = normalizzaTesto(
      p?.type?.text ||
      p?.text ||
      p?.description ||
      ""
    );

    const isSub =
      p?.type?.text &&
      /substitution|sostituzione/i.test(
        p.type.text
      );

    if (
      !isSub &&
      !testo.includes("substitution") &&
      !testo.includes("sostituzione")
    ) {
      continue;
    }

    const entrato =
      p?.athleteIn ||
      p?.substitution?.in ||
      p?.participants?.[0]?.athlete ||
      p?.participants?.[0]?.player ||
      p?.athletesInvolved?.[0];

    const uscito =
      p?.athleteOut ||
      p?.substitution?.out ||
      p?.participants?.[1]?.athlete ||
      p?.participants?.[1]?.player ||
      p?.athletesInvolved?.[1];

    risultati.push({

      minuto: minutoEvento(p),

      entra: cognomeAtleta(entrato),

      esce: cognomeAtleta(uscito),

      squadra: squadraEvento(p)

    });

  }

  return risultati;

}


/* ============================================================
   ALLENATORE
============================================================ */

function estraiAllenatore(team) {

  if (!team) {
    return null;
  }

  const coach =
    team.coach ||
    team.coaches?.[0] ||
    team.manager ||
    team.staff?.find(
      (s) =>
        /coach|manager|allenatore/i.test(
          s?.position?.name ||
          s?.position ||
          ""
        )
    );

  if (!coach) {
    return null;
  }

  return (
    coach.displayName ||
    coach.fullName ||
    coach.shortName ||
    coach.name ||
    null
  );

}


/* ============================================================
   FORMAZIONI
============================================================ */

function creaFormazioneTeam(team) {

  if (!team) {
    return null;
  }

  const formazione =
    team.formation ||
    team.formations?.[0] ||
    null;

  const modulo =
    formazione?.formation ||
    formazione?.displayName ||
    formazione?.name ||
    team.formation?.displayName ||
    null;

  const giocatori =
    team.roster ||
    team.lineup ||
    team.players ||
    [];

  const titolari = [];
  const riserve = [];

  if (Array.isArray(giocatori)) {

    for (const item of giocatori) {

      const athlete =
        item?.athlete ||
        item?.player ||
        item;

      const nome =
        nomeCompletoAtleta(athlete);

      const cognome =
        ultimoCognome(nome);

      if (!cognome) {
        continue;
      }

      const starter =
        item?.starter === true ||
        item?.isStarter === true ||
        item?.starter === "true";

      if (starter) {
        titolari.push(cognome);
      } else {
        riserve.push(cognome);
      }

    }

  }

  return {

    modulo,

    allenatore:
      estraiAllenatore(team),

    titolari,

    riserve

  };

}


/* ============================================================
   ARBITRI
============================================================ */

function creaArbitri(competitors, officials) {

  const risultato = {

    arbitro: null,

    assistente_1: null,

    assistente_2: null,

    quarto_ufficiale: null,

    VAR: null,

    AVAR: null

  };

  const lista = [];

  if (Array.isArray(officials)) {
    lista.push(...officials);
  }

  if (Array.isArray(competitors)) {

    for (const c of competitors) {

      if (Array.isArray(c?.officials)) {
        lista.push(...c.officials);
      }

      if (Array.isArray(c?.official)) {
        lista.push(...c.official);
      }

    }

  }

  for (const item of lista) {

    const nome =
      item?.displayName ||
      item?.fullName ||
      item?.name ||
      item?.official?.displayName ||
      item?.official?.fullName ||
      item?.official?.name ||
      null;

    if (!nome) {
      continue;
    }

    const ruolo = normalizzaTesto(
      item?.position?.name ||
      item?.position?.displayName ||
      item?.role ||
      item?.type?.text ||
      item?.type?.name ||
      ""
    );

    if (
      !risultato.arbitro &&
      (
        ruolo.includes("referee") ||
        ruolo.includes("arbitro") ||
        ruolo === "ref"
      )
    ) {

      risultato.arbitro = nome;

      continue;

    }

    if (
      !risultato.assistente_1 &&
      (
        ruolo.includes("assistant referee") ||
        ruolo.includes("assistente")
      )
    ) {

      risultato.assistente_1 = nome;

      continue;

    }

    if (
      !risultato.assistente_2 &&
      (
        ruolo.includes("assistant referee") ||
        ruolo.includes("assistente")
      )
    ) {

      risultato.assistente_2 = nome;

      continue;

    }

    if (
      !risultato.quarto_ufficiale &&
      (
        ruolo.includes("fourth official") ||
        ruolo.includes("quarto")
      )
    ) {

      risultato.quarto_ufficiale = nome;

      continue;

    }

    if (
      !risultato.VAR &&
      (
        ruolo === "var" ||
        ruolo.includes("video assistant referee")
      )
    ) {

      risultato.VAR = nome;

      continue;

    }

    if (
      !risultato.AVAR &&
      (
        ruolo === "avar" ||
        ruolo.includes("assistant video assistant")
      )
    ) {

      risultato.AVAR = nome;

      continue;

    }

  }

  return risultato;

}


/* ============================================================
   MVP
============================================================ */

function estraiMVP(data) {

  const candidati = [

    data?.leaders,

    data?.leader,

    data?.gameInfo?.leaders,

    data?.leaders?.players,

    data?.awards,

    data?.playerOfTheMatch,

    data?.match?.playerOfTheMatch,

    data?.boxscore?.players

  ];

  for (const candidato of candidati) {

    if (!candidato) {
      continue;
    }

    if (Array.isArray(candidato)) {

      for (const item of candidato) {

        const athlete =
          item?.athlete ||
          item?.player ||
          item?.winner ||
          item;

        const nome =
          nomeCompletoAtleta(athlete);

        if (nome) {
          return ultimoCognome(nome);
        }

      }

    }

    if (typeof candidato === "object") {

      const athlete =
        candidato?.athlete ||
        candidato?.player ||
        candidato?.winner ||
        candidato;

      const nome =
        nomeCompletoAtleta(athlete);

      if (nome) {
        return ultimoCognome(nome);
      }

    }

  }

  return null;

}


/* ============================================================
   STATO PARTITA
============================================================ */

function statoPartita(event) {

  const status =
    event?.status ||
    event?.header?.competitions?.[0]?.status ||
    {};

  const type =
    status?.type?.name ||
    status?.type?.id ||
    "";

  const state =
    status?.type?.state ||
    "";

  const testo =
    normalizzaTesto(
      status?.type?.description ||
      status?.type?.detail ||
      status?.type?.shortDetail ||
      ""
    );

  if (
    /postponed|posticipata|posticipato/.test(
      testo
    )
  ) {
    return "Posticipata";
  }

  if (
    /cancelled|canceled|annullata|annullato/.test(
      testo
    )
  ) {
    return "Annullata";
  }

  if (
    type === "postponed" ||
    type === "cancelled"
  ) {
    return type === "postponed"
      ? "Posticipata"
      : "Annullata";
  }

  if (
    state === "in" ||
    type === "in" ||
    type === "live"
  ) {
    return "Live";
  }

  if (
    state === "post" ||
    type === "post" ||
    type === "completed"
  ) {
    return "Finita";
  }

  return "In programma";

}


/* ============================================================
   DATA E ORA
============================================================ */

function dataOraItalia(data) {

  if (!data) {
    return {
      data: null,
      ora: null
    };
  }

  const d = new Date(data);

  if (Number.isNaN(d.getTime())) {
    return {
      data: null,
      ora: null
    };
  }

  const formatter =
    new Intl.DateTimeFormat(
      "it-IT",
      {
        timeZone: "Europe/Rome",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }
    );

  const parti =
    formatter.formatToParts(d);

  const valori = {};

  for (const p of parti) {
    valori[p.type] = p.value;
  }

  return {

    data:
      `${valori.year}-${valori.month}-${valori.day}`,

    ora:
      `${valori.hour}:${valori.minute}`

  };

}


/* ============================================================
   DATA ISO ITALIA
============================================================ */

function dataISOItalia(data) {

  if (!data) {
    return null;
  }

  const d = new Date(data);

  if (Number.isNaN(d.getTime())) {
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
  ).format(d);

}


/* ============================================================
   FINESTRE GIORNATE
============================================================ */

const FINESTRE_GIORNATE = {

  "Serie A": [],

  "Serie B": [],

  "Coppa Italia": [],

  "Nazionale Italia": [],

  "Champions League": [],

  "Europa League": [],

  "Conference League": [],

  "Ligue 1": [],

  "La Liga": [],

  "Premier League": [],

  "Saudi Pro League": [],

  "Liga Portugal": [],

  "Eredivisie": [],

  "Bundesliga": []

};


/* ============================================================
   NORMALIZZA NOME COMPETIZIONE
============================================================ */

function nomeCompetizione(competizione) {

  if (
    COMPETIZIONI[competizione]?.nome
  ) {
    return COMPETIZIONI[competizione].nome;
  }

  return competizione || "";

}


/* ============================================================
   CERCA FINESTRA
============================================================ */

function trovaFinestraGiornata(
  competizione,
  dataPartita
) {

  const finestre =
    FINESTRE_GIORNATE[
      nomeCompetizione(competizione)
    ] || [];

  if (!Array.isArray(finestre)) {
    return null;
  }

  const data =
    dataISOItalia(dataPartita);

  if (!data) {
    return null;
  }

  const corrispondenti =
    finestre.filter((finestra) => {

      if (!finestra) {
        return false;
      }

      const inizio =
        finestra.inizio ||
        finestra.start ||
        null;

      const fine =
        finestra.fine ||
        finestra.end ||
        null;

      if (!inizio || !fine) {
        return false;
      }

      return (
        data >= inizio &&
        data <= fine
      );

    });

  if (!corrispondenti.length) {
    return null;
  }

  corrispondenti.sort((a, b) => {

    const inizioA =
      a.inizio ||
      a.start ||
      "";

    const inizioB =
      b.inizio ||
      b.start ||
      "";

    if (inizioA !== inizioB) {
      return inizioB.localeCompare(
        inizioA
      );
    }

    const fineA =
      a.fine ||
      a.end ||
      "";

    const fineB =
      b.fine ||
      b.end ||
      "";

    return fineA.localeCompare(
      fineB
    );

  });

  return corrispondenti[0];
}


/* ============================================================
   FASE / TURNO ESPN
============================================================ */

async function getFaseTurnoESPN(
  data,
  competizione
) {

  try {

    const competition =
      competizione;

    const league =
      await espnFetch(
        `/apis/site/v2/sports/soccer/${competition}/scoreboard`
      );

    const eventi =
      league?.events || [];

    const targetData =
      dataISOItalia(data);

    if (!targetData) {
      return "";
    }

    for (const evento of eventi) {

      const dataEvento =
        dataISOItalia(
          evento?.date
        );

      if (
        dataEvento !== targetData
      ) {
        continue;
      }

      const competizioneData =
        evento?.competitions?.[0]
          ?.season?.slug ||
        evento?.season?.slug ||
        evento?.season?.name ||
        "";

      const round =
        evento?.competitions?.[0]
          ?.status?.type?.detail ||
        evento?.competitions?.[0]
          ?.status?.type?.shortDetail ||
        evento?.competitions?.[0]
          ?.notes?.[0]?.headline ||
        evento?.season?.type?.name ||
        evento?.season?.type?.abbreviation ||
        "";

      if (round) {
        return round;
      }

      if (competizioneData) {
        return competizioneData;
      }

    }

  } catch (errore) {

    return "";

  }

  return "";

}


/* ============================================================
   FASE / TURNO
============================================================ */

async function getFaseTurno(
  data,
  competizione
) {

  const finestra =
    trovaFinestraGiornata(
      competizione,
      data
    );

  if (finestra) {

    return {

      valore:
        finestra.faseTurno ||
        "",

      fonte:
        "FINESTRE_GIORNATE"

    };

  }

  const faseESPN =
    await getFaseTurnoESPN(
      data,
      competizione
    );

  if (faseESPN) {

    return {

      valore: faseESPN,

      fonte: "ESPN"

    };

  }

  return {

    valore: "",

    fonte: "NESSUNA"

  };

}


/* ============================================================
   VENUE
============================================================ */

function estraiVenue(event) {

  const competition =
    event?.competitions?.[0];

  return (
    competition?.venue ||
    event?.venue ||
    null
  );

}


/* ============================================================
   PUNTEGGIO
============================================================ */

function estraiPunteggio(
  competition,
  homeId,
  awayId
) {

  let home = null;
  let away = null;

  const competitors =
    competition?.competitors || [];

  for (const c of competitors) {

    const id =
      c?.team?.id ||
      c?.id ||
      null;

    const score =
      c?.score;

    if (
      String(id) === String(homeId)
    ) {
      home =
        score === undefined ||
        score === null ||
        score === ""
          ? null
          : Number(score);
    }

    if (
      String(id) === String(awayId)
    ) {
      away =
        score === undefined ||
        score === null ||
        score === ""
          ? null
          : Number(score);
    }

  }

  return {
    home,
    away
  };

}


/* ============================================================
   RIGORI
============================================================ */

function estraiRigori(
  competition,
  homeId,
  awayId
) {

  let home = null;
  let away = null;

  const competitors =
    competition?.competitors || [];

  for (const c of competitors) {

    const id =
      c?.team?.id ||
      c?.id ||
      null;

    const score =
      c?.shootoutScore ??
      c?.penaltyScore ??
      c?.penalties ??
      null;

    if (
      String(id) === String(homeId)
    ) {
      home =
        score === null ||
        score === undefined ||
        score === ""
          ? null
          : Number(score);
    }

    if (
      String(id) === String(awayId)
    ) {
      away =
        score === null ||
        score === undefined ||
        score === ""
          ? null
          : Number(score);
    }

  }

  return {
    home,
    away
  };

}


/* ============================================================
   TIPO FINALE
============================================================ */

function estraiFinishType(event) {

  const testo =
    normalizzaTesto(
      event?.status?.type?.detail ||
      event?.status?.type?.description ||
      event?.competitions?.[0]
        ?.status?.type?.detail ||
      ""
    );

  if (
    testo.includes("penalty") ||
    testo.includes("rigori")
  ) {
    return "rigori";
  }

  if (
    testo.includes("extra time") ||
    testo.includes("tempi supplementari")
  ) {
    return "supplementari";
  }

  return "normale";

}


/* ============================================================
   QUALIFICAZIONE
============================================================ */

function estraiQualificazione(
  event,
  competizione
) {

  const nome =
    nomeCompetizione(
      competizione
    );

  const competizioniKnockout = [
    "Champions League",
    "Europa League",
    "Conference League",
    "Coppa Italia"
  ];

  if (
    !competizioniKnockout.includes(
      nome
    )
  ) {
    return {
      qualification_status: null,
      winner_team: null
    };
  }

  const competition =
    event?.competitions?.[0];

  const competitors =
    competition?.competitors || [];

  let winner = null;

  for (const c of competitors) {

    if (
      c?.winner === true ||
      c?.advance === true ||
      c?.isWinner === true
    ) {

      winner =
        normalizzaNomeSquadra(
          c?.team?.displayName ||
          c?.team?.name ||
          c?.displayName ||
          c?.name
        );

      break;

    }

  }

  const note =
    competition?.notes?.[0]
      ?.headline ||
    competition?.notes?.[0]
      ?.text ||
    "";

  return {

    qualification_status:
      note || null,

    winner_team:
      winner

  };

}


/* ============================================================
   STATISTICHE
============================================================ */

function valoreStatistica(
  statistiche,
  nomi
) {

  if (!Array.isArray(statistiche)) {
    return null;
  }

  const elenco =
    Array.isArray(nomi)
      ? nomi
      : [nomi];

  for (const stat of statistiche) {

    const nome =
      normalizzaTesto(
        stat?.name ||
        stat?.displayName ||
        stat?.label ||
        ""
      );

    for (const candidato of elenco) {

      if (
        nome ===
        normalizzaTesto(candidato)
      ) {

        return (
          stat?.displayValue ??
          stat?.value ??
          null
        );

      }

    }

  }

  return null;

}


/* ============================================================
   STATISTICHE SQUADRA
============================================================ */

function creaStatisticheSquadra(
  teamStats
) {

  if (!Array.isArray(teamStats)) {
    return {};
  }

  const statistiche = {};

  const mappa = {

    possesso:
      [
        "possession",
        "possession pct",
        "possession percentage"
      ],

    tiri:
      [
        "shots",
        "total shots"
      ],

    tiri_in_porta:
      [
        "shots on target",
        "on target"
      ],

    tiri_fuori:
      [
        "shots off target"
      ],

    tiri_bloccati:
      [
        "blocked shots"
      ],

    corner:
      [
        "corners",
        "corner kicks"
      ],

    falli:
      [
        "fouls",
        "fouls committed"
      ],

    fuorigioco:
      [
        "offsides"
      ],

    passaggi:
      [
        "total passes",
        "passes"
      ],

    precisione_passaggi:
      [
        "passing accuracy",
        "passes accurate"
      ],

    parate:
      [
        "saves"
      ],

    calci_di_punizione:
      [
        "penalty kicks"
      ]

  };

  for (const [chiave, nomi] of Object.entries(
    mappa
  )) {

    const valore =
      valoreStatistica(
        teamStats,
        nomi
      );

    if (
      valore !== null &&
      valore !== undefined
    ) {

      statistiche[chiave] =
        valore;

    }

  }

  return statistiche;

}


/* ============================================================
   CREA STATISTICHE
============================================================ */

function creaStatistiche(
  boxscore,
  competitors
) {

  const risultato = {

    casa: {},

    trasferta: {}

  };

  if (
    !Array.isArray(
      competitors
    )
  ) {
    return risultato;
  }

  const home =
    competitors.find(
      (c) =>
        c?.homeAway === "home"
    );

  const away =
    competitors.find(
      (c) =>
        c?.homeAway === "away"
    );

  const players =
    boxscore?.players ||
    [];

  let homeStats = null;
  let awayStats = null;

  if (
    Array.isArray(
      boxscore?.teams
    )
  ) {

    for (
      const team of boxscore.teams
    ) {

      const teamId =
        team?.team?.id ||
        team?.id;

      const stats =
        team?.statistics ||
        team?.stats ||
        [];

      if (
        String(teamId) ===
        String(
          home?.team?.id
        )
      ) {
        homeStats = stats;
      }

      if (
        String(teamId) ===
        String(
          away?.team?.id
        )
      ) {
        awayStats = stats;
      }

    }

  }

  resultadoDummy: {

  }

  resultado = {

    casa:
      creaStatisticheSquadra(
        homeStats
      ),

    trasferta:
      creaStatisticheSquadra(
        awayStats
      )

  };

  return risultato;

}


/* ============================================================
   CRONACA - TRADUZIONE
============================================================ */

function traduciTestoCronaca(testo) {

  if (!testo) {
    return "";
  }

  let t = String(testo);

  const traduzioni = [

    [/First Half begins/gi, "Inizia il primo tempo"],
    [/Second Half begins/gi, "Inizia il secondo tempo"],
    [/First Half ends/gi, "Finisce il primo tempo"],
    [/Second Half ends/gi, "Finisce il secondo tempo"],

    [/Halftime/gi, "Intervallo"],
    [/Full Time/gi, "Fine della partita"],
    [/End of game/gi, "Fine della partita"],

    [/Extra Time begins/gi, "Iniziano i tempi supplementari"],
    [/Extra Time ends/gi, "Finiscono i tempi supplementari"],

    [/Penalty Shootout/gi, "Calci di rigore"],

    [/Drinks break/gi, "Pausa per rinfrescarsi"],

    [/Injury Delay/gi, "Partita interrotta per infortunio"],
    [/Injury delay/gi, "Partita interrotta per infortunio"],

    [/Substitution/gi, "Sostituzione"],
    [/substitutes/gi, "sostituti"],
    [/replaces/gi, "sostituisce"],
    [/replaced by/gi, "sostituito da"],

    [/Goal/gi, "Gol"],
    [/Own Goal/gi, "Autorete"],

    [/Yellow Card/gi, "Ammonizione"],
    [/Red Card/gi, "Espulsione"],
    [/Second Yellow/gi, "Seconda ammonizione"],

    [/Penalty/gi, "Rigore"],

    [/assisted by/gi, "assist di"],
    [/Assist by/gi, "Assist di"],

    [/Cross/gi, "Cross"],
    [/right footed shot/gi, "tiro di destro"],
    [/left footed shot/gi, "tiro di sinistro"],
    [/header/gi, "colpo di testa"],

    [/from the right side of the box/gi, "dalla destra dell'area"],
    [/from the left side of the box/gi, "dalla sinistra dell'area"],
    [/from outside the box/gi, "da fuori area"],
    [/from inside the box/gi, "dall'interno dell'area"],

    [/close range/gi, "da distanza ravvicinata"],

    [/Corner/gi, "Calcio d'angolo"],
    [/Corners/gi, "Calci d'angolo"],

    [/Foul/gi, "Fallo"],
    [/Bad foul/gi, "Fallo grave"],
    [/Handball/gi, "Mano"],

    [/Delay/gi, "Interruzione"],

    [/missed/gi, "fallito"],
    [/blocked/gi, "respinto"],
    [/saved/gi, "parato"],
    [/wide/gi, "fuori"],
    [/offside/gi, "fuorigioco"],

    [/misses to the left/gi, "termina a sinistra"],
    [/misses to the right/gi, "termina a destra"],

    [/Goal awarded/gi, "Gol convalidato"],
    [/Goal disallowed/gi, "Gol annullato"],

    [/VAR Review/gi, "Revisione VAR"],
    [/VAR review/gi, "Revisione VAR"],

    [/Video Assistant Referee/gi, "VAR"],

    [/Match ends/gi, "La partita è terminata"],

    [/starts/gi, "inizia"],
    [/begins/gi, "inizia"],
    [/ends/gi, "termina"],

    [/the ball is cleared/gi, "il pallone viene allontanato"],
    [/the ball is headed out/gi, "il pallone viene respinto di testa"],

    [/shot/gi, "tiro"],
    [/attempt/gi, "tentativo"],

    [/goalkeeper/gi, "portiere"],
    [/keeper/gi, "portiere"],

    [/attacking half/gi, "metà campo offensiva"],
    [/defensive half/gi, "metà campo difensiva"],

    [/box/gi, "area"],

    [/match/gi, "partita"],
    [/game/gi, "partita"],

    [/player/gi, "giocatore"],
    [/team/gi, "squadra"],

    [/kick off/gi, "calcio d'inizio"],
    [/kickoff/gi, "calcio d'inizio"],

    [/free kick/gi, "calcio di punizione"],

    [/throw in/gi, "rimessa laterale"],

    [/goal kick/gi, "rinvio dal fondo"],

    [/off the post/gi, "sul palo"],
    [/off the bar/gi, "sulla traversa"],

    [/hits the post/gi, "colpisce il palo"],
    [/hits the bar/gi, "colpisce la traversa"],

    [/clearance/gi, "rinvio"],

    [/tackle/gi, "contrasto"],

    [/interception/gi, "intercetto"],

    [/possession/gi, "possesso"],

    [/foul committed/gi, "fallo commesso"],

    [/appeal/gi, "protesta"],

    [/crowd/gi, "pubblico"],

    [/attendance/gi, "spettatori"],

    [/stoppage time/gi, "recupero"],

    [/added time/gi, "recupero"]

  ];

  for (const [regex, sostituzione] of traduzioni) {
    t = t.replace(
      regex,
      sostituzione
    );
  }

  return t;

}


/* ============================================================
   CRONACA
============================================================ */

function creaCronaca(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  return plays.map((p) => {

    const testo =
      p?.text ||
      p?.description ||
      p?.type?.text ||
      "";

    return {

      minuto:
        minutoEvento(p),

      testo:
        traduciTestoCronaca(
          testo
        ),

      giocatore:
        nomeGiocatore(p),

      assist:
        assistGiocatore(p),

      squadra:
        squadraEvento(p)

    };

  });

}


/* ============================================================
   PLAY-BY-PLAY
============================================================ */

function estraiPlays(data) {

  return (
    data?.plays ||
    data?.competitions?.[0]?.plays ||
    data?.gameInfo?.plays ||
    []
  );

}


/* ============================================================
   SOSTITUZIONI DA LINEUP
============================================================ */

function creaSostituzioniDaLineup(
  competitors
) {

  const risultato = [];

  if (!Array.isArray(competitors)) {
    return risultato;
  }

  for (const c of competitors) {

    const lineup =
      c?.roster ||
      c?.lineup ||
      c?.players ||
      [];

    if (!Array.isArray(lineup)) {
      continue;
    }

    for (const p of lineup) {

      if (
        !p?.subbedIn &&
        !p?.substitute &&
        !p?.substitution
      ) {
        continue;
      }

      const entrato =
        p?.athlete ||
        p?.player ||
        p;

      const sub =
        p?.substitution ||
        {};

      const uscito =
        sub?.out ||
        p?.replacedPlayer ||
        null;

      risultato.push({

        minuto:
          p?.substitution?.minute ||
          p?.minute ||
          null,

        entra:
          cognomeAtleta(
            entrato
          ),

        esce:
          cognomeAtleta(
            uscito
          ),

        squadra:
          normalizzaNomeSquadra(
            c?.team?.displayName ||
            c?.team?.name
          )

      });

    }

  }

  return risultato;

}


/* ============================================================
   FORMAZIONI DA COMPETITOR
============================================================ */

function creaFormazioni(
  competitors
) {

  const risultato = {

    casa: null,

    trasferta: null

  };

  if (!Array.isArray(competitors)) {
    return risultato;
  }

  for (const c of competitors) {

    const formazione =
      creaFormazioneTeam(c);

    if (
      c?.homeAway === "home"
    ) {

      risultato.casa =
        formazione;

    }

    if (
      c?.homeAway === "away"
    ) {

      risultato.trasferta =
        formazione;

    }

  }

  return risultato;

}


/* ============================================================
   ARBITRAGGIO
============================================================ */

function estraiOfficials(
  event
) {

  const competition =
    event?.competitions?.[0];

  const officials =
    competition?.officials ||
    event?.officials ||
    [];

  return creaArbitri(
    competition?.competitors,
    officials
  );

}


/* ============================================================
   STADIO
============================================================ */

function creaStadio(venue) {

  if (!venue) {
    return null;
  }

  return {

    nome:
      venue?.fullName ||
      venue?.displayName ||
      venue?.name ||
      null,

    citta:
      venue?.address?.city ||
      null,

    paese:
      venue?.address?.country ||
      null

  };

}


/* ============================================================
   COMPETITOR
============================================================ */

function estraiCompetitor(
  competition,
  homeAway
) {

  return (
    competition?.competitors?.find(
      (c) =>
        c?.homeAway === homeAway
    ) ||
    null
  );

}


/* ============================================================
   NOME COMPETITORE
============================================================ */

function nomeCompetitor(c) {

  if (!c) {
    return null;
  }

  return normalizzaNomeSquadra(
    c?.team?.displayName ||
    c?.team?.name ||
    c?.displayName ||
    c?.name
  );

}


/* ============================================================
   ID COMPETITORE
============================================================ */

function idCompetitor(c) {

  if (!c) {
    return null;
  }

  return (
    c?.team?.id ||
    c?.id ||
    null
  );

}


/* ============================================================
   DATA STATO
============================================================ */

function creaMetaPartita(
  event,
  competition
) {

  const dataOra =
    dataOraItalia(
      event?.date
    );

  return {

    data:
      dataOra.data,

    ora:
      dataOra.ora,

    status:
      statoPartita(event),

    finish_type:
      estraiFinishType(event),

    faseTurno:
      null

  };

}


/* ============================================================
   ERRORI
============================================================ */

function erroreJSON(
  res,
  status,
  messaggio,
  extra = {}
) {

  return res.status(status).json({

    ok: false,

    errore:
      messaggio,

    ...extra

  });

}


/* ============================================================
   HANDLER
============================================================ */

module.exports = async function handler(
  req,
  res
) {

  try {

    const id =
      req?.query?.id;

    const competizione =
      req?.query?.competizione ||
      "ita.1";


    if (!id) {

      return erroreJSON(
        res,
        400,
        "Parametro id obbligatorio"
      );

    }


    if (
      !COMPETIZIONI[
        competizione
      ]
    ) {

      return erroreJSON(
        res,
        400,
        "Competizione non supportata",
        {
          competizione
        }
      );

    }


    const endpoint =
      `/apis/site/v2/sports/soccer/${competizione}/summary?event=${id}`;


    const data =
      await espnFetch(
        endpoint
      );


    if (!data) {

      return erroreJSON(
        res,
        404,
        "Partita non trovata"
      );

    }


    const event =
      data?.header ||
      data?.event ||
      data;


    const competitionData =
      event?.competitions?.[0] ||
      data?.competitions?.[0] ||
      {};


    const competitors =
      competitionData?.competitors ||
      event?.competitions?.[0]?.competitors ||
      [];


    const home =
      estraiCompetitor(
        competitionData,
        "home"
      );


    const away =
      estraiCompetitor(
        competitionData,
        "away"
      );


    const homeId =
      idCompetitor(home);


    const awayId =
      idCompetitor(away);


    const punteggio =
      estraiPunteggio(
        competitionData,
        homeId,
        awayId
      );


    const rigori =
      estraiRigori(
        competitionData,
        homeId,
        awayId
      );


    const plays =
      estraiPlays(data);


    const eventi =
      creaEventi(plays);


    const gol =
      creaGol(plays);


    const cartellini =
      creaCartellini(plays);


    const espulsioni =
      creaEspulsioni(plays);


    const sostituzioni =
      creaSostituzioni(plays);


    const sostituzioniLineup =
      creaSostituzioniDaLineup(
        competitors
      );


    const tutteSostituzioni =
      [
        ...sostituzioni,
        ...sostituzioniLineup
      ];


    const formazioni =
      creaFormazioni(
        competitors
      );


    const arbitri =
      estraiOfficials(event);


    const venue =
      estraiVenue(event);


    const mvp =
      estraiMVP(data);


    const faseTurno =
      await getFaseTurno(
        event?.date ||
        competitionData?.date,
        competizione
      );


    const qualificazione =
      estraiQualificazione(
        event,
        competizione
      );


    const boxscore =
      data?.boxscore ||
      null;


    const statistiche =
      creaStatistiche(
        boxscore,
        competitors
      );


    const meta =
      creaMetaPartita(
        event,
        competitionData
      );


    meta.faseTurno =
      faseTurno.valore;


    const risposta = {

      ok: true,


      id:
        String(id),


      competizione: {

        id:
          competizione,

        nome:
          COMPETIZIONI[
            competizione
          ]?.nome ||
          competizione,

        paese:
          COMPETIZIONI[
            competizione
          ]?.paese ||
          null

      },


      faseTurno: {

        valore:
          faseTurno.valore,

        fonte:
          faseTurno.fonte

      },


      partita: {

        casa:
          nomeCompetitor(home),

        trasferta:
          nomeCompetitor(away),

        data:
          meta.data,

        ora:
          meta.ora,

        status:
          meta.status,

        risultato: {

          casa:
            punteggio.home,

          trasferta:
            punteggio.away

        },


        rigori: {

          casa:
            rigori.home,

          trasferta:
            rigori.away

        },


        finish_type:
          meta.finish_type

      },


      gol,


      cartellini,


      espulsioni,


      sostituzioni:
        tutteSostituzioni,


      formazioni,


      cronaca:
        creaCronaca(plays),


      eventi,


      statistiche,


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


      qualification_status:
        qualificazione.qualification_status,


      winner_team:
        qualificazione.winner_team,


      last_update:
        new Date().toISOString()

    };


    return res.status(200).json(
      risposta
    );


  } catch (errore) {

    console.error(
      "ERRORE API PARTITA:",
      errore
    );


    return erroreJSON(
      res,
      500,
      "Errore interno API",
      {
        dettaglio:
          errore?.message ||
          String(errore)
      }
    );

  }

};


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
    { inizio:"2027-03-25", fine:"2027-03-30", faseTurno:"Giornata 28" },
    { inizio:"2027-04-01", fine:"2027-04-06", faseTurno:"Giornata 29" },
    { inizio:"2027-04-08", fine:"2027-04-15", faseTurno:"Giornata 30" },
    { inizio:"2027-04-22", fine:"2027-04-28", faseTurno:"Giornata 31" },
    { inizio:"2027-04-29", fine:"2027-05-05", faseTurno:"Giornata 32" },
    { inizio:"2027-05-06", fine:"2027-05-12", faseTurno:"Giornata 33" },
    { inizio:"2027-05-13", fine:"2027-05-19", faseTurno:"Giornata 34" }

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



  return corrispondenti[0];
}


/* ============================================================
   FALLBACK ESPN

   UTILIZZATO SOLO SE NON ESISTE UNA FINESTRA.
============================================================ */

function getFaseTurnoESPN(
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

if (
  finestra &&
  finestra.faseTurno
) {

  return {

    valore:
      finestra.faseTurno,

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
  r?.coach?.displayName ||
  r?.coach?.fullName ||
  r?.coaches?.[0]?.displayName ||
  r?.coaches?.[0]?.fullName ||
  r?.team?.coach?.displayName ||
  r?.team?.coach?.fullName ||
  null,

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

function creaRigori(
  data,
  competition,
  home,
  away
) {

  const risultato = {

    partitaTerminataAiRigori: false,

    casa: null,

    trasferta: null

  };


  /* ==========================================================
     CERCA SOLO INDICATORI ESPLICITI DI UNA SERIE DI RIGORI

     NON bisogna cercare semplicemente "penalty" o "rigori",
     perché ESPN può utilizzare questi termini anche nelle
     normali statistiche della partita.
  ========================================================== */

  const testo =
    JSON.stringify({
      data,
      competition
    }).toLowerCase();


  const shootoutEsplicito =
    testo.includes("penalty shootout") ||
    testo.includes("penalty shoot-out") ||
    testo.includes("shootout") ||
    testo.includes("shoot-out") ||
    testo.includes("decided on penalties") ||
    testo.includes("decided by penalties") ||
    testo.includes("won on penalties") ||
    testo.includes("wins on penalties") ||
    testo.includes("ended in penalties") ||
    testo.includes("match decided by penalties") ||
    testo.includes("game decided by penalties") ||
    testo.includes("penalty kicks to decide") ||
    testo.includes("penalty kicks decided") ||
    testo.includes("rigori decisivi") ||
    testo.includes("serie di rigori") ||
    testo.includes("terminata ai rigori") ||
    testo.includes("finita ai rigori");


  /* ==========================================================
     PUNTEGGIO RIGORI ESPLICITO

     shootoutScore è il campo principale da utilizzare.

     NON utilizziamo più:
       penaltyScore
       penalties

     perché possono rappresentare statistiche sui rigori
     durante i 90/120 minuti e NON necessariamente una
     serie finale di rigori.
  ========================================================== */

  const rigoriHome =
    home?.shootoutScore ??
    null;


  const rigoriAway =
    away?.shootoutScore ??
    null;


  /* ==========================================================
     CONTROLLO PUNTEGGI SHOOTOUT

     Se ESPN fornisce entrambi gli shootoutScore,
     abbiamo una conferma molto forte della serie di rigori.
  ========================================================== */

  const punteggioShootoutPresente =
    rigoriHome !== null &&
    rigoriHome !== undefined &&
    rigoriAway !== null &&
    rigoriAway !== undefined;


  /* ==========================================================
     DETERMINAZIONE FINALE

     La partita è terminata ai rigori SOLO se:

     1. ESPN dichiara esplicitamente una serie di rigori

     OPPURE

     2. ESPN fornisce entrambi i punteggi shootoutScore.
  ========================================================== */

  if (
    shootoutEsplicito ||
    punteggioShootoutPresente
  ) {

    risultato.partitaTerminataAiRigori =
      true;


    /* ========================================================
       PUNTEGGIO RIGORI CASA
    ======================================================== */

    if (
      rigoriHome !== null &&
      rigoriHome !== undefined
    ) {

      risultato.casa =
        rigoriHome;

    }


    /* ========================================================
       PUNTEGGIO RIGORI TRASFERTA
    ======================================================== */

    if (
      rigoriAway !== null &&
      rigoriAway !== undefined
    ) {

      risultato.trasferta =
        rigoriAway;

    }

  }


  /* ==========================================================
     RISULTATO
  ========================================================== */

  return risultato;

}


/* ============================================================
   MVP
============================================================ */

const mvp =
  trovaMVP(data);


/* ============================================================
   RISPOSTA
============================================================ */

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

    faseTurno viene determinato con questo ordine:

    1. FINESTRE_GIORNATE
    2. ESPN
    3. ""

    Se esiste una finestra per la data della partita,
    ESPN NON può sovrascriverla.
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
  ====================================================== */

  info: {

    /*
    SOLO L'ARBITRO PRINCIPALE
    */

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

     Formato:

     entra: Cognome
     esce: Cognome
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
     CRONACA COMPLETA

     Il testo viene passato attraverso
     traduciTestoCronaca(), quindi la cronaca
     viene restituita in italiano.
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
            traduciTestoCronaca(
              p?.text ||
              p?.description ||
              null
            )

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
