'use strict';
/* ====== НАСТРОЙКИ ФИНАЛА ======
   giftUrl   — ссылка, куда ведёт кнопка после «ГОТОВО» (вставьте свою).
   giftLabel — надпись на кнопке. Специально нейтральная, чтобы не выдавать сюрприз. */
const CONFIG={giftUrl:'tickets.pdf',giftLabel:'ПОЛУЧИТЬ ПРИЗ',judgeMs:4200};

const catalog={"tops": [{"id": "tee-white", "name": "Белая футболка", "src": "assets/tops/tee-white.webp", "slot": "top"}, {"id": "tee-black", "name": "Чёрная футболка", "src": "assets/tops/tee-black.webp", "slot": "top"}, {"id": "tee-navy", "name": "Тёмно-синяя футболка", "src": "assets/tops/tee-navy.webp", "slot": "top"}, {"id": "tee-burgundy", "name": "Бордовая футболка", "src": "assets/tops/tee-burgundy.webp", "slot": "top"}, {"id": "tee-forest", "name": "Зелёная футболка", "src": "assets/tops/tee-forest.webp", "slot": "top"}, {"id": "tee-sky", "name": "Голубая футболка", "src": "assets/tops/tee-sky.webp", "slot": "top"}, {"id": "tee-red", "name": "Красная футболка", "src": "assets/tops/tee-red.webp", "slot": "top"}, {"id": "tee-olive", "name": "Оливковая футболка", "src": "assets/tops/tee-olive.webp", "slot": "top"}, {"id": "tee-lilac", "name": "Лавандовая футболка", "src": "assets/tops/tee-lilac.webp", "slot": "top"}, {"id": "tee-orange", "name": "Терракотовая футболка", "src": "assets/tops/tee-orange.webp", "slot": "top"}, {"id": "tee-yellow", "name": "Горчичная футболка", "src": "assets/tops/tee-yellow.webp", "slot": "top"}, {"id": "tee-teal", "name": "Бирюзовая футболка", "src": "assets/tops/tee-teal.webp", "slot": "top"}, {"id": "tee-pink", "name": "Пудровая футболка", "src": "assets/tops/tee-pink.webp", "slot": "top"}, {"id": "tee-charcoal", "name": "Графитовая футболка", "src": "assets/tops/tee-charcoal.webp", "slot": "top"}, {"id": "tee-striped", "name": "Светлая футболка", "src": "assets/tops/tee-striped.webp", "slot": "top"}, {"id": "tee-violet", "name": "Фиолетовая футболка", "src": "assets/tops/tee-violet.webp", "slot": "top"}], "outerwear": [{"id": "leather", "name": "Кожаная косуха", "src": "assets/jackets/leather.webp", "slot": "outerwear"}, {"id": "leather-brown", "name": "Коричневая косуха", "src": "assets/jackets/leather-brown.webp", "slot": "outerwear"}, {"id": "leather-burgundy", "name": "Бордовая косуха", "src": "assets/jackets/leather-burgundy.webp", "slot": "outerwear"}, {"id": "leather-blue", "name": "Синяя косуха", "src": "assets/jackets/leather-blue.webp", "slot": "outerwear"}, {"id": "leather-cream", "name": "Светлая кожаная куртка", "src": "assets/jackets/leather-cream.webp", "slot": "outerwear"}, {"id": "leather-green", "name": "Зелёная косуха", "src": "assets/jackets/leather-green.webp", "slot": "outerwear"}, {"id": "leather-violet", "name": "Фиолетовая косуха", "src": "assets/jackets/leather-violet.webp", "slot": "outerwear"}, {"id": "leather-grey", "name": "Серая куртка", "src": "assets/jackets/leather-grey.webp", "slot": "outerwear"}, {"id": "leather-red", "name": "Красная куртка", "src": "assets/jackets/leather-red.webp", "slot": "outerwear"}, {"id": "leather-teal", "name": "Бирюзовая куртка", "src": "assets/jackets/leather-teal.webp", "slot": "outerwear"}, {"id": "leather-gold", "name": "Бронзовая куртка", "src": "assets/jackets/leather-gold.webp", "slot": "outerwear"}, {"id": "leather-midnight", "name": "Полуночная куртка", "src": "assets/jackets/leather-midnight.webp", "slot": "outerwear"}], "bottoms": [{"id": "jeans-blue", "name": "Синие джинсы", "src": "assets/bottoms/jeans-blue.webp", "slot": "bottom"}, {"id": "jeans-black", "name": "Чёрные джинсы", "src": "assets/bottoms/jeans-black.webp", "slot": "bottom"}, {"id": "jeans-grey", "name": "Серые джинсы", "src": "assets/bottoms/jeans-grey.webp", "slot": "bottom"}, {"id": "dark-jeans", "name": "Тёмные джинсы", "src": "assets/bottoms/dark-jeans.webp", "slot": "bottom"}, {"id": "jeans-light", "name": "Светлые джинсы", "src": "assets/bottoms/jeans-light.webp", "slot": "bottom"}, {"id": "jeans-indigo", "name": "Индиго", "src": "assets/bottoms/jeans-indigo.webp", "slot": "bottom"}, {"id": "jeans-white", "name": "Белые джинсы", "src": "assets/bottoms/jeans-white.webp", "slot": "bottom"}, {"id": "jeans-burgundy", "name": "Бордовые брюки", "src": "assets/bottoms/jeans-burgundy.webp", "slot": "bottom"}, {"id": "jeans-olive", "name": "Оливковые брюки", "src": "assets/bottoms/jeans-olive.webp", "slot": "bottom"}, {"id": "jeans-sand", "name": "Песочные брюки", "src": "assets/bottoms/jeans-sand.webp", "slot": "bottom"}, {"id": "jeans-charcoal", "name": "Графитовые брюки", "src": "assets/bottoms/jeans-charcoal.webp", "slot": "bottom"}, {"id": "jeans-violet", "name": "Фиолетовые брюки", "src": "assets/bottoms/jeans-violet.webp", "slot": "bottom"}], "shoes": [{"id": "shoe-white", "name": "Белые кроссовки", "src": "assets/shoes/shoe-white.webp", "slot": "shoes"}, {"id": "shoe-black", "name": "Чёрные кеды", "src": "assets/shoes/shoe-black.webp", "slot": "shoes"}, {"id": "shoe-boots", "name": "Чёрные ботинки", "src": "assets/shoes/shoe-boots.webp", "slot": "shoes"}, {"id": "shoe-brown", "name": "Коричневые ботинки", "src": "assets/shoes/shoe-brown.webp", "slot": "shoes"}, {"id": "shoe-cream", "name": "Светлые высокие кеды", "src": "assets/shoes/shoe-cream.webp", "slot": "shoes"}], "accessories": [{"id": "glasses-black", "name": "Очки в чёрной оправе", "src": "assets/accessories/glasses-black.webp", "slot": "glasses"}, {"id": "glasses-gold", "name": "Очки в золотой оправе", "src": "assets/accessories/glasses-gold.webp", "slot": "glasses"}, {"id": "sunglasses", "name": "Солнцезащитные очки", "src": "assets/accessories/sunglasses.webp", "slot": "glasses"}, {"id": "chain-silver", "name": "Серебряная цепочка", "src": "assets/accessories/chain-silver.webp", "slot": "neck"}, {"id": "chain-gold", "name": "Золотая цепочка", "src": "assets/accessories/chain-gold.webp", "slot": "neck"}, {"id": "watch", "name": "Наручные часы", "src": "assets/accessories/watch.webp", "slot": "wrist"}, {"id": "cap", "name": "Кепка", "src": "assets/accessories/cap.webp", "slot": "head"}, {"id": "hat", "name": "Чёрная шляпа", "src": "assets/accessories/hat.webp", "slot": "head"}, {"id": "bowtie", "name": "Бабочка", "src": "assets/accessories/bowtie.webp", "slot": "tie"}, {"id": "scarf", "name": "Шарф", "src": "assets/accessories/scarf.webp", "slot": "neck"}], "style": [{"id": "preset-classic", "name": "Красная дорожка", "preset": {"top": "tee-black", "outerwear": "leather", "bottom": "jeans-black", "shoes": "shoe-black"}}, {"id": "preset-fashion", "name": "Fashion week", "preset": {"top": "tee-white", "outerwear": "leather-brown", "bottom": "jeans-blue", "shoes": "shoe-white", "glasses": "glasses-black"}}, {"id": "preset-night", "name": "Ночной выход", "preset": {"top": "tee-burgundy", "outerwear": "leather-midnight", "bottom": "jeans-charcoal", "shoes": "shoe-boots", "neck": "chain-silver"}}, {"id": "preset-editorial", "name": "Editorial", "preset": {"top": "tee-forest", "outerwear": "leather-cream", "bottom": "jeans-grey", "shoes": "shoe-cream", "head": "hat"}}, {"id": "preset-denim", "name": "Denim look", "preset": {"top": "tee-white", "outerwear": "leather-blue", "bottom": "jeans-indigo", "shoes": "shoe-white"}}, {"id": "preset-bold", "name": "Смелый стиль", "preset": {"top": "tee-violet", "outerwear": "leather-red", "bottom": "jeans-black", "shoes": "shoe-boots", "glasses": "sunglasses", "wrist": "watch"}}]};
/* ---- каталог: убираем дубли и почти одинаковые перекраски куртки ---- */
catalog.tops=catalog.tops.filter(x=>x.id!=='tee-striped'||true);
catalog.outerwear=['leather','leather-cream','leather-burgundy','leather-blue','leather-green'].map(id=>catalog.outerwear.find(x=>x.id===id)).filter(Boolean);
const OUT_MAP={'leather-brown':'leather-burgundy','leather-midnight':'leather','leather-red':'leather-burgundy','leather-grey':'leather','leather-violet':'leather-blue','leather-teal':'leather-green','leather-gold':'leather-cream'};
catalog.style.forEach(st=>{if(st.preset&&st.preset.outerwear&&OUT_MAP[st.preset.outerwear])st.preset.outerwear=OUT_MAP[st.preset.outerwear]});
/* ---- геометрия слоёв (холст 1024×1720: сверху запас 160px под шляпы) ---- */
const CW=1024,CH=1720,OY=160;
const FEET={L:{dx:76.7,dy:-9},R:{dx:-38,dy:7}};      // ступни под штанины
const HANDS={L:72,R:-84};                               // кисти под манжеты куртки
const $=s=>document.querySelector(s);
const canvas=$('#dressCanvas'),ctx=canvas.getContext('2d'),finalCanvas=$('#finalCanvas');
const SLOTS=['top','outerwear','bottom','shoes','glasses','neck','wrist','head','tie'];
const empty=()=>Object.fromEntries(SLOTS.map(k=>[k,null]));
let chosen=empty(),history=[],category='tops',lookNo=1,toastTimer=null;
const images={};
const CHAR=['base-core-c','base-no-legs-c','torso-tee','arms-tee','arms-overlay-c','hands-only','legs-only','feet-lower'].map(n=>'assets/character/'+n+'.webp');
const assetItems=[...catalog.tops,...catalog.outerwear,...catalog.bottoms,...catalog.shoes,...catalog.accessories];
const unique=[...new Set([...CHAR,'assets/character/feet-lower-j.webp',...catalog.shoes.map(x=>x.src.replace('.webp','-j.webp')),...assetItems.map(x=>x.src)])];
const load=src=>new Promise(r=>{const im=new Image();im.onload=()=>r([src,im]);im.onerror=()=>r([src,null]);im.src=(window.ASSETS&&window.ASSETS[src])||src});
const findItem=id=>assetItems.find(x=>x.id===id);
const snapshot=()=>JSON.parse(JSON.stringify(chosen));
const pushHistory=()=>{history.push(snapshot());if(history.length>50)history.shift()};
const count=()=>Object.values(chosen).filter(Boolean).length;
function describe(c=chosen){const n=SLOTS.map(k=>c[k]?findItem(c[k])?.name:null).filter(Boolean);return n.length?n.join(' · '):'Базовый образ'}

