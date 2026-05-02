#!/usr/bin/env node
/**
 * generate_lesson.js
 * English Tutor Lesson Prep — docx generation template
 *
 * Usage:
 *   node generate_lesson.js --config /tmp/lesson_config.json --output /path/to/output.docx
 *
 * Or: require this file and call buildDoc(config) directly.
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
  Header, Footer, PageNumber
} = require('docx');
const fs = require('fs');

const args = process.argv.slice(2);
let configPath = null, outputPath = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--config') configPath = args[++i];
  if (args[i] === '--output') outputPath = args[++i];
}

const mkBdr = (c = "CCCCCC") => ({ style: BorderStyle.SINGLE, size: 1, color: c });
const mkBdrs = (c = "CCCCCC") => { const b = mkBdr(c); return { top:b, bottom:b, left:b, right:b }; };
const noBdr  = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBdrs = { top:noBdr, bottom:noBdr, left:noBdr, right:noBdr };
const sp = (h=100) => new Paragraph({ children:[new TextRun("")], spacing:{before:h,after:h} });

function heading1(text, color) {
  return new Paragraph({
    children:[new TextRun({text, bold:true, size:32, color, font:"Arial"})],
    spacing:{before:300,after:160},
    border:{bottom:{style:BorderStyle.SINGLE, size:8, color, space:1}}
  });
}
function heading2(text, color) {
  return new Paragraph({
    children:[new TextRun({text, bold:true, size:26, color, font:"Arial"})],
    spacing:{before:240,after:100}
  });
}
function para(text, opts={}) {
  return new Paragraph({
    children:[new TextRun({text, font:"Arial", size:opts.size||22, bold:opts.bold||false,
      color:opts.color||"000000", italics:opts.italics||false})],
    spacing:{before:opts.before||80, after:opts.after||80},
    alignment:opts.align||AlignmentType.LEFT
  });
}
function infoBox(text, fill="F2F2F2") {
  return new Table({
    width:{size:9360,type:WidthType.DXA}, columnWidths:[9360],
    rows:[new TableRow({children:[new TableCell({
      borders:noBdrs, width:{size:9360,type:WidthType.DXA},
      shading:{fill,type:ShadingType.CLEAR},
      margins:{top:100,bottom:100,left:160,right:160},
      children:[new Paragraph({children:[new TextRun({text,bold:true,size:22,font:"Arial",color:"404040"})]})]
    })]})]
  });
}
function mHCell(text, w, fill) {
  return new TableCell({
    borders:mkBdrs(), width:{size:w,type:WidthType.DXA},
    shading:{fill,type:ShadingType.CLEAR}, margins:{top:80,bottom:80,left:120,right:120},
    children:[new Paragraph({alignment:AlignmentType.CENTER,
      children:[new TextRun({text,bold:true,size:20,color:"FFFFFF",font:"Arial"})]})]
  });
}
function mCell(text, w, fill="FFFFFF", center=false, bold=false) {
  return new TableCell({
    borders:mkBdrs(), width:{size:w,type:WidthType.DXA},
    shading:{fill,type:ShadingType.CLEAR}, margins:{top:60,bottom:60,left:120,right:120},
    children:[new Paragraph({alignment:center?AlignmentType.CENTER:AlignmentType.LEFT,
      children:[new TextRun({text,size:20,bold,font:"Arial"})]})]
  });
}
function vocabTable(rows, hColor, oddFill) {
  return new Table({
    width:{size:9360,type:WidthType.DXA}, columnWidths:[480,2200,1780,4900],
    rows:[
      new TableRow({tableHeader:true, children:[
        mHCell("#",480,hColor), mHCell("英文",2200,hColor),
        mHCell("音标",1780,hColor), mHCell("中文释义",4900,hColor)
      ]}),
      ...rows.map((r,i)=>new TableRow({children:[
        mCell(String(i+1),480,i%2===0?oddFill:"FFFFFF",true),
        mCell(r[0],2200,i%2===0?oddFill:"FFFFFF",false,true),
        mCell(r[1],1780,i%2===0?oddFill:"FFFFFF"),
        mCell(r[2],4900,i%2===0?oddFill:"FFFFFF"),
      ]}))
    ]
  });
}
function phraseTable(rows, hColor, oddFill) {
  return new Table({
    width:{size:9360,type:WidthType.DXA}, columnWidths:[3000,6360],
    rows:[
      new TableRow({tableHeader:true, children:[
        mHCell("词组 / 短语",3000,hColor), mHCell("释义 & 例句提示",6360,hColor)
      ]}),
      ...rows.map((r,i)=>new TableRow({children:[
        mCell(r[0],3000,i%2===0?oddFill:"FFFFFF",false,true),
        mCell(r[1],6360,i%2===0?oddFill:"FFFFFF"),
      ]}))
    ]
  });
}
function genericTable(colSpec, rows, hColor, oddFill, boldFirst=true) {
  return new Table({
    width:{size:9360,type:WidthType.DXA},
    columnWidths:colSpec.map(c=>c.width),
    rows:[
      new TableRow({tableHeader:true, children:colSpec.map(c=>mHCell(c.header,c.width,hColor))}),
      ...rows.map((row,i)=>new TableRow({children:row.map((val,j)=>
        mCell(val,colSpec[j].width,i%2===0?oddFill:"FFFFFF",false,j===0&&boldFirst)
      )}))
    ]
  });
}

function buildDoc(cfg) {
  const C = cfg.colors;
  const ch = [];

  // Header Banner
  ch.push(new Table({
    width:{size:9360,type:WidthType.DXA}, columnWidths:[9360],
    rows:[new TableRow({children:[new TableCell({
      borders:noBdrs, width:{size:9360,type:WidthType.DXA},
      shading:{fill:C.header,type:ShadingType.CLEAR},
      margins:{top:200,bottom:200,left:240,right:240},
      children:[
        new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:`${cfg.student} · 英语课备课文档`,size:36,bold:true,color:"FFFFFF",font:"Arial"})]}),
        new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:cfg.unit,size:26,color:"D6E4F0",font:"Arial"})]}),
        new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:`上课日期：${cfg.date}`,size:22,color:"B0C8E0",font:"Arial"})]}),
      ]
    })]})]
  }));
  ch.push(sp(200));

  ch.push(heading1("⏱  课堂计划", C.header));
  ch.push(infoBox("默写 10min  →  复习讲解 10min  →  新词精讲 20min  →  阅读理解 15min  →  知识点 + 作文 15min","F2F2F2"));
  ch.push(sp(160));

  ch.push(heading1("📝  一、复习默写（上节课 · "+cfg.reviewUnitLabel+"）", C.header));
  if (cfg.reviewNote) ch.push(para(cfg.reviewNote,{color:"595959"}));
  ch.push(sp(80));
  ch.push(vocabTable(cfg.reviewVocab, C.header, C.headerLight));
  ch.push(sp(160));

  ch.push(heading1("🔤  二、新课默写（"+cfg.unit+"）", C.accent));
  if (cfg.newVocabNote) ch.push(para(cfg.newVocabNote,{color:"595959"}));
  ch.push(sp(80));
  ch.push(vocabTable(cfg.newVocab, C.accent, C.accentLight));
  ch.push(sp(160));

  ch.push(heading1("💬  三、核心词组精讲", C.green));
  ch.push(phraseTable(cfg.keyPhrases, C.green, C.greenLight));
  ch.push(sp(160));

  ch.push(heading1("📖  四、阅读理解", C.purple));
  ch.push(heading2("【原创短文】"+cfg.passageTitle, C.purple));
  cfg.passageParagraphs.forEach(p=>ch.push(new Paragraph({children:[new TextRun({text:p,size:21,font:"Arial"})],spacing:{before:100,after:100,line:360}})));
  ch.push(sp(120));
  ch.push(heading2("【阅读题目】", C.purple));
  cfg.questions.forEach(({label,q,ans})=>{
    ch.push(new Paragraph({children:[new TextRun({text:label,bold:true,size:22,color:C.purple,font:"Arial"})],spacing:{before:140,after:40}}));
    q.split('\n').forEach(line=>ch.push(new Paragraph({children:[new TextRun({text:line,size:21,font:"Arial"})],spacing:{before:40,after:40}})));
    ch.push(new Paragraph({children:[new TextRun({text:`答案：${ans}`,bold:true,size:21,color:C.green,font:"Arial"})],spacing:{before:40,after:100}}));
  });
  ch.push(sp(80));
  ch.push(para("【口头讨论题】",{bold:true,color:C.purple}));
  ch.push(para(cfg.discussionPrompt,{color:"595959"}));
  ch.push(sp(160));

  ch.push(heading1("📋  五、知识点精讲", C.green));
  cfg.knowledgePoints.forEach(kp=>{
    ch.push(heading2(kp.title, C.green));
    if (kp.table) ch.push(genericTable(kp.table.colSpec,kp.table.rows,kp.table.hColor||C.green,kp.table.oddFill||C.greenLight,kp.table.boldFirstCol!==false));
    if (kp.note) { ch.push(sp(80)); ch.push(infoBox(kp.note,"FFF2CC")); }
    ch.push(sp(120));
  });
  ch.push(sp(40));

  ch.push(heading1("✍️  六、作文讲解", C.accent));
  ch.push(heading2("【作文方向①】"+cfg.writing1.title, C.accent));
  ch.push(infoBox(cfg.writing1.formatNote,"FFF2CC"));
  ch.push(sp(80));
  ch.push(para("范文首段：",{bold:true}));
  ch.push(new Paragraph({children:[new TextRun({text:cfg.writing1.modelParagraph,size:21,font:"Arial",italics:true})],spacing:{before:80,after:80,line:360}}));
  ch.push(sp(120));
  ch.push(heading2("【作文方向②】"+cfg.writing2.title, C.accent));
  ch.push(infoBox(cfg.writing2.formatNote, C.greenLight));
  ch.push(sp(80));
  ch.push(para("范文首段：",{bold:true}));
  ch.push(new Paragraph({children:[new TextRun({text:cfg.writing2.modelParagraph,size:21,font:"Arial",italics:true})],spacing:{before:80,after:80,line:360}}));
  ch.push(sp(160));

  ch.push(heading1("📅  七、课后作业 & 下节课预告", C.header));
  ch.push(new Table({
    width:{size:9360,type:WidthType.DXA}, columnWidths:[4500,4860],
    rows:[
      new TableRow({tableHeader:true,children:[mHCell("课后作业",4500,C.header),mHCell("下节课默写预告（"+cfg.nextUnitPreview.title+"）",4860,"C00000")]}),
      new TableRow({children:[
        new TableCell({borders:mkBdrs(),width:{size:4500,type:WidthType.DXA},shading:{fill:C.headerLight,type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:140,right:140},
          children:cfg.homeworkItems.map(t=>new Paragraph({children:[new TextRun({text:t,size:21,font:"Arial"})],spacing:{before:60,after:60}}))}),
        new TableCell({borders:mkBdrs(),width:{size:4860,type:WidthType.DXA},shading:{fill:"FCE4D6",type:ShadingType.CLEAR},margins:{top:100,bottom:100,left:140,right:140},
          children:[
            new Paragraph({children:[new TextRun({text:cfg.nextUnitPreview.title,bold:true,size:21,color:"C00000",font:"Arial"})],spacing:{before:60,after:80}}),
            ...cfg.nextUnitPreview.words.map(w=>new Paragraph({children:[new TextRun({text:w,size:20,font:"Arial",color:"404040"})],spacing:{before:40,after:40}}))
          ]})
      ]})
    ]
  }));
  ch.push(sp(200));
  ch.push(new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:`${cfg.student} · 英语课备课文档  ·  由 AI Agent 自动生成`,size:18,color:"AAAAAA",font:"Arial"})]}));

  return new Document({
    styles:{default:{document:{run:{font:"Arial",size:22}}}},
    sections:[{
      properties:{page:{size:{width:11906,height:16838},margin:{top:1080,right:1080,bottom:1080,left:1080}}},
      headers:{default:new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({text:`${cfg.student} · ${cfg.unit} · ${cfg.date}`,size:18,color:"888888",font:"Arial"})]})]})} ,
      footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"第 ",size:18,color:"888888",font:"Arial"}),new TextRun({children:[PageNumber.CURRENT],size:18,color:"888888",font:"Arial"}),new TextRun({text:" 页",size:18,color:"888888",font:"Arial"})]})]})} ,
      children:ch
    }]
  });
}

if (configPath && outputPath) {
  const cfg = JSON.parse(fs.readFileSync(configPath,"utf8"));
  const doc = buildDoc(cfg);
  Packer.toBuffer(doc).then(buf=>{fs.writeFileSync(outputPath,buf);console.log("✅ Written: "+outputPath);}).catch(err=>{console.error(err);process.exit(1);});
}
module.exports = { buildDoc };
