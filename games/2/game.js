(() => {
'use strict';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const $=id=>document.getElementById(id);
const W=420,H=760,GRAVITY=1750,JUMP=-715,MAX_SPEED=285,FOOT_OFFSET=10;
let sx=1,sy=1,dpr=1;
function resize(){
 const r=canvas.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2);
 canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));
 sx=canvas.width/W;sy=canvas.height/H;
}
if('ResizeObserver'in window)new ResizeObserver(resize).observe(canvas);
else addEventListener('resize',resize);
addEventListener('orientationchange',()=>setTimeout(resize,120));resize();

const platformFiles=['grass_platform_plain','grass_platform_flowers','grass_platform_daisy','wooden_platform','rug_platform','books_platform','cat_nap_platform','pigeon_platform','flower_meadow_platform','stone_platform','flower_pot_platform'];
const paths=[
 ...['stand_cane_right','stand_cane_left','jump_right_cane','jump_left_cane','jump_crouch_left','jump_crouch_right','back_view','jump_with_spark'].map(n=>`assets/character/${n}.png`),
 ...[...platformFiles,'rocking_chair_platform','suitcase_platform','hat_platform','iron_gate_platform'].map(n=>`assets/platforms/${n}.png`),

 'assets/bonuses/smiling_star.png','assets/bonuses/gift_box.png','assets/bonuses/flower_bouquet.png'
];
const imgs={};paths.forEach(p=>{const im=new Image();im.src=p;imgs[p]=im;});
let keys={},touch={left:false,right:false},state='menu',player,plats=[],stars=[],obstacles=[],flowers=[];
let finaleScale=1,accumulator=0,fadeAlpha=0,cameraY=0,cameraTarget=0,score=0,last=0,animTime=0,starsCollected=0,worldTop=0,finaleElapsed=0,celestialReady=false,fallbackReady=false,finalY0=0;
let rngSeed=19991119;
// A shuffled line pool keeps retry messages fresh throughout this browser session.
const failLines=[
 'Ничего, бабуля просто проверяла прочность облаков.',
 'Гравитация сегодня явно на стороне внучки.',
 'Платформы коварные. Бабушка — легендарная.',
 'Это была не ошибка, а вертикальная разведка.',
 'Даже самовар не закипает с первой попытки.'
];
let failBag=[];
function rand(){rngSeed=(rngSeed*1664525+1013904223)>>>0;return rngSeed/4294967296;}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function platform(x,y,w,type,extra={}){return {x:clamp(x,5,W-w-5),y,w,h:54+rand()*9,type, ...extra};}
// Platform artwork includes decorative transparent/raised space above the actual
// walking surface. Use the visible top of the deck, not the image's top edge.
function platformSurface(p){return p.y+p.h*.30;}


