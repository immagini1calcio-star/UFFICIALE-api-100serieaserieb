/**
 * ============================================================
 * Sincronizzazione Google Sheets → Base44
 * - Legge il foglio (colonna "Competizione" per distinguere le competizioni)
 * - MATCHING FUZZY nomi squadre contro entità SquadraPartecipanti
 *   (usa sempre il nome canonico della squadra, anche se leggermente diverso)
 * - DEDUP GLOBALE: cerca partite esistenti per external_id OPPURE nomi squadre (fuzzy) + data
 *   in TUTTE le entità/competizioni, non solo in quella corrente
 * - RIEMPI SOLO CAMPI VUOTI: non sovrascrive dati già presenti
 * - Timeline (match_events) costruita da Marcatori + Cartellini + Sostituzioni
 *   (colonna Cronaca IGNORATA)
 * - CARTELLINI GIALLI: solo nella cronaca (match_events), mai in campi dedicati
 * - PARTITE IN PROGRAMMA: gol lasciati vuoti (trattino) anche se il foglio dice 0
 * - DATI ASSENTE: lasciati vuoti, mai inventati
 * - Colonna "Fase/Turno" (match esatto, prioritaria) → round/matchday/phase
 * - Trigger temporizzato: eseguire ogni 1 minuto (sfasato rispetto al trigger ESPN)
 * ============================================================
 */

// ⚙️ CONFIGURAZIONE
var BASE44_API_KEY = 'INSERISCI_QUI_LA_TUA_API_KEY';
var BASE44_APP_ID  = '69c172fb33d97b15096660a5';

// Mappa: valore colonna "Competizione" → entità Base44 + competition
var COMPETITION_MAP = {
  'Serie A':           { entity: 'Match', competition: 'serie_a' },
  'Serie B':           { entity: 'Match', competition: 'serie_b' },
  'Coppa Italia':      { entity: 'CoppaItaliaMatch', competition: 'coppa_italia' },
  'Nazionale':         { entity: 'NazionaleMatch', competition: null },
  'Champions League':  { entity: 'Match', competition: 'champions_league' },
  'Europa League':     { entity: 'Match', competition: 'europa_league' },
  'Conference League': { entity: 'Match', competition: 'conference_league' },
  'Premier League':    { entity: 'Match', competition: 'premier_league' },
  'La Liga':           { entity: 'Match', competition: 'la_liga' },
  'Bundesliga':        { entity: 'Match', competition: 'bundesliga' },
  'Ligue 1':           { entity: 'Match', competition: 'ligue_1' },
  'Eredivisie':        { entity: 'Match', competition: 'eredivisie' },
  'Liga Portugal':     { entity: 'Match', competition: 'liga_portugal' },
  'Saudi Pro League':  { entity: 'Match', competition: 'saudi_pro_league' },
  'Mondiali':          { entity: 'MondialiMatch', competition: null },
};

// Competizioni che hanno SquadraPartecipanti (per normalizzazione nomi)
var COMPS_WITH_SQUADRE = {
  'serie_a': true, 'serie_b': true, 'coppa_italia': true,
  'champions_league': true, 'europa_league': true, 'conference_league': true,
  'premier_league': true, 'la_liga': true, 'bundesliga': true,
  'ligue_1': true, 'eredivisie': true, 'liga_portugal': true, 'saudi_pro_league': true,
};

// ============================================================
// FUNZIONE PRINCIPALE
// ============================================================
function syncAll() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var stats = { sheets: 0, created: 0, updated: 0, skipped: 0, errors: 0 };

  // Scarica TUTTI i record esistenti da TUTTE le entità una sola volta.
  // La dedup è GLOBALE: controlla in ogni competizione, non solo in quella corrente.
  var globalRecords = fetchAllExistingRecords();

  var sheets = ss.getSheets();
  for (var s = 0; s < sheets.length; s++) {
    var sheet = sheets[s];
    try {
      var result = syncSheet(sheet, globalRecords);
      if (result.processed > 0) {
        stats.sheets++;
        stats.created += result.created;
        stats.updated += result.updated;
        stats.skipped += result.skipped;
        stats.errors += result.errors;
      }
    } catch (e) {
      Logger.log('Errore sheet ' + sheet.getName() + ': ' + e);
      stats.errors++;
    }
  }

  Logger.log('Sync completata: ' + JSON.stringify(stats));
  return stats;
}

