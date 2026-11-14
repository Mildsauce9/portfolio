# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Hiring managers and recruiters: judge fit for backend AI roles (Go, Python, PostgreSQL) and get in touch.
- Engineers and tech leads: assess technical depth through the projects and the risk assessment platform case study.
- AI agents and crawlers: read the same facts as plain text via `agents.md`, `llms.txt` and the `/#easy` view.

## Product Purpose

Personal portfolio of Kailash Ramakrishnan, Backend AI Engineer in Dubai (AI Engineer at Deriv since 2025-12). It presents experience, eight personal projects, one IEEE publication, skills and contact details. Success: a visitor can judge fit quickly and reach out.

## Positioning

The site is both the proof and the claim. The main view is an interactive database diagram that can be queried with SQL (`SELECT * FROM experience;`), which reflects a PostgreSQL-first identity. The content shows production impact: risk, AML and compliance systems with measured results. Format and content carry equal weight.

## Operating Context

- Static site; all content is generated in the browser from `js/data.js`.
- Main view: database diagram plus SQL query box. Tables: profile, companies, experience, highlights, skills, experience_skills_mapping, projects, project_skills_mapping, education, coursework, publications, contact, case_studies.
- Alternate view: easy-read, a single plain-language page with no interaction, at `/#easy` (`js/easy.js`).
- Machine-readable sources: `agents.md`, `llms.txt`, `robots.txt`.

## Capabilities and Constraints

- The easy-read view stays a first-class view and shows the same information as the database view.
- Keyboard and screen-reader access is required in both views, including the SQL interface and diagram.
- Dates use `YYYY-MM`; "present" means the role is current.
- Content source of truth: `js/data.js`, mirrored in `agents.md`. Keep the two in sync.

## Brand Commitments

Name: Kailash Ramakrishnan. Title: Backend AI Engineer. Tone is factual and engineering-first (plain statements of what was built and measured).

## Evidence on Hand

Real measured results (in `agents.md`): CPU load cut from 300% to 85% (Deriv); AML agent system replaced the manual work of 3 people; 60% process improvement (Condo Protego); 70% retrieval-time reduction (DocuMentor); 95% query accuracy (Stock Intelligence Chatbot); zero data loss on trading DB restore. Public repositories under github.com/Mildsauce9. One publication: IEEE MoSICom 2024, DOI 10.1109/MoSICom60525.2024.10881070. No testimonials, press or client logos exist; do not fabricate any. Do not alter numbers or claims.

## Product Principles

1. Facts first: every claim and number appears exactly as written, with a source.
2. The format demonstrates the skill: the SQL/database view is a real way in, not decoration.
3. Every reader gets a path: scannable for recruiters, deep for engineers, plain text for machines.
4. No view is second-class: the easy-read view and the database view carry the same information.

## Accessibility & Inclusion

Both views must be operable by keyboard and usable with a screen reader. Specific standard (e.g. WCAG level) not yet decided.
