/************************************************************
 * 100%SerieA&SerieB
 * GOOGLE FOGLI → VERCEL → ESPN
 *
 * VERSIONE AGGIORNATA
 * - Mantiene tutto ciò che già funzionava
 * - Marcatori
 * - Cartellini
 * - Sostituzioni
 * - Cronaca
 * - Solo cognomi dei giocatori
 * - Se Vercel restituisce eventi vuoti, prova a recuperarli
 *   direttamente da ESPN senza modificare gli altri dati
 ************************************************************/


/* ==========================================================
   CONFIGURAZIONE
   ========================================================== */

const BASE_URL =
  'https://ufficiale-api-100serieaserieb.vercel.app';

const ESPN_BASE_URL =
  'https://site.api.espn.com/apis/site/v2/sports/soccer';


/* ==========================================================
   COMPETIZIONI
   ========================================================== */

const COMPETIZIONI = [

  {
    id: 'ita.1',
    nome: 'Serie A',
    attiva: true,
    eliminazione: false
  },

  {
    id: 'ita.2',
    nome: 'Serie B',
    attiva: true,
    eliminazione: false
  },

  {
    id: 'ita.3',
    nome: 'Serie C',
    attiva: false,
    eliminazione: false
  },

  {
    id: 'ita.coppa_italia',
    nome: 'Coppa Italia',
    attiva: true,
    eliminazione: true
  },

  {
    id: 'ita.fifa',
    nome: 'Nazionale Italia',
    attiva: true,
    eliminazione: false
  },

  {
    id: 'uefa.champions',
    nome: 'Champions League',
    attiva: true,
    eliminazione: true
  },

  {
    id: 'uefa.europa',
    nome: 'Europa League',
    attiva: true,
    eliminazione: true
  },

  {
    id: 'uefa.europa.conf',
    nome: 'Conference League',
    attiva: true,
    eliminazione: true
  },

  {
    id: 'fra.1',
    nome: 'Ligue 1',
    attiva: true,
    eliminazione: false
  },

  {
    id: 'esp.1',
    nome: 'La Liga',
    attiva: true,
    eliminazione: false
  },

  {
    id: 'eng.1',
    nome: 'Premier League',
    attiva: true,
    eliminazione: false
  },

  {
    id: 'ksa.1',
    nome: 'Saudi Pro League',
    attiva: true,
    eliminazione: false
  },

  {
    id: 'por.1',
    nome: 'Liga Portugal',
    attiva: true,
    eliminazione: false
  },

  {
    id: 'ned.1',
    nome: 'Eredivisie',
    attiva: true,
    eliminazione: false
  },

  {
    id: 'ger.1',
    nome: 'Bundesliga',
    attiva: true,
    eliminazione: false
  }

];


/* ==========================================================
   INTESTAZIONI
   ========================================================== */

const COLONNE = [

  'ID Partita',
  'Competizione',
  'Paese',
  'Data',
  'Ora',
  'Stato',
  'Squadra Casa',
  'Gol Casa',
  'Squadra Trasferta',
  'Gol Trasferta',
  'Stadio',
  'Città',
  'Arbitri',

  'Marcatori',
  'Cartellini',
  'Sostituzioni',
  'Cronaca',

  'Possesso Casa',
  'Possesso Trasferta',
  'Tiri Casa',
  'Tiri Trasferta',
  'Tiri in porta Casa',
  'Tiri in porta Trasferta',
  'Calci d\'angolo Casa',
  'Calci d\'angolo Trasferta',
  'Passaggi Casa',
  'Passaggi Trasferta',
  'Fuorigioco Casa',
  'Fuorigioco Trasferta',

  'Formazione Casa',
  'Formazione Trasferta',
  'Riserve Casa',
  'Riserve Trasferta',

  'Link Partita',
  'Link Statistiche'

];


/* ==========================================================
   FUNZIONE PRINCIPALE
   ========================================================== */

