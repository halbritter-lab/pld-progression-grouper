(function(){"use strict";var e={6761:function(e,o,t){var r=t(9242),n=t(3396),i=t(7139);const a={id:"app",class:"container"},s={key:0,class:"modal"},l={class:"modal-content"},d=(0,n.uE)('<h2>Disclaimer for PLD-Progression Grouper</h2><h3>Important Information for All Users:</h3><p>The &quot;PLD-Progression Grouper&quot; application is intended for informational, educational and research purposes only and should not be used as a substitute for professional medical advice or for direct diagnostic use. The tool is designed to provide insights into Polycystic Liver Disease (PLD) progression but is not meant to replace clinical decision-making or genetic consultation.</p><h3>Usage Guidelines:</h3><ul><li>The information provided by this application is not intended for medical diagnosis or treatment decisions without the oversight of qualified healthcare professionals.</li><li>Users are advised not to base any health-related decisions solely on the results obtained from this application.</li><li>The data and information presented are provided without any warranty of accuracy, completeness, or usefulness. Users should exercise their own judgment in the interpretation and use of the information.</li></ul><h3>Liability and Risk:</h3><p>The application is provided &quot;as is,&quot; without any guarantees or obligations for support, updates, or accuracy. Under no circumstances shall the creators or affiliates of the PLD-Progression Grouper be liable for any direct, indirect, incidental, or consequential damages arising from the use of the application.</p><h3>Contact and Queries:</h3><p>For medical relevance of the application&#39;s content, please consult with a healthcare professional. For inquiries or feedback regarding the application, please contact <a href="mailto:info@pld-progression-grouper.org">info@pld-progression-grouper.org</a>.</p><h3>Acknowledgment and Consent:</h3><p>By using the PLD-Progression Grouper, you acknowledge having read, understood, and agreed to the terms stated in this disclaimer. If you do not agree to these terms, you should not use the application.</p>',11),u={class:"header"},p=(0,n._)("img",{src:"logo.webp",alt:"PLD-Progression Grouper Logo",class:"app-logo"},null,-1),c={class:"app-title"},h={class:"app-version"},g={class:"content"},f={class:"controls"},v={class:"input-group"},m=(0,n._)("label",{for:"idInput"},"ID:",-1),b={class:"input-group"},y=(0,n._)("label",{for:"ageInput"},"Age:",-1),P={class:"input-group"},w=(0,n._)("label",{for:"liverInput"},"Total Liver Volume (TLV) [ml] :",-1),L={class:"input-group output-group"},_=(0,n._)("label",{for:"normalizedTLV"},"Normalized Total Liver Volume (nTLV):",-1),D={class:"output-fields"},C={id:"normalizedTLV",class:"output-field"},k={class:"chart-container"},x={ref:"chartCanvas"},G=(0,n.uE)('<div class="progression-groups"><div class="progression-group PG3"><strong>PG3</strong><br>&gt;6.6%/y </div><div class="progression-group PG2"><strong>PG2</strong><br>3.3-6.6%/y </div><div class="progression-group PG1"><strong>PG1</strong><br>&lt;3.3%/y </div></div><p>For a detailed documentation of this tools and the methodology, please refer to the <a href="https://github.com/halbritter-lab/pld-progression-grouper" target="_blank">GitHub README</a>.</p>',2);function T(e,o,t,T,V,A){return(0,n.wg)(),(0,n.iD)("div",a,[T.showModal?((0,n.wg)(),(0,n.iD)("div",s,[(0,n._)("div",l,[d,(0,n._)("button",{onClick:o[0]||(o[0]=(...e)=>T.closeModal&&T.closeModal(...e))},"I Acknowledge")])])):(0,n.kq)("",!0),(0,n._)("div",u,[p,(0,n._)("h1",c,[(0,n.Uk)("PLD-Progression Grouper "),(0,n._)("span",h,"v"+(0,i.zw)(T.version),1)])]),(0,n._)("div",g,[(0,n._)("div",f,[(0,n._)("div",v,[m,(0,n.wy)((0,n._)("input",{type:"text",id:"idInput","onUpdate:modelValue":o[1]||(o[1]=e=>T.patientId=e),placeholder:"Enter ID"},null,512),[[r.nr,T.patientId]])]),(0,n._)("div",b,[y,(0,n.wy)((0,n._)("input",{type:"number",id:"ageInput","onUpdate:modelValue":o[2]||(o[2]=e=>T.age=e),placeholder:"20-80"},null,512),[[r.nr,T.age]])]),(0,n._)("div",P,[w,(0,n.wy)((0,n._)("input",{type:"number",id:"liverInput","onUpdate:modelValue":o[3]||(o[3]=e=>T.totalLiverVolume=e),placeholder:"0-100"},null,512),[[r.nr,T.totalLiverVolume]])]),(0,n._)("div",L,[_,(0,n._)("div",D,[(0,n._)("output",C,(0,i.zw)(T.formattedNormalizedTLV),1),(0,n._)("output",{id:"progressionGroupOutput",class:(0,i.C_)(`progression-group-output ${T.progressionGroup}`)},(0,i.zw)(T.progressionGroup),3)])]),(0,n._)("button",{onClick:o[4]||(o[4]=(...e)=>T.addDataPoint&&T.addDataPoint(...e))},"Plot Point"),(0,n._)("button",{onClick:o[5]||(o[5]=(...e)=>T.printPage&&T.printPage(...e))},"Print Page"),(0,n._)("button",{onClick:o[6]||(o[6]=(...e)=>T.downloadChart&&T.downloadChart(...e))},"Download Plot")]),(0,n._)("div",k,[(0,n._)("canvas",x,null,512)]),G])])}t(560);var V=t(4870),A=t(9646),I={i8:"0.2.0"};A.kL.register(...A.zX);var z={setup(){const e=I.i8,o=(0,V.iH)(!0),t=()=>{o.value=!1},r=(0,V.iH)(""),i=(0,V.iH)(20),a=(0,V.iH)(0),s=(0,V.iH)(null);let l=null;const d=(0,n.Fl)((()=>a.value/850)),u=(0,n.Fl)((()=>d.value.toFixed(3))),p=(0,n.Fl)((()=>{const e=d.value,o=i.value,t=.2671*Math.exp(.066*o),r=.5169*Math.exp(.033*o);return e>t?"PG3":e>r&&e<=t?"PG2":"PG1"})),c=()=>{const e={x:i.value,y:d.value,id:r.value};l.data.datasets[0].data.push(e),l.update()},h=()=>{l&&l.resize()},g=()=>{const e=s.value.getContext("2d"),o=Array.from({length:61},((e,o)=>{const t=20+o,r=.2671*Math.exp(.066*t);return{x:t,y:r}})),t=Array.from({length:61},((e,o)=>{const t=20+o,r=.5169*Math.exp(.033*t);return{x:t,y:r}}));l=new A.kL(e,{type:"scatter",data:{datasets:[{label:"Age vs Normalized Liver Volume",data:[],backgroundColor:"#180C0C",borderColor:"#180C0C",borderWidth:1,pointRadius:5},{label:"Ceiling",data:Array.from({length:61},((e,o)=>({x:20+o,y:25}))),borderColor:"transparent",borderWidth:0,showLine:!0,pointRadius:0,fill:"+1",backgroundColor:"#B2241C33"},{label:"Trend Line 1",data:o,borderColor:"#B2241C",borderWidth:3,showLine:!0,pointRadius:0,fill:"+1",backgroundColor:"#F64C4633"},{label:"Trend Line 2",data:t,borderColor:"#F64C46",borderWidth:2,showLine:!0,pointRadius:0,fill:"origin",backgroundColor:"#FDA3A133"}]},options:{scales:{x:{title:{display:!0,text:"Age (years)"},type:"linear",min:20,max:80},y:{title:{display:!0,text:"nTLV"},beginAtZero:!0,max:25}},plugins:{legend:{display:!1},tooltip:{callbacks:{beforeBody:e=>{const o=e[0].raw.id;return o?`ID: ${o}`:""}}}}}})},f=()=>{window.print()},v=()=>{const e=document.createElement("a");e.href=s.value.toDataURL("image/png"),e.download="plot.png",e.click()};function m(e,o){let t=document.querySelector(`meta[name="${e}"]`);t?t.setAttribute("content",o):(t=document.createElement("meta"),t.setAttribute("name",e),t.setAttribute("content",o),document.head.appendChild(t))}return(0,n.bv)((()=>{g(),window.addEventListener("resize",h),document.title="PLD-Progression Grouper",m("description","PLD-Progression Grouper is a Vue.js web application, based on extensive research, offering insights into Polycystic Liver Disease (PLD) progression. Developed by Bernt Popp, Ria Schönauer, Dana Sierks, and Jan Halbritter, this tool facilitates understanding of PLD for both educational and research purposes."),m("keywords","PLD, Polycystic Liver Disease, Liver Health, Medical Research, Data Visualization, Vue.js, Web Application, Liver Disease Progression, Medical Education, Healthcare Technology"),m("author","Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter"),m("creator","Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter")})),(0,n.Ah)((()=>{window.removeEventListener("resize",h)})),{version:e,showModal:o,closeModal:t,patientId:r,age:i,totalLiverVolume:a,normalizedTLV:d,formattedNormalizedTLV:u,progressionGroup:p,addDataPoint:c,chartCanvas:s,printPage:f,downloadChart:v}}},M=t(89);const O=(0,M.Z)(z,[["render",T]]);var E=O;(0,r.ri)(E).mount("#app")}},o={};function t(r){var n=o[r];if(void 0!==n)return n.exports;var i=o[r]={exports:{}};return e[r].call(i.exports,i,i.exports,t),i.exports}t.m=e,function(){var e=[];t.O=function(o,r,n,i){if(!r){var a=1/0;for(u=0;u<e.length;u++){r=e[u][0],n=e[u][1],i=e[u][2];for(var s=!0,l=0;l<r.length;l++)(!1&i||a>=i)&&Object.keys(t.O).every((function(e){return t.O[e](r[l])}))?r.splice(l--,1):(s=!1,i<a&&(a=i));if(s){e.splice(u--,1);var d=n();void 0!==d&&(o=d)}}return o}i=i||0;for(var u=e.length;u>0&&e[u-1][2]>i;u--)e[u]=e[u-1];e[u]=[r,n,i]}}(),function(){t.n=function(e){var o=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(o,{a:o}),o}}(),function(){t.d=function(e,o){for(var r in o)t.o(o,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:o[r]})}}(),function(){t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){t.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)}}(),function(){var e={143:0};t.O.j=function(o){return 0===e[o]};var o=function(o,r){var n,i,a=r[0],s=r[1],l=r[2],d=0;if(a.some((function(o){return 0!==e[o]}))){for(n in s)t.o(s,n)&&(t.m[n]=s[n]);if(l)var u=l(t)}for(o&&o(r);d<a.length;d++)i=a[d],t.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return t.O(u)},r=self["webpackChunkpld_progression_grouper_app"]=self["webpackChunkpld_progression_grouper_app"]||[];r.forEach(o.bind(null,0)),r.push=o.bind(null,r.push.bind(r))}();var r=t.O(void 0,[998],(function(){return t(6761)}));r=t.O(r)})();
//# sourceMappingURL=app.1ebe3951.js.map