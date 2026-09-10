const { espnFetch } = require("../lib/espn");

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

const ALIAS_SQUADRE = {
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
  "anderlecht": "Anderlecht",
  "rsc anderlecht": "Anderlecht",
  "ararat-armenia": "Ararat-Armenia",
  "celje": "Celje",
  "celtic": "Celtic",
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
  "al riyadh": "Al Riyadh",
  "al taawoun": "Al Taawoun",
  "al wehda": "Al Wehda",
  "damac": "Damac",
  "al raed": "Al Raed",
  "al okhdood": "Al Okhdood",
  "al shabab": "Al Shabab",

  "serie c": "Serie C",
  "lega pro": "Serie C"
};

function normalizzaNomeSquadra(nome) {
  if (!nome) {
    return "";
  }

  const testo =
    String(nome)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  return (
    ALIAS_SQUADRE[testo] ||
    String(nome).trim()
  );
}

function getNomeSquadra(team) {
  if (!team) {
    return "";
  }

  return normalizzaNomeSquadra(
    team.displayName ||
    team.shortDisplayName ||
    team.name ||
    team.location ||
    ""
  );
}

function getIdSquadra(team) {
  if (!team) {
    return "";
  }

  return String(
    team.id ||
    team.teamId ||
    team.uid ||
    ""
  );
}

function getCompetizione(competizione) {
  if (!competizione) {
    return null;
  }

  const codice =
    String(competizione)
      .trim()
      .toLowerCase();

  if (COMPETIZIONI[codice]) {
    return {
      codice,
      ...COMPETIZIONI[codice]
    };
  }

  return null;
}

function formatoDataValido(data) {
  if (!data) {
    return false;
  }

  const valore =
    new Date(data);

  return !isNaN(
    valore.getTime()
  );
}

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

