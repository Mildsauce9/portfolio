---
name: Kailash Ramakrishnan Portfolio
description: A lab notebook for a backend AI engineer. Serif prose, mono for data, Solarized paper, one orange voice.
colors:
  paper: "#FDF6E3"
  paper-dot: "#CBC1A2"
  card: "#FFFBEF"
  card-header: "#EEE8D5"
  rule: "#D3C9AA"
  rule-soft: "#E8DFC4"
  ink: "#073642"
  ink-secondary: "#3D555E"
  ink-muted: "#5A6F77"
  kiln-orange: "#B8420F"
  kiln-orange-soft: "#F6E3D2"
  on-kiln-orange: "#FFFFFF"
  schema-green: "#1F7A5C"
  syntax-keyword: "#1F6FB0"
  syntax-number: "#1E7F78"
  error-red: "#B02A27"
  paper-night: "#002B36"
  card-night: "#073642"
  ink-night: "#EEE8D5"
  kiln-orange-night: "#E0693A"
typography:
  display:
    fontFamily: "Source Serif 4, Iowan Old Style, Charter, Georgia, serif"
    fontSize: "clamp(2.375rem, 6.5vw, 3.625rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Source Serif 4, Iowan Old Style, Charter, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  lead:
    fontFamily: "Source Serif 4, Iowan Old Style, Charter, Georgia, serif"
    fontSize: "clamp(1.1875rem, 2.4vw, 1.3125rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Source Serif 4, Iowan Old Style, Charter, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "Source Serif 4, Iowan Old Style, Charter, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.7
  data:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "4px"
  md: "6px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "24px"
  lg: "56px"
components:
  button-primary:
    backgroundColor: "{colors.kiln-orange}"
    textColor: "{colors.on-kiln-orange}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    height: "40px"
  button-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    height: "40px"
  chip:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.data}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  schema-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.data}"
    rounded: "{rounded.sm}"
  schema-card-header:
    backgroundColor: "{colors.card-header}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "9px 14px"
  query-bar:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.md}"
    height: "56px"
---

# Design System: Kailash Ramakrishnan Portfolio

## Overview

**Creative North Star: "The Lab Notebook"**

This is a working engineer's notebook, opened on a desk. Prose is set in a plain text serif on warm Solarized paper. Anything that is data (table names, columns, dates, DOIs, SQL) is set in mono. Structure comes from hairline rules and the left-hand margin, not from boxes. The voice is plain, exact and unhurried: it states what was built and measured, and the paper-like palette supplies the warmth so nothing needs ornament.

The site has two surfaces that share one system. The **database view** is a pannable schema diagram on a dot grid, with a SQL box docked at the bottom. It is the tool-like surface, built from small mono-labelled cards. The **easy-read view** is the same facts as a single document: headings in a margin column, one text column beside them, rules between sections. Neither view is second-class, and both draw from the same tokens.

The palette is Solarized light with a Solarized dark twin, chosen to match the author's own editor. One orange speaks for links and the current state, and rarity is the point.

**Key Characteristics:**
- Serif for reading, mono for data and controls. No third voice and no display face.
- Flat by default; the diagram's cards lift only on state.
- Hairline rules and whitespace do the work that boxes, tiles and badges do elsewhere.
- One accent, used sparingly. Syntax colours exist only to colour SQL and values.
- Light and dark themes are equal citizens and share one token set.

## Colors

Solarized paper and ink, with a single kiln-orange accent and a quiet set of syntax colours.

