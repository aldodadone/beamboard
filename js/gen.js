/* Generatore: progetto (slide modulari) -> codice LaTeX Beamer */
var LGen=(function(){
"use strict";
var THEMES=[
  {id:'metropolis',name:'Essenziale',desc:'Moderno e pulito, con la barra del titolo piena.'},
  {id:'Madrid',name:'Classico',desc:'Titoli in un riquadro, piè di pagina con autore e titolo.'},
  {id:'Boadilla',name:'Sobrio',desc:'Come il classico, ma più leggero e luminoso.'},
  {id:'Copenhagen',name:'Navigazione',desc:'In alto ricorda sempre in quale sezione sei.'},
  {id:'Berlin',name:'Percorso',desc:'Pallini in alto che mostrano l’avanzamento.'},
  {id:'PaloAlto',name:'Barra laterale',desc:'Indice sempre visibile su un lato.'},
  {id:'Singapore',name:'Leggero',desc:'Sfumature delicate e tanto bianco.'},
  {id:'default',name:'Minimo',desc:'Solo testo su bianco, nessuna decorazione.'}
];
var COLORS=[
  {id:'blu',name:'Blu notte',hex:'1F4E79'},
  {id:'ottanio',name:'Ottanio',hex:'1F6F78'},
  {id:'verde',name:'Verde bosco',hex:'2E6B4F'},
  {id:'bordeaux',name:'Bordeaux',hex:'8C2F39'},
  {id:'arancio',name:'Terracotta',hex:'B5562B'},
  {id:'viola',name:'Viola',hex:'5B3F8C'},
  {id:'grafite',name:'Grafite',hex:'3A3F44'}
];
var FONTS=[
  {id:'lm',name:'Latin Modern',desc:'Il carattere classico di LaTeX.',tex:''},
  {id:'fira',name:'Fira Sans',desc:'Moderno e molto leggibile.',tex:'\\usepackage[sfdefault]{FiraSans}'},
  {id:'heros',name:'Simil Helvetica',desc:'Neutro, da manifesto.',tex:'\\usepackage{tgheros}'},
  {id:'adventor',name:'Geometrico',desc:'Forme tonde, tipo Avant Garde.',tex:'\\usepackage{tgadventor}'},
  {id:'pagella',name:'Graziato elegante',desc:'Con le grazie, tipo Palatino.',tex:'\\usepackage{tgpagella}\\usefonttheme{serif}'}
];
function find(list,id){for(var i=0;i<list.length;i++)if(list[i].id===id)return list[i];return list[0]}

/* Testo semplice -> LaTeX sicuro. Supporta **grassetto** e *corsivo*. */
function clean(s){
  s=String(s||'').replace(/\r/g,'').replace(/\t/g,' ');
  // tiene latino, punteggiatura comune, simboli frequenti; scarta il resto (emoji ecc.)
  return s.replace(/[^\n\u0020-\u007E\u00A0-\u017F\u2013\u2014\u2018\u2019\u201C\u201D\u2026\u2022\u20AC\u00B0]/g,'');
}
function tx(s){
  s=clean(s);
  var out='',i=0;
  var map={'\\':'\\textbackslash{}','{':'\\{','}':'\\}','$':'\\$','&':'\\&','%':'\\%','#':'\\#','_':'\\_','^':'\\textasciicircum{}','~':'\\textasciitilde{}','<':'\\textless{}','>':'\\textgreater{}','|':'\\textbar{}','\u2022':'\\textbullet{}','\u20AC':'\\euro{}','\u00B0':'\\textdegree{}'};
  for(;i<s.length;i++){var c=s[i];out+=map[c]!==undefined?map[c]:c}
  out=out.replace(/\*\*([^*\n]+?)\*\*/g,'\\textbf{$1}').replace(/\*([^*\n]+?)\*/g,'\\emph{$1}').replace(/\*/g,'\\textasteriskcentered{}');
  out=out.replace(/"([^"\n]*)"/g,'\u201C$1\u201D').replace(/"/g,'\u201D');
  return out;
}
/* Più righe: righe vuote = nuovo paragrafo, a capo semplice = a capo */
function para(s){
  var ps=clean(s).split(/\n\s*\n/).map(function(p){
    return p.split('\n').map(function(l){return l.trim()}).filter(Boolean).map(tx).join('\\\\\n');
  }).filter(Boolean);
  return ps.join('\n\n\\medskip\n');
}
/* Formule: arrivano già in LaTeX dall'editor visuale; le ripuliamo per sicurezza */
function cleanMath(s){
  s=String(s||'').replace(/\r?\n+/g,' ').trim();
  s=s.replace(/\\placeholder(\[[^\]]*\])?\{[^{}]*\}/g,'\\square ');
  s=s.replace(/\\(input|include|write|immediate|openout|openin|read|def|edef|gdef|xdef|let|newcommand|renewcommand|catcode|csname|endcsname|special|usepackage|documentclass|begin\{document\}|end\{document\})\b/g,'');
  s=s.replace(/\\degree\b/g,'^{\\circ}').replace(/\\\[|\\\]|\$/g,'');
  s=s.replace(/\\mathrm\{d\}/g,'\\mathrm{d}');
  var depth=0;for(var i=0;i<s.length;i++){var c=s[i];if(c==='\\'){i++;continue}if(c==='{')depth++;else if(c==='}'){depth--;if(depth<0)return '\\text{formula incompleta}'}}
  if(depth!==0) return '\\text{formula incompleta}';
  return s;
}
function hasText(s){return clean(s).trim().length>0}

