const { espnFetch } = require("../lib/espn");

/*

API CALCIO 100%SERIEA&SERIEB /api/partita
FONTE UNICA: ESPN

*/

const COMPETIZIONI = {
  "ita.1": { nome: "Serie A", paese: "Italia", tipo: "campionato", giornate: 38 },
  "ita.2": { nome: "Serie B", paese: "Italia", tipo: "campionato", giornate: 38 },
  "ita.coppa_italia": { nome: "Coppa Italia", paese: "Italia", tipo: "coppa" },
  "ita.fifa": { nome: "Nazionale Italia", paese: "Italia", tipo: "nazionale" },
  "uefa.champions": { nome: "Champions League", paese: "Europa", tipo: "coppa", giornate: 8 },
  "uefa.europa": { nome: "Europa League", paese: "Europa", tipo: "coppa", giornate: 8 },
  "uefa.europa.conf": { nome: "Conference League", paese: "Europa", tipo: "coppa", giornate: 6 },
  "fra.1": { nome: "Ligue 1", paese: "Francia", tipo: "campionato", giornate: 34 },
  "esp.1": { nome: "La Liga", paese: "Spagna", tipo: "campionato", giornate: 38 },
  "eng.1": { nome: "Premier League", paese: "Inghilterra", tipo: "campionato", giornate: 38 },
  "ksa.1": { nome: "Saudi Pro League", paese: "Arabia Saudita", tipo: "campionato", giornate: 34 },
  "por.1": { nome: "Liga Portugal", paese: "Portogallo", tipo: "campionato", giornate: 34 },
  "ned.1": { nome: "Eredivisie", paese: "Paesi Bassi", tipo: "campionato", giornate: 34 },
  "ger.1": { nome: "Bundesliga", paese: "Germania", tipo: "campionato", giornate: 34 }
};

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
    { inizio:"2026-08-13", fine:"2026-08-19", faseTurno:"Giornata 1" },
    { inizio:"2026-08-20", fine:"2026-08-26", faseTurno:"Giornata 2" },
    { inizio:"2026-08-27", fine:"2026-09-02", faseTurno:"Giornata 3" },
    { inizio:"2026-09-03", fine:"2026-09-10", faseTurno:"Giornata 4" },
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
  ]
};

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
FINESTRE_GIORNATE["uefa.europa"] = FINESTRE_GIORNATE["uefa.champions"];
FINESTRE_GIORNATE["uefa.europa.conf"] = [
  { inizio:"2026-10-13", fine:"2026-10-16", faseTurno:"Giornata 1" },
  { inizio:"2026-10-20", fine:"2026-10-23", faseTurno:"Giornata 2" },
  { inizio:"2026-11-03", fine:"2026-11-06", faseTurno:"Giornata 3" },
  { inizio:"2026-11-24", fine:"2026-11-27", faseTurno:"Giornata 4" },
  { inizio:"2026-12-08", fine:"2026-12-11", faseTurno:"Giornata 5" },
  { inizio:"2026-12-15", fine:"2026-12-18", faseTurno:"Giornata 6" }
];

/* UTIL */
function testoValido(v){ if(v===null||v===undefined) return null; const t=String(v).trim(); return t||null; }
function normalizzaTesto(v){ return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim(); }
function ultimoCognome(n){ const t=testoValido(n); if(!t) return null; const p=t.replace(/\s+/g," ").trim().split(" "); return p[p.length-1]; }
function nomeAtleta(a){ if(!a) return null; if(a.athlete) a=a.athlete; if(a.player) a=a.player; return a.displayName||a.fullName||a.shortName||a.name||null; }
function cognomeAtleta(a){ if(!a) return null; return ultimoCognome(nomeAtleta(a)); }