/* ---- отрисовка ---- */
function put(c,key,sx=0,w=CW,dx=0,dy=0){const im=images[key];if(!im)return;const y=im.height===1536?OY:0;c.drawImage(im,sx,0,w,im.height,sx+dx,y+dy,w,im.height)}
function drawTo(target,st=chosen){
 const c=target.getContext('2d');c.clearRect(0,0,target.width,target.height);
 c.save();c.scale(target.width/CW,target.height/CH);
 const P=n=>'assets/character/'+n+'.webp';
 const hasO=!!(st.outerwear&&findItem(st.outerwear)),hasT=!!(st.top&&findItem(st.top)),hasB=!!(st.bottom&&findItem(st.bottom)),shoe=st.shoes&&findItem(st.shoes);
 // 1. тело. Куртка -> только торс + кисти у манжет; футболка -> торс + руки ниже рукавов
 if(hasO){put(c,P('base-core-c'));put(c,P('hands-only'),0,512,HANDS.L);put(c,P('hands-only'),512,512,HANDS.R)}
 else if(hasT){put(c,P('base-core-c'));put(c,P('torso-tee'));put(c,P('arms-tee'))}
 else{put(c,P('base-no-legs-c'));put(c,P('arms-overlay-c'))}
 // 2. ноги и обувь
 if(hasB){
  put(c,shoe?shoe.src.replace('.webp','-j.webp'):P('feet-lower-j'));   // стопы уже выровнены под штанины
  put(c,findItem(st.bottom).src);
 }else{put(c,P('legs-only'));if(shoe)put(c,shoe.src)}
 // 3. одежда и аксессуары
 for(const s of ['top','outerwear','glasses','neck','wrist','head','tie']){
  const id=(s==='top'&&!st.top&&hasO)?'tee-white':st[s];if(!id)continue;const it=findItem(id);if(!it)continue;
  if(s==='wrist'&&hasO)put(c,it.src,0,CW,HANDS.L,22);else put(c,it.src);
 }
 c.restore();
}
const render=()=>{
 drawTo(canvas);
 renderItems();renderQuick();
};
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),1800)}