// ============================================================
// Helper: scarica tutti i record da tutte le entità partita (UNA volta)
// Dedup GLOBALE: cerca in ogni competizione/entità
// ============================================================
function fetchAllExistingRecords() {
  var entities = ['Match', 'CoppaItaliaMatch', 'NazionaleMatch', 'MondialiMatch'];
  var byExternalId = {};
  var byTeamsDate = [];

  for (var i = 0; i < entities.length; i++) {
    try {
      var recs = fetchEntityRecordsRaw(entities[i]);
      for (var j = 0; j < recs.length; j++) {
        var rec = recs[j];
        rec._entity = entities[i];
        if (rec.external_id && !byExternalId[String(rec.external_id)]) {
          byExternalId[String(rec.external_id)] = rec;
        }
        if (rec.home_team && rec.away_team && rec.match_date) {
          byTeamsDate.push(rec);
        }
      }
    } catch (e) {
      Logger.log('Errore fetch global ' + entities[i] + ': ' + e);
    }
  }

  return { byExternalId: byExternalId, byTeamsDate: byTeamsDate };
}

function fetchEntityRecordsRaw(entity) {
  var url = 'https://app.base44.com/api/apps/' + BASE44_APP_ID + '/entities/' + entity + '?limit=5000';
  var resp = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { 'api_key': BASE44_API_KEY },
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) {
    Logger.log('Errore list ' + entity + ': HTTP ' + resp.getResponseCode());
    return [];
  }
  return JSON.parse(resp.getContentText());
}

// ============================================================
// Sincronizza un singolo sheet (se ha la colonna "Competizione")
// ============================================================
function syncSheet(sheet, globalRecords) {
  var stats = { created: 0, updated: 0, skipped: 0, errors: 0, processed: 0 };

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return stats;

  var headers = data[0].map(function(h) { return String(h || '').trim(); });

  // Trova l'indice della colonna "Competizione"
  var compCol = -1;
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].toLowerCase() === 'competizione') { compCol = i; break; }
  }
  if (compCol === -1) return stats; // sheet senza colonna Competizione, salta

  var colMap = buildColMap(headers);

  // Raggruppa righe per entità
  var byEntity = {};
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var compName = String(row[compCol] || '').trim();
    if (!compName) { stats.skipped++; continue; }

    var mapping = resolveCompetition(compName);
    if (!mapping) { stats.skipped++; continue; }

    var key = mapping.entity + '|' + (mapping.competition || '');
    if (!byEntity[key]) byEntity[key] = { mapping: mapping, rows: [] };
    byEntity[key].rows.push(row);
  }

  // Processa ogni gruppo (passa globalRecords per dedup cross-competizione)
  for (var key in byEntity) {
    var group = byEntity[key];
    try {
      var result = syncEntityGroup(group.mapping, group.rows, colMap, globalRecords);
      stats.created += result.created;
      stats.updated += result.updated;
      stats.skipped += result.skipped;
      stats.errors += result.errors;
      stats.processed += group.rows.length;
    } catch (e) {
      Logger.log('Errore gruppo ' + key + ': ' + e);
      stats.errors += group.rows.length;
    }
  }

  return stats;
}

// ============================================================
// Sincronizza un gruppo di righe per la stessa entità
// ============================================================
function syncEntityGroup(mapping, rows, colMap, globalRecords) {
  var stats = { created: 0, updated: 0, skipped: 0, errors: 0 };

  // Usa l'indice GLOBALE (tutte le entità/competizioni) per la dedup
  var byExternalId = globalRecords.byExternalId;
  var byTeamsDate = globalRecords.byTeamsDate;

  // Scarica SquadrePartecipanti per questa competizione (se applicabile)
  var squadre = [];
  if (mapping.competition && COMPS_WITH_SQUADRE[mapping.competition]) {
    squadre = fetchSquadrePartecipanti(mapping.competition);
  }

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    try {
      var payload = buildPayload(row, colMap, mapping, squadre);
      if (!payload.home_team || !payload.away_team) { stats.skipped++; continue; }

      // Cerca esistente GLOBALLY: prima per external_id (in qualsiasi entità)
      var existingRec = null;
      if (payload.external_id) existingRec = byExternalId[String(payload.external_id)];

      // Poi per nomi squadre (fuzzy) + data (in qualsiasi competizione)
      if (!existingRec && payload.match_date) {
        for (var d = 0; d < byTeamsDate.length; d++) {
          var cand = byTeamsDate[d];
          if (cand.match_date !== payload.match_date) continue;
          if (fuzzyTeamMatch(cand.home_team, payload.home_team) &&
              fuzzyTeamMatch(cand.away_team, payload.away_team)) {
            existingRec = cand;
            break;
          }
        }
      }

      if (existingRec) {
        // RIEMPI SOLO CAMPI VUOTI — aggiorna nell'entità corretta
        var fillPayload = buildFillPayload(existingRec, payload);
        if (Object.keys(fillPayload).length > 0) {
          // Usa l'entità del record esistente (può differire se la competizione è cambiata)
          var updateMapping = { entity: existingRec._entity || mapping.entity, competition: mapping.competition };
          updateRecord(updateMapping, existingRec.id, fillPayload);
          stats.updated++;
        } else {
          stats.skipped++;
        }
      } else {
        createRecord(mapping, payload);
        stats.created++;
      }
    } catch (e) {
      Logger.log('Errore riga: ' + e);
      stats.errors++;
    }
  }

  return stats;
}

