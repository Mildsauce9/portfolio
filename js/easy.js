// Plain-language wording for the easy-read view. The facts are the same as the database view
// (js/data.js); this file only swaps jargon for everyday words. Keep the two in step.
window.EASY = {
  role: 'Backend AI Engineer',
  mainTools: 'Go, Python and PostgreSQL',

  intro: 'I build the behind-the-scenes software that businesses depend on, including systems that use AI. I take a piece of work from the first conversation, through design and building, to running it live and fixing it when something goes wrong.',

  // Big numbers. Each one is a result already stated in the database view.
  stats: [
    // featured: the headline win. The paper links are filled in from the publications table.
    { featured: true, num: 'IEEE', label: 'Published research paper', detail: 'Single AI models fell short at spotting malaria in blood-sample images, so I combined several of them to vote on each image. The combined system also tells which stage the infection is at and shows which parts of the image drove its decision. Published at MoSICom 2024 (IEEE).',
      facts: [['My role', 'First author'], ['Accuracy by class', '80% to 91%'], ['Tells apart', 'Healthy cells and 3 infection stages'], ['Explains itself', 'Highlights what it looked at']], source: 'Research' },
    { num: '300% → 85%', label: 'Processor load', detail: 'The same work on one risk assessment system, run in parallel with safe limits.', source: 'Deriv' },
    { num: 'Start to finish', label: 'Manual work replaced', detail: 'An AI assistant now does work that used to be split across departments: risk assessment, contact initiation, and the conversation and closing of customer support tickets for the same case.', source: 'Deriv' },
    { num: '70%', label: 'Faster information lookup', detail: 'DocuMentor, a chat assistant that finds answers inside documents.', source: 'Personal project' },
    { num: '95%', label: 'Query accuracy', detail: 'A chatbot answering questions from more than 25,000 news articles.', source: 'Personal project' }
  ],

  // Keyed by the experience id in js/data.js.
  jobs: {
    1: {
      blurb: 'Builds AI assistants and risk systems for the compliance, finance and risk teams.',
      points: [
        'Worked alongside the compliance, finance and risk assessment teams. Learned how each manual process worked first, then turned their written procedures into live software and AI assistants.',
        'Built AI assistants that watch for suspicious activity, sort the alerts, and either close a case or pass it to a person. The anti-money-laundering assistant replaced work that used to be split across departments: risk assessment, contact initiation, and the conversation and closing of customer support tickets for the same case.',
        'Built the risk assessment platform from scratch. It studies large amounts of customer behavior data almost in real time, at low cost, and groups similar customers together.',
        'Made a heavy program run far more efficiently: its processor load dropped from 300% to 85%.',
        'New risk assessment rules can now be applied to a month or more of past data without slowing down or freezing other systems.',
        'Built a check that spots duplicate account sign-ups at the moment someone registers.',
        'Built anti-money-laundering monitoring that tracks customer activity over time, flags when limits are crossed and produces compliance reports. A location check flags access that does not match where a customer says they live, and starts a follow-up review.',
        'Designed data loading that never duplicates or loses records. Recovered the main database after a full-disk outage with no data lost.',
        'Built secure sign-in for software-to-software access, so approved tools can read compliance data. Several teams now use it.',
        'Built AI agents that decide their own next step: they use tools, read the results and choose what to do next.',
        'Secured the web services that handle customers’ personal data against common attacks.',
        'Owns the shared software layer that other systems use to read company data: requirements, testing, monitoring, health checks and fixing incidents.'
      ]
    },
    2: {
      blurb: 'Built AI and automation tools for the business.',
      points: [
        'Built behind-the-scenes AI software and automation tools. They improved accuracy and time efficiency of processes by 60%.',
        'Packaged applications so they run the same everywhere, added automatic testing, and put them online on Google’s cloud. Google sign-in keeps them open to staff only.',
        'Rewrote old, loose scripts into proper applications that are tracked, versioned and easy to deploy.'
      ]
    },
    3: {
      blurb: 'Summer internship building web applications.',
      points: [
        'Built interactive web applications and connected them to other software.',
        'Set up database connections and moved data between systems using Python.'
      ]
    }
  },

  // Keyed by project name in js/data.js.
  projects: {
    'Stock Intelligence Chatbot': 'A chatbot that answers questions about financial markets using more than 25,000 news articles. It finds the most relevant articles and uses them to write each answer. 95% query accuracy.',
    'MCP Tool-Calling Environment': 'A setup that lets an AI model find and use outside tools by itself, step by step, to finish a task.',
    'DocuMentor': 'A chat assistant for documents that several people can use at once. It cut the time spent finding information by 70%.',
    'GitViz': 'Reads a software project on GitHub and draws diagrams of how its parts work together, without downloading it. Shows live progress while it works.',
    'ChatMail': 'An email app that shows your Gmail messages as a chat conversation instead of a list of separate emails.',
    'CV Generate Bot': 'Give it a job description and it writes a CV tailored to that job.',
    'Flight Delay Tracker': 'Uses live and past US flight data to spot and predict patterns in delays.',
    '1MRPS': 'A fast backend service written in Go, with a ready-made setup for developing it on a laptop.'
  },

  publication: 'I am the first author. The paper combines several AI image models, voting together, to detect malaria in blood-sample images and tell which stage the infection is at (ring, trophozoite or schizont). Heat maps show which parts of each image the AI relied on. Tested on 600 images, the combined system reached 80% to 91% accuracy per class, where single models such as VGG19 (68%) and Xception (78%) fell short.',

  categories: {
    language: 'Programming languages',
    backend: 'Building web services',
    ai: 'AI',
    database: 'Storing and moving data',
    cloud: 'Cloud and monitoring',
    practice: 'Ways of working'
  }
};
