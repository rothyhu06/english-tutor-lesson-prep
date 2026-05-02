# Knowledge Point Table Patterns

Standard colSpec shapes for each type of 知识点 table.
All tables use `width: { size: 9360, type: WidthType.DXA }`.

---

## Pattern A: Word Form Contrast
```javascript
colSpec: [
  { header: "单词", width: 2000 },
  { header: "词性", width: 1800 },
  { header: "用法示例", width: 5560 }
]
// rows: [["diverse","adj.","a diverse city / diverse backgrounds"], ...]
// hColor: colors.green, oddFill: colors.greenLight
```

## Pattern B: Confusable Pair
```javascript
colSpec: [
  { header: "单词/词组", width: 2200 },
  { header: "核心含义", width: 2200 },
  { header: "例句", width: 4960 }
]
// rows: [["historical","有关历史的（泛指）","a historical novel"], ...]
// hColor: colors.teal or colors.header
```

## Pattern C: Verb Phrase Triad (2-col)
```javascript
colSpec: [
  { header: "词组", width: 2400 },
  { header: "用法说明 & 例句", width: 6960 }
]
// rows: [["bring about","主动使某事发生 ｜ Immigration brought about diversity."], ...]
// hColor: colors.header (navy/indigo)
```

## Pattern D: Fixed Collocation (3-col)
```javascript
colSpec: [
  { header: "词组", width: 2400 },
  { header: "中文", width: 2200 },
  { header: "例句", width: 4760 }
]
// rows: [["pass away","去世；逝世","He passed away peacefully at 73."], ...]
// hColor: colors.accent (orange)
```

## Pattern E: Grammar Contrast (2-col)
```javascript
colSpec: [
  { header: "表达", width: 2600 },
  { header: "用法 & 例句", width: 6760 }
]
// rows: [["despite / in spite of","后接名词/doing ｜ In spite of the rain, we went out."], ...]
// hColor: colors.teal
```

---

## infoBox (Tip Callout)

Add after complex tables to summarize the key rule:
```javascript
// fill options: "FFF2CC" (gold, for rules/mnemonics), colors.greenLight (for tips)
infoBox("口诀：historic = 著名/重大  ｜  historical = 与历史相关（泛用）", "FFF2CC")
```