// ============================================================
// Helper: risolve il nome competizione (match flessibile)
// ============================================================
function resolveCompetition(compName) {
  var norm = normalizeStr(compName);
  for (var key in COMPETITION_MAP) {
    if (normalizeStr(key) === norm) return COMPETITION_MAP[key];
  }
  for (var key2 in COMPETITION_MAP) {
    var n = normalizeStr(key2);
    if (norm.indexOf(n) !== -1 || n.indexOf(norm) !== -1) return COMPETITION_MAP[key2];
  }
  return null;
}

function normalizeStr(s) {
  return String(s || '').toLowerCase().trim()
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s_\-\.]/g, '');
}

// ============================================================
// Helper: matching fuzzy nomi squadre
// ============================================================

/**
 * Trova la squadra canonica in SquadraPartecipanti che meglio matcha il nome.
 * Restituisce il nome canonico se trovato (match good), altrimenti il nome originale.
 */
function resolveTeamName(teamName, squadre) {
  if (!teamName) return teamName;
  if (!squadre || squadre.length === 0) return teamName;

  var normName = normalizeStr(teamName);

  // 1. Match esatto normalizzato
  for (var i = 0; i < squadre.length; i++) {
    if (normalizeStr(squadre[i].name) === normName) return squadre[i].name;
  }

  // 2. Match contains bidirezionale
  for (var i2 = 0; i2 < squadre.length; i2++) {
    var sNorm = normalizeStr(squadre[i2].name);
    if (!sNorm || !normName) continue;
    if (sNorm.indexOf(normName) !== -1 || normName.indexOf(sNorm) !== -1) {
      return squadre[i2].name;
    }
  }

  // 3. Match con tolleranza (Levenshtein distance <= 20% della lunghezza)
  if (normName.length > 4) {
    var best = null, bestDist = 99;
    for (var i3 = 0; i3 < squadre.length; i3++) {
      var sNorm3 = normalizeStr(squadre[i3].name);
      if (!sNorm3 || sNorm3.length < 3) continue;
      var dist = levenshtein(normName, sNorm3);
      var threshold = Math.floor(Math.max(normName.length, sNorm3.length) * 0.2);
      if (dist <= Math.max(2, threshold) && dist < bestDist) {
        best = squadre[i3].name;
        bestDist = dist;
      }
    }
    if (best) return best;
  }

  // Nessun match: lascia il nome originale (non inventare)
  return teamName;
}

/**
 * Verifica se due nomi squadra corrispondono (fuzzy).
 */
function fuzzyTeamMatch(name1, name2) {
  if (!name1 || !name2) return false;
  var n1 = normalizeStr(name1);
  var n2 = normalizeStr(name2);
  if (!n1 || !n2) return false;
  if (n1 === n2) return true;
  if (n1.indexOf(n2) !== -1 || n2.indexOf(n1) !== -1) return true;
  // Levenshtein con soglia proporzionale
  if (n1.length > 4 && n2.length > 4) {
    var dist = levenshtein(n1, n2);
    var threshold = Math.floor(Math.max(n1.length, n2.length) * 0.2);
    return dist <= Math.max(2, threshold);
  }
  return false;
}

/**
 * Levenshtein distance semplice.
 */
