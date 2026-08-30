const { espnFetch } = require("../lib/espn");

module.exports = async (req, res) => {
  try {
    const id = req.query.id;
    if (!id)
      return res.status(400).json({ success:false, errore:"Parametro id obbligatorio" });

    const d = await espnFetch(`/ita.1/summary?event=${encodeURIComponent(id)}`);
    const c = d.header?.competitions?.[0];
    if (!c) return res.status(404).json({ success:false, errore:"Partita non trovata" });

    const teams = c.competitors || [];
    const home = teams.find(x => x.homeAway === "home");
    const away = teams.find(x => x.homeAway === "away");

    const last = x => {
      if (!x) return null;
      const n = x.displayName || x.fullName || x.name || "";
      return n.trim().split(" ").pop() || null;
    };

    const team = x => ({
      id:x?.team?.id || null,
      nome:x?.team?.displayName || null,
      abbreviazione:x?.team?.abbreviation || null,
      logo:x?.team?.logo || x?.team?.logos?.[0]?.href || null,
      gol:Number(x?.score || 0)
    });

    const plays = d.plays || d.keyEvents || [];

    const player = p =>
      last(
        p?.athlete ||
        p?.athletesInvolved?.[0] ||
        p?.participants?.[0]?.athlete ||
        p
      );

    const assist = p =>
      last(
        p?.assistedBy ||
        p?.assist ||
        p?.athletesInvolved?.[1] ||
        p?.participants?.[1]?.athlete
      );

    const minuto = p =>
      p?.clock?.displayValue ||
      p?.clock?.value ||
      p?.time?.displayValue ||
      null;

    const squadra = p =>
      p?.team?.displayName ||
      p?.team?.name ||
      null;

    const tipo = p =>
      String(
        p?.type?.text ||
        p?.type?.description ||
        p?.alternativeType?.text ||
        p?.text ||
        ""
      ).toLowerCase();

    const marcatori = plays
      .filter(p =>
        p.scoringPlay === true ||
        tipo(p).includes("goal") ||
        tipo(p).includes("gol")
      )
      .map(p => ({
        minuto:minuto(p),
        giocatore:player(p),
        assist:assist(p),
        squadra:squadra(p),
        autorete:
          p?.ownGoal === true ||
          tipo(p).includes("own") ||
          tipo(p).includes("autogol")
      }));

    const cartellini = plays
      .filter(p => {
        const t = tipo(p);
        return t.includes("yellow") ||
               t.includes("red") ||
               t.includes("giallo") ||
               t.includes("rosso");
      })
      .map(p => ({
        minuto:minuto(p),
        giocatore:player(p),
        squadra:squadra(p),
        tipo:
          tipo(p).includes("red") ||
          tipo(p).includes("rosso")
            ? "rosso"
            : "giallo"
      }));

    const sostituzioni = plays
      .filter(p => {
        const t = tipo(p);
        return t.includes("substitution") ||
               t.includes("sostituzione");
      })
      .map(p => ({
        minuto:minuto(p),
        entrato:last(p?.substitution?.in || p?.participants?.[0]?.athlete),
        uscito:last(p?.substitution?.out || p?.participants?.[1]?.athlete),
        squadra:squadra(p)
      }));

    const statistiche = { casa:[], trasferta:[] };

    for (const t of d.boxscore?.teams || []) {
      const s = (t.statistics || []).map(x => ({
        nome:x.name || null,
        label:x.label || null,
        valore:x.displayValue || null
      }));

      if (t.homeAway === "home") statistiche.casa = s;
      if (t.homeAway === "away") statistiche.trasferta = s;
    }

    const formazioni = { casa:null, trasferta:null };

    for (const r of d.rosters || d.lineups || []) {
      const f = {
        modulo:r.formation || r.formationUsed || null,
        allenatore:r.coach?.displayName || r.coaches?.[0]?.displayName || null,
        titolari:[],
        riserve:[]
      };

      for (const p of r.roster || r.athletes || []) {
        const g = {
          cognome:last(p.athlete || p),
          numero:p.jersey || p.athlete?.jersey || null,
          ruolo:p.position?.abbreviation || p.athlete?.position?.abbreviation || null,
          titolare:p.starter === true || p.lineupStatus === "starter"
        };

        g.titolare ? f.titolari.push(g) : f.riserve.push(g);
      }

      if (r.team?.id === home?.team?.id) formazioni.casa = f;
      if (r.team?.id === away?.team?.id) formazioni.trasferta = f;
    }

    return res.status(200).json({
      success:true,

      partita:{
        id:d.header?.id || id,
        data:c.date || d.header?.date || null,

        competizione:{
          id:"ita.1",
          nome:"Serie A"
        },

        stato:{
          nome:c.status?.type?.name || null,
          descrizione:c.status?.type?.description || null,
          stato:c.status?.type?.state || null,
          completata:c.status?.type?.completed || false,
          minuto:c.status?.displayClock || null
        },

        casa:team(home),
        trasferta:team(away),

        stadio:d.gameInfo?.venue?.fullName || null,

        nome:`${away?.team?.displayName || ""} at ${home?.team?.displayName || ""}`,

        link:{
          partita:`https://www.espn.com/soccer/match/_/gameId/${id}`,
          statistiche:`https://www.espn.com/soccer/matchstats/_/gameId/${id}`
        }
      },

      info:{
        arbitro:c.officials?.[0]?.displayName || null,
        stadio:d.gameInfo?.venue?.fullName || null,
        citta:d.gameInfo?.venue?.address?.city || null,
        paese:d.gameInfo?.venue?.address?.country || null
      },

      marcatori,
      cartellini,
      sostituzioni,
      statistiche,
      formazioni,
      eventi:plays.map(p => ({
        id:p.id || null,
        minuto:minuto(p),
        tipo:p.type?.text || p.type?.description || null,
        giocatore:player(p),
        assist:assist(p),
        squadra:squadra(p)
      }))
    });

  } catch (e) {
    return res.status(500).json({
      success:false,
      errore:e.message
    });
  }
};