/* ---- гардероб ---- */
function isSelected(it){return it.preset?Object.entries(it.preset).every(([s,id])=>chosen[s]===id):chosen[it.slot]===it.id}
function apply(it){
 pushHistory();
 if(it.preset){chosen={...empty(),...it.preset};toast('Образ «'+it.name+'» применён')}
 else chosen[it.slot]=chosen[it.slot]===it.id?null:it.id;
 lookNo++;render();
}
const presetThumbs={};
function presetImg(it){
 if(presetThumbs[it.id])return presetThumbs[it.id];
 const c=document.createElement('canvas');c.width=256;c.height=430;drawTo(c,{...empty(),...it.preset});
 try{return presetThumbs[it.id]=c.toDataURL('image/webp',.85)}catch(e){return ''}
}
function renderItems(){
 const box=$('#items');const keep=box.parentElement.scrollTop;box.innerHTML='';
 (catalog[category]||[]).forEach(it=>{
  const b=document.createElement('button');b.type='button';
  b.className='tile'+(isSelected(it)?' selected':'')+(it.preset?' preset':'');
  b.title=it.name;b.setAttribute('aria-label',it.name);
  b.innerHTML=it.preset?`<img src="${presetImg(it)}" alt=""><i>${it.name}</i>`:`<img src="assets/thumbnails/${it.id}.webp" alt="">`;
  if(isSelected(it))b.insertAdjacentHTML('beforeend','<span class="tick"><svg><use href="#i-check"/></svg></span>');
  b.onclick=()=>apply(it);box.appendChild(b);
 });
 box.parentElement.scrollTop=keep;
}
const QUICK=['sunglasses','glasses-gold','chain-silver','watch','cap','hat','bowtie'];
function renderQuick(){
 const box=$('#quick');box.innerHTML='';
 QUICK.forEach(id=>{const it=findItem(id);if(!it)return;
  const b=document.createElement('button');b.type='button';b.title=it.name;b.setAttribute('aria-label',it.name);
  b.className=chosen[it.slot]===id?'on':'';b.innerHTML=`<img src="assets/thumbnails/${id}.webp" alt="">`;
  b.onclick=()=>apply(it);box.appendChild(b)});
}
$('#tabs').onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;category=b.dataset.cat;
 document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===b));$('.grid-wrap').scrollTop=0;renderItems()};

