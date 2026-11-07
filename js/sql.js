// A small SQL engine over window.DB, plus the easter eggs.
// Supports: SELECT [DISTINCT] cols FROM t [alias] [INNER|LEFT] JOIN t2 [alias] ON ... WHERE ... GROUP BY col ORDER BY col [DESC] LIMIT n
// run(query) -> { kind:'rows'|'msg', ..., action?: 'confetti'|'theme:dark'|'theme:light'|'clear', delay?: ms }
(function () {
  var DB = window.DB, SCHEMA = window.SCHEMA;
  var TABLES = Object.keys(DB);

  var JOKES = [
    'A SQL query walks into a bar, walks up to two tables and asks: "Can I join you?"',
    'There are 10 kinds of people: those who understand binary and those who don\'t.',
    'I would tell you a UDP joke, but you might not get it.',
    'A DBA\'s favourite band: The Rolling Indexes.',
    'Why did the developer go broke? They used up all their cache.',
    'SELECT * FROM users WHERE clue > 0; -- 0 rows returned.',
    'It works on my machine. Ship the machine.'
  ];

  function norm(q) { return q.trim().replace(/;+\s*$/, '').replace(/\s+/g, ' '); }
  function msg(text, tone, hint, extra) { var r = { kind: 'msg', text: text, tone: tone || 'info', hint: hint || '' }; if (extra) for (var k in extra) r[k] = extra[k]; return r; }
  function err(text, hint) { return msg(text, 'err', hint); }
  function ms() { return 1 + Math.floor(Math.random() * 8); }
  function fail(text, hint) { var e = new Error(text); e.hint = hint; return e; }

  function lev(a, b) {
    var m = [], i, j;
    for (i = 0; i <= a.length; i++) { m[i] = [i]; }
    for (j = 0; j <= b.length; j++) { m[0][j] = j; }
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return m[a.length][b.length];
  }
  function closest(name, list) {
    var best = null, d = 99;
    list.forEach(function (x) { var v = lev(name.toLowerCase(), x.toLowerCase()); if (v < d) { d = v; best = x; } });
    return d <= 3 ? best : null;
  }

  function parseVal(v) {
    v = v.trim();
    if (/^'.*'$/.test(v) || /^".*"$/.test(v)) return v.slice(1, -1);
    if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
    if (/^null$/i.test(v)) return null;
    if (/^true$/i.test(v)) return true;
    if (/^false$/i.test(v)) return false;
    return v;
  }
  function likeRe(p) { return new RegExp('^' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i'); }
  function splitTop(s) {
    var out = [], d = 0, cur = '', q = '';
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (q) { if (ch === q) q = ''; } else if (ch === '\'' || ch === '"') q = ch;
      else if (ch === '(') d++; else if (ch === ')') d--;
      if (ch === ',' && d === 0 && !q) { out.push(cur.trim()); cur = ''; } else cur += ch;
    }
    out.push(cur.trim());
    return out;
  }

  /* ----- table / column resolution ----- */
  function tableOf(raw) {
    var name = raw.replace(/"/g, '').replace(/^public\./i, '').toLowerCase();
    if (!DB[name]) { var s = closest(name, TABLES); throw fail('relation "' + name + '" does not exist', (s ? 'Did you mean "' + s + '"? ' : '') + 'Type \\dt to list tables.'); }
    return name;
  }
  function allCols(srcs) { var o = []; srcs.forEach(function (s) { DB[s.table].cols.forEach(function (c) { if (o.indexOf(c) < 0) o.push(c); }); }); return o; }
  function colErr(c, srcs) {
    var cols = allCols(srcs), s = closest(c.replace(/^.*\./, ''), cols);
    return fail('column "' + c + '" does not exist', 'Columns here: ' + cols.join(', ') + (s ? '. Did you mean "' + s + '"?' : '.'));
  }
  function resolve(ref, srcs) {
    ref = ref.trim().replace(/"/g, '');
    var m = ref.match(/^(\w+)\.(\w+)$/);
    if (m) {
      var s = srcs.filter(function (x) { return x.alias === m[1].toLowerCase(); })[0];
      if (!s) throw fail('missing FROM-clause entry for table "' + m[1] + '"', 'Tables in this query: ' + srcs.map(function (x) { return x.alias; }).join(', ') + '.');
      if (DB[s.table].cols.indexOf(m[2]) < 0) throw fail('column ' + ref + ' does not exist', 'Columns of ' + s.table + ': ' + DB[s.table].cols.join(', ') + '.');
      return { alias: s.alias, col: m[2] };
    }
    if (!/^\w+$/.test(ref)) return null;
    var hits = srcs.filter(function (x) { return DB[x.table].cols.indexOf(ref) >= 0; });
    if (hits.length > 1) throw fail('column reference "' + ref + '" is ambiguous', 'Qualify it with a table alias, e.g. ' + hits[0].alias + '.' + ref + '.');
    return hits.length ? { alias: hits[0].alias, col: ref } : null;
  }
  function getv(rs, r) { var row = rs[r.alias]; return row ? row[r.col] : null; }

  /* ----- conditions ----- */
  function cond(rs, c, srcs) {
    c = c.trim();
    var m = c.match(/^([\w."]+)\s+is\s+(not\s+)?null$/i);
    if (m) { var r0 = resolve(m[1], srcs); if (!r0) throw colErr(m[1], srcs); var n = getv(rs, r0) == null; return m[2] ? !n : n; }
    m = c.match(/^([\w."]+)\s+is\s+(.+)$/i);   // lenient: "col is 'x'" behaves like "col = 'x'"
    if (m) c = m[1] + ' = ' + m[2];
    m = c.match(/^([\w."]+)\s*(=|!=|<>|>=|<=|>|<|not like|like|ilike)\s*(.+)$/i);
    if (!m) throw fail('syntax error at or near "' + c + '"', 'Conditions look like: column = \'value\', column LIKE \'%x%\', column IS NULL.');
    var L = resolve(m[1], srcs); if (!L) throw colErr(m[1], srcs);
    var op = m[2].toLowerCase(), rhs = m[3].trim(), R = null;
    if (!/^['"\d-]/.test(rhs) && !/^(null|true|false)$/i.test(rhs)) R = resolve(rhs, srcs);
    var a = getv(rs, L), b = R ? getv(rs, R) : parseVal(rhs);
    if (op === 'like' || op === 'ilike' || op === 'not like') {
      var hit = a != null && likeRe(String(b)).test(String(a));
      return op === 'not like' ? !hit : hit;
    }
    if (a == null || b == null) return false;
    if (typeof a === 'string') a = a.toLowerCase();
    if (typeof b === 'string') b = b.toLowerCase();
    /* eslint-disable eqeqeq */
    switch (op) {
      case '=': return a == b;
      case '!=': case '<>': return a != b;
      case '>': return a > b; case '<': return a < b;
      case '>=': return a >= b; case '<=': return a <= b;
    }
    return false;
  }
  function whereOk(rs, str, srcs) {
    return str.split(/\s+or\s+/i).some(function (g) { return g.split(/\s+and\s+/i).every(function (c) { return cond(rs, c, srcs); }); });
  }

  /* ----- FROM / JOIN ----- */
  function parseFrom(str) {
    var parts = str.split(/\s+((?:inner\s+|left\s+(?:outer\s+)?)?join)\s+/i);
    var m = parts[0].match(/^([\w."]+)(?:\s+(?:as\s+)?(\w+))?$/);
    if (!m) throw fail('syntax error in FROM clause', 'Shape: FROM table [alias] [JOIN table2 [alias] ON a.col = b.col].');
    var srcs = [{ table: tableOf(m[1]), alias: (m[2] || m[1]).replace(/"/g, '').replace(/^public\./i, '').toLowerCase() }], joins = [];
    for (var i = 1; i < parts.length; i += 2) {
      var mm = parts[i + 1].match(/^([\w."]+)(?:\s+(?:as\s+)?(\w+))?\s+on\s+(.+)$/i);
      if (!mm) throw fail('syntax error in JOIN', 'Every JOIN needs an ON clause, e.g. JOIN companies c ON c.id = e.company_id.');
      var s = { table: tableOf(mm[1]), alias: (mm[2] || mm[1]).replace(/"/g, '').replace(/^public\./i, '').toLowerCase() };
      if (srcs.some(function (x) { return x.alias === s.alias; })) throw fail('table name "' + s.alias + '" specified more than once', 'Give each table its own alias.');
      srcs.push(s);
      joins.push({ left: /left/i.test(parts[i]), src: s, on: mm[3] });
    }
    return { srcs: srcs, joins: joins };
  }

  function sortVal(x) { return typeof x === 'string' ? x.toLowerCase() : x; }

  function select(q) {
    var m = q.match(/^select\s+(distinct\s+)?(.+?)\s+from\s+(.+?)(?:\s+where\s+(.+?))?(?:\s+group\s+by\s+([\w.]+))?(?:\s+order\s+by\s+([\w.]+)(?:\s+(asc|desc))?)?(?:\s+limit\s+(\d+))?$/i);
    if (!m) return err('syntax error in SELECT', 'Shape: SELECT cols FROM table [JOIN ... ON ...] [WHERE ...] [GROUP BY col] [ORDER BY col [DESC]] [LIMIT n]. Type help for examples.');
    var distinct = !!m[1], colSpec = m[2].trim(), where = m[4], group = m[5], order = m[6], dir = (m[7] || 'asc').toLowerCase(), limit = m[8];
    try {
      var from = parseFrom(m[3]), srcs = from.srcs, base = srcs[0];
      // build row sets (nested-loop joins)
      var sets = DB[base.table].rows.map(function (r) { var o = {}; o[base.alias] = r; return o; });
      from.joins.forEach(function (j) {
        var next = [];
        sets.forEach(function (rs) {
          var hit = false;
          DB[j.src.table].rows.forEach(function (r2) {
            var t = Object.assign({}, rs); t[j.src.alias] = r2;
            if (whereOk(t, j.on, srcs)) { next.push(t); hit = true; }
          });
          if (!hit && j.left) { var t2 = Object.assign({}, rs); t2[j.src.alias] = null; next.push(t2); }
        });
        sets = next;
      });
      if (where) sets = sets.filter(function (rs) { return whereOk(rs, where, srcs); });

      // projection
      var items = splitTop(colSpec), proj = [], hasCount = false;
      items.forEach(function (it) {
        var mm;
        if (it === '*') { srcs.forEach(function (s) { DB[s.table].cols.forEach(function (c) { proj.push({ ref: { alias: s.alias, col: c }, label: c, q: s.alias + '.' + c }); }); }); return; }
        if ((mm = it.match(/^(\w+)\.\*$/))) {
          var s = srcs.filter(function (x) { return x.alias === mm[1].toLowerCase(); })[0];
          if (!s) throw fail('missing FROM-clause entry for table "' + mm[1] + '"');
          DB[s.table].cols.forEach(function (c) { proj.push({ ref: { alias: s.alias, col: c }, label: c, q: s.alias + '.' + c }); }); return;
        }
        if ((mm = it.match(/^count\(\*\)(?:\s+as\s+(\w+))?$/i))) { hasCount = true; proj.push({ count: true, label: mm[1] || 'count' }); return; }
        mm = it.match(/^([\w."]+)(?:\s+as\s+(\w+))?$/i);
        if (!mm) throw fail('syntax error at or near "' + it + '"', 'Select columns by name, alias.name, * or count(*).');
        var ref = resolve(mm[1], srcs); if (!ref) throw colErr(mm[1], srcs);
        proj.push({ ref: ref, label: mm[2] || ref.col, q: ref.alias + '.' + ref.col, custom: !!mm[2] });
      });
      // disambiguate duplicate labels (e.g. e.id and c.id)
      var dup = {}; proj.forEach(function (p) { dup[p.label] = (dup[p.label] || 0) + 1; });
      proj.forEach(function (p) { if (!p.count && !p.custom && dup[p.label] > 1) p.label = p.q; });

      var out, labels = proj.map(function (p) { return p.label; });
      if (group) {
        var g = resolve(group, srcs); if (!g) throw colErr(group, srcs);
        proj.forEach(function (p) { if (!p.count && (p.ref.alias !== g.alias || p.ref.col !== g.col)) throw fail('column "' + p.q + '" must appear in the GROUP BY clause or be used in an aggregate'); });
        var buckets = {}, keys = [];
        sets.forEach(function (rs) { var k = String(getv(rs, g)); if (!buckets[k]) { buckets[k] = { n: 0, rs: rs }; keys.push(k); } buckets[k].n++; });
        out = keys.map(function (k) { var o = {}; proj.forEach(function (p) { o[p.label] = p.count ? buckets[k].n : getv(buckets[k].rs, p.ref); }); return o; });
      } else if (hasCount) {
        if (proj.some(function (p) { return !p.count; })) throw fail('count(*) mixed with plain columns needs GROUP BY', 'Add GROUP BY <column>.');
        var o1 = {}; proj.forEach(function (p) { o1[p.label] = sets.length; }); out = [o1];
      } else {
        out = sets.map(function (rs) { var o = {}; proj.forEach(function (p) { o[p.label] = getv(rs, p.ref); }); o._src = rs[base.alias]; o._rs = rs; return o; });
      }
      if (distinct) { var seen = {}; out = out.filter(function (o) { var k = JSON.stringify(labels.map(function (l) { return o[l]; })); if (seen[k]) return false; seen[k] = 1; return true; }); }
      if (order) {
        var key = null;
        if (labels.indexOf(order) >= 0) key = function (o) { return o[order]; };
        else { var og = resolve(order, srcs); if (!og) throw colErr(order, srcs); key = function (o) { return o._rs ? getv(o._rs, og) : null; }; }
        out.sort(function (a, b) {
          var x = sortVal(key(a)), y = sortVal(key(b));
          if (x == null && y == null) return 0; if (x == null) return dir === 'desc' ? -1 : 1; if (y == null) return dir === 'desc' ? 1 : -1;
          return (x < y ? -1 : x > y ? 1 : 0) * (dir === 'desc' ? -1 : 1);
        });
      }
      if (limit) out = out.slice(0, Number(limit));
      return { kind: 'rows', table: base.table, tables: srcs.map(function (s) { return s.table; }), cols: labels, rows: out, ms: ms() };
    } catch (e) { return err(e.message, e.hint); }
  }

  /* ----- catalog queries ----- */
  function rowsOf(cols, rows) { return { kind: 'rows', table: null, cols: cols, rows: rows, ms: ms() }; }
  function tablesList() {
    return rowsOf(['schema', 'name', 'rows', 'primary_key'], TABLES.map(function (t) { return { schema: 'public', name: t, rows: DB[t].rows.length, primary_key: SCHEMA[t].pk.join(', ') }; }));
  }
  function constraints() {
    var rows = [];
    TABLES.forEach(function (t) {
      rows.push({ table_name: t, constraint_type: 'PRIMARY KEY', column_name: SCHEMA[t].pk.join(', '), references: null });
      SCHEMA[t].fks.forEach(function (fk) { rows.push({ table_name: t, constraint_type: 'FOREIGN KEY', column_name: fk.col, references: fk.ref }); });
    });
    return rowsOf(['table_name', 'constraint_type', 'column_name', 'references'], rows);
  }
  function describe(t) {
    t = t.toLowerCase();
    if (!DB[t]) return err('relation "' + t + '" does not exist', closest(t, TABLES) ? 'Did you mean "' + closest(t, TABLES) + '"?' : 'Type \\dt to list tables.');
    var S = SCHEMA[t];
    var res = rowsOf(['column', 'type', 'constraint'], DB[t].cols.map(function (c) {
      var v = DB[t].rows[0][c], fk = S.fks.filter(function (f) { return f.col === c; })[0], parts = [];
      if (S.pk.indexOf(c) >= 0) parts.push(S.pk.length > 1 ? 'PRIMARY KEY (composite)' : 'PRIMARY KEY');
      if (fk) parts.push('FOREIGN KEY → ' + fk.ref);
      var type = typeof v === 'number' ? 'integer' : 'text';
      return { column: c, type: type, constraint: parts.length ? parts.join(', ') : null };
    }));
    res.table = t; res.tables = [t];
    return res;
  }

  var HELP = 'Try:\n' +
    '  SELECT * FROM experience ORDER BY start_date DESC;\n' +
    '  SELECT name FROM skills WHERE category = \'database\';\n' +
    '  SELECT c.name, e.title FROM experience e JOIN companies c ON c.id = e.company_id;\n' +
    '  SELECT s.name FROM skills s JOIN experience_skills_mapping es ON es.skill_id = s.id WHERE es.experience_id = 1;\n' +
    '  SELECT category, count(*) FROM skills GROUP BY category;\n\n' +
    'Commands:  \\dt   \\d <table>   \\theme dark|light   clear\n' +
    'Catalog:   SELECT * FROM information_schema.table_constraints;\n' +
    'Tables:    ' + TABLES.join(', ') + '\n\n' +
    'Some things in here are hidden. Poke around.';

  function run(raw) {
    var q = norm(raw), l = q.toLowerCase();
    if (!q) return msg('', 'info');

    if (l === 'help' || l === '\\?' || l === '?' || l === '\\h') return msg(HELP, 'info');
    if (l === '\\dt' || l === 'show tables' || /from (information_schema\.tables|pg_tables)$/.test(l)) return tablesList();
    if (/from (information_schema\.(table_constraints|referential_constraints)|pg_constraint)$/.test(l)) return constraints();
    var d = l.match(/^\\d\s+(\w+)$/) || l.match(/^describe (\w+)$/); if (d) return describe(d[1]);
    var th = l.match(/^\\theme\s+(dark|light)$/); if (th) return msg('Theme set to ' + th[1] + '.', 'ok', '', { action: 'theme:' + th[1] });
    if (l === 'clear' || l === 'cls') return { kind: 'msg', text: '', action: 'clear' };
    if (l === '\\q' || l === 'exit' || l === 'quit') return msg('Leaving already? Email me first: reachkailash03@gmail.com', 'info');

    if (/^(sudo|su|rm|chmod|chown)\b/.test(l)) return msg('visitor is not in the sudoers file. This incident will be reported.', 'err');
    if (/^xyzzy$/.test(l)) return msg('Nothing happens.', 'info');
    if (/^whoami$/.test(l) || l === 'select current_user') return rowsOf(['current_user'], [{ current_user: 'visitor' }]);
    if (l === 'select version()') return rowsOf(['version'], [{ version: 'PostgreSQL, portfolio edition: a few hundred lines of JavaScript pretending very hard' }]);
    if (l === 'select now()' || l === 'select current_timestamp') return rowsOf(['now'], [{ now: new Date().toISOString().replace('T', ' ').slice(0, 19) }]);
    if (l === 'select * from pg_stat_activity') return rowsOf(['pid', 'usename', 'state', 'query'], [{ pid: 4242, usename: 'visitor', state: 'active', query: q }]);
    if (/^select\s+\*\s+from\s+jokes$/.test(l)) return rowsOf(['joke'], [{ joke: JOKES[Math.floor(Math.random() * JOKES.length)] }]);
    if (/^select\s+\*\s+from\s+secrets$/.test(l)) return err('permission denied for table secrets', 'Some doors open with a classic: up, up, down, down, left, right, left, right, B, A.');
    if (/^select\s+\*\s+from\s+offers$/.test(l)) return { kind: 'rows', table: null, cols: ['id', 'company', 'role', 'note'], rows: [], ms: ms(), note: 'Table is empty. INSERT INTO offers VALUES (...) to change that.' };
    var sl = l.match(/^select\s+pg_sleep\((\d+(?:\.\d+)?)\)$/);
    if (sl) { var s = Math.min(3, Number(sl[1])); return msg('pg_sleep(' + sl[1] + ') returned after ' + s + 's. Slow queries are a specialty: one container went from 300% CPU to 85%.', 'ok', s < Number(sl[1]) ? 'Capped at 3s. Visitors have things to do.' : '', { delay: s * 1000 }); }
    if (/^select\s+[\d\s+\-*\/().]+$/.test(l)) { try { var v = Function('"use strict";return (' + l.slice(7) + ')')(); return rowsOf(['?column?'], [{ '?column?': v }]); } catch (e) { return err('syntax error'); } }
    if (/^explain/.test(l)) {
      var t = (l.match(/from\s+(\w+)/) || [])[1] || 'profile', n = DB[t] ? DB[t].rows.length : 1;
      return msg('Seq Scan on ' + t + '  (cost=0.00..' + (1 + n * 0.02).toFixed(2) + ' rows=' + n + ' width=64)\nPlanning time: 0.1 ms\nExecution time: 0.2 ms\n\nIt is a portfolio. A sequential scan is fine.', 'info');
    }
    if (/('|")\s*or\s*['"]?\w+['"]?\s*=\s*['"]?\w+|--|;\s*(drop|delete|update|insert)/i.test(q) && !/^insert/.test(l))
      return msg('Nice injection attempt. Queries here are parameterised, and securing a PII-handling API against exactly this is part of my day job. 0 rows.', 'info');
    if (/^insert\s+into\s+offers/.test(l))
      return msg('INSERT 0 1\nOffer received. Delivery is the old-fashioned way though: use the Connect button, or reachkailash03@gmail.com', 'ok', 'The Connect button is lighting up.', { action: 'confetti' });
    if (/^(drop|truncate|delete|update|alter|create|grant|insert)\b/.test(l)) {
      var verb = l.split(' ')[0].toUpperCase(), tn = (l.match(/^(?:drop|truncate)\s+(?:table\s+)?(?:if exists\s+)?([\w.]+)/) || [])[1], hint = 'Nice try, though.';
      if (verb === 'DROP' && tn) {
        tn = tn.replace(/^public\./, '');
        hint = tn === 'profile' ? 'DROP TABLE profile? That is me.'
          : tn === 'contact' ? 'DROP TABLE contact? Then how would anyone hire me?'
          : DB[tn] ? 'DROP TABLE ' + tn + '? Foreign keys would have words with you.'
          : 'DROP TABLE ' + tn + '? It does not even exist.';
      }
      return err('permission denied: ' + verb + ' is not allowed for role "visitor" (read-only)', hint);
    }

    if (/^select\b/.test(l)) {
      if (!/\sfrom\s/.test(l)) return err('syntax error at or near "' + q.slice(0, 24) + '"', 'Did you forget FROM? Type help for examples.');
      return select(q);
    }
    return err('syntax error at or near "' + q.split(' ')[0] + '"', 'Type help for a list of things that work.');
  }

  window.SQL = { run: run, tables: TABLES };
})();