const FINESTRE_GIORNATE = {
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
    { inizio:"2026-12-03", fine:"2026-12-08", faseTurno:"Giornata 13" },
    { inizio:"2026-12-10", fine:"2026-12-15", faseTurno:"Giornata 14" },
    { inizio:"2026-12-17", fine:"2026-12-22", faseTurno:"Giornata 15" },
    { inizio:"2026-12-26", fine:"2026-12-29", faseTurno:"Giornata 16" },
    { inizio:"2026-12-31", fine:"2027-01-05", faseTurno:"Giornata 17" },
    { inizio:"2027-01-06", fine:"2027-01-12", faseTurno:"Giornata 18" },
    { inizio:"2027-01-14", fine:"2027-01-19", faseTurno:"Giornata 19" },
    { inizio:"2027-01-21", fine:"2027-01-26", faseTurno:"Giornata 20" },
    { inizio:"2027-01-28", fine:"2027-02-02", faseTurno:"Giornata 21" },
    { inizio:"2027-02-04", fine:"2027-02-09", faseTurno:"Giornata 22" },
    { inizio:"2027-02-11", fine:"2027-02-16", faseTurno:"Giornata 23" },
    { inizio:"2027-02-18", fine:"2027-02-23", faseTurno:"Giornata 24" },
    { inizio:"2027-02-25", fine:"2027-03-02", faseTurno:"Giornata 25" },
    { inizio:"2027-03-04", fine:"2027-03-09", faseTurno:"Giornata 26" },
    { inizio:"2027-03-11", fine:"2027-03-16", faseTurno:"Giornata 27" },
    { inizio:"2027-03-18", fine:"2027-03-23", faseTurno:"Giornata 28" },
    { inizio:"2027-04-01", fine:"2027-04-06", faseTurno:"Giornata 29" },
    { inizio:"2027-04-08", fine:"2027-04-13", faseTurno:"Giornata 30" },
    { inizio:"2027-04-15", fine:"2027-04-20", faseTurno:"Giornata 31" },
    { inizio:"2027-04-22", fine:"2027-04-27", faseTurno:"Giornata 32" },
    { inizio:"2027-04-29", fine:"2027-05-04", faseTurno:"Giornata 33" },
    { inizio:"2027-05-06", fine:"2027-05-11", faseTurno:"Giornata 34" },
    { inizio:"2027-05-13", fine:"2027-05-18", faseTurno:"Giornata 35" },
    { inizio:"2027-05-20", fine:"2027-05-25", faseTurno:"Giornata 36" },
    { inizio:"2027-05-27", fine:"2027-06-01", faseTurno:"Giornata 37" },
    { inizio:"2027-06-03", fine:"2027-06-08", faseTurno:"Giornata 38" }
  ],

  "fra.1": [
    { inizio:"2026-08-20", fine:"2026-08-25", faseTurno:"Giornata 1" },
    { inizio:"2026-08-27", fine:"2026-09-01", faseTurno:"Giornata 2" },
    { inizio:"2026-09-10", fine:"2026-09-15", faseTurno:"Giornata 3" },
    { inizio:"2026-09-17", fine:"2026-09-22", faseTurno:"Giornata 4" },
    { inizio:"2026-09-24", fine:"2026-09-29", faseTurno:"Giornata 5" },
    { inizio:"2026-10-01", fine:"2026-10-06", faseTurno:"Giornata 6" },
    { inizio:"2026-10-15", fine:"2026-10-20", faseTurno:"Giornata 7" },
    { inizio:"2026-10-22", fine:"2026-10-27", faseTurno:"Giornata 8" },
    { inizio:"2026-10-29", fine:"2026-11-03", faseTurno:"Giornata 9" },
    { inizio:"2026-11-05", fine:"2026-11-10", faseTurno:"Giornata 10" },
    { inizio:"2026-11-19", fine:"2026-11-24", faseTurno:"Giornata 11" },
    { inizio:"2026-11-26", fine:"2026-12-01", faseTurno:"Giornata 12" },
    { inizio:"2026-12-03", fine:"2026-12-08", faseTurno:"Giornata 13" },
    { inizio:"2026-12-10", fine:"2026-12-15", faseTurno:"Giornata 14" },
    { inizio:"2026-12-17", fine:"2026-12-22", faseTurno:"Giornata 15" },
    { inizio:"2026-12-31", fine:"2027-01-05", faseTurno:"Giornata 16" },
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
    { inizio:"2027-04-08", fine:"2027-04-13", faseTurno:"Giornata 29" },
    { inizio:"2027-04-15", fine:"2027-04-20", faseTurno:"Giornata 30" },
    { inizio:"2027-04-22", fine:"2027-04-27", faseTurno:"Giornata 31" },
    { inizio:"2027-04-29", fine:"2027-05-04", faseTurno:"Giornata 32" },
    { inizio:"2027-05-06", fine:"2027-05-11", faseTurno:"Giornata 33" },
    { inizio:"2027-05-13", fine:"2027-05-18", faseTurno:"Giornata 34" },
    { inizio:"2027-05-20", fine:"2027-05-25", faseTurno:"Giornata 35" },
    { inizio:"2027-05-27", fine:"2027-06-01", faseTurno:"Giornata 36" }
  ],

  "ger.1": [
    { inizio:"2026-08-20", fine:"2026-08-25", faseTurno:"Giornata 1" },
    { inizio:"2026-08-27", fine:"2026-09-01", faseTurno:"Giornata 2" },
    { inizio:"2026-09-10", fine:"2026-09-15", faseTurno:"Giornata 3" },
    { inizio:"2026-09-17", fine:"2026-09-22", faseTurno:"Giornata 4" },
    { inizio:"2026-10-15", fine:"2026-10-20", faseTurno:"Giornata 5" },
    { inizio:"2026-10-22", fine:"2026-10-27", faseTurno:"Giornata 6" },
    { inizio:"2026-10-29", fine:"2026-11-03", faseTurno:"Giornata 7" },
    { inizio:"2026-11-05", fine:"2026-11-10", faseTurno:"Giornata 8" },
    { inizio:"2026-11-19", fine:"2026-11-24", faseTurno:"Giornata 9" },
    { inizio:"2026-11-26", fine:"2026-12-01", faseTurno:"Giornata 10" },
    { inizio:"2026-12-03", fine:"2026-12-08", faseTurno:"Giornata 11" },
    { inizio:"2026-12-10", fine:"2026-12-15", faseTurno:"Giornata 12" },
    { inizio:"2026-12-17", fine:"2026-12-22", faseTurno:"Giornata 13" },
    { inizio:"2026-12-31", fine:"2027-01-05", faseTurno:"Giornata 14" },
    { inizio:"2027-01-07", fine:"2027-01-12", faseTurno:"Giornata 15" },
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
    { inizio:"2027-05-27", fine:"2027-06-01", faseTurno:"Giornata 34" }
  ],

  "por.1": [
    { inizio:"2026-08-07", fine:"2026-08-12", faseTurno:"Giornata 1" },
    { inizio:"2026-08-14", fine:"2026-08-19", faseTurno:"Giornata 2" },
    { inizio:"2026-08-21", fine:"2026-08-26", faseTurno:"Giornata 3" },
    { inizio:"2026-08-28", fine:"2026-09-02", faseTurno:"Giornata 4" },
    { inizio:"2026-09-11", fine:"2026-09-16", faseTurno:"Giornata 5" },
    { inizio:"2026-09-18", fine:"2026-09-23", faseTurno:"Giornata 6" },
    { inizio:"2026-09-25", fine:"2026-09-30", faseTurno:"Giornata 7" },
    { inizio:"2026-10-02", fine:"2026-10-07", faseTurno:"Giornata 8" },
    { inizio:"2026-10-23", fine:"2026-10-28", faseTurno:"Giornata 9" },
    { inizio:"2026-10-30", fine:"2026-11-04", faseTurno:"Giornata 10" },
    { inizio:"2026-11-06", fine:"2026-11-11", faseTurno:"Giornata 11" },
    { inizio:"2026-11-20", fine:"2026-11-25", faseTurno:"Giornata 12" },
    { inizio:"2026-11-27", fine:"2026-12-02", faseTurno:"Giornata 13" },
    { inizio:"2026-12-04", fine:"2026-12-09", faseTurno:"Giornata 14" },
    { inizio:"2026-12-11", fine:"2026-12-16", faseTurno:"Giornata 15" },
    { inizio:"2026-12-18", fine:"2026-12-23", faseTurno:"Giornata 16" },
    { inizio:"2027-01-08", fine:"2027-01-13", faseTurno:"Giornata 17" },
    { inizio:"2027-01-15", fine:"2027-01-20", faseTurno:"Giornata 18" },
    { inizio:"2027-01-22", fine:"2027-01-27", faseTurno:"Giornata 19" },
    { inizio:"2027-01-29", fine:"2027-02-03", faseTurno:"Giornata 20" },
    { inizio:"2027-02-05", fine:"2027-02-10", faseTurno:"Giornata 21" },
    { inizio:"2027-02-12", fine:"2027-02-17", faseTurno:"Giornata 22" },
    { inizio:"2027-02-19", fine:"2027-02-24", faseTurno:"Giornata 23" },
    { inizio:"2027-02-26", fine:"2027-03-03", faseTurno:"Giornata 24" },
    { inizio:"2027-03-05", fine:"2027-03-10", faseTurno:"Giornata 25" },
    { inizio:"2027-03-12", fine:"2027-03-17", faseTurno:"Giornata 26" },
    { inizio:"2027-03-19", fine:"2027-03-24", faseTurno:"Giornata 27" },
    { inizio:"2027-04-02", fine:"2027-04-07", faseTurno:"Giornata 28" },
    { inizio:"2027-04-09", fine:"2027-04-14", faseTurno:"Giornata 29" },
    { inizio:"2027-04-16", fine:"2027-04-21", faseTurno:"Giornata 30" },
    { inizio:"2027-04-23", fine:"2027-04-28", faseTurno:"Giornata 31" },
    { inizio:"2027-04-30", fine:"2027-05-05", faseTurno:"Giornata 32" },
    { inizio:"2027-05-07", fine:"2027-05-12", faseTurno:"Giornata 33" },
    { inizio:"2027-05-14", fine:"2027-05-19", faseTurno:"Giornata 34" },
    { inizio:"2027-05-21", fine:"2027-05-26", faseTurno:"Giornata 35" },
    { inizio:"2027-05-28", fine:"2027-06-02", faseTurno:"Giornata 36" }
  ],

  "ned.1": [
    { inizio:"2026-08-07", fine:"2026-08-12", faseTurno:"Giornata 1" },
    { inizio:"2026-08-14", fine:"2026-08-19", faseTurno:"Giornata 2" },
    { inizio:"2026-08-21", fine:"2026-08-26", faseTurno:"Giornata 3" },
    { inizio:"2026-08-28", fine:"2026-09-02", faseTurno:"Giornata 4" },
    { inizio:"2026-09-11", fine:"2026-09-16", faseTurno:"Giornata 5" },
    { inizio:"2026-09-18", fine:"2026-09-23", faseTurno:"Giornata 6" },
    { inizio:"2026-09-25", fine:"2026-09-30", faseTurno:"Giornata 7" },
    { inizio:"2026-10-02", fine:"2026-10-07", faseTurno:"Giornata 8" },
    { inizio:"2026-10-16", fine:"2026-10-21", faseTurno:"Giornata 9" },
    { inizio:"2026-10-23", fine:"2026-10-28", faseTurno:"Giornata 10" },
    { inizio:"2026-10-30", fine:"2026-11-04", faseTurno:"Giornata 11" },
    { inizio:"2026-11-06", fine:"2026-11-11", faseTurno:"Giornata 12" },
    { inizio:"2026-11-20", fine:"2026-11-25", faseTurno:"Giornata 13" },
    { inizio:"2026-11-27", fine:"2026-12-02", faseTurno:"Giornata 14" },
    { inizio:"2026-12-04", fine:"2026-12-09", faseTurno:"Giornata 15" },
    { inizio:"2026-12-11", fine:"2026-12-16", faseTurno:"Giornata 16" },
    { inizio:"2026-12-18", fine:"2026-12-23", faseTurno:"Giornata 17" },
    { inizio:"2027-01-08", fine:"2027-01-13", faseTurno:"Giornata 18" },
    { inizio:"2027-01-15", fine:"2027-01-20", faseTurno:"Giornata 19" },
    { inizio:"2027-01-22", fine:"2027-01-27", faseTurno:"Giornata 20" },
    { inizio:"2027-01-29", fine:"2027-02-03", faseTurno:"Giornata 21" },
    { inizio:"2027-02-05", fine:"2027-02-10", faseTurno:"Giornata 22" },
    { inizio:"2027-02-12", fine:"2027-02-17", faseTurno:"Giornata 23" },
    { inizio:"2027-02-19", fine:"2027-02-24", faseTurno:"Giornata 24" },
    { inizio:"2027-02-26", fine:"2027-03-03", faseTurno:"Giornata 25" },
    { inizio:"2027-03-05", fine:"2027-03-10", faseTurno:"Giornata 26" },
    { inizio:"2027-03-12", fine:"2027-03-17", faseTurno:"Giornata 27" },
    { inizio:"2027-03-19", fine:"2027-03-24", faseTurno:"Giornata 28" },
    { inizio:"2027-04-02", fine:"2027-04-07", faseTurno:"Giornata 29" },
    { inizio:"2027-04-09", fine:"2027-04-14", faseTurno:"Giornata 30" },
    { inizio:"2027-04-16", fine:"2027-04-21", faseTurno:"Giornata 31" },
    { inizio:"2027-04-23", fine:"2027-04-28", faseTurno:"Giornata 32" },
    { inizio:"2027-04-30", fine:"2027-05-05", faseTurno:"Giornata 33" },
    { inizio:"2027-05-07", fine:"2027-05-12", faseTurno:"Giornata 34" },
    { inizio:"2027-05-14", fine:"2027-05-19", faseTurno:"Giornata 35" },
    { inizio:"2027-05-21", fine:"2027-05-26", faseTurno:"Giornata 36" },
    { inizio:"2027-05-28", fine:"2027-06-02", faseTurno:"Giornata 37" }
  ],

  "ksa.1": [
    { inizio:"2026-08-20", fine:"2026-08-25", faseTurno:"Giornata 1" },
    { inizio:"2026-08-27", fine:"2026-09-01", faseTurno:"Giornata 2" },
    { inizio:"2026-09-10", fine:"2026-09-15", faseTurno:"Giornata 3" },
    { inizio:"2026-09-17", fine:"2026-09-22", faseTurno:"Giornata 4" },
    { inizio:"2026-10-15", fine:"2026-10-20", faseTurno:"Giornata 5" },
    { inizio:"2026-10-22", fine:"2026-10-27", faseTurno:"Giornata 6" },
    { inizio:"2026-10-29", fine:"2026-11-03", faseTurno:"Giornata 7" },
    { inizio:"2026-11-05", fine:"2026-11-10", faseTurno:"Giornata 8" },
    { inizio:"2026-11-19", fine:"2026-11-24", faseTurno:"Giornata 9" },
    { inizio:"2026-11-26", fine:"2026-12-01", faseTurno:"Giornata 10" },
    { inizio:"2026-12-03", fine:"2026-12-08", faseTurno:"Giornata 11" },
    { inizio:"2026-12-10", fine:"2026-12-15", faseTurno:"Giornata 12" },
    { inizio:"2026-12-17", fine:"2026-12-22", faseTurno:"Giornata 13" },
    { inizio:"2026-12-31", fine:"2027-01-05", faseTurno:"Giornata 14" },
    { inizio:"2027-01-07", fine:"2027-01-12", faseTurno:"Giornata 15" },
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
    { inizio:"2027-05-27", fine:"2027-06-01", faseTurno:"Giornata 34" }
  ]
};

