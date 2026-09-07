import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';

export const TAU = Math.PI * 2;
export const RAD = Math.PI / 180;
export const CRANK_RADIUS = 0.5715;
export const ROD_LENGTH = 1.8; // Illustrative rod length; bore and stroke use 100 mm/model unit.
export const BORE_RADIUS = 0.5175;
export const STROKES = [
  {name:'Power',color:0xff782f,hex:'#ff782f',text:'Both valves are closed. Expanding combustion gas pushes the piston down and turns the crankshaft.'},
  {name:'Exhaust',color:0xfa7765,hex:'#fa7765',text:'The exhaust valves open. The rising piston pushes spent gas into the exhaust port.'},
  {name:'Intake',color:0x6ccad9,hex:'#6ccad9',text:'The intake valves open. The descending piston draws air and injected fuel into the cylinder.'},
  {name:'Compression',color:0xb4a3f3,hex:'#b4a3f3',text:'Both valves are closed. The rising piston compresses the charge before the next ignition event.'}
];
export const mod = (n,m)=>((n%m)+m)%m;
export function phaseAt(degrees,bank){return mod(degrees-(bank===1?315:0),720);}
export function strokeAt(phase){return STROKES[Math.floor(mod(phase,720)/180)];}
export function liftAt(phase,type){const start=type==='intake'?360:180;const t=(phase-start)/180;return t>0&&t<1?Math.sin(Math.PI*t)**1.5*0.13:0;}
export function crankPin(degrees){const a=(degrees+22.5)*RAD;return new THREE.Vector3(-Math.sin(a)*CRANK_RADIUS,Math.cos(a)*CRANK_RADIUS,0);}
export function pistonHeight(degrees,bank){const pin=crankPin(degrees);const a=(bank===0?22.5:-22.5)*RAD;const parallel=-pin.x*Math.sin(a)+pin.y*Math.cos(a);const perpendicular=pin.x*Math.cos(a)+pin.y*Math.sin(a);return parallel+Math.sqrt(ROD_LENGTH**2-perpendicular**2);}