const ALIAS_SQUADRE = { "athletic club":"Atletico Bilbao","internazionale":"Inter","ac milan":"Milan","ssc napoli":"Napoli","as roma":"Roma","real betis":"Betis","sevilla fc":"Siviglia","rb leipzig":"Lipsia","bayern munich":"Bayern Monaco","paris saint germain":"PSG","tottenham hotspur":"Tottenham" };
function normalizzaNomeSquadra(n){ const o=testoValido(n); if(!o) return null; const k=normalizzaTesto(o); if(ALIAS_SQUADRE[k]) return ALIAS_SQUADRE[k]; return o; }
function squadraEvento(play){ if(!play) return null; return normalizzaNomeSquadra(play.team?.displayName||play.team?.name||play.team?.abbreviation||null); }
function minutoEvento(play){ if(!play) return null; return testoValido(play.clock?.displayValue||play.time?.displayValue||play.displayClock||play.minute||null); }
function tipoEvento(play){ if(!play) return ""; return String(play.type?.text||play.type?.description||play.type?.name||"").toLowerCase(); }
function testoEvento(play){ return String(play?.text||play?.description||play?.type?.text||"").trim(); }
function atletaEvento(play){ if(!play) return null; return play.athlete||play.player||play.participants?.[0]?.athlete||play.athletesInvolved?.[0]||null; }

async function espnCoreFetch(path){
  try{
    const r=await fetch("https://sports.core.api.espn.com/v2/sports/soccer"+path,{headers:{"User-Agent":"Mozilla/5.0","Accept":"application/json"}});
    if(!r.ok) return null; return await r.json();
  }catch(e){ return null; }
}
async function espnCdnFetch(comp, eventId){
  try{
    const url=`https://cdn.espn.com/core/soccer/game?xhr=1&gameId=${encodeURIComponent(eventId)}&league=${encodeURIComponent(comp)}`;
    const r=await fetch(url,{headers:{"User-Agent":"Mozilla/5.0"}}); if(!r.ok) return null; const j=await r.json(); return j?.gamepackageJSON||j||null;
  }catch(e){ return null; }
}

function datiSquadra(c){
  if(!c) return {id:null,nome:null,abbreviazione:null,logo:null,gol:null};
  let gol=c.score?.value??c.score?.displayValue??c.score??null; if(gol!=null) { const n=Number(gol); if(Number.isFinite(n)) gol=n; }
  return { id:c.team?.id||c.id||null, nome:normalizzaNomeSquadra(c.team?.displayName||c.team?.name||null), abbreviazione:c.team?.abbreviation||null, logo:c.team?.logo||c.team?.logos?.[0]?.href||null, gol:gol };
}