function trovaFinestraGiornata(
  competizione,
  dataPartita
) {
  const codice =
    String(competizione || "")
      .trim()
      .toLowerCase();

  const data =
    dataISOItalia(dataPartita);

  if (!data) {
    return null;
  }

  const finestre =
    FINESTRE_GIORNATE[codice];

  if (
    !Array.isArray(finestre) ||
    finestre.length === 0
  ) {
    return null;
  }

  const corrispondenti =
    finestre.filter(
      finestra =>
        data >= finestra.inizio &&
        data <= finestra.fine
    );

  if (corrispondenti.length === 0) {
    return null;
  }

  corrispondenti.sort(
    (a, b) => {
      if (a.inizio !== b.inizio) {
        return (
          a.inizio.localeCompare(
            b.inizio
          ) * -1
        );
      }

      return (
        a.fine.localeCompare(
          b.fine
        )
      );
    }
  );

  return corrispondenti[0];
}

function estraiValore(
  oggetto,
  percorsi
) {
  if (
    !oggetto ||
    !Array.isArray(percorsi)
  ) {
    return null;
  }

  for (const percorso of percorsi) {
    const parti =
      Array.isArray(percorso)
        ? percorso
        : String(percorso).split(".");

    let valore = oggetto;

    for (const parte of parti) {
      if (
        valore === null ||
        valore === undefined
      ) {
        break;
      }

      valore =
        valore[parte];
    }

    if (
      valore !== null &&
      valore !== undefined &&
      valore !== ""
    ) {
      return valore;
    }
  }

  return null;
}

