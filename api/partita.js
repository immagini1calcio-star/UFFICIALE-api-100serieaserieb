const { espnFetch } = require("../lib/espn");

/*
============================================================
API CALCIO 100%SERIEA&SERIEB
============================================================

Endpoint:

/api/partita?id=ID_PARTITA&competizione=CODICE_ESPN

Esempio:

/api/partita?id=401874945&competizione=ita.1

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

  "ita.nazionale": {
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
   FUNZIONI GENERALI
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


/* ============================================================
   DESCRIZIONE EVENTO
   ============================================================ */

function descrizioneEvento(p) {
  if (!p) {
    return "";
  }

  return (
    p.text ||
    p.description ||
    p.type?.text ||
    p.type?.description ||
    p.type?.name ||
    ""
  );
}


/* ============================================================
   TRADUZIONE TIPO EVENTO
   ============================================================ */

function traduciEvento(tipo) {
  const t = String(tipo || "").toLowerCase();

  if (
    t.includes("start delay") ||
    t.includes("start_delay")
  ) {
    return "Gioco Interrotto";
  }

  if (
    t.includes("end delay") ||
    t.includes("end_delay")
  ) {
    return "Gioco Ripreso";
  }

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
    t.includes("intermission") ||
    t.includes("halftime")
  ) {
    return "Intervallo";
  }

  if (
    t.includes("kickoff") ||
    t.includes("kick off")
  ) {
    return "Calcio d'inizio";
  }

  if (
    t.includes("full time") ||
    t.includes("end regular time")
  ) {
    return "Fine partita";
  }

  return tipo || "";
}


/* ============================================================
   TRADUZIONE AUTOMATICA IN ITALIANO
   ============================================================ */

const CACHE_TRADUZIONI = new Map();

async function traduciItaliano(testo) {
  if (!testo) {
    return "";
  }

  const originale = String(testo).trim();

  if (!originale) {
    return "";
  }

  if (CACHE_TRADUZIONI.has(originale)) {
    return CACHE_TRADUZIONI.get(originale);
  }

  try {
    const url =
      "https://translate.googleapis.com/translate_a/single" +
      "?client=gtx" +
      "&sl=auto" +
      "&tl=it" +
      "&dt=t" +
      "&q=" +
      encodeURIComponent(originale);

    const risposta = await fetch(url);

    if (!risposta.ok) {
      return originale;
    }

    const dati = await risposta.json();

    let traduzione = "";

    if (Array.isArray(dati?.[0])) {
      traduzione = dati[0]
        .map(function (parte) {
          return parte?.[0] || "";
        })
        .join("");
    }

    if (!traduzione) {
      traduzione = originale;
    }

    CACHE_TRADUZIONI.set(
      originale,
      traduzione
    );

    return traduzione;

  } catch (errore) {
    console.error(
      "Errore traduzione:",
      errore?.message || errore
    );

    return originale;
  }
}


/* ============================================================
   CRONACA COMPLETA
   ============================================================ */