var BLOCKS={
  text:function(b){return hasText(b.text)?para(b.text):''},
  list:function(b,ctx){
    var lines=clean(b.text).split('\n').filter(function(l){return l.trim()});
    if(!lines.length) return '';
    var env=b.numbered?'enumerate':'itemize', o=['\\begin{'+env+'}'], inSub=false;
    lines.forEach(function(l){
      var sub=/^\s*[-–•]\s*/.test(l)&&o.length>1, t=tx(l.replace(/^\s*[-–•]\s*/,'').trim());
      if(sub){ if(!inSub){o.push('  \\begin{itemize}');inSub=true} o.push('    \\item '+t); }
      else{ if(inSub){o.push('  \\end{itemize}');inSub=false} if(b.stepwise){ctx.steps++;o.push('  \\item<+-> '+t)} else o.push('  \\item '+t); }
    });
    if(inSub) o.push('  \\end{itemize}');
    o.push('\\end{'+env+'}');
    return o.join('\n');
  },
  image:function(b,ctx){
    var w=Math.max(10,Math.min(100,+b.width||70))/100;
    var o=['\\begin{center}'];
    if(b.name&&ctx.images[b.name]) o.push('\\includegraphics[width='+w.toFixed(2)+'\\linewidth,height='+(ctx.full?'0.78':'0.62')+'\\textheight,keepaspectratio]{'+b.name+'}');
    else o.push('\\fcolorbox{black!25}{black!5}{\\parbox[c][2.6cm][c]{'+w.toFixed(2)+'\\linewidth}{\\centering\\color{black!45}\\small Scegli un’immagine}}');
    if(hasText(b.caption)) o.push('\\\\[0.4em]{\\footnotesize\\color{black!60}'+tx(b.caption)+'}');
    o.push('\\end{center}');
    return o.join('\n');
  },
  box:function(b){
    if(!hasText(b.title)&&!hasText(b.text)) return '';
    var env={block:'block',alert:'alertblock',example:'exampleblock'}[b.variant]||'block';
    return '\\begin{'+env+'}{'+tx(b.title)+'}\n'+(hasText(b.text)?para(b.text):'\\mbox{}')+'\n\\end{'+env+'}';
  },
  table:function(b){
    var rows=(b.rows||[]).filter(function(r){return r.some(hasText)});
    if(!rows.length) return '';
    var n=Math.max.apply(null,rows.map(function(r){return r.length}));
    var o=['\\begin{center}','\\begin{adjustbox}{max width=\\linewidth}','\\begin{tabular}{'+'l'.repeat(n)+'}','\\toprule'];
    rows.forEach(function(r,i){
      var cells=[];for(var k=0;k<n;k++){var c=tx(r[k]||'');cells.push(i===0&&b.header?'\\textbf{'+c+'}':c)}
      o.push(cells.join(' & ')+' \\\\');
      if(i===0&&b.header&&rows.length>1) o.push('\\midrule');
    });
    o.push('\\bottomrule','\\end{tabular}','\\end{adjustbox}','\\end{center}');
    return o.join('\n');
  },
  math:function(b){
    var L=cleanMath(b.latex); if(!L) return '';
    var sz={normal:'',large:'\\Large',huge:'\\LARGE'}[b.size||'normal']||'';
    return sz?'{'+sz+'\n\\[ '+L+' \\]\n}':'\\[ '+L+' \\]';
  },
  quote:function(b){
    if(!hasText(b.text)) return '';
    return '\\begin{quote}\n\\itshape \u201C'+tx(b.text).replace(/\n/g,' ')+'\u201D'+(hasText(b.author)?'\\par\\smallskip\\hfill\\upshape\\small --- '+tx(b.author):'')+'\n\\end{quote}';
  }
};
function blocks(list,ctx){
  return (list||[]).map(function(b){var f=BLOCKS[b.kind];return f?f(b,ctx):''}).filter(Boolean).join('\n\n\\medskip\n');
}
var SIZES={normal:'',small:'\\small',tiny:'\\footnotesize'};