function primoValore(
  ...valori
) {
  for (const valore of valori) {
    if (
      valore !== undefined &&
      valore !== null &&
      valore !== ""
    ) {
      return valore;
    }
  }

  return null;
}

function arrayValido(valore) {
  return Array.isArray(valore)
    ? valore
    : [];
}

function stringaSicura(valore) {
  if (
    valore === undefined ||
    valore === null
  ) {
    return "";
  }

  return String(valore).trim();
}

function numeroSicuro(valore) {
  if (
    valore === undefined ||
    valore === null ||
    valore === ""
  ) {
    return null;
  }

  const numero =
    Number(valore);

  return Number.isFinite(numero)
    ? numero
    : null;
}

function cognomeAtleta(atleta) {
  if (!atleta) {
    return "";
  }

  if (typeof atleta === "string") {
    const testo =
      atleta.trim();

    if (!testo) {
      return "";
    }

    const parti =
      testo.split(/\s+/);

    return parti[parti.length - 1];
  }

  const nomeCompleto =
    primoValore(
      atleta.displayName,
      atleta.fullName,
      atleta.name,
      atleta.shortName,
      atleta.athlete?.displayName,
      atleta.athlete?.fullName,
      atleta.athlete?.name
    );

  const cognome =
    primoValore(
      atleta.lastName,
      atleta.surname,
      atleta.athlete?.lastName,
      atleta.athlete?.surname
    );

  if (cognome) {
    return String(cognome).trim();
  }

  if (nomeCompleto) {
    const parti =
      String(nomeCompleto)
        .trim()
        .split(/\s+/);

    return parti[parti.length - 1];
  }

  return "";
}

