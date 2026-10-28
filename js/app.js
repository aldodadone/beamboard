(function(){
"use strict";
var $=function(id){return document.getElementById(id)};
function h(tag,attrs){
  var e=document.createElement(tag);
  if(attrs) for(var k in attrs){var v=attrs[k];
    if(k==='class') e.className=v; else if(k==='text') e.textContent=v; else if(k==='html') e.innerHTML=v;
    else if(k.slice(0,2)==='on') e.addEventListener(k.slice(2),v); else if(v!==undefined&&v!==null&&v!==false) e.setAttribute(k,v===true?'':v);
  }
  for(var i=2;i<arguments.length;i++){var c=arguments[i]; if(c==null||c===false) continue; if(Array.isArray(c)) c.forEach(function(x){if(x)e.appendChild(x)}); else e.appendChild(typeof c==='string'?document.createTextNode(c):c)}
  return e;
}
var KEY='lavagna2:progetto';
var IMG={}; // nome -> {bytes, mime, url}

/* ---------------- Modello ---------------- */
var LAYOUTS=[
  {id:'title',name:'Copertina',desc:'Titolo, autore e data della presentazione.',make:function(){return{type:'title'}}},
  {id:'toc',name:'Indice',desc:'Elenco automatico delle sezioni.',make:function(){return{type:'toc',title:'Indice'}}},
  {id:'section',name:'Inizio sezione',desc:'Una slide che apre un nuovo capitolo.',make:function(){return{type:'section',title:'Nuova sezione'}}},
  {id:'text',name:'Testo',desc:'Un titolo e un paragrafo.',make:function(){return{type:'content',title:'Titolo della slide',zones:{main:[{kind:'text',text:'Scrivi qui il testo della slide.'}]}}}},
  {id:'list',name:'Elenco puntato',desc:'Punti chiave, anche uno alla volta.',make:function(){return{type:'content',title:'Punti chiave',zones:{main:[{kind:'list',text:'Primo punto\nSecondo punto\nTerzo punto'}]}}}},
  {id:'cols',name:'Due colonne',desc:'Due testi affiancati.',make:function(){return{type:'columns',title:'Due colonne',ratio:50,zones:{left:[{kind:'text',text:'Testo a sinistra.'}],right:[{kind:'text',text:'Testo a destra.'}]}}}},
  {id:'textimg',name:'Testo e immagine',desc:'Elenco a sinistra, immagine a destra.',make:function(){return{type:'columns',title:'Testo e immagine',ratio:55,zones:{left:[{kind:'list',text:'Un primo punto\nUn secondo punto'}],right:[{kind:'image',name:'',width:100,caption:''}]}}}},
  {id:'image',name:'Immagine grande',desc:'Una foto o un grafico che riempie la slide.',make:function(){return{type:'image',title:'',image:'',caption:''}}},
  {id:'boxes',name:'Riquadri',desc:'Concetti chiave messi in evidenza.',make:function(){return{type:'content',title:'Da ricordare',zones:{main:[{kind:'box',variant:'block',title:'Un concetto',text:'Spiegazione breve.'},{kind:'box',variant:'example',title:'Un esempio',text:'Un caso concreto.'}]}}}},
  {id:'table',name:'Tabella',desc:'Dati ordinati in righe e colonne.',make:function(){return{type:'content',title:'I numeri',zones:{main:[{kind:'table',header:true,rows:[['Voce','2025','2026'],['Prima voce','10','12'],['Seconda voce','20','25']]}]}}}},
  {id:'quote',name:'Citazione',desc:'Una frase importante, grande e centrata.',make:function(){return{type:'quote',text:'Una frase che vale la pena ricordare.',author:'Autore'}}},
  {id:'closing',name:'Chiusura',desc:'Ringraziamenti e contatti.',make:function(){return{type:'closing',title:'Grazie!',text:'nome@esempio.it'}}}
];
var TYPE_NAME={title:'Copertina',toc:'Indice',section:'Inizio sezione',content:'Contenuto',columns:'Due colonne',image:'Immagine grande',quote:'Citazione',closing:'Chiusura'};
function sketch(id){
  var a='var(--accent)',l='var(--line)',m='var(--muted)';
  var r=function(x,y,w,hh,f,rx){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+hh+'" rx="'+(rx||2)+'" fill="'+f+'"/>'};
  var top=r(0,0,160,18,a,0)+r(10,6,60,6,'#fff');
  var lines=function(x,y,w,n){var s='';for(var i=0;i<n;i++)s+=r(x,y+i*11,w-(i%2)*14,5,l);return s};
  var bul=function(x,y,n){var s='';for(var i=0;i<n;i++)s+='<circle cx="'+x+'" cy="'+(y+i*12+2.5)+'" r="2.5" fill="'+a+'"/>'+r(x+7,y+i*12,60-(i%2)*12,5,l);return s};
  var body={
    title:r(20,30,90,9,a)+r(20,44,60,5,l)+r(20,58,120,1.5,a)+r(20,66,40,5,l),
    toc:top+bul(18,30,4),
    section:r(40,38,80,8,a)+r(55,52,50,1.5,a),
    text:top+lines(14,30,130,5),
    list:top+bul(18,30,4),
    cols:top+lines(12,30,64,4)+lines(86,30,64,4),
    textimg:top+bul(14,32,3)+r(92,28,56,44,l,6),
    image:r(12,10,136,70,l,8),
    boxes:top+r(14,28,132,8,a,3)+r(14,36,132,12,l,3)+r(14,54,132,8,m,3)+r(14,62,132,12,l,3),
    table:top+r(30,30,100,1.5,m)+lines(30,36,100,3)+r(30,70,100,1.5,m),
    quote:r(30,32,100,6,m)+r(40,44,80,6,m)+r(90,60,40,5,a),
    closing:r(45,34,70,12,a)+r(55,54,50,5,l),
    formula:top+r(40,34,80,10,m,3)+r(30,52,100,4,l)+r(30,60,70,4,l),
    colL:top+r(10,26,68,56,a,6)+r(84,26,68,56,l,6),
    colR:top+r(10,26,68,56,l,6)+r(84,26,68,56,a,6)
  }[id]||'';
  return '<svg viewBox="0 0 160 90" aria-hidden="true">'+r(0,0,160,90,'var(--surface)',8)+body+'</svg>';
}
function defaultProject(){
  return {meta:{title:'La mia presentazione',subtitle:'Un sottotitolo breve',author:'Nome Cognome',institute:'',date:'today',dateText:''},
    style:{theme:'metropolis',accent:'blu',font:'fira',ratio:'169'},
    slides:[LAYOUTS[0].make(),{type:'section',title:'Introduzione'},LAYOUTS[4].make(),LAYOUTS[6].make(),LAYOUTS[11].make()]};
}
var P=null, cur=0;
function imagesFlag(){var o={};Object.keys(IMG).forEach(function(k){o[k]=true});return o}
function project(){return {meta:P.meta,style:P.style,slides:P.slides,images:imagesFlag()}}

/* ---------------- Salvataggio ---------------- */
function b64(bytes){var s='',CH=0x8000;for(var i=0;i<bytes.length;i+=CH)s+=String.fromCharCode.apply(null,bytes.subarray(i,i+CH));return btoa(s)}
function unb64(s){var b=atob(s),u=new Uint8Array(b.length);for(var i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
function serialize(withImages){
  var o={app:'beamboard',version:1,meta:P.meta,style:P.style,slides:P.slides,images:{}};
  if(withImages) Object.keys(IMG).forEach(function(k){o.images[k]={mime:IMG[k].mime,data:b64(IMG[k].bytes)}});
  return JSON.stringify(o);
}
var loadingData=false;
function loadData(o){
  if(!o||!o.slides) throw new Error('file non valido');
  loadingData=true;
  Object.keys(IMG).forEach(function(k){URL.revokeObjectURL(IMG[k].url)});
  IMG={};
  P={meta:o.meta||{},style:o.style||{},slides:o.slides};
  var d=defaultProject(); for(var k in d.meta) if(P.meta[k]===undefined) P.meta[k]=d.meta[k]; for(k in d.style) if(!P.style[k]) P.style[k]=d.style[k];
  Object.keys(o.images||{}).forEach(function(n){var im=o.images[n]; if(im&&im.data) addImage(n,unb64(im.data),im.mime)});
  loadingData=false; cur=0; written={};
}
/* ---- Archivio del browser (IndexedDB): progetto, immagini e collegamento al file ---- */
var idbP=null;
function idb(){
  if(!idbP) idbP=new Promise(function(res,rej){var r=indexedDB.open('beamboard',1);r.onupgradeneeded=function(){r.result.createObjectStore('kv')};r.onsuccess=function(){res(r.result)};r.onerror=function(){rej(r.error)}});
  return idbP;
}
function idbDo(mode,fn){return idb().then(function(db){return new Promise(function(res,rej){var t=db.transaction('kv',mode),st=t.objectStore('kv'),out=fn(st);t.oncomplete=function(){res(out&&out.result!==undefined?out.result:out)};t.onerror=function(){rej(t.error)}})})}
function idbGet(k){return idbDo('readonly',function(st){return st.get(k)})}
function idbSet(k,v){return idbDo('readwrite',function(st){st.put(v,k)})}
function idbDel(k){return idbDo('readwrite',function(st){st.delete(k)})}
function idbKeys(){return idbDo('readonly',function(st){return st.getAllKeys()})}
function saveImageLocal(name){var im=IMG[name];if(im)idbSet('img:'+name,{mime:im.mime,bytes:im.bytes}).catch(function(){})}
function resetImagesLocal(){return idbKeys().then(function(ks){return Promise.all(ks.filter(function(k){return String(k).indexOf('img:')===0}).map(idbDel))}).then(function(){Object.keys(IMG).forEach(saveImageLocal)}).catch(function(){})}
var saveT=0, localWarned=false;
function persist(){
  clearTimeout(saveT);
  saveT=setTimeout(function(){
    idbSet('project',{meta:P.meta,style:P.style,slides:P.slides}).catch(function(){if(!localWarned){localWarned=true;toast('Non riesco a conservare le modifiche nel browser: usa «Salva su file».')}});
  },400);
  fileDirty();
}

/* ---- Salvataggio automatico su un file del computer ---- */
var FS={handle:null,state:'none',dirty:false,timer:0,writing:false};
var canFS=typeof window.showSaveFilePicker==='function';
function fileState(st,text,title){FS.state=st;var b=$('fileState');b.setAttribute('data-state',st);$('fileText').textContent=text;b.title=title||text}
function fname(){return FS.handle?FS.handle.name:''}
function showFileState(){
  if(!FS.handle){fileState('none','Solo in questo browser','Le modifiche restano in questo browser. Con «Salva su file» avrai anche un file sul computer che si aggiorna da solo.');$('saveBtn').textContent=canFS?'Salva su file':'Salva';return}
  $('saveBtn').textContent='Salva con nome…';
}
function fileDirty(){
  if(!FS.handle||FS.state==='paused'||FS.state==='error'){FS.dirty=true;return}
  FS.dirty=true; fileState('saving','Salvataggio…'); clearTimeout(FS.timer); FS.timer=setTimeout(writeFile,1200);
}
function writeFile(){
  if(!FS.handle) return Promise.resolve();
  if(FS.writing){clearTimeout(FS.timer);FS.timer=setTimeout(writeFile,500);return Promise.resolve()}
  FS.writing=true; FS.dirty=false; var h=FS.handle, data=serialize(true);
  return h.createWritable().then(function(w){return w.write(data).then(function(){return w.close()})}).then(function(){
    FS.writing=false; if(FS.handle!==h) return;
    if(FS.dirty){fileDirty();return}
    var t=new Date(); fileState('saved','Salvato in «'+h.name+'»','Ogni modifica viene salvata da sola in «'+h.name+'». Ultimo salvataggio alle '+t.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})+'.');
  },function(e){
    FS.writing=false; FS.dirty=true;
    if(e&&e.name==='NotAllowedError') fileState('paused','Salvataggio in pausa: premi qui','Il browser chiede il permesso di continuare a salvare in «'+h.name+'».');
    else fileState('error','Non riesco a salvare: premi per riprovare','Il file potrebbe essere stato spostato o rinominato. Premi per riprovare, oppure usa «Salva con nome…».');
  });
}
function connect(handle,writeNow){
  FS.handle=handle; idbSet('fileHandle',handle).catch(function(){});
  showFileState(); if(writeNow) return writeFile();
  fileState('saved','Salvato in «'+handle.name+'»'); return Promise.resolve();
}
function disconnect(){FS.handle=null;FS.dirty=false;clearTimeout(FS.timer);idbDel('fileHandle').catch(function(){});showFileState()}
function saveAs(){
  if(!canFS){download(new Blob([serialize(true)],{type:'application/json'}),fileBase()+'.beamboard');toast('Progetto scaricato: riaprilo con «Apri» per continuare a modificarlo.');return}
  window.showSaveFilePicker({suggestedName:fileBase()+'.beamboard',types:[{description:'Presentazione BeamBoard',accept:{'application/json':['.beamboard']}}]})
    .then(function(h){return connect(h,true).then(function(){toast('D’ora in poi ogni modifica viene salvata da sola in «'+h.name+'».')})},function(e){if(e&&e.name!=='AbortError')toast('Non sono riuscito a creare il file.')});
}
function resume(){
  var h=FS.handle; if(!h) return;
  (h.requestPermission?h.requestPermission({mode:'readwrite'}):Promise.resolve('granted')).then(function(p){
    if(p==='granted'){fileState('saving','Salvataggio…');writeFile()}else fileState('paused','Salvataggio in pausa: premi qui');
  },function(){fileState('paused','Salvataggio in pausa: premi qui')});
}
$('fileState').onclick=function(){if(FS.state==='paused'||FS.state==='error')resume()};
window.addEventListener('beforeunload',function(e){if(FS.handle&&(FS.dirty||FS.writing)&&FS.state!=='paused'){e.preventDefault();e.returnValue=''}});
function addImage(name,bytes,mime){
  if(IMG[name]) URL.revokeObjectURL(IMG[name].url);
  IMG[name]={bytes:bytes,mime:mime,url:URL.createObjectURL(new Blob([bytes],{type:mime}))};
  if(!loadingData) saveImageLocal(name);
  written[name]=false;
}

/* ---------------- Interfaccia: elenco slide ---------------- */
var thumbs=[];
function label(s){
  var t=(s.type==='title'?P.meta.title:s.title)||'';
  if(s.type==='quote') t=s.text||'';
  return TYPE_NAME[s.type]+(t?' · '+t:'');
}
var ICON={
  wand:'<path d="M5 19L15 9"/><path d="M14 5l.8 1.8L16.6 7.6 14.8 8.4 14 10.2 13.2 8.4 11.4 7.6 13.2 6.8z"/><path d="M19 11l.5 1 1 .5-1 .5-.5 1-.5-1-1-.5 1-.5z"/>',
  up:'<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>',
  down:'<path d="M12 5v14"/><path d="M6 13l6 6 6-6"/>',
  dup:'<rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  del:'<path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/>'
};
function ico(n){return '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICON[n]+'</svg>'}
function tool(name,icon,title,fn,disabled){return h('button',{type:'button',class:'tool','data-tool':name,title:title,'aria-label':title,disabled:disabled,html:ico(icon),onclick:function(e){e.stopPropagation();fn()}})}
function renderList(){
  var box=$('slides'); box.innerHTML=''; thumbs=[];
  P.slides.forEach(function(s,i){
    var ph=h('div',{class:'ph',text:'…'});
    var b=h('button',{class:'thumb'+(i===cur?' sel':''),'aria-current':i===cur?'true':null,onclick:function(){select(i)}},
      h('span',{class:'n',text:String(i+1)}),h('span',{class:'pic'},ph,h('span',{class:'cap',text:label(s)})));
    var tools=h('div',{class:'tools',role:'toolbar','aria-label':'Comandi della slide '+(i+1)},
      tool('wiz','wand','Procedura guidata',function(){cur=i;renderList();renderInsp();showCurrent();slideWizard(i)}),
      tool('up','up','Sposta su',function(){moveSlide(i,-1)},i===0),
      tool('down','down','Sposta giù',function(){moveSlide(i,1)},i===P.slides.length-1),
      tool('dup','dup','Duplica',function(){dupSlide(i)}),
      tool('del','del','Elimina',function(){delSlide(i)}));
    thumbs.push(ph); box.appendChild(h('div',{class:'slot'},b,tools));
  });
  var sel=box.children[cur]; if(sel&&sel.scrollIntoView) sel.scrollIntoView({block:'nearest'});
  $('docName').textContent='· '+(P.meta.title||'Senza titolo');
  paintThumbs();
}
function select(i){cur=Math.max(0,Math.min(P.slides.length-1,i));renderList();renderInsp();showCurrent()}

/* ---------------- Interfaccia: ispettore ---------------- */
function changed(structural){persist();schedule();if(structural){renderList()}else{updateCaption()}}
function updateCaption(){var c=$('slides').children[cur];if(c)c=c.querySelector('.thumb');if(c){c.querySelector('.cap').textContent=label(P.slides[cur])}$('docName').textContent='· '+(P.meta.title||'Senza titolo')}
function field(lbl,obj,key,opts){
  opts=opts||{};
  var el=opts.multi?h('textarea',{class:'input',rows:opts.rows||3,placeholder:opts.ph||''}):h('input',{class:'input',type:'text',placeholder:opts.ph||''});
  el.value=obj[key]||'';
  el.addEventListener('input',function(){obj[key]=el.value;changed(false)});
  return h('label',{class:'field'},h('span',{text:lbl}),el,opts.hint?h('div',{class:'hint',text:opts.hint}):null);
}
function seg(options,get,set,onch){
  var wrap=h('div',{class:'seg',role:'group'});
  options.forEach(function(o){
    var b=h('button',{type:'button',class:get()===o[0]?'on':'',text:o[1],'aria-pressed':String(get()===o[0]),onclick:function(){set(o[0]);Array.prototype.forEach.call(wrap.children,function(x){x.className='';x.setAttribute('aria-pressed','false')});b.className='on';b.setAttribute('aria-pressed','true');(onch||function(){changed(false)})()}});
    wrap.appendChild(b);
  });
  return wrap;
}
function toggle(lbl,obj,key,onch){
  var i=h('input',{type:'checkbox'});i.checked=!!obj[key];
  i.addEventListener('change',function(){obj[key]=i.checked;(onch||function(){changed(false)})()});
  return h('label',{class:'toggle'},i,lbl);
}
var FMT_HINT='Per il grassetto scrivi **così**, per il corsivo *così*.';
function imagePicker(get,set){
  var wrap=h('div',{class:'imgs'});
  function draw(){
    wrap.innerHTML='';
    Object.keys(IMG).forEach(function(n){
      var isPdf=IMG[n].mime==='application/pdf';
      wrap.appendChild(h('button',{type:'button',class:get()===n?'on':'',title:n,'aria-label':n,onclick:function(){set(n);draw();changed(false)}},isPdf?h('span',{text:'PDF'}):h('img',{src:IMG[n].url,alt:''})));
    });
    wrap.appendChild(h('button',{type:'button',class:'up',text:'Carica…',onclick:function(){upload(function(names){if(names[0]){set(names[0]);draw();changed(false)}})}}));
  }
  draw();
  return wrap;
}
var BLOCK_NAME={text:'Testo',list:'Elenco',image:'Immagine',box:'Riquadro',table:'Tabella',quote:'Citazione',math:'Formula'};
function newBlock(k){
  return {text:{kind:'text',text:''},list:{kind:'list',text:'',numbered:false,stepwise:false},image:{kind:'image',name:'',width:70,caption:''},
    box:{kind:'box',variant:'block',title:'Titolo',text:''},table:{kind:'table',header:true,rows:[['','',''],['','','']]},quote:{kind:'quote',text:'',author:''},math:{kind:'math',latex:'',size:'large'}}[k];
}
var QUICK=[
  {s:'a⁄b',t:'Frazione',l:'\\frac{#@}{#?}'},{s:'x²',t:'Potenza (esponente)',l:'#@^{#?}'},{s:'x₂',t:'Pedice',l:'#@_{#?}'},
  {s:'√',t:'Radice quadrata',l:'\\sqrt{#@}'},{s:'ⁿ√',t:'Radice di indice n',l:'\\sqrt[#?]{#@}'},{s:'( )',t:'Parentesi che si adattano',l:'\\left(#@\\right)'},
  {s:'Σ',t:'Sommatoria',l:'\\sum_{#?}^{#?}'},{s:'∫',t:'Integrale',l:'\\int_{#?}^{#?}'},{s:'lim',t:'Limite',l:'\\lim_{#?\\to #?}'},
  {s:'Parole',t:'Parole normali dentro la formula',l:'\\text{#?}',word:true},{sep:true},
  {s:'±',t:'Più o meno',l:'\\pm'},{s:'×',t:'Per',l:'\\times'},{s:'·',t:'Per (puntino)',l:'\\cdot'},{s:'÷',t:'Diviso',l:'\\div'},
  {s:'≠',t:'Diverso',l:'\\neq'},{s:'≈',t:'Circa uguale',l:'\\approx'},{s:'≤',t:'Minore o uguale',l:'\\le'},{s:'≥',t:'Maggiore o uguale',l:'\\ge'},
  {s:'∞',t:'Infinito',l:'\\infty'},{s:'→',t:'Freccia',l:'\\rightarrow'},{s:'°',t:'Gradi',l:'^{\\circ}'},{s:'%',t:'Percento',l:'\\%'},
  {s:'π',t:'Pi greco',l:'\\pi'},{s:'α',t:'Alfa',l:'\\alpha'},{s:'β',t:'Beta',l:'\\beta'},{s:'γ',t:'Gamma',l:'\\gamma'},{s:'Δ',t:'Delta maiuscola',l:'\\Delta'},
  {s:'θ',t:'Theta',l:'\\theta'},{s:'λ',t:'Lambda',l:'\\lambda'},{s:'μ',t:'Mu',l:'\\mu'},{s:'σ',t:'Sigma',l:'\\sigma'},{s:'Ω',t:'Omega maiuscola',l:'\\Omega'}
];
var MATH_HINT='Puoi scrivere direttamente: / crea una frazione, ^ un esponente, _ un pedice; le frecce spostano il cursore. Per tutto il resto usa i pulsanti.';
function mathEditor(obj,key,onch){
  var mf=document.createElement('math-field');
  mf.className='mf'; mf.setAttribute('math-virtual-keyboard-policy','manual'); mf.setAttribute('aria-label','Formula');
  mf.value=obj[key]||'';
  function sync(){obj[key]=mf.getValue('latex-expanded');onch()}
  mf.addEventListener('input',sync);
  var keys=h('div',{class:'mathkeys'});
  QUICK.forEach(function(q){
    if(q.sep){keys.appendChild(h('span',{class:'sep'}));return}
    keys.appendChild(h('button',{type:'button',class:q.word?'word':'',title:q.t,'aria-label':q.t,onmousedown:function(e){e.preventDefault()},onclick:function(){if(document.activeElement!==mf)mf.focus();mf.executeCommand(['insert',q.l,{selectionMode:'placeholder'}]);sync()}},q.s));
  });
  keys.appendChild(h('button',{type:'button',class:'word',title:'Mostra o nascondi la tastiera completa dei simboli',onmousedown:function(e){e.preventDefault()},onclick:function(){mf.focus();var k=window.mathVirtualKeyboard;if(k){if(k.visible)k.hide();else k.show()}}},'Tutti i simboli…'));
  return h('div',{class:'matheditor'},mf,keys,h('div',{class:'hint',text:MATH_HINT}));
}
function blockEditor(b,list,idx,redraw){
  var body=[];
  if(b.kind==='text') body.push(field('Testo',b,'text',{multi:true,rows:4,ph:'Scrivi qui…',hint:FMT_HINT}));
  if(b.kind==='list'){
    body.push(field('Voci',b,'text',{multi:true,rows:4,ph:'Una voce per riga',hint:'Una voce per riga. Inizia una riga con il trattino - per un sotto-punto. '+FMT_HINT}));
    body.push(h('div',null,toggle('Numerato',b,'numbered'),toggle('Un punto alla volta',b,'stepwise')));
  }
  if(b.kind==='image'){
    body.push(h('div',{class:'field'},h('span',{text:'Immagine'}),imagePicker(function(){return b.name},function(n){b.name=n})));
    var val=h('span',{text:(b.width||70)+'%'}), rg=h('input',{type:'range',min:20,max:100,step:5,'aria-label':'Larghezza'});
    rg.value=b.width||70; rg.addEventListener('input',function(){b.width=+rg.value;val.textContent=rg.value+'%';changed(false)});
    body.push(h('div',{class:'field'},h('span',{text:'Larghezza'}),h('div',{class:'range'},rg,val)));
    body.push(field('Didascalia (facoltativa)',b,'caption'));
  }
  if(b.kind==='box'){
    body.push(h('div',{class:'field'},h('span',{text:'Stile'}),seg([['block','Normale'],['alert','In evidenza'],['example','Esempio']],function(){return b.variant},function(v){b.variant=v})));
    body.push(field('Titolo del riquadro',b,'title'));
    body.push(field('Testo',b,'text',{multi:true,rows:3,hint:FMT_HINT}));
  }
  if(b.kind==='table') body.push(tableEditor(b));
  if(b.kind==='quote'){body.push(field('Citazione',b,'text',{multi:true,rows:3}));body.push(field('Autore',b,'author'))}
  if(b.kind==='math'){body.push(mathEditor(b,'latex',function(){changed(false)}));body.push(h('div',{class:'field'},h('span',{text:'Grandezza'}),seg([['normal','Normale'],['large','Grande'],['huge','Molto grande']],function(){return b.size||'normal'},function(v){b.size=v})))}
  var head=h('div',{class:'block-head'},h('strong',null,h('i'),BLOCK_NAME[b.kind]),
    h('button',{class:'icon',type:'button',title:'Sposta su','aria-label':'Sposta su',disabled:idx===0,onclick:function(){list.splice(idx-1,0,list.splice(idx,1)[0]);redraw();changed(false)}},'↑'),
    h('button',{class:'icon',type:'button',title:'Sposta giù','aria-label':'Sposta giù',disabled:idx===list.length-1,onclick:function(){list.splice(idx+1,0,list.splice(idx,1)[0]);redraw();changed(false)}},'↓'),
    h('button',{class:'icon',type:'button',title:'Elimina blocco','aria-label':'Elimina blocco',onclick:function(){var removed=list.splice(idx,1)[0];redraw();changed(false);toast('Blocco eliminato',function(){list.splice(idx,0,removed);redraw();changed(false)})}},'✕'));
  return h('div',{class:'block'},head,body);
}
function tableEditor(b,onch){
  var ch=onch||function(){ch()};
  var wrap=h('div');
  function draw(){
    wrap.innerHTML='';
    var tb=h('table');
    b.rows.forEach(function(r,i){
      var tr=h('tr');
      r.forEach(function(c,j){
        var inp=h('input',{type:'text',class:i===0&&b.header?'hd':'','aria-label':'Riga '+(i+1)+', colonna '+(j+1)});inp.value=c;
        inp.addEventListener('input',function(){b.rows[i][j]=inp.value;ch()});
        tr.appendChild(h('td',null,inp));
      });
      tb.appendChild(tr);
    });
    var cols=b.rows[0]?b.rows[0].length:0;
    wrap.appendChild(h('div',{class:'grid'},tb));
    wrap.appendChild(h('div',{class:'addrow',style:'margin-bottom:8px'},
      h('button',{type:'button',text:'+ Riga',onclick:function(){b.rows.push(new Array(cols).fill(''));draw();ch()}}),
      h('button',{type:'button',text:'+ Colonna',onclick:function(){b.rows.forEach(function(r){r.push('')});draw();ch()}}),
      b.rows.length>1?h('button',{type:'button',text:'− Riga',onclick:function(){b.rows.pop();draw();ch()}}):null,
      cols>1?h('button',{type:'button',text:'− Colonna',onclick:function(){b.rows.forEach(function(r){r.pop()});draw();ch()}}):null));
    var t=toggle('Prima riga come intestazione',b,'header',ch); t.querySelector('input').addEventListener('change',draw);
    wrap.appendChild(t);
  }
  draw();
  return wrap;
}
function zoneEditor(title,list){
  var wrap=h('div',{class:'zone'});
  function redraw(){
    wrap.innerHTML='';
    if(title) wrap.appendChild(h('h3',{text:title}));
    list.forEach(function(b,i){wrap.appendChild(blockEditor(b,list,i,redraw))});
  }
  redraw();
  return wrap;
}
function addElBtn(){return h('button',{class:'btn primary',type:'button',style:'width:100%;justify-content:center;margin-top:6px',text:'Aggiungi elemento',onclick:function(){elementWizard()}})}
function sizeField(s){return h('div',{class:'field'},h('span',{text:'Grandezza del testo'}),seg([['normal','Normale'],['small','Piccolo'],['tiny','Molto piccolo']],function(){return s.size||'normal'},function(v){s.size=v}),h('div',{class:'hint',text:'Se il contenuto non entra nella slide, prova «Piccolo».'}))}
function convert(s,type){
  var all=[];
  if(s.zones) Object.keys(s.zones).forEach(function(k){all=all.concat(s.zones[k])});
  var n={type:type,title:s.title||'',subtitle:s.subtitle||'',size:s.size};
  if(type==='content') n.zones={main:all};
  if(type==='columns'){var half=Math.ceil(all.length/2);n.ratio=50;n.zones={left:s.zones&&s.zones.left?s.zones.left:all.slice(0,half),right:s.zones&&s.zones.right?s.zones.right:all.slice(half)}}
  if(type==='image'){var im=all.filter(function(b){return b.kind==='image'})[0];n.image=im?im.name:'';n.caption=im?im.caption:''}
  if(type==='quote'){n.text=s.text||'';n.author=s.author||''}
  if(type==='closing'){n.title=s.title||'Grazie!';n.text=s.text||''}
  return n;
}
function renderInsp(){
  var s=P.slides[cur], box=$('insp'); box.innerHTML='';
  if(renderInsp.last!==cur){box.scrollTop=0;renderInsp.last=cur}
  if(!s){$('inspTitle').textContent='Nessuna slide';box.appendChild(h('div',{class:'note',text:'Premi «Aggiungi slide» per iniziare.'}));return}
  $('inspTitle').textContent='Slide '+(cur+1);
  var typeSel=h('select',{class:'input','aria-label':'Tipo di slide'});
  Object.keys(TYPE_NAME).forEach(function(t){var o=h('option',{value:t,text:TYPE_NAME[t]});if(t===s.type)o.selected=true;typeSel.appendChild(o)});
  typeSel.addEventListener('change',function(){P.slides[cur]=convert(s,typeSel.value);renderInsp();changed(true)});
  box.appendChild(h('label',{class:'field'},h('span',{text:'Tipo di slide'}),typeSel));
  switch(s.type){
    case 'title':
      box.appendChild(h('div',{class:'note',text:'La copertina mostra i dati della presentazione: modificarli qui li cambia ovunque.'}));
      box.appendChild(field('Titolo',P.meta,'title'));box.appendChild(field('Sottotitolo',P.meta,'subtitle'));
      box.appendChild(field('Autore o autrice',P.meta,'author'));box.appendChild(field('Ente, scuola o associazione',P.meta,'institute'));
      box.appendChild(h('button',{class:'btn small',type:'button',text:'Data, tema e colori…',onclick:openSettings}));
      break;
    case 'toc':
      box.appendChild(field('Titolo',s,'title'));
      box.appendChild(h('div',{class:'note',text:'L’indice si compila da solo con le slide «Inizio sezione».'}));break;
    case 'section':
      box.appendChild(field('Nome della sezione',s,'title',{hint:'Apparirà anche nell’indice.'}));break;
    case 'content':
      box.appendChild(field('Titolo',s,'title'));box.appendChild(field('Sottotitolo (facoltativo)',s,'subtitle'));
      box.appendChild(sizeField(s));
      s.zones=s.zones||{main:[]};
      box.appendChild(zoneEditor('Contenuto',s.zones.main));box.appendChild(addElBtn());break;
    case 'columns':
      box.appendChild(field('Titolo',s,'title'));box.appendChild(field('Sottotitolo (facoltativo)',s,'subtitle'));
      box.appendChild(h('div',{class:'field'},h('span',{text:'Proporzione delle colonne'}),seg([[40,'Stretta | larga'],[50,'Metà e metà'],[60,'Larga | stretta']],function(){return +s.ratio>=58?60:+s.ratio<=42?40:50},function(v){s.ratio=v})));
      box.appendChild(sizeField(s));
      s.zones=s.zones||{left:[],right:[]};
      box.appendChild(zoneEditor('Colonna sinistra',s.zones.left));box.appendChild(zoneEditor('Colonna destra',s.zones.right));box.appendChild(addElBtn());break;
    case 'image':
      box.appendChild(field('Titolo (facoltativo)',s,'title'));
      box.appendChild(h('div',{class:'field'},h('span',{text:'Immagine'}),imagePicker(function(){return s.image},function(n){s.image=n})));
      box.appendChild(field('Didascalia (facoltativa)',s,'caption'));break;
    case 'quote':
      box.appendChild(field('Citazione',s,'text',{multi:true,rows:4}));box.appendChild(field('Autore',s,'author'));break;
    case 'closing':
      box.appendChild(field('Frase grande',s,'title'));box.appendChild(field('Sotto (contatti, link…)',s,'text',{multi:true,rows:3}));break;
  }
}
function moveSlide(i,dir){var j=i+dir;if(j<0||j>=P.slides.length)return;P.slides.splice(j,0,P.slides.splice(i,1)[0]);cur=j;renderInsp();changed(true);showCurrent();focusTool(j,dir<0?'up':'down')}
function dupSlide(i){P.slides.splice(i+1,0,JSON.parse(JSON.stringify(P.slides[i])));cur=i+1;renderInsp();changed(true);showCurrent();toast('Slide duplicata')}
function delSlide(i){
  var removed=P.slides.splice(i,1)[0]; if(cur>=i&&cur>0&&(cur>i||cur>=P.slides.length))cur--; cur=Math.max(0,Math.min(cur,P.slides.length-1));
  renderInsp();changed(true);showCurrent();
  toast('Slide eliminata',function(){P.slides.splice(i,0,removed);cur=i;renderInsp();changed(true);showCurrent()});
}
function focusTool(i,name){var w=$('slides').children[i];if(!w)return;var b=w.querySelector('[data-tool="'+name+'"]');if(b&&!b.disabled)b.focus();else{var t=w.querySelector('.thumb');if(t)t.focus()}}

/* ---------------- Finestre ---------------- */
function openModal(id){$(id).classList.add('show');var f=$(id).querySelector('button');if(f)f.focus()}
function closeModals(){Array.prototype.forEach.call(document.querySelectorAll('.modal.show'),function(m){m.classList.remove('show')})}
Array.prototype.forEach.call(document.querySelectorAll('[data-close]'),function(b){b.onclick=closeModals});
Array.prototype.forEach.call(document.querySelectorAll('.modal'),function(m){m.addEventListener('click',function(e){if(e.target===m)closeModals()})});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeModals();WZ=null}});
$('addSlide').onclick=function(){slideWizard(null)};
var PREV={}; LGen.THEMES.forEach(function(t){PREV[t.id]='img/temi/'+t.id+'.jpg'});
function openSettings(){
  var b=$('setBody'); b.innerHTML='';
  b.appendChild(h('h3',{class:'sec',text:'Informazioni'}));
  b.appendChild(h('div',{class:'two'},field('Titolo',P.meta,'title'),field('Sottotitolo',P.meta,'subtitle'),field('Autore o autrice',P.meta,'author'),field('Ente, scuola o associazione',P.meta,'institute')));
  var dt=field('Data scritta da te',P.meta,'dateText',{ph:'per esempio: Roma, 12 novembre 2026'}); dt.hidden=P.meta.date!=='custom';
  b.appendChild(h('div',{class:'field'},h('span',{text:'Data in copertina'}),seg([['today','Oggi'],['custom','La scrivo io'],['none','Nessuna']],function(){return P.meta.date},function(v){P.meta.date=v;dt.hidden=v!=='custom'})));
  b.appendChild(dt);
  b.appendChild(h('h3',{class:'sec',text:'Tema'}));
  var th=h('div',{class:'themes'});
  LGen.THEMES.forEach(function(t){
    var c=h('button',{type:'button',class:'theme'+(P.style.theme===t.id?' on':''),onclick:function(){P.style.theme=t.id;Array.prototype.forEach.call(th.children,function(x){x.classList.remove('on')});c.classList.add('on');changed(false)}},
      PREV[t.id]?h('img',{src:PREV[t.id],alt:''}):null,h('b',{text:t.name}),h('span',{text:t.desc}));
    th.appendChild(c);
  });
  b.appendChild(th);
  b.appendChild(h('h3',{class:'sec',text:'Colore principale'}));
  var sw=h('div',{class:'swatches'});
  LGen.COLORS.forEach(function(c){
    var x=h('button',{type:'button',class:'sw'+(P.style.accent===c.id?' on':''),title:c.name,'aria-label':c.name,style:'background:#'+c.hex,onclick:function(){P.style.accent=c.id;Array.prototype.forEach.call(sw.children,function(y){y.classList.remove('on')});x.classList.add('on');changed(false)}});
    sw.appendChild(x);
  });
  b.appendChild(sw);
  b.appendChild(h('h3',{class:'sec',text:'Carattere'}));
  var fo=h('div',{class:'fonts'});
  LGen.FONTS.forEach(function(f){
    var x=h('button',{type:'button',class:'fontcard'+(P.style.font===f.id?' on':''),onclick:function(){P.style.font=f.id;Array.prototype.forEach.call(fo.children,function(y){y.classList.remove('on')});x.classList.add('on');changed(false)}},h('b',{text:f.name}),h('span',{text:f.desc}));
    fo.appendChild(x);
  });
  b.appendChild(fo);
  b.appendChild(h('h3',{class:'sec',text:'Formato'}));
  b.appendChild(seg([['169','Panoramico 16:9'],['43','Classico 4:3']],function(){return P.style.ratio},function(v){P.style.ratio=v}));
  b.appendChild(h('p',{class:'hint',style:'margin-top:22px',html:'Per chi conosce LaTeX: <button class="btn small" type="button" id="texBtn">Scarica il codice LaTeX</button>'}));
  var src=repoURL();
  b.appendChild(h('p',{class:'hint',html:'BeamBoard, versione '+VERSIONE+' · <a href="aiuto.html" target="_blank">Guida</a> · <a href="crediti.html" target="_blank">Crediti e licenze</a>'+(src?' · <a href="'+src+'" target="_blank" rel="noopener">Codice sorgente</a>':'')}));
  $('texBtn').onclick=function(){download(new Blob([LGen.make(project()).tex],{type:'text/plain'}),fileBase()+'.tex')};
  openModal('setModal');
}
$('setBtn').onclick=openSettings;
$('setModal').addEventListener('click',function(e){if(e.target.hasAttribute&&e.target.hasAttribute('data-close')){renderList();renderInsp()}});