/* MARCATORI FIX */
function creaMarcatori(plays){
  if(!Array.isArray(plays)) return [];
  const res=[];
  for(const play of plays){
    const testoLower=testoEvento(play).toLowerCase();
    if(testoLower.includes("goal kick")) continue;
    const tipo=tipoEvento(play);
    const eGol=play?.scoringPlay===true||play?.isScoringPlay===true||tipo.includes("goal")&&!tipo.includes("kick")||tipo.includes("score");
    if(!eGol) continue;
    if(testoLower.includes("kick")) continue;
    const atleta=atletaEvento(play); const giocatore=cognomeAtleta(atleta);
    if(!giocatore) continue;
    const assist=cognomeAtleta(play?.assistedBy||play?.participants?.[1]?.athlete||play?.athletesInvolved?.[1]||null);
    const rigore=testoLower.includes("penalty")||testoLower.includes("rigore"); const autogol=testoLower.includes("own goal")||testoLower.includes("autogol");
    let testoOut=`${minutoEvento(play)||"?"} - ${squadraEvento(play)||"Squadra"} - ${giocatore}`; if(rigore) testoOut+=" (R.)"; if(autogol) testoOut+=" (AG.)";
    res.push({ minuto:minutoEvento(play), squadra:squadraEvento(play), giocatore, assist, rigore:!!rigore, autogol:!!autogol, testo:testoOut });
  }
  return res;
}
function creaCartellini(plays){
  if(!Array.isArray(plays)) return [];
  const res=[];
  for(const play of plays){
    const tipo=tipoEvento(play); const testo=testoEvento(play).toLowerCase();
    if(testo.includes("goal kick")) continue;
    let card=null; if(tipo.includes("yellow")||testo.includes("yellow card")||testo.includes("ammon")) card="Giallo"; if(tipo.includes("red")||testo.includes("red card")||testo.includes("espuls")) card="Rosso"; if(!card) continue;
    const minuto=minutoEvento(play); const giocatore=cognomeAtleta(atletaEvento(play)); if(!giocatore) continue;
    res.push({ minuto, giocatore, squadra:squadraEvento(play), tipo:card, simbolo:card==="Rosso"?"🟥":"🟨", testo:`${minuto||"?"} - ${giocatore} - ${squadraEvento(play)||"Squadra"} - ${card==="Rosso"?"🟥":"🟨"} ${card}` });
  }
  return res;
}
function estraiSostituzioneDaTesto(t){ const v=String(t||"").trim(); let m=v.match(/^(.+?)\s+(?:for|replaces)\s+(.+)$/i); if(m) return {entra:ultimoCognome(m[1]),esce:ultimoCognome(m[2])}; return {entra:null,esce:null}; }
function creaSostituzioni(plays){
  if(!Array.isArray(plays)) return [];
  const res=[];
  for(const play of plays){
    const tipo=tipoEvento(play); const testo=testoEvento(play); const lower=testo.toLowerCase();
    if(lower.includes("goal kick")) continue;
    if(!(tipo.includes("substitution")||lower.includes("substitution")||lower.includes("replaces"))) continue;
    let entra=play?.substitution?.in||play?.participants?.[1]?.athlete||null; let esce=play?.substitution?.out||play?.participants?.[0]?.athlete||null;
    if(!entra||!esce){ const e=estraiSostituzioneDaTesto(testo); if(e.entra) entra={displayName:e.entra}; if(e.esce) esce={displayName:e.esce}; }
    const ce=cognomeAtleta(entra); const cu=cognomeAtleta(esce); if(!ce&&!cu) continue;
    res.push({ minuto:minutoEvento(play), squadra:squadraEvento(play), entra:ce, esce:cu, testo:`${minutoEvento(play)||"?"} - ${squadraEvento(play)||"Squadra"} - ENTRA ${ce||"?"} - ESCE ${cu||"?"}` });
  }
  return res;
}