function nomeAtletaCompleto(atleta) {
  if (!atleta) {
    return "";
  }

  if (typeof atleta === "string") {
    return atleta.trim();
  }

  return stringaSicura(
    primoValore(
      atleta.displayName,
      atleta.fullName,
      atleta.name,
      atleta.shortName,
      atleta.athlete?.displayName,
      atleta.athlete?.fullName,
      atleta.athlete?.name
    )
  );
}

function getNumeroMaglia(atleta) {
  if (!atleta) {
    return null;
  }

  return primoValore(
    atleta.jersey,
    atleta.number,
    atleta.jerseyNumber,
    atleta.athlete?.jersey,
    atleta.athlete?.number
  );
}

function getRuoloAtleta(atleta) {
  if (!atleta) {
    return "";
  }

  const ruolo =
    primoValore(
      atleta.position?.displayName,
      atleta.position?.name,
      atleta.position?.abbreviation,
      atleta.athlete?.position?.displayName,
      atleta.athlete?.position?.name,
      atleta.athlete?.position?.abbreviation,
      atleta.type?.text,
      atleta.type?.name
    );

  const testo =
    String(ruolo || "")
      .trim()
      .toLowerCase();

  if (
    testo.includes("goalkeeper") ||
    testo.includes("keeper") ||
    testo === "gk" ||
    testo === "por"
  ) {
    return "Portiere";
  }

  if (
    testo.includes("defender") ||
    testo.includes("back") ||
    testo.includes("defence") ||
    testo.includes("defense") ||
    testo === "df" ||
    testo === "d"
  ) {
    return "Difensore";
  }

  if (
    testo.includes("midfielder") ||
    testo.includes("midfield") ||
    testo === "mf" ||
    testo === "m"
  ) {
    return "Centrocampista";
  }

  if (
    testo.includes("forward") ||
    testo.includes("striker") ||
    testo.includes("attacker") ||
    testo.includes("offensive") ||
    testo === "fw" ||
    testo === "f"
  ) {
    return "Attaccante";
  }

  return ruolo || "";
}

function getRuoloESPN(atleta) {
  if (!atleta) {
    return "";
  }

  return stringaSicura(
    primoValore(
      atleta.position?.abbreviation,
      atleta.position?.displayName,
      atleta.position?.name,
      atleta.athlete?.position?.abbreviation,
      atleta.athlete?.position?.displayName,
      atleta.athlete?.position?.name,
      atleta.type?.text,
      atleta.type?.name
    )
  );
}

function getStatoPartita(
  competition,
  header
) {
  const stato =
    primoValore(
      competition?.status?.type?.name,
      competition?.status?.type?.description,
      competition?.status?.type?.detail,
      header?.competitions?.[0]?.status?.type?.name,
      header?.competitions?.[0]?.status?.type?.description,
      header?.competitions?.[0]?.status?.type?.detail
    );

  const testo =
    String(stato || "")
      .trim()
      .toLowerCase();

  if (
    testo.includes("postpon") ||
    testo.includes("delay")
  ) {
    return "Posticipata";
  }

  if (
    testo.includes("cancel") ||
    testo.includes("annull")
  ) {
    return "Annullata";
  }

  if (
    testo.includes("final") ||
    testo.includes("completed") ||
    testo.includes("finished")
  ) {
    return "Finita";
  }

  if (
    testo.includes("in progress") ||
    testo.includes("live") ||
    testo.includes("halftime") ||
    testo.includes("half time")
  ) {
    return "Live";
  }

  return "In programma";
}

function getFaseTurnoESPN(
  data,
  competition
) {
  const valori = [
    competition?.status?.type?.detail,
    competition?.status?.type?.shortDetail,
    competition?.notes?.[0]?.headline,
    competition?.notes?.[0]?.text,
    data?.header?.season?.slug,
    data?.header?.competitions?.[0]?.status?.type?.detail,
    data?.header?.competitions?.[0]?.notes?.[0]?.headline
  ];

  for (const valore of valori) {
    if (!valore) {
      continue;
    }

    const testo =
      String(valore).trim();

    if (!testo) {
      continue;
    }

    const partitaGiornata =
      testo.match(
        /(?:Matchday|Giornata|Round|Week|Gameweek)\s*[-:]?\s*(\d+)/i
      );

    if (partitaGiornata) {
      return (
        "Giornata " +
        partitaGiornata[1]
      );
    }

    if (
      /round of 16/i.test(testo)
    ) {
      return "Ottavi di finale";
    }

    if (
      /quarterfinal/i.test(testo)
    ) {
      return "Quarti di finale";
    }

    if (
      /semifinal/i.test(testo)
    ) {
      return "Semifinale";
    }

    if (
      /final/i.test(testo)
    ) {
      return "Finale";
    }

    if (
      /group stage/i.test(testo)
    ) {
      return "Fase a gironi";
    }

    if (
      /league phase/i.test(testo)
    ) {
      return "Fase campionato";
    }

    if (
      /playoff/i.test(testo)
    ) {
      return "Playoff";
    }
  }

  return "";
}

function getFaseTurno(
  data,
  competition,
  competizione
) {
  const dataPartita =
    competition?.date ||
    data?.header?.date ||
    null;

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

  const espn =
    getFaseTurnoESPN(
      data,
      competition
    );

  if (espn) {
    return {
      valore: espn,
      fonte: "ESPN"
    };
  }

  return {
    valore: "",
    fonte: "NESSUNA"
  };
}

