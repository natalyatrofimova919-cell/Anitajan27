// Phaser 3 background helper. progress01: 0=dawn, 1=night.
const STOPS = [
  [0.00, [246,177,135]], [0.26,[245,193,166]],
  [0.50, [118,180,222]], [0.70,[225,133,119]],
  [0.86, [86,77,137]], [1.00,[13,25,61]]
];
function colourAt(t) {
  t = Math.max(0, Math.min(1, t));
  for (let i=0;i<STOPS.length-1;i++) {
    const [a,ca]=STOPS[i], [b,cb]=STOPS[i+1];
    if (t>=a && t<=b) {
      const f=(t-a)/(b-a);
      return ca.map((v,k)=>Math.round(v*(1-f)+cb[k]*f));
    }
  }
  return STOPS[STOPS.length-1][1];
}
export function createSkyTexture(scene, width=720, height=1280) {
  const canvas=document.createElement("canvas");
  canvas.width=width; canvas.height=height;
  const ctx=canvas.getContext("2d");
  const key="dynamic-sky";
  if (scene.textures.exists(key)) scene.textures.remove(key);
  scene.textures.addCanvas(key,canvas);
  scene._sky={canvas,ctx,key};
  updateSky(scene,0);
  return key;
}
export function updateSky(scene, progress01) {
  if (!scene._sky) return;
  const {canvas,ctx,key}=scene._sky;
  const g=ctx.createLinearGradient(0,0,0,canvas.height);
  for(let i=0;i<=24;i++){
    const local=Math.max(0,Math.min(1,progress01+(1-i/24)*0.07));
    const [r,gg,b]=colourAt(local);
    g.addColorStop(i/24,`rgb(${r},${gg},${b})`);
  }
  ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);
  const night=Math.max(0,Math.min(1,(progress01-0.60)/0.34));
  for(let i=0;i<100;i++){
    const x=(i*137.5)%canvas.width, y=(i*83.7)%(canvas.height*0.78);
    ctx.fillStyle=`rgba(255,245,225,${night*(0.2+0.6*(i%7)/7)})`;
    ctx.beginPath(); ctx.arc(x,y,i%11===0?2:1,0,Math.PI*2); ctx.fill();
  }
  scene.textures.get(key).refresh();
}
