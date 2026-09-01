const { espnFetch } = require("../lib/espn");

const LEAGUE = "ita.1";

/* =========================================================
   FUNZIONI DI SUPPORTO
========================================================= */

function nomeGiocatore(athlete) {
  if (!athlete) return null;

  const nome =
    athlete.displayName ||
    athlete.fullName ||
    athlete.shortName ||
    athlete.name ||
    null;

  if (!nome) return null;

  const parti = String(nome).trim().split(/\s+/);
  return parti[parti.length - 1];
}

function nomeCompletoGiocatore(athlete) {
  if (!athlete) return null;

  return (
    athlete.displayName ||
    athlete.fullName ||
    athlete.shortName ||
    athlete.name ||
    null
  );
}

function testoEvento(item) {
  return String(
    item?.text ||
    item?.type?.text ||
    item?.type?.description ||
    item?.type?.name ||
    item?.description ||
    ""
  ).trim();
}

function tipoEvento(item) {
  return String(
    item?.type?.text ||
    item?.type?.description ||
    item?.type?.name ||
    item?.text ||
    ""
  )
    .trim()
    .toLowerCase();
}

function minutoEvento(item) {
  return (
    item?.clock?.displayValue ||
    item?.clock?.value ||
    item?.period?.displayValue ||
    item?.time?.displayValue ||
    null
  );
}

function squadraEvento(item) {
  return (
    item?.team?.displayName ||
    item?.team?.name ||
    item?.competitor?.team?.displayName ||
    null
  );
}

function atletaCoinvolto(item, indice = 0) {
  if (!item) return null;

  const atleti =
    item.athletesInvolved ||
    item.athletes ||
    item.participants ||
    [];

  if (atleti[indice]) {
    return (
      atleti[indice].athlete ||
      atleti[indice]
    );
  }

  return null;
}

function isGol(item) {
  const type = tipoEvento(item);
  const text = testoEvento(item).toLowerCase();

  return (
    item?.scoringPlay === true ||
    item?.scoring === true ||
    type.includes("goal") ||
    type.includes("gol") ||
    type.includes("own goal") ||
    type.includes("own-goal") ||
    type.includes("autogol") ||
    text.includes("goal") ||
    text.includes("gol") ||
    text.includes("autogol")
  );
}

function isCartellino(item) {
  const type = tipoEvento(item);
  const text = testoEvento(item).toLowerCase();

  return (
    type.includes("yellow") ||
    type.includes("red") ||
    type.includes("giallo") ||
    type.includes("rosso") ||
    text.includes("yellow card") ||
    text.includes("red card") ||
    text.includes("cartellino giallo") ||
    text.includes("cartellino rosso")
  );
}

function isSostituzione(item) {
  const type = tipoEvento(item);
  const text = testoEvento(item).toLowerCase();

  return (
    type.includes("substitution") ||
    type.includes("substitute") ||
    type.includes("sostituzione") ||
    text.includes("substitution") ||
    text.includes("sostituzione")
  );
}

function traduciTipoCartellino(item) {
  const type = (
    tipoEvento(item) +
    " " +
    testoEvento(item)
  ).toLowerCase();

  if (
    type.includes("red") ||
    type.includes("rosso")
  ) {
    return "rosso";
  }

  return "giallo";
}

/* =========================================================
   NORMALIZZAZIONE FORMAZIONI
========================================================= */

function ruoloItaliano(player) {
  const ruolo =
    player?.position?.abbreviation ||
    player?.athlete?.position?.abbreviation ||
    player?.position?.displayName ||
    player?.athlete?.position?.displayName ||
    "";

  const r = String(ruolo).toLowerCase();

  if (
    r.includes("goal") ||
    r === "gk" ||
    r.includes("port")
  ) {
    return "Portiere";
  }

  if (
    r === "d" ||
    r === "df" ||
    r === "cb" ||
    r === "lb" ||
    r === "rb" ||
    r.includes("def")
  ) {
    return "Difensore";
  }

  if (
    r === "m" ||
    r === "mf" ||
    r === "cm" ||
    r === "dm" ||
    r === "am" ||
    r.includes("mid")
    || r.includes("centroc")
  ) {
    return "Centrocampista";
  }

  if (
    r === "f" ||
    r === "fw" ||
    r === "st" ||
    r === "cf" ||
    r.includes("forward") ||
    r.includes("attacc")
  ) {
    return "Attaccante";
  }

  return role || "Riserva";
}