function aggiornaPartite() {

  const foglio =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getActiveSheet();

  controllaIntestazioni(foglio);

  const partite = [];


  /* --------------------------------------------------------
     RECUPERA LISTA PARTITE
     -------------------------------------------------------- */

  COMPETIZIONI.forEach(function (competizione) {

    if (competizione.attiva !== true) {
      return;
    }

    try {

      const url =
        BASE_URL +
        '/api/partite?competizione=' +
        encodeURIComponent(competizione.id);

      Logger.log(
        'Lista partite: ' +
        competizione.nome +
        ' → ' +
        url
      );

      const risposta =
        richiestaAPI(url);

      if (!risposta) {
        return;
      }

      if (!Array.isArray(risposta.partite)) {

        Logger.log(
          'Nessuna lista partite per ' +
          competizione.nome
        );

        return;
      }


      risposta.partite.forEach(function (partita) {

        if (!partita || !partita.id) {
          return;
        }

        partite.push({

          id: String(partita.id),

          competizione:
            competizione.id,

          nomeCompetizione:
            competizione.nome

        });

      });

    } catch (errore) {

      Logger.log(
        'Errore lista ' +
        competizione.nome +
        ': ' +
        errore
      );

    }

  });


  /* --------------------------------------------------------
     ELIMINA DUPLICATI
     -------------------------------------------------------- */

  const mappa = {};
  const partiteUniche = [];


  partite.forEach(function (partita) {

    const chiave =
      partita.competizione +
      '_' +
      partita.id;

    if (!mappa[chiave]) {

      mappa[chiave] = true;

      partiteUniche.push(partita);

    }

  });


  Logger.log(
    'Totale partite trovate: ' +
    partiteUniche.length
  );


  /* --------------------------------------------------------
     DETTAGLIO PARTITE
     -------------------------------------------------------- */

  const righe = [];


  partiteUniche.forEach(function (riferimento, indice) {

    try {

      const url =
        BASE_URL +
        '/api/partita?id=' +
        encodeURIComponent(riferimento.id) +
        '&competizione=' +
        encodeURIComponent(riferimento.competizione);


      Logger.log(
        '[' +
        (indice + 1) +
        '/' +
        partiteUniche.length +
        '] Dettaglio partita ' +
        riferimento.id
      );


      const dati =
        richiestaAPI(url);


      if (!dati || !dati.partita) {

        Logger.log(
          'Dettaglio non disponibile: ' +
          riferimento.id
        );

        return;
      }


      /*
       * Se Vercel non restituisce gli eventi,
       * proviamo direttamente ESPN.
       *
       * Non tocchiamo statistiche, formazioni,
       * risultato o altri dati già funzionanti.
       */

      recuperaEventiSeMancanti(
        dati,
        riferimento.id,
        riferimento.competizione
      );


      righe.push(
        creaRigaPartita(dati)
      );


    } catch (errore) {

      Logger.log(
        'Errore partita ' +
        riferimento.id +
        ': ' +
        errore
      );

    }


    Utilities.sleep(100);

  });


  /* --------------------------------------------------------
     ORDINA CRONOLOGICAMENTE
     -------------------------------------------------------- */

  righe.sort(function (a, b) {

    return
      convertiDataOra(a[3], a[4]) -
      convertiDataOra(b[3], b[4]);

  });


  /* --------------------------------------------------------
     CANCELLA SOLO I DATI
     -------------------------------------------------------- */

  const ultimaRiga =
    foglio.getLastRow();


  if (ultimaRiga > 1) {

    foglio
      .getRange(
        2,
        1,
        ultimaRiga - 1,
        COLONNE.length
      )
      .clearContent();

  }


  /* --------------------------------------------------------
     SCRIVE I DATI
     -------------------------------------------------------- */

  if (righe.length > 0) {

    foglio
      .getRange(
        2,
        1,
        righe.length,
        COLONNE.length
      )
      .setValues(righe);

  }


  Logger.log(
    '===================================='
  );

  Logger.log(
    'AGGIORNAMENTO COMPLETATO'
  );

  Logger.log(
    'Partite inserite: ' +
    righe.length
  );

  Logger.log(
    '===================================='
  );

}


/* ==========================================================
   RICHIESTA API VERCEL
   ========================================================== */

function richiestaAPI(url) {

  const risposta =
    UrlFetchApp.fetch(
      url,
      {
        method: 'get',
        muteHttpExceptions: true,
        followRedirects: true,
        headers: {
          'Accept': 'application/json'
        }
      }
    );


  const codice =
    risposta.getResponseCode();


  const testo =
    risposta.getContentText();


  if (codice !== 200) {

    Logger.log(
      'ERRORE VERCEL HTTP ' +
      codice +
      ' → ' +
      url
    );

    Logger.log(testo);

    return null;
  }


  if (!testo) {

    Logger.log(
      'Risposta vuota → ' +
      url
    );

    return null;
  }


  try {

    return JSON.parse(testo);

  } catch (errore) {

    Logger.log(
      'JSON non valido → ' +
      url
    );

    Logger.log(testo);

    return null;

  }

}


/* ==========================================================
   RECUPERA EVENTI DIRETTAMENTE DA ESPN
   SOLO SE MANCANO
   ========================================================== */