const info={
  case:['Crankcase','Cast aluminum','Supports the crankshaft bearings and encloses the rotating assembly. The dry-sump system scavenges oil from this space.','Cranktrain & cases'],
  bearing:['Main bearing','Hardened bearing steel','Supports a rotating shaft while controlling radial movement. This representation combines the bearing races and rollers.','Cranktrain & cases'],
  flywheel:['Flywheel','Steel','Stores rotational energy between firing events. The two flywheels support one shared crankpin for both connecting rods.','Cranktrain & cases'],
  shaft:['Mainshaft','Hardened steel','Carries crankshaft rotation through a main bearing. The output side transfers torque into the motorcycle’s primary drive.','Cranktrain & cases'],
  crankpin:['Crankpin','Hardened steel','The shared, offset journal drives both connecting rods. Its offset is half of the 114.3 mm piston stroke.','Cranktrain & cases'],
  rod:['Connecting rod','Forged steel','Links the piston pin to the shared crankpin. Fork-and-blade big ends allow both rods to work on the same crankpin; the big-end shapes here are simplified.','Pistons & rods'],
  piston:['Piston','Aluminum alloy','Receives combustion pressure and transfers it to the connecting rod. The skirt guides it inside the 103.5 mm bore.','Pistons & rods'],
  ring:['Piston ring','Wear-resistant metal','Compression rings seal combustion pressure. The lower oil-control ring meters the oil film on the cylinder wall; its expander is simplified.','Pistons & rods'],
  wrist:['Piston pin','Hardened steel','A hollow pin forms the pivot between the piston and the small end of its connecting rod.','Pistons & rods'],
  clip:['Piston pin retaining clip','Spring steel','Locates the piston pin axially so it cannot move into and score the cylinder wall.','Pistons & rods'],
  cylinder:['Cylinder barrel','Finned aluminum / iron liner','Guides the piston in a 103.5 mm bore. Exterior cooling fins increase the surface area that transfers heat to passing air.','Cylinders & heads'],
  head:['Cylinder head','Cast aluminum','Houses a four-valve combustion chamber, ports, and two spark plugs. Oil cooling helps remove heat from the hottest head regions.','Cylinders & heads'],
  gasket:['Gasket','Illustrative sealing layer','Seals a joint between engine castings. A head gasket must contain combustion pressure and keep oil passages sealed.','Cylinders & heads'],
  stud:['Cylinder stud','High-strength steel','Clamps the cylinder and head stack to the crankcase. Exact fastener lengths, quantities and tightening procedures require the factory manual.','Fasteners & seals'],
  bolt:['Cover bolt','Steel','Clamps a cover to its mating surface. Each displayed fastener is independently selectable; the hardware layout is representative.','Fasteners & seals'],
  cover:['Rocker cover','Cast aluminum','Encloses the upper valve gear and contains lubricating oil. Remove it in the model to reveal the rocker arms.','Valve train'],
  rocker:['Forked rocker arm','Steel','Turns pushrod lift into valve movement. One rocker operates the pair of intake valves or the pair of exhaust valves in a cylinder.','Valve train'],
  rockerShaft:['Rocker shaft','Hardened steel','Provides the pivot axis for a rocker arm. Oil lubricates the rocker’s moving surfaces.','Valve train'],
  pushrod:['Pushrod','Steel','Transfers motion from a hydraulic lifter to a rocker arm. There are two pushrods per cylinder, controlling four valves.','Valve train'],
  tube:['Pushrod cover tube','Metal','Encloses a pushrod, keeps dirt out and provides an oil return enclosure. Shown as a simple outer tube.','Valve train'],
  lifter:['Hydraulic roller lifter','Steel','Follows a cam lobe with a roller and transfers lift to a pushrod. Its hydraulic mechanism maintains valve lash.','Cam & timing'],
  valve:['Poppet valve','Heat-resistant steel','Opens a gas passage in the cylinder head. Each cylinder has two intake and two exhaust valves. Valve angles and port shapes are simplified.','Valve train'],
  spring:['Valve spring','Spring steel','Closes the valve and keeps the valve train in contact with the cam profile. Spring compression follows the animated valve lift.','Valve train'],
  retainer:['Valve spring retainer','Steel','Holds the spring at the valve stem. The small split valve keepers are represented as one component in this model.','Valve train'],
  seal:['Valve stem seal','Illustrative elastomer / metal','Meters oil at the valve guide while limiting oil entry into the combustion chamber.','Fasteners & seals'],
  plug:['Spark plug','Steel / ceramic','Ignites the compressed mixture. Milwaukee-Eight has two spark plugs in each cylinder; both flash together in the educational firing animation.','Intake, exhaust & ignition'],
  cam:['Single camshaft','Hardened steel','Four cam lobes operate four hydraulic lifters. The chain drive turns the camshaft at half crankshaft speed, completing one revolution per 720° cycle.','Cam & timing'],
  plate:['Cam support plate','Aluminum','Supports cam and oil-pump components and routes oil within the cam chest. Internal oil passages are omitted.','Cam & timing'],
  sprocket:['Timing sprocket','Steel','Carries the timing chain. The illustrated crank-to-cam sprocket ratio is 1:2, so valve events repeat every two crank revolutions.','Cam & timing'],
  chain:['Timing chain','Steel links','Synchronizes the single camshaft with the crankshaft. Links are grouped as one service component in the model.','Cam & timing'],
  tensioner:['Timing chain tensioner','Metal / wear-resistant shoe','Maintains chain tension to control timing-chain movement. The hydraulic tensioning mechanism is simplified.','Cam & timing'],
  camcover:['Cam chest cover','Cast aluminum','Encloses the chain-driven single camshaft and timing drive on the right side of the engine.','Cam & timing'],
  balance:['Counterbalancer','Steel','An eccentric rotating mass offsets engine vibration. Softail Milwaukee-Eight engines use two internal counterbalancers; their drive layout here is schematic.','Cranktrain & cases'],
  oilpump:['Oil pump','Aluminum / steel gerotors','Feeds pressurized oil to the engine and scavenges oil back to the reservoir. This is a simplified feed-and-scavenge assembly.','Lubrication & starting'],
  filter:['Oil filter','Steel housing / filter media','Removes particles from circulating engine oil. The filter is shown as a replaceable assembly.','Lubrication & starting'],
  cooler:['Oil cooler','Finned metal','Transfers heat from circulating engine oil to outside air. Shown beside the engine for study; the real cooler is frame-mounted.','Lubrication & starting'],
  line:['Oil line','Reinforced hose','Connects the illustrated cooling circuit. Routing and oil flow are schematic, not a service routing diagram.','Lubrication & starting'],
  intake:['Intake manifold','Metal / composite','Distributes incoming air from the throttle body to the two cylinder heads. Fuel is injected at the intake ports.','Intake, exhaust & ignition'],
  throttle:['Throttle body','Aluminum','Controls airflow into the intake manifold. The motorcycle uses electronic sequential port fuel injection.','Intake, exhaust & ignition'],
  air:['Heavy Breather air cleaner','Filter media / metal','Filters incoming air before it enters the throttle body. This simplified exposed-element assembly represents the 2023 Low Rider ST intake.','Intake, exhaust & ignition'],
  injector:['Fuel injector','Metal / engineered polymer','Meters fuel into an intake port under electronic control. The fuel rail and electrical harness are outside the model.','Intake, exhaust & ignition'],
  exhaust:['Exhaust header','Steel tubing','Carries hot exhaust gas away from a cylinder head. Shortened headers make the engine easier to inspect; mufflers and catalysts are outside the model.','Intake, exhaust & ignition'],
  shield:['Exhaust heat shield','Coated steel','A black outer shield covers the hot exhaust header. It is separately removable in the model. The header lengths and shield details remain simplified.','Intake, exhaust & ignition'],
  elbow:['Heavy Breather intake elbow','Gloss-finished aluminum','Turns the intake path toward the forward-facing exposed air filter. The black elbow and rectangular 117 badge follow the 2023 Low Rider ST appearance.','Intake, exhaust & ignition'],
  starter:['Starter motor','Metal / copper windings','Cranks the engine through the primary drive during starting. The 2023 Low Rider ST specifies a 1.6 kW starter; drive engagement is represented schematically.','Lubrication & starting'],
  stator:['Alternator stator','Laminated steel / copper','Stationary windings generate electrical current as the magnetic rotor turns. The charging system powers the motorcycle and replenishes the battery.','Lubrication & starting'],
  rotor:['Alternator rotor','Steel / magnets','Rotates with the crankshaft around the stationary alternator stator. Magnets and the primary drive are simplified.','Lubrication & starting'],
  sensor:['Crank position sensor','Metal / electronics','Reports crankshaft position to the engine controller for ignition and injection timing. The controller and wiring are outside this model.','Intake, exhaust & ignition'],
};

