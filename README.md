# english-tutor-lesson-prep

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Claude Agent Skill](https://img.shields.io/badge/Claude-Agent%20Skill-blueviolet)
![Status](https://img.shields.io/badge/status-active-success)

> A Claude Agent Skill that turns a single natural-language prompt into a fully formatted, print-ready English tutoring document — in seconds.

---

## Overview

**english-tutor-lesson-prep** is an AI-native automation tool built on top of [Claude Code](https://docs.claude.com)'s Agent Skill system. It eliminates the manual work of lesson preparation for Chinese high school English tutoring: given a student name and unit number, it reads structured vocabulary data, generates original content, and outputs a polished 7-section `.docx` file with consistent color coding, comparison tables, and model paragraphs.

The entire pipeline — from raw CSV to final document — runs from a single sentence.

---

## How It Works

**Trigger:** `明天给王腾昊上课，默写必修3第三单元`

Claude executes a three-stage pipeline:

```
① Parse  →  Read student vocabulary CSV, filter current & previous unit words
② Compose →  Generate passage, comprehension Qs, KP tables, writing prompts
③ Render  →  Inject content into generate_lesson.js, produce formatted .docx
```

**Output:** A structured Word document with 7 sections, color-coded by unit theme, ready to print or share.

| # | Section | Description |
|---|---------|-------------|
| 1 | 复习默写 | Previous unit dictation — 10 curated words |
| 2 | 新课默写 | Current unit dictation — 15 words with phonetics |
| 3 | 核心词组 | 8–9 key phrases with bilingual example sentences |
| 4 | 阅读理解 | Original thematic passage + 3 leveled comprehension questions |
| 5 | 知识点精讲 | 3–4 grammar / vocabulary comparison tables |
| 6 | 作文讲解 | 2 writing directions with format notes and model paragraphs |
| 7 | 课后作业 + 下节课预告 | Homework checklist + next-unit vocabulary preview |

---

## Technical Design

- **Skill system:** Defined in `SKILL.md` — Claude reads this file to understand the full pipeline, data schema, and generation rules before executing
- **Document engine:** [`docx`](https://www.npmjs.com/package/docx) (Node.js) — programmatic Word generation with precise table layouts, border styling, shading, headers, and footers
- **Content grounding:** `references/` folder provides unit-to-theme mappings, per-unit color palettes, and reusable KP table patterns so output stays consistent across sessions
- **Config-driven rendering:** `generate_lesson.js` accepts a structured JSON config, fully separating content composition (Claude) from document rendering (Node.js)

---

## Repository Structure

```
english-tutor-lesson-prep/
├── SKILL.md                      # Agent skill definition & full pipeline spec
├── scripts/
│   └── generate_lesson.js        # docx generation engine (config-driven)
└── references/
    ├── unit-themes.md             # Unit → topic / passage setting map (必修1–3)
    ├── color-map.md               # Per-unit color palette definitions
    └── kp-table-patterns.md       # Reusable knowledge point table templates
```

---

## Installation

**Prerequisites**
- Node.js ≥ 18
- `npm install docx` (in project root, or globally)

**Install as a Claude Code skill**
```bash
git clone https://github.com/jiakezhu/english-tutor-lesson-prep.git ~/.claude/skills/english-tutor-lesson-prep
```

**Configure your data path** — edit the CSV path in `SKILL.md`:
```
CSV: /Users/YOUR_USERNAME/Desktop/英语家教/课件/txt缓存/课本/STUDENT_单词表.csv
```

**Run manually**
```bash
node scripts/generate_lesson.js --config /tmp/lesson_config.json --output ./output.docx
```

---

## Why This Exists

Preparing a high-quality tutoring lesson by hand takes 60–90 minutes: selecting vocabulary, writing a coherent passage, designing comparison tables, formatting everything in Word. This skill reduces that to under 30 seconds of prompting, with output quality that is consistent, structured, and pedagogically sound — freeing up time to focus on actual teaching.

---

## License

MIT