function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  var prev = [];
  var curr = [];
  for (var j = 0; j <= b.length; j++) prev[j] = j;
  for (var i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (var k = 1; k <= b.length; k++) {
      var cost = a.charAt(i - 1) === b.charAt(k - 1) ? 0 : 1;
      curr[k] = Math.min(prev[k] + 1, curr[k - 1] + 1, prev[k - 1] + cost);
    }
    for (var j2 = 0; j2 <= b.length; j2++) prev[j2] = curr[j2];
  }
  return prev[b.length];
}

// ============================================================
// Helper: mappa header → indici colonne
// ============================================================
function buildColMap(headers) {
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    var h = normalizeStr(headers[i]);
    if (map[h] === undefined) map[h] = i;
    map[headers[i]] = i;
  }
  return map;
}

function getCol(row, colMap, headerName) {
  var idx = colMap[normalizeStr(headerName)];
  if (idx === undefined) idx = colMap[headerName];
  if (idx === undefined) return '';
  return row[idx];
}

// ============================================================
// Helper: legge la colonna "Fase/Turno" con match ESATTO
// (priorità a "Fase/Turno", poi "Fase", poi "Turno" — niente match parziale
//  per evitare collisioni con colonne a nome simile)
// ============================================================
function getFaseValue(row, colMap) {
  var candidates = ['fase/turno', 'fase', 'fasi', 'turno', 'turni'];
  var idx = -1;
  for (var i = 0; i < candidates.length; i++) {
    if (colMap[candidates[i]] !== undefined) { idx = colMap[candidates[i]]; break; }
  }
  if (idx === -1) return '';
  var val = row[idx];
  return (val === '' || val == null) ? '' : String(val).trim();
}

// ============================================================
// Helper: mappa il testo della fase nei valori enum di MondialiMatch
// (solo se corrisponde a un valore noto — mai inventare)
// ============================================================
function mapMondialiPhase(fase) {
  var s = normalizeStr(fase);
  if (!s) return null;
  if (s.indexOf('semif') !== -1) return 'semifinali';   // prima di "finale" (contiene "final")
  if (s.indexOf('terzo') !== -1) return 'terzo_posto';
  if (s.indexOf('final') !== -1) return 'finale';
  if (s.indexOf('giron') !== -1 || s.indexOf('girone') !== -1) return 'gironi';
  if (s.indexOf('sedic') !== -1) return 'sedicesimi';
  if (s.indexOf('ottav') !== -1) return 'ottavi';
  if (s.indexOf('quart') !== -1) return 'quarti';
  return null;
}

