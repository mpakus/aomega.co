import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { buildEngine, updateEngine, phaseAt, strokeAt, STROKES, RAD, mod } from './engine.js';

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const state={angle:0,rpm:850,playback:.05,running:false,paused:false,startTime:0,startup:'off',mode:'solid',explode:0,teardown:0,hidden:new Set(),isolated:null,selected:null,labels:false,combustion:false};
let toastTimer,model,renderer,scene,camera,controls,resizeObserver,raf;
const teardownNotes=[
 'Explore the assembled engine, then uncover its layers.',
 'Accessories removed: intake, headers, plugs, and cam chest cover.',
 'Rocker covers, gaskets, and cover bolts removed.',
 'Rocker arms, shafts, pushrods, and cover tubes removed.',
 'Cylinder heads, valves, springs, seals, and studs removed.',
 'Cylinder barrels and base gaskets removed. Inspect the pistons.',
 'Pistons, rings, pins, and connecting rods removed.',
 'Cam drive, lifters, support plate, and oil pump removed.',
 'Crankcases, bearings, and balancers removed. The shared crankshaft remains.'
];
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500);}
function rangeFill(el){const pct=(Number(el.value)-Number(el.min))/(Number(el.max)-Number(el.min))*100;el.style.setProperty('--fill',`${pct}%`);}
function setMode(mode){state.mode=mode;$$('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===mode);b.setAttribute('aria-pressed',String(b.dataset.mode===mode));});}
function showDialog(html){$('#dialog-content').innerHTML=html;if(!$('#info-dialog').open)$('#info-dialog').showModal();}
const aboutHTML=`<h2>Inside the Milwaukee-Eight 117</h2><p>A hands-on study of the <b>2023 Low Rider ST (FXLRST)</b> engine. Orbit the model, run its mechanisms, and select any modeled part to understand its role.</p><div class="reference-grid"><div><span>ARCHITECTURE</span>45° V-twin · four-stroke</div><div><span>DISPLACEMENT</span>117 cu in / 1,923 cc</div><div><span>BORE × STROKE</span>103.5 × 114.3 mm</div><div><span>COMPRESSION RATIO</span>10.2:1</div><div><span>VALVE TRAIN</span>Single cam · 4 valves per cylinder</div><div><span>IGNITION</span>2 spark plugs per cylinder</div><div><span>LUBRICATION</span>Pressurized dry sump · oil cooler</div><div><span>SOFTAIL BALANCING</span>Two internal counterbalancers</div></div><h3>How to explore</h3><ul><li>Drag to orbit, scroll or pinch to zoom, and right-drag or use two fingers to pan. Camera buttons give repeatable views.</li><li>Use <b>X-ray</b> for transparent housings, or <b>Cutaway</b> to remove the right-hand half of exterior surfaces.</li><li>Select a part in the model or catalog. <b>Focus</b> centers it, <b>Isolate</b> hides the rest, and <b>Remove</b> takes it out of the assembly.</li><li>Start the engine, pause it, advance by 15°, or scrub the 720° cycle. Slow playback scales the animation only; the RPM setting describes simulated engine speed.</li><li>Use the disassembly slider for an exploded view, or follow <b>Guided teardown</b> to uncover successive layers. This is an inspection sequence, not a workshop procedure.</li></ul><h3>Exterior finish</h3><p>The assembled view uses photo-referenced intake proportions, black exhaust shields, cast-surface microtexture, chrome pushrod covers, machined fin edges and studio reflections. The silhouette is closer to the 2023 engine, but this remains a reconstruction rather than a dimensional scan.</p><h3>Model fidelity</h3><p>This is a procedural educational reconstruction, not Harley-Davidson CAD, a complete OEM parts catalog, or a service manual. Every displayed component has a name and description; chain links, bearing internals, valve keepers and some assemblies are grouped. Wiring, the ECU, oil reservoir, detailed oil galleries, small internal seals, primary drive, clutch, transmission, and exact production hardware are not modeled.</p><p>Bore, stroke, cylinder angle, 2:1 crank/cam speed, and 315°/405° firing intervals guide the animation. Rod length, fork-and-blade geometry, ports, cam profiles, valve angles, fastener placement and oil routing are illustrative. Valve events use ideal 180° strokes without factory overlap or ignition advance. Startup is a teaching sequence; no real pressure, temperature, torque or fault behavior is calculated. This is the 2023 117, not the later 117 High Output.</p><h3>References</h3><ul><li><a href="https://www.autoby.jp/_ct/17627361/p2" target="_blank" rel="noopener noreferrer">2023 Low Rider ST engine photographs</a> — reference for intake, covers, fins, pushrod tubes and black exhaust appearance. Reference images are not distributed in this package.</li><li><a href="https://h-dmediakit.com/us/bdp/?fxlrst%7C2023=" target="_blank" rel="noopener noreferrer">Harley-Davidson: 2023 Low Rider ST specifications</a> — dimensions, displacement, valve layout, fueling, lubrication and starter.</li><li><a href="https://h-dmediakit.com/us/news-articles/all-new-harley-davidson-milwaukee-eight-engine.html" target="_blank" rel="noopener noreferrer">Harley-Davidson: Milwaukee-Eight engine architecture</a> — 45° V-twin, four-valve heads, dual plugs and a single chain-driven cam. The Touring-specific balancer arrangement does not apply to this Softail model.</li><li><a href="https://h-dmediakit.com/dh/news-articles/harley-davidson-unleashes-big-twin-custom-revolution.html" target="_blank" rel="noopener noreferrer">Harley-Davidson: Softail engine and chassis announcement</a> — dual internal counterbalancers.</li><li><a href="https://www.insurance.harley-davidson.com/resources/motorcycles-that-changed-harley-davidson" target="_blank" rel="noopener noreferrer">Harley-Davidson Insurance: V-twin firing intervals</a> — shared crankpin and 315°/405° sequence.</li></ul><p>Independent educational project. Harley-Davidson and Milwaukee-Eight are trademarks of their respective owner. Rendered with Three.js r180.</p>`;
const guideHTML=`<h2>Four strokes. Two revolutions.</h2><p>One cylinder completes its cycle in <b>720° of crankshaft rotation</b>. In this model, 0° is the front cylinder’s firing top dead center.</p><div class="reference-grid"><div><span style="color:#ff782f">0–180° · POWER</span>Ignition, expansion, piston down. Both valve pairs closed.</div><div><span style="color:#fa7765">180–360° · EXHAUST</span>Piston up, exhaust valves open. Spent gas leaves.</div><div><span style="color:#6ccad9">360–540° · INTAKE</span>Piston down, intake valves open. Fresh charge enters.</div><div><span style="color:#b4a3f3">540–720° · COMPRESSION</span>Piston up, both valve pairs closed. The charge is compressed.</div></div><h3>Why the two cylinders look out of step</h3><p>Both rods share one crankpin, but the cylinders sit 45° apart. With the front cylinder firing at 0°, the rear fires at 315°, and the front fires again 405° later at 720°. This uneven spacing contributes to the distinctive V-twin cadence.</p><h3>Follow the motion</h3><ol><li>Select <b>X-ray</b> or <b>Cutaway</b>.</li><li>Choose <b>Study · 0.015×</b> and start the engine.</li><li>Watch pressure push a piston, its rod turn the shared crankpin, and the camshaft turn at half crankshaft speed.</li><li>Pause and scrub the cycle to compare the valve pairs with each piston’s stroke.</li></ol><p>Displayed timing is idealized: actual cam events include overlap, and ignition can occur before top dead center. The real engine starts at cranking speed before settling to idle; this app stretches those stages for visibility.</p>`;

function overview(){return `<div class="part-type">45° V-TWIN / ENGINE ASSEMBLY</div><h3>Built around<br>one shared crankpin.</h3><p>Two cylinders. Eight valves. A single camshaft. Explore how each component turns combustion into motion.</p><div class="detail-fact"><span>Engine</span><b>Milwaukee-Eight 117</b><span>Model year</span><b>2023 · Low Rider ST</b><span>Components</span><b>${model.parts.length} selectable items</b></div><div class="part-actions"><button class="focus-btn" id="show-inside">Look inside</button><button id="pick-piston">Explore a piston</button></div>`;}
function selectPart(id,{reveal=false}={}){
 state.selected=id;const p=model.parts.find(p=>p.id===id);
 if(!p){state.selected=null;$('#part-id').textContent='OVERVIEW';$('#part-detail').innerHTML=overview();$('#show-inside').onclick=()=>setMode('xray');$('#pick-piston').onclick=()=>{setMode('xray');selectPart(model.byName.get('Front piston').id);};}
 else{
   if(reveal){if(p.stage<=state.teardown){state.teardown=0;updateTeardown();toast('Teardown reset to reveal this component.');}state.hidden.delete(id);if(state.isolated&&state.isolated!==id)state.isolated=id;}
   $('#part-id').textContent=p.id;$('#part-detail').innerHTML=`<div class="part-type">${p.category}</div><h3>${p.name}</h3><p>${p.description}</p><div class="detail-fact"><span>Material</span><b>${p.material}</b><span>Motion</span><b>${p.animate||p.spin||p.camSpin||p.balanceSpin?'Animated mechanism':'Stationary component'}</b></div><div class="part-actions"><button class="focus-btn" id="focus-part">Focus</button><button id="isolate-part">${state.isolated===id?'Show assembly':'Isolate'}</button><button id="hide-part">${state.hidden.has(id)?'Restore':'Remove'}</button><button id="clear-part" aria-label="Clear selected part">×</button></div>`;
   $('#focus-part').onclick=()=>{if(state.hidden.has(id)){state.hidden.delete(id);updateCatalogState();}if(p.stage<=state.teardown){state.teardown=0;updateTeardown();}if(!p.external&&state.mode==='solid'&&!state.isolated)setMode('xray');refreshEngine();fitModel(p.node,1.5);};
   $('#isolate-part').onclick=()=>{state.isolated=state.isolated===id?null:id;state.hidden.delete(id);if(p.stage<=state.teardown){state.teardown=0;updateTeardown();}refreshEngine();fitModel(state.isolated?p.node:null,state.isolated?1.5:1.12);selectPart(id);updateCatalogState();};
   $('#hide-part').onclick=()=>{const had=state.hidden.has(id);if(had)state.hidden.delete(id);else state.hidden.add(id);if(state.isolated===id)state.isolated=null;toast(had?`${p.name} restored`:`${p.name} removed`);selectPart(id);};
   $('#clear-part').onclick=()=>{state.isolated=null;selectPart(null);};
 }
 $('#selection-hint').textContent=p?p.name:'Click any part to explore';updateCatalogState();updateLabels();
}
function renderCatalog(){
 const query=$('#search').value.trim().toLowerCase(),groups=new Map();
 for(const p of model.parts){if(query&&!`${p.name} ${p.category} ${p.type}`.toLowerCase().includes(query))continue;if(!groups.has(p.category))groups.set(p.category,[]);groups.get(p.category).push(p);}
 const openGroups=new Set($$('.part-group[open]').map(d=>d.dataset.group));const firstRender=!$('#parts-list').children.length;
 $('#parts-list').innerHTML='';
 for(const [name,list]of groups){const details=document.createElement('details');details.className='part-group';details.dataset.group=name;details.open=!!query||openGroups.has(name)||(firstRender&&name==='Cylinders & heads');const summary=document.createElement('summary');const title=document.createElement('span');title.textContent=name;const count=document.createElement('small');count.textContent=list.length;summary.append(title,count);details.append(summary);for(const p of list){const button=document.createElement('button');button.className='part-row';button.dataset.id=p.id;button.innerHTML='<span class="part-dot"></span>';button.append(document.createTextNode(p.name));button.onclick=()=>{selectPart(p.id,{reveal:true});if(!p.external&&state.mode==='solid'&&state.explode<.1)setMode('xray');};details.append(button);}$('#parts-list').append(details);}
 if(!groups.size)$('#parts-list').innerHTML='<p class="empty-search">No matching components. Try “valve”, “ring” or “cam”.</p>';
 updateCatalogState();
}
function updateCatalogState(){
 if(!model)return;
 $$('.part-row').forEach(el=>{const p=model.parts.find(p=>p.id===el.dataset.id);el.classList.toggle('selected',el.dataset.id===state.selected);el.setAttribute('aria-pressed',String(el.dataset.id===state.selected));el.classList.toggle('hidden-part',state.hidden.has(p.id)||p.stage<=state.teardown||(state.isolated&&state.isolated!==p.id));});
 const visible=model.parts.filter(p=>!state.hidden.has(p.id)&&p.stage>state.teardown&&(!state.isolated||p.id===state.isolated)).length;
 $('#visible-count').textContent=`${visible} / ${model.parts.length} visible`;
}
function refreshEngine(){updateEngine(model,state.angle,{...state,combustion:state.combustion});}
let cameraTween=null;
function fitModel(node=null,padding=1.12){
 const bounds=new THREE.Box3();
 if(node){bounds.setFromObject(node);}else{for(const p of model.parts)if(p.node.visible)bounds.union(new THREE.Box3().setFromObject(p.node));}
 if(bounds.isEmpty())return;
 const center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
 const vertical=THREE.MathUtils.degToRad(camera.fov),horizontal=2*Math.atan(Math.tan(vertical/2)*camera.aspect);
 const dist=Math.max(size.y/(2*Math.tan(vertical/2)),size.x/(2*Math.tan(horizontal/2)),size.z/(2*Math.tan(horizontal/2)))*padding+Math.max(size.x,size.z)*.45;
 const dir=camera.position.clone().sub(controls.target).normalize();
 cameraTween={from:camera.position.clone(),to:center.clone().addScaledVector(dir,Math.max(2,dist)),fromTarget:controls.target.clone(),target:center,start:performance.now()};
}
function setCamera(view){
 const dirs={iso:[2.8,1.7,10],right:[0,0,10],left:[0,0,-10],front:[-10,0,0],top:[0,10,.001]};
 const distance=camera.position.distanceTo(controls.target),dir=new THREE.Vector3(...dirs[view]).normalize();
 cameraTween={from:camera.position.clone(),to:controls.target.clone().addScaledVector(dir,distance),fromTarget:controls.target.clone(),target:controls.target.clone(),start:performance.now()};
 $$('[data-camera]').forEach(el=>el.classList.toggle('active',el.dataset.camera===view));
}
function updateTeardown(){
 $('#teardown-step').textContent=state.teardown;$('#teardown-note').textContent=teardownNotes[state.teardown];$('#teardown-prev').disabled=state.teardown===0;$('#teardown-next').disabled=state.teardown===8;$('#view-badge').textContent=state.teardown?`TEARDOWN · LAYER ${state.teardown} / 8`:state.explode>0?'EXPLODED VIEW':'ASSEMBLED VIEW';updateCatalogState();
}
function setExplosion(value,{fit=false}={}){
 state.explode=value/100;$('#explode').value=value;$('#explode-value').innerHTML=`${Math.round(value)}<small>%</small>`;rangeFill($('#explode'));updateTeardown();refreshEngine();if(fit)fitModel();
}
function restore(){state.hidden.clear();state.isolated=null;state.teardown=0;setExplosion(0);updateTeardown();selectPart(state.selected);refreshEngine();fitModel();}
function stopEngine(){state.running=false;state.paused=false;state.startup='off';state.combustion=false;updateTransport();}
function updateTransport(){
 const status={off:'Engine off',prime:'Fuel system priming',cranking:'Starter cranking · 220 RPM',ignition:'Ignition · combustion begins',settling:'Settling to idle',running:`Running${state.explode>0?' · exploded study':''}`};
 $('#engine-status').textContent=state.paused?'Animation paused':status[state.startup];$('#status-dot').classList.toggle('running',state.running&&!state.paused);$('#start span').textContent=state.running?'Stop engine':'Start engine';$('#start').classList.toggle('running',state.running);$('#pause').disabled=!state.running&&!state.combustion;$('#pause').textContent=state.paused?'▶':'Ⅱ';$('#pause').setAttribute('aria-label',state.paused?'Resume animation':'Pause animation');$('#pause').title=state.paused?'Resume animation':'Pause animation';
}
function updateCycle(){
 const frontPhase=phaseAt(state.angle,0),rearPhase=phaseAt(state.angle,1);
 for(const [name,phase]of [['front',frontPhase],['rear',rearPhase]]){const index=Math.floor(phase/180),s=strokeAt(phase);$(`#${name}-stage`).textContent=s.name;$(`#${name}-stage`).style.color=s.hex;$(`#${name}-track`).querySelectorAll('.stroke-segment').forEach((el,i)=>{el.classList.toggle('active',i===index);el.style.setProperty('--progress',`${mod(phase,180)/180*100}%`);});}
 $('#cycle-info').textContent=strokeAt(frontPhase).text;$('#crank-value').innerHTML=`${Math.round(state.angle)}° <small>/ 720°</small>`;if(document.activeElement!==$('#crank'))$('#crank').value=Math.round(state.angle);rangeFill($('#crank'));
}
const labelElements=new Map();
function updateLabels(){if(!model)return;for(const p of model.parts){const show=state.labels&&(p.importance>=6||p.id===state.selected);if(show&&!labelElements.has(p.id)){const el=document.createElement('button');el.className='mesh-label';el.textContent=p.name;el.onclick=()=>selectPart(p.id);$('#label-layer').append(el);labelElements.set(p.id,el);}}}
function positionLabels(){const wrap=$('#canvas-wrap'),w=wrap.clientWidth,h=wrap.clientHeight,occupied=[];const order=[...labelElements].sort(([a],[b])=>Number(b===state.selected)-Number(a===state.selected));let count=0;for(const [id,el]of order){const p=model.parts.find(p=>p.id===id);el.classList.toggle('selected',id===state.selected);if(!state.labels||!p.node.visible||(p.importance<6&&id!==state.selected)||count>13){el.style.display='none';continue;}const point=p.node.getWorldPosition(new THREE.Vector3()).project(camera);const x=(point.x*.5+.5)*w,y=(-point.y*.5+.5)*h;const overlap=occupied.some(q=>Math.abs(q.x-x)<155&&Math.abs(q.y-y)<27);if(point.z<-1||point.z>1||x<65||x>w-65||y<74||y>h-78||overlap){el.style.display='none';continue;}el.style.display='block';el.style.left=`${x}px`;el.style.top=`${y}px`;occupied.push({x,y});count++;}}
function bindUI(){
 $('#part-count').textContent=model.parts.length;renderCatalog();selectPart(null);
 for(const name of ['front','rear'])$('#'+name+'-track').innerHTML=STROKES.map(s=>`<span class="stroke-segment" style="--stroke-color:${s.hex}" title="${s.name}"></span>`).join('');
 $$('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));$$('[data-camera]').forEach(b=>b.onclick=()=>setCamera(b.dataset.camera));
 $('#reset-camera').onclick=()=>{refreshEngine();fitModel();};$('#auto-orbit').onclick=()=>{controls.autoRotate=!controls.autoRotate;$('#auto-orbit').setAttribute('aria-pressed',String(controls.autoRotate));$('#auto-orbit').textContent=controls.autoRotate?'Stop orbit':'Auto orbit';};
 $('#labels').onclick=()=>{state.labels=!state.labels;$('#labels').setAttribute('aria-pressed',String(state.labels));updateLabels();};
 $('#search').oninput=renderCatalog;$('#restore-all').onclick=()=>{restore();toast('All components restored.');};
 $('#start').onclick=()=>{
   if(state.running){stopEngine();return;}
   state.running=true;state.paused=false;state.startTime=performance.now();state.startup='prime';state.combustion=false;updateTransport();
   if(state.mode==='solid'){setMode('cutaway');toast('Cutaway enabled to reveal the startup sequence.');}
 };
 $('#pause').onclick=()=>{if(!state.running){state.running=true;state.startup='running';state.paused=false;}else state.paused=!state.paused;updateTransport();};
 $('#step').onclick=()=>{if(state.running)state.paused=true;state.combustion=true;state.angle=mod(state.angle+15,720);updateTransport();updateCycle();};
 $('#rpm').oninput=e=>{state.rpm=Number(e.target.value);$('#rpm-value').textContent=state.rpm.toLocaleString('en-US');rangeFill(e.target);};
 $('#playback').onchange=e=>{state.playback=Number(e.target.value);};
 $('#crank').oninput=e=>{if(state.running)state.paused=true;state.angle=Number(e.target.value);state.combustion=true;updateTransport();updateCycle();};
 $('#explode').oninput=e=>setExplosion(Number(e.target.value));$('#explode').onchange=()=>fitModel();
 $('#explode-all').onclick=()=>{state.teardown=0;state.hidden.clear();state.isolated=null;setExplosion(100,{fit:true});selectPart(state.selected);};
 $('#reassemble').onclick=()=>{restore();toast('Engine reassembled.');};
 $('#teardown-prev').onclick=()=>{state.teardown=Math.max(0,state.teardown-1);state.isolated=null;updateTeardown();refreshEngine();};
 $('#teardown-next').onclick=()=>{state.teardown=Math.min(8,state.teardown+1);state.isolated=null;setExplosion(0);if(state.selected&&model.parts.find(p=>p.id===state.selected).stage<=state.teardown)selectPart(null);updateTeardown();refreshEngine();};
 $('#about-open').onclick=()=>showDialog(aboutHTML);$('#cycle-guide').onclick=()=>showDialog(guideHTML);$('#dialog-close').onclick=()=>$('#info-dialog').close();$('#info-dialog').onclick=e=>{if(e.target===$('#info-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}};
 document.addEventListener('keydown',e=>{if(['INPUT','SELECT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)||$('#info-dialog').open)return;if(e.key==='/'){e.preventDefault();$('#search').focus();}if(e.code==='Space'){e.preventDefault();if(state.running)$('#pause').click();else $('#start').click();}if(e.key==='ArrowRight'){e.preventDefault();$('#step').click();}if(e.key==='Escape'){state.isolated=null;selectPart(null);}});
 $$('input[type=range]').forEach(rangeFill);updateCycle();updateTransport();
}
function init(){
 const wrap=$('#canvas-wrap');
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));renderer.setSize(wrap.clientWidth,wrap.clientHeight);renderer.setClearColor(0x000000,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.localClippingEnabled=true;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.10;wrap.prepend(renderer.domElement);renderer.domElement.setAttribute('aria-label','Interactive 3D Milwaukee-Eight 117 engine. Use the component list and camera buttons for accessible inspection.');renderer.domElement.tabIndex=0;
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(36,wrap.clientWidth/wrap.clientHeight,.05,150);camera.position.set(3.8,4.6,13.5);
 controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,2.65,0);controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=.9;controls.maxDistance=48;controls.maxPolarAngle=Math.PI;controls.autoRotateSpeed=.7;controls.addEventListener('start',()=>{cameraTween=null;$$('[data-camera]').forEach(el=>el.classList.remove('active'));});controls.update();
 scene.add(new THREE.HemisphereLight(0xe5edf3,0x242322,.85));
 const key=new THREE.DirectionalLight(0xfff6eb,3.2);key.position.set(-3.5,8,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.radius=4;Object.assign(key.shadow.camera,{left:-6,right:6,top:8,bottom:-5});key.shadow.normalBias=.025;scene.add(key);
 const fill=new THREE.DirectionalLight(0xd6e8f5,1.15);fill.position.set(5,4,-5);scene.add(fill);const rim=new THREE.DirectionalLight(0xffffff,2.1);rim.position.set(-6,2,-3);scene.add(rim);
 // A small neutral studio reflection environment keeps metal readable from every angle.
 const envScene=new THREE.Scene();envScene.background=new THREE.Color(0x333940);const envBox=new THREE.Mesh(new THREE.BoxGeometry(20,20,20),new THREE.MeshBasicMaterial({color:0x454b50,side:THREE.BackSide}));envScene.add(envBox);
 for(const [pos,scale,color]of [[[0,8,0],[8,.1,8],0xffffff],[[-7,3,3],[.1,6,7],0xe4f0ff],[[7,2,-1],[.1,4,6],0xaab9c6],[[0,1,-8],[6,6,.1],0x919da6]]){const lightPanel=new THREE.Mesh(new THREE.BoxGeometry(...scale),new THREE.MeshBasicMaterial({color}));lightPanel.position.set(...pos);envScene.add(lightPanel);}
 const pmrem=new THREE.PMREMGenerator(renderer);const envTarget=pmrem.fromScene(envScene,.08);scene.environment=envTarget.texture;scene.environmentIntensity=1.0;pmrem.dispose();envScene.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(90,90),new THREE.MeshStandardMaterial({color:0x252c31,roughness:.67,metalness:.12}));ground.rotation.x=-Math.PI/2;ground.position.y=.18;ground.receiveShadow=true;scene.add(ground);
 const grid=new THREE.GridHelper(30,60,0x56616a,0x404a52);grid.position.y=.185;grid.material.transparent=true;grid.material.opacity=.16;scene.add(grid);
 model=buildEngine();scene.add(model.root);
 function addBadge(partName,kind){
   const p=model.byName.get(partName),canvas=document.createElement('canvas');canvas.width=768;canvas.height=kind==='intake'?320:768;const ctx=canvas.getContext('2d');
   ctx.fillStyle='#0b0e10';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.textAlign='center';ctx.textBaseline='middle';
   let geometry,position;
   if(kind==='intake'){
     ctx.strokeStyle='#666a65';ctx.lineWidth=7;ctx.strokeRect(15,15,738,290);ctx.font='italic bold 222px Arial';ctx.lineWidth=3.5;ctx.strokeStyle='#b6b4a8';ctx.strokeText('117',378,169);ctx.fillStyle='#24292b';ctx.fillText('117',378,169);
     geometry=new THREE.PlaneGeometry(.492,.205);position=[0,.02,.435];
   }else{
     ctx.strokeStyle='#7e868a';ctx.lineWidth=3;ctx.beginPath();ctx.arc(384,384,345,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#bbc0be';ctx.font='500 37px Arial';ctx.fillText('MILWAUKEE-EIGHT',384,285);ctx.font='bold 100px Arial';ctx.fillText('V-TWIN',384,401);ctx.font='32px Arial';ctx.fillText('HARLEY-DAVIDSON',384,491);
     geometry=new THREE.CircleGeometry(.319,64);position=[.02,-.015,.204];
   }
   const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
   const mat=new THREE.MeshStandardMaterial({map:texture,roughness:kind==='intake'?.38:.30,metalness:.7});const badge=new THREE.Mesh(geometry,mat);badge.position.set(...position);badge.userData.part=p;p.node.children[0].add(badge);p.materials.push(mat);
 }
 addBadge('Right cam chest cover','cam');addBadge('Heavy Breather air cleaner','intake');

 bindUI();refreshEngine();fitModel(null,1.08);
 const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null;
 function pick(event){const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(model.parts.filter(p=>p.node.visible).map(p=>p.node),true);return hits.find(hit=>{const p=hit.object.userData.part;if(!p)return false;if(state.mode==='cutaway'&&p.external&&p.id!==state.selected&&hit.point.z>0)return false;if(state.mode==='xray'&&p.external&&p.id!==state.selected)return false;return true;})?.object.userData.part;}
 renderer.domElement.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY,button:e.button});
 renderer.domElement.addEventListener('pointerup',e=>{if(down&&down.button===0&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<6){const p=pick(e);selectPart(p?.id??null);}down=null;});
 let lastHover=0;renderer.domElement.addEventListener('pointermove',e=>{if(e.buttons||performance.now()-lastHover<65)return;lastHover=performance.now();const p=pick(e);const el=$('#hover-label'),r=wrap.getBoundingClientRect();el.style.display=p?'block':'none';renderer.domElement.style.cursor=p?'pointer':'grab';if(p){el.textContent=p.name;el.style.left=`${Math.min(Math.max(5,e.clientX-r.left+12),wrap.clientWidth-205)}px`;el.style.top=`${Math.max(55,e.clientY-r.top-33)}px`;}});renderer.domElement.addEventListener('pointerleave',()=>$('#hover-label').style.display='none');
 resizeObserver=new ResizeObserver(()=>{const width=wrap.clientWidth,height=wrap.clientHeight;if(width&&height){camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height);}});resizeObserver.observe(wrap);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(raf);const message=document.createElement('div');message.id='loading';message.textContent='Graphics connection interrupted. Reload this page to restore the engine.';wrap.append(message);});
 $('#loading').remove();let last=performance.now(),lastUI=0,startupElapsed=0,lastStartup='off';
 function frame(now){
   const dt=Math.min((now-last)/1000,.06);last=now;
   if(state.running&&!state.paused){
     if(state.startup==='prime'&&lastStartup!=='prime')startupElapsed=0;
     startupElapsed+=dt;
     const stage=state.startup==='running'?'running':startupElapsed<1.4?'prime':startupElapsed<3.5?'cranking':startupElapsed<4.7?'ignition':startupElapsed<6?'settling':'running';
     if(state.startup!==stage){state.startup=stage;updateTransport();}
     const speed=stage==='prime'?0:stage==='cranking'?220:stage==='ignition'?600:stage==='settling'?850+(1-(startupElapsed-4.7)/1.3)*250:state.rpm;
     state.angle=mod(state.angle+speed*6*state.playback*dt,720);state.combustion=!['prime','cranking'].includes(stage);
   }
   lastStartup=state.startup;
   refreshEngine();
   if(cameraTween){const t=Math.min(1,(now-cameraTween.start)/700),ease=1-(1-t)**3;camera.position.lerpVectors(cameraTween.from,cameraTween.to,ease);controls.target.lerpVectors(cameraTween.fromTarget,cameraTween.target,ease);if(t===1)cameraTween=null;}
   grid.visible=state.mode!=='solid'||state.explode>0||state.teardown>0;controls.update();renderer.render(scene,camera);
   if(now-lastUI>65){updateCycle();positionLabels();lastUI=now;}
   raf=requestAnimationFrame(frame);
 }
 raf=requestAnimationFrame(frame);
 document.addEventListener('visibilitychange',()=>{last=performance.now();});
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);resizeObserver.disconnect();controls.dispose();envTarget.dispose();renderer.dispose();},{once:true});
}
try{init();}catch(error){console.error(error);const loading=$('#loading');if(loading){loading.textContent='The 3D engine could not start. Enable hardware acceleration and WebGL 2 in your browser, then reload.';}toast('3D initialization failed. Try a browser with WebGL 2 enabled.');}