function recuperaEventiSeMancanti(
  dati,
  id,
  competizione
) {

  const marcatoriMancanti =
    !Array.isArray(dati.marcatori) ||
    dati.marcatori.length === 0;

  const cartelliniMancanti =
    !Array.isArray(dati.cartellini) ||
    dati.cartellini.length === 0;

  const sostituzioniMancanti =
    !Array.isArray(dati.sostituzioni) ||
    dati.sostituzioni.length === 0;

  const cronacaMancante =
    !Array.isArray(dati.cronaca) ||
    dati.cronaca.length === 0;


  if (
    !marcatoriMancanti &&
    !cartelliniMancanti &&
    !sostituzioniMancanti &&
    !cronacaMancante
  ) {
    return;
  }


  try {

    const url =
      ESPN_BASE_URL +
      '/' +
      encodeURIComponent(competizione) +
      '/summary?event=' +
      encodeURIComponent(id);


    Logger.log(
      'Recupero eventi ESPN diretto → ' +
      id
    );


    const risposta =
      UrlFetchApp.fetch(
        url,
        {
          method: 'get',
          muteHttpExceptions: true,
          followRedirects: true,
          headers: {
            'Accept': 'application/json'
          }
        }
      );


    if (
      risposta.getResponseCode() !== 200
    ) {

      Logger.log(
        'ESPN eventi HTTP ' +
        risposta.getResponseCode()
      );

      return;
    }


    const testo =
      risposta.getContentText();


    if (!testo) {
      return;
    }


    const espn =
      JSON.parse(testo);


    let plays = [];


    if (
      Array.isArray(espn.plays)
    ) {

      plays = espn.plays;

    } else if (
      Array.isArray(espn.keyEvents)
    ) {

      plays = espn.keyEvents;

    } else if (
      Array.isArray(espn.commentary)
    ) {

      plays = espn.commentary;

    }


    if (plays.length === 0) {

      Logger.log(
        'ESPN non ha restituito plays per ' +
        id
      );

      return;
    }


    /*
     * MARCATORI
     */

    if (marcatoriMancanti) {

      dati.marcatori =
        creaMarcatori(plays);

    }


    /*
     * CARTELLINI
     */

    if (cartelliniMancanti) {

      dati.cartellini =
        creaCartellini(plays);

    }


    /*
     * SOSTITUZIONI
     */

    if (sostituzioniMancanti) {

      dati.sostituzioni =
        creaSostituzioni(plays);

    }


    /*
     * CRONACA
     */

    if (cronacaMancante) {

      dati.cronaca =
        creaCronaca(plays);

    }


    /*
     * EVENTI COMPLETI
     */

    if (
      !Array.isArray(dati.eventi) ||
      dati.eventi.length === 0
    ) {

      dati.eventi =
        creaEventiCompleti(plays);

    }


    Logger.log(
      'Eventi ESPN recuperati: ' +
      plays.length
    );


  } catch (errore) {

    Logger.log(
      'Errore recupero eventi ESPN: ' +
      errore
    );

  }

}


/* ==========================================================
   CREA LA RIGA DEL FOGLIO
   ========================================================== */