/* ---------------- Procedura guidata ---------------- */
function clone(x){return JSON.parse(JSON.stringify(x))}
function noop(){}
/* campi del wizard: non toccano la presentazione finché non si conferma */
function wf(lbl,obj,key,opts){
  opts=opts||{};
  var el=opts.multi?h('textarea',{class:'input big',rows:opts.rows||5,placeholder:opts.ph||''}):h('input',{class:'input big',type:'text',placeholder:opts.ph||''});
  el.value=obj[key]||'';
  el.addEventListener('input',function(){obj[key]=el.value;wizErr('')});
  if(!opts.multi) el.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();wizNext()}});
  return h('label',{class:'field'},lbl?h('span',{text:lbl}):null,el,opts.hint?h('div',{class:'hint',text:opts.hint}):null);
}
function wChoices(opts,obj,key,auto,small){
  var g=h('div',{class:'choices'+(small?' small':'')});
  opts.forEach(function(o){
    var c=h('button',{type:'button',class:'choice'+(obj[key]===o.v?' on':''),'aria-pressed':String(obj[key]===o.v),onclick:function(){
      if(o.pick) o.pick(); else obj[key]=o.v;
      Array.prototype.forEach.call(g.children,function(x){x.classList.remove('on');x.setAttribute('aria-pressed','false')});
      c.classList.add('on');c.setAttribute('aria-pressed','true');wizErr('');
      if(o.after) o.after();
      if(auto) setTimeout(wizNext,120);
    }},
      o.sketch?h('span',{class:'sk',html:sketch(o.sketch)}):null,
      o.swatch?h('span',{class:'swatchbox',style:o.swatch}):null,
      h('b',{text:o.label}),o.desc?h('span',{text:o.desc}):null);
    g.appendChild(c);
  });
  return g;
}
function wGroup(lbl,node){return h('div',{class:'field'},h('span',{text:lbl}),node)}
function wImages(obj,key){
  var wrap=h('div',{class:'imgs big'});
  function draw(){
    wrap.innerHTML='';
    Object.keys(IMG).forEach(function(n){
      var isPdf=IMG[n].mime==='application/pdf';
      wrap.appendChild(h('button',{type:'button',class:obj[key]===n?'on':'',title:n,'aria-label':n,onclick:function(){obj[key]=n;draw();wizErr('')}},isPdf?h('span',{text:'PDF'}):h('img',{src:IMG[n].url,alt:''})));
    });
    wrap.appendChild(h('button',{type:'button',class:'up',onclick:function(){upload(function(names){if(names[0]){obj[key]=names[0];draw()}})}},h('span',{text:'Carica dal Mac…'})));
  }
  draw();
  return wrap;
}
function wBoxes(d){
  var wrap=h('div');
  function draw(){
    wrap.innerHTML='';
    d.boxes.forEach(function(b,i){
      var card=h('div',{class:'block'},
        h('div',{class:'block-head'},h('strong',null,h('i'),'Concetto '+(i+1)),
          d.boxes.length>1?h('button',{class:'icon',type:'button','aria-label':'Togli questo concetto',title:'Togli',onclick:function(){d.boxes.splice(i,1);draw()}},'✕'):null),
        wGroup('Stile',seg([['block','Normale'],['alert','In evidenza'],['example','Esempio']],function(){return b.variant},function(v){b.variant=v},noop)),
        wf('Titolo del riquadro',b,'title',{ph:'Per esempio: Da ricordare'}),
        wf('Testo',b,'text',{multi:true,rows:2}));
      wrap.appendChild(card);
    });
    if(d.boxes.length<4) wrap.appendChild(h('button',{type:'button',class:'btn small',text:'Aggiungi un altro concetto',onclick:function(){d.boxes.push({variant:'block',title:'',text:''});draw()}}));
  }
  draw();
  return wrap;
}
function MATH_STEP(key){return {q:'Scrivi la formula',help:MATH_HINT,render:function(d,b){b.appendChild(mathEditor(d,key,function(){wizErr('')}))},check:function(d){return (d[key]||'').trim()?'':'Scrivi la formula, anche solo in parte.'}}}
var MATH_SIZE_STEP={q:'Quanto grande deve essere la formula?',auto:true,render:function(d,b){b.appendChild(wChoices([{v:'normal',label:'Normale',desc:'Come il testo.'},{v:'large',label:'Grande',desc:'Si nota subito.'},{v:'huge',label:'Molto grande',desc:'Per una formula sola al centro della slide.'}],d,'size',true,true))}};
var SIZE_STEP={q:'Quanto testo c’è in questa slide?',help:'Se è parecchio, rimpicciolisco i caratteri perché entri tutto. Nell’anteprima finale vedrai subito il risultato.',
  render:function(d,b){b.appendChild(wChoices([{v:'normal',label:'Poco o normale',desc:'Caratteri grandi, ben leggibili.'},{v:'small',label:'Parecchio',desc:'Caratteri un po’ più piccoli.'},{v:'tiny',label:'Molto',desc:'Caratteri piccoli: usalo solo se serve.'}],d,'size',true,true))}};
