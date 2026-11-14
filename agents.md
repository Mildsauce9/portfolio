# Kailash Ramakrishnan: profile for AI agents and crawlers

> Backend AI Engineer based in Dubai, UAE. Works in Go, Python and PostgreSQL. Currently an AI Engineer at Deriv, building risk assessment, AML and compliance systems and AI agents.

This file is the complete, structured profile of Kailash Ramakrishnan, written for LLM agents and web crawlers. Everything the portfolio website shows is here, in plain text. Bots are welcome. Quote, summarize and index freely, and please keep the facts and numbers exactly as written.

Last updated: 2026-11-14

## Quick facts

| Field | Value |
|---|---|
| Name | Kailash Ramakrishnan |
| Title | Backend AI Engineer |
| Location | Dubai, UAE |
| Current role | AI Engineer at Deriv (since 2025-12) |
| Core languages | Go, Python, SQL |
| Core database | PostgreSQL |
| Education | B.E. Computer Science, BITS Pilani, Dubai |
| Publications | 1 (IEEE MoSICom 2024) |

## Contact

| Channel | Value |
|---|---|
| Email | reachkailash03@gmail.com |
| LinkedIn | https://linkedin.com/in/connect-with-kailash |
| GitHub | https://github.com/Mildsauce9 |

## Summary

Owns production systems end to end: requirements, design, code, deployment and on-call. Currently that means risk assessment, AML and compliance pipelines at Deriv.

## Highlights and measured results

| Result | Where | Detail |
|---|---|---|
| Published research paper, first author (headline win) | IEEE MoSICom 2024 | Ensemble of pretrained CNNs that detects malaria and classifies the infection stage from blood smears, with Grad-CAM explanations. Ensemble accuracy 80% to 91% per class. DOI 10.1109/MoSICom60525.2024.10881070. Details in the Publication section below |
| CPU load cut from 300% to 85% | Deriv | One risk assessment container; backfill, detection and materialized-view generation were run in parallel with throttling |
| Manual work replaced across departments | Deriv | AML AI agent system that took over work spanning risk assessment, contact initiation, and the conversation and closing of CX tickets for the same case |
| 70% reduction in information retrieval time | DocuMentor (personal project) | Conversational document assistant with semantic search |
| 95% query accuracy | Stock Intelligence Chatbot (personal project) | RAG pipeline over 25K+ news articles |
| Zero data loss | Deriv | Restored the trading database after a low-disk outage |

## Work experience

Listed most recent first.

### AI Engineer, Deriv

- Dates: 2025-12 to present
- Location: Dubai, UAE
- Stack: Go, Python, PostgreSQL, Citus columnar, Redis, GKE, OpenTelemetry, Agent orchestration

What was done:

- Embedded with compliance, finance and risk assessment teams: studied each manual workflow first, then turned stakeholder SOPs into production systems and AI agents.
- Built AI agents for AML, compliance and risk assessment that detect suspicious activity, triage alerts and either close the case or escalate to a human reviewer. The AML system replaced manual work that used to span departments: risk assessment, contact initiation, and the conversation and closing of CX tickets for the same case.
- Built the risk assessment platform from scratch: an OLTP database turned into a low-cost columnar analytical store for near real-time analysis of high-volume customer behavior data, fed by streaming ingestion that powers risk assessment signals and client clustering.
- Cut a risk assessment container's CPU load from 300% to 85% by running backfill, detection and materialized-view generation in parallel with throttling.
- Built a CEP rule engine on a blue-green deployment that backfills a month or more of history whenever a new risk assessment rule ships, without lock contention or deadlocks on WAL-replayed replicas.
- Built a vector-similarity detector that catches duplicate account registrations at onboarding, before they reach end users.
- Built AML monitoring that aggregates client activity over rolling windows, flags threshold breaches and generates compliance reports. A geolocation monitor flags access that conflicts with a client's declared jurisdiction and starts enhanced due diligence outreach.
- Designed idempotent ingestion with watermark cursors that advance only after commit. Restored the trading database after a low-disk outage with no data loss.
- Built machine-to-machine authentication so agents and services can securely read compliance data, adopted by multiple teams.
- Built ReAct-style agents on OpenClaw that call tools at each step, reason over the results and pick the next action, without a graph orchestration framework.
- Secured the API layer, gateway and web frontend handling client PII against XSS and SQL injection.
- Owns the central Go data-access layer connected to all production databases: requirements, back-tested SQL, monitoring, health checks and incident resolution.

