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
x.score ??
0;

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


/* ========================================================
STRUTTURA 1
======================================================== */

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


/* ========================================================
STRUTTURA 2 - athletesInvolved
======================================================== */

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

entrato =
atleta;

}

if (
ruolo.includes("out") ||
ruolo.includes("exited")
) {

uscito =
atleta;

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


/* ========================================================
STRUTTURA 3 - participants
======================================================== */

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

entrato =
partecipante;

}

if (
ruolo.includes("out") ||
ruolo.includes("exited")
) {

uscito =
partecipante;

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


/* ========================================================
STRUTTURA 4 - testo ESPN
======================================================== */

if (
(!entrato || !uscito) &&
testoEvento
) {

const testo =
String(
p?.text ||
p?.description ||
p?.type?.text ||
""
);

const parti =
testo
.split(
/\s+(?:for|replaces|replaced by|entra al posto di|per)\s+/i
);

if (parti.length >= 2) {

if (!entrato) {

entrato =
parti[0]
.replace(
/^(substitution|sostituzione)\s*:?\s*/i,
""
)
.trim();

}

if (!uscito) {

uscito =
parti[1]
.trim();

}

}

}


/* ========================================================
NOMI
======================================================== */

const nomeEntrato =
cognomeAtleta(
entrato
) ||
(
typeof entrato === "string"
? ultimoCognome(entrato)
: null
);

const nomeUscito =
cognomeAtleta(
uscito
) ||
(
typeof uscito === "string"
? ultimoCognome(uscito)
: null
);

risultati.push({

minuto:
minutoEvento(p),

entrato:
nomeEntrato,

uscito:
nomeUscito,

squadra:
squadraEvento(p)

});

}

return risultati;

}


/* ============================================================
ARBITRI
============================================================ */

function nomeUfficiale(ufficiale) {

if (!ufficiale) {
return null;
}

if (typeof ufficiale === "string") {
return ufficiale;
}

const nome =
ufficiale.displayName ||
ufficiale.fullName ||
ufficiale.shortName ||
ufficiale.name ||
null;

if (!nome) {
return null;
}

return nome;

}