/* ---- кнопки ---- */
$('#undo').onclick=()=>{if(!history.length)return toast('Пока нечего отменять');chosen=history.pop();render()};
$('#reset').onclick=()=>{pushHistory();chosen=empty();render();toast('Образ сброшен')};
$('#random').onclick=()=>{
 pushHistory();const pick=a=>a[Math.floor(Math.random()*a.length)];const acc=s=>catalog.accessories.filter(x=>x.slot===s);
 chosen={...empty(),top:pick(catalog.tops).id,outerwear:Math.random()>.4?pick(catalog.outerwear).id:null,bottom:pick(catalog.bottoms).id,shoes:pick(catalog.shoes).id,
  glasses:Math.random()>.6?pick(acc('glasses')).id:null,neck:Math.random()>.7?pick(acc('neck')).id:null,wrist:Math.random()>.6?'watch':null,head:Math.random()>.85?pick(acc('head')).id:null};
 render();toast('Новый образ готов!');
};
function photo(target){ // сохраняем на фоне сцены, а не на прозрачном
 const c=document.createElement('canvas');c.width=target.width;c.height=target.height;const x=c.getContext('2d');
 const g=x.createRadialGradient(c.width*.5,c.height*.35,50,c.width*.5,c.height*.5,c.height*.8);g.addColorStop(0,'#6a3fc0');g.addColorStop(.55,'#2e1766');g.addColorStop(1,'#120a2c');
 x.fillStyle=g;x.fillRect(0,0,c.width,c.height);x.drawImage(target,0,0);return c;
}
function download(target,name){try{const a=document.createElement('a');a.download=name;a.href=photo(target).toDataURL('image/png');a.click();toast('Фото сохранено')}catch(e){toast('Не удалось сохранить фото')}}
$('#savePhoto').onclick=()=>download(canvas,'sergey-look-'+lookNo+'.png');
const readLooks=()=>{try{return JSON.parse(localStorage.getItem('sergeyLooks')||'[]')}catch(e){return[]}};
const writeLooks=l=>{try{localStorage.setItem('sergeyLooks',JSON.stringify(l.slice(-30)))}catch(e){toast('Не удалось сохранить в браузере')}};
function openLooks(){
 const list=readLooks(),box=$('#savedLooks');box.innerHTML='';
 if(!list.length)box.innerHTML='<p class="empty">Пока пусто. Нажми «Сохранить текущий образ».</p>';
 list.map((e,i)=>[e,i]).reverse().forEach(([e,i])=>{
  const row=document.createElement('div');row.className='saved-row';
  const im=document.createElement('canvas');im.width=96;im.height=161;drawTo(im,{...empty(),...e.look});
  const t=document.createElement('div');t.innerHTML=`<b></b><small>${e.date?new Date(e.date).toLocaleDateString('ru-RU'):''}</small>`;t.firstChild.textContent=e.name||'Мой образ';
  const on=document.createElement('button');on.textContent='НАДЕТЬ';on.onclick=()=>{pushHistory();chosen={...empty(),...e.look};render();closeLooks();toast('Образ надет')};
  const del=document.createElement('button');del.textContent='УДАЛИТЬ';del.className='del';del.onclick=()=>{const n=readLooks();n.splice(i,1);writeLooks(n);openLooks()};
  row.append(im,t,on,del);box.appendChild(row);
 });
 $('#looksModal').classList.add('show');$('#looksModal').setAttribute('aria-hidden','false');
}
const closeLooks=()=>{$('#looksModal').classList.remove('show');$('#looksModal').setAttribute('aria-hidden','true')};
$('#favorites').onclick=openLooks;$('#closeLooks').onclick=closeLooks;
$('#looksModal').onclick=e=>{if(e.target.id==='looksModal')closeLooks()};
$('#addLook').onclick=()=>{const l=readLooks();l.push({name:describe(),look:snapshot(),date:new Date().toISOString()});writeLooks(l);toast('Образ сохранён');openLooks()};
let judgeTimer=null,lineTimer=null;
const JUDGE=['Сергей смотрит<br>на твой образ…','Оцениваем цвета,<br>силуэт и детали…','Выбираем<br>лучший образ…'];
function confetti(){const box=$('#confetti');box.innerHTML='';for(let i=0;i<34;i++){const e=document.createElement('i');e.textContent=['★','✦','✧'][i%3];
 e.style.left=Math.random()*100+'%';e.style.fontSize=10+Math.random()*16+'px';e.style.animationDuration=3+Math.random()*3+'s';e.style.animationDelay=Math.random()*1.5+'s';box.appendChild(e)}}