function getSquadreDaCompetition(
  competition
) {
  const competitors =
    arrayValido(
      competition?.competitors
    );

  let casa = null;
  let trasferta = null;

  for (const competitor of competitors) {
    const homeAway =
      String(
        competitor?.homeAway || ""
      ).toLowerCase();

    if (homeAway === "home") {
      casa = competitor;
    }

    if (homeAway === "away") {
      trasferta = competitor;
    }
  }

  if (!casa && competitors[0]) {
    casa = competitors[0];
  }

  if (!trasferta && competitors[1]) {
    trasferta = competitors[1];
  }

  return {
    casa,
    trasferta
  };
}

function getPunteggioCompetitor(
  competitor
) {
  if (!competitor) {
    return null;
  }

  const score =
    primoValore(
      competitor.score,
      competitor.score?.value,
      competitor.linescores
        ? null
        : undefined
    );

  return numeroSicuro(score);
}

function getPunteggi(
  competition
) {
  const squadre =
    getSquadreDaCompetition(
      competition
    );

  return {
    casa:
      getPunteggioCompetitor(
        squadre.casa
      ),
    trasferta:
      getPunteggioCompetitor(
        squadre.trasferta
      )
  };
}

function getRigori(
  competitor
) {
  if (!competitor) {
    return null;
  }

  return numeroSicuro(
    primoValore(
      competitor.shootoutScore,
      competitor.penaltyScore,
      competitor.shootout?.score,
      competitor.penalties?.score
    )
  );
}

function getTipoFine(
  competition,
  data
) {
  const valori = [
    competition?.status?.type?.detail,
    competition?.status?.type?.shortDetail,
    competition?.status?.type?.description,
    data?.header?.competitions?.[0]?.status?.type?.detail
  ];

  const testo =
    valori
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

  if (
    testo.includes("pen")
  ) {
    return "rigori";
  }

  if (
    testo.includes("extra time") ||
    testo.includes("aet") ||
    testo.includes("after extra")
  ) {
    return "supplementari";
  }

  return "tempo regolamentare";
}

function getVincitore(
  competition
) {
  const squadre =
    getSquadreDaCompetition(
      competition
    );

  const competitors = [
    squadre.casa,
    squadre.trasferta
  ];

  for (const squadra of competitors) {
    if (
      squadra?.winner === true
    ) {
      return getNomeSquadra(
        squadra.team
      );
    }
  }

  return "";
}

function getStadio(
  data,
  competition
) {
  return stringaSicura(
    primoValore(
      competition?.venue?.fullName,
      competition?.venue?.address?.city
        ? [
            competition.venue.fullName,
            competition.venue.address.city
          ].filter(Boolean).join(", ")
        : null,
      data?.gameInfo?.venue?.fullName,
      data?.gameInfo?.venue?.name,
      data?.header?.competitions?.[0]?.venue?.fullName
    )
  );
}

function getCittaStadio(
  data,
  competition
) {
  return stringaSicura(
    primoValore(
      competition?.venue?.address?.city,
      data?.gameInfo?.venue?.address?.city,
      data?.header?.competitions?.[0]?.venue?.address?.city
    )
  );
}

function getLogoSquadra(
  team
) {
  if (!team) {
    return "";
  }

  return stringaSicura(
    primoValore(
      team.logo,
      team.logos?.[0]?.href,
      team.team?.logo,
      team.team?.logos?.[0]?.href
    )
  );
}

function getCampionatoDaData(
  data,
  competition,
  competizione
) {
  const configurazione =
    getCompetizione(
      competizione
    );

  return (
    configurazione?.nome ||
    stringaSicura(
      primoValore(
        data?.header?.league?.name,
        competition?.league?.name,
        data?.header?.competitions?.[0]?.league?.name
      )
    )
  );
}

function getPaeseCompetizione(
  competizione
) {
  return (
    getCompetizione(
      competizione
    )?.paese ||
    ""
  );
}

function getCompetizioneDaData(
  data,
  competizione
) {
  const configurazione =
    getCompetizione(
      competizione
    );

  return {
    id: competizione,
    nome:
      configurazione?.nome ||
      stringaSicura(
        data?.header?.league?.name
      ),
    paese:
      configurazione?.paese ||
      ""
  };
}

function estraiCompetizionePrincipale(
  data,
  id
) {
  if (
    data?.header?.competitions?.length
  ) {
    return (
      data.header.competitions.find(
        c =>
          String(
            c?.id || ""
          ) === String(id)
      ) ||
      data.header.competitions[0]
    );
  }

  if (
    data?.competitions?.length
  ) {
    return (
      data.competitions.find(
        c =>
          String(
            c?.id || ""
          ) === String(id)
      ) ||
      data.competitions[0]
    );
  }

  return null;
}

function getEventoDaData(
  data,
  id
) {
  if (!data) {
    return null;
  }

  if (
    data.header &&
    String(
      data.header.id || ""
    ) === String(id)
  ) {
    return data.header;
  }

  if (
    data.event &&
    String(
      data.event.id || ""
    ) === String(id)
  ) {
    return data.event;
  }

  return (
    data.header ||
    data.event ||
    null
  );
}

