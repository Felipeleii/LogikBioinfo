/*
 * Dashboard interativo - Coorte multicêntrica AMR (UNIFESP/LEMC)
 * Requer: Chart.js (global `Chart`) e js/amr-multicentrico-data.js (window.AMR_DATA)
 * Monta tudo dentro de <div id="amr-dashboard"></div>. Idioma lido de <html lang>.
 */
(function () {
  'use strict';

  const root = document.getElementById('amr-dashboard');
  if (!root || !window.AMR_DATA || typeof Chart === 'undefined') return;

  const langAttr = (document.documentElement.lang || 'pt').toLowerCase();
  const lang = langAttr.startsWith('en') ? 'en' : langAttr.startsWith('es') ? 'es' : 'pt';
  const locale = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' }[lang];

  const T = {
    pt: {
      species: 'Espécie',
      hospital: 'Hospital',
      all: 'Todos',
      allSp: 'Todas',
      kpn: 'K. pneumoniae',
      acb: 'A. baumannii',
      total: 'Isolados',
      kpc: 'KPC-2 / KPC-2*',
      oxa: 'Oxacilinases (OXA-23/72)',
      ndm: 'NDM-1',
      colR: 'Colistina resistente',
      byHospital: 'Isolados por hospital',
      stDist: 'Distribuição de Sequence Types (ST)',
      carbDist: 'Carbapenemases detectadas (WGS)',
      colBySt: 'Colistina por ST (K. pneumoniae)',
      mgrB: 'Status de mgrB nos KPN resistentes à colistina',
      table: 'Tabela de isolados',
      search: 'Buscar (ID, ST, gene, hospital...)',
      id: 'Isolado',
      st: 'ST',
      carb: 'Carbapenemase',
      mic: 'CIM colistina (µg/mL)',
      phen: 'Fenótipo colistina',
      mgrBcol: 'mgrB',
      armA: 'armA',
      showing: (a, b, n) => `Mostrando ${a}–${b} de ${n}`,
      prev: 'Anterior',
      next: 'Próxima',
      none: 'Nenhum isolado encontrado.',
      others: 'Outros',
      resistant: 'Resistente',
      susceptible: 'Sensível',
      sensI: 'S (BrCAST) / I (CLSI)',
      notTested: 'Não testado',
      mg: { intact: 'Íntegro', deletion: 'Deleção estrutural (0% cobertura)', mutation: 'Mutação pontual / truncamento', na: 'Não aplicável' },
      count: 'Isolados',
      reset: 'Limpar filtros',
    },
    en: {
      species: 'Species',
      hospital: 'Hospital',
      all: 'All',
      allSp: 'All',
      kpn: 'K. pneumoniae',
      acb: 'A. baumannii',
      total: 'Isolates',
      kpc: 'KPC-2 / KPC-2*',
      oxa: 'Oxacillinases (OXA-23/72)',
      ndm: 'NDM-1',
      colR: 'Colistin resistant',
      byHospital: 'Isolates by hospital',
      stDist: 'Sequence Type (ST) distribution',
      carbDist: 'Carbapenemases detected (WGS)',
      colBySt: 'Colistin by ST (K. pneumoniae)',
      mgrB: 'mgrB status in colistin-resistant KPN',
      table: 'Isolate table',
      search: 'Search (ID, ST, gene, hospital...)',
      id: 'Isolate',
      st: 'ST',
      carb: 'Carbapenemase',
      mic: 'Colistin MIC (µg/mL)',
      phen: 'Colistin phenotype',
      mgrBcol: 'mgrB',
      armA: 'armA',
      showing: (a, b, n) => `Showing ${a}–${b} of ${n}`,
      prev: 'Previous',
      next: 'Next',
      none: 'No isolates found.',
      others: 'Others',
      resistant: 'Resistant',
      susceptible: 'Susceptible',
      sensI: 'S (BrCAST) / I (CLSI)',
      notTested: 'Not tested',
      mg: { intact: 'Intact', deletion: 'Structural deletion (0% coverage)', mutation: 'Point mutation / truncation', na: 'Not applicable' },
      count: 'Isolates',
      reset: 'Clear filters',
    },
    es: {
      species: 'Especie',
      hospital: 'Hospital',
      all: 'Todos',
      allSp: 'Todas',
      kpn: 'K. pneumoniae',
      acb: 'A. baumannii',
      total: 'Aislados',
      kpc: 'KPC-2 / KPC-2*',
      oxa: 'Oxacilinasas (OXA-23/72)',
      ndm: 'NDM-1',
      colR: 'Colistina resistente',
      byHospital: 'Aislados por hospital',
      stDist: 'Distribución de Sequence Types (ST)',
      carbDist: 'Carbapenemasas detectadas (WGS)',
      colBySt: 'Colistina por ST (K. pneumoniae)',
      mgrB: 'Estado de mgrB en KPN resistentes a colistina',
      table: 'Tabla de aislados',
      search: 'Buscar (ID, ST, gen, hospital...)',
      id: 'Aislado',
      st: 'ST',
      carb: 'Carbapenemasa',
      mic: 'CIM colistina (µg/mL)',
      phen: 'Fenotipo colistina',
      mgrBcol: 'mgrB',
      armA: 'armA',
      showing: (a, b, n) => `Mostrando ${a}–${b} de ${n}`,
      prev: 'Anterior',
      next: 'Siguiente',
      none: 'No se encontraron aislados.',
      others: 'Otros',
      resistant: 'Resistente',
      susceptible: 'Sensible',
      sensI: 'S (BrCAST) / I (CLSI)',
      notTested: 'No evaluado',
      mg: { intact: 'Íntegro', deletion: 'Deleción estructural (0% cobertura)', mutation: 'Mutación puntual / truncamiento', na: 'No aplica' },
      count: 'Aislados',
      reset: 'Limpiar filtros',
    },
  }[lang];

  const COLS = window.AMR_COLUMNS;
  const DATA = window.AMR_DATA.map((r) => Object.fromEntries(COLS.map((c, i) => [c, r[i]])));
  const HOSPITALS = ['HMB', 'HED', 'HSP', 'HGPI', 'HGPE', 'HGG'];
  const PALETTE = ['#22c55e', '#00A6FB', '#FFC914', '#F34213', '#a78bfa', '#f472b6', '#22d3ee', '#9CA3AF'];
  const SP_COLOR = { KPN: '#00A6FB', ACB: '#22c55e' };

  const state = { sp: 'all', hosp: 'all', q: '', sortKey: 'id', sortDir: 1, page: 0 };
  const PAGE_SIZE = 20;
  const charts = {};

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const phenLabel = (p) =>
    p === 'R' ? T.resistant : p === 'S' ? T.susceptible : p === 'S/I' ? T.sensI : T.notTested;

  // ---------- Layout ----------
  const selectCls =
    'bg-gray-900 border border-gray-600 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500';
  const card = 'bg-gray-800 rounded-xl p-4 border border-gray-700';

  root.innerHTML = `
    <div class="flex flex-wrap gap-4 items-end mb-6">
      <label class="flex flex-col text-sm text-gray-400">${T.species}
        <select id="amr-f-sp" class="${selectCls}">
          <option value="all">${T.allSp}</option>
          <option value="KPN">${T.kpn}</option>
          <option value="ACB">${T.acb}</option>
        </select>
      </label>
      <label class="flex flex-col text-sm text-gray-400">${T.hospital}
        <select id="amr-f-hosp" class="${selectCls}">
          <option value="all">${T.all}</option>
          ${HOSPITALS.map((h) => `<option value="${h}">${h}</option>`).join('')}
        </select>
      </label>
      <button id="amr-reset" type="button" class="text-sm text-green-500 hover:text-green-400 py-2">
        <i class="fa-solid fa-rotate-left"></i> ${T.reset}
      </button>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6" id="amr-kpis"></div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="${card}"><h3 class="text-white font-semibold mb-3">${T.byHospital}</h3><div class="amr-chart"><canvas id="amr-c-hosp"></canvas></div></div>
      <div class="${card}"><h3 class="text-white font-semibold mb-3">${T.stDist}</h3><div class="amr-chart"><canvas id="amr-c-st"></canvas></div></div>
      <div class="${card}"><h3 class="text-white font-semibold mb-3">${T.carbDist}</h3><div class="amr-chart"><canvas id="amr-c-carb"></canvas></div></div>
      <div class="${card}" id="amr-box-colst"><h3 class="text-white font-semibold mb-3">${T.colBySt}</h3><div class="amr-chart"><canvas id="amr-c-colst"></canvas></div></div>
      <div class="${card} lg:col-span-2" id="amr-box-mgrb"><h3 class="text-white font-semibold mb-3">${T.mgrB}</h3><div class="amr-chart"><canvas id="amr-c-mgrb"></canvas></div></div>
    </div>

    <div class="${card}">
      <div class="flex flex-wrap justify-between items-center gap-3 mb-3">
        <h3 class="text-white font-semibold">${T.table}</h3>
        <input id="amr-q" type="search" placeholder="${T.search}" aria-label="${T.search}"
          class="${selectCls} w-full sm:w-72" />
      </div>
      <div class="overflow-x-auto">
        <table class="amr-table w-full text-sm text-left">
          <thead><tr>
            ${[
              ['id', T.id],
              ['sp', T.species],
              ['hosp', T.hospital],
              ['st', T.st],
              ['carb', T.carb],
              ['colMic', T.mic],
              ['colPhen', T.phen],
              ['mgrB', T.mgrBcol],
              ['armA', T.armA],
            ]
              .map(([k, l]) => `<th data-key="${k}" scope="col">${l} <i class="fa-solid fa-sort text-gray-500"></i></th>`)
              .join('')}
          </tr></thead>
          <tbody id="amr-tbody"></tbody>
        </table>
      </div>
      <div class="flex flex-wrap justify-between items-center gap-3 mt-3 text-sm text-gray-400">
        <span id="amr-page-info"></span>
        <div class="flex gap-2">
          <button id="amr-prev" type="button" class="px-3 py-1 rounded border border-gray-600 hover:border-green-500 disabled:opacity-40">${T.prev}</button>
          <button id="amr-next" type="button" class="px-3 py-1 rounded border border-gray-600 hover:border-green-500 disabled:opacity-40">${T.next}</button>
        </div>
      </div>
    </div>`;

  // ---------- Helpers ----------
  const filtered = () =>
    DATA.filter((r) => (state.sp === 'all' || r.sp === state.sp) && (state.hosp === 'all' || r.hosp === state.hosp));

  const countBy = (rows, fn) => {
    const m = new Map();
    rows.forEach((r) => {
      const k = fn(r);
      if (k == null) return;
      m.set(k, (m.get(k) || 0) + 1);
    });
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };

  Chart.defaults.color = '#9ca3af';
  Chart.defaults.font.family = "'Poppins', sans-serif";
  Chart.defaults.borderColor = 'rgba(156,163,175,0.15)';

  function draw(id, config) {
    if (charts[id]) charts[id].destroy();
    charts[id] = new Chart(document.getElementById(id), config);
  }

  const baseOpts = { responsive: true, maintainAspectRatio: false };
  const legendPos = () => (window.innerWidth < 640 ? 'bottom' : 'right');

  // ---------- Render ----------
  function renderKpis(rows) {
    const pct = (n) => (rows.length ? ` <span class="text-sm text-gray-400">(${((n / rows.length) * 100).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%)</span>` : '');
    const kpc = rows.filter((r) => r.carb.includes('KPC')).length;
    const oxa = rows.filter((r) => r.carb.includes('OXA')).length;
    const ndm = rows.filter((r) => r.carb.includes('NDM')).length;
    const colR = rows.filter((r) => r.colPhen === 'R').length;
    const items = [
      [T.total, rows.length, 'fa-vials', ''],
      [T.kpc, kpc, 'fa-shield-virus', pct(kpc)],
      [T.oxa, oxa, 'fa-dna', pct(oxa)],
      [T.ndm, ndm, 'fa-triangle-exclamation', pct(ndm)],
      [T.colR, colR, 'fa-pills', pct(colR)],
    ];
    document.getElementById('amr-kpis').innerHTML = items
      .map(
        ([l, v, ic, p]) => `
      <div class="${card}">
        <div class="text-xs uppercase tracking-wide text-gray-400 mb-1"><i class="fa-solid ${ic} text-green-500"></i> ${l}</div>
        <div class="text-3xl font-bold text-white">${v}${p}</div>
      </div>`
      )
      .join('');
  }

  function renderCharts(rows) {
    // Hospital (empilhado por espécie)
    const hosps = HOSPITALS.filter((h) => rows.some((r) => r.hosp === h));
    draw('amr-c-hosp', {
      type: 'bar',
      data: {
        labels: hosps,
        datasets: ['KPN', 'ACB']
          .filter((sp) => rows.some((r) => r.sp === sp))
          .map((sp) => ({
            label: sp === 'KPN' ? T.kpn : T.acb,
            data: hosps.map((h) => rows.filter((r) => r.hosp === h && r.sp === sp).length),
            backgroundColor: SP_COLOR[sp],
            borderRadius: 4,
          })),
      },
      options: { ...baseOpts, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } },
    });

    // ST (top 6 + outros)
    const st = countBy(rows, (r) => r.st);
    const top = st.slice(0, 6);
    const rest = st.slice(6).reduce((s, [, n]) => s + n, 0);
    if (rest) top.push([T.others, rest]);
    draw('amr-c-st', {
      type: 'doughnut',
      data: {
        labels: top.map(([k]) => k),
        datasets: [{ data: top.map(([, n]) => n), backgroundColor: PALETTE, borderColor: '#1f2937', borderWidth: 2 }],
      },
      options: { ...baseOpts, cutout: '55%', plugins: { legend: { position: legendPos() } } },
    });

    // Carbapenemases
    const carb = countBy(rows, (r) => (r.carb === '-' ? null : r.carb));
    draw('amr-c-carb', {
      type: 'bar',
      data: {
        labels: carb.map(([k]) => k),
        datasets: [{ label: T.count, data: carb.map(([, n]) => n), backgroundColor: '#22c55e', borderRadius: 4 }],
      },
      options: { ...baseOpts, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true } } },
    });

    // Colistina por ST (apenas KPN)
    const kpn = rows.filter((r) => r.sp === 'KPN');
    document.getElementById('amr-box-colst').style.display = kpn.length ? '' : 'none';
    document.getElementById('amr-box-mgrb').style.display = kpn.some((r) => r.colPhen === 'R') ? '' : 'none';
    if (kpn.length) {
      const sts = countBy(kpn, (r) => r.st).slice(0, 6).map(([k]) => k);
      const phens = [
        ['R', T.resistant, '#F34213'],
        ['S', T.susceptible, '#22c55e'],
        ['-', T.notTested, '#6b7280'],
      ];
      draw('amr-c-colst', {
        type: 'bar',
        data: {
          labels: sts,
          datasets: phens.map(([p, l, c]) => ({
            label: l,
            data: sts.map((s) => kpn.filter((r) => r.st === s && r.colPhen === p).length),
            backgroundColor: c,
            borderRadius: 4,
          })),
        },
        options: { ...baseOpts, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } },
      });

      const resist = kpn.filter((r) => r.colPhen === 'R');
      const mg = countBy(resist, (r) => r.mgrB);
      const mgColor = { deletion: '#F34213', mutation: '#FFC914', intact: '#00A6FB', na: '#6b7280' };
      draw('amr-c-mgrb', {
        type: 'doughnut',
        data: {
          labels: mg.map(([k]) => T.mg[k]),
          datasets: [{ data: mg.map(([, n]) => n), backgroundColor: mg.map(([k]) => mgColor[k]), borderColor: '#1f2937', borderWidth: 2 }],
        },
        options: { ...baseOpts, cutout: '55%', plugins: { legend: { position: legendPos() } } },
      });
    }
  }

  function renderTable(rows) {
    const q = state.q.trim().toLowerCase();
    let list = q
      ? rows.filter((r) => COLS.some((c) => String(r[c]).toLowerCase().includes(q)))
      : rows.slice();
    const k = state.sortKey;
    list.sort((a, b) => String(a[k]).localeCompare(String(b[k]), undefined, { numeric: true }) * state.sortDir);

    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    state.page = Math.min(state.page, pages - 1);
    const start = state.page * PAGE_SIZE;
    const slice = list.slice(start, start + PAGE_SIZE);

    const phenCls = (p) => (p === 'R' ? 'text-red-400 font-semibold' : p === '-' ? 'text-gray-500' : 'text-green-400');
    document.getElementById('amr-tbody').innerHTML = slice.length
      ? slice
          .map(
            (r) => `<tr>
          <td class="font-mono text-white">${esc(r.id)}</td>
          <td><em>${r.sp === 'KPN' ? T.kpn : T.acb}</em></td>
          <td>${esc(r.hosp)}</td>
          <td>${esc(r.st)}</td>
          <td>${esc(r.carb)}</td>
          <td>${esc(r.colMic)}</td>
          <td class="${phenCls(r.colPhen)}">${esc(phenLabel(r.colPhen))}</td>
          <td>${esc(T.mg[r.mgrB])}</td>
          <td>${r.armA ? esc(r.armA) : '—'}</td>
        </tr>`
          )
          .join('')
      : `<tr><td colspan="9" class="text-center text-gray-500 py-6">${T.none}</td></tr>`;

    document.getElementById('amr-page-info').textContent = list.length
      ? T.showing(start + 1, start + slice.length, list.length)
      : '';
    document.getElementById('amr-prev').disabled = state.page === 0;
    document.getElementById('amr-next').disabled = state.page >= pages - 1;

    root.querySelectorAll('.amr-table th').forEach((th) => {
      const icon = th.querySelector('i');
      icon.className =
        th.dataset.key === state.sortKey
          ? `fa-solid ${state.sortDir === 1 ? 'fa-sort-up' : 'fa-sort-down'} text-green-500`
          : 'fa-solid fa-sort text-gray-500';
    });
  }

  function render(chartsToo = true) {
    const rows = filtered();
    if (chartsToo) {
      renderKpis(rows);
      renderCharts(rows);
    }
    renderTable(rows);
  }

  // ---------- Events ----------
  const spSel = document.getElementById('amr-f-sp');
  const hospSel = document.getElementById('amr-f-hosp');
  spSel.addEventListener('change', (e) => {
    state.sp = e.target.value;
    state.page = 0;
    render();
  });
  hospSel.addEventListener('change', (e) => {
    state.hosp = e.target.value;
    state.page = 0;
    render();
  });
  document.getElementById('amr-reset').addEventListener('click', () => {
    Object.assign(state, { sp: 'all', hosp: 'all', q: '', page: 0 });
    spSel.value = 'all';
    hospSel.value = 'all';
    document.getElementById('amr-q').value = '';
    render();
  });
  document.getElementById('amr-q').addEventListener('input', (e) => {
    state.q = e.target.value;
    state.page = 0;
    render(false);
  });
  document.getElementById('amr-prev').addEventListener('click', () => {
    state.page = Math.max(0, state.page - 1);
    render(false);
  });
  document.getElementById('amr-next').addEventListener('click', () => {
    state.page += 1;
    render(false);
  });
  root.querySelectorAll('.amr-table th').forEach((th) =>
    th.addEventListener('click', () => {
      const key = th.dataset.key;
      state.sortDir = state.sortKey === key ? -state.sortDir : 1;
      state.sortKey = key;
      render(false);
    })
  );

  render();
})();