function frameTitle(s){return hasText(s.title)?'{'+tx(s.title)+'}'+(hasText(s.subtitle)?'{'+tx(s.subtitle)+'}':''):''}

function slideTex(s,ctx){
  var o=[];
  switch(s.type){
    case 'title':
      o.push('\\begin{frame}','  \\titlepage','\\end{frame}');break;
    case 'toc':
      o.push('\\begin{frame}{'+(hasText(s.title)?tx(s.title):'Indice')+'}','  \\tableofcontents','\\end{frame}');break;
    case 'section':
      var st=hasText(s.title)?tx(s.title):'Sezione';
      o.push('\\section{'+st+'}','\\begin{frame}','  \\sectionpage','\\end{frame}');break;
    case 'content':
      o.push('\\begin{frame}'+frameTitle(s));
      if(SIZES[s.size]) o.push(SIZES[s.size]);
      o.push(blocks(s.zones.main,ctx));
      o.push('\\end{frame}');break;
    case 'columns':
      var r=+(s.ratio||50)/100, gap=0.04;
      o.push('\\begin{frame}'+frameTitle(s));
      if(SIZES[s.size]) o.push(SIZES[s.size]);
      o.push('\\begin{columns}[T]',
        '\\begin{column}{'+(r-gap/2).toFixed(3)+'\\textwidth}',blocks(s.zones.left,ctx),'\\end{column}',
        '\\begin{column}{'+(1-r-gap/2).toFixed(3)+'\\textwidth}',blocks(s.zones.right,ctx),'\\end{column}',
        '\\end{columns}','\\end{frame}');break;
    case 'image':
      ctx.full=true;
      o.push('\\begin{frame}'+frameTitle(s));
      o.push(BLOCKS.image({name:s.image,width:100,caption:s.caption},ctx));
      o.push('\\end{frame}');ctx.full=false;break;
    case 'quote':
      o.push('\\begin{frame}','\\vfill','\\begin{center}','\\begin{minipage}{0.8\\textwidth}',
        '{\\Large\\itshape \u201C'+tx(s.text||'').replace(/\n/g,' ')+'\u201D\\par}',
        hasText(s.author)?'\\bigskip\\hfill{\\usebeamercolor[fg]{structure}--- '+tx(s.author)+'}':'',
        '\\end{minipage}','\\end{center}','\\vfill','\\end{frame}');break;
    case 'closing':
      o.push('\\begin{frame}','\\vfill','\\begin{center}',
        '{\\usebeamercolor[fg]{structure}\\Huge\\bfseries '+(hasText(s.title)?tx(s.title):'Grazie!')+'\\par}',
        hasText(s.text)?'\\bigskip{\\large '+para(s.text)+'\\par}':'',
        '\\end{center}','\\vfill','\\end{frame}');break;
  }
  return o.filter(function(x){return x!==''}).join('\n');
}