function titleStep(q,help,ph,optional){
  return {q:q||'Che titolo vuoi dare alla slide?',help:help||'Breve e chiaro: compare in alto nella slide.',
    render:function(d,b){b.appendChild(wf('',d,'title',{ph:ph||'Per esempio: Perché ne parliamo'}))},
    check:optional?null:function(d){return d.title&&d.title.trim()?'':'Scrivi un titolo: potrai sempre cambiarlo dopo.'}};
}
function listShape(d,b){
  b.appendChild(wGroup('I punti appaiono…',wChoices([{v:false,label:'Tutti insieme',desc:'La slide è subito completa.'},{v:true,label:'Uno alla volta',desc:'Ogni clic mostra il punto successivo.'}],d,'stepwise',false,true)));
  b.appendChild(wGroup('Davanti a ogni punto…',wChoices([{v:false,label:'Un puntino',desc:'Per idee senza un ordine.'},{v:true,label:'Un numero',desc:'Per passaggi o classifiche.'}],d,'numbered',false,true)));
}
function itemsStep(key,q){
  return {q:q||'Quali sono i punti?',help:'Scrivi un punto per riga. Per un sotto-punto, inizia la riga con un trattino (-). '+FMT_HINT,
    render:function(d,b){b.appendChild(wf('',d,key||'items',{multi:true,rows:7,ph:'Primo punto\nSecondo punto\n- un dettaglio del secondo\nTerzo punto'}))},
    check:function(d){return (d[key||'items']||'').trim()?'':'Scrivi almeno un punto.'}};
}
function bold(t){return t&&t.trim()?'**'+t.trim()+'**':''}
function unbold(t){return String(t||'').replace(/^\*\*(.*)\*\*$/,'$1')}