function verdict(){clearTimeout(judgeTimer);clearInterval(lineTimer);$('#finalScreen').classList.add('verdict');$('#judgeBar').style.width='100%';confetti()}
$('#finish').onclick=()=>{
 drawTo(finalCanvas);$('#finalDescription').textContent=describe();$('#giftLabel').textContent=CONFIG.giftLabel;
 const f=$('#finalScreen');f.classList.remove('verdict');f.classList.add('show');f.setAttribute('aria-hidden','false');f.scrollTop=0;
 let n=0;const bar=$('#judgeBar');bar.style.transition='none';bar.style.width='0';void bar.offsetWidth;bar.style.transition='width '+CONFIG.judgeMs+'ms linear';bar.style.width='96%';
 $('#judgeLine').innerHTML=JUDGE[0];clearInterval(lineTimer);lineTimer=setInterval(()=>{n=(n+1)%JUDGE.length;$('#judgeLine').innerHTML=JUDGE[n]},1400);
 clearTimeout(judgeTimer);judgeTimer=setTimeout(verdict,CONFIG.judgeMs);
};
$('#edit').onclick=()=>{clearTimeout(judgeTimer);clearInterval(lineTimer);const f=$('#finalScreen');f.classList.remove('show','verdict');f.setAttribute('aria-hidden','true')};
// ссылка открывается кодом, а не через <a>: адрес не светится при наведении и не выдаёт сюрприз
$('#giftBtn').onclick=()=>{const u=CONFIG.giftUrl;if(!u||u.startsWith('REPLACE'))return toast('Ссылка пока не задана');if(!window.open(u,'_blank','noopener'))location.href=u};
$('#finalSave').onclick=()=>download(finalCanvas,'sergey-final-look-'+lookNo+'.png');

