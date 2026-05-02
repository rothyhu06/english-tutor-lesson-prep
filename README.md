# english-tutor-lesson-prep

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Claude Agent Skill](https://img.shields.io/badge/Claude-Agent%20Skill-blueviolet)
![Status](https://img.shields.io/badge/status-active-success)

> A Claude Agent Skill that turns a single natural-language prompt into a fully formatted, print-ready English tutoring document — in seconds.
>
> 一句话触发，自动生成排版精良、即刻可打印的高中英语备课文档。

---

## Overview · 项目简介

**english-tutor-lesson-prep** is an AI-native automation tool built on top of [Claude Code](https://docs.claude.com)'s Agent Skill system. It eliminates the manual work of lesson preparation for Chinese high school English tutoring: given a student name and unit number, it reads structured vocabulary data, composes original content, and renders a polished 7-section `.docx` file — complete with color-coded tables, model paragraphs, and grammar comparison layouts.

The entire pipeline runs from a single sentence typed in natural language.

**english-tutor-lesson-prep** 是基于 [Claude Code](https://docs.claude.com) Agent Skill 系统构建的 AI 原生自动化工具，专为中国高中英语家教设计。只需输入学生姓名和单元编号，系统即可自动读取词汇 CSV、生成原创内容，并输出一份格式规范的七节课 `.docx` 文档——包含配色表格、范文段落和语法对比版块，全程无需人工干预。

---

## The Problem · 要解决的问题

Preparing a quality tutoring session by hand takes **60–90 minutes**: selecting vocabulary, writing a coherent passage, designing comparison tables, crafting writing prompts, then formatting everything in Word. This is repetitive, error-prone, and scales poorly when teaching multiple students across multiple textbook units.

手动备一节高质量的家教课需要 **60–90 分钟**：筛词、写短文、设计对比表格、构思作文题目，最后在 Word 里逐一排版。这套流程高度重复、容易出错，一旦同时教多个学生、跨多本教材，时间成本就会急剧上升。

---

## The Solution · 解决方案

**One prompt. One document. Under 30 seconds.**

**一句话。一份文档。30 秒以内。**

```
明天给王腾昊上课，默写必修3第三单元
```

Claude executes a three-stage pipeline automatically:

系统自动执行三阶段流水线：

```
① Parse   →  读取学生词汇 CSV，过滤当前单元与上一单元词汇
② Compose →  生成原创短文、阅读理解题、知识点表格、作文题目
③ Render  →  将内容注入 generate_lesson.js，输出格式化 .docx
```

---

## Output Structure · 文档结构

The generated document follows a fixed pedagogical structure validated across real tutoring sessions:

生成文档遵循经过实际课堂验证的固定教学结构：

| # | Section · 版块 | Description · 说明 |
|---|---------------|-------------------|
| 1 | 复习默写 | Previous unit · 10 curated words with phonetics · 上节课核心词，含音标 |
| 2 | 新课默写 | Current unit · 15 words with phonetics · 本节课新词，含音标 |
| 3 | 核心词组 | 8–9 key phrases with bilingual example sentences · 双语例句 |
| 4 | 阅读理解 | Original thematic passage + 3 leveled comprehension questions · 原创短文 + 三道梯度阅读题 |
| 5 | 知识点精讲 | 3–4 grammar / vocabulary comparison tables · 语法与词汇对比表 |
| 6 | 作文讲解 | 2 writing directions with format notes and model paragraphs · 含格式要点与范文首段 |
| 7 | 课后作业 + 下节课预告 | Homework checklist + next-unit vocabulary preview · 作业清单 + 预习词表 |

---

## Technical Design · 技术设计

### Agent Skill Architecture · Agent Skill 架构

The skill is defined entirely in `SKILL.md` — a structured prompt document that Claude reads before execution. It specifies the data schema, filtering logic, content composition rules, and the exact config shape expected by the rendering script. This design separates **intelligence** (Claude) from **rendering** (Node.js), keeping each layer independently testable and replaceable.

技能定义完全封装在 `SKILL.md` 中——这是 Claude 在执行前读取的结构化提示文档，规定了数据格式、筛词逻辑、内容生成规则以及渲染脚本所需的 config 结构。这种设计将**智能层**（Claude）与**渲染层**（Node.js）彻底分离，两层均可独立测试和替换。

### Document Rendering Engine · 文档渲染引擎

`scripts/generate_lesson.js` is a config-driven document builder powered by [`docx`](https://www.npmjs.com/package/docx) (Node.js). It handles:

`scripts/generate_lesson.js` 是基于 [`docx`](https://www.npmjs.com/package/docx)（Node.js）的配置驱动文档构建器，负责处理：

- Pixel-precise table layouts with per-cell shading and border control · 精确到像素的表格布局，支持单元格着色与边框控制
- Per-unit color theming applied consistently across all 7 sections · 按单元主题配色，贯穿全文七个版块
- Dynamic header / footer injection with student name, unit, and date · 动态页眉页脚注入学生姓名、单元和日期
- Strict separation of content data and presentation logic · 内容数据与展示逻辑严格分离

### Reference Knowledge Base · 参考知识库

The `references/` folder acts as a structured knowledge base that grounds Claude's content generation:

`references/` 目录作为结构化知识库，为 Claude 的内容生成提供约束依据：

- **`unit-themes.md`** — Maps every unit in 必修1–3 to a topic, theme keywords, passage setting, writing directions, and suggested KP patterns · 将必修1–3每个单元映射到主题、关键词、短文场景、作文方向和建议知识点
- **`color-map.md`** — Defines per-unit color palettes so every document has a visually distinct, consistent identity · 定义每单元专属配色方案，确保文档视觉风格统一且易于区分
- **`kp-table-patterns.md`** — Provides five reusable table templates (word form contrast, confusable pairs, verb phrase triads, fixed collocations, grammar contrast) with exact column specs · 提供五种可复用的知识点表格模板，包含精确列宽规格

---

## Repository Structure · 项目结构

```
english-tutor-lesson-prep/
├── SKILL.md                      # Agent skill definition & full pipeline spec
│                                 # Agent Skill 定义与完整流水线规格
├── scripts/
│   └── generate_lesson.js        # Config-driven docx rendering engine
│                                 # 配置驱动的文档渲染引擎
└── references/
    ├── unit-themes.md             # Unit → topic / passage / writing map (必修1–3)
    ├── color-map.md               # Per-unit color palette definitions
    └── kp-table-patterns.md       # Reusable knowledge point table templates
```

---

## Installation · 安装

**Prerequisites · 前置要求**
- Node.js ≥ 18
- `npm install docx`

**Install as a Claude Code skill · 安装为 Claude Code Skill**
```bash
git clone https://github.com/jiakezhu/english-tutor-lesson-prep.git ~/.claude/skills/english-tutor-lesson-prep
```

**Configure your data path · 配置数据路径**

Edit the CSV path in `SKILL.md` to point to your vocabulary file:

修改 `SKILL.md` 中的 CSV 路径，指向你的词汇文件：

```
CSV: /Users/YOUR_USERNAME/Desktop/英语家教/课件/txt缓存/课本/STUDENT_单词表.csv
```

**Run the renderer manually · 手动运行渲染器**
```bash
node scripts/generate_lesson.js --config /tmp/lesson_config.json --output ./output.docx
```

---

## Design Principles · 设计原则

**Composability · 可组合性**
Each component — skill definition, content generation, document rendering, reference knowledge — is a separate, replaceable module. Adding a new student, a new textbook series, or a different output format requires changing only one file.

每个组件——Skill 定义、内容生成、文档渲染、参考知识库——都是独立可替换的模块。新增学生、新增教材系列或更换输出格式，只需修改对应的单一文件。

**Grounded generation · 有据可查的生成**
Claude's content output is constrained by explicit reference documents, not left to open-ended generation. This reduces hallucination and keeps pedagogical quality consistent across sessions.

Claude 的内容输出受显式参考文档约束，而非开放式生成。这降低了幻觉风险，确保每节课的教学质量保持一致。

**Zero-friction operation · 零摩擦操作**
The intended user is a non-technical tutor. The only required input is a natural-language sentence. All file I/O, content decisions, and document formatting happen automatically in the background.

设计面向非技术用户。操作者只需输入一句自然语言，所有文件读写、内容决策和文档排版均在后台自动完成。

---

## License · 许可证

MIT