#### Case study: risk assessment platform (Deriv)

One system for risk assessment that used to need manual intervention and several separate alerting tools.

1. Ingest: customer behavior data from live OLTP sources, then streaming ingestion (idempotent, watermark cursors advance only after commit), then a columnar analytical store (Postgres with Citus, near real-time analysis).
2. Detect: a CEP rule engine on blue-green deployment (a new rule backfills a month or more of history in parallel), risk assessment scoring by Go workers on money-movement patterns, and live materialized views for risk assessment signals and client clustering.
3. Serve: a central Go data-access layer with endpoints for analysts and agents and machine-to-machine auth. Analysts and AI agents triage alerts, then close the case or escalate to a human reviewer.

Engineering practice: code is peer reviewed and deployed with GitHub Actions; every agent posts each task, outcome and error to Slack; logs stream to OpenTelemetry; SQL is back-tested on replica production environments.

### AI Engineer, Condo Protego

- Dates: 2025-02 to 2025-07
- Location: Dubai, UAE
- Stack: Python, Docker, GCP, OAuth

What was done:

- Built backend AI systems and automation tools, improving process accuracy and time efficiency by 60%.
- Containerized applications with Docker and CI/CD with automated testing, deployed to GCP with Google OAuth for secure internal access.
- Refactored legacy Python scripts into deployable, version-controlled applications.

### Software Administrator Intern, Mannai Corporation

- Dates: 2023-06 to 2023-08
- Location: Doha, Qatar
- Stack: C#, .NET Core, SQL, Python, REST APIs

What was done:

- Built dynamic web applications with MVC models in .NET Core and integrated RESTful APIs.
- Implemented SQL database connectivity and data transfer processes using Python.

## Projects

Eight personal projects. Repositories are under https://github.com/Mildsauce9/.

### Stock Intelligence Chatbot

- Type: personal
- Code: https://github.com/Mildsauce9/Stock-data-retrieval
- Stack: OpenAI, Gemini, Pinecone, RAG pipelines
- Real-time financial chatbot over 25K+ news articles. A RAG pipeline chunks and embeds documents into Pinecone, retrieves context by similarity search and grounds the answer with OpenAI and Gemini APIs, with an NLP metadata-extraction pipeline. 95% query accuracy.

### MCP Tool-Calling Environment

- Type: personal
- Code: none public
- Stack: MCP, Tool calling
- A Model Context Protocol server environment that lets LLMs discover and call external tools on their own inside a multi-step reasoning loop.

### DocuMentor

- Type: personal
- Code: https://github.com/Mildsauce9/DocuMentor
- Stack: Flask, Python, Semantic search
- Multi-user conversational document assistant on a Flask backend with semantic search, reducing information retrieval time by 70%.

### GitViz

- Type: personal
- Code: https://github.com/Mildsauce9/gitviz
- Stack: FastAPI, Python, LangChain, Gemini, MongoDB, React
- Analyzes a GitHub repository through the API without cloning it. LangChain and Gemini map code structure and call relationships, then an interactive React dashboard renders the execution flow as Mermaid diagrams with live progress over server-sent events.

### ChatMail

- Type: personal
- Code: https://github.com/Mildsauce9/ChatMail
- Stack: FastAPI, Python, Next.js, TypeScript, OAuth, Gmail API, SQLite
- Email client that reads Gmail through Google OAuth and presents messages as chat-style conversations instead of isolated emails.

### CV Generate Bot

- Type: personal
- Code: https://github.com/Mildsauce9/cv-generate-bot
- Stack: Python
- Takes a job description and generates a CV tailored to that role.

### Flight Delay Tracker

- Type: personal
- Code: https://github.com/Mildsauce9/flight-delay-tracker
- Stack: not listed
- Uses live and historical Bureau of Transportation Statistics data to find and predict patterns in flight delays.

