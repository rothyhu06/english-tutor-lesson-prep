# english-tutor-lesson-prep

A [Claude Agent Skill](https://docs.claude.com) that generates formatted English tutoring lesson documents for Chinese high school students — fully automated from vocabulary CSV to polished `.docx`.

## What it does

Trigger phrase: **「明天给王腾昊上课，默写必修3第三单元」**

Claude will:
1. Read the student's vocabulary CSV to extract current and previous unit words
2. Compose a themed reading passage, comprehension questions, and knowledge point tables
3. Generate a polished, color-coded 7-section Word document

| Section | Content |
|---------|---------|
| 复习默写 | Previous unit dictation, 10 words |
| 新课默写 | Current unit dictation, 15 words |
| 核心词组 | 8–9 key phrases with example sentences |
| 阅读理解 | Original passage + 3 comprehension questions |
| 知识点精讲 | 3–4 grammar/vocab comparison tables |
| 作文讲解 | 2 writing directions with model paragraphs |
| 课后作业 + 下节课预告 | Homework list + next unit preview |

## Installation

### Prerequisites
- Node.js ≥ 18
- `npm install -g docx`

### Install the skill (Claude Code)
```bash
git clone https://github.com/jiakezhu/english-tutor-lesson-prep.git ~/.claude/skills/english-tutor-lesson-prep
```

## Setup

Edit the file paths in `SKILL.md` to match your system:
```
CSV: /Users/YOUR_USERNAME/Desktop/英语家教/课件/txt缓存/课本/STUDENT_单词表.csv
```

## File Structure
```
english-tutor-lesson-prep/
├── SKILL.md
├── README.md
├── scripts/
│   └── generate_lesson.js
└── references/
    ├── unit-themes.md
    ├── color-map.md
    └── kp-table-patterns.md
```

## License
MIT
