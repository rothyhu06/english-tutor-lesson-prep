---
name: english-tutor-lesson-prep
description: "Generate formatted English tutoring lesson documents (.docx) for high school students in China. Triggers on phrases like '明天给X上课，默写Y第Z单元', '给X备课', or 'prepare lesson for [student] [book] unit [N]'. This skill handles the full pipeline: read vocabulary CSV → extract unit words → compose theme-based content → generate a polished 7-section Word document. Use this skill any time a user mentions preparing, generating, or updating an English lesson document for a student, even if they don't say 'skill' or 'docx' explicitly."
---

# English Tutor Lesson Prep

Generates a structured, color-coded `.docx` lesson document for Chinese high school English tutoring sessions. The document follows a fixed 7-section format and draws vocabulary from a CSV word list.

---

## Quick Start

**Trigger phrase pattern:** `明天给[学生]上课，默写[课本]第[N]单元`

**Three-step workflow:**
1. **Read CSV** → extract vocab for current unit + previous unit
2. **Compose content** → theme-based passage, questions, knowledge points, writing prompts
3. **Generate docx** → run `scripts/generate_lesson.js` with injected content

---

## Step 1: Read Vocabulary Data

### File Paths (defaults for 王腾昊)
CSV:     /Users/zhujiake/Desktop/英语家教/课件/txt缓存/课本/王腾昊_单词表.csv
Lessons: /Users/zhujiake/Desktop/英语家教/课件/txt缓存/课件/王腾昊/
Output:  /mnt/user-data/outputs/

### CSV Format
课本,单元,英文,中文,音标
必修3,3.0,diverse,adj.不同的;多种多样的,/daɪˈvɜːs/
必修3,3.0,immigrant,n.(外来)移民;外侨,/ˈɪmɪɡrənt/

### Filtering Logic
```javascript
// Current unit vocab (新课默写) — take first 15 content words
const currentUnit = rows.filter(r => r.课本 === book && parseFloat(r.单元) === unitNum);
// Previous unit vocab (复习默写) — take 10 key words
const prevUnit = rows.filter(r => r.课本 === book && parseFloat(r.单元) === unitNum - 1);
```

**Selection rules:**
- Skip proper nouns (capitalized entries), place names, person names
- Prefer words with clear 词性 labels (adj./n./v./adv./vt./vi.)
- For 复习默写: pick words that appeared in last session's 下节课预告 if available
- Max 15 words for 新课, max 10 for 复习

---

## Step 2: Compose Theme Content

Before running the script, Claude must compose all variable content. See `references/unit-themes.md` for a topic map of 必修1–3 units.

### Reading Passage (原创短文)
- Length: 4 paragraphs, ~80 words each
- **Must use at least 8–10 of the new unit's words naturally**
- Title format: `[Topic]: [Subtitle]`
- Avoid first-person; use third-person academic/narrative voice

### Reading Questions (3 questions)
- Q1: 细节题 (specific fact from passage)
- Q2: 推断题 (inference / implication)
- Q3: 主旨题 (main purpose / central argument)
- Each: 4 options (A/B/C/D), include answer key

### Knowledge Points (知识点, 3–4 sections)
Priority topics to cover each unit:
1. **Word form contrast** (e.g., diverse vs diversity)
2. **Confusable phrase pair** (e.g., apart from vs except for)
3. **Verb phrase triad** (e.g., bring about / result in / lead to)
4. **Fixed collocations** from the key phrases list

Format each KP as a comparison table (see `references/kp-table-patterns.md`).

### Writing Prompts (作文, 2 directions)
- **应用文**: 写信/通知/报告 — format note + model opening paragraph
- **读后续写**: scenario linked to unit theme — continuation guidelines + model paragraph

### Key Phrases (核心词组, 8–9 items)
Each entry: `phrase → Chinese meaning ｜ example sentence using the phrase`.

---

## Step 3: Generate the Docx

Use `scripts/generate_lesson.js`. The script exports a `buildDoc(config)` function.

### Config Object Shape
```javascript
const config = {
  student: "王腾昊",
  unit: "必修3 第3单元 · Diversity and Inclusion",
  date: "2026年4月5日",
  colors: { header:"243F60", headerLight:"D9E2EE", accent:"C55A11", accentLight:"FCE4D6",
             green:"375623", greenLight:"E2EFDA", purple:"7030A0", purpleLight:"EAD1F5" },
  reviewUnitLabel: "必修3第2单元",
  reviewNote: "重点回顾上节课核心词汇",
  reviewVocab: [ /* [english, phonetic, chinese] × 10 */ ],
  newVocabNote: "共15词，注意词形变化",
  newVocab: [ /* [english, phonetic, chinese] × 15 */ ],
  keyPhrases: [ /* [phrase, "Chinese ｜ example"] × 8-9 */ ],
  passageTitle: "San Francisco's Chinatown: A Living Heritage",
  passageParagraphs: [ /* 4 strings */ ],
  questions: [ /* { label, q, ans } × 3 */ ],
  discussionPrompt: "Describe a cultural community...",
  knowledgePoints: [
    { title: "① diverse / diversity 词形对比",
      table: { colSpec: [{header:"单词",width:2000},{header:"词性",width:1800},{header:"用法示例",width:5560}],
               rows: [["diverse","adj.","a diverse city"],["diversity","n.","cultural diversity"]],
               hColor:"375623", oddFill:"E2EFDA" },
      note: "口诀提示（可选）" }
  ],
  writing1: { title: "应用文标题", formatNote: "格式要点", modelParagraph: "范文首段..." },
  writing2: { title: "读后续写标题", formatNote: "续写要点", modelParagraph: "范文首段..." },
  homeworkItems: [ "① 熟记本节课15个新词", "② ...", "③ ...", "④ ..." ],
  nextUnitPreview: {
    title: "必修3 第4单元核心词汇（节选）",
    words: [ "astronaut  /ˈæstrənɔːt/  宇航员", "satellite  /ˈsætəlaɪt/  人造卫星" ]
  }
};
```

### Run Command
```bash
node scripts/generate_lesson.js --config /tmp/lesson_config.json --output /path/to/output.docx
```

---

## Document Structure (7 Sections)

| # | Section | Content | Time |
|---|---------|---------|------|
| 1 | 复习默写 | Previous unit, 10 words | 10 min |
| 2 | 新课默写 | Current unit, 15 words | — |
| 3 | 核心词组 | 8–9 phrases with examples | 20 min |
| 4 | 阅读理解 | Original passage + 3 Qs | 15 min |
| 5 | 知识点精讲 | 3–4 comparison tables | — |
| 6 | 作文讲解 | 2 writing directions | 15 min |
| 7 | 课后作业 + 下节课预告 | HW list + next unit preview | — |

---

## Reference Files

- `references/unit-themes.md` — Unit number → topic/theme map for 必修1–3
- `references/color-map.md` — Per-unit color palette
- `references/kp-table-patterns.md` — Knowledge point table templates
- `scripts/generate_lesson.js` — Full docx-js generation template
