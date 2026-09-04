const { espnFetch } = require("../lib/espn");

/*
============================================================
API CALCIO 100%SERIEA&SERIEB
============================================================

FONTE DATI:
ESPN

NESSUNA DIPENDENZA ESTERNA.
NESSUN RIFERIMENTO A BASE44.

ENDPOINT:

/api/partita?id=ID&competizione=ita.1

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
ESPN CORE
============================================================ */

async function espnCoreFetch(path) {
  try {
    const response = await fetch(
      "https://sports.core.api.espn.com/v2/sports/soccer" + path,
      {
        method: "GET",

        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json",
          "Accept-Language": "it-IT,it;q=0.9"
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
      errore?.message || errore
    );

    return null;
  }
}


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

  if (
    typeof valore !== "string" &&
    typeof valore !== "number"
  ) {
    return null;
  }

  const testo = String(valore).trim();

  return testo || null;
}


function ultimoCognome(nome) {
  const testo = testoValido(nome);

  if (!testo) {
    return null;
  }

  const parti = testo
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");

  return parti[parti.length - 1];
}


function nomeAtleta(atleta) {
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


function cognomeAtleta(atleta) {
  if (!atleta) {
    return null;
  }

  if (atleta.athlete) {
    atleta = atleta.athlete;
  }

  if (atleta.player) {
    atleta = atleta.player;
  }

  return ultimoCognome(
    nomeAtleta(atleta)
  );
}


/* ============================================================
ESTRAZIONE MINUTO
============================================================ */

function minutoEvento(play) {
  if (!play) {
    return null;
  }

  return (
    testoValido(play.clock?.displayValue) ||
    testoValido(play.clock?.value) ||
    testoValido(play.time?.displayValue) ||
    testoValido(play.time?.value) ||
    testoValido(play.displayClock) ||
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

  return (
    play.team?.displayName ||
    play.team?.name ||
    play.team?.shortDisplayName ||
    play.team?.abbreviation ||
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
    play.text ||
    ""
  ).toLowerCase();
}


/* ============================================================
TRADUZIONE EVENTI
============================================================ */

function traduciEvento(tipo) {
  const t = String(tipo || "").toLowerCase();

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

  if (t.includes("var")) {
    return "VAR";
  }

  return tipo || "";
}


/* ============================================================
SQUADRE
============================================================ */

function datiSquadra(competitor) {
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
    competitor.score !== null &&
    competitor.score !== undefined
  ) {
    if (
      typeof competitor.score === "object"
    ) {
      gol =
        competitor.score.value ??
        competitor.score.displayValue ??
        null;
    } else {
      gol = competitor.score;
    }
  }

  if (
    gol !== null &&
    gol !== undefined &&
    gol !== ""
  ) {
    const numero = Number(gol);

    if (Number.isFinite(numero)) {
      gol = numero;
    }
  }

  return {
    id:
      competitor.team?.id ||
      competitor.id ||
      null,

    nome:
      competitor.team?.displayName ||
      competitor.team?.fullName ||
      competitor.team?.name ||
      null,

    abbreviazione:
      competitor.team?.abbreviation ||
      competitor.team?.shortDisplayName ||
      null,

    logo:
      competitor.team?.logo ||
      competitor.team?.logos?.[0]?.href ||
      null,

    gol: gol
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
    .filter(function (play) {

      const tipo = tipoEvento(play);

      return (
        play?.scoringPlay === true ||
        play?.isScoringPlay === true ||
        tipo.includes("goal") ||
        tipo.includes("gol") ||
        tipo.includes("score")
      );
    })

    .map(function (play) {

      const atleta =
        play?.athlete ||
        play?.player ||
        play?.participants?.[0]?.athlete ||
        play?.participants?.[0]?.player ||
        play?.athletesInvolved?.[0] ||
        null;

      const assist =
        play?.assistedBy ||
        play?.assist ||
        play?.participants?.[1]?.athlete ||
        play?.participants?.[1]?.player ||
        play?.athletesInvolved?.[1] ||
        null;

      return {

        minuto:
          minutoEvento(play),

        giocatore:
          cognomeAtleta(atleta),

        assist:
          cognomeAtleta(assist),

        squadra:
          squadraEvento(play),

        autorete:
          play?.ownGoal === true ||
          play?.ownGoal === "true" ||
          tipoEvento(play).includes("own") ||
          tipoEvento(play).includes("autogol")
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
    .filter(function (play) {

      const tipo =
        tipoEvento(play);

      return (
        tipo.includes("yellow") ||
        tipo.includes("red") ||
        tipo.includes("giallo") ||
        tipo.includes("rosso")
      );
    })

    .map(function (play) {

      const tipo =
        tipoEvento(play);

      const atleta =
        play?.athlete ||
        play?.player ||
        play?.participants?.[0]?.athlete ||
        play?.participants?.[0]?.player ||
        play?.athletesInvolved?.[0] ||
        null;

      return {

        minuto:
          minutoEvento(play),

        giocatore:
          cognomeAtleta(atleta),

        squadra:
          squadraEvento(play),

        tipo:
          tipo.includes("red") ||
          tipo.includes("rosso")
            ? "rosso"
            : "giallo"
      };
    });
}


/* ============================================================
RICERCA GIOCATORI IN UNA STRUTTURA
============================================================ */

function cercaGiocatori(obj) {
  if (!obj) {
    return [];
  }

  const risultati = [];

  function visita(valore, profondita) {

    if (
      valore === null ||
      valore === undefined ||
      profondita > 10
    ) {
      return;
    }

    if (Array.isArray(valore)) {

      for (
        const elemento of valore
      ) {
        visita(
          elemento,
          profondita + 1
        );
      }

      return;
    }

    if (
      typeof valore !== "object"
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

      const nome =
        nomeAtleta(atleta);

      if (nome) {
        risultati.push({
          atleta: atleta,
          sorgente: valore
        });
      }
    }

    for (
      const chiave of Object.keys(valore)
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

function creaSostituzioni(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }

  const risultati = [];

  for (
    const play of plays
  ) {

    const tipo =
      tipoEvento(play);

    const testo =
      String(
        play?.text ||
        play?.description ||
        play?.type?.text ||
        ""
      );

    const testoLower =
      testo.toLowerCase();

    const eSostituzione =
      tipo.includes("substitution") ||
      tipo.includes("substitute") ||
      tipo.includes("sostituzione") ||
      testoLower.includes("substitution") ||
      testoLower.includes("substituted") ||
      testoLower.includes("replaces") ||
      testoLower.includes("replaced") ||
      testoLower.includes("entra") ||
      testoLower.includes("esce");

    if (!eSostituzione) {
      continue;
    }

    let entrato = null;
    let uscito = null;

    /*
    ----------------------------------------------------------
    STRUTTURE ESPLICITE
    ----------------------------------------------------------
    */

    entrato =
      play?.substitution?.in ||
      play?.substitution?.entered ||
      play?.substitution?.playerIn ||
      play?.substitution?.incoming ||
      play?.playerIn ||
      play?.athleteIn ||
      null;

    uscito =
      play?.substitution?.out ||
      play?.substitution?.exited ||
      play?.substitution?.playerOut ||
      play?.substitution?.outgoing ||
      play?.playerOut ||
      play?.athleteOut ||
      null;


    /*
    ----------------------------------------------------------
    PARTECIPANTI
    ----------------------------------------------------------
    */

    if (
      !entrato &&
      !uscito &&
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
            partecipante;
        }

        if (
          ruolo.includes("out") ||
          ruolo.includes("exit") ||
          ruolo.includes("off")
        ) {
          uscito =
            partecipante;
        }
      }

      /*
      Se ESPN non specifica il ruolo,
      nella maggior parte dei play di
      sostituzione il primo e il secondo
      partecipante rappresentano i due giocatori.
      */

      if (
        (!entrato || !uscito) &&
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


    /*
    ----------------------------------------------------------
    ATHLETES INVOLVED
    ----------------------------------------------------------
    */

    if (
      (!entrato || !uscito) &&
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
            atleta;
        }

        if (
          ruolo.includes("out") ||
          ruolo.includes("exit") ||
          ruolo.includes("off")
        ) {
          uscito =
            atleta;
        }
      }

      if (
        (!entrato || !uscito) &&
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


    /*
    ----------------------------------------------------------
    PARSING DEL TESTO ESPN
    ----------------------------------------------------------
    */

    if (
      (!entrato || !uscito) &&
      testo
    ) {

      let match =
        testo.match(
          /^(.+?)\s+(?:for|replaces|replaced by)\s+(.+)$/i
        );

      if (match) {

        /*
        ESPN normalmente presenta:

        ENTRATO for USCITO
        */

        if (!entrato) {
          entrato = {
            displayName:
              match[1].trim()
          };
        }

        if (!uscito) {
          uscito = {
            displayName:
              match[2].trim()
          };
        }
      }


      if (
        !entrato ||
        !uscito
      ) {

        match =
          testo.match(
            /^(.+?)\s+(?:entra per|entra al posto di|al posto di)\s+(.+)$/i
          );

        if (match) {

          if (!entrato) {
            entrato = {
              displayName:
                match[1].trim()
            };
          }

          if (!uscito) {
            uscito = {
              displayName:
                match[2].trim()
            };
          }
        }
      }
    }


    /*
    ----------------------------------------------------------
    ULTIMO FALLBACK: CERCA TUTTI GLI ATLETI
    ----------------------------------------------------------
    */

    if (
      (!entrato || !uscito)
    ) {

      const giocatori =
        cercaGiocatori(play);

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
      cognomeAtleta(entrato);

    const cognomeUscito =
      cognomeAtleta(uscito);


    /*
    Non inseriamo una sostituzione
    se non siamo riusciti a identificare
    almeno uno dei due giocatori.
    */

    if (
      !cognomeEntrato &&
      !cognomeUscito
    ) {
      continue;
    }


    risultati.push({

      minuto:
        minutoEvento(play),

      entra:
        cognomeEntrato,

      esce:
        cognomeUscito,

      entrato:
        cognomeEntrato,

      uscito:
        cognomeUscito,

      squadra:
        squadraEvento(play)
    });
  }

  return risultati;
}


/* ============================================================
DATA E ORA
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

            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          }
        ).format(data),

      ora:
        new Intl.DateTimeFormat(
          "it-IT",
          {
            timeZone:
              "Europe/Rome",

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
STATISTICHE
============================================================ */

function normalizzaStatistica(nome) {

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


function valoreStatistica(stat) {

  if (!stat) {
    return null;
  }

  const candidati = [

    stat.displayValue,

    stat.value,

    stat.displayValueText,

    stat.text

  ];

  for (
    const valore
    of candidati
  ) {

    if (
      valore !== null &&
      valore !== undefined &&
      String(valore).trim() !== ""
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

    const corrisponde =
      campi.some(
        campo =>
          cercati.includes(campo)
      );

    if (corrisponde) {

      const valore =
        valoreStatistica(
          stat
        );

      if (
        valore !== null
      ) {
        return valore;
      }
    }
  }

  return null;
}


/*
============================================================
ESTRAE LE STATISTICHE DALLA SUMMARY
============================================================
*/

function statisticheDaSummary(
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


  /*
  ESPN può utilizzare più strutture.
  */

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
      team?.statistics ||
      team?.stats ||
      [];


    if (
      !Array.isArray(lista)
    ) {
      continue;
    }


    const statistiche =
      lista
        .map(
          function (stat) {

            return {

              nome:
                stat?.name ||
                null,

              label:
                stat?.label ||
                stat?.displayName ||
                null,

              valore:
                valoreStatistica(
                  stat
                )
            };
          }
        )
        .filter(
          stat =>
            stat.valore !== null
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
STATISTICHE CORE DEI DUE COMPETITOR
============================================================ */

async function statisticheDaCore(
  competizione,
  eventId,
  competitionId,
  homeId,
  awayId
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


  const [homeData, awayData] =
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


  function creaTeamStats(data) {

    const lista =
      estraiLista(data);

    return lista
      .map(
        function (stat) {

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
        }
      )
      .filter(
        stat =>
          stat.valore !== null
      );
  }


  const homeStats =
    creaTeamStats(
      homeData
    );

  const awayStats =
    creaTeamStats(
      awayData
    );


  risultato.casa =
    homeStats;

  risultato.trasferta =
    awayStats;


  function valoriTeam(
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
            "tiri"
          ]
        ),

      tiriInPorta:
        trovaStatistica(
          lista,
          [
            "shotsOnTarget",
            "shotsOnGoal",
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


  const homeValori =
    valoriTeam(
      homeStats
    );

  const awayValori =
    valoriTeam(
      awayStats
    );


  risultato.valori = {

    possessoCasa:
      homeValori.possesso,

    possessoTrasferta:
      awayValori.possesso,

    tiriCasa:
      homeValori.tiri,

    tiriTrasferta:
      awayValori.tiri,

    tiriInPortaCasa:
      homeValori.tiriInPorta,

    tiriInPortaTrasferta:
      awayValori.tiriInPorta,

    calciDangoloCasa:
      homeValori.angoli,

    calciDangoloTrasferta:
      awayValori.angoli,

    passaggiCasa:
      homeValori.passaggi,

    passaggiTrasferta:
      awayValori.passaggi,

    fuorigiocoCasa:
      homeValori.fuorigioco,

    fuorigiocoTrasferta:
      awayValori.fuorigioco
  };


  return risultato;
}


/* ============================================================
UNISCE LE STATISTICHE
============================================================ */

function unisciStatistiche(
  summary,
  core
) {

  const risultato = {

    casa:
      summary.casa?.length
        ? summary.casa
        : core.casa,

    trasferta:
      summary.trasferta?.length
        ? summary.trasferta
        : core.trasferta,

    valori: {}
  };


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

    const valoreSummary =
      summary.valori?.[campo];

    const valoreCore =
      core.valori?.[campo];


    if (
      valoreSummary !== null &&
      valoreSummary !== undefined &&
      String(
        valoreSummary
      ).trim() !== ""
    ) {

      risultato.valori[campo] =
        valoreSummary;

    } else {

      risultato.valori[campo] =
        valoreCore ??
        null;
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
      null;


    const formazione = {

      modulo:
        roster?.formation?.displayName ||
        roster?.formation?.name ||
        roster?.formation ||
        roster?.formationUsed ||
        null,

      allenatore:
        roster?.coach?.displayName ||
        roster?.coaches?.[0]?.displayName ||
        null,

      titolari: [],

      riserve: []
    };


    const giocatori =
      roster?.roster ||
      roster?.athletes ||
      [];


    if (
      !Array.isArray(
        giocatori
      )
    ) {
      continue;
    }


    for (
      const giocatore
      of giocatori
    ) {

      const atleta =
        giocatore?.athlete ||
        giocatore;


      const nome =
        nomeAtleta(
          atleta
        );


      const cognome =
        ultimoCognome(
          nome
        );


      if (!cognome) {
        continue;
      }


      const ruolo =
        giocatore?.position?.abbreviation ||
        atleta?.position?.abbreviation ||
        giocatore?.position?.displayName ||
        atleta?.position?.displayName ||
        null;


      const titolare =
        giocatore?.starter === true ||
        giocatore?.lineupStatus === "starter" ||
        giocatore?.status === "starter";


      const elemento = {

        cognome:
          cognome,

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
          titolare
      };


      if (titolare) {

        formazione.titolari.push(
          elemento
        );

      } else {

        formazione.riserve.push(
          elemento
        );
      }
    }


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
ARBITRI
============================================================ */

function creaArbitri(
  data,
  competition
) {

  const ufficiali =
    competition?.officials ||
    data?.officials ||
    data?.gameInfo?.officials ||
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
      (
        ruolo.includes("referee") ||
        ruolo.includes("arbitro")
      ) &&
      !ruolo.includes("assistant") &&
      !ruolo.includes("assistente")
    ) {

      if (
        !risultati.arbitro
      ) {

        risultati.arbitro =
          nome;
      }

      continue;
    }


    if (
      ruolo.includes("assistant")
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
      ruolo.includes(
        "video assistant referee"
      ) ||
      ruolo.includes(
        "video referee"
      )
    ) {

      risultati.var =
        nome;

      continue;
    }


    if (
      ruolo.includes("avar")
    ) {

      risultati.avar =
        nome;
    }
  }


  /*
  Fallback: se ESPN non indica
  il ruolo, prendiamo il primo
  come arbitro.
  */

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


  return parti.join(", ");
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


  const state =
    String(
      stato.state || ""
    ).toLowerCase();


  const name =
    String(
      stato.name || ""
    ).toLowerCase();


  const description =
    String(
      stato.description || ""
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
FASE / TURNO
============================================================ */

/*
ESPN Core spesso restituisce dei $ref.

Esempio:

week:
{
  "$ref": "https://sports.core.api..."
}

Questa funzione segue i riferimenti
ESPN per trovare i dati della fase.
*/

async function seguiRefEspn(
  obj,
  profondita = 0
) {

  if (
    !obj ||
    profondita > 4
  ) {
    return null;
  }


  if (
    typeof obj === "string"
  ) {

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

    } catch (
      errore
    ) {

      return null;
    }
  }


  return null;
}


/*
------------------------------------------------------------
CERCA UN NOME DI FASE
------------------------------------------------------------
*/

function trovaFaseNelJson(
  obj
) {

  const valori = [];


  function aggiungi(
    valore
  ) {

    const testo =
      testoValido(
        valore
      );

    if (
      !testo
    ) {
      return;
    }


    if (
      !valori.includes(
        testo
      )
    ) {

      valori.push(
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
      profondita > 12
    ) {
      return;
    }


    if (
      Array.isArray(
        valore
      )
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
      typeof valore !==
      "object"
    ) {
      return;
    }


    /*
    ----------------------------------------------------------
    CAMPI DIRETTI
    ----------------------------------------------------------
    */

    const campi =
      [
        "round",
        "phase",
        "stage",
        "roundName",
        "phaseName",
        "stageName",
        "matchday",
        "matchDay"
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
          dato.shortName
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


    /*
    ----------------------------------------------------------
    WEEK
    ----------------------------------------------------------
    */

    const week =
      valore.week;


    if (
      week &&
      typeof week ===
      "object"
    ) {

      aggiungi(
        week.displayName
      );

      aggiungi(
        week.name
      );

      aggiungi(
        week.label
      );

      aggiungi(
        week.description
      );

      aggiungi(
        week.text
      );

      if (
        week.number !==
        undefined &&
        week.number !==
        null
      ) {

        aggiungi(
          "Giornata " +
          week.number
        );
      }
    }


    /*
    ----------------------------------------------------------
    CERCA TESTI CHE SEMBRANO FASI
    ----------------------------------------------------------
    */

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

        const testo =
          dato.trim();


        const basso =
          testo.toLowerCase();


        const sembraFase =
          basso.includes(
            "round of"
          ) ||
          basso.includes(
            "round "
          ) ||
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
            "finale"
          ) ||
          basso.includes(
            "ottavi"
          ) ||
          basso.includes(
            "quarti"
          ) ||
          basso.includes(
            "semifinali"
          ) ||
          basso.includes(
            "turno"
          ) ||
          basso.includes(
            "giornata"
          );


        if (
          sembraFase
        ) {

          aggiungi(
            testo
          );
        }
      }
    }


    /*
    ----------------------------------------------------------
    RICORSIONE
    ----------------------------------------------------------
    */

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


  /*
  Elimina valori generici.
  */

  const esclusi = [

    "regular season",
    "regular-season",
    "season",
    "week",
    "matchday",
    "round",
    "phase",
    "stage"
  ];


  for (
    const valore
    of valori
  ) {

    const basso =
      valore
        .toLowerCase()
        .trim();


    if (
      !esclusi.includes(
        basso
      )
    ) {

      return valore;
    }
  }


  return null;
}


/*
------------------------------------------------------------
FASE DA ESPN CORE
------------------------------------------------------------
*/

async function getFaseTurnoESPN(
  data,
  competition,
  competizione,
  eventId
) {

  /*
  ----------------------------------------------------------
  1. PROVA DIRETTAMENTE NELLA SUMMARY
  ----------------------------------------------------------
  */

  let fase =
    trovaFaseNelJson(
      competition
    );


  if (
    !fase
  ) {

    fase =
      trovaFaseNelJson(
        data?.header
      );
  }


  if (
    fase
  ) {

    return fase;
  }


  /*
  ----------------------------------------------------------
  2. COMPETITION CORE
  ----------------------------------------------------------
  */

  const competitionId =
    competition?.id ||
    data?.header?.competitions?.[0]?.id ||
    eventId;


  const coreCompetition =
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


  if (
    coreCompetition
  ) {

    fase =
      trovaFaseNelJson(
        coreCompetition
      );


    if (
      fase
    ) {

      return fase;
    }
  }


  /*
  ----------------------------------------------------------
  3. EVENT CORE
  ----------------------------------------------------------
  */

  const coreEvent =
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
      trovaFaseNelJson(
        coreEvent
      );


    if (
      fase
    ) {

      return fase;
    }


    /*
    --------------------------------------------------------
    4. SE CI SONO $REF, LI SEGUE
    --------------------------------------------------------
    */

    const refs = [];


    function raccogliRefs(
      obj,
      profondita
    ) {

      if (
        !obj ||
        profondita > 5
      ) {
        return;
      }


      if (
        Array.isArray(
          obj
        )
      ) {

        obj.forEach(
          elemento =>
            raccogliRefs(
              elemento,
              profondita + 1
            )
        );

        return;
      }


      if (
        typeof obj !==
        "object"
      ) {
        return;
      }


      if (
        typeof obj.$ref ===
        "string"
      ) {

        if (
          obj.$ref.includes(
            "sports.core.api.espn.com"
          )
        ) {

          if (
            !refs.includes(
              obj.$ref
            )
          ) {

            refs.push(
              obj.$ref
            );
          }
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
          typeof valore ===
          "object"
        ) {

          raccogliRefs(
            valore,
            profondita + 1
          );
        }
      }
    }


    raccogliRefs(
      coreEvent,
      0
    );


    /*
    Diamo priorità ai riferimenti
    che riguardano week / stage /
    round / tournament.
    */

    refs.sort(
      function (a, b) {

        const aa =
          a.toLowerCase();

        const bb =
          b.toLowerCase();


        function punteggio(
          testo
        ) {

          let p = 0;

          if (
            testo.includes(
              "/weeks/"
            )
          ) {
            p += 5;
          }

          if (
            testo.includes(
              "/stages/"
            )
          ) {
            p += 5;
          }

          if (
            testo.includes(
              "/round"
            )
          ) {
            p += 5;
          }

          if (
            testo.includes(
              "/tournaments/"
            )
          ) {
            p += 4;
          }

          if (
            testo.includes(
              "/season"
            )
          ) {
            p += 1;
          }

          return p;
        }


        return (
          punteggio(bb) -
          punteggio(aa)
        );
      }
    );


    for (
      const ref
      of refs.slice(0, 8)
    ) {

      const dato =
        await seguiRefEspn(
          ref
        );


      if (
        !dato
      ) {
        continue;
      }


      fase =
        trovaFaseNelJson(
          dato
        );


      if (
        fase
      ) {

        return fase;
      }
    }
  }


  /*
  ----------------------------------------------------------
  5. ULTIMO FALLBACK: GIORNATA ESPN
  ----------------------------------------------------------
  */

  const numeroGiornata =
    competition?.week?.number ??
    coreCompetition?.week?.number ??
    coreEvent?.week?.number ??
    null;


  if (
    numeroGiornata !==
    null &&
    numeroGiornata !==
    undefined
  ) {

    return (
      "Giornata " +
      numeroGiornata
    );
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

      "/plays?limit=300&showsubplays=true"
    );


  if (
    !data
  ) {
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
ENDPOINT PRINCIPALE
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


    if (
      !id
    ) {

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


    /*
    ==========================================================
    SUMMARY ESPN
    ==========================================================
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


    if (
      !competition
    ) {

      return res.status(404).json({

        success: false,

        errore:
          "Partita non trovata"
      });
    }


    /*
    ==========================================================
    SQUADRE
    ==========================================================
    */

    const teams =
      competition?.competitors ||
      [];


    const home =
      teams.find(
        function (team) {

          return (
            team?.homeAway ===
            "home"
          );
        }
      );


    const away =
      teams.find(
        function (team) {

          return (
            team?.homeAway ===
            "away"
          );
        }
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
    ==========================================================
    PLAY SUMMARY
    ==========================================================
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


    /*
    ==========================================================
    ID COMPETIZIONE
    ==========================================================
    */

    const competitionId =
      competition?.id ||
      data?.header?.competitions?.[0]?.id ||
      id;


    /*
    ==========================================================
    PLAY CORE
    ==========================================================
    */

    const playsCore =
      await getPlaysCore(
        competizione,
        id,
        competitionId
      );


    /*
    Se Core contiene più eventi,
    lo usiamo come fonte aggiuntiva.
    */

    if (
      playsCore.length >
      plays.length
    ) {

      plays =
        playsCore;
    }


    /*
    ==========================================================
    STATISTICHE
    ==========================================================
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

        home?.id,

        away?.id
      );


    const statistiche =
      unisciStatistiche(

        statisticheSummary,

        statisticheCore
      );


    /*
    ==========================================================
    FORMAZIONI
    ==========================================================
    */

    const formazioni =
      creaFormazioni(
        data,
        home,
        away
      );


    /*
    ==========================================================
    STADIO
    ==========================================================
    */

    const venue =
      data?.gameInfo?.venue ||
      competition?.venue ||
      null;


    /*
    ==========================================================
    DATA E ORA
    ==========================================================
    */

    const dataOra =
      convertiDataOraItaliana(

        competition?.date ||
        data?.header?.date ||
        null
      );


    /*
    ==========================================================
    ARBITRI
    ==========================================================
    */

    const arbitri =
      creaArbitri(
        data,
        competition
      );


    /*
    ==========================================================
    STATO
    ==========================================================
    */

    const stato =
      traduciStato(
        competition?.status?.type
      );


    /*
    ==========================================================
    FASE / TURNO
    ==========================================================
    */

    const faseTurno =
      await getFaseTurnoESPN(

        data,

        competition,

        competizione,

        id
      );


    /*
    ==========================================================
    MARCATORI
    ==========================================================
    */

    const marcatori =
      creaMarcatori(
        plays
      );


    /*
    ==========================================================
    CARTELLINI
    ==========================================================
    */

    const cartellini =
      creaCartellini(
        plays
      );


    /*
    ==========================================================
    SOSTITUZIONI
    ==========================================================
    */

    const sostituzioni =
      creaSostituzioni(
        plays
      );


    /*
    ==========================================================
    CRONACA
    ==========================================================
    */

    const cronaca =
      plays.map(
        function (play) {

          return {

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
                play?.athlete ||
                play?.player ||
                play?.participants?.[0]?.athlete ||
                play?.participants?.[0]?.player
              ),

            assist:
              cognomeAtleta(
                play?.assistedBy ||
                play?.assist ||
                play?.participants?.[1]?.athlete ||
                play?.participants?.[1]?.player
              ),

            squadra:
              squadraEvento(
                play
              ),

            testo:
              play?.text ||
              play?.description ||
              null
          };
        }
      );


    /*
    ==========================================================
    EVENTI
    ==========================================================
    */

    const eventi =
      plays.map(
        function (play) {

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
                play?.athlete ||
                play?.player ||
                play?.participants?.[0]?.athlete ||
                play?.participants?.[0]?.player
              ),

            squadra:
              squadraEvento(
                play
              ),

            testo:
              play?.text ||
              play?.description ||
              null
          };
        }
      );


    /*
    ==========================================================
    RISPOSTA
    ==========================================================
    */

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
        FASE/TURNO PRESA DA ESPN
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
      ========================================================
      INFO
      ========================================================
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
          venue?.address?.city ||
          null,

        paese:
          venue?.address?.country ||
          null
      },


      /*
      ========================================================
      MARCATORI
      ========================================================
      */

      marcatori:
        marcatori,


      /*
      ========================================================
      CARTELLINI
      ========================================================
      */

      cartellini:
        cartellini,


      /*
      ========================================================
      SOSTITUZIONI
      ========================================================
      */

      sostituzioni:
        sostituzioni,


      /*
      ========================================================
      STATISTICHE
      ========================================================
      */

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


      /*
      ========================================================
      FORMAZIONI
      ========================================================
      */

      formazioni:
        formazioni,


      /*
      ========================================================
      CRONACA
      ========================================================
      */

      cronaca:
        cronaca,


      /*
      ========================================================
      EVENTI
      ========================================================
      */

      eventi:
        eventi
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