// ---------- Audio: original sounds and music, synthesized with WebAudio (no files needed) ----------
const audio=(()=>{
 let ac=null,master,music,sfxG,muted=false,timer=0,nextT=0,step=0;
 try{muted=localStorage.getItem('babka-muted')==='1';}catch(_){}
 function ensure(){
  if(!ac){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
   try{ac=new AC();}catch(_){return null;}
   master=ac.createGain();master.gain.value=muted?0:1;master.connect(ac.destination);
   music=ac.createGain();music.gain.value=.55;music.connect(master);
   sfxG=ac.createGain();sfxG.gain.value=.9;sfxG.connect(master);}
  if(ac.state==='suspended')ac.resume();
  return ac;}
 function tone(f,t0,dur,type,vol,dest,f2){
  const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);
  if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+dur);
  g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+.012);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
  o.connect(g);g.connect(dest);o.start(t0);o.stop(t0+dur+.05);}
 function noise(t0,dur,vol,dest){
  const n=Math.max(1,Math.floor(ac.sampleRate*dur)),b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*(1-i/n);
  const src=ac.createBufferSource();src.buffer=b;const g=ac.createGain();g.gain.value=vol;src.connect(g);g.connect(dest);src.start(t0);}
 const play=fn=>()=>{if(muted||!ensure())return;try{fn(ac.currentTime);}catch(_){}};
 const sfx={
  land:play(t=>{tone(250,t,.17,'sine',.34,sfxG,640);tone(500,t+.02,.12,'triangle',.1,sfxG,980);}),   // springy boing
  star:play(t=>{tone(988,t,.18,'triangle',.22,sfxG);tone(1480,t+.08,.28,'triangle',.2,sfxG);}),
  hit:play(t=>{tone(230,t,.38,'sawtooth',.26,sfxG,55);noise(t,.28,.22,sfxG);}),
  fall:play(t=>{tone(620,t,.8,'sine',.28,sfxG,80);}),
  win:play(t=>{[523,659,784,1047,1319].forEach((f,i)=>tone(f,t+i*.14,.9,'triangle',.2,sfxG));})
 };
 // Original lullaby-like loop: C major pentatonic, 4 bars. Values = semitones above C4, null = rest.
 const MEL=[7,null,9,7,4,null,7,null, 9,null,12,9,7,null,null,null, 7,null,9,7,4,null,2,null, 4,null,2,0,0,null,null,null];
 const BASS=[-12,-15,-19,-17],EIGHTH=60/92/2,C4=261.63;
 const hz=n=>C4*Math.pow(2,n/12);
 function schedule(){
  if(!ac)return;
  while(nextT<ac.currentTime+.35){
   const i=step%32,m=MEL[i];
   if(m!==null){tone(hz(m),nextT,.5,'triangle',.085,music);tone(hz(m+12),nextT,.35,'sine',.025,music);}
   if(i%4===0)tone(hz(BASS[Math.floor(i/8)]),nextT,EIGHTH*3.6,'sine',.11,music);
   nextT+=EIGHTH;step++;
  }}
 document.addEventListener('visibilitychange',()=>{if(!ac)return;if(document.hidden)ac.suspend();else if(!muted)ac.resume();});
 return {sfx,
  startMusic(){if(!ensure()||timer)return;nextT=ac.currentTime+.1;timer=setInterval(schedule,90);},
  toggle(){muted=!muted;try{localStorage.setItem('babka-muted',muted?'1':'0');}catch(_){}
   if(ensure())master.gain.setTargetAtTime(muted?0:1,ac.currentTime,.03);return muted;},
  get muted(){return muted;}};
})();
function reset(){
 finaleScale=1;fadeAlpha=0;
 rngSeed=(Date.now()^Math.floor(Math.random()*0x7fffffff))>>>0;score=0;cameraY=0;cameraTarget=0;animTime=0;starsCollected=0;
 const baseY=690;
 const base=platform(W/2-78,baseY,156,'grass_platform_flowers',{base:true});
 plats=[base];
 let previous=[base],tierY=baseY;
 // Each altitude band is a small cluster, not a staircase. A reachable parent is
 // selected from the previous cluster, then side routes are added around it.
 const tiers=48;
 let previousCenter=base.x+base.w/2;
 let lastDirection=0;
 const recentCenters=[previousCenter];
 for(let tier=1;tier<=tiers;tier++){
   // Main route: deliberately varied, but always inside a reliable jump envelope.
   tierY-=94+rand()*8;
   let direction=(rand()<.5?-1:1);
   if(direction===lastDirection && rand()<.48)direction=-direction;
   let offset=direction*(58+rand()*66);
   let mainCenter=clamp(previousCenter+offset,66,W-66);
   if(recentCenters.some(c=>Math.abs(c-mainCenter)<42)){
     const alt=clamp(previousCenter-direction*(58+rand()*52),66,W-66);
     if(!recentCenters.some(c=>Math.abs(c-alt)<38))mainCenter=alt;
   }
   const mainW=112+rand()*34;
   const main=platform(mainCenter-mainW/2,tierY,mainW,platformFiles[Math.floor(rand()*platformFiles.length)],{tier,route:true});
   plats.push(main);
   previousCenter=main.x+main.w/2;
   lastDirection=direction;
   recentCenters.push(previousCenter);if(recentCenters.length>3)recentCenters.shift();

   // Fun side platforms branch off the safe route. Each is close enough to
   // jump to from its row's main platform; their lower deck height gives a
   // little more airtime and keeps every decorative option realistically landable.
   const branchCount=rand()<.28?2:(rand()<.82?1:0);
   const usedSide=[];
   for(let b=0;b<branchCount;b++){
     const side=(b===1?-usedSide[0]:(rand()<.5?-1:1));
     const branchW=94+rand()*28;
     const distance=126+rand()*30;
     const branchCenter=clamp(previousCenter+side*distance,branchW/2+8,W-branchW/2-8);
     if(usedSide.some(v=>Math.abs(v-branchCenter)<92))continue;
     usedSide.push(branchCenter);
     const branch=platform(branchCenter-branchW/2,tierY+12+rand()*15,branchW,platformFiles[Math.floor(rand()*platformFiles.length)],{tier,branch:true});
     // Keep branch decks distinct from the main platform and from each other.
     if(Math.abs(branchCenter-previousCenter)>104)plats.push(branch);
   }
   previous=[main];
 }
 // A distinct, wide summit platform: the game ends only when she lands here.
 const summitY=tierY-104;
 const lastLanding=previous[Math.floor(rand()*previous.length)];
 const summitCenter=clamp(lastLanding.x+lastLanding.w/2,100,W-100);
 const summit=platform(summitCenter-91,summitY,182,'stone_platform',{final:true,tier:tiers+1});
 plats.push(summit);worldTop=summit.y;

 // Collectibles hover neatly above selected platforms, not scattered at random.
 stars=[];
 plats.filter(p=>p.route&&rand()<.30).forEach(p=>{
   stars.push({x:p.x+p.w/2,y:p.y-29,got:false,phase:rand()*6.28});
 });
 flowers=plats.filter((p,i)=>p.tier&&p.tier%7===0&&rand()<.65).map((p,i)=>({x:p.x+p.w*.55,y:platformSurface(p)+3,plat:p,phase:i*1.7,scale:.65+rand()*.28}));

 // Hazards occupy clear air lanes BETWEEN platform rows. Clotheslines and bombs
 // alternate, use their real aspect ratios, and are never painted over platforms.
 obstacles=[];
 const tiersByLevel=[];
 for(let t=1;t<=tiers;t++)tiersByLevel.push(plats.filter(p=>p.tier===t));
 for(let t=2;t<=tiers;t+=3){
   const lower=tiersByLevel[t-2]||[],upper=tiersByLevel[t-1]||[];
   if(!lower.length||!upper.length)continue;
   const low=lower[Math.floor(rand()*lower.length)],high=upper[Math.floor(rand()*upper.length)];
   const type='yarn_ball';
   const w=70,h=70;
   // The sprite can span the vertical gap, but its footprint must sit in a
   // horizontal air lane that does not cover either platform.
   const y=(high.y+low.y)/2-h/2;
   const candidates=[];
   for(let x=12;x<=W-w-12;x+=18){
     const overlaps=(p)=>x+w>p.x-10&&x<p.x+p.w+10&&y+h>p.y-10&&y<p.y+p.h+10;
     if(!plats.some(overlaps) && Math.abs((x+w/2)-(low.x+low.w/2))>72 && Math.abs((x+w/2)-(high.x+high.w/2))>72)candidates.push(x);
   }
   if(candidates.length){
     // Prefer an outer lane rather than blocking the natural landing corridor.
     const x=candidates[Math.floor(rand()*candidates.length)];
     obstacles.push({x,y,w,h,type,phase:rand()*6.28,
       hitX:w*.19,hitY:h*.19,hitW:w*.62,hitH:h*.62});
   }
 }
 player={x:W/2,y:platformSurface(base)-37-FOOT_OFFSET,vx:0,vy:JUMP,w:54,h:90,dir:1,visualTilt:0,landPulse:0,pose:'jump_right_cane',poseBlend:1};
 $('height').textContent='0 м';if($('star-count'))$('star-count').textContent='✦ 0';$('progressbar').style.width='0%';
}
function show(id){['start','fail'].forEach(n=>$(n).classList.toggle('hidden',n!==id));}
let rafId=0;
function startLoop(){cancelAnimationFrame(rafId);last=performance.now();rafId=requestAnimationFrame(loop);}
function start(){
 try{
   $('finale').classList.add('hidden');$('progressbar').parentElement.classList.remove('hidden');
   keys={};touch={left:false,right:false};accumulator=0;fadeAlpha=0;
   reset();state='playing';show(null);audio.startMusic();startLoop();
 }catch(err){
   console.error('Birthday Jump start failed:',err);
   const panel=$('start').querySelector('.panel');
   if(panel){
     let msg=panel.querySelector('.start-error');
     if(!msg){msg=document.createElement('p');msg.className='start-error';msg.style.cssText='color:#a32638;font-size:12px;margin-top:12px';panel.appendChild(msg);}
     msg.textContent='Не удалось запустить игру: '+(err&&err.message?err.message:'ошибка запуска');
   }
   show('start');
 }
}
// Explicit DOM0 handlers are resilient to duplicate listeners and mobile tap quirks.
window.startBirthdayGame=start;
// Every handler goes through bind(): a missing element is reported, never fatal.
function bind(id,fn){
 const el=$(id);
 if(!el){console.error('Babka Jump: element #'+id+' not found');return null;}
 el.type='button';
 el.addEventListener('click',e=>{e.preventDefault();fn();});
 return el;
}
bind('play',start);
bind('retry',start);
{const mb=bind('mute',()=>{const m=audio.toggle();mb.textContent=m?'🔇':'🔊';mb.setAttribute('aria-label',m?'Включить звук':'Выключить звук');});
 if(mb)mb.textContent=audio.muted?'🔇':'🔊';}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowleft','arrowright','a','d'].includes(k)){e.preventDefault();keys[k]=true;}});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
