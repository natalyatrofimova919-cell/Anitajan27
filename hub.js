(()=>{
const $=id=>document.getElementById(id);
const DPR=Math.min(window.devicePixelRatio||1,2);
/* ---------- golden dust background ---------- */
const bg=$('bg'),bx=bg.getContext('2d');let BW=0,BH=0,dust=[],bokeh=[];
function rs(){BW=innerWidth;BH=innerHeight;bg.width=BW*DPR;bg.height=BH*DPR;bx.setTransform(DPR,0,0,DPR,0,0);
 const n=Math.round(BW*BH/5200);dust=[];for(let i=0;i<n;i++)dust.push(mk(true));
 bokeh=[];for(let i=0;i<14;i++)bokeh.push({x:Math.random()*BW,y:Math.random()*BH,r:30+Math.random()*80,vx:(Math.random()-.5)*.12,vy:-.05-Math.random()*.15,a:.05+Math.random()*.09,p:Math.random()*6})}
function mk(init){const s=Math.random();return{x:Math.random()*BW,y:init?Math.random()*BH:BH+10,r:.4+Math.random()*1.9,vy:-(.08+Math.random()*.35),vx:(Math.random()-.5)*.15,p:Math.random()*6,sp:.6+Math.random()*2,tw:s<.3}}
addEventListener('resize',rs);rs();
function drawBg(t){
 const g=bx.createRadialGradient(BW*.5,BH*.35,0,BW*.5,BH*.5,Math.max(BW,BH)*.8);
 g.addColorStop(0,'#3a1c5e');g.addColorStop(.5,'#1d0f38');g.addColorStop(1,'#080512');bx.fillStyle=g;bx.fillRect(0,0,BW,BH);
 const gl=bx.createRadialGradient(BW*.5,BH*1.05,0,BW*.5,BH*1.05,BH*.9);gl.addColorStop(0,'rgba(255,190,90,.28)');gl.addColorStop(1,'rgba(255,190,90,0)');bx.fillStyle=gl;bx.fillRect(0,0,BW,BH);
 bx.globalCompositeOperation='lighter';
 for(const b of bokeh){b.x+=b.vx;b.y+=b.vy;if(b.y<-b.r)b.y=BH+b.r;const a=b.a*(.7+.3*Math.sin(t/1800+b.p));
  const rg=bx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);rg.addColorStop(0,`rgba(255,215,130,${a})`);rg.addColorStop(.7,`rgba(255,190,90,${a*.5})`);rg.addColorStop(1,'rgba(255,190,90,0)');bx.fillStyle=rg;bx.beginPath();bx.arc(b.x,b.y,b.r,0,7);bx.fill()}
 for(let i=0;i<dust.length;i++){const d=dust[i];d.y+=d.vy;d.x+=d.vx+Math.sin(t/1500+d.p)*.12;if(d.y<-10){dust[i]=mk(false);continue}
  let a=.55;if(d.tw)a=.15+.85*Math.abs(Math.sin(t/1000*d.sp+d.p));
  bx.fillStyle=`rgba(255,${205+(d.r*10|0)},${120+(d.r*30|0)},${a})`;bx.beginPath();bx.arc(d.x,d.y,d.r,0,7);bx.fill();
  if(d.tw&&d.r>1.5){bx.strokeStyle=`rgba(255,235,170,${a*.6})`;bx.lineWidth=.6;bx.beginPath();bx.moveTo(d.x-d.r*3,d.y);bx.lineTo(d.x+d.r*3,d.y);bx.moveTo(d.x,d.y-d.r*3);bx.lineTo(d.x,d.y+d.r*3);bx.stroke()}}
 bx.globalCompositeOperation='source-over';
}
/* ---------- scenes ---------- */
let cur=null;
function show(id){const el=$(id);if(cur&&cur!==el)cur.classList.remove('on');el.classList.add('on');cur=el;}
function go(n){show('s'+n);if(n==2)startCake();}
let stage=0,timer=0;const song=$('song');let songOn=false;
function songStart(){if(songOn)return;songOn=true;song.volume=.8;song.play().catch(()=>{songOn=false})}
function songStop(){let v=song.volume;const i=setInterval(()=>{v-=.05;if(v<=0){clearInterval(i);song.pause()}else song.volume=v},80)}
['pointerdown','keydown'].forEach(ev=>addEventListener(ev,()=>{if(stage===0)songStart()}));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
/* ---------- candles ---------- */
const IW=1219,IH=1290;
const PTS=[[407,927],[438,913],[472,904],[504,901],[536,899],[568,897],[601,901],[631,899],[662,899],[694,901],[726,897],[757,903],[787,909],[818,916],[849,929],[438,939],[472,943],[507,947],[541,948],[575,955],[612,957],[648,955],[684,954],[722,952],[756,946],[788,943],[818,938]];
const fc=$('flames'),fx=fc.getContext('2d');let FW=0,FH=0,K=1,cand=[],smoke=[],cakeOn=false,t0=0,pdown=false,last=null,done=false,hintOff=false;
function frs(){const r=fc.getBoundingClientRect();FW=r.width;FH=r.height;fc.width=FW*DPR;fc.height=FH*DPR;fx.setTransform(DPR,0,0,DPR,0,0);K=FW/IW}
addEventListener('resize',()=>{if(cakeOn)frs()});
function startCake(){
 if(cakeOn)return;cakeOn=true;done=false;hintOff=false;$('hint').classList.remove('off');
 setTimeout(frs,50);frs();
 const order=PTS.map((_,i)=>i).sort(()=>Math.random()-.5);
 cand=PTS.map((p,i)=>({x:p[0],y:p[1],lit:true,out:false,at:performance.now()+900+order.indexOf(i)*85+Math.random()*60,ph:Math.random()*9,sz:.9+Math.random()*.2}));
 upd();
}
function upd(){const n=cand.filter(c=>!c.out).length;$('counter').textContent=n?`свечей осталось: ${n}`:''}
function flame(c,now){
 const age=(now-c.at)/1000;if(age<0)return;const ig=Math.min(1,age/.5);
 const f=c.ph+now/1000;const fl=1+.07*Math.sin(f*11)+.05*Math.sin(f*17+1)+.03*Math.sin(f*29);
 const sway=Math.sin(f*5.3)*1.6*K+Math.sin(f*2.1)*.8*K;
 const x=c.x*K,y=c.y*K,s=K*c.sz*ig*fl;
 const gr=44*K*ig*(0.9+.1*fl);
 const g=fx.createRadialGradient(x,y,0,x,y,gr);g.addColorStop(0,'rgba(255,200,90,.42)');g.addColorStop(.4,'rgba(255,150,40,.14)');g.addColorStop(1,'rgba(255,120,20,0)');
 fx.globalCompositeOperation='lighter';fx.fillStyle=g;fx.beginPath();fx.arc(x,y,gr,0,7);fx.fill();
 fx.globalCompositeOperation='source-over';
 const w=7.5*s,h=17*s,by=y+9*s;
 const path=()=>{fx.beginPath();fx.moveTo(x,by);fx.bezierCurveTo(x-w*1.3,by-h*.3,x-w*.7,by-h*.75,x+sway,by-h*1.08);fx.bezierCurveTo(x+w*.7,by-h*.75,x+w*1.3,by-h*.3,x,by);fx.closePath()};
 path();const fg=fx.createLinearGradient(0,by,0,by-h);fg.addColorStop(0,'rgba(255,120,20,.95)');fg.addColorStop(.5,'rgba(255,190,60,.98)');fg.addColorStop(1,'rgba(255,235,150,.9)');fx.fillStyle=fg;fx.fill();
 fx.save();fx.translate(x,by);fx.scale(.5,.6);fx.translate(-x,-by);fx.beginPath();fx.moveTo(x,by-1*s);fx.bezierCurveTo(x-w*1.2,by-h*.3,x-w*.6,by-h*.7,x+sway*.6,by-h*.95);fx.bezierCurveTo(x+w*.6,by-h*.7,x+w*1.2,by-h*.3,x,by-1*s);fx.fillStyle='rgba(255,255,235,.95)';fx.fill();fx.restore();
 fx.beginPath();fx.fillStyle='rgba(60,80,200,.55)';fx.ellipse(x,by-1*s,2*s,3*s,0,0,7);fx.fill();
}
function blow(x,y,R,max){
 let hit=0;const now=performance.now();
 const cs=cand.filter(c=>!c.out&&now>c.at+250).map(c=>({c,d:Math.hypot(c.x*K-x,c.y*K-y)})).filter(o=>o.d<R).sort((a,b)=>a.d-b.d);
 for(const o of cs){if(max&&hit>=max)break;o.c.out=true;hit++;for(let i=0;i<7;i++)smoke.push({x:o.c.x*K,y:o.c.y*K-4*K,vx:(Math.random()-.5)*.5+.35,vy:-(.5+Math.random()*.8),a:.5,r:2+Math.random()*3,life:0})}
 if(hit){hintOff=true;$('hint').classList.add('off');upd();if(!cand.some(c=>!c.out)&&!done){done=true;setTimeout(finish,900)}}
}
function pt(e){const r=fc.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}
fc.addEventListener('pointerdown',e=>{pdown=true;fc.setPointerCapture(e.pointerId);frs();const[x,y]=pt(e);last=[x,y];blow(x,y,Math.max(30*K,18),2)});
fc.addEventListener('pointermove',e=>{if(!pdown)return;const[x,y]=pt(e);if(last){const dx=x-last[0],dy=y-last[1],n=Math.max(1,Math.ceil(Math.hypot(dx,dy)/(8*K)));for(let i=1;i<=n;i++)blow(last[0]+dx*i/n,last[1]+dy*i/n,Math.max(48*K,24))}last=[x,y]});
['pointerup','pointercancel'].forEach(ev=>fc.addEventListener(ev,()=>{pdown=false;last=null}));
function finish(){confetti();setTimeout(()=>{go(3);cakeOn=false},3800)}
/* ---------- confetti ---------- */
const cf=document.createElement('canvas');Object.assign(cf.style,{position:'fixed',inset:0,width:'100%',height:'100%',zIndex:8,pointerEvents:'none'});document.body.appendChild(cf);const cx=cf.getContext('2d');let parts=[],cfOn=false;
function confetti(){cf.width=innerWidth*DPR;cf.height=innerHeight*DPR;cx.setTransform(DPR,0,0,DPR,0,0);
 const cols=['#ffe08a','#f4b73f','#fff6dc','#ff9fb8','#c9a7ff','#8fd3ff','#ffffff'];
 const burst=(x,dir)=>{for(let i=0;i<110;i++){const a=(-Math.PI/2)+dir*(.15+Math.random()*.7)*(Math.random()<.5?1:.5);const v=11+Math.random()*15;parts.push(P(x,innerHeight+10,Math.sin(a)*0+Math.cos(a)*v*(dir||1)*0+Math.sin(-a)*0+Math.cos(a)*v,Math.sin(a)*v,cols))}};
 for(let i=0;i<110;i++){const a=-Math.PI/2+(Math.random()-.15)*.9;const v=12+Math.random()*16;parts.push(P(0,innerHeight,Math.cos(a)*v,Math.sin(a)*v,cols))}
 for(let i=0;i<110;i++){const a=-Math.PI/2+(Math.random()-.85)*.9;const v=12+Math.random()*16;parts.push(P(innerWidth,innerHeight,Math.cos(a)*v,Math.sin(a)*v,cols))}
 let n=0;const rain=setInterval(()=>{for(let i=0;i<14;i++)parts.push(P(Math.random()*innerWidth,-10,(Math.random()-.5)*2,2+Math.random()*3,cols));if(++n>20)clearInterval(rain)},110);
 cfOn=true}
function P(x,y,vx,vy,cols){return{x,y,vx,vy,c:cols[Math.random()*cols.length|0],w:5+Math.random()*8,h:3+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.35,k:Math.random()*6,sh:Math.random()<.25?1:Math.random()<.3?2:0,life:0}}
function drawCf(){cx.clearRect(0,0,innerWidth,innerHeight);if(!parts.length){cfOn=false;return}
 for(const p of parts){p.vy+=.28;p.vx*=.985;p.vy*=.985;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;p.k+=.12;p.life++;
  const sx=Math.abs(Math.cos(p.k));cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillStyle=p.c;cx.globalAlpha=Math.min(1,Math.max(0,(520-p.life)/80));
  if(p.sh==1){cx.beginPath();cx.arc(0,0,p.w/2.2,0,7);cx.fill()}else if(p.sh==2){cx.beginPath();for(let i=0;i<5;i++){const a=i*1.2566-1.5708,b=a+.6283;cx.lineTo(Math.cos(a)*p.w*.7,Math.sin(a)*p.w*.7);cx.lineTo(Math.cos(b)*p.w*.3,Math.sin(b)*p.w*.3)}cx.fill()}else cx.fillRect(-p.w/2,-p.h*sx/2,p.w,p.h*sx);
  cx.restore()}
 parts=parts.filter(p=>p.y<innerHeight+40&&p.life<520)}
/* ---------- loop ---------- */
function loop(t){if(stage>=1&&cur&&cur.id==='sg'){requestAnimationFrame(loop);return}drawBg(t);
 if(cakeOn){fx.clearRect(0,0,FW,FH);const now=performance.now();
  for(const c of cand)if(!c.out)flame(c,now);
  for(const s of smoke){s.life++;s.x+=s.vx+Math.sin(s.life/6+s.r)*.25;s.y+=s.vy;s.vy*=.985;s.r+=.08;const a=Math.max(0,s.a*(1-s.life/70));fx.fillStyle=`rgba(220,215,230,${a})`;fx.beginPath();fx.arc(s.x,s.y,s.r,0,7);fx.fill()}
  smoke=smoke.filter(s=>s.life<70)}
 if(cfOn)drawCf();
 requestAnimationFrame(loop)}
requestAnimationFrame(loop);
/* ---------- games ---------- */
const frame=$('frame'),nextB=$('next'),tn=$('tn');
function playTrial(n){stage=n;clearTimeout(timer);nextB.classList.remove('show');tn.textContent=n;show('sc');
 setTimeout(()=>{frame.src='games/'+n+'/index.html';frame.onload=()=>{show('sg');frame.onload=null;try{frame.focus();frame.contentWindow.focus()}catch(e){}}},1900)}
$('startGames').onclick=()=>{songOn=true;songStop();playTrial(1)};
nextB.onclick=()=>{nextB.classList.remove('show');playTrial(stage+1)};
addEventListener('message',e=>{if(!e.data||e.data.type!=='trial-info'||e.data.game!==stage)return;clearTimeout(timer);timer=setTimeout(()=>nextB.classList.add('show'),stage===1?5000:6000)});
/* ---------- boot ---------- */
const h=location.hash.replace('#','');
setTimeout(()=>{if(h==='g2')playTrial(2);else if(h==='g3')playTrial(3);else if(/^[1-4]$/.test(h))go(+h);else go(1)},350);
})();
