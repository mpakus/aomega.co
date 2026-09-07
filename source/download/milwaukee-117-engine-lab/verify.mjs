import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

registerHooks({resolve(specifier,context,next){if(specifier==='three')return {url:new URL('./vendor/three.module.js',import.meta.url).href,shortCircuit:true};return next(specifier,context);}});
const THREE=await import('three');
const {buildEngine,updateEngine,pistonHeight,crankPin,phaseAt,liftAt,ROD_LENGTH,CRANK_RADIUS}=await import('./engine.js');
const model=buildEngine();
assert.equal(new Set(model.parts.map(p=>p.id)).size,model.parts.length);
assert.equal(new Set(model.parts.map(p=>p.name)).size,model.parts.length);
for(const [kind,count]of [['valve',8],['plug',4],['cam',1],['balance',2],['piston',2],['rod',2],['pushrod',4],['lifter',4],['spring',8]])assert.equal(model.parts.filter(p=>p.kind===kind).length,count,kind);
for(const p of model.parts){assert.ok(p.description&&p.material&&p.category&&p.name);p.node.traverse(o=>{if(o.isMesh&&!o.userData.effect){assert.equal(o.userData.part.id,p.id);assert.ok(o.geometry.attributes.position.count>0);}});}
for(let bank=0;bank<2;bank++){
 const heights=[];
 for(let angle=0;angle<=720;angle++){
   const height=pistonHeight(angle,bank),pin=crankPin(angle).add(model.origin),piston=model.bankPos(bank,0,height,0);
   assert.ok(Math.abs(pin.distanceTo(piston)-ROD_LENGTH)<1e-10,'Connecting rod must retain its length');
   heights.push(height);
   const phase=phaseAt(angle,bank);
   if(phase<180||phase>=540){assert.equal(liftAt(phase,'intake'),0);assert.equal(liftAt(phase,'exhaust'),0);}
 }
 assert.ok(Math.abs(Math.max(...heights)-Math.min(...heights)-1.143)<1e-10,'Measured stroke must be 114.3 mm');
 assert.ok(Math.abs(pistonHeight(bank===0?0:315,bank)-(ROD_LENGTH+CRANK_RADIUS))<1e-10,'Each firing must occur at its piston TDC');
}
assert.equal(phaseAt(0,0),0);assert.equal(phaseAt(315,1),0);assert.equal(phaseAt(720,0),0);
for(const mode of ['solid','xray','cutaway'])for(const explode of [0,.5,1])for(const angle of [0,90,180,270,315,360,450,540,630,720]){
 updateEngine(model,angle,{mode,explode,combustion:true});
 for(const p of model.parts)assert.ok(p.node.matrixWorld.elements.every(Number.isFinite),`Finite transform: ${p.name}`);
}
const sample=model.byName.get('Front piston');
updateEngine(model,45,{isolated:sample.id});assert.equal(model.parts.filter(p=>p.node.visible).length,1);
updateEngine(model,45,{hidden:new Set([sample.id])});assert.ok(!sample.node.visible);
updateEngine(model,45,{teardown:8});assert.ok(model.parts.filter(p=>p.node.visible).every(p=>p.stage===9));
updateEngine(model,0,{});assert.ok(model.parts.every(p=>p.node.visible));
const bounds=new THREE.Box3().setFromObject(model.root);
assert.ok(bounds.min.toArray().every(Number.isFinite)&&bounds.max.toArray().every(Number.isFinite));

// Check every local module edge and entrypoint without launching a browser.
const visited=new Set();
function inspectFile(url){if(visited.has(url.href))return;visited.add(url.href);assert.ok(existsSync(fileURLToPath(url)));const text=readFileSync(url,'utf8');for(const match of text.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)){const spec=match[1];if(spec==='three')inspectFile(new URL('./vendor/three.module.js',import.meta.url));else if(spec.startsWith('.'))inspectFile(new URL(spec,url));}}
inspectFile(new URL('./app.js',import.meta.url));
const html=readFileSync(new URL('./index.html',import.meta.url),'utf8');
for(const m of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g))assert.ok(existsSync(new URL(m[1],new URL('./index.html',import.meta.url))),m[1]);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
const stats={parts:model.parts.length,categories:new Set(model.parts.map(p=>p.category)).size,meshes:0,triangles:0};model.root.traverse(o=>{if(o.isMesh){stats.meshes++;stats.triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;}});
console.log(JSON.stringify({verified:true,...stats,checks:['114.3 mm stroke','constant rod length at all 721 crank angles','315° / 405° firing TDCs','eight-valve / four-plug architecture','all components annotated','90 animation and display combinations','hide / isolate / teardown / restore','all module imports and static entrypoints']},null,2));