addEventListener('blur',()=>{keys={};touch={left:false,right:false};});
[['left','left'],['right','right']].forEach(([id,k])=>{
 const b=$(id);const down=e=>{e.preventDefault();touch[k]=true;try{b.setPointerCapture(e.pointerId);}catch(_){}};
 const up=e=>{if(e)e.preventDefault();touch[k]=false;};
 b.addEventListener('pointerdown',down);['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,up));
 b.addEventListener('contextmenu',e=>e.preventDefault());
});
function mix(a,b,t){return a+(b-a)*t;}
const SKY=[[0,['#f4a77f','#ffd49b','#f9dfc2']],[.25,['#76b9e8','#c9e9ff','#f6d9c5']],[.5,['#f18479','#c16fa2','#555c9b']],[.75,['#30366e','#444987','#222957']],[1,['#09122f','#18265d','#080e29']]];
function hexRgb(h){return [parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];}
function rgbHex(a){return `rgb(${a.map(v=>Math.round(v)).join(',')})`;}
function paletteAt(t){let i=0;while(i<SKY.length-2&&t>SKY[i+1][0])i++;const [a,ca]=SKY[i],[b,cb]=SKY[i+1],f=clamp((t-a)/(b-a),0,1);return ca.map((c,j)=>rgbHex(hexRgb(c).map((v,k)=>mix(v,hexRgb(cb[j])[k],f))));}
function drawSky(progress){
 const pal=paletteAt(clamp(progress,0,1)),g=ctx.createLinearGradient(0,0,0,H);
 g.addColorStop(0,pal[0]);g.addColorStop(.52,pal[1]);g.addColorStop(1,pal[2]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 const glow=ctx.createRadialGradient(W*.5,H*.76,5,W*.5,H*.76,H*.72);
 glow.addColorStop(0,`rgba(255,190,155,${.16*(1-progress)+.035})`);glow.addColorStop(1,'rgba(25,35,80,0)');
 ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
 // Slow parallax layers: the world drifts gently rather than snapping with the camera.
 for(let layer=0;layer<3;layer++){
   const offset=cameraY*(.10+layer*.055);
   ctx.fillStyle=['rgba(34,39,78,.24)','rgba(35,43,86,.17)','rgba(30,40,80,.11)'][layer];
   ctx.beginPath();ctx.moveTo(0,H);const base=H*(.84+layer*.055);
   for(let x=0;x<=W+20;x+=20){
     const yy=base-Math.abs(Math.sin((x+offset*.12)*.021+layer*2.1))*28-Math.abs(Math.sin(x*.061+layer))*16;
     ctx.lineTo(x,yy);
   }
   ctx.lineTo(W,H);ctx.closePath();ctx.fill();
 }
 const night=clamp((progress-.57)/.43,0,1);
 if(night>0)for(let i=0;i<88;i++){
   const x=(i*97+31)%W,y=((i*173+19+cameraY*.035)%H+H)%H,tw=.65+.35*Math.sin(animTime*1.15+i);
   ctx.fillStyle=`rgba(255,246,218,${night*.75*tw})`;ctx.beginPath();ctx.arc(x,y,(i%3+1)*.55,0,Math.PI*2);ctx.fill();
 }
}
function drawImage(path,x,y,w,h,opts={}){
 const im=imgs[path];if(!im||!im.complete||!im.naturalWidth)return false;
 ctx.save();
 if(opts.alpha!==undefined)ctx.globalAlpha=opts.alpha;
 if(opts.rotate){ctx.translate(x+w/2,y+h/2);ctx.rotate(opts.rotate);ctx.drawImage(im,-w/2,-h/2,w,h);}
 else if(opts.flip){ctx.translate(x+w,y);ctx.scale(-1,1);ctx.drawImage(im,0,0,w,h);}
 else ctx.drawImage(im,x,y,w,h);
 ctx.restore();return true;
}
function drawYarnObstacle(o,bob){
 const cx=o.x+o.w/2,cy=o.y+bob+o.h/2,r=o.w*.34;
 ctx.save();
 // Loose curly strand behind the ball.
 ctx.strokeStyle='#8d426c';ctx.lineWidth=3.2;ctx.lineCap='round';
 ctx.beginPath();ctx.moveTo(cx+r*.72,cy+r*.25);
 ctx.bezierCurveTo(cx+r*1.25,cy+r*.55,cx+r*1.2,cy+r*1.05,cx+r*1.55,cy+r*.9);
 ctx.bezierCurveTo(cx+r*1.95,cy+r*.75,cx+r*1.65,cy+r*.35,cx+r*1.42,cy+r*.48);
 ctx.stroke();
 // Pink wool ball.
 const g=ctx.createRadialGradient(cx-r*.35,cy-r*.4,r*.08,cx,cy,r*1.15);
 g.addColorStop(0,'#f7b0d0');g.addColorStop(.62,'#d86b9d');g.addColorStop(1,'#8d3e68');
 ctx.fillStyle=g;ctx.strokeStyle='#38243a';ctx.lineWidth=3;
 ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.stroke();
 // Curved yarn strands.
 ctx.save();ctx.beginPath();ctx.arc(cx,cy,r-1,0,Math.PI*2);ctx.clip();
 ctx.strokeStyle='rgba(93,42,75,.72)';ctx.lineWidth=2.4;
 for(let k=-2;k<=2;k++){
   ctx.beginPath();ctx.moveTo(cx-r*.95,cy+k*8);
   ctx.bezierCurveTo(cx-r*.25,cy-r*.95+k*5,cx+r*.15,cy+r*.9+k*4,cx+r*.95,cy-r*.25+k*3);ctx.stroke();
 }
 ctx.strokeStyle='rgba(255,220,235,.75)';ctx.lineWidth=1.7;
 ctx.beginPath();ctx.moveTo(cx-r*.75,cy+r*.3);ctx.bezierCurveTo(cx-r*.2,cy-r*.8,cx+r*.25,cy+r*.85,cx+r*.75,cy-r*.35);ctx.stroke();
 ctx.restore();
 // Two knitting needles poking out diagonally.
 ctx.lineCap='round';ctx.lineWidth=3.5;ctx.strokeStyle='#43313a';
 [[cx+r*.1,cy-r*.55,cx+r*.82,cy-r*1.18],[cx+r*.48,cy-r*.22,cx+r*1.22,cy-r*.82]].forEach(a=>{
   ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(a[2],a[3]);ctx.stroke();
   ctx.fillStyle='#d8b879';ctx.beginPath();ctx.arc(a[2],a[3],2.4,0,Math.PI*2);ctx.fill();
 });
 ctx.restore();
}
function fail(why){
 if(state!=='playing')return;
 audio.sfx[why==='hit'?'hit':'fall']();
 if(!failBag.length){failBag=failLines.slice();for(let i=failBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[failBag[i],failBag[j]]=[failBag[j],failBag[i]];}}
 $('fail-message').textContent=failBag.pop();
 state='fail';show('fail');
}
function update(dt){
 animTime+=dt;
 const dir=(keys.arrowleft||keys.a||touch.left?-1:0)+(keys.arrowright||keys.d||touch.right?1:0);
 // Acceleration and friction soften the visual response without making steering sluggish.
 if(dir)player.vx=mix(player.vx,dir*MAX_SPEED,1-Math.exp(-dt*10));
 else player.vx=mix(player.vx,0,1-Math.exp(-dt*7.5));
 if(dir)player.dir=dir;
 player.x+=player.vx*dt;
 if(player.x<-24)player.x=W+18;if(player.x>W+24)player.x=-18;
 const oldFoot=player.y+player.h*.41+FOOT_OFFSET;
 const oldX=player.x,oldY=player.y,oldVy=player.vy;
 player.vy+=GRAVITY*dt;player.y+=player.vy*dt;
 const newFoot=player.y+player.h*.41+FOOT_OFFSET;
 if(oldVy>0 && player.vy>0 && newFoot>oldFoot){
   let landed=null;
   for(const p of plats){
     // A bounce is possible only when the feet cross the platform's top plane
     // while descending. Interpolate horizontal position at that exact moment.
     const surface=platformSurface(p);
     if(oldFoot<=surface && newFoot>=surface){
       const f=clamp((surface-oldFoot)/(newFoot-oldFoot),0,1);
       const xAtCross=oldX+(player.x-oldX)*f;
       if(xAtCross+14>p.x+7 && xAtCross-14<p.x+p.w-7){
         if(!landed||p.y<landed.y)landed=p;
       }
     }
   }
   if(landed){
     player.y=platformSurface(landed)-player.h*.41-FOOT_OFFSET;player.vy=JUMP;player.landPulse=1;audio.sfx.land();
     if(landed.final){state='finalizing';finaleElapsed=0;player.vx=0;finalY0=player.y;audio.sfx.win();}
   }
 }
 player.landPulse=Math.max(0,player.landPulse-dt*3.8);
 // Collision boxes are intentionally tighter than transparent artwork.
 const px=player.x-15,py=player.y+18,pw=30,ph=44;
 for(const o of obstacles){
   if(px<o.x+o.hitW&&px+pw>o.x+o.hitX&&py<o.y+o.hitH&&py+ph>o.y+o.hitY){fail('hit');break;}
 }
 const target=player.y-H*.39;
 if(target<cameraTarget)cameraTarget=target;
 // Smooth camera follow removes the harsh vertical snapping seen in the previous build.
 cameraY=mix(cameraY,cameraTarget,1-Math.exp(-dt*4.2));
 score=Math.max(score,Math.max(0,Math.floor(690-player.y)));
 if(player.y-cameraY>H+115)fail('fall');
 stars.forEach(s=>{
   if(!s.got&&Math.hypot(player.x-s.x,(player.y-12)-s.y)<40){s.got=true;starsCollected++;audio.sfx.star();if($('star-count'))$('star-count').textContent='✦ '+starsCollected;}
 });
 $('height').textContent=Math.floor(score/10)+' м';
 $('progressbar').style.width=Math.min(100,Math.max(0,(690-player.y)/(690-worldTop))*100)+'%';
}
function render(){
 if(!sx||!sy)return;
 ctx.setTransform(sx,0,0,sy,0,0);ctx.clearRect(0,0,W,H);
 const progress=clamp((690-player.y)/(690-worldTop),0,1);drawSky(progress);
 if(state==='finalizing'||state==='final'){ // the sky fills with stars
   const bloom=clamp(finaleElapsed/2.2,0,1);
   for(let i=0;i<110;i++){
     const x=(i*131+17)%W,y=(i*89+43)%(H*.8),tw=.5+.5*Math.sin(animTime*1.6+i*1.7);
     ctx.fillStyle=`rgba(255,246,218,${bloom*.9*tw*((i%4)/4+.25)})`;ctx.beginPath();ctx.arc(x,y,.6+(i%3)*.5,0,Math.PI*2);ctx.fill();
   }
 }
 ctx.save();ctx.translate(0,-cameraY);
 plats.forEach(p=>{
   if(p.y-cameraY>H+110||p.y-cameraY<-115)return;
   if(p.final){const gx=p.x+p.w/2,gy=p.y+24,gg=ctx.createRadialGradient(gx,gy,4,gx,gy,p.w*.7);gg.addColorStop(0,'rgba(255,231,166,.38)');gg.addColorStop(1,'rgba(255,231,166,0)');ctx.fillStyle=gg;ctx.fillRect(gx-p.w*.75,gy-p.w*.6,p.w*1.5,p.w*1.2);}
   drawImage('assets/platforms/'+p.type+'.png',p.x,p.y,p.w,p.h);
 });
 obstacles.forEach(o=>{
   if(o.y-cameraY>H+100||o.y-cameraY<-120)return;
   const bob=Math.sin(animTime*1.2+o.phase)*2;
   if(o.type==='yarn_ball')drawYarnObstacle(o,bob);

 });
 flowers.forEach(f=>{
   if(f.y-cameraY>H+80||f.y-cameraY<-100)return;
   const im=imgs['assets/bonuses/flower_bouquet.png'];
   if(im&&im.complete&&im.naturalWidth){ctx.save();ctx.translate(f.x,f.y);ctx.rotate(Math.sin(animTime*1.05+f.phase)*.022);ctx.drawImage(im,-35*f.scale,-40*f.scale,70*f.scale,40*f.scale);ctx.restore();}
 });
 stars.forEach(s=>{
   if(!s.got&&s.y-cameraY>-50&&s.y-cameraY<H+50){
     const bob=Math.sin(animTime*1.8+s.phase)*3;
     drawImage('assets/bonuses/smiling_star.png',s.x-17,s.y-17+bob,34,34);
   }
 });
 const fin=state==='finalizing'||state==='final';
 const pose=fin?(finaleElapsed<.9?(player.dir<0?'jump_left_cane':'jump_right_cane'):'back_view'):player.vy < -95?(player.dir<0?'jump_left_cane':'jump_right_cane'):
   player.vy>125?(player.dir<0?'jump_crouch_left':'jump_crouch_right'):
   (player.dir<0?'stand_cane_left':'stand_cane_right');
 const footY=player.y+player.h*.41+FOOT_OFFSET,pw=78,ph=116;
 const squash=player.landPulse*.075,tilt=clamp(player.vx/MAX_SPEED,-1,1)*-.055;
 ctx.save();ctx.translate(player.x,footY-54);ctx.rotate(tilt);
 ctx.scale((1+squash)*finaleScale,(1-squash)*finaleScale);drawImage('assets/character/'+pose+'.png',-pw/2,-ph+54,pw,ph);
 ctx.restore();
 if(fin){ // sparkles trailing the final ascent, drawn in world space
   for(let i=0;i<26;i++){
     const a=i*2.399+animTime*.4,rr=20+((i*37)%70)+finaleElapsed*14;
     const sxp=player.x+Math.cos(a)*rr*.9,syp=footY-60+Math.sin(a)*rr*1.1+finaleElapsed*(8+i%5*4);
     ctx.fillStyle=`rgba(255,240,190,${.55*Math.abs(Math.sin(animTime*3+i))*Math.min(1,finaleElapsed)})`;
     ctx.beginPath();ctx.arc(sxp,syp,1+(i%3)*.8,0,Math.PI*2);ctx.fill();
   }
 }
 ctx.restore();
 if(fadeAlpha>0){ctx.fillStyle=`rgba(2,3,6,${fadeAlpha})`;ctx.fillRect(0,0,W,H);}
}
// ---------- Finale: last leap towards the stars ----------
const FINALE_TIME=4.8;
const ease=t=>1-Math.pow(1-clamp(t,0,1),3);
function updateFinale(dt){
 finaleElapsed+=dt;animTime+=dt;
 const t=finaleElapsed;
 // A happy little hop on the summit, then she stands and looks up at the sky that was waiting for her.
 player.y=finalY0-(t<.8?70*Math.sin(Math.PI*t/.8):0);
 finaleScale=1;
 cameraTarget=Math.min(cameraTarget,finalY0-H*.66);
 cameraY=mix(cameraY,cameraTarget,1-Math.exp(-dt*2.2));
 fadeAlpha=clamp((t-3.4)/(FINALE_TIME-3.4),0,1);
}
function showFinale(){
 fadeAlpha=1;
 $('finale').classList.remove('hidden');try{parent.postMessage({type:'trial-info',game:2},'*')}catch(e){}
 $('progressbar').parentElement.classList.add('hidden');
 initSkyMap();
}

// ---------- Sky map: d3-celestial loaded lazily, with an offline fallback ----------
// The CDN scripts are loaded only when the finale appears, so a slow or blocked CDN
// can never prevent the game itself from starting.
const CELESTIAL_CSS='https://cdn.jsdelivr.net/gh/ofrohn/d3-celestial@master/celestial.css';
const CELESTIAL_JS=['https://cdn.jsdelivr.net/npm/d3@3/d3.min.js','https://cdn.jsdelivr.net/gh/ofrohn/d3-celestial@master/lib/d3.geo.projection.min.js','https://cdn.jsdelivr.net/gh/ofrohn/d3-celestial@master/celestial.min.js'];
function loadScript(src,ms){return new Promise((res,rej)=>{
 const el=document.createElement('script');let done=false;
 const t=setTimeout(()=>{if(!done){done=true;rej(new Error('timeout '+src));}},ms);
 el.onload=()=>{if(!done){done=true;clearTimeout(t);res();}};
 el.onerror=()=>{if(!done){done=true;clearTimeout(t);rej(new Error('failed '+src));}};
 el.src=src;document.head.appendChild(el);});}
async function loadCelestial(){
 if(window.Celestial)return;
 const l=document.createElement('link');l.rel='stylesheet';l.href=CELESTIAL_CSS;document.head.appendChild(l);
 for(const src of CELESTIAL_JS)await loadScript(src,9000); // sequential: each depends on the previous
 if(!window.Celestial)throw new Error('Celestial missing after load');
}
function celestialConfig(){return {width:0,projection:'airy',transform:'equatorial',center:[0,0],orientationfixed:true,
 geopos:[54.4280556,50.8047222],follow:'zenith',zoomlevel:1.35,zoomextend:4,adaptable:true,interactive:true,
 form:false,location:false,controls:true,lang:'ru',container:'celestial-map',
 datapath:'https://cdn.jsdelivr.net/gh/ofrohn/d3-celestial@master/data/',
 stars:{show:true,limit:6,colors:false,style:{fill:'#ffffff',opacity:.92},designation:false,propername:false,size:4,exponent:-.28,data:'stars.6.json'},
 dsos:{show:false},planets:{show:true,which:['jup','sat'],names:true},
 constellations:{names:false,lines:true,lineStyle:{stroke:'#c9d6e8',width:.8,opacity:.58},bounds:false},
 mw:{show:true,style:{fill:'#ffffff',opacity:.08}},
 lines:{graticule:{show:false},equatorial:{show:false},ecliptic:{show:false},galactic:{show:false},supergalactic:{show:false}},
 background:{fill:'#020306',stroke:'#020306',opacity:1,width:0}};}
async function initSkyMap(){
 if(celestialReady||fallbackReady)return;
 const box=$('celestial-map');
 box.classList.add('loading');
 try{
   await loadCelestial();
   const cfg=celestialConfig();
   Celestial.display(cfg);
   // 19.11.1999 00:00 local (UTC+3) = 18.11.1999 21:00 UTC, Nurlat.
   Celestial.skyview({date:new Date(Date.UTC(1999,10,18,21,0,0)),location:[54.4280556,50.8047222]});
   celestialReady=true;
 }catch(e){
   console.warn('Celestial unavailable, using postcard viewer:',e);
   box.innerHTML='';initPostcardViewer(box);
 }
 box.classList.remove('loading');
}
// Offline fallback: the original postcard, with drag-to-pan, wheel/pinch zoom and double-tap zoom.
function initPostcardViewer(box){
 fallbackReady=true;box.classList.add('viewer');
 const img=new Image();img.src='assets/rewards/starry-postcard.png';img.alt='Звёздное небо твоей истории';img.draggable=false;
 box.appendChild(img);
 let z=1,tx=0,ty=0;const pts=new Map();let pinch0=0,z0=1;
 const apply=()=>{
   const bw=box.clientWidth,bh=box.clientHeight,iw=img.clientWidth*z,ih=img.clientHeight*z;
   const mx=Math.max(0,(iw-bw)/2),my=Math.max(0,(ih-bh)/2);
   tx=clamp(tx,-mx,mx);ty=clamp(ty,-my,my);
   img.style.transform=`translate(-50%,-50%) translate(${tx}px,${ty}px) scale(${z})`;
 };
 const zoomBy=f=>{z=clamp(z*f,1,5);apply();};
 box.addEventListener('wheel',e=>{e.preventDefault();zoomBy(e.deltaY<0?1.15:1/1.15);},{passive:false});
box.addEventListener('pointerdown',e=>{if(e.target.closest('.viewer-ctl'))return; // let +/- buttons receive their own clicks
   pts.set(e.pointerId,[e.clientX,e.clientY]);try{box.setPointerCapture(e.pointerId);}catch(_){}
   if(pts.size===2){const [a,b]=[...pts.values()];pinch0=Math.hypot(a[0]-b[0],a[1]-b[1]);z0=z;}});
 box.addEventListener('pointermove',e=>{
   if(!pts.has(e.pointerId))return;const o=pts.get(e.pointerId);
   if(pts.size===2){pts.set(e.pointerId,[e.clientX,e.clientY]);const [a,b]=[...pts.values()];
     if(pinch0){z=clamp(z0*Math.hypot(a[0]-b[0],a[1]-b[1])/pinch0,1,5);apply();}return;}
   tx+=e.clientX-o[0];ty+=e.clientY-o[1];pts.set(e.pointerId,[e.clientX,e.clientY]);apply();});
 ['pointerup','pointercancel'].forEach(ev=>box.addEventListener(ev,e=>{pts.delete(e.pointerId);pinch0=0;}));
 box.addEventListener('dblclick',()=>{z=z>1.5?1:2.4;if(z===1){tx=ty=0;}apply();});
 const ctl=document.createElement('div');ctl.className='viewer-ctl';
 [['+',()=>zoomBy(1.4)],['−',()=>{zoomBy(1/1.4);}]].forEach(([t,f])=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.setAttribute('aria-label',t==='+'?'Приблизить':'Отдалить');b.addEventListener('click',f);ctl.appendChild(b);});
 box.appendChild(ctl);
 img.onload=apply;addEventListener('resize',apply);
}
// Fixed-step simulation: physics advances in identical 1/120 s slices,
// regardless of display refresh rate or occasional dropped animation frames.
const FIXED_DT=1/120;
function loop(now){
 if(state!=='playing'&&state!=='finalizing')return;
 const elapsed=Math.max(0,(now-last)/1000);last=now;
 if(state==='finalizing'){
   updateFinale(Math.min(elapsed,.1));render();
   if(finaleElapsed>=FINALE_TIME){state='final';showFinale();return;}
   rafId=requestAnimationFrame(loop);return;
 }
 // Ignore long pauses (background tabs / device sleep) instead of applying
 // one enormous physics step when the page becomes active again.
 // Equal-sized substeps that exactly cover the real frame time: motion stays
 // proportional to the display refresh (no 2/3-step judder on 60/90/120/144 Hz).
 const frameDt=Math.min(elapsed,.05);
 const n=Math.min(8,Math.max(1,Math.ceil(frameDt/FIXED_DT-1e-6)));
 const sub=frameDt/n;
 for(let i=0;i<n&&state==='playing';i++)update(sub);
 render();
 // 'finalizing' must keep the loop alive too, otherwise the finale never advances.
 if(state==='playing'||state==='finalizing')rafId=requestAnimationFrame(loop);
}
bind('again-final',start);
reset();render();
})();