/* STATS */
function normalizzaStatistica(n){ return String(n||"").toLowerCase().replace(/[^a-z]/g,""); }
function valoreStatistica(s){ if(!s) return null; const c=[s.displayValue,s.value,s.text]; for(const v of c) if(v!=null&&String(v).trim()!=="") return v; return null; }
function trovaStatistica(lista,nomi){ if(!Array.isArray(lista)) return null; const cercati=nomi.map(normalizzaStatistica); for(const stat of lista){ const campi=[stat?.name,stat?.label,stat?.displayName].filter(Boolean).map(normalizzaStatistica); if(campi.some(c=>cercati.includes(c))){ const v=valoreStatistica(stat); if(v!=null) return v; } } return null; }
function listaStatisticheTeam(team){ return team?.statistics||team?.stats||[]; }
function valoriStatistiche(lista){
  const get=(names)=>{ let v=trovaStatistica(lista,names); if(v==null) return null; let s=String(v).replace("%","").trim(); if(s.startsWith("0.")&&!isNaN(Number(s))){ const n=Math.round(Number(s)*100); return String(n); } return s; };
  return { possesso:get(["possessionPct","possession"]), tiri:get(["totalShots","shots"]), tiriInPorta:get(["shotsOnTarget"]), angoli:get(["corners","wonCorners"]), passaggi:get(["totalPasses","passes"]), fuorigioco:get(["offsides"]) };
}
function creaBloccoStatistiche(lista){ if(!Array.isArray(lista)) return []; return lista.map(s=>({nome:s?.name||s?.label||null,label:s?.label||s?.displayName||null,valore:valoreStatistica(s)})).filter(s=>s.valore!=null); }
function statisticheVuote(){ return {casa:[],trasferta:[],valori:{possessoCasa:null,possessoTrasferta:null,tiriCasa:null,tiriTrasferta:null,tiriInPortaCasa:null,tiriInPortaTrasferta:null,calciDangoloCasa:null,calciDangoloTrasferta:null,passaggiCasa:null,passaggiTrasferta:null,fuorigiocoCasa:null,fuorigiocoTrasferta:null}}; }
function statisticheDaSummary(data){
  const res=statisticheVuote(); const teams=data?.boxscore?.teams||[]; for(const team of teams){ const lista=listaStatisticheTeam(team); if(!lista.length) continue; const blocco=creaBloccoStatistiche(lista); const val=valoriStatistiche(lista); if(team?.homeAway==="home"){ res.casa=blocco; res.valori.possessoCasa=val.possesso; res.valori.tiriCasa=val.tiri; res.valori.tiriInPortaCasa=val.tiriInPorta; res.valori.calciDangoloCasa=val.angoli; res.valori.passaggiCasa=val.passaggi; res.valori.fuorigiocoCasa=val.fuorigioco; } if(team?.homeAway==="away"){ res.trasferta=blocco; res.valori.possessoTrasferta=val.possesso; res.valori.tiriTrasferta=val.tiri; res.valori.tiriInPortaTrasferta=val.tiriInPorta; res.valori.calciDangoloTrasferta=val.angoli; res.valori.passaggiTrasferta=val.passaggi; res.valori.fuorigiocoTrasferta=val.fuorigioco; } } return res;
}
async function statisticheDaCore(comp,eventId,competitionId,homeId,awayId){
  const res=statisticheVuote(); if(!competitionId||!homeId||!awayId) return res; const base=`/leagues/${encodeURIComponent(comp)}/events/${encodeURIComponent(eventId)}/competitions/${encodeURIComponent(competitionId)}/competitors/`; const [h,a]=await Promise.all([espnCoreFetch(base+encodeURIComponent(homeId)+"/statistics"),espnCoreFetch(base+encodeURIComponent(awayId)+"/statistics")]); const ex=(d)=>d?.statistics||d?.stats||d?.items||[]; const hl=ex(h); const al=ex(a); res.casa=creaBloccoStatistiche(hl); res.trasferta=creaBloccoStatistiche(al); const hv=valoriStatistiche(hl); const av=valoriStatistiche(al); res.valori={possessoCasa:hv.possesso,possessoTrasferta:av.possesso,tiriCasa:hv.tiri,tiriTrasferta:av.tiri,tiriInPortaCasa:hv.tiriInPorta,tiriInPortaTrasferta:av.tiriInPorta,calciDangoloCasa:hv.angoli,calciDangoloTrasferta:av.angoli,passaggiCasa:hv.passaggi,passaggiTrasferta:av.passaggi,fuorigiocoCasa:hv.fuorigioco,fuorigiocoTrasferta:av.fuorigioco}; return res;
}
function statisticheDaCdn(pkg){ const res=statisticheVuote(); const teams=pkg?.boxscore?.teams||[]; for(const team of teams){ const lista=listaStatisticheTeam(team); if(!lista.length) continue; const blocco=creaBloccoStatistiche(lista); const val=valoriStatistiche(lista); if(team?.homeAway==="home"){ res.casa=blocco; Object.assign(res.valori,{possessoCasa:val.possesso,tiriCasa:val.tiri,tiriInPortaCasa:val.tiriInPorta,calciDangoloCasa:val.angoli,passaggiCasa:val.passaggi,fuorigiocoCasa:val.fuorigioco}); } if(team?.homeAway==="away"){ res.trasferta=blocco; Object.assign(res.valori,{possessoTrasferta:val.possesso,tiriTrasferta:val.tiri,tiriInPortaTrasferta:val.tiriInPorta,calciDangoloTrasferta:val.angoli,passaggiTrasferta:val.passaggi,fuorigiocoTrasferta:val.fuorigioco}); } } return res; }
function primoValore(...vals){ for(const v of vals) if(v!=null&&String(v).trim()!=="") return v; return null; }
function unisciStatistiche(s,c,cdn){ const r=statisticheVuote(); r.casa=s.casa.length?s.casa:c.casa.length?c.casa:cdn.casa; r.trasferta=s.trasferta.length?s.trasferta:c.trasferta.length?c.trasferta:cdn.trasferta; for(const k of Object.keys(r.valori)) r.valori[k]=primoValore(s.valori?.[k],c.valori?.[k],cdn.valori?.[k]); return r; }

