// The "database". Everything the site shows and every query runs against this.
// It is normalized: surrogate integer primary keys, foreign keys, junction tables for
// many-to-many links. `window.SCHEMA` declares the constraints; the check at the bottom
// throws on load if any foreign key points at a row that does not exist.
(function () {
  var profile = [{
    id: 1,
    name: 'Kailash Ramakrishnan',
    headline: 'Backend AI Engineer. Go, Python, PostgreSQL.',
    location: 'Dubai, UAE',
    summary: 'I own production systems end to end: requirements, design, code, deployment and on-call. Right now that means fraud, AML and compliance pipelines at Deriv.'
  }];

  var companies = [
    { id: 1, name: 'Deriv', location: 'Dubai, UAE' },
    { id: 2, name: 'Condo Protego', location: 'Dubai, UAE' },
    { id: 3, name: 'Mannai Corporation', location: 'Doha, Qatar' }
  ];

  // Skill catalog: one row per technology, referenced by experience and projects.
  var catalog = {
    language: ['Go', 'Python', 'SQL', 'JavaScript', 'C#', 'HTML', 'CSS'],
    backend: ['FastAPI', 'Flask', 'Django', 'React', 'Next.js', 'TypeScript', '.NET Core', 'REST APIs', 'API gateway security', 'Docker', 'OAuth', 'Gmail API', 'Tilt', 'sqlc'],
    ai: ['LLM APIs', 'OpenAI', 'Gemini', 'RAG pipelines', 'Agent orchestration', 'Tool calling', 'MCP', 'Semantic search', 'Vector databases', 'Pinecone', 'LangChain', 'LangGraph'],
    database: ['PostgreSQL', 'Citus columnar', 'Redis', 'MongoDB', 'SQLite', 'Query optimization', 'Streaming ETL'],
    cloud: ['GCP', 'GKE', 'CloudSQL', 'GitHub Actions', 'OpenTelemetry'],
    practice: ['AI-assisted engineering', 'Code review', 'System design', 'Performance tuning', 'Data structures and algorithms']
  };
  var skills = [], skillId = {};
  Object.keys(catalog).forEach(function (cat) {
    catalog[cat].forEach(function (n) { var id = skills.length + 1; skillId[n] = id; skills.push({ id: id, profile_id: 1, name: n, category: cat }); });
  });

  var exp = [
    {
      company_id: 1, title: 'AI Engineer', start_date: '2025-12', end_date: null,
      stack: ['Go', 'Python', 'PostgreSQL', 'Citus columnar', 'Redis', 'GKE', 'OpenTelemetry', 'Agent orchestration'],
      h: [
        'Embedded with compliance, finance and anti-fraud teams: studied each manual workflow first, then turned stakeholder SOPs into production systems and AI agents.',
        'Built AI agents for AML, compliance and fraud that detect suspicious activity, triage alerts and either close the case or escalate to a human reviewer. The AML system replaced manual work done by three people.',
        'Built the anti-fraud platform from scratch: an OLTP database turned into a low-cost columnar analytical store for near real-time analysis of high-volume trading and payment data, fed by streaming ingestion that powers fraud signals and client clustering.',
        'Cut a fraud container\'s CPU load from 300% to 85% by running backfill, detection and materialized-view generation in parallel with throttling.',
        'Built a CEP rule engine on a blue-green deployment that backfills a month or more of history whenever a new fraud rule ships, without lock contention or deadlocks on WAL-replayed replicas.',
        'Built a vector-similarity detector that catches duplicate account registrations at onboarding, before they reach end users.',
        'Built AML monitoring that aggregates client activity over rolling windows, flags threshold breaches and generates compliance reports. A geolocation monitor flags access that conflicts with a client\'s declared jurisdiction and starts enhanced due diligence outreach.',
        'Designed idempotent ingestion with watermark cursors that advance only after commit. Restored the trading database after a low-disk outage with no data loss.',
        'Built machine-to-machine authentication so agents and services can securely read compliance data, adopted by multiple teams.',
        'Built ReAct-style agents on OpenClaw that call tools at each step, reason over the results and pick the next action, without a graph orchestration framework.',
        'Secured the API layer, gateway and web frontend handling client PII against XSS and SQL injection.',
        'Owns the central Go data-access layer connected to all production databases: requirements, back-tested SQL, monitoring, health checks and incident resolution.'
      ]
    },
    {
      company_id: 2, title: 'AI Engineer', start_date: '2025-02', end_date: '2025-07',
      stack: ['Python', 'Docker', 'GCP', 'OAuth'],
      h: [
        'Built backend AI systems and automation tools, improving process accuracy and time efficiency by 60%.',
        'Containerized applications with Docker and CI/CD with automated testing, deployed to GCP with Google OAuth for secure internal access.',
        'Refactored legacy Python scripts into deployable, version-controlled applications.'
      ]
    },
    {
      company_id: 3, title: 'Software Administrator Intern', start_date: '2023-06', end_date: '2023-08',
      stack: ['C#', '.NET Core', 'SQL', 'Python', 'REST APIs'],
      h: [
        'Built dynamic web applications with MVC models in .NET Core and integrated RESTful APIs.',
        'Implemented SQL database connectivity and data transfer processes using Python.'
      ]
    }
  ];
  var experience = [], highlights = [], experience_skills_mapping = [];
  exp.forEach(function (e, i) {
    var id = i + 1;
    experience.push({ id: id, profile_id: 1, company_id: e.company_id, title: e.title, start_date: e.start_date, end_date: e.end_date });
    e.h.forEach(function (t, j) { highlights.push({ id: highlights.length + 1, experience_id: id, position: j + 1, text: t }); });
    e.stack.forEach(function (n) { experience_skills_mapping.push({ experience_id: id, skill_id: skillId[n] }); });
  });

  var G = 'https://github.com/Mildsauce9/';
  var projDefs = [
    { name: 'Stock Intelligence Chatbot', kind: 'personal', repo: G + 'Stock-data-retrieval', stack: ['OpenAI', 'Gemini', 'Pinecone', 'RAG pipelines'],
      summary: 'Real-time financial chatbot over 25K+ news articles. A RAG pipeline chunks and embeds documents into Pinecone, retrieves context by similarity search and grounds the answer with OpenAI and Gemini APIs, with an NLP metadata-extraction pipeline. 95% query accuracy.' },
    { name: 'MCP Tool-Calling Environment', kind: 'personal', repo: null, stack: ['MCP', 'Tool calling'],
      summary: 'A Model Context Protocol server environment that lets LLMs discover and call external tools on their own inside a multi-step reasoning loop.' },
    { name: 'DocuMentor', kind: 'personal', repo: G + 'DocuMentor', stack: ['Flask', 'Python', 'Semantic search'],
      summary: 'Multi-user conversational document assistant on a Flask backend with semantic search, reducing information retrieval time by 70%.' },
    { name: 'GitViz', kind: 'personal', repo: G + 'gitviz', stack: ['FastAPI', 'Python', 'LangChain', 'Gemini', 'MongoDB', 'React'],
      summary: 'Analyzes a GitHub repository through the API without cloning it. LangChain and Gemini map code structure and call relationships, then an interactive React dashboard renders the execution flow as Mermaid diagrams with live progress over server-sent events.' },
    { name: 'ChatMail', kind: 'personal', repo: G + 'ChatMail', stack: ['FastAPI', 'Python', 'Next.js', 'TypeScript', 'OAuth', 'Gmail API', 'SQLite'],
      summary: 'Email client that reads your Gmail through Google OAuth and presents messages as chat-style conversations instead of isolated emails.' },
    { name: 'CV Generate Bot', kind: 'personal', repo: G + 'cv-generate-bot', stack: ['Python'],
      summary: 'Takes a job description and generates a CV tailored to that role.' },
    { name: 'Flight Delay Tracker', kind: 'personal', repo: G + 'flight-delay-tracker', stack: [],
      summary: 'Uses live and historical Bureau of Transportation Statistics data to find and predict patterns in flight delays.' },
    { name: '1MRPS', kind: 'personal', repo: G + '1MRPS', stack: ['Go', 'Docker', 'sqlc', 'Tilt'],
      summary: 'Go backend service with sqlc-generated database access and a Tilt and Docker Compose local environment.' }
  ];
  var projects = [], project_skills_mapping = [];
  projDefs.forEach(function (p, i) {
    projects.push({ id: i + 1, profile_id: 1, name: p.name, kind: p.kind, summary: p.summary, repo_url: p.repo });
    p.stack.forEach(function (n) { project_skills_mapping.push({ project_id: i + 1, skill_id: skillId[n] }); });
  });

  var education = [{ id: 1, profile_id: 1, degree: 'B.E. Computer Science', school: 'BITS Pilani', location: 'Dubai' }];
  var coursework = ['Data Structures and Algorithms', 'Database Systems', 'Data Mining', 'Foundations of Data Science']
    .map(function (n, i) { return { id: i + 1, education_id: 1, name: n }; });

  var publications = [{
    id: 1, profile_id: 1,
    title: 'Ensemble Transfer Learning for Accurate Malaria Detection with Stage Classification & Explainable AI',
    venue: 'MoSICom (IEEE)', year: 2024, doi: '10.1109/MoSICom60525.2024.10881070',
    url: 'https://ieeexplore.ieee.org/document/10881070',
    code_url: 'https://github.com/Mildsauce9/Ensemble-Transfer-Learning-for-Accurate-Malaria-Detection-with-Stage-Classification-Explainable-AI.-'
  }];

  var contact = [
    { id: 1, profile_id: 1, channel: 'email', value: 'reachkailash03@gmail.com', href: 'mailto:reachkailash03@gmail.com' },
    { id: 2, profile_id: 1, channel: 'linkedin', value: 'linkedin.com/in/connect-with-kailash', href: 'https://linkedin.com/in/connect-with-kailash' },
    { id: 3, profile_id: 1, channel: 'github', value: 'github.com/Mildsauce9', href: 'https://github.com/Mildsauce9' }
  ];

  var case_studies = [{
    id: 1, experience_id: 1, slug: 'fraud', title: 'Anti-fraud platform',
    summary: 'One system for fraud that used to need manual intervention and several separate alerting tools.'
  }];

  function T(cols, rows) { return { cols: cols, rows: rows }; }
  window.DB = {
    profile: T(['id', 'name', 'headline', 'location', 'summary'], profile),
    companies: T(['id', 'name', 'location'], companies),
    experience: T(['id', 'profile_id', 'company_id', 'title', 'start_date', 'end_date'], experience),
    highlights: T(['id', 'experience_id', 'position', 'text'], highlights),
    skills: T(['id', 'profile_id', 'name', 'category'], skills),
    experience_skills_mapping: T(['experience_id', 'skill_id'], experience_skills_mapping),
    projects: T(['id', 'profile_id', 'name', 'kind', 'summary', 'repo_url'], projects),
    project_skills_mapping: T(['project_id', 'skill_id'], project_skills_mapping),
    education: T(['id', 'profile_id', 'degree', 'school', 'location'], education),
    coursework: T(['id', 'education_id', 'name'], coursework),
    publications: T(['id', 'profile_id', 'title', 'venue', 'year', 'doi', 'url', 'code_url'], publications),
    contact: T(['id', 'profile_id', 'channel', 'value', 'href'], contact),
    case_studies: T(['id', 'experience_id', 'slug', 'title', 'summary'], case_studies)
  };

  // Constraints. pk = primary key columns, fks = foreign keys.
  window.SCHEMA = {
    profile: { pk: ['id'], fks: [] },
    companies: { pk: ['id'], fks: [] },
    experience: { pk: ['id'], fks: [{ col: 'profile_id', ref: 'profile.id' }, { col: 'company_id', ref: 'companies.id' }] },
    highlights: { pk: ['id'], fks: [{ col: 'experience_id', ref: 'experience.id' }] },
    skills: { pk: ['id'], fks: [{ col: 'profile_id', ref: 'profile.id' }] },
    experience_skills_mapping: { pk: ['experience_id', 'skill_id'], fks: [{ col: 'experience_id', ref: 'experience.id' }, { col: 'skill_id', ref: 'skills.id' }] },
    projects: { pk: ['id'], fks: [{ col: 'profile_id', ref: 'profile.id' }] },
    project_skills_mapping: { pk: ['project_id', 'skill_id'], fks: [{ col: 'project_id', ref: 'projects.id' }, { col: 'skill_id', ref: 'skills.id' }] },
    education: { pk: ['id'], fks: [{ col: 'profile_id', ref: 'profile.id' }] },
    coursework: { pk: ['id'], fks: [{ col: 'education_id', ref: 'education.id' }] },
    publications: { pk: ['id'], fks: [{ col: 'profile_id', ref: 'profile.id' }] },
    contact: { pk: ['id'], fks: [{ col: 'profile_id', ref: 'profile.id' }] },
    case_studies: { pk: ['id'], fks: [{ col: 'experience_id', ref: 'experience.id' }] }
  };

  // Child tables shown in the card footers on the canvas.
  window.CHILDREN = {
    experience: ['highlights', 'experience_skills_mapping', 'case_studies'],
    skills: ['experience_skills_mapping', 'project_skills_mapping'],
    projects: ['project_skills_mapping'],
    education: ['coursework']
  };

  // Referential integrity check: every FK value must exist in the parent, every PK must be unique.
  Object.keys(window.SCHEMA).forEach(function (t) {
    var S = window.SCHEMA[t], seen = {};
    window.DB[t].rows.forEach(function (r) {
      var k = S.pk.map(function (c) { return r[c]; }).join('|');
      if (seen[k]) throw new Error('duplicate primary key in ' + t + ': ' + k);
      seen[k] = 1;
      S.fks.forEach(function (fk) {
        var p = fk.ref.split('.');
        var ok = window.DB[p[0]].rows.some(function (x) { return x[p[1]] === r[fk.col]; });
        if (!ok) throw new Error('foreign key violation: ' + t + '.' + fk.col + ' = ' + r[fk.col] + ' has no row in ' + fk.ref);
      });
    });
  });
})();