function creaRigaPartita(dati) {

  const partita =
    dati.partita || {};


  const info =
    dati.info || {};


  const casa =
    partita.casa || {};


  const trasferta =
    partita.trasferta || {};


  const statistiche =
    dati.statistiche || {};


  const formazioni =
    dati.formazioni || {};


  const statsCasa =
    statistiche.casa || [];


  const statsTrasferta =
    statistiche.trasferta || [];


  /* --------------------------------------------------------
     STATISTICHE CASA
     -------------------------------------------------------- */

  const possessoCasa =
    trovaStatistica(
      statsCasa,
      [
        'possession',
        'possessionPct',
        'possessionPercentage',
        'ballPossession'
      ]
    );


  const tiriCasa =
    trovaStatistica(
      statsCasa,
      [
        'totalShots',
        'shots',
        'totalShot'
      ]
    );


  const tiriPortaCasa =
    trovaStatistica(
      statsCasa,
      [
        'shotsOnTarget',
        'shotsOnGoal',
        'onTarget'
      ]
    );


  const cornerCasa =
    trovaStatistica(
      statsCasa,
      [
        'wonCorners',
        'corners',
        'cornerKicks'
      ]
    );


  const passaggiCasa =
    trovaStatistica(
      statsCasa,
      [
        'totalPasses',
        'passes',
        'pass'
      ]
    );


  const fuorigiocoCasa =
    trovaStatistica(
      statsCasa,
      [
        'offsides',
        'offside'
      ]
    );


  /* --------------------------------------------------------
     STATISTICHE TRASFERTA
     -------------------------------------------------------- */

  const possessoTrasferta =
    trovaStatistica(
      statsTrasferta,
      [
        'possession',
        'possessionPct',
        'possessionPercentage',
        'ballPossession'
      ]
    );


  const tiriTrasferta =
    trovaStatistica(
      statsTrasferta,
      [
        'totalShots',
        'shots',
        'totalShot'
      ]
    );


  const tiriPortaTrasferta =
    trovaStatistica(
      statsTrasferta,
      [
        'shotsOnTarget',
        'shotsOnGoal',
        'onTarget'
      ]
    );


  const cornerTrasferta =
    trovaStatistica(
      statsTrasferta,
      [
        'wonCorners',
        'corners',
        'cornerKicks'
      ]
    );


  const passaggiTrasferta =
    trovaStatistica(
      statsTrasferta,
      [
        'totalPasses',
        'passes',
        'pass'
      ]
    );


  const fuorigiocoTrasferta =
    trovaStatistica(
      statsTrasferta,
      [
        'offsides',
        'offside'
      ]
    );


  /* --------------------------------------------------------
     FORMAZIONI
     -------------------------------------------------------- */

  const formazioneCasa =
    creaFormazione(
      formazioni.casa
    );


  const formazioneTrasferta =
    creaFormazione(
      formazioni.trasferta
    );


  /* --------------------------------------------------------
     RISERVE
     -------------------------------------------------------- */

  const riserveCasa =
    creaRiserve(
      formazioni.casa
    );


  const riserveTrasferta =
    creaRiserve(
      formazioni.trasferta
    );


  /* --------------------------------------------------------
     ARBITRI
     -------------------------------------------------------- */

  const arbitri =
    info.arbitri ||
    info.arbitro ||
    '';


  /* --------------------------------------------------------
     STADIO
     -------------------------------------------------------- */

  const stadio =
    info.stadio ||
    partita.stadio ||
    '';


  /* --------------------------------------------------------
     EVENTI
     -------------------------------------------------------- */

  const marcatori =
    formattaMarcatori(
      dati.marcatori
    );


  const cartellini =
    formattaCartellini(
      dati.cartellini
    );


  const sostituzioni =
    formattaSostituzioni(
      dati.sostituzioni
    );


  const cronaca =
    formattaCronaca(
      dati.cronaca &&
      dati.cronaca.length > 0
        ? dati.cronaca
        : dati.eventi
    );


  /* --------------------------------------------------------
     35 COLONNE ESATTE
     -------------------------------------------------------- */

  return [

    /* 1 */
    partita.id || '',

    /* 2 */
    partita.competizione
      ? partita.competizione.nome || ''
      : '',

    /* 3 */
    partita.competizione
      ? partita.competizione.paese || ''
      : '',

    /* 4 */
    partita.data || '',

    /* 5 */
    partita.ora || '',

    /* 6 */
    partita.stato
      ? (
          partita.stato.descrizione ||
          partita.stato.nome ||
          partita.stato.stato ||
          ''
        )
      : '',

    /* 7 */
    casa.nome || '',

    /* 8 */
    casa.gol !== undefined
      ? casa.gol
      : '',

    /* 9 */
    trasferta.nome || '',

    /* 10 */
    trasferta.gol !== undefined
      ? trasferta.gol
      : '',

    /* 11 */
    stadio,

    /* 12 */
    info.citta || '',

    /* 13 */
    arbitri,

    /* 14 */
    marcatori,

    /* 15 */
    cartellini,

    /* 16 */
    sostituzioni,

    /* 17 */
    cronaca,

    /* 18 */
    possessoCasa,

    /* 19 */
    possessoTrasferta,

    /* 20 */
    tiriCasa,

    /* 21 */
    tiriTrasferta,

    /* 22 */
    tiriPortaCasa,

    /* 23 */
    tiriPortaTrasferta,

    /* 24 */
    cornerCasa,

    /* 25 */
    cornerTrasferta,

    /* 26 */
    passaggiCasa,

    /* 27 */
    passaggiTrasferta,

    /* 28 */
    fuorigiocoCasa,

    /* 29 */
    fuorigiocoTrasferta,

    /* 30 */
    formazioneCasa,

    /* 31 */
    formazioneTrasferta,

    /* 32 */
    riserveCasa,

    /* 33 */
    riserveTrasferta,

    /* 34 */
    partita.link
      ? partita.link.partita || ''
      : '',

    /* 35 */
    partita.link
      ? partita.link.statistiche || ''
      : ''

  ];

}


/* ==========================================================
   TROVA STATISTICA
   ========================================================== */

function trovaStatistica(lista, nomi) {

  if (!Array.isArray(lista)) {
    return '';
  }


  for (let i = 0; i < lista.length; i++) {

    const statistica =
      lista[i];


    if (!statistica) {
      continue;
    }


    const nome =
      String(
        statistica.nome || ''
      ).toLowerCase();


    const label =
      String(
        statistica.label || ''
      ).toLowerCase();


    for (
      let j = 0;
      j < nomi.length;
      j++
    ) {

      const cercato =
        String(
          nomi[j]
        ).toLowerCase();


      if (
        nome === cercato ||
        label === cercato ||
        nome.indexOf(cercato) !== -1 ||
        label.indexOf(cercato) !== -1
      ) {

        return
          statistica.valore !== undefined
            ? statistica.valore
            : '';

      }

    }

  }


  return '';

}


/* ==========================================================
   FUNZIONI GENERALI GIOCATORI
   ========================================================== */

