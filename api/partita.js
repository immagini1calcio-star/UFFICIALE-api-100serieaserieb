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

let gol = 0;

if (typeof x.score === "object" && x.score !== null) {
gol =
x.score.value ??
x.score.displayValue ??
0;
} else {
gol = x.score ?? 0;
}

const numeroGol = Number(gol);

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
const tipo = tipoEvento(p);

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
const tipo = tipoEvento(p);

return (
tipo.includes("yellow") ||
tipo.includes("red") ||
tipo.includes("giallo") ||
tipo.includes("rosso")
);
})
.map(function (p) {

const tipo = tipoEvento(p);

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
const atleta = estraiAtleta(obj);

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

const tipo = tipoEvento(p);

const testoEvento = String(
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

const coinvolti =
Array.isArray(p?.athletesInvolved)
? p.athletesInvolved
: Array.isArray(p?.participants)
? p.participants
: [];

if (coinvolti.length >= 2) {

entrato =
cognomeAtleta(
coinvolti[0]
);

uscito =
cognomeAtleta(
coinvolti[1]
);

}

if (!entrato) {

entrato =
cognomeAtleta(
p?.substitution?.in ||
p?.substitution?.entered ||
p?.replacement ||
p?.athleteIn ||
p?.playerIn
);

}

if (!uscito) {

uscito =
cognomeAtleta(
p?.substitution?.out ||
p?.substitution?.exited ||
p?.athleteOut ||
p?.playerOut
);

}

risultati.push({

minuto:
minutoEvento(p),

entrato:
entrato,

uscito:
uscito,

squadra:
squadraEvento(p)

});

}

return risultati;
}

/* ============================================================
CRONACA
============================================================ */

function creaCronaca(plays) {

if (!Array.isArray(plays)) {
return [];
}

return plays.map(function (p) {

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
squadraEvento(p)

};

});

}

/* ============================================================
ARBITRI
============================================================ */

function creaArbitri(data, competition) {

const arbitri = [];

const ufficiali =
data?.gameInfo?.officials ||
competition?.officials ||
[];

if (Array.isArray(ufficiali)) {

for (const ufficiale of ufficiali) {

const nome =
ufficiale?.fullName ||
ufficiale?.displayName ||
ufficiale?.name ||
null;

if (!nome) {
continue;
}

arbitri.push({

nome:
nome,

tipo:
ufficiale?.type?.text ||
ufficiale?.type?.name ||
ufficiale?.type ||
null

});

}

}

return arbitri;
}

/* ============================================================
STATISTICHE
============================================================ */

function trovaValoreStatistiche(statistiche, nomi) {

if (!Array.isArray(statistiche)) {
return null;
}

for (const statistica of statistiche) {

const nome = String(
statistica?.name ||
statistica?.displayName ||
statistica?.label ||
""
).toLowerCase();

for (const valore of nomi) {

if (nome.includes(
String(valore).toLowerCase()
)) {

return (
statistica?.displayValue ??
statistica?.value ??
null
);

}

}

}

return null;
}

function creaStatistiche(data) {

const risultato = {

casa: {},

trasferta: {}

};

const competizione =
data?.header?.competitions?.[0];

const competitors =
competizione?.competitors ||
[];

const home =
competitors.find(function (x) {
return x?.homeAway === "home";
});

const away =
competitors.find(function (x) {
return x?.homeAway === "away";
});

const statsGenerali =
data?.boxscore?.teams ||
data?.boxscore?.statistics ||
[];

function estraiStatisticheSquadra(teamId) {

const elemento =
statsGenerali.find(function (x) {

return (
x?.team?.id === teamId ||
x?.id === teamId
);

});

if (!elemento) {
return {};
}

const stats =
elemento?.statistics ||
elemento?.stats ||
[];

return {

possesso:
trovaValoreStatistiche(
stats,
[
"possession",
"possesso"
]
),

tiri:
trovaValoreStatistiche(
stats,
[
"shots",
"tiri"
]
),

tiriInPorta:
trovaValoreStatistiche(
stats,
[
"shots on target",
"tiri in porta"
]
),

calciAngolo:
trovaValoreStatistiche(
stats,
[
"corners",
"corner",
"calci d'angolo"
]
),

passaggi:
trovaValoreStatistiche(
stats,
[
"passes",
"passaggi"
]
),

fuorigioco:
trovaValoreStatistiche(
stats,
[
"offsides",
"fuorigioco"
]
)

};

}

risultato.casa =
estraiStatisticheSquadra(
home?.team?.id
);

risultato.trasferta =
estraiStatisticheSquadra(
away?.team?.id
);

return risultato;
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

casa: {
modulo: null,
titolari: [],
riserve: []
},

trasferta: {
modulo: null,
titolari: [],
riserve: []
}

};

