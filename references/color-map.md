# Color Map Reference

## Color Object Shape

```javascript
const colors = {
  header: "2E75B6",       // Banner background, h1 underline
  headerLight: "D6E4F0",  // Vocab table odd-row fill
  accent: "C55A11",       // h2 color, phrase table header
  accentLight: "FCE4D6",  // Phrase table odd-row fill
  green: "375623",        // Knowledge point headers
  greenLight: "E2EFDA",   // KP table odd rows
  purple: "7030A0",       // Reading section headers
  purpleLight: "EAD1F5",  // Reading section odd rows
};
```

## Unit Color Assignments

| Book-Unit | Header | HeaderLight | Theme |
|-----------|--------|-------------|-------|
| 必修3-1 | `2E75B6` | `D6E4F0` | Blue / Festivals |
| 必修3-2 | `1F6B75` | `D9EFF1` | Teal / Morals |
| 必修3-3 | `243F60` | `D9E2EE` | Dark Navy / Diversity |
| 必修3-4 | `1F497D` | `DAE3F3` | Space Navy / Astronomy |
| 必修3-5 | `7F6000` | `FFF2CC` | Gold / Justice |
| 必修2-1 | `243F60` | `D9E2EE` | Dark Navy / Heritage |
| 必修2-2 | `375623` | `E2EFDA` | Forest / Wildlife |
| 必修2-3 | `2E75B6` | `D6E4F0` | Blue / Tech |
| 必修2-4 | `7F6000` | `FFF2CC` | Gold / Culture |
| 必修2-5 | `7030A0` | `EAD1F5` | Purple / Music |
| default  | `2E75B6` | `D6E4F0` | Standard Blue |

## Full Palette Examples

### 必修3-3 (Diversity / Dark Navy)
```javascript
{ header:"243F60", headerLight:"D9E2EE", accent:"C55A11", accentLight:"FCE4D6",
  green:"375623", greenLight:"E2EFDA", purple:"7030A0", purpleLight:"EAD1F5" }
```

### 必修3-2 (Morals / Teal)
```javascript
{ header:"1F6B75", headerLight:"D9EFF1", accent:"C55A11", accentLight:"FCE4D6",
  green:"375623", greenLight:"E2EFDA", purple:"7030A0", purpleLight:"EAD1F5" }
```

### Default (Blue)
```javascript
{ header:"2E75B6", headerLight:"D6E4F0", accent:"C55A11", accentLight:"FCE4D6",
  green:"375623", greenLight:"E2EFDA", purple:"7030A0", purpleLight:"EAD1F5" }
```