function ultimoCognome(nome) {

  if (!nome) {
    return null;
  }


  const testo =
    String(nome)
      .trim()
      .replace(/\s+/g, ' ');


  if (!testo) {
    return null;
  }


  return testo
    .split(' ')
    .pop();

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


/* ==========================================================
   ESTRAI ATLETA
   ========================================================== */

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


/* ==========================================================
   NOME GIOCATORE
   ========================================================== */

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
    p.substitution?.player ||
    null;


  const nome =
    nomeCompletoAtleta(atleta);


  if (nome) {
    return ultimoCognome(nome);
  }


  /*
   * FALLBACK:
   * prova direttamente con alcuni campi
   */

  const diretto =
    p.lastName ||
    p.cognome ||
    p.playerName ||
    p.athleteName ||
    null;


  return diretto
    ? ultimoCognome(diretto)
    : null;

}


/* ==========================================================
   ASSIST
   ========================================================== */

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


  const nome =
    nomeCompletoAtleta(atleta);


  if (nome) {
    return ultimoCognome(nome);
  }


  return null;

}


/* ==========================================================
   MINUTO
   ========================================================== */

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
    p.minute ||
    p.minutes ||
    null
  );

}


/* ==========================================================
   SQUADRA EVENTO
   ========================================================== */

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


/* ==========================================================
   TIPO EVENTO
   ========================================================== */

function tipoEvento(p) {

  if (!p) {
    return '';
  }


  return String(

    p.type?.text ||
    p.type?.description ||
    p.type?.name ||
    p.type?.id ||
    p.alternativeType?.text ||
    p.text ||
    p.description ||
    ''

  ).toLowerCase();

}


/* ==========================================================
   TESTO EVENTO
   ========================================================== */

function testoEvento(p) {

  if (!p) {
    return '';
  }


  return String(

    p.text ||
    p.description ||
    p.type?.text ||
    p.type?.description ||
    ''

  );

}


/* ==========================================================
   TRADUZIONE EVENTI
   ========================================================== */

function traduciEvento(tipo) {

  const t =
    String(tipo || '')
      .toLowerCase();


  if (
    t.includes('goal') ||
    t.includes('gol') ||
    t.includes('score')
  ) {
    return 'Gol';
  }


  if (
    t.includes('yellow') ||
    t.includes('giallo')
  ) {
    return 'Ammonizione';
  }


  if (
    t.includes('red') ||
    t.includes('rosso')
  ) {
    return 'Espulsione';
  }


  if (
    t.includes('substitution') ||
    t.includes('sostituzione') ||
    t.includes('sub')
  ) {
    return 'Sostituzione';
  }


  if (
    t.includes('penalty') ||
    t.includes('rigore')
  ) {
    return 'Rigore';
  }


  if (
    t.includes('var')
  ) {
    return 'VAR';
  }


  if (
    t.includes('half') ||
    t.includes('intermission')
  ) {
    return 'Intervallo';
  }


  if (
    t.includes('kickoff') ||
    t.includes('start')
  ) {
    return 'Inizio partita';
  }


  if (
    t.includes('full time') ||
    t.includes('end')
  ) {
    return 'Fine partita';
  }


  return tipo || '';

}


/* ==========================================================
   MARCATORI
   ========================================================== */

function creaMarcatori(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }


  return plays

    .filter(function (p) {

      const tipo =
        tipoEvento(p);

      const testo =
        testoEvento(p)
          .toLowerCase();


      return (

        p?.scoringPlay === true ||

        p?.isScoringPlay === true ||

        p?.scoring === true ||

        tipo.includes('goal') ||

        tipo.includes('gol') ||

        tipo.includes('score') ||

        testo.includes('goal') ||

        testo.includes('gol') ||

        testo.includes('scores') ||

        testo.includes('scored')

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
          p?.ownGoal === 'true' ||
          tipoEvento(p).includes('own') ||
          tipoEvento(p).includes('autogol') ||
          testoEvento(p).toLowerCase().includes('own goal')

      };

    });

}


/* ==========================================================
   CARTELLINI
   ========================================================== */

function creaCartellini(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }


  return plays

    .filter(function (p) {

      const tipo =
        tipoEvento(p);

      const testo =
        testoEvento(p)
          .toLowerCase();


      return (

        tipo.includes('yellow') ||

        tipo.includes('red') ||

        tipo.includes('giallo') ||

        tipo.includes('rosso') ||

        testo.includes('yellow card') ||

        testo.includes('red card') ||

        testo.includes('ammonizione') ||

        testo.includes('espulsione')

      );

    })


    .map(function (p) {

      const tipo =
        (
          tipoEvento(p) +
          ' ' +
          testoEvento(p)
        ).toLowerCase();


      return {

        minuto:
          minutoEvento(p),

        giocatore:
          nomeGiocatore(p),

        squadra:
          squadraEvento(p),

        tipo:
          tipo.includes('red') ||
          tipo.includes('rosso')
            ? 'rosso'
            : 'giallo'

      };

    });

}