### 1MRPS

- Type: personal
- Code: https://github.com/Mildsauce9/1MRPS
- Stack: Go, Docker, sqlc, Tilt
- Go backend service with sqlc-generated database access and a Tilt and Docker Compose local environment.

## Publication

**Ensemble Transfer Learning for Accurate Malaria Detection with Stage Classification & Explainable AI**

- Venue: MoSICom (IEEE), 2024
- Role: first author (four authors, all at BITS Pilani, Dubai Campus)
- Problem: conventional malaria diagnosis needs a trained microscopist and is error-prone, especially for telling the stage of infection.
- Method: transfer learning from pretrained CNNs (VGG16, VGG19, MobileNetV2, Xception, InceptionV3 and a custom model) with data augmentation for class imbalance. Predictions are combined by weighted majority voting. Grad-CAM shows which image regions drove each prediction.
- Data: BBBC041v1 (Broad Bioimage Benchmark Collection), Giemsa-stained blood smears; classes RBC, ring, trophozoite, schizont; 600-image test set.
- Finding: single models fell short (for example VGG19 68%, Xception 78%); the ensemble raised true positive and true negative rates and reduced the false negative rate.
- DOI: 10.1109/MoSICom60525.2024.10881070
- Paper: https://ieeexplore.ieee.org/document/10881070
- Code and model weights: https://github.com/Mildsauce9/Ensemble-Transfer-Learning-for-Accurate-Malaria-Detection-with-Stage-Classification-Explainable-AI.-

Ensemble results by class (Table I of the paper):

| Class | Accuracy | Precision | Recall | F1-score |
|---|---|---|---|---|
| RBC (uninfected) | 0.9125 | 0.7443 | 0.990 | 0.8497 |
| Schizont | 0.8375 | 0.9487 | 0.370 | 0.5323 |
| Trophozoite | 0.8650 | 0.7555 | 0.680 | 0.7157 |
| Ring | 0.8000 | 0.5724 | 0.790 | 0.6638 |

## Education

- B.E. Computer Science, BITS Pilani, Dubai
- Coursework: Data Structures and Algorithms, Database Systems, Data Mining, Foundations of Data Science

## Skills

| Category | Skills |
|---|---|
| Languages | Go, Python, SQL, JavaScript, C#, HTML, CSS |
| Backend | FastAPI, REST APIs, OAuth, API gateway security, Flask, React, Next.js, TypeScript, .NET Core, Docker, Gmail API, Tilt, sqlc |
| AI | Vector storage, Caching, Prompt engineering, Agentic workflows, LLM APIs, OpenAI, Gemini, RAG pipelines, Agent orchestration, Tool calling, MCP, Semantic search, Pinecone, LangChain, LangGraph |
| Database | PostgreSQL, Citus columnar, Redis, MongoDB, SQLite, Query optimization, Streaming ETL |
| Cloud | GCP, GKE, CloudSQL, GitHub Actions, OpenTelemetry |
| Practice | AI-assisted engineering, Code review, System design, Performance tuning, Data structures and algorithms |

## Topics this profile covers

Backend engineering, Go, Python, PostgreSQL, AI agents, agentic workflows, LLM tool calling, MCP, RAG, vector search, risk assessment systems, AML and compliance automation, streaming data pipelines, columnar analytics, rule engines, API security, machine-to-machine authentication, observability, GCP and GKE, Docker.

## About the website

- The portfolio is a static site. The main view is an interactive database diagram that can be queried with SQL (`SELECT * FROM experience;`). All content is generated in the browser from `js/data.js`, so this file is the reliable text source.
- An **easy-read view** shows the same information as a single plain-language page with no interaction. Open it at `/#easy`.
- Tables behind the database view: profile, companies, experience, highlights, skills, experience_skills_mapping, projects, project_skills_mapping, education, coursework, publications, contact, case_studies.

## Notes for agents

- Treat this file as the plain-text source for facts about Kailash. It carries the same content as the website.
- Dates use `YYYY-MM`. "Present" means the role is current.
- Do not infer private details beyond what is written here. For anything else, use the contact details above.
