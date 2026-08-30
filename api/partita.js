const { espnFetch } = require("../lib/espn");

/*
============================================================
API CALCIO 100%SERIEA&SERIEB
============================================================

Endpoint:

/api/partita?id=ID_PARTITA&competizione=CODICE_ESPN

Esempio:

/api/partita?id=401874746&competizione=ita.1

============================================================
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

  "ita.nazionale": {
    nome: "Nazionale Italiana",
    paese: "Italia"
  },

  "eng.1": {
    nome: "Premier League",
    paese: "Inghilterra"
  },

  "esp.1": {
    nome: "LaLiga",
    paese: "Spagna"
  },

  "ger.1": {
    nome: "Bundesliga",
    paese: "Germania"
  },

  "fra.1": {
    nome: "Ligue 1",
    paese: "Francia"
  },

  "ned.1": {
    nome: "Eredivisie",
    paese: "Paesi Bassi"
  },

  "por.1": {
    nome: "Liga Portugal",
    paese: "Portogallo"
  },

  "ksa.1": {
    nome: "Saudi Pro League",
    paese: "Arabia Saudita"
  }

};


/* ============================================================
   FUNZIONI UTILI
   ============================================================ */


/*
 * Restituisce solamente il cognome.
 */

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


/*
 * Ricava il nome di un giocatore da un evento ESPN.
 */

function nomeGiocatore(p) {

  if (!p) {
    return null;
  }

  const atleta =
    p?.athlete ||
    p?.athletesInvolved?.[0] ||
    p?.participants?.[0]?.athlete ||
    p;

  const nome =
    atleta?.displayName ||
    atleta?.fullName ||
    atleta?.shortName ||
    atleta?.name ||
    "";

  return ultimoCognome(nome);

}


/*
 * Ricava l'assist.
 */

function assistGiocatore(p) {

  if (!p) {
    return null;
  }

  const atleta =
    p?.assistedBy ||
    p?.assist ||
    p?.athletesInvolved?.[1] ||
    p?.participants?.[1]?.athlete;

  if (!atleta) {
    return null;
  }

  const nome =
    atleta?.displayName ||
    atleta?.fullName ||
    atleta?.shortName ||
    atleta?.name ||
    "";

  return ultimoCognome(nome);

}


/*
 * Minuto dell'evento.
 */

function minutoEvento(p) {

  if (!p) {
    return null;
  }

  return (
    p?.clock?.displayValue ||
    p?.clock?.value ||
    p?.time?.displayValue ||
    p?.time?.value ||
    null
  );

}


/*
 * Squadra dell'evento.
 */

function squadraEvento(p) {

  if (!p) {
    return null;
  }

  return (
    p?.team?.displayName ||
    p?.team?.name ||
    p?.team?.shortDisplayName ||
    null
  );

}


/*
 * Tipo dell'evento.
 */

function tipoEvento(p) {

  if (!p) {
    return "";
  }

  return String(
    p?.type?.text ||
    p?.type?.description ||
    p?.type?.name ||
    p?.alternativeType?.text ||
    p?.text ||
    ""
  ).toLowerCase();

}


/* ============================================================
   TRADUZIONE EVENTI
   ============================================================ */

function traduciEvento(tipo) {

  const t =
    String(tipo || "").toLowerCase();


  if (
    t.includes("goal") ||
    t.includes("gol")
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
    t.includes("sostituzione")
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


  return {

    id:
      x?.team?.id ||
      null,

    nome:
      x?.team?.displayName ||
      x?.team?.fullName ||
      x?.team?.name ||
      null,

    abbreviazione:
      x?.team?.abbreviation ||
      x?.team?.shortDisplayName ||
      null,

    logo:
      x?.team?.logo ||
      x?.team?.logos?.[0]?.href ||
      null,

    gol:
      Number(x?.score || 0)

  };

}


/* ============================================================
   MARCATORI
   ============================================================ */

function creaMarcatori(plays) {

  return plays

    .filter(function(p) {

      const tipo =
        tipoEvento(p);

      return (
        p?.scoringPlay === true ||
        tipo.includes("goal") ||
        tipo.includes("gol")
      );

    })

    .map(function(p) {

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
          tipoEvento(p).includes("own") ||
          tipoEvento(p).includes("autogol")

      };

    });

}


/* ============================================================
   CARTELLINI
   ============================================================ */