/* ==========================================================
   SOSTITUZIONI
   ========================================================== */

function creaSostituzioni(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }


  const risultati = [];


  for (let i = 0; i < plays.length; i++) {

    const p =
      plays[i];


    const tipo =
      tipoEvento(p);


    const testo =
      testoEvento(p)
        .toLowerCase();


    const eSostituzione =

      tipo.includes('substitution') ||

      tipo.includes('sostituzione') ||

      tipo.includes('sub') ||

      testo.includes('substitution') ||

      testo.includes('sostituzione') ||

      testo.includes('entra') ||

      testo.includes('esce') ||

      testo.includes('replaces') ||

      testo.includes('replaced');


    if (!eSostituzione) {
      continue;
    }


    let entrato = null;
    let uscito = null;


    /*
     * STRUTTURA ESPLICITA
     */

    entrato =
      p?.substitution?.in ||
      p?.substitution?.entered ||
      p?.substitution?.enter ||
      null;


    uscito =
      p?.substitution?.out ||
      p?.substitution?.exited ||
      p?.substitution?.leave ||
      null;


    /*
     * PARTECIPANTI
     */

    if (!entrato) {

      entrato =
        p?.participants?.[0]?.athlete ||
        p?.participants?.[0]?.player ||
        null;

    }


    if (!uscito) {

      uscito =
        p?.participants?.[1]?.athlete ||
        p?.participants?.[1]?.player ||
        null;

    }


    /*
     * ATHLETES INVOLVED
     */

    if (!entrato) {

      entrato =
        p?.athletesInvolved?.[0] ||
        null;

    }


    if (!uscito) {

      uscito =
        p?.athletesInvolved?.[1] ||
        null;

    }


    /*
     * Se ESPN restituisce l'evento
     * con il giocatore principale,
     * lo usiamo come fallback.
     */

    if (!entrato && !uscito) {

      const giocatore =
        nomeGiocatore(p);

      if (giocatore) {

        entrato =
          giocatore;

      }

    }


    const nomeEntrato =
      typeof entrato === 'string'
        ? ultimoCognome(entrato)
        : ultimoCognome(
            nomeCompletoAtleta(entrato)
          );


    const nomeUscito =
      typeof uscito === 'string'
        ? ultimoCognome(uscito)
        : ultimoCognome(
            nomeCompletoAtleta(uscito)
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


/* ==========================================================
   CRONACA
   ========================================================== */

function creaCronaca(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }


  return plays

    .map(function (p) {

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
          squadraEvento(p),

        testo:
          testoEvento(p)

      };

    })

    .filter(function (evento) {

      return (

        evento.minuto ||
        evento.tipo ||
        evento.giocatore ||
        evento.testo

      );

    });

}


/* ==========================================================
   EVENTI COMPLETI
   ========================================================== */

function creaEventiCompleti(plays) {

  if (!Array.isArray(plays)) {
    return [];
  }


  return plays

    .map(function (p) {

      return {

        id:
          p?.id || null,

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
          squadraEvento(p),

        testo:
          testoEvento(p)

      };

    })

    .filter(function (evento) {

      return (

        evento.minuto ||
        evento.tipo ||
        evento.giocatore ||
        evento.testo

      );

    });

}


/* ==========================================================
   FORMATTA MARCATORI
   ========================================================== */

function formattaMarcatori(array) {

  if (!Array.isArray(array) ||
      array.length === 0) {

    return '';

  }


  return array

    .map(function (evento) {

      if (!evento) {
        return '';
      }


      const parti = [];


      if (
        evento.minuto !== null &&
        evento.minuto !== undefined &&
        String(evento.minuto) !== ''
      ) {

        parti.push(
          String(evento.minuto)
        );

      }


      if (evento.giocatore) {

        parti.push(
          String(evento.giocatore)
        );

      }


      if (evento.assist) {

        parti.push(
          'Assist: ' +
          String(evento.assist)
        );

      }


      if (evento.autorete) {

        parti.push(
          'Autogol'
        );

      }


      if (evento.squadra) {

        parti.push(
          String(evento.squadra)
        );

      }


      return parti.join(' - ');

    })

    .filter(function (x) {
      return x !== '';
    })

    .join('\n');

}


/* ==========================================================
   FORMATTA CARTELLINI
   ========================================================== */

function formattaCartellini(array) {

  if (!Array.isArray(array) ||
      array.length === 0) {

    return '';

  }


  return array

    .map(function (evento) {

      if (!evento) {
        return '';
      }


      const parti = [];


      if (
        evento.minuto !== null &&
        evento.minuto !== undefined
      ) {

        parti.push(
          String(evento.minuto)
        );

      }


      if (evento.giocatore) {

        parti.push(
          String(evento.giocatore)
        );

      }


      if (evento.tipo) {

        parti.push(
          String(evento.tipo)
        );

      }


      if (evento.squadra) {

        parti.push(
          String(evento.squadra)
        );

      }


      return parti.join(' - ');

    })

    .filter(function (x) {
      return x !== '';
    })

    .join('\n');

}