/* FORMAZIONI FIX RUOLO */
function ruoloItaliano(ruolo){
  if(!ruolo) return "Attaccante";
  const r=String(ruolo).toUpperCase().trim();
  if(r==="G"||r==="GK"||r.includes("GK")) return "Portiere";
  if(r.includes("CB")||r.includes("CD")||r.includes("LB")||r.includes("RB")||r.includes("LWB")||r.includes("RWB")||r==="D") return "Difensore";
  if(r.includes("DM")||r.includes("CM")||r.includes("LM")||r.includes("RM")||r.includes("AM")||r.includes("M")) return "Centrocampista";
  return "Attaccante";
}
function valoreFormazione(g){ if(!g) return {}; const a=g?.athlete||g?.player||g; const nome=nomeAtleta(a); const ruolo=g?.position?.abbreviation||a?.position?.abbreviation||g?.position?.displayName||null; return { cognome:ultimoCognome(nome), numero:g?.jersey||a?.jersey||null, ruolo:ruoloItaliano(ruolo), ruoloESPN:ruolo, titolare:g?.starter===true||g?.lineupStatus==="starter" }; }
function testoFormazione(f){ if(!f) return null; const p=[]; if(f.modulo) p.push("Modulo: "+f.modulo); const gruppi=[{nome:"Portieri",lista:f.titolari.filter(g=>g.ruolo==="Portiere")},{nome:"Difensori",lista:f.titolari.filter(g=>g.ruolo==="Difensore")},{nome:"Centrocampisti",lista:f.titolari.filter(g=>g.ruolo==="Centrocampista")},{nome:"Attaccanti",lista:f.titolari.filter(g=>g.ruolo==="Attaccante")}]; for(const gr of gruppi) if(gr.lista.length) p.push(gr.nome+": "+gr.lista.map(g=>g.cognome).filter(Boolean).join(", ")); return p.join(" | "); }
function creaFormazioni(data,home,away){
  const res={casa:null,trasferta:null}; const rosters=data?.rosters||data?.lineups||data?.boxscore?.players||[]; if(!Array.isArray(rosters)) return res;
  for(const roster of rosters){
    const idSquadra=roster?.team?.id||roster?.teamId||null; const giocatori=roster?.roster||roster?.athletes||roster?.players||[]; if(!Array.isArray(giocatori)) continue;
    const f={ modulo:roster?.formation?.displayName||roster?.formation||null, allenatore:roster?.coach?.displayName||roster?.coaches?.[0]?.displayName||null, titolari:[], riserve:[] };
    for(const g of giocatori){ const el=valoreFormazione(g); if(!el.cognome) continue; if(el.titolare) f.titolari.push(el); else f.riserve.push(el); }
    f.testo=testoFormazione(f);
    if(idSquadra&&String(idSquadra)===String(home?.team?.id||home?.id)) res.casa=f;
    if(idSquadra&&String(idSquadra)===String(away?.team?.id||away?.id)) res.trasferta=f;
  }
  return res;
}
function creaArbitri(data,competition){
  const uff=competition?.officials||data?.officials||[]; if(!Array.isArray(uff)) return ""; const r={arbitro:null}; for(const u of uff){ const nome=u?.displayName||u?.fullName||null; if(!nome) continue; const ruolo=String(u?.type?.text||u?.role||"").toLowerCase(); if(ruolo.includes("referee")||!r.arbitro) r.arbitro=nome; } return r.arbitro?`Arbitro: ${r.arbitro}`:"";
}
function traduciStato(s){ if(!s) return "In programma"; if(s.completed===true) return "Finita"; const st=String(s.state||"").toLowerCase(); if(st==="in"||st==="live") return "Live"; if(st==="post") return "Finita"; return "In programma"; }

