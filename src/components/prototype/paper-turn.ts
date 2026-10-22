// Disposable motion study: a continuously bending sheet with real printed faces.
import * as THREE from 'three';
const imageData=new Map<string,string>();
const pageTextures=new Map<string,HTMLCanvasElement>();
const renderers=new WeakMap<HTMLElement,THREE.WebGLRenderer>();
const gpuTextures=new Map<HTMLCanvasElement,THREE.CanvasTexture>();
const leases=new WeakMap<THREE.WebGLRenderer,symbol>();
export function releasePaperRenderer(host:HTMLElement){
 const renderer=renderers.get(host);if(!renderer)return;
 renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();renderers.delete(host);
 for(const texture of gpuTextures.values())texture.dispose();gpuTextures.clear();pageTextures.clear();
}
const printProperties=`display position top right bottom left z-index box-sizing width height min-width min-height max-width max-height aspect-ratio overflow overflow-x overflow-y opacity visibility color background background-color background-image background-size background-position background-repeat background-blend-mode border border-top border-right border-bottom border-left border-radius box-shadow padding margin gap row-gap column-gap flex flex-direction flex-wrap flex-grow flex-shrink flex-basis align-items align-self align-content justify-content justify-items justify-self grid-template-columns grid-template-rows grid-column grid-row order font font-family font-size font-style font-weight font-stretch line-height letter-spacing word-spacing text-align text-transform text-decoration text-shadow text-overflow white-space word-break overflow-wrap writing-mode transform transform-origin filter mix-blend-mode object-fit object-position vertical-align list-style column-count column-gap`.split(' ');
async function printedPage(element:HTMLElement){
 const width=element.offsetWidth,height=element.offsetHeight;
 const theme=element.closest('.magazine-app')!;
 const themeKey=[...theme.classList].filter(c=>c.startsWith('variant-')||c.startsWith('lamp-')).join(' ');
 const key=`${element.textContent}|${element.className.replace(/sheet-(front|back)/g,'')}|${themeKey}|${width}x${height}`;
 if(pageTextures.has(key)){const cached=pageTextures.get(key)!;pageTextures.delete(key);pageTextures.set(key,cached);return cached;}
 await Promise.all([...element.querySelectorAll('img')].map(i=>i.decode().catch(()=>{})));
 const clone=element.cloneNode(true) as HTMLElement;
 const originals=[element,...element.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
 for(let i=0;i<originals.length;i++){
  if(!element.isConnected)throw new DOMException('Page replaced','AbortError');
  const original=originals[i];
  const copy=copies[i] as HTMLElement,computed=getComputedStyle(original);
  for(const property of printProperties)copy.style.setProperty(property,computed.getPropertyValue(property));
  copy.style.animation='none';copy.style.transition='none';
  copy.removeAttribute('inert');copy.removeAttribute('aria-hidden');
  for(const pseudo of ['::before','::after']){
   const style=getComputedStyle(original,pseudo);
   if(style.content==='none'||style.content==='normal'||style.display==='none')continue;
   const layer=document.createElement('span');
   for(const property of printProperties)layer.style.setProperty(property,style.getPropertyValue(property));
   layer.textContent=style.content.replace(/^['"]|['"]$/g,'');
   if(pseudo==='::before')copy.prepend(layer);else copy.append(layer);
  }
  if(original instanceof HTMLImageElement){
   const url=original.currentSrc||original.src;
   if(!imageData.has(url)){
    const c=document.createElement('canvas'),scale=Math.min(1,1500/Math.max(original.naturalWidth,original.naturalHeight));
    c.width=original.naturalWidth*scale;c.height=original.naturalHeight*scale;c.getContext('2d')!.drawImage(original,0,0,c.width,c.height);
    const blob=await new Promise<Blob>((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(new Error('Image encoding failed')),'image/webp',.9));
    const data=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result as string);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(blob)});
    imageData.set(url,data);
   }
   (copy as HTMLImageElement).src=imageData.get(url)!;copy.removeAttribute('srcset');copy.removeAttribute('loading');
  }
  if(i%8===7)await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
 }
 if(!element.isConnected)throw new DOMException('Page replaced','AbortError');
 Object.assign(clone.style,{position:'relative',inset:'auto',width:`${width}px`,height:`${height}px`,transform:'none',visibility:'visible',opacity:'1',margin:'0',contain:'none'});
 const markup=new XMLSerializer().serializeToString(clone);
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%">${markup}</foreignObject></svg>`;
 const image=new Image();image.src=`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;await image.decode();
 const canvas=document.createElement('canvas'),scale=Math.min(window.devicePixelRatio||1,1.35,Math.sqrt(1400000/(width*height)));
 canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);canvas.getContext('2d')!.drawImage(image,0,0,canvas.width,canvas.height);
 if(pageTextures.size>=12){const oldest=pageTextures.keys().next().value!;const canvas=pageTextures.get(oldest)!;gpuTextures.get(canvas)?.dispose();gpuTextures.delete(canvas);pageTextures.delete(oldest);}
 pageTextures.set(key,canvas);return canvas;
}
export type PaperScene={paint:(progress:number,corner?:number)=>void;dispose:()=>void};
export async function createPaperScene(host:HTMLElement,front:HTMLElement,back:HTMLElement,direction:number,isCurrent:()=>boolean=()=>true):Promise<PaperScene>{
 const preparedAt=performance.now();
 const [frontPrint,backPrint]=await Promise.all([printedPage(front),printedPage(back)]);
 if(!isCurrent())throw new DOMException('Turn cancelled','AbortError');
 const w=front.offsetWidth,h=front.offsetHeight,cw=w*3.4,ch=h*1.8;
 let renderer=renderers.get(host);
 if(!renderer){
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderers.set(host,renderer);host.appendChild(renderer.domElement);
 }
 const pixelRatio=Math.min(window.devicePixelRatio||1,1.4,Math.sqrt(1800000/(cw*ch)));
 renderer.setPixelRatio(pixelRatio);renderer.setSize(cw,ch);renderer.domElement.style.visibility='hidden';
 const lease=Symbol();leases.set(renderer,lease);
 host.dataset.renderPixels=String(Math.round(cw*ch*pixelRatio*pixelRatio));
 renderer.domElement.className='paper-webgl';renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(24,cw/ch,1,5000);camera.position.z=ch/(2*Math.tan(THREE.MathUtils.degToRad(12)));
 const dark=!!host.closest('.lamp-off');
 const light=new THREE.DirectionalLight(dark?0xb8d4e0:0xffead1,dark?.55:1.55);light.position.set(dark?w*1.1:-w*.15,h*1.25,w*3);light.castShadow=true;
 Object.assign(light.shadow.camera,{left:-w*2,right:w*2,top:h*1.3,bottom:-h*1.3,near:1,far:w*7});light.shadow.mapSize.set(1024,1024);light.shadow.bias=-.00015;light.shadow.normalBias=.4;light.shadow.radius=5;light.shadow.blurSamples=1;
 scene.add(light,new THREE.AmbientLight(dark?0xb8d2d2:0xffffff,dark?1.35:1.8));
 const receiver=new THREE.Mesh(new THREE.PlaneGeometry(w*3.3,h*1.75),new THREE.ShadowMaterial({opacity:.25,depthWrite:false}));receiver.position.z=-.7;receiver.receiveShadow=true;scene.add(receiver);
 const textures=[frontPrint,backPrint].map(c=>{if(gpuTextures.has(c))return gpuTextures.get(c)!;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());gpuTextures.set(c,t);return t});
 const cols=48,rows=12,geometry=new THREE.PlaneGeometry(w,h,cols,rows),backGeometry=geometry.clone();
 [geometry,backGeometry].forEach((g,face)=>{
  const uv=g.attributes.uv;for(let i=0;i<uv.count;i++){const s=uv.getX(i);uv.setX(i,(direction>0)!==!!face?s:1-s)}uv.needsUpdate=true;
  if(direction<0){const idx=g.index!;for(let i=0;i<idx.count;i+=3){const b=idx.getX(i+1);idx.setX(i+1,idx.getX(i+2));idx.setX(i+2,b)}}
 });
 (geometry.attributes.position as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
 (geometry.attributes.normal as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
 backGeometry.setAttribute('position',geometry.attributes.position);
 backGeometry.setAttribute('normal',geometry.attributes.normal);
 const materials=textures.map((map,i)=>{
  const cover=(i===0?front:back).classList.contains('closed-cover');
  return new THREE.MeshPhysicalMaterial({map,side:i===0?THREE.FrontSide:THREE.BackSide,roughness:cover ? 0.46 : 0.94,clearcoat:cover ? 0.72 : 0,clearcoatRoughness:.24,metalness:0,color:0xffffff,polygonOffset:true,polygonOffsetFactor:i===0?-1:1});
 });
 materials.forEach((material,i)=>{material.onBeforeCompile=shader=>{
  shader.uniforms.reversePrint={value:textures[1-i]};shader.fragmentShader='uniform sampler2D reversePrint;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
   float fibre=fract(sin(dot(vMapUv*vec2(1200.,1600.),vec2(12.9898,78.233)))*43758.5453);
   float bleed=dot(texture2D(reversePrint,vec2(1.-vMapUv.x,vMapUv.y)).rgb,vec3(.3333));
   diffuseColor.rgb*=(0.997+fibre*0.006)*mix(1.,0.97+bleed*0.03,0.45);`);
 }});
 const face=new THREE.Mesh(geometry,materials[0]),reverse=new THREE.Mesh(backGeometry,materials[1]);face.castShadow=true;reverse.castShadow=true;face.frustumCulled=false;reverse.frustumCulled=false;scene.add(face,reverse);
 function paint(raw:number,corner=.5){
  const p=Math.max(0,Math.min(1,raw)),lift=Math.sin(Math.PI*p),flutter=Math.min(.025,Math.max(0,raw-1))*7,positions=geometry.attributes.position as THREE.BufferAttribute;
  for(let row=0;row<=rows;row++){const v=row/rows;let x=0,z=0;for(let col=0;col<=cols;col++){
   const s=col/cols,angle=Math.PI*p+lift*(1.6*(s-.32)+(v-.5)*corner*.8*s)-flutter*s;
   if(col){x+=Math.cos(angle)*w/cols;z+=Math.sin(angle)*w/cols}
   const ripple=lift*Math.sin(s*Math.PI)*(v-.5)*corner*5;
   positions.setXYZ(row*(cols+1)+col,x*direction,h*(.5-v)+ripple,Math.max(.15,z));
  }}
  positions.needsUpdate=true;geometry.computeVertexNormals();receiver.material.opacity=.12+.2*lift;light.shadow.radius=2+16*lift;renderer!.render(scene,camera);
 }
 await renderer.compileAsync(scene,camera);
 if(leases.get(renderer)===lease&&isCurrent()){paint(0);renderer.domElement.style.visibility='visible';host.dataset.prepareMs=(performance.now()-preparedAt).toFixed(1);}
 return {paint,dispose(){geometry.dispose();backGeometry.dispose();materials.forEach(m=>m.dispose());receiver.geometry.dispose();receiver.material.dispose();light.shadow.dispose();if(leases.get(renderer!)===lease){renderer!.domElement.style.visibility='hidden';renderer!.renderLists.dispose()}}};
}