/* ==========================================================
   FORMATTA SOSTITUZIONI
   ========================================================== */

function formattaSostituzioni(array) {

  if (!Array.isArray(array) ||
      array.length === 0) {

    return '';

  }


  return array

    .map(function (evento) {

      if (!evento) {
        return '';
      }


      const parti = [];


      if (
        evento.minuto !== null &&
        evento.minuto !== undefined
      ) {

        parti.push(
          String(evento.minuto)
        );

      }


      if (evento.entrato) {

        parti.push(
          'Entra: ' +
          String(evento.entrato)
        );

      }


      if (evento.uscito) {

        parti.push(
          'Esce: ' +
          String(evento.uscito)
        );

      }


      if (evento.squadra) {

        parti.push(
          String(evento.squadra)
        );

      }


      return parti.join(' - ');

    })

    .filter(function (x) {
      return x !== '';
    })

    .join('\n');

}


/* ==========================================================
   FORMATTA CRONACA
   ========================================================== */

function formattaCronaca(array) {

  if (!Array.isArray(array) ||
      array.length === 0) {

    return '';

  }


  return array

    .map(function (evento) {

      if (!evento) {
        return '';
      }


      if (typeof evento === 'string') {
        return evento;
      }


      const parti = [];


      if (
        evento.minuto !== null &&
        evento.minuto !== undefined
      ) {

        parti.push(
          String(evento.minuto)
        );

      }


      if (evento.tipo) {

        parti.push(
          String(evento.tipo)
        );

      }


      if (evento.giocatore) {

        parti.push(
          String(evento.giocatore)
        );

      }


      if (evento.assist) {

        parti.push(
          'Assist: ' +
          String(evento.assist)
        );

      }


      if (evento.testo) {

        const testo =
          String(evento.testo);


        if (
          !parti.some(function (x) {
            return x === testo;
          })
        ) {

          parti.push(testo);

        }

      }


      if (evento.squadra) {

        parti.push(
          String(evento.squadra)
        );

      }


      if (evento.entrato) {

        parti.push(
          'Entra: ' +
          String(evento.entrato)
        );

      }


      if (evento.uscito) {

        parti.push(
          'Esce: ' +
          String(evento.uscito)
        );

      }


      if (parti.length > 0) {

        return parti
          .filter(function (valore) {

            return (
              valore !== null &&
              valore !== undefined &&
              String(valore).trim() !== ''
            );

          })
          .join(' - ');

      }


      try {

        return JSON.stringify(
          evento
        );

      } catch (errore) {

        return String(evento);

      }

    })

    .filter(function (valore) {

      return valore !== '';

    })

    .join('\n');

}


/* ==========================================================
   FORMATTA EVENTI GENERICO
   ========================================================== */

function formattaEventi(array) {

  if (!Array.isArray(array) ||
      array.length === 0) {

    return '';

  }


  return array

    .map(function (elemento) {

      if (!elemento) {
        return '';
      }


      if (typeof elemento === 'string') {
        return elemento;
      }


      const parti = [];


      if (
        elemento.minuto !== null &&
        elemento.minuto !== undefined
      ) {

        parti.push(
          String(elemento.minuto)
        );

      }


      if (elemento.giocatore) {

        if (
          typeof elemento.giocatore === 'string'
        ) {

          parti.push(
            elemento.giocatore
          );

        } else {

          parti.push(

            elemento.giocatore.cognome ||
            elemento.giocatore.lastName ||
            elemento.giocatore.nome ||
            elemento.giocatore.displayName ||
            ''

          );

        }

      }


      if (elemento.tipo) {

        parti.push(
          String(elemento.tipo)
        );

      }


      if (elemento.assist) {

        parti.push(
          'Assist: ' +
          String(elemento.assist)
        );

      }


      if (elemento.entrato) {

        parti.push(
          'Entra: ' +
          String(elemento.entrato)
        );

      }


      if (elemento.uscito) {

        parti.push(
          'Esce: ' +
          String(elemento.uscito)
        );

      }


      if (elemento.squadra) {

        if (
          typeof elemento.squadra === 'string'
        ) {

          parti.push(
            elemento.squadra
          );

        } else {

          parti.push(
            elemento.squadra.nome || ''
          );

        }

      }


      if (elemento.testo) {

        parti.push(
          String(elemento.testo)
        );

      }


      if (elemento.descrizione) {

        parti.push(
          String(elemento.descrizione)
        );

      }


      const risultato =
        parti

          .filter(function (valore) {

            return (

              valore !== null &&
              valore !== undefined &&
              String(valore).trim() !== ''

            );

          })

          .join(' - ');


      if (risultato) {
        return risultato;
      }


      try {

        return JSON.stringify(
          elemento
        );

      } catch (errore) {

        return String(elemento);

      }

    })

    .filter(function (valore) {

      return valore !== '';

    })

    .join('\n');

}