/* FASE TURNO FIX - TUE FINESTRE HANNO PRIORITÀ */
function faseDaFinestra(competizione, valoreData){
  const finestre=FINESTRE_GIORNATE[competizione]; if(!Array.isArray(finestre)||!valoreData) return null;
  const data=new Date(valoreData); if(isNaN(data.getTime())) return null; const giorno=data.toISOString().slice(0,10);
  let trovata=null; let maxInizio="";
  for(const f of finestre){ if(giorno>=f.inizio&&giorno<=f.fine){ if(f.inizio>=maxInizio){ maxInizio=f.inizio; trovata=f.faseTurno; } } }
  return trovata;
}
function traduciFase(v){ if(!v) return null; const b=String(v).toLowerCase(); if(b.includes("round of 16")||b.includes("ottavi")) return "Ottavi di finale"; if(b.includes("quarter")) return "Quarti di finale"; if(b.includes("semi")) return "Semifinale"; if(b==="final"||b.includes("finale")) return "Finale"; if(b.includes("playoff")) return "Playoff"; if(b.includes("group stage")) return "Fase a gironi"; if(b.includes("league phase")) return "Fase campionato"; return v; }
function trovaFaseESPN(obj){
  if(!obj) return null; const trov=[]; function visita(o,d){ if(!o||d>8) return; if(Array.isArray(o)){ for(const e of o) visita(e,d+1); return; } if(typeof o!=="object") return; for(const k of ["round","phase","stage","roundName"]){ if(o[k]) trov.push(String(o[k]?.displayName||o[k]?.name||o[k]||"")); } for(const kk of Object.keys(o)){ const val=o[kk]; if(typeof val==="string"){ const lb=val.toLowerCase(); if(lb.includes("round of")||lb.includes("quarter")||lb.includes("semi")||lb==="final"||lb.includes("playoff")) trov.push(val); } if(val&&typeof val==="object") visita(val,d+1); } } visita(obj,0); for(const t of trov){ const tr=traduciFase(t); if(tr!==t) return tr; } return null;
}
function trovaNumeroGiornataESPN(...objs){ for(const o of objs){ if(!o) continue; const c=[o?.week?.number,o?.matchday?.number,o?.round?.number]; for(const v of c) if(v!=null){ const n=Number(v); if(Number.isFinite(n)) return n; } } return null; }

async function getFaseTurnoESPN(data, competition, competizione, eventId){
  // 1. PRIORITÀ ASSOLUTA: TUE FINESTRE
  const dataPartita=competition?.date||data?.header?.date||null;
  const daFinestra=faseDaFinestra(competizione, dataPartita);
  if(daFinestra) return daFinestra; // <--- SE TU L'HAI SPECIFICATA, USA QUELLA

  // 2. SE NON L'HAI SPECIFICATA, PROVA ESPN FASE ELIMINATORIA
  let fase=trovaFaseESPN(competition)||trovaFaseESPN(data?.header)||trovaFaseESPN(data);
  if(fase) return fase;

  // 3. FALLBACK ESPN NUMERO GIORNATA
  const num=trovaNumeroGiornataESPN(competition, data?.header, data);
  if(num!=null) return `Giornata ${num}`;
  return "";
}