var INTENTS=[
  {id:'cover',sketch:'title',label:'La copertina',desc:'Titolo, chi presenta e la data.',
    defaults:function(){var m=P.meta;return {title:m.title||'',subtitle:m.subtitle||'',author:m.author||'',institute:m.institute||'',date:m.date||'today',dateText:m.dateText||''}},
    steps:[
      {q:'Come si intitola la presentazione?',help:'Il titolo e, se vuoi, un sottotitolo che lo spiega meglio.',render:function(d,b){b.appendChild(wf('Titolo',d,'title',{ph:'Per esempio: Il ciclo dell’acqua'}));b.appendChild(wf('Sottotitolo (facoltativo)',d,'subtitle'))},check:function(d){return d.title.trim()?'':'Scrivi il titolo della presentazione.'}},
      {q:'Chi la presenta?',help:'Il tuo nome e, se vuoi, l’ente, la scuola o l’associazione.',render:function(d,b){b.appendChild(wf('Nome e cognome',d,'author'));b.appendChild(wf('Ente, scuola o associazione (facoltativo)',d,'institute'))}},
      {q:'Vuoi la data in copertina?',render:function(d,b){
        var dt=wf('Scrivi la data come vuoi che appaia',d,'dateText',{ph:'Per esempio: Roma, 12 novembre 2026'}); dt.hidden=d.date!=='custom';
        b.appendChild(wChoices([{v:'today',label:'Sì, quella di oggi',desc:'Si aggiorna da sola.',after:function(){dt.hidden=true}},{v:'custom',label:'Sì, la scrivo io',desc:'Per una data precisa.',after:function(){dt.hidden=false}},{v:'none',label:'No',desc:'Nessuna data.',after:function(){dt.hidden=true}}],d,'date',false,true));
        b.appendChild(dt);}}
    ],
    build:function(d,proj){['title','subtitle','author','institute','date','dateText'].forEach(function(k){proj.meta[k]=d[k]});return {type:'title'}},
    parse:function(){return this.defaults()}},
  {id:'toc',sketch:'toc',label:'L’indice',desc:'L’elenco delle parti, che si aggiorna da solo.',
    defaults:function(){return {title:'Indice'}},
    steps:[titleStep('Che titolo vuoi dare all’indice?','L’indice si riempie da solo con i nomi delle parti, cioè con le slide «Inizio di una nuova parte».','Indice')],
    build:function(d){return {type:'toc',title:d.title}},parse:function(s){return {title:s.title||'Indice'}}},
  {id:'section',sketch:'section',label:'L’inizio di una nuova parte',desc:'Una slide che apre un capitolo.',
    defaults:function(){return {title:''}},
    steps:[titleStep('Come si chiama questa nuova parte?','Il nome comparirà grande al centro della slide e anche nell’indice.','Per esempio: Le cause')],
    build:function(d){return {type:'section',title:d.title}},parse:function(s){return {title:s.title||''}}},
  {id:'text',sketch:'text',label:'Un concetto spiegato a parole',desc:'Un titolo e qualche frase.',
    defaults:function(){return {title:'',text:'',size:'normal'}},
    steps:[titleStep(),{q:'Cosa vuoi dire?',help:'Scrivi liberamente. Lascia una riga vuota per iniziare un nuovo paragrafo. '+FMT_HINT,render:function(d,b){b.appendChild(wf('',d,'text',{multi:true,rows:8}))},check:function(d){return d.text.trim()?'':'Scrivi qualche frase.'}},SIZE_STEP],
    build:function(d){return {type:'content',title:d.title,size:d.size,zones:{main:[{kind:'text',text:d.text}]}}},
    parse:function(s,use){var bl=blocksOf(s).filter(function(b){return b.kind==='text'});use(bl);return {title:s.title||'',size:s.size||'normal',text:bl.map(function(b){return b.text}).join('\n\n')}}},
  {id:'list',sketch:'list',label:'Alcuni punti o idee',desc:'Un elenco, anche da mostrare un punto alla volta.',
    defaults:function(){return {title:'',items:'',stepwise:false,numbered:false,size:'normal'}},
    steps:[titleStep(),itemsStep(),{q:'Come devono comparire i punti?',render:listShape},SIZE_STEP],
    build:function(d){return {type:'content',title:d.title,size:d.size,zones:{main:[{kind:'list',text:d.items,stepwise:d.stepwise,numbered:d.numbered}]}}},
    parse:function(s,use){var l=blocksOf(s).filter(function(b){return b.kind==='list'})[0]||{};use([l]);return {title:s.title||'',size:s.size||'normal',items:l.text||'',stepwise:!!l.stepwise,numbered:!!l.numbered}}},
  {id:'compare',sketch:'cols',label:'Un confronto tra due cose',desc:'Due colonne affiancate: prima e dopo, pro e contro…',
    defaults:function(){return {title:'',leftName:'',left:'',rightName:'',right:'',size:'normal'}},
    steps:[titleStep(null,null,'Per esempio: Prima e dopo'),
      {q:'Cosa metti nella colonna di sinistra?',help:'Un nome breve e i suoi punti, uno per riga.',render:function(d,b){b.appendChild(wf('Nome (facoltativo)',d,'leftName',{ph:'Per esempio: Prima'}));b.appendChild(wf('Punti',d,'left',{multi:true,rows:5}))}},
      {q:'E nella colonna di destra?',help:'Un nome breve e i suoi punti, uno per riga.',render:function(d,b){b.appendChild(wf('Nome (facoltativo)',d,'rightName',{ph:'Per esempio: Dopo'}));b.appendChild(wf('Punti',d,'right',{multi:true,rows:5}))}},
      SIZE_STEP],
    build:function(d){
      function side(n,t){var z=[];if(n.trim())z.push({kind:'text',text:bold(n)});if(t.trim())z.push({kind:'list',text:t});return z}
      return {type:'columns',title:d.title,size:d.size,ratio:50,zones:{left:side(d.leftName,d.left),right:side(d.rightName,d.right)}}},
    parse:function(s,use){
      var d={title:s.title||'',size:s.size||'normal'},z=s.zones||{};
      ['left','right'].forEach(function(k){var bl=z[k]||[],t=bl.filter(function(b){return b.kind==='text'})[0],l=bl.filter(function(b){return b.kind==='list'})[0];use([t,l]);d[k+'Name']=t?unbold(t.text):'';d[k]=l?l.text:''});
      return d}},
  {id:'textimg',sketch:'textimg',label:'Un testo con un’immagine',desc:'Punti o frasi da un lato, una foto dall’altro.',
    defaults:function(){return {title:'',form:'points',text:'',image:'',side:'right',caption:'',size:'normal'}},
    steps:[titleStep(),
      {q:'Come vuoi scrivere il testo?',render:function(d,b){b.appendChild(wChoices([{v:'points',label:'A punti',desc:'Un elenco di idee brevi.'},{v:'para',label:'Con delle frasi',desc:'Un breve paragrafo.'}],d,'form',true,true))}},
      {q:function(d){return d.form==='points'?'Quali sono i punti?':'Cosa vuoi dire?'},help:function(d){return (d.form==='points'?'Un punto per riga. ':'')+FMT_HINT},render:function(d,b){b.appendChild(wf('',d,'text',{multi:true,rows:6}))}},
      {q:'Quale immagine vuoi usare?',help:'Scegline una già caricata o caricala dal Mac. Vanno bene foto JPG e PNG, e anche grafici in PDF.',render:function(d,b){b.appendChild(wImages(d,'image'))},check:function(d){return d.image?'':'Scegli o carica un’immagine (oppure torna indietro e scegli un altro tipo di slide).'}},
      {q:'Da che parte va l’immagine?',render:function(d,b){b.appendChild(wChoices([{v:'left',label:'A sinistra',desc:'Il testo sta a destra.'},{v:'right',label:'A destra',desc:'Il testo sta a sinistra.'}],d,'side',false,true));b.appendChild(wf('Didascalia sotto l’immagine (facoltativa)',d,'caption'))}},
      SIZE_STEP],
    build:function(d){
      var txt=d.form==='points'?{kind:'list',text:d.text}:{kind:'text',text:d.text}, im={kind:'image',name:d.image,width:100,caption:d.caption};
      return d.side==='left'?{type:'columns',title:d.title,size:d.size,ratio:45,zones:{left:[im],right:[txt]}}:{type:'columns',title:d.title,size:d.size,ratio:55,zones:{left:[txt],right:[im]}}},
    parse:function(s,use){
      var z=s.zones||{},L=z.left||[],R=z.right||[],imgLeft=L.some(function(b){return b.kind==='image'});
      var imz=imgLeft?L:R, tz=imgLeft?R:L, im=imz.filter(function(b){return b.kind==='image'})[0]||{}, t=tz.filter(function(b){return b.kind==='list'||b.kind==='text'})[0];
      use([im,t]);
      return {title:s.title||'',size:s.size||'normal',side:imgLeft?'left':'right',image:im.name||'',caption:im.caption||'',form:t&&t.kind==='text'?'para':'points',text:t?t.text:''}}},
  {id:'image',sketch:'image',label:'Una foto o un grafico in grande',desc:'Un’immagine che riempie la slide.',
    defaults:function(){return {image:'',title:'',caption:''}},
    steps:[{q:'Quale immagine vuoi mostrare?',help:'Scegline una già caricata o caricala dal Mac.',render:function(d,b){b.appendChild(wImages(d,'image'))},check:function(d){return d.image?'':'Scegli o carica un’immagine.'}},
      {q:'Vuoi aggiungere un titolo o una didascalia?',help:'Sono entrambi facoltativi: senza, l’immagine avrà più spazio.',render:function(d,b){b.appendChild(wf('Titolo',d,'title'));b.appendChild(wf('Didascalia',d,'caption'))}}],
    build:function(d){return {type:'image',title:d.title,image:d.image,caption:d.caption}},
    parse:function(s){return {image:s.image||'',title:s.title||'',caption:s.caption||''}}},
  {id:'table',sketch:'table',label:'Numeri o dati in tabella',desc:'Righe e colonne ordinate.',
    defaults:function(){return {title:'',table:{header:true,rows:[['','',''],['','',''],['','','']]},size:'normal'}},
    steps:[titleStep(null,null,'Per esempio: I numeri del progetto'),
      {q:'Inserisci i dati',help:'Ogni casella è una cella. Aggiungi o togli righe e colonne con i pulsanti.',render:function(d,b){b.appendChild(tableEditor(d.table,noop))}},
      SIZE_STEP],
    build:function(d){return {type:'content',title:d.title,size:d.size,zones:{main:[{kind:'table',header:d.table.header,rows:d.table.rows}]}}},
    parse:function(s,use){var t=blocksOf(s).filter(function(b){return b.kind==='table'})[0];use([t]);return {title:s.title||'',size:s.size||'normal',table:t?{header:t.header,rows:t.rows}:this.defaults().table}}},
  {id:'formula',sketch:'formula',label:'Una formula',desc:'Una formula in evidenza, con una spiegazione.',
    defaults:function(){return {title:'',before:'',latex:'',after:'',size:'large'}},
    steps:[titleStep(null,null,'Per esempio: La legge di Ohm'),
      {q:'Vuoi introdurla con una frase?',help:'Facoltativo. Comparirà sopra la formula.',render:function(d,b){b.appendChild(wf('',d,'before',{multi:true,rows:2,ph:'Per esempio: La relazione tra tensione e corrente è'}))}},
      MATH_STEP('latex'),
      {q:'Vuoi spiegarla?',help:'Facoltativo. Per esempio cosa indicano le lettere: una riga per ciascuna.',render:function(d,b){b.appendChild(wf('',d,'after',{multi:true,rows:4,ph:'V è la tensione, in volt\nR è la resistenza, in ohm'}))}},
      MATH_SIZE_STEP],
    build:function(d){var z=[];if(d.before.trim())z.push({kind:'text',text:d.before});z.push({kind:'math',latex:d.latex,size:d.size});if(d.after.trim())z.push({kind:'text',text:d.after});return {type:'content',title:d.title,zones:{main:z}}},
    parse:function(s,use){var bl=blocksOf(s),mi=-1;bl.forEach(function(b,i){if(mi<0&&b.kind==='math')mi=i});var m=bl[mi]||{},bef=bl.slice(0,mi).filter(function(b){return b.kind==='text'}),aft=bl.slice(mi+1).filter(function(b){return b.kind==='text'});use([m].concat(bef,aft));
      return {title:s.title||'',latex:m.latex||'',size:m.size||'large',before:bef.map(function(b){return b.text}).join('\n\n'),after:aft.map(function(b){return b.text}).join('\n\n')}}},
  {id:'boxes',sketch:'boxes',label:'Concetti chiave da ricordare',desc:'Uno o più riquadri messi in evidenza.',
    defaults:function(){return {title:'',boxes:[{variant:'block',title:'',text:''}],size:'normal'}},
    steps:[titleStep(null,null,'Per esempio: Da ricordare'),
      {q:'Quali concetti vuoi mettere in evidenza?',help:'Ogni concetto diventa un riquadro. «In evidenza» è più acceso, «Esempio» usa un colore diverso.',render:function(d,b){b.appendChild(wBoxes(d))},check:function(d){return d.boxes.some(function(x){return (x.title+x.text).trim()})?'':'Scrivi almeno un concetto.'}},
      SIZE_STEP],
    build:function(d){return {type:'content',title:d.title,size:d.size,zones:{main:d.boxes.map(function(x){return {kind:'box',variant:x.variant,title:x.title,text:x.text}})}}},
    parse:function(s,use){var bx=blocksOf(s).filter(function(b){return b.kind==='box'});use(bx);return {title:s.title||'',size:s.size||'normal',boxes:bx.length?bx.map(function(b){return {variant:b.variant,title:b.title,text:b.text}}):this.defaults().boxes}}},
  {id:'quote',sketch:'quote',label:'Una frase importante',desc:'Una citazione grande e centrata.',
    defaults:function(){return {text:'',author:''}},
    steps:[{q:'Qual è la frase?',render:function(d,b){b.appendChild(wf('',d,'text',{multi:true,rows:4}))},check:function(d){return d.text.trim()?'':'Scrivi la frase.'}},
      {q:'Di chi è?',help:'Facoltativo.',render:function(d,b){b.appendChild(wf('',d,'author',{ph:'Nome dell’autore o dell’autrice'}))}}],
    build:function(d){return {type:'quote',text:d.text,author:d.author}},parse:function(s){return {text:s.text||'',author:s.author||''}}},
  {id:'closing',sketch:'closing',label:'I saluti finali',desc:'Un grazie e i contatti.',
    defaults:function(){return {title:'Grazie!',text:''}},
    steps:[{q:'Cosa vuoi scrivere in grande?',render:function(d,b){b.appendChild(wf('',d,'title',{ph:'Grazie!'}))}},
      {q:'Vuoi aggiungere contatti o un link?',help:'Facoltativo. Un’informazione per riga.',render:function(d,b){b.appendChild(wf('',d,'text',{multi:true,rows:4,ph:'nome@esempio.it\nwww.esempio.it'}))}}],
    build:function(d){return {type:'closing',title:d.title,text:d.text}},parse:function(s){return {title:s.title||'',text:s.text||''}}}
];
function intentById(id){for(var i=0;i<INTENTS.length;i++)if(INTENTS[i].id===id)return INTENTS[i];return null}
function blocksOf(s){var a=[];if(s.zones)Object.keys(s.zones).forEach(function(k){a=a.concat(s.zones[k]||[])});return a}
function inferIntent(s){
  var simple={title:'cover',toc:'toc',section:'section',image:'image',quote:'quote',closing:'closing'};
  if(simple[s.type]) return simple[s.type];
  var bl=blocksOf(s);
  if(s.type==='columns') return bl.some(function(b){return b.kind==='image'})?'textimg':'compare';
  if(bl.some(function(b){return b.kind==='math'})) return 'formula';
  if(bl.some(function(b){return b.kind==='table'})) return 'table';
  if(bl.length&&bl.every(function(b){return b.kind==='box'})) return 'boxes';
  if(bl.some(function(b){return b.kind==='list'})) return 'list';
  return 'text';
}

