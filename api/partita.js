const { espnFetch } = require("../lib/espn");

module.exports = async (req, res) => {
  try {
    const id = req.query.id;
    const competizioneQuery =
      req.query.competizione ||
      req.query.league ||
      req.query.leagueId ||
      "ita.1";

    if (!id) {
      return res.status(400).json({
        success: false,
        errore: "Parametro id obbligatorio"
      });
    }

    /*
     * ============================================================
     * COMPETIZIONI ESPN SUPPORTATE
     * ============================================================
     */

    const competizioni = {
      "ita.1": "Serie A",
      "ita.2": "Serie B",
      "ita.coppa_italia": "Coppa Italia",
      "ita.nazionale": "Nazionale Italiana",

      "eng.1": "Premier League",
      "esp.1": "LaLiga",
      "ger.1": "Bundesliga",
      "fra.1": "Ligue 1",
      "ned.1": "Eredivisie",
      "por.1": "Liga Portugal",
      "sau.1": "Saudi Pro League",

      "uefa.champions": "Champions League",
      "uefa.europa": "Europa League",
      "uefa.europa.conf": "Conference League"
    };

    const nomeCompetizione =
      competizioni[competizioneQuery] || competizioneQuery;

    /*
     * ============================================================
     * RECUPERO DATI ESPN
     * ============================================================
     */

    const d = await espnFetch(
      `/${encodeURIComponent(competizioneQuery)}/summary?event=${encodeURIComponent(id)}`
    );

    const c = d.header?.competitions?.[0];

    if (!c) {
      return res.status(404).json({
        success: false,
        errore: "Partita non trovata"
      });
    }

    const teams = c.competitors || [];

    const home = teams.find(
      x => x.homeAway === "home"
    );

    const away = teams.find(
      x => x.homeAway === "away"
    );

    /*
     * ============================================================
     * FUNZIONI UTILI
     * ============================================================
     */

    const cognome = value => {
      if (!value) return null;

      const nome =
        value.displayName ||
        value.fullName ||
        value.name ||
        value.shortName ||
        "";

      const parti = nome.trim().split(/\s+/);

      return parti.length
        ? parti[parti.length - 1]
        : null;
    };

    const nomeGiocatore = value => {
      if (!value) return null;

      return cognome(value);
    };

    const getTeamName = team =>
      team?.team?.displayName ||
      team?.team?.fullName ||
      team?.team?.name ||
      null;

    const getTeamId = team =>
      team?.team?.id || null;

    const getLogo = team =>
      team?.team?.logo ||
      team?.team?.logos?.[0]?.href ||
      null;

    const getScore = team => {
      const score = Number(team?.score);

      return Number.isFinite(score)
        ? score
        : 0;
    };

    const team = x => ({
      id: getTeamId(x),
      nome: getTeamName(x),
      abbreviazione: x?.team?.abbreviation || null,
      logo: getLogo(x),
      gol: getScore(x)
    });

    /*
     * ============================================================
     * EVENTI ESPN
     * ============================================================
     */

    const plays =
      d.plays ||
      d.keyEvents ||
      [];

    const getPlayerFromPlay = p => {
      return (
        p?.athlete ||
        p?.athletesInvolved?.[0] ||
        p?.participants?.[0]?.athlete ||
        null
      );
    };

    const getAssistFromPlay = p => {
      return (
        p?.assistedBy ||
        p?.assist ||
        p?.athletesInvolved?.[1] ||
        p?.participants?.[1]?.athlete ||
        null
      );
    };

    const getMinute = p => {
      return (
        p?.clock?.displayValue ||
        p?.time?.displayValue ||
        p?.clock?.value ||
        p?.time?.value ||
        null
      );
    };

    const getSquadra = p => {
      return (
        p?.team?.displayName ||
        p?.team?.fullName ||
        p?.team?.name ||
        null
      );
    };

    const getTipo = p => {
      return String(
        p?.type?.text ||
        p?.type?.description ||
        p?.type?.name ||
        p?.alternativeType?.text ||
        p?.text ||
        ""
      ).toLowerCase();
    };

    /*
     * ============================================================
     * MARCATORI
     * ============================================================
     */

    const marcatori = plays
      .filter(p => {
        const tipo = getTipo(p);

        return (
          p?.scoringPlay === true ||
          tipo.includes("goal") ||
          tipo.includes("gol")
        );
      })
      .map(p => ({
        minuto: getMinute(p),
        giocatore: nomeGiocatore(
          getPlayerFromPlay(p)
        ),
        assist: nomeGiocatore(
          getAssistFromPlay(p)
        ),
        squadra: getSquadra(p),
        autorete:
          p?.ownGoal === true ||
          p?.ownGoal === "true" ||
          getTipo(p).includes("own goal") ||
          getTipo(p).includes("own-goal") ||
          getTipo(p).includes("autogol")
      }));

    /*
     * ============================================================
     * CARTELLINI
     * ============================================================
     */

    const cartellini = plays
      .filter(p => {
        const tipo = getTipo(p);

        return (
          tipo.includes("yellow") ||
          tipo.includes("red") ||
          tipo.includes("giallo") ||
          tipo.includes("rosso")
        );
      })
      .map(p => {
        const tipo = getTipo(p);

        let colore = "giallo";

        if (
          tipo.includes("red") ||
          tipo.includes("rosso")
        ) {
          colore = "rosso";
        }

        return {
          minuto: getMinute(p),
          giocatore: nomeGiocatore(
            getPlayerFromPlay(p)
          ),
          squadra: getSquadra(p),
          tipo: colore
        };
      });

    /*
     * ============================================================
     * ESPULSIONI
     * ============================================================
     */

    const espulsioni = cartellini
      .filter(x => x.tipo === "rosso")
      .map(x => ({
        minuto: x.minuto,
        giocatore: x.giocatore,
        squadra: x.squadra
      }));

    /*
     * ============================================================
     * SOSTITUZIONI
     * ============================================================
     */

    const sostituzioni = plays
      .filter(p => {
        const tipo = getTipo(p);

        return (
          tipo.includes("substitution") ||
          tipo.includes("sostituzione")
        );
      })
      .map(p => ({
        minuto: getMinute(p),

        entrato: nomeGiocatore(
          p?.substitution?.in ||
          p?.participants?.[0]?.athlete ||
          p?.athletesInvolved?.[0]
        ),

        uscito: nomeGiocatore(
          p?.substitution?.out ||
          p?.participants?.[1]?.athlete ||
          p?.athletesInvolved?.[1]
        ),

        squadra: getSquadra(p)
      }));

    /*
     * ============================================================
     * STATISTICHE
     * ============================================================
     */

    const statistiche = {
      casa: [],
      trasferta: []
    };

    for (
      const t of d.boxscore?.teams || []
    ) {
      const statisticheTeam =
        (t.statistics || []).map(x => ({
          nome: x.name || null,
          label: x.label || null,
          valore:
            x.displayValue ??
            x.value ??
            null
        }));

      if (t.homeAway === "home") {
        statistiche.casa = statisticheTeam;
      }

      if (t.homeAway === "away") {
        statistiche.trasferta =
          statisticheTeam;
      }
    }

    /*
     * ============================================================
     * FORMAZIONI
     * ============================================================
     */

    const formazioni = {
      casa: null,
      trasferta: null
    };

    const rosters =
      d.rosters ||
      d.lineups ||
      [];

    for (const r of rosters) {
      const formazione = {
        modulo:
          r.formation ||
          r.formationUsed ||
          null,

        allenatore:
          r.coach?.displayName ||
          r.coaches?.[0]?.displayName ||
          null,

        titolari: [],
        riserve: []
      };

      const giocatori =
        r.roster ||
        r.athletes ||
        [];

      for (const p of giocatori) {
        const atleta =
          p.athlete ||
          p;

        const giocatore = {
          cognome: cognome(atleta),

          numero:
            p.jersey ||
            atleta?.jersey ||
            null,

          ruolo:
            p.position?.abbreviation ||
            atleta?.position?.abbreviation ||
            null,

          titolare:
            p.starter === true ||
            p.lineupStatus === "starter"
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

      const idSquadra =
        r.team?.id ||
        r.team?.uid?.split(":").pop();

      if (
        String(idSquadra) ===
        String(getTeamId(home))
      ) {
        formazioni.casa =
          formazione;
      }

      if (
        String(idSquadra) ===
        String(getTeamId(away))
      ) {
        formazioni.trasferta =
          formazione;
      }
    }

    /*
     * ============================================================
     * EVENTI COMPLETI
     * ============================================================
     */

    const eventi = plays.map(p => ({
      id: p.id || null,

      minuto: getMinute(p),

      tipo:
        p?.type?.text ||
        p?.type?.description ||
        p?.type?.name ||
        null,

      giocatore:
        nomeGiocatore(
          getPlayerFromPlay(p)
        ),

      assist:
        nomeGiocatore(
          getAssistFromPlay(p)
        ),

      squadra: getSquadra(p)
    }));

    /*
     * ============================================================
     * INFO STADIO / ARBITRO
     * ============================================================
     */

    const venue =
      d.gameInfo?.venue ||
      c.venue ||
      {};

    const stadio =
      venue.fullName ||
      venue.name ||
      null;

    const address =
      venue.address ||
      {};

    const arbitro =
      c.officials?.[0]?.displayName ||
      null;

    /*
     * ============================================================
     * RISPOSTA
     * ============================================================
     */

    return res.status(200).json({
      success: true,

      partita: {
        id:
          d.header?.id ||
          c.id ||
          id,

        data:
          c.date ||
          d.header?.date ||
          null,

        competizione: {
          id: competizioneQuery,
          nome: nomeCompetizione
        },

        stato: {
          nome:
            c.status?.type?.name ||
            null,

          descrizione:
            c.status?.type?.description ||
            null,

          stato:
            c.status?.type?.state ||
            null,

          completata:
            c.status?.type?.completed ||
            false,

          minuto:
            c.status?.displayClock ||
            null
        },

        casa: team(home),

        trasferta: team(away),

        stadio,

        nome:
          `${getTeamName(away) || ""} at ${getTeamName(home) || ""}`,

        link: {
          partita:
            `https://www.espn.com/soccer/match/_/gameId/${id}`,

          statistiche:
            `https://www.espn.com/soccer/matchstats/_/gameId/${id}`
        }
      },

      info: {
        arbitro,

        stadio,

        citta:
          address.city ||
          null,

        paese:
          address.country ||
          null
      },

      marcatori,

      cartellini,

      espulsioni,

      sostituzioni,

      statistiche,

      formazioni,

      eventi
    });

  } catch (e) {
    console.error(e);

    return res.status(500).json({
      success: false,
      errore: e.message
    });
  }
};