async function getPlaysCore(comp,eventId,competitionId){
  if(!competitionId) return []; const d=await espnCoreFetch(`/leagues/${encodeURIComponent(comp)}/events/${encodeURIComponent(eventId)}/competitions/${encodeURIComponent(competitionId)}/plays?limit=500`); if(!d) return []; return d.items||d.plays||[];
}
function traduciEvento(t){ const x=String(t||"").toLowerCase(); if(x.includes("goal")&&!x.includes("kick")) return "Gol"; if(x.includes("yellow")) return "Ammonizione"; if(x.includes("red")) return "Espulsione"; if(x.includes("substitution")) return "Sostituzione"; if(x.includes("kickoff")) return "Inizio partita"; if(x.includes("full")) return "Fine partita"; return t||""; }
function eventoImportante(play){
  const testo=testoEvento(play).toLowerCase(); if(testo.includes("goal kick")) return false;
  const tipo=tipoEvento(play); return play?.scoringPlay===true||tipo.includes("goal")&&!tipo.includes("kick")||tipo.includes("yellow")||tipo.includes("red")||tipo.includes("substitution")||tipo.includes("kickoff")||tipo.includes("fulltime");
}
function creaCronaca(plays){ if(!Array.isArray(plays)) return []; const cr=[]; for(const play of plays){ if(!eventoImportante(play)) continue; cr.push({ minuto:minutoEvento(play), tipo:traduciEvento(tipoEvento(play)), giocatore:cognomeAtleta(atletaEvento(play)), squadra:squadraEvento(play), testo:testoEvento(play)||null }); } return cr; }
function creaEventi(plays){ if(!Array.isArray(plays)) return []; return plays.map(p=>({ id:p?.id||null, minuto:minutoEvento(p), tipo:traduciEvento(tipoEvento(p)), giocatore:cognomeAtleta(atletaEvento(p)), squadra:squadraEvento(p), testo:testoEvento(p)||null })); }
function convertiDataOraItaliana(v){ if(!v) return {data:"",ora:""}; try{ const d=new Date(v); if(isNaN(d.getTime())) return {data:"",ora:""}; return { data:new Intl.DateTimeFormat("it-IT",{timeZone:"Europe/Rome",day:"2-digit",month:"2-digit",year:"numeric"}).format(d), ora:new Intl.DateTimeFormat("it-IT",{timeZone:"Europe/Rome",hour:"2-digit",minute:"2-digit",hour12:false}).format(d) }; }catch{ return {data:"",ora:""}; } }

