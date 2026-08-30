const { espnFetch } = require("../lib/espn");

module.exports = async (req, res) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        errore: "Parametro id obbligatorio"
      });
    }

    const data = await espnFetch(
      `/ita.1/summary?event=${encodeURIComponent(id)}`
    );

    const header = data.header;
    const comp = header?.competitions?.[0];

    if (!header || !comp) {
      return res.status(404).json({
        success: false,
        errore: "Partita non trovata"
      });
    }

    const teams = comp.competitors || [];

    const home = teams.find(x => x.homeAway === "home");
    const away = teams.find(x => x.homeAway === "away");

    const stato = comp.status || header.status;

    const teamData = team => ({
      id: team?.team?.id || null,
      nome: team?.team?.displayName || null,
      abbreviazione: team?.team?.abbreviation || null,
      logo:
        team?.team?.logo ||
        team?.team?.logos?.[0]?.href ||
        null,
      gol: Number(team?.score || 0)
    });

    const nomeGiocatore = athlete => {
      if (!athlete) return null;

      if (athlete.displayName) {
        const parti = athlete.displayName.trim().split(" ");
        return parti[parti.length - 1];
      }

      if (athlete.fullName) {
        const parti = athlete.fullName.trim().split(" ");
        return parti[parti.length - 1];
      }

      return null;
    };

    const eventi = [];

    for (const item of data.keyEvents || []) {
      const type = item.type?.text || item.type?.description || null;

      let evento = {
        id: item.id || null,
        minuto:
          item.clock?.displayValue ||
          item.clock?.value ||
          null,
        tipo: type,
        giocatore: nomeGiocatore(
          item.athletesInvolved?.[0]
        ),
        assist:
          nomeGiocatore(
            item.athletesInvolved?.[1]
          ),
        squadra:
          item.team?.displayName ||
          null
      };

      eventi.push(evento);
    }

    const marcatori = [];

    for (const item of data.keyEvents || []) {
      const type =
        (
          item.type?.text ||
          item.type?.description ||
          ""
        ).toLowerCase();

      if (
        type.includes("goal") ||
        type.includes("gol")
      ) {
        marcatori.push({
          minuto:
            item.clock?.displayValue ||
            null,
          giocatore: nomeGiocatore(
            item.athletesInvolved?.[0]
          ),
          assist:
            nomeGiocatore(
              item.athletesInvolved?.[1]
            ),
          squadra:
            item.team?.displayName ||
            null,
          autorete:
            type.includes("own") ||
            type.includes("autogol")
        });
      }
    }

    const cartellini = [];

    for (const item of data.keyEvents || []) {
      const type =
        (
          item.type?.text ||
          item.type?.description ||
          ""
        ).toLowerCase();

      if (
        type.includes("yellow") ||
        type.includes("red") ||
        type.includes("giallo") ||
        type.includes("rosso")
      ) {
        cartellini.push({
          minuto:
            item.clock?.displayValue ||
            null,
          giocatore: nomeGiocatore(
            item.athletesInvolved?.[0]
          ),
          squadra:
            item.team?.displayName ||
            null,
          tipo:
            type.includes("red") ||
            type.includes("rosso")
              ? "rosso"
              : "giallo"
        });
      }
    }

    const sostituzioni = [];

    for (const item of data.keyEvents || []) {
      const type =
        (
          item.type?.text ||
          item.type?.description ||
          ""
        ).toLowerCase();

      if (
        type.includes("substitution") ||
        type.includes("sostituzione")
      ) {
        sostituzioni.push({
          minuto:
            item.clock?.displayValue ||
            null,
          entrato: nomeGiocatore(
            item.athletesInvolved?.[0]
          ),
          uscito: nomeGiocatore(
            item.athletesInvolved?.[1]
          ),
          squadra:
            item.team?.displayName ||
            null
        });
      }
    }

    const statistiche = {
      casa: [],
      trasferta: []
    };

    const statsTeams =
      data.boxscore?.teams || [];

    for (const team of statsTeams) {
      const lista = (team.statistics || []).map(stat => ({
        nome: stat.name || null,
        label: stat.label || null,
        valore: stat.displayValue || null
      }));

      if (team.homeAway === "home") {
        statistiche.casa = lista;
      } else if (team.homeAway === "away") {
        statistiche.trasferta = lista;
      }
    }

    const formazioni = {
      casa: null,
      trasferta: null
    };

    const rosters =
      data.rosters ||
      data.lineups ||
      [];

    for (const roster of rosters) {
      const squadra = roster.team?.id;

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

      for (const player of roster.roster || roster.athletes || []) {
        const giocatore = {
          cognome: nomeGiocatore(
            player.athlete || player
          ),
          numero:
            player.jersey ||
            player.athlete?.jersey ||
            null,
          ruolo:
            player.position?.abbreviation ||
            player.athlete?.position?.abbreviation ||
            null,
          titolare:
            player.starter === true ||
            player.lineupStatus === "starter"
        };

        if (giocatore.titolare) {
          formazione.titolari.push(giocatore);
        } else {
          formazione.riserve.push(giocatore);
        }
      }

      if (squadra === home?.team?.id) {
        formazioni.casa = formazione;
      }

      if (squadra === away?.team?.id) {
        formazioni.trasferta = formazione;
      }
    }

    const info = {
      arbitro:
        comp.officials?.[0]?.displayName ||
        null,

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

    return res.status(200).json({
      success: true,

      partita: {
        id: header.id || id,

        data:
          comp.date ||
          header.date ||
          null,

        competizione: {
          id: "ita.1",
          nome: "Serie A"
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

        casa: teamData(home),

        trasferta: teamData(away),

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

      statistiche,

      formazioni,

      eventi
    });

  } catch (errore) {
    return res.status(500).json({
      success: false,
      errore: errore.message
    });
  }
};