function creaArbitri(data, competition) {

const lista = [];

const candidati = [

...(Array.isArray(
competition?.officials
)
? competition.officials
: []),

...(Array.isArray(
data?.gameInfo?.officials
)
? data.gameInfo.officials
: []),

...(Array.isArray(
data?.officials
)
? data.officials
: [])

];

const visti = {};

for (
const ufficiale of candidati
) {

const nome =
nomeUfficiale(ufficiale);

if (!nome) {
continue;
}

const chiave =
nome.toLowerCase();

if (visti[chiave]) {
continue;
}

visti[chiave] = true;

const ruolo =
String(
ufficiale?.position ||
ufficiale?.role ||
ufficiale?.type ||
""
).toLowerCase();

if (
ruolo.includes("referee") ||
ruolo.includes("arbitro")
) {

lista.push(
"Arbitro: " +
nome
);

} else if (
ruolo.includes("assistant")
) {

lista.push(
"Assistente: " +
nome
);

} else if (
ruolo.includes("fourth")
) {

lista.push(
"Quarto ufficiale: " +
nome
);

} else if (
ruolo.includes("var")
) {

lista.push(
"VAR: " +
nome
);

} else if (
ruolo.includes("avar")
) {

lista.push(
"AVAR: " +
nome
);

} else {

lista.push(
nome
);

}

}

return lista.join(", ");

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
FASE / TURNO
============================================================ */

function getFaseTurno(
data,
competition
) {

const candidates = [

competition?.round?.displayName,

competition?.round?.name,

competition?.round?.label,

competition?.round?.description,

competition?.round?.shortName,

competition?.week?.text,

competition?.week?.displayName,

competition?.week?.label,

data?.header?.competitions?.[0]?.round?.displayName,

data?.header?.competitions?.[0]?.round?.name,

data?.header?.competitions?.[0]?.round?.label,

data?.header?.competitions?.[0]?.round?.description,

data?.header?.competitions?.[0]?.round?.shortName,

data?.header?.competitions?.[0]?.week?.text,

data?.header?.competitions?.[0]?.week?.displayName,

data?.header?.competitions?.[0]?.week?.label

];

for (
const valore of candidates
) {

if (

valore !== null &&

valore !== undefined &&

String(valore).trim() !== ""

) {

return String(
valore
).trim();

}

}

const numeroGiornata =

competition?.week?.number ??

data?.header?.competitions?.[0]?.week?.number;

if (

numeroGiornata !== null &&

numeroGiornata !== undefined &&

String(numeroGiornata).trim() !== ""

) {

return (
"Giornata " +
numeroGiornata
);

}

return "";

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
isNaN(data.getTime())
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

function valoreStatistica(
statistica
) {

if (
statistica === null ||
statistica === undefined
) {

return "";

}

if (
typeof statistica === "string" ||
typeof statistica === "number"
) {

return statistica;

}

return (

statistica.displayValue ??

statistica.value ??

statistica.valore ??

statistica.displayValueText ??

""

);

}


function nomeStatistica(
statistica
) {

if (!statistica) {
return "";
}

return String(

statistica.name ||

statistica.label ||

statistica.nome ||

statistica.abbreviation ||

statistica.abbreviazione ||

""

).toLowerCase();

}


function leggiStatisticheSquadra(
statistics
) {

const risultato = [];

if (!Array.isArray(statistics)) {
return risultato;
}

for (
const statistica of statistics
) {

if (!statistica) {
continue;
}

const nome =
nomeStatistica(
statistica
);

const valore =
valoreStatistica(
statistica
);

if (!nome) {
continue;
}

risultato.push({

nome:
nome,

label:
statistica.label ||
statistica.displayName ||
statistica.nome ||
nome,

valore:
valore

});

}

return risultato;

}


function trovaValoreStatistica(
lista,
nomi
) {

if (!Array.isArray(lista)) {
return "";
}

for (
const statistica of lista
) {

const nome =
nomeStatistica(
statistica
);

for (
const cercato of nomi
) {

if (
nome ===
String(cercato).toLowerCase() ||
nome.includes(
String(cercato).toLowerCase()
)
) {

return valoreStatistica(
statistica
);

}

}

}

return "";

}


function creaStatistiche(data) {

const risultato = {

casa: [],

trasferta: [],

valori: {

possessoCasa: "",
possessoTrasferta: "",

tiriCasa: "",
tiriTrasferta: "",

tiriInPortaCasa: "",
tiriInPortaTrasferta: "",

calciDangoloCasa: "",
calciDangoloTrasferta: "",

passaggiCasa: "",
passaggiTrasferta: "",

fuorigiocoCasa: "",
fuorigiocoTrasferta: ""

}

};

const teams =
data?.boxscore?.teams ||
data?.boxscore?.teamStatistics ||
[];

if (!Array.isArray(teams)) {
return risultato;
}

let casa = null;
let trasferta = null;

for (
const team of teams
) {

const statistics =
team?.statistics ||
team?.stats ||
[];

const squadra =
team?.team ||
{};

const voce = {

teamId:
squadra?.id ||
team?.id ||
null,

nome:
squadra?.displayName ||
squadra?.name ||
null,

statistiche:
leggiStatisticheSquadra(
statistics
)

};

if (
team?.homeAway === "home"
) {

casa = voce;

} else if (
team?.homeAway === "away"
) {

trasferta = voce;

}

}

if (casa) {

risultato.casa =
casa.statistiche;

}

if (trasferta) {

risultato.trasferta =
trasferta.statistiche;

}

const valoriCasa =
casa?.statistiche || [];

const valoriTrasferta =
trasferta?.statistiche || [];


risultato.valori.possessoCasa =
trovaValoreStatistica(
valoriCasa,
[
"possession",
"possessionpct",
"possessionpercentage"
]
);

risultato.valori.possessoTrasferta =
trovaValoreStatistica(
valoriTrasferta,
[
"possession",
"possessionpct",
"possessionpercentage"
]
);


risultato.valori.tiriCasa =
trovaValoreStatistica(
valoriCasa,
[
"totalshots",
"shots",
"totalshot"
]
);

risultato.valori.tiriTrasferta =
trovaValoreStatistica(
valoriTrasferta,
[
"totalshots",
"shots",
"totalshot"
]
);


risultato.valori.tiriInPortaCasa =
trovaValoreStatistica(
valoriCasa,
[
"shotsontarget",
"shotsongoal",
"ontarget"
]
);

risultato.valori.tiriInPortaTrasferta =
trovaValoreStatistica(
valoriTrasferta,
[
"shotsontarget",
"shotsongoal",
"ontarget"
]
);


risultato.valori.calciDangoloCasa =
trovaValoreStatistica(
valoriCasa,
[
"woncorners",
"corners",
"cornerkicks"
]
);

risultato.valori.calciDangoloTrasferta =
trovaValoreStatistica(
valoriTrasferta,
[
"woncorners",
"corners",
"cornerkicks"
]
);


risultato.valori.passaggiCasa =
trovaValoreStatistica(
valoriCasa,
[
"totalpasses",
"passes",
"pass"
]
);

risultato.valori.passaggiTrasferta =
trovaValoreStatistica(
valoriTrasferta,
[
"totalpasses",
"passes",
"pass"
]
);


risultato.valori.fuorigiocoCasa =
trovaValoreStatistica(
valoriCasa,
[
"offsides",
"offside"
]
);

risultato.valori.fuorigiocoTrasferta =
trovaValoreStatistica(
valoriTrasferta,
[
"offsides",
"offside"
]
);

return risultato;

}


/* ============================================================
FORMAZIONI
============================================================ */

function ruoloItaliano(
ruolo
) {

if (!ruolo) {
return null;
}

const r =
String(
ruolo
).toUpperCase();

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

return resultado;
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
] ||

{

nome:
competizione,

paese:
null

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

teams.find(
function (x) {

return (
x?.homeAway ===
"home"
);

});

const away =

teams.find(
function (x) {

return (
x?.homeAway ===
"away"
);

});

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

const statistiche =

creaStatistiche(
data
);

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

const faseTurno =

getFaseTurno(
data,
competition
);

const homeTeam =

datiSquadra(
home
);

const awayTeam =

datiSquadra(
away
);


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
faseTurno,

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

/* ======================================================
INFORMAZIONI
====================================================== */

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

/* ======================================================
EVENTI
====================================================== */

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

/* ======================================================
STATISTICHE
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
CRONACA
====================================================== */

cronaca:

plays.map(
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
squadraEvento(p)

};

}
),

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
squadraEvento(p)

};

}
)

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