/* =========================================================
   CORE ESPN - PLAY BY PLAY
========================================================= */

async function recuperaPlayByPlay(eventId, competitionId) {
  if (!eventId || !competitionId) {
    return [];
  }

  const url =
    `https://sports.core.api.espn.com/v2/sports/soccer/leagues/${LEAGUE}` +
    `/events/${encodeURIComponent(eventId)}` +
    `/competitions/${encodeURIComponent(competitionId)}` +
    `/plays?limit=300`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Accept-Language": "it-IT,it;q=0.9"
      }
    });

    if (!response.ok) {
      return [];
    }

    const json = await response.json();

    if (Array.isArray(json)) {
      return json;
    }

    if (Array.isArray(json.items)) {
      return json.items;
    }

    if (Array.isArray(json.plays)) {
      return json.plays;
    }

    return [];
  } catch (e) {
    return [];
  }
}

/* =========================================================
   ENDPOINT
========================================================= */

module.exports = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        errore: "Parametro id obbligatorio"
      });
    }

    /* =====================================================
       SUMMARY ESPN
    ===================================================== */

    const data = await espnFetch(
      `/${LEAGUE}/summary?event=${encodeURIComponent(id)}`
    );

    const header = data?.header;
    const comp = header?.competitions?.[0];

    if (!header || !comp) {
      return res.status(404).json({
        success: false,
        errore: "Partita non trovata"
      });
    }

    const teams = comp.competitors || [];

    const home = teams.find(
      x => x.homeAway === "home"
    );

    const away = teams.find(
      x => x.homeAway === "away"
    );

    const stato =
      comp.status ||
      header.status ||
      null;

    /* =====================================================
       SQUADRE
    ===================================================== */

    function teamData(team) {
      return {
        id: team?.team?.id || null,

        nome:
          team?.team?.displayName ||
          team?.team?.name ||
          null,

        abbreviazione:
          team?.team?.abbreviation ||
          null,

        logo:
          team?.team?.logo ||
          team?.team?.logos?.[0]?.href ||
          null,

        gol:
          Number(team?.score || 0)
      };
    }

    /* =====================================================
       PLAY-BY-PLAY
    ===================================================== */

    let plays = [];

    /*
      Prima proviamo ciò che arriva direttamente
      dal summary ESPN.
    */
    if (Array.isArray(data.plays)) {
      plays = data.plays;
    }

    /*
      Se non c'è, recuperiamo il play-by-play
      dal Core API ESPN.
    */
    if (plays.length === 0) {
      plays = await recuperaPlayByPlay(
        header.id || id,
        comp.id
      );
    }

    /*
      Key events come ulteriore fonte.
    */
    const keyEvents = Array.isArray(data.keyEvents)
      ? data.keyEvents
      : [];

    /*
      Uniamo le due fonti senza duplicare
      gli eventi quando hanno lo stesso id.
    */
    const eventiMap = new Map();

    for (const item of plays) {
      if (!item) continue;

      const key =
        item.id ||
        `${minutoEvento(item)}-${testoEvento(item)}`;

      if (!eventiMap.has(key)) {
        eventiMap.set(key, item);
      }
    }

    for (const item of keyEvents) {
      if (!item) continue;

      const key =
        item.id ||
        `${minutoEvento(item)}-${testoEvento(item)}`;

      if (!eventiMap.has(key)) {
        eventiMap.set(key, item);
      }
    }

    const tuttiEventi = Array.from(
      eventiMap.values()
    );

    /* =====================================================
       MARCATORI
    ===================================================== */

    const marcatori = [];

    for (const item of tuttiEventi) {
      if (!isGol(item)) continue;

      const atleta =
        atletaCoinvolto(item, 0);

      const assistente =
        atletaCoinvolto(item, 1);

      const type =
        tipoEvento(item) +
        " " +
        testoEvento(item).toLowerCase();

      marcatori.push({
        minuto: minutoEvento(item),

        giocatore:
          nomeGiocatore(atleta),

        assist:
          nomeGiocatore(assistente),

        squadra:
          squadraEvento(item),

        autorete:
          type.includes("own goal") ||
          type.includes("own-goal") ||
          type.includes("autogol")
      });
    }

    /* =====================================================
       CARTELLINI
    ===================================================== */

    const cartellini = [];

    for (const item of tuttiEventi) {
      if (!isCartellino(item)) continue;

      const atleta =
        atletaCoinvolto(item, 0);

      cartellini.push({
        minuto:
          minutoEvento(item),

        giocatore:
          nomeGiocatore(atleta),

        squadra:
          squadraEvento(item),

        tipo:
          traduciTipoCartellino(item)
      });
    }

    /* =====================================================
       SOSTITUZIONI
    ===================================================== */

    const sostituzioni = [];

    for (const item of tuttiEventi) {
      if (!isSostituzione(item)) continue;

      const entrato =
        atletaCoinvolto(item, 0);

      const uscito =
        atletaCoinvolto(item, 1);

      let entratoNome =
        nomeGiocatore(entrato);

      let uscitoNome =
        nomeGiocatore(uscito);

      /*
        In alcuni eventi ESPN i due giocatori
        possono essere invertiti.
        Controlliamo anche eventuali campi
        specifici dell'evento.
      */

      if (!entratoNome) {
        entratoNome =
          nomeGiocatore(
            item.substitution?.in
          );
      }

      if (!uscitoNome) {
        uscitoNome =
          nomeGiocatore(
            item.substitution?.out
          );
      }

      sostituzioni.push({
        minuto:
          minutoEvento(item),

        entrato:
          entratoNome,

        uscito:
          uscitoNome,

        squadra:
          squadraEvento(item)
      });
    }

    /* =====================================================
       CRONACA
    ===================================================== */

    const cronaca = [];

    for (const item of tuttiEventi) {
      const testo =
        testoEvento(item);

      if (!testo) continue;

      cronaca.push({
        minuto:
          minutoEvento(item),

        tipo:
          tipoEvento(item) || null,

        testo,

        giocatore:
          nomeGiocatore(
            atletaCoinvolto(item, 0)
          ),

        squadra:
          squadraEvento(item)
      });
    }

    /* =====================================================
       EVENTI
    ===================================================== */

    const eventi = tuttiEventi.map(item => ({
      id:
        item?.id || null,

      minuto:
        minutoEvento(item),

      tipo:
        item?.type?.text ||
        item?.type?.description ||
        item?.type?.name ||
        null,

      testo:
        testoEvento(item) || null,

      giocatore:
        nomeGiocatore(
          atletaCoinvolto(item, 0)
        ),

      assist:
        nomeGiocatore(
          atletaCoinvolto(item, 1)
        ),

      squadra:
        squadraEvento(item)
    }));

    /* =====================================================
       STATISTICHE
    ===================================================== */

    const statistiche = {
      casa: [],
      trasferta: [],
      valori: {}
    };

    const statsTeams =
      data.boxscore?.teams || [];

    for (const team of statsTeams) {
      const lista =
        (team.statistics || []).map(stat => ({
          nome:
            stat.name || null,

          label:
            stat.label || null,

          valore:
            stat.displayValue || null
        }));

      if (team.homeAway === "home") {
        statistiche.casa = lista;
      }

      if (team.homeAway === "away") {
        statistiche.trasferta = lista;
      }
    }

    function trovaStat(nome, lato) {
      const lista =
        lato === "casa"
          ? statistiche.casa
          : statistiche.trasferta;

      const stat = lista.find(
        x =>
          x.nome === nome ||
          x.label === nome
      );

      return stat?.valore || null;
    }

    statistiche.valori = {
      possessoCasa:
        trovaStat("possessionPct", "casa"),

      possessoTrasferta:
        trovaStat("possessionPct", "trasferta"),

      tiriCasa:
        trovaStat("totalShots", "casa"),

      tiriTrasferta:
        trovaStat("totalShots", "trasferta"),

      tiriInPortaCasa:
        trovaStat("shotsOnTarget", "casa"),

      tiriInPortaTrasferta:
        trovaStat("shotsOnTarget", "trasferta"),

      calciDangoloCasa:
        trovaStat("wonCorners", "casa"),

      calciDangoloTrasferta:
        trovaStat("wonCorners", "trasferta"),

      passaggiCasa:
        trovaStat("totalPasses", "casa"),

      passaggiTrasferta:
        trovaStat("totalPasses", "trasferta"),

      fuorigiocoCasa:
        trovaStat("offsides", "casa"),

      fuorigiocoTrasferta:
        trovaStat("offsides", "trasferta")
    };

    /* =====================================================
       FORMAZIONI
    ===================================================== */

    const formazioni = {
      casa: null,
      trasferta: null
    };

    const rosters =
      data.rosters ||
      data.lineups ||
      [];

    for (const roster of rosters) {
      const squadraId =
        roster.team?.id;

      const formazione = {
        modulo:
          roster.formation ||
          roster.formationUsed ||
          null,

        allenatore:
          roster.coach?.displayName ||
          roster.coaches?.[0]?.displayName ||
          null,

        titolari: [],

        riserve: []
      };

      const players =
        roster.roster ||
        roster.athletes ||
        [];

      for (const player of players) {
        const athlete =
          player.athlete || player;

        const giocatore = {
          cognome:
            nomeGiocatore(athlete),

          numero:
            player.jersey ||
            athlete?.jersey ||
            null,

          ruolo:
            ruoloItaliano(player),

          titolare:
            player.starter === true ||
            player.lineupStatus === "starter"
        };

        if (giocatore.titolare) {
          formazione.titolari.push(
            giocatore
          );
        } else {
          formazione.riserve.push(
            giocatore
          );
        }
      }

      if (
        squadraId === home?.team?.id
      ) {
        formazioni.casa =
          formazione;
      }

      if (
        squadraId === away?.team?.id
      ) {
        formazioni.trasferta =
          formazione;
      }
    }

    /* =====================================================
       INFO PARTITA
    ===================================================== */

    const info = {
      arbitro:
        comp.officials?.[0]?.displayName ||
        null,

      arbitri:
        (comp.officials || [])
          .map(x => x.displayName)
          .filter(Boolean),

      stadio:
        data.gameInfo?.venue?.fullName ||
        comp.venue?.fullName ||
        null,

      citta:
        data.gameInfo?.venue?.address?.city ||
        comp.venue?.address?.city ||
        null,

      paese:
        data.gameInfo?.venue?.address?.country ||
        comp.venue?.address?.country ||
        null
    };

    /* =====================================================
       DATA E ORA
    ===================================================== */

    const dataPartita =
      comp.date ||
      header.date ||
      null;

    let dataFormattata = null;
    let oraFormattata = null;

    if (dataPartita) {
      const d = new Date(dataPartita);

      if (!isNaN(d.getTime())) {
        dataFormattata =
          d.toLocaleDateString(
            "it-IT",
            {
              timeZone: "Europe/Rome"
            }
          );

        oraFormattata =
          d.toLocaleTimeString(
            "it-IT",
            {
              timeZone: "Europe/Rome",
              hour: "2-digit",
              minute: "2-digit"
            }
          );
      }
    }

    /* =====================================================
       RISPOSTA FINALE
    ===================================================== */

    return res.status(200).json({
      success: true,

      partita: {
        id:
          header.id || id,

        data:
          dataFormattata ||
          dataPartita ||
          null,

        ora:
          oraFormattata ||
          null,

        competizione: {
          id:
            LEAGUE,

          nome:
            "Serie A",

          paese:
            "Italia"
        },

        stato: {
          nome:
            stato?.type?.name ||
            null,

          descrizione:
            stato?.type?.description ||
            null,

          stato:
            stato?.type?.state ||
            null,

          completata:
            stato?.type?.completed ||
            false,

          minuto:
            stato?.displayClock ||
            null
        },

        casa:
          teamData(home),

        trasferta:
          teamData(away),

        stadio:
          data.gameInfo?.venue?.fullName ||
          comp.venue?.fullName ||
          null,

        nome:
          `${away?.team?.displayName || ""} at ${home?.team?.displayName || ""}`,

        link: {
          partita:
            `https://www.espn.com/soccer/match/_/gameId/${id}`,

          statistiche:
            `https://www.espn.com/soccer/matchstats/_/gameId/${id}`
        }
      },

      info,

      marcatori,

      cartellini,

      sostituzioni,

      cronaca,

      eventi,

      statistiche,

      /*
        Manteniamo anche questa proprietà
        per compatibilità con il tuo formato
        già funzionante.
      */
      statistichePartita:
        statistiche,

      formazioni
    });

  } catch (errore) {
    console.error(
      "Errore api/partita.js:",
      errore
    );

    return res.status(500).json({
      success: false,

      errore:
        errore?.message ||
        "Errore interno API"
    });
  }
};