/* ==========================================================
   FORMAZIONE
   ========================================================== */

function creaFormazione(dati) {

  if (!dati) {
    return '';
  }


  const titolari =
    Array.isArray(dati.titolari)
      ? dati.titolari
      : [];


  const giocatori =
    titolari

      .map(function (giocatore) {

        if (!giocatore) {
          return '';
        }


        if (
          typeof giocatore === 'string'
        ) {

          return giocatore;

        }


        if (giocatore.cognome) {

          return giocatore.cognome;

        }


        if (giocatore.lastName) {

          return giocatore.lastName;

        }


        if (giocatore.displayName) {

          return ultimoCognome(
            giocatore.displayName
          );

        }


        if (giocatore.nome) {

          return ultimoCognome(
            giocatore.nome
          );

        }


        return '';

      })

      .filter(function (nome) {

        return nome !== '';

      });


  let risultato = '';


  if (dati.modulo) {

    risultato =
      String(dati.modulo);

  }


  if (giocatori.length > 0) {

    if (risultato) {
      risultato += '\n';
    }


    risultato +=
      giocatori.join(', ');

  }


  return risultato;

}


/* ==========================================================
   RISERVE
   ========================================================== */

function creaRiserve(dati) {

  if (!dati) {
    return '';
  }


  const riserve =
    Array.isArray(dati.riserve)
      ? dati.riserve
      : [];


  if (riserve.length === 0) {
    return '';
  }


  return riserve

    .map(function (giocatore) {

      if (!giocatore) {
        return '';
      }


      if (
        typeof giocatore === 'string'
      ) {

        return giocatore;

      }


      if (giocatore.cognome) {

        return giocatore.cognome;

      }


      if (giocatore.lastName) {

        return giocatore.lastName;

      }


      if (giocatore.displayName) {

        return ultimoCognome(
          giocatore.displayName
        );

      }


      if (giocatore.nome) {

        return ultimoCognome(
          giocatore.nome
        );

      }


      return '';

    })

    .filter(function (nome) {

      return nome !== '';

    })

    .join(', ');

}


/* ==========================================================
   CONVERSIONE DATA + ORA
   ========================================================== */

function convertiDataOra(data, ora) {

  if (!data) {
    return 0;
  }


  const parti =
    String(data).split('/');


  if (parti.length === 3) {

    const giorno =
      parseInt(
        parti[0],
        10
      );


    const mese =
      parseInt(
        parti[1],
        10
      ) - 1;


    const anno =
      parseInt(
        parti[2],
        10
      );


    let ore = 0;
    let minuti = 0;


    if (ora) {

      const partiOra =
        String(ora).split(':');


      ore =
        parseInt(
          partiOra[0],
          10
        ) || 0;


      minuti =
        parseInt(
          partiOra[1],
          10
        ) || 0;

    }


    return new Date(
      anno,
      mese,
      giorno,
      ore,
      minuti
    ).getTime();

  }


  const timestamp =
    new Date(data).getTime();


  return isNaN(timestamp)
    ? 0
    : timestamp;

}


/* ==========================================================
   CONTROLLO INTESTAZIONI
   ========================================================== */

function controllaIntestazioni(foglio) {

  const intestazioni =
    foglio
      .getRange(
        1,
        1,
        1,
        COLONNE.length
      )
      .getValues()[0];


  for (
    let i = 0;
    i < COLONNE.length;
    i++
  ) {

    if (
      String(
        intestazioni[i] || ''
      ).trim() !==
      COLONNE[i]
    ) {

      throw new Error(

        'Colonna ' +
        (i + 1) +
        ' non corretta. ' +
        'Attesa: "' +
        COLONNE[i] +
        '"'

      );

    }

  }

}


/* ==========================================================
   MENU GOOGLE FOGLI
   ========================================================== */

function onOpen() {

  SpreadsheetApp
    .getUi()
    .createMenu(
      '100%SerieA&SerieB'
    )
    .addItem(
      '🔄 Aggiorna partite',
      'aggiornaPartite'
    )
    .addToUi();

}


/* ==========================================================
   AGGIORNAMENTO AUTOMATICO
   ========================================================== */

function creaAggiornamentoAutomatico() {

  const triggers =
    ScriptApp.getProjectTriggers();


  triggers.forEach(function (trigger) {

    if (
      trigger.getHandlerFunction() ===
      'aggiornaPartite'
    ) {

      ScriptApp.deleteTrigger(
        trigger
      );

    }

  });


  ScriptApp
    .newTrigger(
      'aggiornaPartite'
    )
    .timeBased()
    .everyMinutes(1)
    .create();

}