function creaCartellini(plays) {

  return plays

    .filter(function(p) {

      const tipo =
        tipoEvento(p);

      return (
        tipo.includes("yellow") ||
        tipo.includes("red") ||
        tipo.includes("giallo") ||
        tipo.includes("rosso")
      );

    })

    .map(function(p) {

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
   SOSTITUZIONI
   ============================================================ */

function creaSostituzioni(plays) {

  return plays

    .filter(function(p) {

      const tipo =
        tipoEvento(p);

      return (
        tipo.includes("substitution") ||
        tipo.includes("sostituzione")
      );

    })

    .map(function(p) {

      const entrato =
        p?.substitution?.in ||
        p?.participants?.[0]?.athlete ||
        p?.athletesInvolved?.[0];


      const uscito =
        p?.substitution?.out ||
        p?.participants?.[1]?.athlete ||
        p?.athletesInvolved?.[1];


      return {

        minuto:
          minutoEvento(p),

        entrato:
          ultimoCognome(
            entrato?.displayName ||
            entrato?.fullName ||
            entrato?.shortName ||
            entrato?.name ||
            entrato
          ),

        uscito:
          ultimoCognome(
            uscito?.displayName ||
            uscito?.fullName ||
            uscito?.shortName ||
            uscito?.name ||
            uscito
          ),

        squadra:
          squadraEvento(p)

      };

    });

}


/* ============================================================
   ARBITRI
   ============================================================ */

function creaArbitri(data, competition) {

  const ufficiali =
    competition?.officials ||
    data?.officials ||
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


    /*
     * ARBITRO
     */

    if (
      ruolo.includes("referee") ||
      ruolo.includes("main referee") ||
      ruolo.includes("arbitro")
    ) {

      if (!risultati.arbitro) {
        risultati.arbitro = nome;
      }

      continue;

    }


    /*
     * ASSISTENTE 1
     */

    if (
      ruolo.includes("assistant referee") ||
      ruolo.includes("assistant")
    ) {

      if (!risultati.assistente1) {

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


    /*
     * QUARTO UFFICIALE
     */

    if (
      ruolo.includes("fourth") ||
      ruolo.includes("4th") ||
      ruolo.includes("quarto")
    ) {

      risultati.quartoUfficiale =
        nome;

      continue;

    }


    /*
     * VAR
     */

    if (
      ruolo === "var" ||
      ruolo.includes("video assistant referee") ||
      ruolo.includes("video referee")
    ) {

      risultati.var =
        nome;

      continue;

    }


    /*
     * AVAR
     */

    if (
      ruolo.includes("avar") ||
      ruolo.includes("assistant video assistant")
    ) {

      risultati.avar =
        nome;

      continue;

    }

  }


  /*
   * In alcuni dati ESPN il ruolo può essere
   * disponibile solamente tramite type.
   */

  if (
    !risultati.arbitro &&
    ufficiali.length > 0
  ) {

    const primo =
      ufficiali[0];


    risultati.arbitro =
      primo?.displayName ||
      primo?.fullName ||
      primo?.name ||
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
   STATO
   ============================================================ */

function traduciStato(stato) {

  if (!stato) {
    return "In programma";
  }


  if (
    stato.completata === true
  ) {

    return "Finita";

  }


  const nome =
    String(
      stato.nome || ""
    ).toLowerCase();


  const descrizione =
    String(
      stato.descrizione || ""
    ).toLowerCase();


  const state =
    String(
      stato.stato || ""
    ).toLowerCase();


  /*
   * LIVE
   */

  if (
    state === "in" ||
    state === "live" ||
    nome.includes("progress") ||
    nome.includes("live") ||
    descrizione.includes("live")
  ) {

    return "Live";

  }


  /*
   * FINITA
   */

  if (
    state === "post" ||
    nome.includes("final") ||
    nome.includes("post") ||
    descrizione.includes("final")
  ) {

    return "Finita";

  }


  return "In programma";

}


/* ============================================================
   DATA E ORA ITALIANA
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
   STATISTICHE
   ============================================================ */

function creaStatistiche(data) {

  const risultato = {

    casa: [],
    trasferta: []

  };


  for (
    const team
    of data?.boxscore?.teams || []
  ) {

    const statistiche =
      (
        team?.statistics ||
        []
      ).map(function(x) {

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


    if (
      team?.homeAway === "home"
    ) {

      risultato.casa =
        statistiche;

    }


    if (
      team?.homeAway === "away"
    ) {

      risultato.trasferta =
        statistiche;

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

    "G": "Portiere",
    "GK": "Portiere",

    "CB": "Difensore",
    "CD": "Difensore",
    "CD-L": "Difensore",
    "CD-R": "Difensore",

    "LB": "Difensore",
    "RB": "Difensore",
    "LWB": "Difensore",
    "RWB": "Difensore",

    "DM": "Centrocampista",
    "CM": "Centrocampista",
    "CM-L": "Centrocampista",
    "CM-R": "Centrocampista",

    "LM": "Centrocampista",
    "RM": "Centrocampista",

    "AM": "Centrocampista",
    "CAM": "Centrocampista",

    "LW": "Attaccante",
    "RW": "Attaccante",

    "CF": "Attaccante",
    "CF-L": "Attaccante",
    "CF-R": "Attaccante",

    "ST": "Attaccante",
    "FW": "Attaccante",

    "SUB": "Riserva"

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


  for (
    const r
    of rosters
  ) {

    const formazione = {

      modulo:
        r?.formation ||
        r?.formationUsed ||
        r?.formation?.displayName ||
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


    for (
      const p
      of giocatori
    ) {

      const atleta =
        p?.athlete ||
        p;


      const cognome =
        ultimoCognome(
          atleta?.displayName ||
          atleta?.fullName ||
          atleta?.shortName ||
          atleta?.name ||
          ""
        );


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
        p?.lineupStatus === "starter";


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

      resultadoCasa =
        true;

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

    /*
     * PARAMETRI
     */

    const id =
      req.query.id;


    const competizione =
      req.query.competizione ||
      "ita.1";


    /*
     * CONTROLLO ID
     */

    if (!id) {

      return res.status(400).json({

        success: false,

        errore:
          "Parametro id obbligatorio"

      });

    }


    /*
     * COMPETIZIONE
     */

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
     * CHIAMATA ESPN
     */

    const data =
      await espnFetch(
        "/" +
        competizione +
        "/summary?event=" +
        encodeURIComponent(id)
      );


    /*
     * PARTITA
     */

    const competition =
      data?.header?.competitions?.[0];


    if (!competition) {

      return res.status(404).json({

        success: false,

        errore:
          "Partita non trovata"

      });

    }


    /*
     * SQUADRE
     */

    const teams =
      competition?.competitors ||
      [];


    const home =
      teams.find(function(x) {

        return (
          x?.homeAway === "home"
        );

      });


    const away =
      teams.find(function(x) {

        return (
          x?.homeAway === "away"
        );

      });


    /*
     * EVENTI ESPN
     */

    const plays =
      data?.plays ||
      data?.keyEvents ||
      [];


    /*
     * STATISTICHE
     */

    const statistiche =
      creaStatistiche(data);


    /*
     * FORMAZIONI
     */

    const formazioni =
      creaFormazioni(
        data,
        home,
        away
      );


    /*
     * STADIO
     */

    const venue =
      data?.gameInfo?.venue ||
      competition?.venue ||
      null;


    /*
     * DATA / ORA
     */

    const dataOra =
      convertiDataOraItaliana(
        competition?.date ||
        data?.header?.date ||
        null
      );


    /*
     * ARBITRI
     */

    const arbitri =
      creaArbitri(
        data,
        competition
      );


    /*
     * STATO
     */

    const stato =
      traduciStato(
        competition?.status?.type
      );


    /*
     * RISPOSTA
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
          datiSquadra(home),


        trasferta:
          datiSquadra(away),


        stadio:
          venue?.fullName ||
          venue?.displayName ||
          null,


        nome:
          (
            away?.team?.displayName ||
            ""
          ) +
          " - " +
          (
            home?.team?.displayName ||
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


      /*
       * INFORMAZIONI GENERALI
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
       * EVENTI PRINCIPALI
       */

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


      /*
       * STATISTICHE
       */

      statistiche:
        statistiche,


      /*
       * FORMAZIONI
       */

      formazioni:
        formazioni,


      /*
       * CRONACA COMPLETA
       */

      cronaca:
        plays.map(function(p) {

          return {

            minuto:
              minutoEvento(p),

            tipo:
              traduciEvento(
                p?.type?.text ||
                p?.type?.description ||
                p?.type?.name ||
                ""
              ),

            giocatore:
              nomeGiocatore(p),

            assist:
              assistGiocatore(p),

            squadra:
              squadraEvento(p)

          };

        }),


      /*
       * TUTTI GLI EVENTI
       */

      eventi:
        plays.map(function(p) {

          return {

            id:
              p?.id ||
              null,

            minuto:
              minutoEvento(p),

            tipo:
              traduciEvento(
                p?.type?.text ||
                p?.type?.description ||
                p?.type?.name ||
                ""
              ),

            giocatore:
              nomeGiocatore(p),

            assist:
              assistGiocatore(p),

            squadra:
              squadraEvento(p)

          };

        })

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