// ============================================================
// Helper: costruisce il payload da una riga
// ============================================================
function buildPayload(row, colMap, mapping, squadre) {
  var payload = {};

  // ID
  var idPartita = getCol(row, colMap, 'ID Partita');
  if (idPartita) payload.external_id = String(idPartita);

  // Squadre — normalizza contro SquadraPartecipanti
  var homeTeamRaw = getCol(row, colMap, 'Squadra Casa');
  var awayTeamRaw = getCol(row, colMap, 'Squadra Trasferta');
  var homeTeam = homeTeamRaw ? resolveTeamName(String(homeTeamRaw).trim(), squadre) : '';
  var awayTeam = awayTeamRaw ? resolveTeamName(String(awayTeamRaw).trim(), squadre) : '';
  if (homeTeam) payload.home_team = homeTeam;
  if (awayTeam) payload.away_team = awayTeam;

  // Punteggio (solo se presente, mai inventato)
  // Se la partita è IN PROGRAMMA, lascia i gol vuoti (trattino) anche se il foglio dice 0
  var statoRaw = getCol(row, colMap, 'Stato');
  var isScheduled = statoRaw && mapStatus(statoRaw) === 'scheduled';
  var golCasa = getCol(row, colMap, 'Gol Casa');
  var golTrasferta = getCol(row, colMap, 'Gol Trasferta');
  if (!isScheduled) {
    if (golCasa !== '' && golCasa != null) payload.home_score = parseNumber(golCasa);
    if (golTrasferta !== '' && golTrasferta != null) payload.away_score = parseNumber(golTrasferta);
  }

  // Data e ora
  var data = getCol(row, colMap, 'Data');
  if (data) payload.match_date = convertDate(data);
  var ora = getCol(row, colMap, 'Ora');
  if (ora) payload.match_time = String(ora);

  // Stato
  var stato = getCol(row, colMap, 'Stato');
  if (stato) payload.status = mapStatus(stato);

  // Fase / Turno (colonna "Fase/Turno" — selezione ESATTA, prioritaria)
  var fase = getFaseValue(row, colMap);
  if (fase) {
    if (mapping.entity === 'CoppaItaliaMatch') {
      payload.round = fase;
    } else if (mapping.entity === 'MondialiMatch') {
      payload.matchday = fase;
      var phaseEnum = mapMondialiPhase(fase);
      if (phaseEnum) payload.phase = phaseEnum;
    } else {
      payload.matchday = fase;
    }
  }

  // Stadio
  var stadio = getCol(row, colMap, 'Stadio');
  if (stadio) payload.stadium = String(stadio);

  // Arbitro
  var arbitri = getCol(row, colMap, 'Arbitri');
  if (arbitri) {
    var refName = String(arbitri).replace(/^Arbitro:\s*/i, '').trim();
    if (refName) payload.referee = refName;
  }

  // Statistiche (solo se presenti)
  setNum(payload, 'Possesso Casa', row, colMap, 'possession_home');
  setNum(payload, 'Possesso Trasferta', row, colMap, 'possession_away');
  setNum(payload, 'Tiri Casa', row, colMap, 'shots_home');
  setNum(payload, 'Tiri Trasferta', row, colMap, 'shots_away');
  setNum(payload, 'Tiri in porta Casa', row, colMap, 'shots_on_target_home');
  setNum(payload, 'Tiri in porta Trasferta', row, colMap, 'shots_on_target_away');
  setNum(payload, 'Calci d\'angolo Casa', row, colMap, 'corners_home');
  setNum(payload, 'Calci d\'angolo Trasferta', row, colMap, 'corners_away');
  setNum(payload, 'Fuorigioco Casa', row, colMap, 'offsides_home');
  setNum(payload, 'Fuorigioco Trasferta', row, colMap, 'offsides_away');

  // Formazioni (modulo + giocatori) + Riserve
  var formCasa = getCol(row, colMap, 'Formazione Casa');
  var risCasa = getCol(row, colMap, 'Riserve Casa');
  var formTrasf = getCol(row, colMap, 'Formazione Trasferta');
  var risTrasf = getCol(row, colMap, 'Riserve Trasferta');

  var lc = parseLineup(formCasa, risCasa);
  if (lc.module) payload.home_lineup_module = lc.module;
  if (lc.players) payload.home_lineup_players = lc.players;

  var lt = parseLineup(formTrasf, risTrasf);
  if (lt.module) payload.away_lineup_module = lt.module;
  if (lt.players) payload.away_lineup_players = lt.players;

  // Marcatori, Cartellini, Sostituzioni → match_events + scorers + red_cards
  var marcatori = getCol(row, colMap, 'Marcatori');
  var cartellini = getCol(row, colMap, 'Cartellini');
  var sostituzioni = getCol(row, colMap, 'Sostituzioni');

  var events = buildMatchEvents(marcatori, cartellini, sostituzioni, homeTeam, awayTeam);
  if (events.length > 0) {
    payload.match_events = JSON.stringify(events);
  }

  // Scorers separati per squadra
  var scorers = buildScorers(events);
  if (scorers.home) payload.home_scorers = scorers.home;
  if (scorers.away) payload.away_scorers = scorers.away;
  if (scorers.all) payload.scorers = scorers.all;

  // Cartellini ROSSI (JSON array di nomi) — i GIALLI restano solo nella cronaca
  var redCards = buildRedCards(events);
  if (redCards.home) payload.home_red_cards = JSON.stringify(redCards.home);
  if (redCards.away) payload.away_red_cards = JSON.stringify(redCards.away);

  // Link
  var linkPartita = getCol(row, colMap, 'Link Partita');
  if (linkPartita) payload.link_url = String(linkPartita);

  // Competition
  if (mapping.competition) payload.competition = mapping.competition;

  return payload;
}

function setNum(payload, headerName, row, colMap, field) {
  var val = getCol(row, colMap, headerName);
  if (val !== '' && val != null) {
    var n = parseNumber(val);
    if (n !== null) payload[field] = n;
  }
}

// ============================================================
// Helper: parse formazione → { module, players }
// ============================================================
function parseLineup(formazione, riserve) {
  var result = { module: '', players: '' };
  if (!formazione) return result;

  var lines = String(formazione).split(/\r?\n/);
  if (lines.length >= 1) result.module = lines[0].trim();
  if (lines.length >= 2) {
    var starters = lines[1].split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    var bench = [];
    if (riserve) {
      bench = String(riserve).split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    }
    result.players = starters.concat(bench).join('\n');
  }
  return result;
}