function estraiArray(
  oggetto,
  percorsi
) {
  for (const percorso of percorsi) {
    const valore =
      estraiValore(
        oggetto,
        [percorso]
      );

    if (
      Array.isArray(valore)
    ) {
      return valore;
    }
  }

  return [];
}

function getPlays(
  data
) {
  return estraiArray(
    data,
    [
      ["plays"],
      ["content", "plays"],
      ["gamepackage", "plays"],
      ["header", "plays"]
    ]
  );
}

function getLeaders(
  data
) {
  return estraiArray(
    data,
    [
      ["leaders"],
      ["leaders", 0],
      ["leaders", "leaders"]
    ]
  );
}

function getStatisticheRaw(
  data
) {
  const possibili = [
    data?.boxscore?.teams,
    data?.boxscore?.statistics,
    data?.statistics,
    data?.content?.statistics,
    data?.gamepackage?.boxscore?.teams,
    data?.header?.competitions?.[0]?.competitors
  ];

  for (const valore of possibili) {
    if (
      Array.isArray(valore)
    ) {
      return valore;
    }
  }

  return [];
}

function getValoreStatistica(
  statistiche,
  nomi
) {
  if (
    !Array.isArray(statistiche)
  ) {
    return null;
  }

  const lista =
    Array.isArray(nomi)
      ? nomi
      : [nomi];

  for (const statistica of statistiche) {
    const nome =
      String(
        primoValore(
          statistica?.name,
          statistica?.displayName,
          statistica?.label,
          statistica?.abbreviation
        ) || ""
      ).toLowerCase();

    for (const cercato of lista) {
      if (
        nome ===
        String(cercato).toLowerCase()
      ) {
        return primoValore(
          statistica?.displayValue,
          statistica?.value,
          statistica?.display
        );
      }
    }
  }

  return null;
}

function traduciStatistica(
  nome
) {
  const testo =
    String(nome || "")
      .trim()
      .toLowerCase();

  const mappa = {
    possession: "Possesso palla",
    "possession %": "Possesso palla",
    shots: "Tiri",
    "shots on target": "Tiri in porta",
    "shots on goal": "Tiri in porta",
    corners: "Calci d'angolo",
    fouls: "Falli",
    offsides: "Fuorigioco",
    saves: "Parate",
    "yellow cards": "Cartellini gialli",
    "red cards": "Cartellini rossi",
    "total passes": "Passaggi",
    "completed passes": "Passaggi completati",
    "passing accuracy": "Precisione passaggi",
    "tackles": "Contrasti",
    "blocked shots": "Tiri bloccati",
    "free kicks": "Punizioni",
    "goal kicks": "Rinvii dal fondo",
    "throw ins": "Rimesse laterali",
    "crosses": "Cross",
    "big chances": "Grandi occasioni"
  };

  return (
    mappa[testo] ||
    String(nome || "")
  );
}

function creaStatistiche(
  data,
  competition
) {
  const statisticheRaw =
    getStatisticheRaw(
      data
    );

  const squadre =
    getSquadreDaCompetition(
      competition
    );

  const risultato = {
    casa: {},
    trasferta: {}
  };

  const competitorRaw =
    Array.isArray(statisticheRaw)
      ? statisticheRaw
      : [];

  for (
    const elemento
    of competitorRaw
  ) {
    const competitor =
      elemento?.team
        ? elemento
        : elemento?.competitor
          ? elemento.competitor
          : elemento;

    const team =
      competitor?.team ||
      competitor;

    const nome =
      getNomeSquadra(team);

    const isCasa =
      (
        String(
          elemento?.homeAway ||
          competitor?.homeAway ||
          ""
        ).toLowerCase()
      ) === "home" ||
      (
        getIdSquadra(team) &&
        getIdSquadra(team) ===
          getIdSquadra(
            squadre.casa?.team
          )
      ) ||
      (
        nome &&
        nome ===
          getNomeSquadra(
            squadre.casa?.team
          )
      );

    const isTrasferta =
      !isCasa;

    const lista =
      arrayValido(
        elemento?.statistics ||
        competitor?.statistics ||
        team?.statistics
      );

    const statistiche = {};

    for (
      const statistica
      of lista
    ) {
      const nomeStat =
        primoValore(
          statistica?.name,
          statistica?.displayName,
          statistica?.label,
          statistica?.abbreviation
        );

      if (!nomeStat) {
        continue;
      }

      statistiche[
        traduciStatistica(
          nomeStat
        )
      ] =
        primoValore(
          statistica?.displayValue,
          statistica?.value,
          statistica?.display
        );
    }

    if (isTrasferta) {
      risultato.trasferta =
        statistiche;
    }
    else {
      risultato.casa =
        statistiche;
    }
  }

  return risultato;
}

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
      Nelle formazioni viene restituito
      esclusivamente il cognome.
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


  const rigoriHome =
    home?.shootoutScore ??
    null;


  const rigoriAway =
    away?.shootoutScore ??
    null;


  const punteggioShootoutPresente =
    rigoriHome !== null &&
    rigoriHome !== undefined &&
    rigoriAway !== null &&
    rigoriAway !== undefined;


  if (
    shootoutEsplicito ||
    punteggioShootoutPresente
  ) {

    risultato.partitaTerminataAiRigori =
      true;


    if (
      rigoriHome !== null &&
      rigoriHome !== undefined
    ) {

      risultato.casa =
        rigoriHome;

    }


    if (
      rigoriAway !== null &&
      rigoriAway !== undefined
    ) {

      risultato.trasferta =
        rigoriAway;

    }

  }


  return risultato;

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

      return ultimoCognome(
        valore
      );

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
   TRADUZIONE TESTO CRONACA
