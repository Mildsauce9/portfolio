(function () {
  'use strict';
  var DB = window.DB, SCHEMA = window.SCHEMA, CHILDREN = window.CHILDREN, SQL = window.SQL, SITE = window.SITE;
  var $ = function (id) { return document.getElementById(id); };
  var body = document.body, world = $('world'), canvas = $('canvas'), svg = $('links');
  var q = $('q'), results = $('results'), resBody = $('resBody'), resMeta = $('resMeta');
  var cards = {}, pos = {}, view = { tx: 0, ty: 0, s: 1 }, fitView = null, stack = false, mode = 'schema', activeSet = [];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Card positions in world coordinates (the world is 1360 wide).
  var LAYOUT = {
    profile:      { x: 400,  y: 96,  w: 560 },
    experience:   { x: 40,   y: 96,  w: 290 },
    skills:       { x: 40,   y: 360, w: 290 },
    projects:     { x: 1030, y: 96,  w: 290 },
    education:    { x: 1030, y: 390, w: 290 },
    contact:      { x: 1030, y: 570, w: 290 },
    publications: { x: 400,  y: 596, w: 560 }
  };
  var ORDER = ['profile', 'experience', 'skills', 'projects', 'publications', 'education', 'contact'];
  var WORLD_H = 830;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function plural(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  function byId(t, id) { return DB[t].rows.filter(function (r) { return r.id === id; })[0]; }
  function where(t, col, val) { return DB[t].rows.filter(function (r) { return r[col] === val; }); }
  function skillsVia(junction, fk, id) {
    return where(junction, fk, id).map(function (j) { return byId('skills', j.skill_id).name; });
  }
  function link(href, text) { return '<a href="' + esc(href) + '" target="_blank" rel="noopener">' + esc(text) + '</a>'; }

  /* ---------- cards ---------- */
  function preview(list) {
    var out = [], len = 0;
    for (var i = 0; i < list.length && i < 3; i++) { len += list[i].length + 2; if (i && len > 30) break; out.push(list[i]); }
    return out.join(', ');
  }
  function footer(t) {
    var h = '';
    SCHEMA[t].fks.forEach(function (fk) { h += '<div class="fk"><span class="fkb">FK</span>' + fk.col + ' &rarr; ' + fk.ref + '</div>'; });
    var kids = t === 'profile' ? ['experience', 'skills', 'projects', 'education', 'publications', 'contact'] : (CHILDREN[t] || []);
    if (kids.length) h += '<div class="fk kids">&#8627; ' + kids.join(', ') + '</div>';
    return h ? '<div class="fkwrap">' + h + '</div>' : '';
  }
  function rowKV(k, v) { return '<div class="rw"><span class="mute">' + k + '</span><span class="s">\'' + esc(v) + '\'</span></div>'; }

  function cardHTML(t) {
    var r = DB[t].rows, h = '';
    if (t === 'profile') {
      var p = r[0], cur = DB.experience.rows.filter(function (e) { return e.end_date === null; })[0];
      return '<button class="hd" type="button" data-open="profile"><span class="tag">profile</span><span class="meta">1 row · pk id</span></button>' +
        '<div class="hero-body"><h1>' + esc(p.name) + '</h1><div class="headline">' + esc(p.headline) + '</div><div class="sum">' + esc(p.summary) + '</div></div>' +
        rowKV('role', cur.title) + rowKV('company', byId('companies', cur.company_id).name) + rowKV('location', p.location) + footer(t);
    }
    h = '<button class="hd" type="button" data-open="' + t + '"><span class="tag">' + t + '</span><span class="meta">' + plural(r.length, 'row') + '</span></button>';
    if (t === 'experience') r.forEach(function (e) {
      h += '<div class="rw"><span>' + esc(byId('companies', e.company_id).name) + '</span><span class="s">' + e.start_date.slice(0, 4) + (e.end_date ? '' : '–now') + '</span></div>';
    });
    if (t === 'skills') {
      var by = {}, ord = []; r.forEach(function (s) { if (!by[s.category]) { by[s.category] = []; ord.push(s.category); } by[s.category].push(s.name); });
      ord.forEach(function (c) { h += '<div class="rw"><span class="mute">' + c + '</span><span>' + esc(preview(by[c])) + '</span></div>'; });
    }
    if (t === 'projects') {
      r.slice(0, 4).forEach(function (x) { h += '<div class="rw"><span>' + esc(x.name) + '</span></div>'; });
      if (r.length > 4) h += '<div class="rw"><span class="mute">+ ' + (r.length - 4) + ' more</span></div>';
    }
    if (t === 'education') { var e0 = r[0]; h += '<div class="rw"><span>' + esc(e0.degree) + '</span></div><div class="rw"><span class="mute">' + esc(e0.school + ', ' + e0.location) + '</span></div>'; }
    if (t === 'publications') r.forEach(function (x) {
      h += '<div class="rw col"><span class="pubtitle">' + esc(x.title) + '</span><span class="mute">' + esc(x.venue) + ' · ' + x.year + '</span></div>' +
        '<div class="rw"><span class="mute">links</span><span>' + link(x.url, 'paper') + ' &nbsp; ' + link(x.code_url, 'code + weights') + '</span></div>';
    });
    if (t === 'contact') r.forEach(function (c) {
      var val = esc(c.channel === 'linkedin' ? c.value.replace('linkedin.com/', '') : c.value);
      h += '<div class="rw col"><span class="mute">' + c.channel + '</span><span><a href="' + esc(c.href) + '"' + (c.href.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + '>' + val + '</a> <button class="copy" type="button" data-copy="' + esc(c.value) + '" aria-label="Copy ' + c.channel + '">copy</button></span></div>';
    });
    return h + footer(t);
  }

  function buildCards() {
    ORDER.forEach(function (t) {
      var el = document.createElement('div');
      el.className = 'card' + (t === 'profile' ? ' hero' : '');
      el.id = 'card-' + t; el.dataset.table = t;
      el.innerHTML = cardHTML(t);
      el.style.width = LAYOUT[t].w + 'px';
      world.appendChild(el);
      cards[t] = el; pos[t] = { x: LAYOUT[t].x, y: LAYOUT[t].y };
    });
    placeCards();
  }
  function placeCards() { ORDER.forEach(function (t) { cards[t].style.left = pos[t].x + 'px'; cards[t].style.top = pos[t].y + 'px'; }); drawLinks(); }

  /* ---------- relation lines: one per foreign key into profile ---------- */
  function fkLabel(t) { var f = SCHEMA[t].fks.filter(function (x) { return x.ref.indexOf('profile.') === 0; })[0]; return f ? f.col : ''; }
  function drawLinks() {
    if (stack) return;
    var P = cards.profile, px = pos.profile.x, py = pos.profile.y, pw = P.offsetWidth, ph = P.offsetHeight, html = '';
    var slots = { left: 0, right: 0 };
    ORDER.slice(1).forEach(function (t) {
      var c = cards[t], cx = pos[t].x, cy = pos[t].y, cw = c.offsetWidth, ch = c.offsetHeight, d, x1, y1, x2, y2, lx, ly, wide = true;
      var mid = cx + cw / 2;
      if (mid > px && mid < px + pw) {                      // directly above or below the profile card
        var below = cy > py;
        x1 = x2 = Math.min(px + pw - 60, Math.max(px + 60, mid)); y1 = below ? cy : cy + ch; y2 = below ? py + ph : py;
        d = 'M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2; lx = x1 + 8; ly = (y1 + y2) / 2 + 3;
        html += '<path data-t="' + t + '" class="' + (activeSet.indexOf(t) >= 0 ? 'on' : '') + '" d="' + d + '"/><circle cx="' + x1 + '" cy="' + y1 + '" r="4"/><circle cx="' + x2 + '" cy="' + y2 + '" r="4"/>' +
          '<text x="' + lx + '" y="' + ly + '">' + fkLabel(t) + '</text>';
        return;
      }
      var left = mid < px + pw / 2;
      x1 = left ? cx + cw : cx; y1 = cy + 20;
      x2 = left ? px : px + pw; y2 = py + 90 + (slots[left ? 'left' : 'right']++) * 70;
      var dx = Math.max(40, Math.abs(x2 - x1) / 2), sgn = left ? 1 : -1;
      d = 'M' + x1 + ' ' + y1 + ' C' + (x1 + sgn * dx) + ' ' + y1 + ' ' + (x2 - sgn * dx) + ' ' + y2 + ' ' + x2 + ' ' + y2;
      wide = Math.abs(x2 - x1) > 110;
      html += '<path data-t="' + t + '" class="' + (activeSet.indexOf(t) >= 0 ? 'on' : '') + '" d="' + d + '"/><circle cx="' + x1 + '" cy="' + y1 + '" r="4"/><circle cx="' + x2 + '" cy="' + y2 + '" r="4"/>' +
        '<text x="' + ((x1 + x2) / 2) + '" y="' + (Math.min(y1, y2) - 8 + (y1 > y2 ? (y1 - y2) / 2 : 0)) + '" text-anchor="middle">' + (wide ? fkLabel(t) : '') + '</text>';
    });
    svg.innerHTML = html;
  }

  /* ---------- viewport: fit, pan, zoom, drag ---------- */
  function fit() {
    var W = window.innerWidth, H = window.innerHeight;
    var was = stack; stack = W < 980;
    body.classList.toggle('stack', stack);
    if (stack) { world.style.transform = ''; ORDER.forEach(function (t) { cards[t].style.left = ''; cards[t].style.top = ''; }); updateDockVar(); return; }
    if (was) placeCards();
    var s = Math.max(0.5, Math.min(1, W / 1380, (H - 200) / WORLD_H));
    fitView = { s: s, tx: (W - 1360 * s) / 2, ty: Math.max(0, (H - 140 - WORLD_H * s) / 2) };
    view.s = fitView.s; view.tx = fitView.tx; view.ty = fitView.ty;
    apply(); updateDockVar(); drawLinks();
  }
  function apply() {
    world.style.transform = 'translate(' + view.tx + 'px,' + view.ty + 'px) scale(' + view.s + ')';
    canvas.style.setProperty('--bx', view.tx + 'px'); canvas.style.setProperty('--by', view.ty + 'px');
    canvas.style.backgroundSize = (24 * view.s) + 'px ' + (24 * view.s) + 'px';
    $('zoomLabel').textContent = Math.round(view.s * 100) + '%';
  }
  function zoomAt(cx, cy, factor) {
    var ns = Math.max(0.3, Math.min(2.5, view.s * factor)), k = ns / view.s;
    view.tx = cx - (cx - view.tx) * k; view.ty = cy - (cy - view.ty) * k; view.s = ns; apply();
  }
  function updateDockVar() { document.documentElement.style.setProperty('--dockh', document.querySelector('.dock').offsetHeight + 18 + 'px'); }

  canvas.addEventListener('wheel', function (e) {
    if (stack) return;
    e.preventDefault();
    var dy = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
    zoomAt(e.clientX, e.clientY, Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0015)));
  }, { passive: false });
  $('zoomIn').addEventListener('click', function () { zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1.2); });
  $('zoomOut').addEventListener('click', function () { zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1 / 1.2); });
  $('zoomLabel').addEventListener('click', function () { if (fitView) { view.s = fitView.s; view.tx = fitView.tx; view.ty = fitView.ty; apply(); } });

  var drag = null;
  canvas.addEventListener('pointerdown', function (e) {
    if (stack || e.button > 0) return;
    if (e.target.closest('a, .copy')) return;
    var hd = e.target.closest('.hd'), card = e.target.closest('.card');
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false, card: hd && card ? card : null, t: hd && card ? card.dataset.table : null };
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 5) return;
    if (!drag.moved) { drag.moved = true; (drag.card || canvas).classList.add(drag.card ? 'dragging' : 'panning'); }
    drag.x = e.clientX; drag.y = e.clientY;
    if (drag.card) { pos[drag.t].x += dx / view.s; pos[drag.t].y += dy / view.s; placeCards(); }
    else { view.tx += dx; view.ty += dy; apply(); }
  });
  function endDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var d = drag; drag = null;
    canvas.classList.remove('panning'); if (d.card) d.card.classList.remove('dragging');
    if (d.moved) lastDragEnd = Date.now();
    if (!d.moved && d.t) openTable(d.t);
  }
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  /* ---------- queries ---------- */
  var history = [], hi = 0, busy = false;
  function fmt(v) {
    if (v === null || v === undefined) return '<span class="nul">NULL</span>';
    if (typeof v === 'number') return '<span class="n">' + v + '</span>';
    if (typeof v === 'boolean') return '<span class="k">' + v + '</span>';
    if (/^https?:\/\/\S+$/.test(v)) return '<a class="url" href="' + esc(v) + '" target="_blank" rel="noopener">' + esc(v.replace(/^https?:\/\/(www\.)?/, '')) + '</a>';
    if (/^\d{4}-\d{2}(-\d{2})?$/.test(v)) return '<span class="n">' + esc(v) + '</span>';
    return '<span class="s">\'' + esc(v) + '\'</span>';
  }
  // Human label for a parent row, so a bare foreign key such as company_id = 1 reads as "1 Deriv".
  function refLabel(t, id) {
    var row = byId(t, id); if (!row) return '';
    if (t === 'experience') return byId('companies', row.company_id).name + ' · ' + row.title;
    return row.name || row.title || row.degree || row.slug || '';
  }
  function fkOf(table, col) { return (SCHEMA[table] ? SCHEMA[table].fks : []).filter(function (f) { return f.col === col; })[0]; }
  function cell(r, row, c) {
    var v = row[c], fk = r.table && DB[r.table].cols.indexOf(c) >= 0 ? fkOf(r.table, c) : null;
    if (fk && v != null) { var lbl = refLabel(fk.ref.split('.')[0], v); if (lbl) return fmt(v) + ' <span class="ref">' + esc(lbl) + '</span>'; }
    return fmt(v);
  }
  // Column widths from content: ids stay narrow, prose gets the room, nothing needs a sideways scroll.
  function weights(r) {
    return r.cols.map(function (c) {
      var longest = c.length * 0.9, total = 0;
      r.rows.forEach(function (row) { var n = row[c] == null ? 4 : String(row[c]).length; total += n; if (n > longest) longest = n; });
      var avg = r.rows.length ? total / r.rows.length : 4;
      return Math.max(c.length * 0.95 + 2, Math.min(60, Math.max(avg, longest * 0.35)));
    });
  }
  function isMapping(r) {
    return r.table && /_mapping$/.test(r.table) && r.cols.length === DB[r.table].cols.length && r.cols.every(function (c, i) { return c === DB[r.table].cols[i]; });
  }
  // A mapping table read as pairs of ids tells you nothing, so group it: one row per parent with its children.
  function renderMapping(r) {
    var S = SCHEMA[r.table], L = S.fks[0], R = S.fks[1], lt = L.ref.split('.')[0], rt = R.ref.split('.')[0], groups = [], idx = {};
    r.rows.forEach(function (row) {
      var k = row[L.col]; if (idx[k] === undefined) { idx[k] = groups.length; groups.push({ k: k, kids: [] }); }
      groups[idx[k]].kids.push(row[R.col]);
    });
    var h = '<div class="grid-wrap"><table class="grid fixed"><colgroup><col style="width:36%"><col style="width:64%"></colgroup><thead><tr><th scope="col">' + esc(L.col) + '</th><th scope="col">' + esc(R.col) + ' &rarr; ' + esc(rt) + '</th></tr></thead><tbody>';
    groups.forEach(function (g) {
      h += '<tr><td data-label="' + esc(L.col) + '">' + fmt(g.k) + ' <span class="ref">' + esc(refLabel(lt, g.k)) + '</span></td><td data-label="' + esc(R.col) + '"><div class="tags">' +
        g.kids.map(function (id) { return '<span title="' + esc(R.col) + ' = ' + id + '">' + esc(refLabel(rt, id)) + '</span>'; }).join('') + '</div></td></tr>';
    });
    return h + '</tbody></table></div><div class="note">' + plural(r.rows.length, 'mapping') + ' grouped by ' + esc(L.col) + '. Each chip is one row of the raw table.</div>';
  }
  function renderRows(r) {
    if (isMapping(r)) { resBody.innerHTML = renderMapping(r); return; }
    var w = weights(r), sum = w.reduce(function (a, b) { return a + b; }, 0);
    var h = '<div class="grid-wrap"><table class="grid fixed"><colgroup>' + w.map(function (x) { return '<col style="width:' + (x / sum * 100).toFixed(2) + '%">'; }).join('') + '</colgroup><thead><tr>' +
      r.cols.map(function (c) { return '<th scope="col">' + esc(c) + '</th>'; }).join('') + '</tr></thead><tbody>';
    r.rows.forEach(function (row, i) { h += '<tr data-i="' + i + '" tabindex="0">' + r.cols.map(function (c) { return '<td data-label="' + esc(c) + '">' + cell(r, row, c) + '</td>'; }).join('') + '</tr>'; });
    h += '</tbody></table></div><div id="detail"></div>';
    if (r.note) h += '<div class="note">' + esc(r.note) + '</div>';
    resBody.innerHTML = h;
    if (r.rows.length && r.table !== 'highlights' && detailFor(r.table, r.rows[0])) selectRow(r, 0);
    resBody.querySelectorAll('tbody tr').forEach(function (tr) {
      var go = function () { selectRow(r, +tr.dataset.i); };
      tr.addEventListener('click', go);
      tr.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
  }

  function tags(list) { return list.length ? '<div class="tags">' + list.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' : ''; }
  function detailBox(eyebrow, title, items, extra) {
    return '<div class="detail"><div class="eyebrow">' + esc(eyebrow) + '</div><h3>' + esc(title) + '</h3>' +
      (items && items.length ? '<ul>' + items.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '') + (extra || '') + '</div>';
  }
  // Detail panel under the grid: follows foreign keys from the selected row.
  function detailFor(table, row) {
    var s = row && row._src; if (!s) return '';
    if (table === 'experience') {
      var c = byId('companies', s.company_id), hl = where('highlights', 'experience_id', s.id).sort(function (a, b) { return a.position - b.position; }).map(function (x) { return x.text; });
      var cs = where('case_studies', 'experience_id', s.id)[0];
      return detailBox(s.title + ' · ' + s.start_date + ' to ' + (s.end_date || 'now'), c.name + ', ' + c.location, hl,
        tags(skillsVia('experience_skills_mapping', 'experience_id', s.id)) +
        (cs ? '<div><button class="chip" type="button" data-run="SELECT * FROM case_studies WHERE slug = \'' + cs.slug + '\';">Open the ' + esc(cs.title.toLowerCase()) + ' case study</button></div>' : ''));
    }
    if (table === 'projects') return detailBox('project · ' + s.kind, s.name, [s.summary], tags(skillsVia('project_skills_mapping', 'project_id', s.id)) +
      (s.repo_url ? '<div class="links-row">' + link(s.repo_url, 'View the code on GitHub ↗') + '</div>' : '<div class="note-s">No public repo for this one yet.</div>'));
    if (table === 'publications') return detailBox(s.venue + ' · ' + s.year, s.title, ['DOI ' + s.doi],
      '<div class="links-row">' + link(s.url, 'Read the paper on IEEE Xplore ↗') + link(s.code_url, 'Model weights on GitHub ↗') + '</div>');
    if (table === 'education') return detailBox(s.school + ', ' + s.location, s.degree, where('coursework', 'education_id', s.id).map(function (x) { return x.name; }));
    if (table === 'case_studies') return window.CASES[s.slug] ? '<div class="detail">' + window.CASES[s.slug] + '</div>' : '';
    return '';
  }
  function selectRow(r, i) {
    resBody.querySelectorAll('tbody tr').forEach(function (tr) { tr.classList.toggle('sel', +tr.dataset.i === i); });
    $('detail').innerHTML = detailFor(r.table, r.rows[i]);
  }

  function setActive(list) {
    activeSet = (list || []).filter(function (t) { return cards[t]; });
    world.classList.toggle('has-active', activeSet.length > 0);
    ORDER.forEach(function (n) { cards[n].classList.toggle('active', activeSet.indexOf(n) >= 0); });
    svg.querySelectorAll('path').forEach(function (p) { p.classList.toggle('on', activeSet.indexOf(p.dataset.t) >= 0); });
  }
  function showResults() { results.hidden = false; $('tableHint').hidden = true; layoutResults(); updateDockVar(); }
  function closeResults() {
    results.hidden = true; setActive(null);
    $('tabs').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
    $('tableHint').hidden = mode !== 'table';
  }
  // In table view the tab strip wraps onto several rows, so the result panel starts below wherever it ends.
  function layoutResults() {
    var top = mode === 'table' && !stack ? $('tabs').getBoundingClientRect().bottom + 14 : null;
    document.documentElement.style.setProperty('--rtop', top === null ? '' : top + 'px');
  }

  function runQuery(text) {
    if (busy) return;
    var r = SQL.run(text);
    if (r.kind === 'msg' && !r.text && !r.action) return;
    if (r.action === 'clear') { closeResults(); return; }
    var finish = function () {
      busy = false; showResults();
      if (r.kind === 'rows') {
        resMeta.textContent = plural(r.rows.length, 'row') + ' · ' + r.ms + ' ms';
        if (r.rows.length || !r.note) renderRows(r); else resBody.innerHTML = '<div class="msg">0 rows</div><div class="note">' + esc(r.note) + '</div>';
        setActive(r.tables || (r.table ? [r.table] : []));
      } else {
        resMeta.textContent = r.tone === 'err' ? 'error' : 'ok';
        resBody.innerHTML = '<pre class="msg ' + r.tone + '">' + (r.tone === 'err' ? 'ERROR:  ' : '') + esc(r.text) + (r.hint ? '<span class="hint">' + (r.tone === 'err' ? 'HINT:  ' : '') + esc(r.hint) + '</span>' : '') + '</pre>';
        setActive(null);
      }
      if (r.action === 'confetti') celebrate();
      if (/^theme:/.test(r.action || '')) setTheme(r.action.slice(6));
    };
    if (r.delay) { busy = true; resMeta.textContent = 'running…'; showResults(); resBody.innerHTML = '<pre class="msg">running…</pre>'; setTimeout(finish, r.delay); } else finish();
  }

  function submit(text) {
    text = text.trim(); if (!text) return;
    if (history[history.length - 1] !== text) history.push(text);
    hi = history.length;
    runQuery(text);
  }
  $('qform').addEventListener('submit', function (e) { e.preventDefault(); submit(q.value); q.select(); });

  function typeThenRun(text) {
    if (busy) return;
    q.value = ''; q.focus({ preventScroll: true });
    if (reduce) { q.value = text; submit(text); return; }
    var i = 0, step = Math.max(3, Math.min(16, 1300 / text.length));
    var id = setInterval(function () { q.value = text.slice(0, ++i); if (i >= text.length) { clearInterval(id); setTimeout(function () { submit(text); }, 140); } }, step);
  }
  function openTable(t) { typeThenRun('SELECT * FROM ' + t + ';'); }

  q.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp' && history.length) { e.preventDefault(); hi = Math.max(0, hi - 1); q.value = history[hi]; }
    else if (e.key === 'ArrowDown' && history.length) { e.preventDefault(); hi = Math.min(history.length, hi + 1); q.value = history[hi] || ''; }
    else if (e.key === 'Tab' && q.value && !e.shiftKey) {
      var m = q.value.match(/(\w+)$/); if (!m) return;
      var words = SQL.tables.concat(['SELECT', 'FROM', 'WHERE', 'JOIN', 'ORDER BY', 'GROUP BY', 'LIMIT', 'count(*)']);
      var hit = words.filter(function (w) { return w.toLowerCase().indexOf(m[1].toLowerCase()) === 0 && w.toLowerCase() !== m[1].toLowerCase(); })[0];
      if (hit) { e.preventDefault(); q.value = q.value.slice(0, q.value.length - m[1].length) + hit; }
    }
  });

  /* ---------- chips, tabs, buttons ---------- */
  var CHIPS = [
    ['my current role', 'SELECT e.title, c.name AS company, e.start_date FROM experience e JOIN companies c ON c.id = e.company_id WHERE e.end_date IS NULL;'],
    ['fraud platform', 'SELECT * FROM case_studies WHERE slug = \'fraud\';'],
    ['what I\'ve built', 'SELECT name, summary, repo_url FROM projects;'],
    ['help', 'help']
  ];
  $('chips').innerHTML = CHIPS.map(function (c, i) { return '<button class="chip" type="button" data-chip="' + i + '">' + esc(c[0]) + '</button>'; }).join('');
  $('chips').addEventListener('click', function (e) { var b = e.target.closest('[data-chip]'); if (b) typeThenRun(CHIPS[+b.dataset.chip][1]); });

  $('tabs').innerHTML = SQL.tables.map(function (t) { return '<button type="button" role="tab" data-tab="' + t + '"' + (/_mapping$/.test(t) ? ' class="map" title="Mapping table: links two entities many-to-many"' : '') + ' aria-selected="false">' + t + '</button>'; }).join('');
  $('tabs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]'); if (!b) return;
    $('tabs').querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
    runQuery('SELECT * FROM ' + b.dataset.tab + ';');
  });
  $('resClose').addEventListener('click', closeResults);

  // Clicking anywhere that is not the result, the tab strip, the query bar or the header closes the open table.
  var lastDragEnd = 0;
  document.addEventListener('click', function (e) {
    if (results.hidden || !document.body.contains(e.target)) return;
    if (e.target.closest('.results, .tabs, .dock, .top, .zoom, dialog, .toast, [data-open], [data-run]')) return;
    if (Date.now() - lastDragEnd < 80) return;
    closeResults();
  });

  document.addEventListener('click', function (e) {
    var c = e.target.closest('.copy');
    if (c) { copyText(c.dataset.copy); return; }
    var run = e.target.closest('[data-run]'); if (run) { typeThenRun(run.dataset.run); return; }
    var o = e.target.closest('[data-open]'); if (o && stack) openTable(o.dataset.open);
  });
  function copyText(v) {
    var done = function () { toast('Copied ' + v); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(v).then(done, function () { toast(v); }); else toast(v);
  }

  /* ---------- connect dialog ---------- */
  var dlg = $('connect'), cStatus = $('cStatus');
  $('cIntro').textContent = SITE.formEndpoint
    ? 'Leave your email and a note about what you have in mind. I will reply to you directly.'
    : 'Leave your email and a note. This opens your mail app with everything filled in, addressed to ' + SITE.email + '.';
  $('connectBtn').addEventListener('click', function () {
    cStatus.textContent = ''; cStatus.className = 'dlg-status';
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    $('cEmail').focus();
  });
  function closeDlg() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  $('cClose').addEventListener('click', closeDlg);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeDlg(); });
  $('cCopy').addEventListener('click', function () { copyText(SITE.email); });
  $('cForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('cEmail').value.trim(), msg = $('cMsg').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { cStatus.className = 'dlg-status bad'; cStatus.textContent = 'Enter a valid email address, like you@company.com.'; $('cEmail').focus(); return; }
    if (SITE.formEndpoint) {
      $('cSend').disabled = true; cStatus.className = 'dlg-status'; cStatus.textContent = 'Sending…';
      fetch(SITE.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ email: email, message: msg, source: 'portfolio' }) })
        .then(function (r) { if (!r.ok) throw new Error('bad status'); cStatus.className = 'dlg-status good'; cStatus.textContent = 'Sent. I will reply to ' + email + '.'; $('cMsg').value = ''; })
        .catch(function () { cStatus.className = 'dlg-status bad'; cStatus.textContent = 'That did not go through. Email me directly at ' + SITE.email + '.'; })
        .then(function () { $('cSend').disabled = false; });
      return;
    }
    var bodyText = (msg ? msg + '\n\n' : '') + 'My email: ' + email;
    var href = 'mailto:' + SITE.email + '?subject=' + encodeURIComponent('Hello from your portfolio') + '&body=' + encodeURIComponent(bodyText);
    cStatus.className = 'dlg-status good';
    cStatus.innerHTML = 'Opening your mail app. If nothing opens, email me at <b>' + esc(SITE.email) + '</b>.';
    window.location.href = href;
  });

  function setMode(m) {
    mode = m;
    body.classList.toggle('mode-table', m === 'table');
    $('modeSchema').setAttribute('aria-selected', String(m === 'schema'));
    $('modeTable').setAttribute('aria-selected', String(m === 'table'));
    $('modeLabel').textContent = m === 'table' ? 'table view' : 'schema view';
    $('tableview').hidden = m !== 'table';
    if (m === 'table') { $('tabs').querySelector('button').click(); }
    else { closeResults(); layoutResults(); fit(); }
  }
  $('modeSchema').addEventListener('click', function () { if (mode !== 'schema') setMode('schema'); });
  $('modeTable').addEventListener('click', function () { if (mode !== 'table') setMode('table'); });

  /* ---------- theme, toast, confetti, easter eggs ---------- */
  function setTheme(t) {
    document.documentElement.dataset.theme = t === 'dark' ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]').content = t === 'dark' ? '#002B36' : '#FDF6E3';
    store('theme', t);
  }
  var tt;
  function toast(t) { var el = $('toast'); el.textContent = t; el.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { el.classList.remove('show'); }, 2600); }

  function celebrate() {
    var b = $('connectBtn'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
    if (reduce) return;
    var r = $('qform').getBoundingClientRect(), cols = ['#B8420F', '#1F7A5C', '#1F6FB0', '#8A6A00', '#1E7F78'];
    for (var i = 0; i < 36; i++) {
      var d = document.createElement('span'); d.className = 'confetti';
      d.style.left = (r.left + r.width / 2) + 'px'; d.style.top = r.top + 'px'; d.style.background = cols[i % cols.length];
      document.body.appendChild(d);
      var ang = Math.PI * (1 + Math.random()), dist = 120 + Math.random() * 220;
      d.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: 'translate(' + Math.cos(ang) * dist + 'px,' + (Math.sin(ang) * dist + 160) + 'px)', opacity: 0 }], { duration: 1100 + Math.random() * 700, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = (function (n) { return function () { n.remove(); }; })(d);
    }
  }

  var KON = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'], ki = 0;
  document.addEventListener('keydown', function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    var typing = e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName) && (e.target !== q || q.value);
    if (typing) { ki = 0; }
    else { ki = k === KON[ki] ? ki + 1 : (k === KON[0] ? 1 : 0); if (ki === KON.length) { ki = 0; var dark = document.documentElement.dataset.theme !== 'dark'; setTheme(dark ? 'dark' : 'light'); toast(dark ? 'secrets unlocked: dark mode' : 'back to the light'); } }
    if (e.key === '/' && !typing && document.activeElement !== q) { e.preventDefault(); q.focus(); }
    if (e.key === 'Escape' && !dlg.open) { if (document.activeElement === q && q.value) q.value = ''; else closeResults(); }
  });

  $('statusDot').addEventListener('click', function () {
    var d = $('statusDot'); if (d.classList.contains('off')) return;
    d.classList.add('off'); toast('connection lost, reconnecting…');
    setTimeout(function () { d.classList.remove('off'); toast('reconnected. (Did you try turning it off and on again?)'); }, 1800);
  });

  try {
    console.log('%cKailash Ramakrishnan%c\nYou found the console. Try typing  help  in the query bar, or the Konami code on the page.\n' + SITE.email, 'font:700 16px monospace;color:#B8420F', 'font:12px monospace');
  } catch (e) {}

  /* ---------- boot ---------- */
  if (store('theme') === 'dark') setTheme('dark');
  buildCards();
  fit();
  window.addEventListener('resize', function () { fit(); layoutResults(); });
  if (window.ResizeObserver) { var ro = new ResizeObserver(function () { drawLinks(); }); ORDER.forEach(function (t) { ro.observe(cards[t]); }); }
  document.fonts && document.fonts.ready.then(function () { drawLinks(); });
})();