// ============================================================
// Helper: build match_events da Marcatori + Cartellini + Sostituzioni
// (Cronaca IGNORATA — i gialli restano SOLO qui, mai in campi dedicati)
// ============================================================
function buildMatchEvents(marcatori, cartellini, sostituzioni, homeTeam, awayTeam) {
  var events = [];

  if (marcatori) {
    String(marcatori).split('<br>').forEach(function(line) {
      var e = parseGoalEvent(line, homeTeam, awayTeam);
      if (e) events.push(e);
    });
  }

  if (cartellini) {
    String(cartellini).split('<br>').forEach(function(line) {
      var e = parseCardEvent(line, homeTeam, awayTeam);
      if (e) events.push(e); // gialli e rossi vanno nella cronaca
    });
  }

  if (sostituzioni) {
    String(sostituzioni).split('<br>').forEach(function(line) {
      var e = parseSubEvent(line, homeTeam, awayTeam);
      if (e) events.push(e);
    });
  }

  events.sort(function(a, b) {
    return parseMinuteSort(a.minute) - parseMinuteSort(b.minute);
  });

  return events;
}

function parseGoalEvent(text, homeTeam, awayTeam) {
  var parts = String(text).split(/\s*-\s*/);
  if (parts.length < 3) return null;
  var minute = parts[0].replace("'", "").trim();
  var player = parts[1].trim();
  var team = parts[parts.length - 1].trim();
  var assist = '';
  if (parts.length >= 4) {
    var mid = parts.slice(2, parts.length - 1).join(' - ');
    var m = mid.match(/Assist:\s*(.+)/i);
    if (m) assist = m[1].trim();
  }
  return {
    minute: minute, type: 'goal', side: getSide(team, homeTeam, awayTeam),
    text: player, subtext: assist ? 'Assist: ' + assist : ''
  };
}

function parseCardEvent(text, homeTeam, awayTeam) {
  var parts = String(text).split(/\s*-\s*/);
  if (parts.length < 4) return null;
  var minute = parts[0].replace("'", "").trim();
  var player = parts[1].trim();
  var cardType = parts[2].trim().toLowerCase();
  var team = parts[parts.length - 1].trim();
  return {
    minute: minute,
    type: cardType.indexOf('rosso') !== -1 ? 'red_card' : 'yellow_card',
    side: getSide(team, homeTeam, awayTeam),
    text: player,
    subtext: cardType.indexOf('rosso') !== -1 ? 'Espulso' : 'Ammonito'
  };
}

function parseSubEvent(text, homeTeam, awayTeam) {
  var parts = String(text).split(/\s*-\s*/);
  if (parts.length < 4) return null;
  var minute = parts[0].replace("'", "").trim();
  var inPlayer = parts[1].replace(/^Entra:\s*/i, '').trim();
  var outPlayer = parts[2].replace(/^Esce:\s*/i, '').trim();
  var team = parts[parts.length - 1].trim();
  return {
    minute: minute, type: 'substitution', side: getSide(team, homeTeam, awayTeam),
    text: inPlayer, subtext: '↔ ' + outPlayer
  };
}

function getSide(team, homeTeam, awayTeam) {
  if (!team) return '';
  var t = String(team).toLowerCase().trim();
  if (homeTeam && String(homeTeam).toLowerCase().trim() === t) return 'home';
  if (awayTeam && String(awayTeam).toLowerCase().trim() === t) return 'away';
  // Fuzzy match per assegnare il lato
  if (fuzzyTeamMatch(team, homeTeam)) return 'home';
  if (fuzzyTeamMatch(team, awayTeam)) return 'away';
  return String(team);
}

function parseMinuteSort(minute) {
  var m = String(minute).match(/^(\d+)/);
  return m ? parseInt(m[1]) : 999;
}

// ============================================================
// Helper: build scorers string per squadra
// ============================================================
function buildScorers(events) {
  var home = [], away = [], all = [];
  events.forEach(function(e) {
    if (e.type !== 'goal') return;
    var str = e.minute + "' " + e.text + (e.subtext ? ' (' + e.subtext + ')' : '');
    all.push(str);
    if (e.side === 'home') home.push(str);
    else if (e.side === 'away') away.push(str);
  });
  return { home: home.join(', '), away: away.join(', '), all: all.join(', ') };
}