function preamble(p){
  var st=p.style, th=find(THEMES,st.theme), col=find(COLORS,st.accent), fo=find(FONTS,st.font);
  var o=[
    '\\documentclass[aspectratio='+(st.ratio==='43'?'43':'169')+',11pt]{beamer}',
    '\\usepackage[utf8]{inputenc}','\\usepackage[T1]{fontenc}','\\usepackage[italian]{babel}',
    '\\usepackage{lmodern}'];
  if(fo.tex) o.push(fo.tex);
  o.push('\\usepackage{amsmath,amssymb}','\\usepackage{graphicx}','\\usepackage{booktabs}','\\usepackage{adjustbox}','\\usepackage{textcomp}','\\usepackage{eurosym}',
    '\\definecolor{accento}{HTML}{'+col.hex+'}');
  if(th.id==='metropolis'){
    o.push('\\usetheme[sectionpage=none,numbering=fraction,progressbar=frametitle]{metropolis}',
      '\\setbeamercolor{frametitle}{bg=accento,fg=white}',
      '\\setbeamercolor{progress bar}{fg=accento!55!white,bg=accento!25!white}',
      '\\setbeamercolor{title separator}{fg=accento}',
      '\\setbeamercolor{alerted text}{fg=accento}',
      '\\setbeamercolor{structure}{fg=accento}',
      '\\setbeamercolor{section title}{fg=accento}',
      '\\setbeamercolor{block title}{bg=accento!14!white,fg=black!85}',
      '\\setbeamercolor{block body}{bg=accento!5!white}',
      '\\setbeamercolor{block title alerted}{bg=accento,fg=white}','\\setbeamercolor{block body alerted}{bg=accento!10!white}',
      '\\setbeamercolor{block title example}{bg=black!10,fg=black!85}','\\setbeamercolor{block body example}{bg=black!4}');
  }else{
    o.push('\\usetheme{'+th.id+'}','\\usecolortheme[named=accento]{structure}');
    if(th.id==='default') o.push('\\setbeamertemplate{footline}[frame number]');
  }
  o.push('\\setbeamertemplate{navigation symbols}{}','\\setbeamertemplate{blocks}[rounded][shadow=false]',
    '\\uselanguage{Italian}\\languagepath{Italian}',
    '\\deftranslation[to=Italian]{Definition}{Definizione}','\\deftranslation[to=Italian]{Example}{Esempio}',
    '\\setbeamertemplate{section page}{\\begin{center}{\\usebeamercolor[fg]{structure}\\usebeamerfont{title}\\Large\\insertsectionhead\\par}\\medskip{\\color{accento}\\rule{0.3\\textwidth}{1pt}}\\end{center}}');
  var m=p.meta;
  o.push('','\\title{'+(hasText(m.title)?tx(m.title):'Titolo della presentazione')+'}');
  if(hasText(m.subtitle)) o.push('\\subtitle{'+tx(m.subtitle)+'}');
  o.push('\\author{'+tx(m.author)+'}');
  if(hasText(m.institute)) o.push('\\institute{'+tx(m.institute)+'}');
  o.push('\\date{'+(m.date==='none'?'':m.date==='custom'?tx(m.dateText):'\\today')+'}');
  return o;
}

function make(p){
  var lines=preamble(p);
  lines.push('','\\begin{document}');
  var map=[], page=1, ctx={images:p.images||{},steps:0,full:false};
  p.slides.forEach(function(s,i){
    ctx.steps=0;
    lines.push('','% --- slide '+(i+1));
    var start=lines.length+1;
    var t=slideTex(s,ctx).split('\n');
    lines.push.apply(lines,t);
    var pages=Math.max(1,ctx.steps);
    map.push({start:start,end:lines.length,first:page,last:page+pages-1});
    page+=pages;
  });
  if(!p.slides.length) lines.push('\\begin{frame}\\centering Aggiungi la prima slide\\end{frame}');
  lines.push('','\\end{document}','');
  var sections=p.slides.filter(function(s){return s.type==='section'}).map(function(s){return s.title}).join('|');
  return {tex:lines.join('\n'),map:map,preambleEnd:preamble(p).length,sectionsKey:sections,hasToc:p.slides.some(function(s){return s.type==='toc'})};
}
return {make:make,THEMES:THEMES,COLORS:COLORS,FONTS:FONTS,tx:tx};
})();
if(typeof module!=='undefined') module.exports=LGen;
