if(!self.define){let r,e={};const o=(o,s)=>(o=new URL(o+".js",s).href,e[o]||new Promise((e=>{if("document"in self){const r=document.createElement("script");r.src=o,r.onload=e,document.head.appendChild(r)}else r=o,importScripts(o),e()})).then((()=>{let r=e[o];if(!r)throw new Error(`Module ${o} didn’t register its module`);return r})));self.define=(s,i)=>{const p=r||("document"in self?document.currentScript.src:"")||location.href;if(e[p])return;let n={};const l=r=>o(r,p),c={module:{uri:p},exports:n,require:l};e[p]=Promise.all(s.map((r=>c[r]||l(r)))).then((r=>(i(...r),n)))}}define(["./workbox-6567b62a"],(function(r){"use strict";r.setCacheNameDetails({prefix:"pld-progression-grouper-app"}),self.addEventListener("message",(r=>{r.data&&"SKIP_WAITING"===r.data.type&&self.skipWaiting()})),r.precacheAndRoute([{url:"/pld-progression-grouper/CeRKiD_175x130.jpg",revision:"112dcbcebbd3bf33064b7a89f250f5a4"},{url:"/pld-progression-grouper/css/app.4a0a406e.css",revision:null},{url:"/pld-progression-grouper/dfg_logo_schriftzug_schwarz_foerderung_en.gif",revision:"790cfd8fdf8a457af502d2fc2f71e5af"},{url:"/pld-progression-grouper/google3fdf6e14e925e463.html",revision:"f5dbb34de35c0d4c134cb9ffe902e87e"},{url:"/pld-progression-grouper/index.html",revision:"127ffeef4811f0837551f5dbb26c71fb"},{url:"/pld-progression-grouper/js/app.cbb86b4c.js",revision:null},{url:"/pld-progression-grouper/js/chunk-vendors.8ca5fbec.js",revision:null},{url:"/pld-progression-grouper/logo.png",revision:"d134bf0885185dd9263d83d27f9f57da"},{url:"/pld-progression-grouper/logo.svg",revision:"cb9654790196161d942c4a7972612fc5"},{url:"/pld-progression-grouper/logo.webp",revision:"d991ab87e26124a49cb8e071fd34ce8d"},{url:"/pld-progression-grouper/logo_circle.svg",revision:"cb9654790196161d942c4a7972612fc5"},{url:"/pld-progression-grouper/manifest.json",revision:"096bc451e49c208b0578f5fbcfadab53"},{url:"/pld-progression-grouper/pld-app_application-components.png",revision:"c08a219ae5ca690fce0a3b0a68bc57ed"},{url:"/pld-progression-grouper/pld-app_application-components.svg",revision:"f4b6a59d1833b9ec80be3513f0bc58e2"},{url:"/pld-progression-grouper/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"},{url:"/pld-progression-grouper/sitemap.xml",revision:"7149ab23d445041c8bc6bc544e1c9596"}],{})}));
//# sourceMappingURL=service-worker.js.map