Promise.all(unique.map(load)).then(r=>{r.forEach(([s,i])=>{if(i)images[s]=i});render();
 const demo=catalog.style.find(x=>/fashion/i.test(x.name))||catalog.style[0];if(demo)drawTo($('#introCanvas'),{...empty(),...demo.preset});else drawTo($('#introCanvas'),empty())});
$('#startBtn').onclick=()=>{$('#intro').classList.remove('show');toast('Выбирай вещи и примеряй!')};

/* ---- фоновая музыка: стартует по «НАЧАТЬ», кнопка выключает звук ---- */
(()=>{const a=$('#bgm');if(!a)return;let muted=false;try{muted=localStorage.getItem('sergeyMuted')==='1'}catch(e){}
 const icons=[$('#mute'),$('#mute2')];const sync=()=>icons.forEach(b=>{if(b)b.textContent=muted?'🔇':'🔊'});sync();
 const target=.5;let fade=null;
 function play(){if(muted)return;a.volume=0;a.play().then(()=>{clearInterval(fade);fade=setInterval(()=>{a.volume=Math.min(target,a.volume+.05);if(a.volume>=target)clearInterval(fade)},150)}).catch(()=>{})}
 function toggle(){muted=!muted;try{localStorage.setItem('sergeyMuted',muted?'1':'0')}catch(e){}sync();if(muted)a.pause();else play()}
 icons.forEach(b=>b&&(b.onclick=toggle));
 $('#startBtn').addEventListener('click',play);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)a.pause();else if(!muted&&!$('#intro').classList.contains('show'))play()});
})();