/* motore della procedura */
var WZ=null;
function wizErr(m){$('wizErr').textContent=m||''}
function wizSteps(){return WZ.cfg.steps(WZ.data).filter(function(s){return !s.when||s.when(WZ.data)})}
function openWizard(cfg){
  WZ={cfg:cfg,i:cfg.start||0,data:cfg.data,tok:0};
  $('wizKicker').textContent=cfg.kicker;
  $('wizModal').classList.add('show');
  drawWizard();
}
function drawWizard(){
  var steps=wizSteps(), st=steps[WZ.i], d=WZ.data;
  var dots=$('wizSteps'); dots.innerHTML='';
  steps.forEach(function(_,k){dots.appendChild(h('i',{class:k<WZ.i?'done':k===WZ.i?'now':''}))});
  dots.setAttribute('aria-label','Passo '+(WZ.i+1)+' di '+steps.length);
  $('wizQ').textContent=typeof st.q==='function'?st.q(d):st.q;
  var help=typeof st.help==='function'?st.help(d):st.help;
  $('wizHelp').textContent=help||''; $('wizHelp').hidden=!help;
  wizErr('');
  hideKb(); var b=$('wizBody'); b.innerHTML='';
  if(st.notice) b.appendChild(h('div',{class:'note',text:st.notice}));
  st.render(d,b);
  $('wizBack').style.visibility=WZ.i>0?'visible':'hidden';
  var last=WZ.i===steps.length-1;
  $('wizNext').textContent=last?WZ.cfg.finishLabel:'Avanti';
  $('wizNext').hidden=!!st.auto&&!st.showNext;
  var f=b.querySelector('math-field,textarea,input[type=text]');
  if(f) setTimeout(function(){f.focus()},50); else $('wizNext').hidden?b.querySelector('button')&&b.querySelector('button').focus():$('wizNext').focus();
  $('wizBody').parentNode.scrollTop=0;
}
function wizNext(){
  if(!WZ) return;
  var steps=wizSteps(), st=steps[WZ.i];
  var msg=st.check?st.check(WZ.data):'';
  if(msg){wizErr(msg);return}
  if(WZ.i<steps.length-1){WZ.i++;drawWizard();return}
  var cfg=WZ.cfg, data=WZ.data; WZ=null; $('wizModal').classList.remove('show'); hideKb();
  cfg.finish(data);
}
$('wizNext').onclick=wizNext;
$('wizBack').onclick=function(){if(WZ&&WZ.i>0){WZ.i--;drawWizard()}};
$('wizClose').onclick=function(){WZ=null;$('wizModal').classList.remove('show');hideKb()};
function hideKb(){try{if(window.mathVirtualKeyboard&&window.mathVirtualKeyboard.visible)window.mathVirtualKeyboard.hide()}catch(e){}}