/* HANDLER */
module.exports = async function handler(req,res){
  try{
    const id=req.query.id; const competizione=req.query.competizione||"ita.1";
    if(!id) return res.status(400).json({success:false,errore:"Parametro id obbligatorio"});
    const datiCompetizione=COMPETIZIONI[competizione]||{nome:competizione,paese:null,tipo:"altro"};
    const data=await espnFetch("/"+competizione+"/summary?event="+encodeURIComponent(id));
    const competition=data?.header?.competitions?.[0]; if(!competition) return res.status(404).json({success:false,errore:"Partita non trovata"});
    const teams=competition?.competitors||[]; const home=teams.find(t=>t?.homeAway==="home"); const away=teams.find(t=>t?.homeAway==="away");
    const homeTeam=datiSquadra(home); const awayTeam=datiSquadra(away);
    let plays=Array.isArray(data?.plays)?data.plays:Array.isArray(data?.keyEvents)?data.keyEvents:[];
    const competitionId=competition?.id||id; const playsCore=await getPlaysCore(competizione,id,competitionId); if(playsCore.length>plays.length) plays=playsCore;
    const cdn=await espnCdnFetch(competizione,id);
    const statisticheSummary=statisticheDaSummary(data); const statisticheCore=await statisticheDaCore(competizione,id,competitionId,home?.id||home?.team?.id,away?.id||away?.team?.id); const statisticheCdn=statisticheDaCdn(cdn);
    const statistiche=unisciStatistiche(statisticheSummary,statisticheCore,statisticheCdn);
    const formazioni=creaFormazioni(data,home,away); const venue=data?.gameInfo?.venue||competition?.venue||null;
    const dataOra=convertiDataOraItaliana(competition?.date||data?.header?.date||null); const arbitri=creaArbitri(data,competition); const stato=traduciStato(competition?.status?.type);
    const faseTurno=await getFaseTurnoESPN(data,competition,competizione,id);
    const marcatori=creaMarcatori(plays); const cartellini=creaCartellini(plays); const sostituzioni=creaSostituzioni(plays); const cronaca=creaCronaca(plays); const eventi=creaEventi(plays);

    const rigaTabella={
      "ID Partita": id, "Competizione": datiCompetizione.nome, "Paese": datiCompetizione.paese, "Fase/Turno": faseTurno,
      "Data": dataOra.data, "Ora": dataOra.ora, "Stato": stato,
      "Squadra Casa": homeTeam.nome, "Gol Casa": homeTeam.gol, "Squadra Trasferta": awayTeam.nome, "Gol Trasferta": awayTeam.gol,
      "Stadio": venue?.fullName||venue?.displayName||null, "Città": venue?.address?.city||null, "Arbitri": arbitri,
      "Marcatori": marcatori.map(m=>m.testo).join(" | "), "Cartellini": cartellini.map(c=>c.testo).join(" | "),
      "Sostituzioni": sostituzioni.map(s=>s.testo).join(" | "), "Cronaca": cronaca.map(c=>`${c.minuto} - ${c.tipo} - ${c.testo}`).join(" | "),
      "Possesso Casa": statistiche.valori.possessoCasa, "Possesso Trasferta": statistiche.valori.possessoTrasferta,
      "Tiri Casa": statistiche.valori.tiriCasa, "Tiri Trasferta": statistiche.valori.tiriTrasferta,
      "Tiri in porta Casa": statistiche.valori.tiriInPortaCasa, "Tiri in porta Trasferta": statistiche.valori.tiriInPortaTrasferta,
      "Calci d'angolo Casa": statistiche.valori.calciDangoloCasa, "Calci d'angolo Trasferta": statistiche.valori.calciDangoloTrasferta,
      "Passaggi Casa": statistiche.valori.passaggiCasa, "Passaggi Trasferta": statistiche.valori.passaggiTrasferta,
      "Fuorigioco Casa": statistiche.valori.fuorigiocoCasa, "Fuorigioco Trasferta": statistiche.valori.fuorigiocoTrasferta,
      "Formazione Casa": formazioni.casa?.testo||null, "Formazione Trasferta": formazioni.trasferta?.testo||null,
      "Riserve Casa": formazioni.casa?.riserve.map(g=>g.cognome).join(", ")||null, "Riserve Trasferta": formazioni.trasferta?.riserve.map(g=>g.cognome).join(", ")||null,
      "Link Partita": `https://www.espn.com/soccer/match/_/gameId/${id}`, "Link Statistiche": `https://www.espn.com/soccer/matchstats/_/gameId/${id}`
    };

    return res.status(200).json({
      success:true, riga:rigaTabella,
      partita:{ id:data?.header?.id||id, data:dataOra.data, ora:dataOra.ora, competizione:{id:competizione,nome:datiCompetizione.nome,paese:datiCompetizione.paese}, faseTurno, stato:{nome:stato,descrizione:stato,stato,completata:stato==="Finita",minuto:competition?.status?.displayClock||null}, casa:homeTeam, trasferta:awayTeam, stadio:venue?.fullName||null, nome:`${home?.team?.displayName||""} - ${away?.team?.displayName||""}`, link:{partita:`https://www.espn.com/soccer/match/_/gameId/${id}`,statistiche:`https://www.espn.com/soccer/matchstats/_/gameId/${id}`} },
      info:{ arbitro:arbitri, arbitri, stadio:venue?.fullName||null, citta:venue?.address?.city||null, paese:venue?.address?.country||null },
      marcatori, cartellini, sostituzioni, statistiche,
      statistichePartita:{ possessoCasa:statistiche.valori.possessoCasa, possessoTrasferta:statistiche.valori.possessoTrasferta, tiriCasa:statistiche.valori.tiriCasa, tiriTrasferta:statistiche.valori.tiriTrasferta, tiriInPortaCasa:statistiche.valori.tiriInPortaCasa, tiriInPortaTrasferta:statistiche.valori.tiriInPortaTrasferta, calciDangoloCasa:statistiche.valori.calciDangoloCasa, calciDangoloTrasferta:statistiche.valori.calciDangoloTrasferta, passaggiCasa:statistiche.valori.passaggiCasa, passaggiTrasferta:statistiche.valori.passaggiTrasferta, fuorigiocoCasa:statistiche.valori.fuorigiocoCasa, fuorigiocoTrasferta:statistiche.valori.fuorigiocoTrasferta },
      formazioni, cronaca, eventi
    });
  }catch(errore){ console.error("Errore /api/partita:",errore); return res.status(500).json({success:false,errore:errore?.message||"Errore interno"}); }
};