// ============================================================
// Helper: build red cards (solo ROSSI, i gialli mai qui)
// ============================================================
function buildRedCards(events) {
  var home = [], away = [];
  events.forEach(function(e) {
    if (e.type !== 'red_card') return;
    if (e.side === 'home') home.push(e.text);
    else if (e.side === 'away') away.push(e.text);
  });
  return { home: home, away: away };
}

// ============================================================
// Helper: RIEMPI SOLO CAMPI VUOTI
// ============================================================
function buildFillPayload(existing, payload) {
  var fill = {};
  for (var field in payload) {
    var existingVal = existing[field];
    if (isEmpty(existingVal)) {
      fill[field] = payload[field];
    }
  }
  return fill;
}

function isEmpty(val) {
  return val === '' || val === null || val === undefined;
}

// ============================================================
// Helper: conversioni
// ============================================================
function convertDate(val) {
  if (!val) return null;
  if (val instanceof Date) {
    var y = val.getFullYear();
    var m = ('0' + (val.getMonth() + 1)).slice(-2);
    var d = ('0' + val.getDate()).slice(-2);
    return y + '-' + m + '-' + d;
  }
  var s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  var parts = s.split(/[\/\-]/);
  if (parts.length === 3) {
    var dd = parts[0].padStart(2, '0');
    var mm = parts[1].padStart(2, '0');
    var yy = parts[2].length === 2 ? '20' + parts[2] : parts[2];
    return yy + '-' + mm + '-' + dd;
  }
  return null;
}

function parseNumber(val) {
  if (val === '' || val === null || val === undefined) return null;
  var n = parseFloat(String(val).replace(',', '.'));
  return isNaN(n) ? null : n;
}

function mapStatus(stato) {
  var s = String(stato).toLowerCase().trim();
  if (['finita', 'finito', 'terminata', 'conclusa', 'fine', 'ft'].indexOf(s) !== -1) return 'finished';
  if (['live', 'in corso', 'incorso', 'in play'].indexOf(s) !== -1) return 'live';
  return 'scheduled';
}

// ============================================================
// API Base44
// ============================================================
function fetchExistingRecords(mapping) {
  var url = 'https://app.base44.com/api/apps/' + BASE44_APP_ID + '/entities/' + mapping.entity + '?limit=5000';
  if (mapping.competition) {
    url += '&q=' + encodeURIComponent(JSON.stringify({ competition: mapping.competition }));
  }
  var resp = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { 'api_key': BASE44_API_KEY },
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) {
    Logger.log('Errore list ' + mapping.entity + ': HTTP ' + resp.getResponseCode());
    return [];
  }
  return JSON.parse(resp.getContentText());
}

function fetchSquadrePartecipanti(competition) {
  var url = 'https://app.base44.com/api/apps/' + BASE44_APP_ID + '/entities/SquadraPartecipante?limit=5000&q=' +
    encodeURIComponent(JSON.stringify({ competition: competition }));
  var resp = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { 'api_key': BASE44_API_KEY },
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) {
    Logger.log('Errore list SquadraPartecipante: HTTP ' + resp.getResponseCode());
    return [];
  }
  return JSON.parse(resp.getContentText());
}

function createRecord(mapping, payload) {
  var resp = UrlFetchApp.fetch('https://app.base44.com/api/apps/' + BASE44_APP_ID + '/entities/' + mapping.entity, {
    method: 'post',
    headers: { 'api_key': BASE44_API_KEY, 'Content-Type': 'application/json' },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) {
    throw new Error('Create HTTP ' + resp.getResponseCode() + ': ' + resp.getContentText().substring(0, 200));
  }
}

function updateRecord(mapping, recordId, payload) {
  var resp = UrlFetchApp.fetch('https://app.base44.com/api/apps/' + BASE44_APP_ID + '/entities/' + mapping.entity + '/' + recordId, {
    method: 'put',
    headers: { 'api_key': BASE44_API_KEY, 'Content-Type': 'application/json' },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) {
    throw new Error('Update HTTP ' + resp.getResponseCode() + ': ' + resp.getContentText().substring(0, 200));
  }
}

// ============================================================
// Test manuale
// ============================================================
function testSync() {
  var stats = syncAll();
  Logger.log('Risultato: ' + JSON.stringify(stats));
}