/* passo finale: anteprima vera */
function previewStep(make){
  return {q:'Ecco come viene',help:'Se qualcosa non ti convince, torna indietro e cambialo. Potrai comunque modificare tutto anche dopo.',
    render:function(d,b){
      var box=h('div',{class:'wizprev'}), c=h('canvas'), msg=h('p',{class:'hint',text:'Preparo l’anteprima…'});
      box.appendChild(c); b.appendChild(box); b.appendChild(msg);
      var tok=++WZ.tok, r=make(d);
      previewCompile(r.project).then(function(res){
        if(!WZ||WZ.tok!==tok) return;
        var pg=res.map[r.index]?res.map[r.index].last:1;
        return pdfjsLib.getDocument({data:res.pdf}).promise.then(function(doc){
          return doc.getPage(pg).then(function(page){
            if(!WZ||WZ.tok!==tok) return;
            var w=Math.min(680,box.clientWidth||680), dpr=window.devicePixelRatio||1, v=page.getViewport({scale:1}), vp=page.getViewport({scale:w/v.width*dpr});
            c.width=vp.width;c.height=vp.height;c.style.width=w+'px';
            return page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise.then(function(){msg.textContent='';doc.destroy()});
          });
        });
      }).catch(function(e){if(WZ&&WZ.tok===tok)msg.textContent='Non riesco a mostrare l’anteprima ('+(e&&e.message||e)+'), ma puoi confermare lo stesso e vederla nella schermata principale.'});
    }};
}
function projectClone(){return {meta:clone(P.meta),style:clone(P.style),slides:clone(P.slides),images:imagesFlag()}}

/* procedura per una slide (nuova o esistente) */
function slideWizard(index){
  var editing=index!=null, s=editing?P.slides[index]:null;
  var intent=editing?intentById(inferIntent(s)):null, data={intent:intent?intent.id:null}, lossy=false;
  if(editing){
    var used=[], all=blocksOf(s);
    var parsed=intent.parse(s,function(list){list.forEach(function(x){if(x)used.push(x)})});
    lossy=all.length>0&&all.some(function(b){return used.indexOf(b)<0});
    Object.assign(data,clone(parsed));
  }
  var pickStep={q:editing?'Che cosa mostra questa slide?':'Che cosa vuoi mostrare in questa slide?',
    help:editing?'Puoi tenere lo stesso tipo o sceglierne un altro: ti guiderò passo per passo.':'Scegli quello che si avvicina di più: ti guiderò passo per passo.',
    notice:lossy?'Questa slide contiene elementi aggiunti a mano che la procedura guidata non gestisce: se arrivi in fondo, verranno sostituiti. Puoi sempre chiudere senza cambiare nulla.':null,
    auto:true,showNext:editing,
    render:function(d,b){
      b.appendChild(wChoices(INTENTS.map(function(it){return {v:it.id,label:it.label,desc:it.desc,sketch:it.sketch,pick:function(){
        if(d.intent===it.id) return;
        var keepTitle=d.title, nd=it.defaults();
        Object.keys(d).forEach(function(k){delete d[k]});
        Object.assign(d,nd); d.intent=it.id;
        if(keepTitle&&it.id!=='cover'&&nd.title!==undefined&&!nd.title) d.title=keepTitle;
      }}}),d,'intent',true));
    },
    check:function(d){return d.intent?'':'Scegli un tipo di slide.'}};
  function make(d){
    var proj=projectClone(), it=intentById(d.intent), sl=it.build(clone(d),proj), idx;
    if(editing){idx=index;proj.slides[idx]=sl}else{idx=P.slides.length?cur+1:0;proj.slides.splice(idx,0,sl)}
    return {project:proj,index:idx,slide:sl};
  }
  openWizard({kicker:editing?'Procedura guidata · slide '+(index+1):'Nuova slide',data:data,finishLabel:editing?'Applica le modifiche':'Crea la slide',
    steps:function(d){var it=intentById(d.intent);return [pickStep].concat(it?it.steps:[]).concat(it?[previewStep(make)]:[])},
    finish:function(d){
      var it=intentById(d.intent), sl=it.build(clone(d),P);
      if(editing){P.slides[index]=sl;cur=index}else{var idx=P.slides.length?cur+1:0;P.slides.splice(idx,0,sl);cur=idx}
      renderInsp();changed(true);showCurrent();
      toast(editing?'Slide aggiornata':'Slide creata');
    }});
}