const rosters =
data?.rosters ||
data?.lineups ||
[];

if (!Array.isArray(rosters)) {
return risultato;
}

for (const r of rosters) {

const giocatori =
r?.roster ||
r?.players ||
r?.athletes ||
[];

const formazione = {

modulo:
r?.formation ||
r?.displayFormation ||
r?.formationName ||
null,

titolari: [],

riserve: []

};

if (Array.isArray(giocatori)) {

for (const giocatore of giocatori) {

const atleta =
giocatore?.athlete ||
giocatore?.player ||
giocatore;

const nome =
ultimoCognome(
nomeCompletoAtleta(atleta)
);

if (!nome) {
continue;
}

const titolare =
giocatore?.starter === true ||
giocatore?.isStarter === true ||
giocatore?.starter?.value === true;

const jogador = {

nome:
nome,

numero:
giocatore?.jersey ||
giocatore?.jerseyNumber ||
null,

ruolo:
giocatore?.position?.abbreviation ||
giocatore?.position?.name ||
null

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
FASE / TURNO
============================================================ */

function getFaseTurno(data, competition) {

const settimana =
competition?.week?.number ||
data?.header?.week?.number ||
data?.week?.number ||
null;

const testo = String(
competition?.type?.text ||
competition?.type?.name ||
competition?.type?.abbreviation ||
competition?.round?.text ||
competition?.round?.name ||
competition?.series?.title ||
data?.header?.type?.text ||
data?.header?.type?.name ||
data?.header?.round?.text ||
data?.header?.round?.name ||
""
).trim();

const t = testo.toLowerCase();

if (
settimana !== null &&
settimana !== undefined
) {

return "Giornata " + settimana;

}

if (
t.includes("round of 64")
) {

return "Trentaduesimi di Finale";

}

if (
t.includes("round of 32")
) {

return "Sedicesimi di Finale";

}

if (
t.includes("round of 16")
) {

return "Ottavi di Finale";

}

if (
t.includes("quarterfinal")
) {

return "Quarti di Finale";

}

if (
t.includes("semifinal")
) {

return "Semifinali";

}

if (
t === "final" ||
t.includes("final")
) {

return "Finale";

}

if (
t.includes("knockout play-off") ||
t.includes("knockout playoff")
) {

return "Playoff";

}

if (
t.includes("play-off") ||
t.includes("playoff")
) {

return "Playoff";

}

if (
t.includes("league phase")
) {

return "Fase Campionato";

}

if (
t.includes("group stage") ||
t.includes("group phase")
) {

return "Fase a Gironi";

}

if (
t.includes("qualifying")
) {

return "Qualificazioni";

}

if (
t.includes("regular season")
) {

return "Stagione Regolare";

}

if (testo) {
return testo;
}

return "";

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

nome: competizione,

paese: null

};

/* ========================================================
CHIAMATA ESPN
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
teams.find(function (x) {

return x?.homeAway === "home";

});

const away =
teams.find(function (x) {

return x?.homeAway === "away";

});

const plays =
Array.isArray(data?.plays)
? data.plays
: Array.isArray(data?.keyEvents)
? data.keyEvents
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

/* ========================================================
RISPOSTA JSON
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
getFaseTurno(
data,
competition
),

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

arbitri:
arbitri,

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

cronaca:
plays.map(function (p) {

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
squadraEvento(p)

};

}),

statistiche:
statistiche,

formazioni:
formazioni,

eventi:
plays.map(function (p) {

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