### Primary
- **Kiln Orange** (#B8420F, dark theme #E0693A): the one voice. Links, the active card border and tab, focus rings, the "Easy-read view" outline button, and the single filled primary action ("Connect with me"). Text on it is white (#FFFFFF, dark theme uses ink-on-paper #002B36).
- **Kiln Orange Soft** (#F6E3D2): a brief highlight only, such as the one-time nudge on the query chips. It is never a resting or selected state.

### Secondary
- **Schema Green** (#1F7A5C): table-name tags on diagram cards and the "connected" status dot. It means "this is a table", nothing else.

### Tertiary
- **Syntax Blue** (#1F6FB0) and **Syntax Teal** (#1E7F78): SQL keywords and numbers. Text values are plain Ink Secondary, with no gold or other colour. They colour code, never chrome.
- **Error Red** (#B02A27): failed queries and form errors only.

### Neutral
- **Paper** (#FDF6E3, dark #002B36): page background. The dot grid behind the diagram uses **Paper Dot** (#CBC1A2).
- **Card** (#FFFBEF, dark #073642): card and panel surface; **Card Header** (#EEE8D5) tints card headers and the toggle track.
- **Ink** (#073642, dark #EEE8D5): headings, names and primary text. **Ink Secondary** (#3D555E) is body prose and **Ink Muted** (#5A6F77) is metadata, labels and placeholders.
- **Rule** (#D3C9AA) and **Rule Soft** (#E8DFC4): borders and hairline dividers. Soft is for dividers inside a surface.

### Named Rules
**The One Voice Rule.** Kiln Orange marks links, the current view and the one primary action, and nothing else. It never colours stats, list markers, headings, decoration or selected table rows.

**The Syntax Is Data Rule.** Blue and teal appear only on SQL keywords and numbers, where they carry meaning. Text values stay neutral, and neither colour decorates a heading or button.

## Typography

**Display, Body and Headline Font:** Source Serif 4 (with Iowan Old Style, Charter, Georgia)
**Label and Data Font:** JetBrains Mono (with ui-monospace, SFMono-Regular, Menlo, Consolas)

**Character:** A text serif that reads like a well-set paper, paired with the mono face of a code editor. The serif does all the talking; the mono shows up when the content is a thing you could query or copy.

### Hierarchy
- **Display** (600, clamp(38px, 6.5vw, 58px), 1.04, -0.02em): the name, once per view. The diagram's hero card uses the same face at 54px.
- **Headline** (600, 20px, 1.3): section headings in the margin column, job and project titles.
- **Lead** (400, clamp(19px, 2.4vw, 21px), 1.6): the opening paragraph, held to about 36em.
- **Body** (400, 18px, 1.6): prose and bullets, held to 38em, with `text-wrap: pretty`.
- **Meta** (400, 16px, 1.6): dates, locations and secondary lines, in Ink Muted.
- **Label** (500, 13px, mono): row labels, button text, table names, tools lines. Normal case, no tracking.
- **Data** (400, 13px, mono): card rows, SQL, grid cells and values.

### Named Rules
**The Two Voices Rule.** Serif is for things you read; mono is for things you query, copy or press. Do not add a third family, and do not set prose in mono.

**The No Costume Rule.** Mono labels are not uppercase, not tracked and not used as eyebrows above headings. A label that needs a kicker should be a heading instead.

## Layout

The diagram is a fixed 1360×720 "world" panned and zoomed on a dot grid, with the query dock centred at the bottom (max 640px). Below 980px or on narrow screens it stacks into a single column of cards, each linked to the one above by a dashed connector.

The easy-read view is a document: a 56rem column holding an 11rem margin column for headings and a body column of at most 42rem, with a 32px gutter. Sections are separated by a 1px rule and 56px of space. Within a section, groups are tight (8–12px) and separations are generous (28–36px). Below 760px the margin column collapses and headings sit above their body. Both views are tested at 375px with no horizontal scroll, and touch targets are at least 36–48px.

Spacing is irregular by design: values are chosen to group related content tightly (8px row padding, 12px paragraph gap) and to separate unrelated content generously (24px, 28px, 56px), not drawn from a strict scale.

## Elevation & Depth

Flat by default, lift on state. Easy-read has no shadows at all; hierarchy comes from rules and type size. In the diagram, cards rest with a faint ambient shadow and gain a stronger one when they are dragged, active, or showing results. Shadows always carry a small offset and a soft blur, with no hard block shadows and no coloured halos.

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 1px 2px rgba(7,54,66,.08), 0 4px 10px -6px rgba(7,54,66,.22)`): diagram cards and the zoom control.
- **Active** (`box-shadow: 0 1px 2px rgba(7,54,66,.1), 0 8px 18px -8px rgba(7,54,66,.3)`): the active or hero card, the focused query bar.
- **Lifted** (`box-shadow: 0 2px 4px rgba(7,54,66,.1), 0 18px 36px -14px rgba(7,54,66,.38)`): dragging, the results panel and the dialog. The dark theme uses black at higher opacity.

### Named Rules
**The Lift On State Rule.** A surface rises only in response to something the visitor did, such as dragging, selecting or querying. Nothing is elevated just to look elevated.

## Shapes

Small, even corners, with a thin border around anything that holds content. Cards are 4px, controls, the query bar, results and the dialog are 6px, and small tags and badges are 3–4px. The only circles are the status dot and the numbered step markers. There are no pills, no accent stripes and no thick coloured borders. A selected card or row is marked with a 1px Kiln Orange border or a soft tint.

## Components

### Buttons
- **Shape:** gently squared, 6px radius, minimum 40px tall (48px for the main call to action).
- **Primary:** Kiln Orange fill, white text, mono 12.5px weight 600. One per view ("Connect with me", "Send me a message").
- **Default:** card-colour fill, 1px Rule border, Ink mono text. The border turns Kiln Orange on hover.
- **Outline accent:** the "Easy-read view" toggle uses an orange border and orange text, with Kiln Orange Soft fill while that view is active.
- **Press:** a 1px downward nudge. There is no hover lift or hard shadow.

### Chips
- **Style:** card fill, 1px Rule border, 4px radius, mono 12px in Ink Secondary. They are query suggestions beneath the SQL bar.
- **State:** border and text turn Kiln Orange on hover.

### Cards / Containers
- **Corner Style:** 4px.
- **Background:** Card, with a Card Header band (mono, 9px 14px padding) carrying a green table-name tag and a row count.
- **Shadow Strategy:** see Elevation & Depth: Rest, then Active or Lifted.
- **Border:** 1px Rule; Kiln Orange when active or the hero card.
- **Internal Padding:** rows are 9px 14px with 1px soft dividers; foreign-key footers use a dashed top rule.

### Inputs / Fields
- **Style:** the SQL bar is a 56px, 6px-radius box with an Ink border, a Kiln Orange `›` prompt, a mono 15px field and a clear (×) button that appears once there is text. Its placeholder cycles through example queries until the field is first focused. On touch screens the keyboard closes after a query runs. Dialog fields are 6px, Paper-filled, with a Rule border.
- **Focus:** border and caret turn Kiln Orange and the bar gains the Active shadow. Everywhere else, a 2px Kiln Orange outline with a 2px offset.
- **Error / Disabled:** errors use Error Red text in the status line or results panel.

### Navigation
- **Style:** a transparent top bar with the brand path (`kailash@portfolio / public / schema view`) in mono at left, a three-way view switch in the centre (Easy-read, Schema, Table, each with an icon, the current one raised with an orange icon), and a Guide button, GitHub, LinkedIn and Connect at right, all with icons. The switch stays visible in every view. Below 640px the labels drop and only the icons remain. In easy-read the bar gets a Paper fill and a 1px rule.
- **Guide:** a quiet bordered button with a "?" icon and a small orange dot that pings a few times until the Guide has been opened once. It opens a dialog covering the views, the diagram, rows, the SQL box and its shortcuts. Typing `help` in the query box opens the same dialog.

### Schema Card (signature)
A database table rendered as a card: green tag, row count, rows of name and value in mono, a dashed foreign-key footer, and dashed links to related cards. It is the system's signature, and the diagram view is built entirely from it.

### Document Row (signature)
In easy-read, a definition-list row: a 9rem mono label in Ink Muted beside a serif value, separated from its neighbours by a 1px soft rule. It replaces every card, tile and fact box.

## Do's and Don'ts

### Do:
- **Do** set prose in Source Serif 4 and data, labels and controls in JetBrains Mono.
- **Do** use hairline rules and whitespace to group content in easy-read.
- **Do** keep Kiln Orange to links, the current view, focus and the one primary action per view.
- **Do** mark hovered and selected table rows with the neutral Card Header tint, and open a row's detail directly beneath it.
- **Do** invite interaction with quiet cues (an "open ›" on card headers, a chevron on rows, a one-time nudge), and stop once the visitor has acted.
- **Do** make phones open on the easy-read view.
- **Do** give every shadow an offset and a soft blur, and lift only on state.
- **Do** keep body text to 38em, and keep the easy-read column readable at 375px with no horizontal scroll.
- **Do** keep both views in step with `js/data.js` and `agents.md`, and keep numbers and claims exactly as written.

### Don't:
- **Don't** use a wonky or soft display serif, or an italic accent-coloured subtitle under the name.
- **Don't** structure a page as stat tiles, big-number cards or grids of identical boxes.
- **Don't** use pill-shaped tags, uppercase tracked kicker labels above headings, or thick accent stripes on cards.
- **Don't** add a third typeface or a display face.
- **Don't** colour decoration with the syntax colours or Kiln Orange.
- **Don't** use gold or orange text or row fills in tables.
- **Don't** hide an answer far from the click that asked for it.