async function creaCronacaCompleta(plays) {
  if (!Array.isArray(plays)) {
    return [];
  }

  const risultati = [];

  for (const p of plays) {

    const tipoOriginale =
      tipoEvento(p);

    const descrizioneOriginale =
      descrizioneEvento(p);

    let tipo =
      traduciEvento(
        tipoOriginale
      );

    /*
     * Gestione esplicita delle interruzioni
     */

    const testoMinuscolo =
      (
        String(tipoOriginale) +
        " " +
        String(descrizioneOriginale)
      ).toLowerCase();

    if (
      testoMinuscolo.includes("start delay")
    ) {
      tipo = "Gioco Interrotto";
    }

    if (
      testoMinuscolo.includes("end delay")
    ) {
      tipo = "Gioco Ripreso";
    }

    /*
     * Traduzione automatica della descrizione
     */

    let descrizioneItaliana = "";

    if (descrizioneOriginale) {
      descrizioneItaliana =
        await traduciItaliano(
          descrizioneOriginale
        );
    }

    risultati.push({
      id:
        p?.id ||
        null,

      minuto:
        minutoEvento(p),

      tipo:
        tipo,

      descrizione:
        descrizioneItaliana,

      descrizioneOriginale:
        descrizioneOriginale || "",

      giocatore:
        nomeGiocatore(p),

      assist:
        assistGiocatore(p),

      squadra:
        squadraEvento(p)
    });
  }

  return risultati;
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

  let gol = 0;

  if (
    typeof x.score === "object" &&
    x.score !== null
  ) {
    gol =
      x.score.value ??
      x.score.displayValue ??
      0;
  } else {
    gol =
      x.score ?? 0;
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


/* ============================================================
   MARCATORI
   ============================================================ */

function creaMarcatori(plays) {
  if (!Array.isArray(plays)) {
    return [];
  }

  return plays
    .filter(function (p) {

      const tipo =
        tipoEvento(p);

      return (
        p?.scoringPlay === true ||
        p?.isScoringPlay === true ||
        tipo.includes("goal") ||
        tipo.includes("gol") ||
        tipo.includes("score")
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
          p?.ownGoal === "true" ||
          tipoEvento(p).includes("own") ||
          tipoEvento(p).includes("autogol")
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

      const tipo =
        tipoEvento(p);

      return (
        tipo.includes("yellow") ||
        tipo.includes("red") ||
        tipo.includes("giallo") ||
        tipo.includes("rosso")
      );
    })
    .map(function (p) {

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
    });
}


/* ============================================================
   ESTRAZIONE ATLETA
   ============================================================ */

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


/* ============================================================
   SOSTITUZIONI
   ============================================================ */

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
      (!entrato || !uscito) &&
      Array.isArray(p?.athletesInvolved)
    ) {

      const lista =
        p.athletesInvolved;

      for (const atleta of lista) {

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
        cognomeAtleta(entrato),

      uscito:
        cognomeAtleta(uscito),

      squadra:
        squadraEvento(p)
    });
  }

  return risultati;
}


/* ============================================================
   ARBITRI
   ============================================================ */

function creaArbitri(data, competition) {

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

  for (const ufficiale of ufficiali) {

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
        risultati.arbitro =
          nome;
      }

      continue;
    }

    if (
      ruolo.includes("arbitro") &&
      !ruolo.includes("assistente")
    ) {

      if (!risultati.arbitro) {
        risultati.arbitro =
          nome;
      }

      continue;
    }

    if (
      ruolo.includes("assistant referee") ||
      ruolo === "assistant" ||
      ruolo.includes("assistant")
    ) {

      if (!risultati.assistente1) {
        risultati.assistente1 =
          nome;
      } else if (!risultati.assistente2) {
        risultati.assistente2 =
          nome;
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


/* ============================================================
   STATO PARTITA
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

  } catch (errore) {

    return {
      data: "",
      ora: ""
    };
  }
}


/* ============================================================
   NORMALIZZAZIONE STATISTICHE
   ============================================================ */

function normalizzaNomeStatistica(nome) {

  if (!nome) {
    return "";
  }

  return String(nome)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_\-/.%]+/g, "")
    .replace(/[^\w]/g, "");
}


/* ============================================================
   CERCA STATISTICA
   ============================================================ */

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

  for (const stat of lista) {

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

  for (const team of teams) {

    const lista =
      Array.isArray(team?.statistics)
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
    String(ruolo).toUpperCase();

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

  for (const r of rosters) {

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

    for (const p of giocatori) {

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

      const jogador = {

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
          jogador
        );

      } else {

        formazione.riserve.push(
          jogador
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
      teams.find(function (x) {

        return x?.homeAway ===
          "home";

      });

    const away =
      teams.find(function (x) {

        return x?.homeAway ===
          "away";

      });

    /*
     * IMPORTANTE:
     * PRENDE TUTTA LA CRONACA ESPN.
     * NON usa keyEvents come sostituto
     * dei plays.
     */

    const plays =
      Array.isArray(data?.plays)
        ? data.plays
        : [];

    const statistiche =
      creaStatistiche(data);

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

    const homeTeam =
      datiSquadra(home);

    const awayTeam =
      datiSquadra(away);

    /*
     * CRONACA COMPLETA + TRADUZIONE
     */

    const cronaca =
      await creaCronacaCompleta(
        plays
      );

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
        creaMarcatori(plays),

      cartellini:
        creaCartellini(plays),

      sostituzioni:
        creaSostituzioni(plays),

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

      formazioni:
        formazioni,

      /*
       * CRONACA COMPLETA
       */

      cronaca:
        cronaca,

      /*
       * EVENTI COMPLETI
       */

      eventi:
        cronaca

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



Questo è l'ultimo api partita che funzionava bene