export function buildEngine(){
 const root=new THREE.Group(),parts=[],effects=[],byName=new Map();
 // Deterministic microstructure: cast-metal grain, without image downloads.
 const grainData=new Uint8Array(128*128*4);let seed=117;
 for(let i=0;i<128*128;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const v=80+((seed>>>24)%142);grainData.set([v,v,v,255],i*4);}
 const grain=new THREE.DataTexture(grainData,128,128);grain.wrapS=grain.wrapT=THREE.RepeatWrapping;grain.repeat.set(5,5);grain.magFilter=THREE.LinearFilter;grain.minFilter=THREE.LinearMipmapLinearFilter;grain.generateMipmaps=true;grain.needsUpdate=true;
 const steel=new THREE.MeshPhysicalMaterial({color:0xd0d5d8,metalness:1,roughness:.16,clearcoat:.25,clearcoatRoughness:.18});
 const alloy=new THREE.MeshStandardMaterial({color:0x939b9f,metalness:.92,roughness:.31});
 const dark=new THREE.MeshStandardMaterial({color:0x1b1c1d,metalness:.43,roughness:.64,bumpMap:grain,bumpScale:.014});
 const black=new THREE.MeshPhysicalMaterial({color:0x101215,metalness:.35,roughness:.2,clearcoat:.8,clearcoatRoughness:.14});
 const exhaustBlack=new THREE.MeshStandardMaterial({color:0x151719,metalness:.53,roughness:.45,bumpMap:grain,bumpScale:.003});
 const filterMedia=new THREE.MeshStandardMaterial({color:0x25282a,metalness:.18,roughness:.84,bumpMap:grain,bumpScale:.017});
 const meshWire=new THREE.MeshStandardMaterial({color:0x41474a,metalness:.88,roughness:.39});
 const copper=new THREE.MeshStandardMaterial({color:0xad7444,metalness:.78,roughness:.3});
 const ceramic=new THREE.MeshStandardMaterial({color:0xe1e3d5,metalness:.04,roughness:.24});
 const red=new THREE.MeshStandardMaterial({color:0x842d21,metalness:.15,roughness:.65});
 const orange=new THREE.MeshStandardMaterial({color:0xf39043,metalness:.55,roughness:.3});
 const Y=new THREE.Vector3(0,1,0),Z=new THREE.Vector3(0,0,1),origin=new THREE.Vector3(0,1.3,0);
 const quatZ=a=>new THREE.Quaternion().setFromAxisAngle(Z,a);
 const cylinder=(r,h,mat,r2=r,segments=40)=>new THREE.Mesh(new THREE.CylinderGeometry(r,r2,h,segments),mat);
 const box=(w,h,d,mat,r=.05)=>new THREE.Mesh(new RoundedBoxGeometry(w,h,d,2,r),mat);
 const torus=(r,t,mat)=>new THREE.Mesh(new THREE.TorusGeometry(r,t,8,48),mat);
 function tube(outer,inner,h,mat){const s=new THREE.Shape();s.absarc(0,0,outer,0,TAU,false);const hole=new THREE.Path();hole.absarc(0,0,inner,0,TAU,true);s.holes.push(hole);const geo=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,curveSegments:32});geo.translate(0,0,-h/2);const m=new THREE.Mesh(geo,mat);m.rotation.x=-Math.PI/2;return m;}
 function at(mesh,x,y,z){mesh.position.set(x,y,z);return mesh;}
 function axialZ(mesh){mesh.rotation.x=['ExtrudeGeometry','TorusGeometry'].includes(mesh.geometry.type)?0:Math.PI/2;return mesh;}
 function pipe(points,r,mat){return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(v=>new THREE.Vector3(...v))),48,r,12,false),mat);}
 function roundedShape(w,d,r){const s=new THREE.Shape(),x=-w/2,y=-d/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+d-r);s.quadraticCurveTo(x+w,y+d,x+w-r,y+d);s.lineTo(x+r,y+d);s.quadraticCurveTo(x,y+d,x,y+d-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}
 function castProfile(shape,depth,mat,bevel=.035){const geo=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:bevel>0,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:16});geo.translate(0,0,-depth/2);return new THREE.Mesh(geo,mat);}
 function fin(w,d,h,mat,bore=true){const shape=roundedShape(w,d,.27);if(bore){const hole=new THREE.Path();hole.absarc(0,0,BORE_RADIUS,0,TAU,true);shape.holes.push(hole);}const m=castProfile(shape,h,mat,.004);m.rotation.x=-Math.PI/2;return m;}
 function contour(points,depth,mat,bevel=.045){const s=new THREE.Shape();s.moveTo(...points[0]);for(let i=1;i<points.length;i++)s.lineTo(...points[i]);s.closePath();return castProfile(s,depth,mat,bevel);}
 function group(...children){const g=new THREE.Group();if(children.length)g.add(...children);return g;}
 function part(name,kind,node,pos,explode,stage=5,options={}){
   const baseInfo=info[kind];const g=new THREE.Group();g.add(node);g.position.copy(pos instanceof THREE.Vector3?pos:new THREE.Vector3(...pos));root.add(g);
   const p={id:`P${String(parts.length+1).padStart(3,'0')}`,name,kind,category:baseInfo[3],material:baseInfo[1],description:baseInfo[2],type:baseInfo[0],node:g,base:g.position.clone(),explode:new THREE.Vector3(...explode),stage,external:false,importance:0,...options};
   p.materials=[];const map=new Map();g.traverse(o=>{if(!o.isMesh)return;const original=o.material;if(!map.has(original)){const m=original.clone();map.set(original,m);p.materials.push(m);}o.material=map.get(original);o.castShadow=true;o.receiveShadow=true;o.userData.part=p;});
   parts.push(p);byName.set(name,p);return p;
 }
 function bankPos(bank,x,y,z){return new THREE.Vector3(x,y,z).applyQuaternion(quatZ((bank===0?22.5:-22.5)*RAD)).add(origin);}
 function bankPart(bank,label,kind,node,local,exp,stage,opts={}){const p=part(`${bank===0?'Front':'Rear'} ${label}`,kind,node,bankPos(bank,...local),exp,stage,{bank,...opts});p.node.quaternion.copy(quatZ((bank===0?22.5:-22.5)*RAD));p.baseQ=p.node.quaternion.clone();return p;}
 function bankExplode(bank,y,z=0,x=0){return [(bank===0?-1:1)*(y*.5+.25)+x,y,z];}
 function shell(){
   const s=new THREE.Shape();s.moveTo(-.98,-.46);s.bezierCurveTo(-1.13,.10,-.96,.79,-.48,.97);s.lineTo(.44,.97);s.bezierCurveTo(.83,.95,1.0,.60,1.07,.18);s.lineTo(1.28,-.27);s.quadraticCurveTo(1.26,-.74,.81,-.88);s.lineTo(-.54,-.91);s.quadraticCurveTo(-.94,-.88,-.98,-.46);
   const g=group(castProfile(s,.47,dark,.075),at(axialZ(cylinder(.52,.05,dark)),0,-.05,.265),at(box(1.30,.22,.58,dark,.075),0,-.91,0));
   for(let i=0;i<4;i++){const rib=box(.055,.49,.09,dark,.022);rib.position.set(-.62+i*.34,-.52,.28);rib.rotation.z=-.18;g.add(rib);}return g;
 }
 part('Right crankcase half','case',shell(),[0,1.3,.54],[0,-.55,2.7],8,{external:true,importance:8});
 const leftShell=shell();leftShell.rotation.y=Math.PI;
 part('Left crankcase half','case',leftShell,[0,1.3,-.54],[0,-.55,-2.7],8,{external:true,importance:5});
 for(const side of [-1,1]){
   const name=side===1?'Right':'Left';
   part(`${name} main bearing`,'bearing',axialZ(tube(.34,.2,.16,steel)),[0,1.3,side*.64],[0,-.3,side*3.1],8);
   const fw=group(axialZ(cylinder(.87,.24,alloy)),at(axialZ(cylinder(.28,.05,steel)),0,0,side*.14));
   for(let j=0;j<5;j++){const a=j*TAU/5;fw.add(at(axialZ(cylinder(.12,.02,dark)),Math.sin(a)*.55,Math.cos(a)*.55,side*.132));}
   part(`${name} flywheel`,'flywheel',fw,[0,1.3,side*.32],[side*.45,-.4,side*1.35],9,{spin:true,importance:7});
   part(`${name} crankshaft mainshaft`,'shaft',axialZ(cylinder(.19,.78,steel)),[0,1.3,side*.82],[0,-.4,side*2.15],9,{spin:true});
 }
 part('Shared crankpin','crankpin',axialZ(cylinder(.15,.78,steel)),[0,1.3,0],[0,-.4,0],9,{animate:(deg,p)=>p.node.position.copy(crankPin(deg).add(origin)),importance:7});
 for(let b=0;b<2;b++){
   const side=b===0?-1:1;
   const rod=group(tube(.23,.15,.13,steel),at(box(.18,ROD_LENGTH-.35,.13,steel,.04),0,ROD_LENGTH/2,0),at(tube(.16,.09,.16,steel),0,ROD_LENGTH,0));
   // Ring geometries start with vertical bores; orient them across the crankshaft.
   rod.children[0].rotation.x=0;rod.children[2].rotation.x=0;
   if(b===0){rod.add(at(box(.1,.46,.14,steel),.22,.18,.1),at(box(.1,.46,.14,steel),-.22,.18,-.1));}
   part(`${b===0?'Front fork':'Rear blade'} connecting rod`,'rod',rod,[0,1.3,0],bankExplode(b,1.15,b===0?.65:-.65),6,{bank:b,importance:9,animate:(deg,p)=>{const pin=crankPin(deg).add(origin);const top=bankPos(b,0,pistonHeight(deg,b),0);p.node.position.copy(pin);p.node.quaternion.setFromUnitVectors(Y,top.sub(pin).normalize());}});
   const piston=group(cylinder(.5,.4,alloy),at(cylinder(.505,.055,steel),0,.215,0),at(axialZ(cylinder(.095,1.01,dark)),0,-.03,0));
   const pistonMotion=(offset=0)=>(deg,p)=>p.node.position.copy(bankPos(b,0,pistonHeight(deg,b)+offset,0));
   bankPart(b,'piston','piston',piston,[0,2.2,0],bankExplode(b,1.6,.1),6,{animate:pistonMotion(),importance:10});
   for(let r=0;r<3;r++)bankPart(b,r===2?'oil-control ring':`compression ring ${r+1}`,'ring',tube(.514,.482,r===2?.045:.025,r===2?copper:steel),[0,2.2,0],bankExplode(b,1.95+r*.19,.12+r*.15),6,{animate:pistonMotion(.12-r*.065)});
   bankPart(b,'piston pin','wrist',axialZ(tube(.093,.055,.98,steel)),[0,2.2,0],bankExplode(b,1.45,-.7),6,{animate:pistonMotion(-.03)});
   for(let s=0;s<2;s++){const clip=torus(.096,.012,dark);const p=bankPart(b,`piston pin clip ${s+1}`,'clip',clip,[0,2.2,(s===0?-1:1)*.49],bankExplode(b,1.6,(s===0?-1:1)*1.15),6,{animate:(deg,p)=>p.node.position.copy(bankPos(b,0,pistonHeight(deg,b)-.03,(s===0?-1:1)*.49))});}
   const barrel=group(tube(.57,BORE_RADIUS,1.45,dark));
   for(let f=0;f<15;f++){
     const y=-.69+f*.098,scale=1-.026*Math.cos(f/14*Math.PI);
     barrel.add(at(fin(1.37*scale,1.32*scale,.037,alloy),0,y,0));
     barrel.add(at(fin(1.357*scale,1.307*scale,.034,dark),0,y+.012,0));
   }
   bankPart(b,'cylinder barrel','cylinder',barrel,[0,1.92,0],bankExplode(b,2.7,0),5,{external:true,importance:10});
   bankPart(b,'base gasket','gasket',tube(.635,.52,.018,copper),[0,1.17,0],bankExplode(b,2.3,0),5,{external:true});
   bankPart(b,'head gasket','gasket',tube(.68,.515,.019,copper),[0,2.67,0],bankExplode(b,3.1,0),4,{external:true});
   const head=group(box(1.30,.44,1.27,dark,.13));
   for(let f=0;f<5;f++){const w=1.41+f*.014,d=1.31+f*.014;head.add(at(fin(w,d,.025,alloy,false),0,-.18+f*.089,0));head.add(at(fin(w-.014,d-.014,.026,dark,false),0,-.17+f*.089,0));}
   for(const s of [-1,1])head.add(at(axialZ(tube(.21,.155,.14,alloy)),0,0,s*.71));
   bankPart(b,'cylinder head','head',head,[0,2.91,0],bankExplode(b,3.5,0),4,{external:true,importance:10});
   bankPart(b,'rocker cover gasket','gasket',box(1.36,.025,1.22,copper,.15),[0,3.36,0],bankExplode(b,4.5,0),2,{external:true});
   const lid=contour([[-.64,-.5],[-.48,-.64],[.47,-.64],[.64,-.45],[.62,.39],[.39,.59],[-.4,.59],[-.65,.4]],.20,dark,.065);lid.rotation.x=-Math.PI/2;lid.position.y=.105;
   const cover=group(at(box(1.36,.09,1.27,black,.10),0,-.09,0),lid);
   for(const z of [-.655,.63])cover.add(at(box(.95,.025,.018,alloy,.005),0,-.09,z));
   bankPart(b,'rocker cover','cover',cover,[0,3.6,0],bankExplode(b,5,0),2,{external:true,importance:10});
   for(let n=0;n<4;n++){
     const x=(n%2===0?-1:1)*.5,z=(n<2?-1:1)*.44;
     const bolt=group(cylinder(.063,.08,steel,.063,6),at(cylinder(.033,.16,alloy),0,-.1,0));
     bankPart(b,`rocker cover bolt ${n+1}`,'bolt',bolt,[x,3.905,z],bankExplode(b,5.3+n*.15,z*1.15,x*.6),2,{external:true});
     bankPart(b,`cylinder stud ${n+1}`,'stud',group(cylinder(.031,1.94,alloy),at(cylinder(.066,.08,steel,.066,6),0,.98,0)),[x,2.13,z],bankExplode(b,3.3+n*.12,z*.7,x*.7),4);
   }
   for(let t=0;t<2;t++){
     const type=t===0?'intake':'exhaust',px=t===0?-.34:.34;
     const color=t===0?alloy:steel;
     for(let v=0;v<2;v++){
       const vz=(v===0?-.24:.24);
       const valve=group(cylinder(.037,.51,steel),at(cylinder(t===0?.155:.139,.041,color),0,-.27,0));
       bankPart(b,`${type} valve ${v+1}`,'valve',valve,[px,3.01,vz],bankExplode(b,3.75, vz*3,px*1.3),4,{animate:(deg,p)=>p.node.position.copy(bankPos(b,px,3.01-liftAt(phaseAt(deg,b),type),vz)),importance:4});
       const springPoints=[];for(let i=0;i<=96;i++){const a=i/96*TAU*6;springPoints.push([Math.cos(a)*.092,i/96*.28,Math.sin(a)*.092]);}
       bankPart(b,`${type} valve spring ${v+1}`,'spring',pipe(springPoints,.015,steel),[px,3.06,vz],bankExplode(b,4.05,vz*3.8,px*1.8),4,{animate:(deg,p)=>{p.node.scale.y=1-liftAt(phaseAt(deg,b),type)/.32;}});
       bankPart(b,`${type} spring retainer ${v+1}`,'retainer',cylinder(.118,.035,alloy),[px,3.345,vz],bankExplode(b,4.25,vz*4.3,px*2.1),4,{animate:(deg,p)=>p.node.position.copy(bankPos(b,px,3.345-liftAt(phaseAt(deg,b),type),vz))});
       bankPart(b,`${type} valve stem seal ${v+1}`,'seal',tube(.063,.038,.055,red),[px,3.065,vz],bankExplode(b,3.7,vz*4,px*2.4),4);
     }
     // A forked rocker operates both valves on this side of the chamber.
     const rocker=group(box(.12,.11,.91,alloy),at(box(.42,.095,.13,steel),px<0?.14:-.14,0,-.23),at(box(.42,.095,.13,steel),px<0?.14:-.14,0,.23),at(axialZ(cylinder(.105,.49,alloy)),0,0,0));
     bankPart(b,`${type} rocker arm`,'rocker',rocker,[px,3.43,.08],bankExplode(b,4.35,t===0?1:-1),3,{animate:(deg,p)=>{p.node.quaternion.copy(p.baseQ).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),-liftAt(phaseAt(deg,b),type)*1.5));},importance:7});
     bankPart(b,`${type} rocker shaft`,'rockerShaft',axialZ(cylinder(.057,.66,steel)),[px,3.43,.08],bankExplode(b,4.3,t===0?1.5:-1.5),3);
     const pushY=2.02;
     const pushX=(b===0?.38:-.38)+(t===0?-.105:.105),pushZ=.69+t*.13;
     bankPart(b,`${type} pushrod`,'pushrod',cylinder(.029,2.77,steel),[pushX,pushY,pushZ],bankExplode(b,1.8,1.7+t*.4),3,{animate:(deg,p)=>p.node.position.copy(bankPos(b,pushX,pushY+liftAt(phaseAt(deg,b),type),pushZ)),importance:6});
     const pushTube=group(cylinder(.060,1.1,steel),at(cylinder(.077,1.1,steel),0,-.6,0),at(cylinder(.097,.12,steel),0,1.07,0),at(cylinder(.11,.13,steel),0,-1.14,0),at(cylinder(.081,.032,black),0,-.015,0));
     pushTube.add(at(cylinder(.061,.54,steel),0,.82,0));
     bankPart(b,`${type} pushrod tube`,'tube',pushTube,[pushX,pushY,pushZ],bankExplode(b,1.8,2.4+t*.35),3,{external:true});
     bankPart(b,`${type} hydraulic lifter`,'lifter',group(cylinder(.11,.28,steel),at(axialZ(cylinder(.08,.17,alloy)),0,-.13,0)),[pushX,.58,pushZ],bankExplode(b,.5,2+t*.35),7,{animate:(deg,p)=>p.node.position.copy(bankPos(b,pushX,.58+liftAt(phaseAt(deg,b),type),pushZ))});
   }
   for(let s=0;s<2;s++){
     const plug=group(cylinder(.075,.16,steel,.075,6),at(cylinder(.047,.17,ceramic),0,.15,0),at(cylinder(.035,.08,steel),0,.27,0),at(cylinder(.028,.11,steel),0,-.115,0));
     const p=bankPart(b,`spark plug ${s+1}`,'plug',plug,[(s===0?-.1:.1),3.11,(s===0?-.47:.47)],bankExplode(b,3.85,(s===0?-1:1)*1.9),1,{importance:s===1?6:0});
     const flash=new THREE.Mesh(new THREE.SphereGeometry(.095,12,8),new THREE.MeshBasicMaterial({color:0xffe6a5,transparent:true,opacity:.9,depthWrite:false}));flash.position.y=-.15;flash.userData.effect=true;p.node.add(flash);effects.push({type:'spark',bank:b,node:flash});
   }
   const gas=new THREE.Mesh(new THREE.CylinderGeometry(.489,.489,1,32),new THREE.MeshBasicMaterial({color:0xff782f,transparent:true,opacity:.22,side:THREE.DoubleSide,depthWrite:false}));root.add(gas);gas.quaternion.copy(quatZ((b===0?22.5:-22.5)*RAD));effects.push({type:'gas',bank:b,node:gas});
   // Short gas paths aid reading without pretending to model full fluid dynamics.
   for(const type of ['intake','exhaust']){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.055,10,8),new THREE.MeshBasicMaterial({color:type==='intake'?0x6ccad9:0xfa7765}));root.add(mesh);effects.push({type:'flow',path:type,bank:b,node:mesh});}
   const ep=bankPos(b,side*.47,2.9,.45);
   const exhaustPath=b===0?[ep.toArray(),[-1.95,3.5,.72],[-2.0,2.8,.94],[-1.95,1.36,1.1],[-1.55,.64,1.16],[-.55,.46,1.19],[1.35,.46,1.19],[2.45,.46,1.19]]:[ep.toArray(),[1.91,3.34,.75],[2.02,2.91,.95],[2.08,2.1,1.03],[2.23,1.17,1.14],[2.66,.96,1.18]];
   const rel=exhaustPath.map(v=>new THREE.Vector3(...v).sub(ep).toArray());
   part(`${b===0?'Front':'Rear'} exhaust header`,'exhaust',pipe(rel,.145,alloy),ep,[side*2.4,.4,-2.1],1,{external:true,bank:b,importance:5});
   part(`${b===0?'Front':'Rear'} exhaust heat shield`,'shield',pipe(rel,.181,exhaustBlack),ep,[side*2.6,.3,2.2],1,{external:true,bank:b,importance:4});
   bankPart(b,'fuel injector','injector',group(cylinder(.06,.3,black),at(cylinder(.075,.08,orange),0,.1,0)),[-side*.4,2.85,.46],bankExplode(b,2.4,2.6),1);
 }
 // Cam chest: all timing parts rotate about the z axis, with an explicit 2:1 ratio.
 part('Cam support plate','plate',box(1.9,1.39,.12,alloy,.27),[.1,1.4,.99],[.2,-.45,3.2],7,{external:true,importance:4});
 const cam=group(axialZ(cylinder(.075,.83,steel)));
 for(let i=0;i<4;i++){const lobe=axialZ(cylinder(.17,.10,alloy));lobe.position.set(Math.sin(i*Math.PI/2)*.055,Math.cos(i*Math.PI/2)*.055,-.3+i*.2);cam.add(lobe);}
 part('Single four-lobe camshaft','cam',cam,[.69,1.4,.91],[1.9,.1,2.5],7,{camSpin:true,importance:10});
 function sprocket(radius,teeth,mat){const g=group(axialZ(tube(radius,radius*.43,.06,mat)));for(let i=0;i<teeth;i++){const a=i/teeth*TAU;const tooth=box(.059,.063,.08,mat,.007);tooth.position.set(Math.sin(a)*(radius+.018),Math.cos(a)*(radius+.018),0);tooth.rotation.z=-a;g.add(tooth);}g.add(at(axialZ(cylinder(radius*.23,.08,steel)),0,0,0));return g;}
 part('Crank timing sprocket','sprocket',sprocket(.175,16,steel),[0,1.3,1.27],[0,-.4,3.95],7,{spin:true,importance:5});
 part('Cam timing sprocket','sprocket',sprocket(.35,32,alloy),[.69,1.4,1.27],[1.7,0,3.95],7,{camSpin:true,importance:6});
 const chainPoints=[];for(let i=0;i<72;i++){const a=i/72*TAU;chainPoints.push(new THREE.Vector3(.34+Math.cos(a)*.78,1.36+Math.sin(a)*.43,1.30));}
 const chainPath=new THREE.CatmullRomCurve3(chainPoints,true),chain=group();
 for(let i=0;i<56;i++){const point=chainPath.getPoint(i/56);const link=box(.09,.055,.08,steel,.014);link.position.copy(point);const tangent=chainPath.getTangent(i/56);link.rotation.z=Math.atan2(tangent.y,tangent.x);chain.add(link);}
 part('Cam drive timing chain','chain',chain,[0,0,0],[.4,-.5,4.3],7,{chainPath,importance:6,animate:(deg,p)=>{p.node.children[0].children.forEach((link,i)=>{const t=mod(i/56+deg/360*.08,1),pos=chainPath.getPoint(t),tan=chainPath.getTangent(t);link.position.copy(pos);link.rotation.z=Math.atan2(tan.y,tan.x);});}});
 part('Timing chain tensioner','tensioner',group(box(.3,.16,.17,dark),at(box(.37,.045,.16,copper),0,.1,0)),[.39,.9,1.3],[.7,-1,3.7],7);
 part('Feed and scavenge oil pump','oilpump',group(axialZ(cylinder(.29,.2,alloy)),at(axialZ(tube(.21,.13,.23,copper)),0,0,.1)),[-.28,1.02,.86],[-1.65,-.5,2.7],7,{importance:6});
 const camShape=new THREE.Shape();camShape.moveTo(-.81,-.35);camShape.bezierCurveTo(-1.05,.12,-.75,.54,-.39,.62);camShape.lineTo(.36,.61);camShape.quadraticCurveTo(.78,.52,.9,.18);camShape.lineTo(.74,-.4);camShape.quadraticCurveTo(.13,-.7,-.49,-.57);camShape.quadraticCurveTo(-.7,-.53,-.81,-.35);
 const camCover=group(castProfile(camShape,.21,dark,.065),at(axialZ(cylinder(.37,.055,black)),.02,-.015,.161),at(axialZ(torus(.354,.022,steel)),.02,-.015,.195));
 part('Right cam chest cover','camcover',camCover,[.12,1.4,1.55],[.2,-.3,5],1,{external:true,importance:9});
 for(let n=0;n<8;n++){const a=n/8*TAU;part(`Cam cover bolt ${n+1}`,'bolt',axialZ(cylinder(.044,.065,steel,.044,6)),[.12+Math.cos(a)*.81,1.4+Math.sin(a)*.52,1.72],[Math.cos(a)*.4,-.3+Math.sin(a)*.4,5.35],1,{external:true});}
 for(let i=0;i<2;i++){
   const x=i===0?-1:1;const balance=group(axialZ(cylinder(.16,.65,steel)),at(axialZ(cylinder(.25,.36,alloy)),.14,0,0));
   part(`${i===0?'Front':'Rear'} counterbalancer`,'balance',balance,[x*.82,.8,-.03],[x*2,-.65,-.5],8,{balanceSpin:true,importance:5});
 }
 const intake=group(pipe([[-1,0,0],[-.55,-.04,.2],[0,-.22,.42],[.55,-.04,.2],[1,0,0]],.16,alloy));
 part('Y-shaped intake manifold','intake',intake,[0,3.74,.54],[0,2.1,2.8],1,{external:true,importance:7});
 part('Electronic throttle body','throttle',group(axialZ(tube(.24,.18,.43,alloy)),at(box(.15,.3,.2,black),.28,0,0)),[0,3.54,1.12],[0,2.1,3.6],1,{external:true,importance:6});
 part('Heavy Breather intake elbow','elbow',group(pipe([[0,0,0],[0,.1,.22],[.13,.25,.38],[-.01,.32,.49],[-.28,.32,.49]],.23,black),at(axialZ(torus(.235,.025,steel)),0,0,0)),[0,3.54,1.1],[.6,2.2,3.9],1,{external:true,importance:7});
 const filterCore=group(cylinder(.42,.75,filterMedia,.32),at(cylinder(.439,.06,black),0,.39,0),at(cylinder(.343,.06,black),0,-.39,0));
 for(let i=0;i<48;i++){const a=i/48*TAU,r1=.324,r2=.424;filterCore.add(pipe([[Math.sin(a)*r1,-.36,Math.cos(a)*r1],[Math.sin(a)*r2,.36,Math.cos(a)*r2]],.0065,meshWire));}
 for(let i=0;i<18;i++){const y=-.35+i*.041,r=.324+(y+.36)/.72*.1;const ring=torus(r,.0045,meshWire);ring.rotation.x=Math.PI/2;ring.position.y=y;filterCore.add(ring);}
 filterCore.rotation.z=Math.PI/2;
 const airFilter=group(filterCore,at(box(.64,.32,.045,black,.022),0,.02,.396),at(box(.52,.235,.016,alloy,.017),0,.02,.423));
 part('Heavy Breather air cleaner','air',airFilter,[-.62,3.86,1.59],[-1.1,2,4.55],1,{external:true,importance:10});
 part('Spin-on oil filter','filter',group(axialZ(cylinder(.27,.52,black)),at(axialZ(torus(.247,.009,steel)),0,0,.265)),[-1.04,.91,.72],[-2.65,-.25,1.8],1,{external:true,importance:5});
 const cooler=group(box(.56,1.0,.21,black,.045));for(let i=0;i<15;i++)cooler.add(at(box(.59,.025,.24,alloy,.01),0,-.46+i*.064,0));
 part('Frame-mounted oil cooler','cooler',cooler,[-1.69,.88,-.24],[-2.5,-.2,-1.6],1,{external:true,importance:4});
 for(let i=0;i<2;i++)part(`Oil cooler ${i===0?'feed':'return'} hose`,'line',pipe([[-1.53,.44+i*.75,-.22],[-1.35,.34+i*.7,.15],[-1.12,.48+i*.42,.43],[-.84,.65+i*.36,.45]],.039,black),[0,0,0],[-2,-.5,-1.2-i*.3],1,{external:true});
 const starter=group(axialZ(cylinder(.27,.8,black)),at(axialZ(cylinder(.2,.15,alloy)),0,0,-.46),at(axialZ(cylinder(.11,.22,alloy)),0,.3,0));
 part('Electric starter motor','starter',starter,[1.45,1.16,-.39],[2.2,-.2,-1.9],1,{external:true,importance:4});
 const stator=group(axialZ(tube(.57,.31,.15,alloy)));for(let i=0;i<18;i++){const a=i/18*TAU;stator.add(at(axialZ(cylinder(.075,.19,copper)),Math.sin(a)*.44,Math.cos(a)*.44,0));}
 part('Alternator stator','stator',stator,[0,1.3,-.95],[0,-.4,-3.6],8,{importance:5});
 part('Alternator magnetic rotor','rotor',group(axialZ(cylinder(.6,.10,dark)),at(axialZ(torus(.58,.045,steel)),0,0,.06)),[0,1.3,-1.13],[0,-.4,-4.1],8,{external:true,spin:true});
 part('Crankshaft position sensor','sensor',group(cylinder(.06,.18,black),at(box(.15,.09,.1,black),0,.11,0)),[-.77,1.97,.59],[-2.3,1.2,2.5],1,{external:true});
 for(let n=0;n<9;n++){const a=n/9*TAU;part(`Crankcase perimeter bolt ${n+1}`,'bolt',axialZ(cylinder(.049,.07,steel,.049,6)),[Math.cos(a)*.94,1.3+Math.sin(a)*.94,.8],[Math.cos(a)*.6,-.5+Math.sin(a)*.5,3.35],8,{external:true});}
 root.updateMatrixWorld(true);
 return {root,parts,effects,byName,bankPos,origin};
}