/* procedura per aggiungere un elemento alla slide */
var ELEMENTS=[
  {v:'text',label:'Un testo',desc:'Qualche frase o un paragrafo.'},
  {v:'list',label:'Un elenco',desc:'Punti uno sotto l’altro.'},
  {v:'image',label:'Un’immagine',desc:'Una foto, un disegno o un grafico.'},
  {v:'box',label:'Un riquadro',desc:'Un concetto messo in evidenza.'},
  {v:'table',label:'Una tabella',desc:'Dati in righe e colonne.'},
  {v:'quote',label:'Una citazione',desc:'Una frase con il suo autore.'},
  {v:'math',label:'Una formula',desc:'Frazioni, potenze, radici e simboli.'}
];
function elementWizard(){
  var s=P.slides[cur]; if(!s||!s.zones) return;
  var cols=s.type==='columns';
  var d={kind:null,zone:cols?null:'main',text:'',stepwise:false,numbered:false,image:'',width:70,caption:'',variant:'block',title:'',author:'',latex:'',size:'large',table:{header:true,rows:[['','',''],['','','']]}};
  var KSTEPS={
    text:[{q:'Cosa vuoi scrivere?',help:'Lascia una riga vuota per iniziare un nuovo paragrafo. '+FMT_HINT,render:function(d,b){b.appendChild(wf('',d,'text',{multi:true,rows:7}))},check:function(d){return d.text.trim()?'':'Scrivi qualcosa.'}}],
    list:[itemsStep('text'),{q:'Come devono comparire i punti?',render:listShape}],
    image:[{q:'Quale immagine vuoi aggiungere?',help:'Scegline una già caricata o caricala dal Mac.',render:function(d,b){b.appendChild(wImages(d,'image'))},check:function(d){return d.image?'':'Scegli o carica un’immagine.'}},
      {q:'Quanto deve essere grande?',render:function(d,b){b.appendChild(wChoices([{v:40,label:'Piccola',desc:'Circa un terzo dello spazio.'},{v:70,label:'Media',desc:'Due terzi dello spazio.'},{v:100,label:'Grande',desc:'Tutta la larghezza.'}],d,'width',false,true));b.appendChild(wf('Didascalia (facoltativa)',d,'caption'))}}],
    box:[{q:'Che tipo di riquadro?',auto:true,render:function(d,b){b.appendChild(wChoices([{v:'block',label:'Normale',desc:'Per un concetto da ricordare.',swatch:'background:var(--accent-soft)'},{v:'alert',label:'In evidenza',desc:'Per un avviso o un’idea forte.',swatch:'background:#F4C7C0'},{v:'example',label:'Esempio',desc:'Per un caso concreto.',swatch:'background:#CFE8D6'}],d,'variant',true,true))}},
      {q:'Cosa c’è scritto nel riquadro?',render:function(d,b){b.appendChild(wf('Titolo',d,'title',{ph:'Per esempio: Da ricordare'}));b.appendChild(wf('Testo',d,'text',{multi:true,rows:4,hint:FMT_HINT}))},check:function(d){return (d.title+d.text).trim()?'':'Scrivi un titolo o un testo.'}}],
    table:[{q:'Inserisci i dati',help:'Ogni casella è una cella. Aggiungi o togli righe e colonne con i pulsanti.',render:function(d,b){b.appendChild(tableEditor(d.table,noop))}}],
    quote:[{q:'Qual è la frase?',render:function(d,b){b.appendChild(wf('Citazione',d,'text',{multi:true,rows:3}));b.appendChild(wf('Autore (facoltativo)',d,'author'))},check:function(d){return d.text.trim()?'':'Scrivi la frase.'}}],
    math:[MATH_STEP('latex'),MATH_SIZE_STEP]
  };
  function block(d){
    return {text:{kind:'text',text:d.text},list:{kind:'list',text:d.text,stepwise:d.stepwise,numbered:d.numbered},image:{kind:'image',name:d.image,width:d.width,caption:d.caption},
      box:{kind:'box',variant:d.variant,title:d.title,text:d.text},table:{kind:'table',header:d.table.header,rows:d.table.rows},quote:{kind:'quote',text:d.text,author:d.author},math:{kind:'math',latex:d.latex,size:d.size}}[d.kind];
  }
  function make(d){var proj=projectClone();proj.slides[cur].zones[d.zone].push(clone(block(d)));return {project:proj,index:cur}}
  var kindStep={q:'Cosa vuoi aggiungere alla slide?',auto:true,render:function(d,b){b.appendChild(wChoices(ELEMENTS.map(function(e){return {v:e.v,label:e.label,desc:e.desc,pick:function(){if(d.kind!==e.v){d.kind=e.v;d.text='';d.title=''}}}}),d,'kind',true))},check:function(d){return d.kind?'':'Scegli cosa aggiungere.'}};
  var zoneStep={q:'In quale colonna?',auto:true,render:function(d,b){b.appendChild(wChoices([{v:'left',label:'A sinistra',sketch:'colL'},{v:'right',label:'A destra',sketch:'colR'}],d,'zone',true,true))},check:function(d){return d.zone?'':'Scegli una colonna.'}};
  openWizard({kicker:'Nuovo elemento · slide '+(cur+1),data:d,finishLabel:'Aggiungi alla slide',
    steps:function(d){return [kindStep].concat(cols?[zoneStep]:[]).concat(d.kind?KSTEPS[d.kind]:[]).concat(d.kind&&d.zone?[previewStep(make)]:[])},
    finish:function(d){s.zones[d.zone].push(block(d));renderInsp();changed(false);toast('Elemento aggiunto');
      setTimeout(function(){var bl=$('insp').querySelectorAll('.block');if(bl.length)bl[bl.length-1].scrollIntoView({block:'nearest'})},50)}});
}

