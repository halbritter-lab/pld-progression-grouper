if(!self.define){let r,e={};const o=(o,s)=>(o=new URL(o+".js",s).href,e[o]||new Promise((e=>{if("document"in self){const r=document.createElement("script");r.src=o,r.onload=e,document.head.appendChild(r)}else r=o,importScripts(o),e()})).then((()=>{let r=e[o];if(!r)throw new Error(`Module ${o} didn’t register its module`);return r})));self.define=(s,i)=>{const p=r||("document"in self?document.currentScript.src:"")||location.href;if(e[p])return;let d={};const l=r=>o(r,p),n={module:{uri:p},exports:d,require:l};e[p]=Promise.all(s.map((r=>n[r]||l(r)))).then((r=>(i(...r),d)))}}define(["./workbox-6567b62a"],(function(r){"use strict";r.setCacheNameDetails({prefix:"pld-progression-grouper-app"}),self.addEventListener("message",(r=>{r.data&&"SKIP_WAITING"===r.data.type&&self.skipWaiting()})),r.precacheAndRoute([{url:"/pld-progression-grouper/CeRKiD_175x130.jpg",revision:"112dcbcebbd3bf33064b7a89f250f5a4"},{url:"/pld-progression-grouper/README.md",revision:"37a9e803d75d9466ffeed45aab7821b8"},{url:"/pld-progression-grouper/_old/logo.png",revision:"d134bf0885185dd9263d83d27f9f57da"},{url:"/pld-progression-grouper/_old/logo.svg",revision:"cb9654790196161d942c4a7972612fc5"},{url:"/pld-progression-grouper/_old/logo.webp",revision:"d991ab87e26124a49cb8e071fd34ce8d"},{url:"/pld-progression-grouper/_old/logo_circle.svg",revision:"cb9654790196161d942c4a7972612fc5"},{url:"/pld-progression-grouper/css/app.ea18b4ae.css",revision:null},{url:"/pld-progression-grouper/dfg_logo_schriftzug_schwarz_foerderung_en.gif",revision:"790cfd8fdf8a457af502d2fc2f71e5af"},{url:"/pld-progression-grouper/google3fdf6e14e925e463.html",revision:"f5dbb34de35c0d4c134cb9ffe902e87e"},{url:"/pld-progression-grouper/index.html",revision:"aebf262494c755db546db067298dd849"},{url:"/pld-progression-grouper/js/app.16fbdb54.js",revision:null},{url:"/pld-progression-grouper/js/chunk-vendors.8ca5fbec.js",revision:null},{url:"/pld-progression-grouper/logo.png",revision:"616d869fa12f0ddc28a52642aeb2a844"},{url:"/pld-progression-grouper/logo.webp",revision:"1dd8823f17a98e6ecb452f120b33961f"},{url:"/pld-progression-grouper/logo_v2.svg",revision:"c42d9eae8353370866e6100eec0fc2db"},{url:"/pld-progression-grouper/manifest.json",revision:"096bc451e49c208b0578f5fbcfadab53"},{url:"/pld-progression-grouper/pld-app_application-components.png",revision:"c08a219ae5ca690fce0a3b0a68bc57ed"},{url:"/pld-progression-grouper/pld-app_application-components.svg",revision:"f4b6a59d1833b9ec80be3513f0bc58e2"},{url:"/pld-progression-grouper/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"},{url:"/pld-progression-grouper/sitemap.xml",revision:"7149ab23d445041c8bc6bc544e1c9596"}],{})}));
//# sourceMappingURL=service-worker.js.map