export function updateEngine(model,degrees,{explode=0,teardown=0,hidden=new Set(),isolated=null,mode='solid',selected=null,combustion=false}={}){
 const plane=new THREE.Plane(new THREE.Vector3(0,0,-1),0);
 for(const p of model.parts){
   p.node.position.copy(p.base);p.node.scale.set(1,1,1);
   if(p.spin)p.node.rotation.z=-degrees*RAD;
   if(p.camSpin)p.node.rotation.z=-degrees*RAD*.5;
   if(p.balanceSpin)p.node.rotation.z=degrees*RAD;
   if(p.animate)p.animate(degrees,p);
   p.node.position.addScaledVector(p.explode,explode);
   p.node.visible=!hidden.has(p.id)&&p.stage>teardown&&(!isolated||isolated===p.id);
   const isSelected=selected===p.id;
   for(const m of p.materials){
     const opacity=mode==='xray'&&p.external&&!isSelected?.10:1;
     if(m.opacity!==opacity){m.opacity=opacity;m.transparent=opacity<1;m.depthWrite=opacity===1;m.needsUpdate=true;}
     const clipped=mode==='cutaway'&&p.external&&!isSelected;
     if(!!m.clippingPlanes?.length!==clipped){m.clippingPlanes=clipped?[plane]:null;m.needsUpdate=true;}
     m.emissive?.setHex(isSelected?0x8a340b:0x000000);if(m.emissive)m.emissiveIntensity=isSelected?.65:0;
   }
 }
 for(const e of model.effects){
   const phase=phaseAt(degrees,e.bank),s=strokeAt(phase),h=pistonHeight(degrees,e.bank);
   const show=combustion&&explode<.025&&teardown===0&&!isolated;
   if(e.type==='gas'){
     const top=2.66,bottom=h+.247,height=Math.max(.012,top-bottom);
     e.node.position.copy(model.bankPos(e.bank,0,bottom+height/2,0));e.node.scale.y=height;e.node.material.color.setHex(s.color);e.node.visible=show&&mode!=='solid';
   }else if(e.type==='spark'){e.node.visible=show&&phase<16;e.node.scale.setScalar(1-phase/30);}
   else if(e.type==='flow'){
     const active=e.path==='intake'?phase>=360&&phase<540:phase>=180&&phase<360;
     const t=mod(phase,180)/180;const direction=e.path==='intake'?1-t:t;
     e.node.position.copy(model.bankPos(e.bank,(e.path==='intake'?-.18:.18),2.69+direction*.24,direction*.9));e.node.visible=show&&mode!=='solid'&&active;
   }
 }
 model.root.updateMatrixWorld(true);
}