/* ---------------- File ---------------- */
function download(blob,name){
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},2000);
}
function fileBase(){return ((P.meta.title||'presentazione').replace(/[\/\\:*?"<>|]/g,'').trim()||'presentazione').slice(0,60)}
$('saveBtn').onclick=saveAs;
function afterLoad(){renderList();renderInsp();lastGood=null;compiledOnce=false;persist();resetImagesLocal();schedule();showCurrent()}
function openFromText(text){loadData(JSON.parse(text));afterLoad()}
$('openBtn').onclick=function(){
  if(!canFS){$('openInput').click();return}
  window.showOpenFilePicker({types:[{description:'Presentazione BeamBoard',accept:{'application/json':['.beamboard','.lavagna','.json']}}]}).then(function(hs){
    var h=hs[0]; return h.getFile().then(function(f){return f.text()}).then(function(t){
      try{openFromText(t)}catch(e){toast('Questo file non è un progetto BeamBoard.');return}
      connect(h,false); toast('Aperto «'+h.name+'»: le modifiche si salvano da sole in questo file.');
    });
  },function(e){if(e&&e.name!=='AbortError')toast('Non sono riuscito ad aprire il file.')});
};
$('openInput').onchange=function(){
  var f=this.files[0]; this.value=''; if(!f) return;
  var r=new FileReader();
  r.onload=function(){try{openFromText(r.result);disconnect()}catch(e){toast('Questo file non è un progetto BeamBoard.')}};
  r.readAsText(f);
};
$('newBtn').onclick=function(){
  var msg=FS.handle?'Iniziare una presentazione nuova? Quella attuale resta salvata in «'+fname()+'».':'Iniziare una presentazione nuova? Quella attuale verrà sostituita: se ti serve, salvala prima con «Salva su file».';
  if(!confirm(msg))return;
  disconnect(); loadData(Object.assign({images:{}},defaultProject())); afterLoad();
};
$('pdfBtn').onclick=function(){if(lastGood) download(new Blob([lastGood.bytes],{type:'application/pdf'}),fileBase()+'.pdf')};
var uploadCb=null;
function upload(cb){uploadCb=cb;$('imgInput').click()}
function uniqueName(base,ext){
  base=base.replace(/\.[^.]+$/,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40)||'immagine';
  var n=base+ext,i=2; while(IMG[n]) n=base+'-'+(i++)+ext; return n;
}
function processImage(file){
  return new Promise(function(res){
    if(file.type==='application/pdf'||/\.pdf$/i.test(file.name)){
      file.arrayBuffer().then(function(buf){var n=uniqueName(file.name,'.pdf');addImage(n,new Uint8Array(buf),'application/pdf');res(n)});return;
    }
    var url=URL.createObjectURL(file), im=new Image();
    im.onload=function(){
      var max=1800, s=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight));
      var c=document.createElement('canvas');c.width=Math.round(im.naturalWidth*s);c.height=Math.round(im.naturalHeight*s);
      var png=/png$/i.test(file.type)||/\.png$/i.test(file.name);
      var ctx=c.getContext('2d'); if(!png){ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height)}
      ctx.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(url);
      c.toBlob(function(bl){bl.arrayBuffer().then(function(buf){var n=uniqueName(file.name,png?'.png':'.jpg');addImage(n,new Uint8Array(buf),png?'image/png':'image/jpeg');res(n)})},png?'image/png':'image/jpeg',0.88);
    };
    im.onerror=function(){URL.revokeObjectURL(url);toast('«'+file.name+'» non si apre: usa una foto JPG o PNG.');res(null)};
    im.src=url;
  });
}
$('imgInput').onchange=function(){
  var files=Array.prototype.slice.call(this.files); this.value='';
  Promise.all(files.map(processImage)).then(function(names){
    names=names.filter(Boolean); persist();
    if(uploadCb){var cb=uploadCb;uploadCb=null;cb(names)}
  });
};

/* ---------------- Avvisi ---------------- */
var toastT=0;
function toast(msg,undo){
  var t=$('toast');$('toastText').textContent=msg;var a=$('toastAct');
  a.hidden=!undo; a.textContent='Annulla'; a.onclick=function(){t.classList.remove('show');if(undo)undo()};
  t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show')},undo?7000:4500);
}
function setStatus(state,text){$('status').setAttribute('data-state',state);$('statusText').textContent=text}

/* ---------------- Motore LaTeX ---------------- */
var lastPages=-1, worker=null, ready=false, busy=false, dirty=false, waiters=[], written={}, compiledOnce=false, lastSections=null;
var PACK_URL='engine/tex-b7b27182c0.bin.gz', PACK_SIZE=24367774;
function bar(p){$('barI').style.width=Math.round(p*100)+'%'}
function fetchPack(){
  return fetch(PACK_URL).then(function(r){
    if(!r.ok) throw new Error('non riesco a scaricare il motore ('+r.status+')');
    if(!r.body||!r.body.getReader) return r.arrayBuffer();
    var total=+r.headers.get('content-length')||PACK_SIZE, got=0, parts=[], rd=r.body.getReader();
    return (function pump(){return rd.read().then(function(x){
      if(x.done){var u=new Uint8Array(got),o=0;parts.forEach(function(p){u.set(p,o);o+=p.length});return u.buffer}
      parts.push(x.value);got+=x.value.length;bar(.05+.6*Math.min(1,got/total));
      $('splashText').textContent='Scarico il motore LaTeX: '+Math.round(got/1048576)+' di '+Math.round(total/1048576)+' MB. Succede solo la prima volta.';
      return pump();
    })})();
  });
}
var packBuf=null;
function cachePack(){
  if(!('caches' in window)||!packBuf||location.protocol==='file:') return;
  caches.open('beamboard-motore').then(function(c){return c.match(PACK_URL).then(function(hit){if(!hit)return c.put(PACK_URL,new Response(packBuf.slice(0),{headers:{'Content-Type':'application/gzip'}}))})}).catch(function(){});
}
function boot(){
  ready=false; written={}; waiters=[]; previewOnce=false;
  setStatus('busy','Preparo il motore…'); bar(.05);
  (packBuf?Promise.resolve(packBuf):fetchPack().then(function(b){packBuf=b;return b})).then(function(buf){
    $('splashText').textContent='Avvio il motore…';
    bar(.7);
    try{worker=new Worker('engine/worker.js')}catch(err){return bootFailed(err&&err.message||String(err))}
    worker.onerror=function(ev){if(!ready)bootFailed(ev.message||'errore sconosciuto')};
    worker.onmessage=function(ev){
      var d=ev.data||{};
      if(d.cmd==='stage'){bar(.85);return}
      if(d.cmd==='bootfail'){bootFailed(d.error);return}
      if(!ready&&d.result==='ok'&&!d.cmd){ready=true;bar(1);setStatus('ready','Pronto');compile();cachePack();return}
      var w=waiters.shift(); if(w) w(d);
    };
    worker.postMessage({cmd:'boot',pack:buf.slice(0)});
  },function(e){bootFailed(e&&e.message||String(e))});
}
function bootFailed(msg){
  setStatus('error','Motore non disponibile');
  $('splashTitle').textContent='Il motore non è partito';
  $('splashText').textContent='('+msg+') Ricarica la pagina. Serve Safari 15 o più recente.';
}
function call(m){return new Promise(function(r){waiters.push(r);worker.postMessage(m)})}
var compT=0;
function schedule(){clearTimeout(compT);compT=setTimeout(compile,900)}
var engineQ=Promise.resolve(), previewOnce=false;
function enqueue(fn){var p=engineQ.then(fn,fn);engineQ=p.then(noop,noop);return p}
function writeImages(){var p=Promise.resolve();Object.keys(IMG).forEach(function(n){if(written[n])return;p=p.then(function(){written[n]=true;return call({cmd:'writefile',url:n,src:IMG[n].bytes})})});return p}
function previewCompile(proj){
  return enqueue(function(){
    if(!ready) throw new Error('il motore non è ancora pronto');
    var gen=LGen.make(proj), runs=0;
    return call({cmd:'writefile',url:'anteprima.tex',src:gen.tex}).then(writeImages).then(function(){worker.postMessage({cmd:'setmainfile',url:'anteprima.tex'});
      function run(){runs++;return call({cmd:'compilelatex'}).then(function(r){if(r.result==='ok'&&runs<2&&(gen.hasToc||!previewOnce))return run();if(r.result==='ok')previewOnce=true;return r})}
      return run();
    }).then(function(r){worker.postMessage({cmd:'setmainfile',url:'main.tex'});
      if(r.status===-254){try{worker.terminate()}catch(e){}setTimeout(boot,50);throw new Error('il motore si è fermato')}
      if(r.result!=='ok') throw new Error('la slide ha un problema');
      return {pdf:new Uint8Array(r.pdf),map:gen.map};
    });
  });
}
function compile(){
  if(!ready) return;
  if(busy){dirty=true;return}
  busy=true; dirty=false; $('badge').classList.add('show'); setStatus('busy','Aggiorno l’anteprima…');
  var gen=LGen.make(project()), t0=performance.now();
  var runs=0, pages=gen.map.length?gen.map[gen.map.length-1].last:0, needTwice=!compiledOnce||pages!==lastPages||(gen.hasToc&&gen.sectionsKey!==lastSections);
  function run(){
    runs++;
    return call({cmd:'compilelatex'}).then(function(r){
      if(r.result==='ok'&&runs<3&&((runs===1&&needTwice)||/Rerun to get|may have changed/.test(r.log||''))) return run();
      return r;
    });
  }
  enqueue(function(){return call({cmd:'writefile',url:'main.tex',src:gen.tex}).then(writeImages).then(run)}).then(function(r){
    busy=false; $('badge').classList.remove('show');
    if(r.status===-254){setStatus('error','Il motore si è fermato: lo riavvio');try{worker.terminate()}catch(e){}showProblem(r.log||'',gen,true);boot();return}
    if(r.result==='ok'){
      compiledOnce=true; lastSections=gen.sectionsKey; lastPages=pages; hideProblem();
      setStatus('ready','Anteprima aggiornata');$('status').title='Aggiornata in '+((performance.now()-t0)/1000).toFixed(1).replace('.',',')+' secondi';
      loadPDF(new Uint8Array(r.pdf),gen.map);
    }else{
      setStatus('error','C’è un problema');showProblem(r.log||'',gen,false);
    }
    if(dirty) schedule();
  },function(e){busy=false;$('badge').classList.remove('show');setStatus('error','Errore: '+e)});
}
function showProblem(log,gen,crash){
  var m=/^l\.(\d+)/m.exec(log), line=m?+m[1]:null, sl=null;
  if(line) gen.map.forEach(function(x,i){if(line>=x.start&&line<=x.end)sl=i});
  var msg=(/^! (.*)$/m.exec(log)||[])[1]||'';
  var why=/Undefined control sequence|Missing|Extra/.test(msg)?'Qualche carattere speciale ha confuso il motore.':/not found/.test(msg)?'Manca un file, forse un’immagine.':/Dimension too large|too large/.test(msg)?'Un’immagine o una tabella è troppo grande.':crash?'Il motore si è fermato all’improvviso.':'';
  var where=sl!=null?'Il problema è nella <b>slide '+(sl+1)+'</b>. ':line&&gen.preambleEnd&&line<=gen.preambleEnd+2?'Il problema è nell’aspetto scelto (tema, carattere o colore). ':'';
  $('problemText').innerHTML=where+(why?esc(why)+' ':'')+'Prova a togliere l’ultima modifica; l’anteprima mostra l’ultima versione riuscita.';
  $('logBox').textContent=(msg?'! '+msg+'\n\n':'')+log.slice(-6000);
  $('problem').classList.add('show');
  if(sl!=null){var c=$('slides').children[sl];if(c)c.style.outline='2px solid var(--danger)'}
}
function hideProblem(){$('problem').classList.remove('show','log');Array.prototype.forEach.call($('slides').children,function(c){c.style.outline=''})}
$('logBtn').onclick=function(){$('problem').classList.toggle('log')};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')}

/* ---------------- Anteprima (PDF.js) ---------------- */
var pdfDoc=null, lastGood=null, renderTok=0;
try{pdfjsLib.GlobalWorkerOptions.workerSrc='vendor/pdf.worker.min.js'}catch(e){}
function loadPDF(bytes,map){
  lastGood={bytes:bytes,map:map}; $('pdfBtn').disabled=false;
  pdfjsLib.getDocument({data:bytes.slice()}).promise.then(function(doc){
    var old=pdfDoc; pdfDoc=doc; if(old) old.destroy();
    $('splash').style.display='none'; $('big').hidden=false;
    showCurrent(); paintThumbs();
  },function(e){setStatus('error','Anteprima non disponibile: '+e.message)});
}
function pageFor(i){var m=lastGood&&lastGood.map[i];return m?m.last:null}
function showCurrent(){
  $('pos').textContent=P.slides.length?('Slide '+(cur+1)+' di '+P.slides.length):'';
  if(!pdfDoc) return;
  var pg=pageFor(cur); if(!pg||pg>pdfDoc.numPages) return;
  var tok=++renderTok;
  pdfDoc.getPage(pg).then(function(page){
    if(tok!==renderTok) return;
    var area=$('stageMain'), aw=area.clientWidth-52, ah=area.clientHeight-52;
    var v=page.getViewport({scale:1}), sc=Math.min(aw/v.width,ah/v.height), dpr=window.devicePixelRatio||1;
    var vp=page.getViewport({scale:sc*dpr}), c=$('big');
    c.width=Math.floor(vp.width);c.height=Math.floor(vp.height);c.style.width=Math.floor(vp.width/dpr)+'px';c.style.height=Math.floor(vp.height/dpr)+'px';
    page.render({canvasContext:c.getContext('2d'),viewport:vp});
  });
}
var thumbTok=0;
function paintThumbs(){
  if(!pdfDoc||!lastGood) return;
  var tok=++thumbTok, list=thumbs.slice(), i=0;
  (function next(){
    if(tok!==thumbTok||i>=list.length) return;
    var idx=i++, pg=pageFor(idx), holder=list[idx];
    if(!pg||pg>pdfDoc.numPages||!holder||!holder.parentNode){next();return}
    pdfDoc.getPage(pg).then(function(page){
      var w=(holder.parentNode.clientWidth||170)*(window.devicePixelRatio||1), v=page.getViewport({scale:1}), vp=page.getViewport({scale:w/v.width});
      var c=document.createElement('canvas');c.width=Math.floor(vp.width);c.height=Math.floor(vp.height);
      return page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise.then(function(){
        if(tok!==thumbTok||!holder.parentNode) return;
        holder.parentNode.replaceChild(c,holder); list[idx]=c; thumbs[idx]=c;
      });
    }).then(next,next);
  })();
}
$('prevBtn').onclick=function(){if(cur>0)select(cur-1)};
$('nextBtn').onclick=function(){if(cur<P.slides.length-1)select(cur+1)};
window.addEventListener('resize',function(){clearTimeout(window.__rz);window.__rz=setTimeout(showCurrent,150)});
document.addEventListener('keydown',function(e){
  var tag=(e.target.tagName||'').toLowerCase(), typing=tag==='input'||tag==='textarea'||tag==='select'||tag==='math-field';
  if((e.metaKey||e.ctrlKey)&&(e.key==='s'||e.key==='S')){e.preventDefault();if(FS.handle&&FS.state!=='paused'&&FS.state!=='error'){clearTimeout(FS.timer);writeFile().then(function(){toast('Salvato')})}else if(FS.handle)resume();else saveAs();return}
  if(typing||document.querySelector('.modal.show')) return;
  if(e.key==='ArrowDown'||e.key==='ArrowRight'){if(cur<P.slides.length-1){e.preventDefault();select(cur+1)}}
  if(e.key==='ArrowUp'||e.key==='ArrowLeft'){if(cur>0){e.preventDefault();select(cur-1)}}
});


/* ---------------- Sito: versione, aggiornamenti, installazione ---------------- */
var VERSIONE='1.0.1';
function repoURL(){var m=/^([^.]+)\.github\.io$/.exec(location.hostname);if(!m)return null;var seg=location.pathname.split('/').filter(Boolean)[0];return 'https://github.com/'+m[1]+'/'+(seg&&seg.indexOf('.')<0?seg:m[1]+'.github.io')}
function banner(text,actLabel,act,cls){
  var b=h('div',{class:'banner'+(cls?' '+cls:''),role:'status'},h('span',{text:text}),
    actLabel?h('button',{class:'btn small',type:'button',text:actLabel,onclick:function(){act();b.remove()}}):null,
    h('button',{class:'icon',type:'button','aria-label':'Chiudi avviso',title:'Chiudi',onclick:function(){b.remove()}},'✕'));
  document.body.insertBefore(b,document.querySelector('.app'));
}
if(typeof window.showSaveFilePicker!=='function'){
  try{if(!localStorage.getItem('beamboard:avvisoBrowser')){banner('BeamBoard funziona al meglio con Chrome, Edge, Vivaldi o Brave: in questo browser manca il salvataggio automatico su un file del computer.','Ho capito',function(){try{localStorage.setItem('beamboard:avvisoBrowser','1')}catch(e){}})}}catch(e){}
}
var installEvt=null;
window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();installEvt=e;$('installBtn').hidden=false});
$('installBtn').onclick=function(){if(!installEvt)return;installEvt.prompt();installEvt.userChoice.then(function(){installEvt=null;$('installBtn').hidden=true})};
window.addEventListener('appinstalled',function(){$('installBtn').hidden=true;toast('Installazione completata: trovi BeamBoard tra le applicazioni del computer.')});
if('serviceWorker' in navigator&&location.protocol!=='file:'){
  navigator.serviceWorker.register('sw.js').then(function(reg){
    function offer(w){banner('È pronta una nuova versione di BeamBoard.','Aggiorna ora',function(){w.postMessage('aggiorna')},'nuova')}
    if(reg.waiting&&navigator.serviceWorker.controller) offer(reg.waiting);
    reg.addEventListener('updatefound',function(){var w=reg.installing;if(!w)return;w.addEventListener('statechange',function(){if(w.state==='installed'&&navigator.serviceWorker.controller)offer(w)})});
    setInterval(function(){reg.update().catch(function(){})},60*60*1000);
  }).catch(function(){});
  var reloading=false, hadCtrl=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange',function(){if(reloading||!hadCtrl)return;reloading=true;if(FS.dirty&&FS.handle){writeFile().then(function(){location.reload()})}else location.reload()});
}

/* ---------------- Avvio ---------------- */
function start(){if(!P)P=defaultProject();renderList();renderInsp();$('pos').textContent='Slide 1 di '+P.slides.length;showFileState();boot()}
Promise.all([idbGet('project'),idbKeys(),idbGet('fileHandle')]).then(function(r){
  var proj=r[0], keys=r[1]||[], handle=r[2];
  var imgKeys=keys.filter(function(k){return String(k).indexOf('img:')===0});
  return Promise.all(imgKeys.map(idbGet)).then(function(ims){
    if(proj){
      var o={meta:proj.meta,style:proj.style,slides:proj.slides,images:{}};
      loadData(o); loadingData=true;
      imgKeys.forEach(function(k,i){var im=ims[i];if(im&&im.bytes)addImage(String(k).slice(4),im.bytes,im.mime)});
      loadingData=false;
    }else{
      try{var old=localStorage.getItem('lavagna2:progetto');if(old){loadData(JSON.parse(old));resetImagesLocal();persist()}}catch(e){}
    }
    start();
    if(handle&&canFS){
      FS.handle=handle; showFileState();
      (handle.queryPermission?handle.queryPermission({mode:'readwrite'}):Promise.resolve('prompt')).then(function(p){
        if(p==='granted') fileState('saved','Salvato in «'+handle.name+'»'); else fileState('paused','Salvataggio in pausa: premi qui','Per sicurezza il browser chiede di confermare: premi per continuare a salvare in «'+handle.name+'».');
      });
    }
  });
}).catch(function(){
  try{var old=localStorage.getItem('lavagna2:progetto');if(old)loadData(JSON.parse(old))}catch(e){}
  start();
});
})();