============================================================ */

function traduciTestoCronaca(testo) {

  if (!testo) {
    return null;
  }


  let t =
    String(testo).trim();


  const traduzioni = [

    [
      /^First Half begins\.?$/i,
      "Inizia il primo tempo."
    ],

    [
      /^Second Half begins\s*/i,
      "Inizia il secondo tempo. "
    ],

    [
      /^First Half ends,\s*/i,
      "Fine del primo tempo, "
    ],

    [
      /^Second Half ends,\s*/i,
      "Fine del secondo tempo, "
    ],

    [
      /^Delay in match for a drinks break\.?$/i,
      "Interruzione della partita per una pausa per bere."
    ],

    [
      /^Delay over\. They are ready to continue\.?$/i,
      "Interruzione terminata. Le squadre sono pronte a riprendere."
    ],

    [
      /^Delay in match because of an injury (.+?) \((.+?)\)\.?$/i,
      "Partita interrotta per un infortunio di $1 ($2)."
    ],

    [
      /^Substitution, (.+?)\.\s*(.+?) replaces (.+?)(?: because of an injury)?\.?$/i,
      "Sostituzione, $1. Entra $2, esce $3."
    ]

  ];


  for (
    const [regex, replacement]
    of traduzioni
  ) {

    if (regex.test(t)) {

      t =
        t.replace(
          regex,
          replacement
        );

      break;

    }

  }


  const frasi = [

    [/\bGoal!\b/gi, "Gol!"],

    [/\bGoal\b/gi, "Gol"],

    [/\bSubstitution\b/gi, "Sostituzione"],

    [/\breplaces\b/gi, "entra al posto di"],

    [/\bis shown the yellow card\b/gi, "viene ammonito"],

    [/\bis shown the red card\b/gi, "viene espulso"],

    [/\bis sent off\b/gi, "viene espulso"],

    [/\bDelay in match\b/gi, "Partita interrotta"],

    [/\bDelay over\b/gi, "Interruzione terminata"],

    [
      /\bThey are ready to continue\b/gi,
      "Le squadre sono pronte a riprendere"
    ],

    [
      /\bbecause of an injury\b/gi,
      "a causa di un infortunio"
    ],

    [
      /\bbecause of\b/gi,
      "a causa di"
    ],

    [
      /\bassisted by\b/gi,
      "assistito da"
    ],

    [
      /\bwith a cross\b/gi,
      "con un cross"
    ],

    [
      /\bright footed shot\b/gi,
      "tiro di destro"
    ],

    [
      /\bleft footed shot\b/gi,
      "tiro di sinistro"
    ],

    [
      /\bheader\b/gi,
      "colpo di testa"
    ],

    [
      /\bfrom the right side of the box\b/gi,
      "dal lato destro dell'area"
    ],

    [
      /\bfrom the left side of the box\b/gi,
      "dal lato sinistro dell'area"
    ],

    [
      /\bfrom the centre of the box\b/gi,
      "dal centro dell'area"
    ],

    [
      /\bfrom the center of the box\b/gi,
      "dal centro dell'area"
    ],

    [
      /\bfrom very close range\b/gi,
      "da distanza ravvicinata"
    ],

    [
      /\bto the bottom left corner\b/gi,
      "nell'angolo basso a sinistra"
    ],

    [
      /\bto the bottom right corner\b/gi,
      "nell'angolo basso a destra"
    ],

    [
      /\bto the top left corner\b/gi,
      "nell'angolo alto a sinistra"
    ],

    [
      /\bto the top right corner\b/gi,
      "nell'angolo alto a destra"
    ],

    [
      /\bto the high centre of the goal\b/gi,
      "al centro alto della porta"
    ],

    [
      /\bfor a bad foul\b/gi,
      "per un fallo"
    ],

    [
      /\bfor handball\b/gi,
      "per fallo di mano"
    ],

    [
      /\bFirst Half begins\b/gi,
      "Inizia il primo tempo"
    ],

    [
      /\bSecond Half begins\b/gi,
      "Inizia il secondo tempo"
    ],

    [
      /\bFirst Half ends\b/gi,
      "Fine del primo tempo"
    ],

    [
      /\bSecond Half ends\b/gi,
      "Fine del secondo tempo"
    ],

    [
      /\bFull Time\b/gi,
      "Fine della partita"
    ],

    [
      /\bExtra Time\b/gi,
      "Tempi supplementari"
    ],

    [
      /\bPenalty Shootout\b/gi,
      "Serie di rigori"
    ]

  ];


  for (
    const [regex, replacement]
    of frasi
  ) {

    t =
      t.replace(
        regex,
        replacement
      );

  }


  return t.trim();

}


/* ============================================================
   CRONACA
============================================================ */

function creaCronaca(
  plays
) {

  if (!Array.isArray(plays)) {
    return [];
  }


  return plays.map(
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
          squadraEvento(p),

        testo:
          traduciTestoCronaca(
            p?.text ||
            p?.description ||
            null
          )

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
         CRONACA COMPLETA
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
