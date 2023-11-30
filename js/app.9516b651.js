(function(){"use strict";var e={8343:function(e,t,o){var a=o(9242),n=o(3396),r=o(7139);const i={id:"app",class:"container"},l={key:0,class:"modal"},s={class:"modal-content"},u=(0,n.uE)('<h2>Disclaimer for PLD-Progression Grouper</h2><h3>Important Information for All Users:</h3><p>The &quot;PLD-Progression Grouper&quot; application is intended for informational, educational and research purposes only and should not be used as a substitute for professional medical advice or for direct diagnostic use. The tool is designed to provide insights into Polycystic Liver Disease (PLD) progression but is not meant to replace clinical decision-making or genetic consultation.</p><h3>Usage Guidelines:</h3><ul><li>The information provided by this application is not intended for medical diagnosis or treatment decisions without the oversight of qualified healthcare professionals.</li><li>Users are advised not to base any health-related decisions solely on the results obtained from this application.</li><li>The data and information presented are provided without any warranty of accuracy, completeness, or usefulness. Users should exercise their own judgment in the interpretation and use of the information.</li></ul><h3>Liability and Risk:</h3><p>The application is provided &quot;as is,&quot; without any guarantees or obligations for support, updates, or accuracy. Under no circumstances shall the creators or affiliates of the PLD-Progression Grouper be liable for any direct, indirect, incidental, or consequential damages arising from the use of the application.</p><h3>Contact and Queries:</h3><p>For medical relevance of the application&#39;s content, please consult with a healthcare professional. For inquiries or feedback regarding the application, please contact <a href="mailto:info@pld-progression-grouper.org">info@pld-progression-grouper.org</a>.</p><h3>Acknowledgment and Consent:</h3><p>By using the PLD-Progression Grouper, you acknowledge having read, understood, and agreed to the terms stated in this disclaimer. If you do not agree to these terms, you should not use the application.</p>',11),d={class:"header"},p=(0,n._)("img",{src:"logo.webp",alt:"PLD-Progression Grouper Logo",class:"app-logo"},null,-1),c={class:"app-title"},g={class:"app-version"},h={class:"content"},v={key:0,class:"id-warning-message"},f={class:"controls"},m={class:"input-group"},b=(0,n._)("label",{for:"idInput"},"ID:",-1),_={class:"input-group"},w=(0,n._)("label",{for:"ageInput"},"Age [y]:",-1),y={class:"input-group"},P=(0,n._)("label",{for:"liverInput"},"Total Liver Volume (TLV) [ml] :",-1),k={class:"input-group output-group"},D=(0,n._)("label",{for:"normalizedTLV"},"Normalized Total Liver Volume (nTLV):",-1),L={class:"output-fields"},C={id:"normalizedTLV",class:"output-field"},x={class:"chart-container"},G={ref:"chartCanvas"},A=(0,n._)("div",{class:"progression-groups"},[(0,n._)("div",{class:"progression-group PG3"},[(0,n._)("strong",null,"PG3"),(0,n._)("br"),(0,n.Uk)(">6.6%/y ")]),(0,n._)("div",{class:"progression-group PG2"},[(0,n._)("strong",null,"PG2"),(0,n._)("br"),(0,n.Uk)("3.3-6.6%/y ")]),(0,n._)("div",{class:"progression-group PG1"},[(0,n._)("strong",null,"PG1"),(0,n._)("br"),(0,n.Uk)("<3.3%/y ")])],-1),z={key:1,class:"data-points-table-container"},I={class:"data-points-table"},R=(0,n._)("thead",null,[(0,n._)("tr",null,[(0,n._)("th",null,"ID"),(0,n._)("th",null,"Age [y]"),(0,n._)("th",null,"TLV [ml]"),(0,n._)("th",null,"nTLV"),(0,n._)("th",null,"PG"),(0,n._)("th",null,"LGR [%/y]"),(0,n._)("th",null,"Remove")])],-1),T=(0,n._)("p",null,[(0,n.Uk)(" For a detailed documentation of this tool and the methodology, please refer to the "),(0,n._)("a",{href:"https://github.com/halbritter-lab/pld-progression-grouper",target:"_blank"},"GitHub README"),(0,n.Uk)(". ")],-1),F=(0,n._)("p",null,[(0,n.Uk)(" Please cite the following publication for this tool: "),(0,n._)("a",{href:"https://pubmed.ncbi.nlm.nih.gov/36246085/",target:"_blank"}," Sierks D, et al. Modelling polycystic liver disease progression using age-adjusted liver volumes and targeted mutational analysis. JHEP Rep. 2022. "),(0,n.Uk)(),(0,n._)("br"),(0,n.Uk)(" A new manuscript reporting the application of this method in autosomal dominant polycystic liver disease is currently under review. A link will be provided here upon publication. ")],-1),V=(0,n.uE)('<footer class="footer"><a href="https://nephrologie-intensivmedizin.charite.de/fuer_patienten/cerkid//" target="_blank"><img src="CeRKiD_175x130.jpg" alt="CeRKiD Logo" class="institution-logo"></a><a href="https://www.dfg.de/en/" target="_blank"><img src="dfg_logo_schriftzug_schwarz_foerderung_en.gif" alt="DFG Logo" class="funder-logo"></a></footer>',1);function E(e,t,o,E,H,U){return(0,n.wg)(),(0,n.iD)("div",i,[E.showModal?((0,n.wg)(),(0,n.iD)("div",l,[(0,n._)("div",s,[u,(0,n._)("button",{onClick:t[0]||(t[0]=(...e)=>E.closeModal&&E.closeModal(...e))}," I Acknowledge ")])])):(0,n.kq)("",!0),(0,n._)("div",d,[p,(0,n._)("h1",c,[(0,n.Uk)(" PLD-Progression Grouper "),(0,n._)("span",g,"v"+(0,r.zw)(E.version)+"-"+(0,r.zw)(E.lastCommitHash),1)])]),(0,n._)("div",h,[E.idWarningMessage?((0,n.wg)(),(0,n.iD)("div",v,(0,r.zw)(E.idWarningMessage),1)):(0,n.kq)("",!0),(0,n._)("div",f,[(0,n._)("div",m,[b,(0,n.wy)((0,n._)("input",{id:"idInput","onUpdate:modelValue":t[1]||(t[1]=e=>E.patientId=e),type:"text",placeholder:"Enter ID"},null,512),[[a.nr,E.patientId]])]),(0,n._)("div",_,[w,(0,n.wy)((0,n._)("input",{id:"ageInput","onUpdate:modelValue":t[2]||(t[2]=e=>E.age=e),type:"number",placeholder:"20-80"},null,512),[[a.nr,E.age]])]),(0,n._)("div",y,[P,(0,n.wy)((0,n._)("input",{id:"liverInput","onUpdate:modelValue":t[3]||(t[3]=e=>E.totalLiverVolume=e),type:"number",placeholder:"0-100"},null,512),[[a.nr,E.totalLiverVolume]])]),(0,n._)("div",k,[D,(0,n._)("div",L,[(0,n._)("output",C,(0,r.zw)(E.formattedNormalizedTLV),1),(0,n._)("output",{id:"progressionGroupOutput",class:(0,r.C_)(`progression-group-output ${E.progressionGroup}`)},(0,r.zw)(E.progressionGroup),3),(0,n._)("output",{id:"liverGrowthRateOutput",class:(0,r.C_)(`progression-group-output ${E.progressionGroup}`)},(0,r.zw)(null!==E.liverGrowthRate?E.liverGrowthRate.toFixed(2)+" %/y (LGR)":""),3)])]),(0,n._)("button",{onClick:t[4]||(t[4]=(...e)=>E.addDataPoint&&E.addDataPoint(...e))}," Plot Point "),(0,n._)("button",{onClick:t[5]||(t[5]=(...e)=>E.printPage&&E.printPage(...e))}," Print Page "),(0,n._)("button",{onClick:t[6]||(t[6]=(...e)=>E.downloadChart&&E.downloadChart(...e))}," Download Plot "),(0,n._)("button",{onClick:t[7]||(t[7]=(...e)=>E.saveDataAsJson&&E.saveDataAsJson(...e))}," Save (JSON) "),(0,n._)("input",{ref:"fileInput",type:"file",style:{display:"none"},onChange:t[8]||(t[8]=(...e)=>E.loadDataFromJson&&E.loadDataFromJson(...e))},null,544),(0,n._)("button",{onClick:t[9]||(t[9]=(...e)=>E.triggerFileInput&&E.triggerFileInput(...e))}," Load (JSON) "),(0,n._)("button",{onClick:t[10]||(t[10]=(...e)=>E.downloadDataAsExcel&&E.downloadDataAsExcel(...e))}," Download (Excel) ")]),(0,n._)("div",x,[(0,n._)("canvas",G,null,512)]),A,E.dataPoints.length>0?((0,n.wg)(),(0,n.iD)("div",z,[(0,n._)("table",I,[R,(0,n._)("tbody",null,[((0,n.wg)(!0),(0,n.iD)(n.HY,null,(0,n.Ko)(E.dataPoints,(o=>((0,n.wg)(),(0,n.iD)("tr",{key:o.id},[(0,n._)("td",null,(0,r.zw)(o.id),1),(0,n._)("td",null,(0,r.zw)(o.age),1),(0,n._)("td",null,(0,r.zw)(o.tlv),1),(0,n._)("td",null,(0,r.zw)(o.ntlv),1),(0,n._)("td",null,(0,r.zw)(o.pg),1),(0,n._)("td",null,(0,r.zw)(o.lgr),1),(0,n._)("td",null,[(0,n._)("button",{onClick:t[11]||(t[11]=t=>E.removeDataPoint(e.index))}," - ")])])))),128))])])])):(0,n.kq)("",!0),T,F]),V])}o(560);var H=o(4870),U=o(9646),M=o(7092),O={i8:"0.4.0"};U.kL.register(...U.zX);var j={setup(){const e=O.i8,t=(0,H.iH)(""),o=async()=>{try{const e=await fetch("https://api.github.com/repos/halbritter-lab/pld-progression-grouper/commits?per_page=1"),o=await e.json();o.length&&(t.value=o[0].sha.substring(0,7))}catch(e){console.error("Error fetching last commit:",e)}},a=(0,H.iH)(""),r=(0,H.iH)(!0),i=()=>{r.value=!1},l=(0,H.iH)(""),s=(0,H.iH)(20),u=(0,H.iH)(0),d=(0,H.iH)(null);let p=null;const c=(0,n.Fl)((()=>u.value/850)),g=(0,n.Fl)((()=>c.value.toFixed(3))),h=(0,n.Fl)((()=>{const e=c.value,t=s.value,o=.2671*Math.exp(.066*t),a=.5169*Math.exp(.033*t);return e>o?"PG3":e>a&&e<=o?"PG2":"PG1"})),v=(0,n.Fl)((()=>s.value&&c.value&&s.value>20?100*Math.log(c.value)/(s.value-20):null)),f=(0,H.iH)([]),m=()=>{if(!l.value.trim())return void(a.value="Please enter an ID before plotting a point.");const e={id:l.value,age:s.value,tlv:u.value,ntlv:g.value,pg:h.value,lgr:null!==v.value?v.value.toFixed(2):"N/A"};f.value.push(e),p.data.datasets[0].data.push({x:e.age,y:c.value}),p.update(),a.value=""},b=e=>{f.value.splice(e,1),p&&p.data.datasets.length>0&&(p.data.datasets[0].data.splice(e,1),p.update())},_=()=>{p&&p.resize()},w=()=>{const e=d.value.getContext("2d"),t=Array.from({length:61},((e,t)=>{const o=20+t,a=.2671*Math.exp(.066*o);return{x:o,y:a}})),o=Array.from({length:61},((e,t)=>{const o=20+t,a=.5169*Math.exp(.033*o);return{x:o,y:a}}));p=new U.kL(e,{type:"scatter",data:{datasets:[{label:"Age vs Normalized Liver Volume",data:[],backgroundColor:"#180C0C",borderColor:"#180C0C",borderWidth:1,pointRadius:5},{label:"Ceiling",data:Array.from({length:61},((e,t)=>({x:20+t,y:25}))),borderColor:"transparent",borderWidth:0,showLine:!0,pointRadius:0,fill:"+1",backgroundColor:"#B2241C33"},{label:"Trend Line 1",data:t,borderColor:"#B2241C",borderWidth:3,showLine:!0,pointRadius:0,fill:"+1",backgroundColor:"#F64C4633"},{label:"Trend Line 2",data:o,borderColor:"#F64C46",borderWidth:2,showLine:!0,pointRadius:0,fill:"origin",backgroundColor:"#FDA3A133"}]},options:{scales:{x:{title:{display:!0,text:"Age (years)"},type:"linear",min:20,max:80},y:{title:{display:!0,text:"nTLV"},beginAtZero:!0,max:25}},plugins:{legend:{display:!1},tooltip:{callbacks:{beforeBody:e=>{const t=e[0].raw.id;return t?`ID: ${t}`:""}}}}}})},y=()=>{window.print()},P=()=>{const e=document.createElement("a");e.href=d.value.toDataURL("image/png"),e.download="plot.png",e.click()},k=()=>{const e=JSON.stringify(f.value),t="data:application/json;charset=utf-8,"+encodeURIComponent(e),o="data.json",a=document.createElement("a");a.setAttribute("href",t),a.setAttribute("download",o),a.click()},D=(0,H.iH)(null),L=()=>{D.value&&D.value.click()},C=async e=>{const t=e.target.files[0];if(!t)return;const o=new FileReader;o.onload=e=>{const t=JSON.parse(e.target.result);f.value.push(...t),t.forEach((e=>{p.data.datasets[0].data.push({x:e.age,y:e.ntlv})})),p.update()},o.readAsText(t)};function x(e,t){let o=document.querySelector(`meta[name="${e}"]`);o?o.setAttribute("content",t):(o=document.createElement("meta"),o.setAttribute("name",e),o.setAttribute("content",t),document.head.appendChild(o))}const G=()=>{const e=M.P6.book_new(),t=M.P6.json_to_sheet(f.value);M.P6.book_append_sheet(e,t,"Data"),M.NC(e,"Data.xlsx")};return(0,n.bv)((()=>{o(),document.title="PLD-Progression Grouper",x("description","PLD-Progression Grouper is a Vue.js web application, based on extensive research, offering insights into Polycystic Liver Disease (PLD) progression. Developed by Bernt Popp, Ria Schönauer, Dana Sierks, and Jan Halbritter, this tool facilitates understanding of PLD for both educational and research purposes."),x("keywords","PLD, Polycystic Liver Disease, Liver Health, Medical Research, Data Visualization, Vue.js, Web Application, Liver Disease Progression, Medical Education, Healthcare Technology"),x("author","Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter"),x("creator","Bernt Popp, Ria Schönauer, Dana Sierks, Jan Halbritter"),w(),window.addEventListener("resize",_)})),(0,n.Ah)((()=>{window.removeEventListener("resize",_)})),{version:e,lastCommitHash:t,idWarningMessage:a,showModal:r,closeModal:i,dataPoints:f,patientId:l,age:s,totalLiverVolume:u,normalizedTLV:c,formattedNormalizedTLV:g,progressionGroup:h,liverGrowthRate:v,addDataPoint:m,removeDataPoint:b,chartCanvas:d,printPage:y,downloadChart:P,fileInput:D,triggerFileInput:L,saveDataAsJson:k,loadDataFromJson:C,downloadDataAsExcel:G}}},J=o(89);const S=(0,J.Z)(j,[["render",E]]);var q=S;(0,a.ri)(q).mount("#app")}},t={};function o(a){var n=t[a];if(void 0!==n)return n.exports;var r=t[a]={exports:{}};return e[a].call(r.exports,r,r.exports,o),r.exports}o.m=e,function(){var e=[];o.O=function(t,a,n,r){if(!a){var i=1/0;for(d=0;d<e.length;d++){a=e[d][0],n=e[d][1],r=e[d][2];for(var l=!0,s=0;s<a.length;s++)(!1&r||i>=r)&&Object.keys(o.O).every((function(e){return o.O[e](a[s])}))?a.splice(s--,1):(l=!1,r<i&&(i=r));if(l){e.splice(d--,1);var u=n();void 0!==u&&(t=u)}}return t}r=r||0;for(var d=e.length;d>0&&e[d-1][2]>r;d--)e[d]=e[d-1];e[d]=[a,n,r]}}(),function(){o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,{a:t}),t}}(),function(){o.d=function(e,t){for(var a in t)o.o(t,a)&&!o.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})}}(),function(){o.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={143:0};o.O.j=function(t){return 0===e[t]};var t=function(t,a){var n,r,i=a[0],l=a[1],s=a[2],u=0;if(i.some((function(t){return 0!==e[t]}))){for(n in l)o.o(l,n)&&(o.m[n]=l[n]);if(s)var d=s(o)}for(t&&t(a);u<i.length;u++)r=i[u],o.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return o.O(d)},a=self["webpackChunkpld_progression_grouper_app"]=self["webpackChunkpld_progression_grouper_app"]||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))}();var a=o.O(void 0,[998],(function(){return o(8343)}));a=o.O(a)})();
//# sourceMappingURL=app.9516b651.js.map