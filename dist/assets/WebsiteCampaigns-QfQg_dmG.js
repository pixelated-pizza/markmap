import{s as Ce}from"./index-C_mLea2A.js";import{s as $e,a as De}from"./index-DjAZ2H_f.js";import{B as ze,a9 as Pe,R as Ve,J as Le,f as je,r as Ae,P as Oe,h as _,o as v,w as g,Q as se,a as r,m as V,e as q,c as L,g as C,Z as re,i as Ee,a0 as Be,T as Ie,_ as Te,k as Ue,j as y,H as J,E as Me,d as m,u as l,t as w,p as z,a4 as U}from"./app-CbSpuZWz.js";import{i as Ne,a as Fe,b as Re,F as We}from"./index-COPaDMcf.js";import{s as ae}from"./index-eD6S1kqP.js";import{s as Z}from"./index-BPu-5vh6.js";import{s as He}from"./index-SYyK-BY6.js";import{s as ne}from"./index-DSakxZJw.js";import{a as Ke,b as Ye,s as R}from"./index-ox7wq2AC.js";import{u as qe}from"./onsite_campaign_store-86u1j5rS.js";import{s as x}from"./index-B5iRmrBA.js";import"./index-Cnol1VbJ.js";import"./index-D5u0DxSa.js";import"./index-Cy3pqZbw.js";import"./index-CHjQ6Hbd.js";import"./website_campaign_api-C2sorqgU.js";var Ge=`
    .p-message {
        border-radius: dt('message.border.radius');
        outline-width: dt('message.border.width');
        outline-style: solid;
    }

    .p-message-content {
        display: flex;
        align-items: center;
        padding: dt('message.content.padding');
        gap: dt('message.content.gap');
        height: 100%;
    }

    .p-message-icon {
        flex-shrink: 0;
    }

    .p-message-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-inline-start: auto;
        overflow: hidden;
        position: relative;
        width: dt('message.close.button.width');
        height: dt('message.close.button.height');
        border-radius: dt('message.close.button.border.radius');
        background: transparent;
        transition:
            background dt('message.transition.duration'),
            color dt('message.transition.duration'),
            outline-color dt('message.transition.duration'),
            box-shadow dt('message.transition.duration'),
            opacity 0.3s;
        outline-color: transparent;
        color: inherit;
        padding: 0;
        border: none;
        cursor: pointer;
        user-select: none;
    }

    .p-message-close-icon {
        font-size: dt('message.close.icon.size');
        width: dt('message.close.icon.size');
        height: dt('message.close.icon.size');
    }

    .p-message-close-button:focus-visible {
        outline-width: dt('message.close.button.focus.ring.width');
        outline-style: dt('message.close.button.focus.ring.style');
        outline-offset: dt('message.close.button.focus.ring.offset');
    }

    .p-message-info {
        background: dt('message.info.background');
        outline-color: dt('message.info.border.color');
        color: dt('message.info.color');
        box-shadow: dt('message.info.shadow');
    }

    .p-message-info .p-message-close-button:focus-visible {
        outline-color: dt('message.info.close.button.focus.ring.color');
        box-shadow: dt('message.info.close.button.focus.ring.shadow');
    }

    .p-message-info .p-message-close-button:hover {
        background: dt('message.info.close.button.hover.background');
    }

    .p-message-info.p-message-outlined {
        color: dt('message.info.outlined.color');
        outline-color: dt('message.info.outlined.border.color');
    }

    .p-message-info.p-message-simple {
        color: dt('message.info.simple.color');
    }

    .p-message-success {
        background: dt('message.success.background');
        outline-color: dt('message.success.border.color');
        color: dt('message.success.color');
        box-shadow: dt('message.success.shadow');
    }

    .p-message-success .p-message-close-button:focus-visible {
        outline-color: dt('message.success.close.button.focus.ring.color');
        box-shadow: dt('message.success.close.button.focus.ring.shadow');
    }

    .p-message-success .p-message-close-button:hover {
        background: dt('message.success.close.button.hover.background');
    }

    .p-message-success.p-message-outlined {
        color: dt('message.success.outlined.color');
        outline-color: dt('message.success.outlined.border.color');
    }

    .p-message-success.p-message-simple {
        color: dt('message.success.simple.color');
    }

    .p-message-warn {
        background: dt('message.warn.background');
        outline-color: dt('message.warn.border.color');
        color: dt('message.warn.color');
        box-shadow: dt('message.warn.shadow');
    }

    .p-message-warn .p-message-close-button:focus-visible {
        outline-color: dt('message.warn.close.button.focus.ring.color');
        box-shadow: dt('message.warn.close.button.focus.ring.shadow');
    }

    .p-message-warn .p-message-close-button:hover {
        background: dt('message.warn.close.button.hover.background');
    }

    .p-message-warn.p-message-outlined {
        color: dt('message.warn.outlined.color');
        outline-color: dt('message.warn.outlined.border.color');
    }

    .p-message-warn.p-message-simple {
        color: dt('message.warn.simple.color');
    }

    .p-message-error {
        background: dt('message.error.background');
        outline-color: dt('message.error.border.color');
        color: dt('message.error.color');
        box-shadow: dt('message.error.shadow');
    }

    .p-message-error .p-message-close-button:focus-visible {
        outline-color: dt('message.error.close.button.focus.ring.color');
        box-shadow: dt('message.error.close.button.focus.ring.shadow');
    }

    .p-message-error .p-message-close-button:hover {
        background: dt('message.error.close.button.hover.background');
    }

    .p-message-error.p-message-outlined {
        color: dt('message.error.outlined.color');
        outline-color: dt('message.error.outlined.border.color');
    }

    .p-message-error.p-message-simple {
        color: dt('message.error.simple.color');
    }

    .p-message-secondary {
        background: dt('message.secondary.background');
        outline-color: dt('message.secondary.border.color');
        color: dt('message.secondary.color');
        box-shadow: dt('message.secondary.shadow');
    }

    .p-message-secondary .p-message-close-button:focus-visible {
        outline-color: dt('message.secondary.close.button.focus.ring.color');
        box-shadow: dt('message.secondary.close.button.focus.ring.shadow');
    }

    .p-message-secondary .p-message-close-button:hover {
        background: dt('message.secondary.close.button.hover.background');
    }

    .p-message-secondary.p-message-outlined {
        color: dt('message.secondary.outlined.color');
        outline-color: dt('message.secondary.outlined.border.color');
    }

    .p-message-secondary.p-message-simple {
        color: dt('message.secondary.simple.color');
    }

    .p-message-contrast {
        background: dt('message.contrast.background');
        outline-color: dt('message.contrast.border.color');
        color: dt('message.contrast.color');
        box-shadow: dt('message.contrast.shadow');
    }

    .p-message-contrast .p-message-close-button:focus-visible {
        outline-color: dt('message.contrast.close.button.focus.ring.color');
        box-shadow: dt('message.contrast.close.button.focus.ring.shadow');
    }

    .p-message-contrast .p-message-close-button:hover {
        background: dt('message.contrast.close.button.hover.background');
    }

    .p-message-contrast.p-message-outlined {
        color: dt('message.contrast.outlined.color');
        outline-color: dt('message.contrast.outlined.border.color');
    }

    .p-message-contrast.p-message-simple {
        color: dt('message.contrast.simple.color');
    }

    .p-message-text {
        font-size: dt('message.text.font.size');
        font-weight: dt('message.text.font.weight');
    }

    .p-message-icon {
        font-size: dt('message.icon.size');
        width: dt('message.icon.size');
        height: dt('message.icon.size');
    }

    .p-message-enter-from {
        opacity: 0;
    }

    .p-message-enter-active {
        transition: opacity 0.3s;
    }

    .p-message.p-message-leave-from {
        max-height: 1000px;
    }

    .p-message.p-message-leave-to {
        max-height: 0;
        opacity: 0;
        margin: 0;
    }

    .p-message-leave-active {
        overflow: hidden;
        transition:
            max-height 0.45s cubic-bezier(0, 1, 0, 1),
            opacity 0.3s,
            margin 0.3s;
    }

    .p-message-leave-active .p-message-close-button {
        opacity: 0;
    }

    .p-message-sm .p-message-content {
        padding: dt('message.content.sm.padding');
    }

    .p-message-sm .p-message-text {
        font-size: dt('message.text.sm.font.size');
    }

    .p-message-sm .p-message-icon {
        font-size: dt('message.icon.sm.size');
        width: dt('message.icon.sm.size');
        height: dt('message.icon.sm.size');
    }

    .p-message-sm .p-message-close-icon {
        font-size: dt('message.close.icon.sm.size');
        width: dt('message.close.icon.sm.size');
        height: dt('message.close.icon.sm.size');
    }

    .p-message-lg .p-message-content {
        padding: dt('message.content.lg.padding');
    }

    .p-message-lg .p-message-text {
        font-size: dt('message.text.lg.font.size');
    }

    .p-message-lg .p-message-icon {
        font-size: dt('message.icon.lg.size');
        width: dt('message.icon.lg.size');
        height: dt('message.icon.lg.size');
    }

    .p-message-lg .p-message-close-icon {
        font-size: dt('message.close.icon.lg.size');
        width: dt('message.close.icon.lg.size');
        height: dt('message.close.icon.lg.size');
    }

    .p-message-outlined {
        background: transparent;
        outline-width: dt('message.outlined.border.width');
    }

    .p-message-simple {
        background: transparent;
        outline-color: transparent;
        box-shadow: none;
    }

    .p-message-simple .p-message-content {
        padding: dt('message.simple.content.padding');
    }

    .p-message-outlined .p-message-close-button:hover,
    .p-message-simple .p-message-close-button:hover {
        background: transparent;
    }
`,Qe={root:function(n){var i=n.props;return["p-message p-component p-message-"+i.severity,{"p-message-outlined":i.variant==="outlined","p-message-simple":i.variant==="simple","p-message-sm":i.size==="small","p-message-lg":i.size==="large"}]},content:"p-message-content",icon:"p-message-icon",text:"p-message-text",closeButton:"p-message-close-button",closeIcon:"p-message-close-icon"},Je=ze.extend({name:"message",style:Ge,classes:Qe}),Ze={name:"BaseMessage",extends:Le,props:{severity:{type:String,default:"info"},closable:{type:Boolean,default:!1},life:{type:Number,default:null},icon:{type:String,default:void 0},closeIcon:{type:String,default:void 0},closeButtonProps:{type:null,default:null},size:{type:String,default:null},variant:{type:String,default:null}},style:Je,provide:function(){return{$pcMessage:this,$parentInstance:this}}};function W(t){"@babel/helpers - typeof";return W=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},W(t)}function oe(t,n,i){return(n=Xe(n))in t?Object.defineProperty(t,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[n]=i,t}function Xe(t){var n=et(t,"string");return W(n)=="symbol"?n:n+""}function et(t,n){if(W(t)!="object"||!t)return t;var i=t[Symbol.toPrimitive];if(i!==void 0){var o=i.call(t,n);if(W(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(t)}var A={name:"Message",extends:Ze,inheritAttrs:!1,emits:["close","life-end"],timeout:null,data:function(){return{visible:!0}},mounted:function(){var n=this;this.life&&setTimeout(function(){n.visible=!1,n.$emit("life-end")},this.life)},methods:{close:function(n){this.visible=!1,this.$emit("close",n)}},computed:{closeAriaLabel:function(){return this.$primevue.config.locale.aria?this.$primevue.config.locale.aria.close:void 0},dataP:function(){return je(oe(oe({outlined:this.variant==="outlined",simple:this.variant==="simple"},this.severity,this.severity),this.size,this.size))}},directives:{ripple:Ve},components:{TimesIcon:Pe}};function H(t){"@babel/helpers - typeof";return H=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},H(t)}function le(t,n){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);n&&(o=o.filter(function(b){return Object.getOwnPropertyDescriptor(t,b).enumerable})),i.push.apply(i,o)}return i}function ie(t){for(var n=1;n<arguments.length;n++){var i=arguments[n]!=null?arguments[n]:{};n%2?le(Object(i),!0).forEach(function(o){tt(t,o,i[o])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):le(Object(i)).forEach(function(o){Object.defineProperty(t,o,Object.getOwnPropertyDescriptor(i,o))})}return t}function tt(t,n,i){return(n=st(n))in t?Object.defineProperty(t,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[n]=i,t}function st(t){var n=at(t,"string");return H(n)=="symbol"?n:n+""}function at(t,n){if(H(t)!="object"||!t)return t;var i=t[Symbol.toPrimitive];if(i!==void 0){var o=i.call(t,n);if(H(o)!="object")return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(t)}var nt=["data-p"],ot=["data-p"],lt=["data-p"],it=["aria-label","data-p"],rt=["data-p"];function dt(t,n,i,o,b,k){var S=Ae("TimesIcon"),O=Oe("ripple");return v(),_(Ie,V({name:"p-message",appear:""},t.ptmi("transition")),{default:g(function(){return[se(r("div",V({class:t.cx("root"),role:"alert","aria-live":"assertive","aria-atomic":"true","data-p":k.dataP},t.ptm("root")),[t.$slots.container?q(t.$slots,"container",{key:0,closeCallback:k.close}):(v(),L("div",V({key:1,class:t.cx("content"),"data-p":k.dataP},t.ptm("content")),[q(t.$slots,"icon",{class:re(t.cx("icon"))},function(){return[(v(),_(Ee(t.icon?"span":null),V({class:[t.cx("icon"),t.icon],"data-p":k.dataP},t.ptm("icon")),null,16,["class","data-p"]))]}),t.$slots.default?(v(),L("div",V({key:0,class:t.cx("text"),"data-p":k.dataP},t.ptm("text")),[q(t.$slots,"default")],16,lt)):C("",!0),t.closable?se((v(),L("button",V({key:1,class:t.cx("closeButton"),"aria-label":k.closeAriaLabel,type:"button",onClick:n[0]||(n[0]=function($){return k.close($)}),"data-p":k.dataP},ie(ie({},t.closeButtonProps),t.ptm("closeButton"))),[q(t.$slots,"closeicon",{},function(){return[t.closeIcon?(v(),L("i",V({key:0,class:[t.cx("closeIcon"),t.closeIcon],"data-p":k.dataP},t.ptm("closeIcon")),null,16,rt)):(v(),_(S,V({key:1,class:[t.cx("closeIcon"),t.closeIcon],"data-p":k.dataP},t.ptm("closeIcon")),null,16,["class","data-p"]))]})],16,it)),[[O]]):C("",!0)],16,ot))],16,nt),[[Be,b.visible]])]}),_:3},16)}A.render=dt;const ut={class:"flex flex-col bg-white dark:bg-gray-900 h-auto max-h-[88vh] overflow-auto"},ct={class:"card dark:bg-gray-900 bg-white rounded-lg mt-2"},mt={class:"h-[450px] overflow-hidden rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"},pt={key:0,class:"flex flex-col gap-4 w-full h-full p-3"},gt={class:"flex-1 mt-2"},vt={class:"rounded-sm"},ft={key:0,class:"flex flex-col gap-4 w-full h-full dark:bg-black bg-white p-5 rounded-md"},bt={class:"flex-1 mt-2"},yt={class:"table-header flex flex-wrap gap-2 items-center p-2"},ht={class:"relative w-60"},wt={class:"relative w-60"},_t={class:"flex flex-col gap-2"},kt={class:"flex flex-col gap-3"},St={class:"flex items-center gap-2 mb-2 mt-2"},xt={class:"flex justify-between w-full"},Ct={class:"flex gap-2"},$t={class:"flex gap-2"},Dt={__name:"WebsiteCampaigns",setup(t){const i=Ue().appContext.config.globalProperties.$toastr,o=qe(),b=y(!1),k=y(null),S=y(!1),O=y(!1),$=y(!1),M=y(!1),N=y(!1),E=y(null),B=y(null),F=y(null),I=y(null),h=y(null),P=y(""),G=new Date,K=G.getFullYear()+"-"+String(G.getMonth()+1).padStart(2,"0")+"-"+String(G.getDate()).padStart(2,"0"),X=["#B04D4D","#387EB0"],d=y({name:"",campaign_type_id:"",section_id:"",store_id:"",start_date:"",is_all_store:!1,end_date:""}),f=y({name:null,campaign_type_id:null,section_id:null,store_id:null,is_all_store:null,start_date:null,end_date:null}),Q=y({schedulerLicenseKey:"GPL-My-Project-Is-Open-Source",plugins:[Ne,Fe,Re],initialView:"resourceTimelineMonth",headerToolbar:{left:"prev,next today",center:"title"},resourceAreaHeaderContent:"On-site Campaigns",resources:[],events:[],editable:!0,selectable:!0,height:400,slotLabelFormat:[{weekday:"short",day:"numeric",month:"short"}],slotLabelDidMount:a=>{a.el.style.padding="6px 0"},eventDrop:async a=>{const{id:e,start:u,end:p}=a.event,c=o.campaigns.find(s=>String(s.wc_id)===e);if(c)try{await o.editCampaign(e,{...c,start_date:u?T(u):null,end_date:p?T(p):null}),i.success({severity:"success",summary:"Campaign Updated",detail:`${c.name} date updated.`,life:2e3}),await o.loadCampaigns(),j()}catch{i.error("Failed to update campaign date."),a.revert()}},eventResize:async a=>{const{id:e,start:u,end:p}=a.event,c=o.campaigns.find(s=>String(s.wc_id)===e);if(c)try{await o.editCampaign(e,{...c,start_date:u?T(u):null,end_date:p?T(p):null}),i.success({severity:"success",summary:"Campaign Resized",detail:`${c.name} duration updated.`,life:2e3}),await o.loadCampaigns(),j()}catch{i.error("Failed to update campaign duration."),a.revert()}}}),de=J(()=>{const a=o.campaigns.filter(u=>{const p=!P.value||u.name?.toLowerCase().includes(P.value.toLowerCase())||u.store?.store_name?.toLowerCase().includes(P.value.toLowerCase())||u.section?.name?.toLowerCase().includes(P.value.toLowerCase())||String(u.start_date).toLowerCase().includes(P.value.toLowerCase())||String(u.end_date).toLowerCase().includes(P.value.toLowerCase()),c=!E.value||String(u.store_id)===String(E.value),s=!B.value||String(u.section_id)===String(B.value);return p&&c&&s}),e={};return a.forEach(u=>{const p=u.store?.store_name?.replace(/^Website - /,"")||"";e[u.name]?p&&!e[u.name].websiteDisplay.includes(p)&&e[u.name].websiteDisplay.push(p):e[u.name]={...u,websiteDisplay:p?[p]:[]}}),Object.values(e).map(u=>({...u,websiteDisplay:u.websiteDisplay.join(" & ")}))});function T(a){if(!a)return null;const e=a instanceof Date?a:new Date(a),u=e.getFullYear(),p=String(e.getMonth()+1).padStart(2,"0"),c=String(e.getDate()).padStart(2,"0"),s=String(e.getHours()).padStart(2,"0"),D=String(e.getMinutes()).padStart(2,"0"),Y=String(e.getSeconds()).padStart(2,"0");return`${u}-${p}-${c} ${s}:${D}:${Y}`}function ee(a){const e=a.start_date,u=a.end_date;return K>=e&&K<=u}function ue(a){return K>a.end_date}function ce(a){return K<a.start_date}function me(a){return ee(a)?"Active":ue(a)?"Completed":"Upcoming"}async function pe(){S.value=!0,await o.loadCampaigns(),await o.loadStores(),await o.loadSections(),await o.loadCampaignTypes(),j(),S.value=!1}function j(){const a=o.stores.map(c=>{const s=o.campaign_types.filter(D=>o.campaigns.some(Y=>String(Y.store_id)===String(c.store_id)&&String(Y.campaign_type_id)===String(D.campaign_type_id))).map(D=>({id:`${String(c.store_id)}-${String(D.campaign_type_id)}`,title:D.campaign_type_name}));return{id:`store-${String(c.store_id)}`,title:c.store_name,children:s}}),e={},u=o.campaigns.map(c=>{const s=`${c.store_id}-${c.campaign_type_id}`;s in e||(e[s]=0);const D=X[e[s]%X.length];return e[s]++,{id:String(c.wc_id),resourceId:s,title:c.name,start:c.start_date?new Date(c.start_date).toLocaleDateString("en-CA"):null,end:c.end_date?new Date(new Date(c.end_date).setDate(new Date(c.end_date).getDate()+1)).toLocaleDateString("en-CA"):null,backgroundColor:D,borderColor:D,textColor:"#ffffff"}});Q.value={...Q.value,resources:a,events:u};const p=k.value?.getApi();p&&(typeof p.removeAllResources=="function"&&(p.removeAllResources(),a.forEach(c=>p.addResource(c))),typeof p.removeAllEvents=="function"&&(p.removeAllEvents(),u.forEach(c=>p.addEvent(c))))}function ge(){h.value=null,d.value={name:"",campaign_type_id:"",section_id:"",store_id:"",start_date:null,end_date:null,is_all_store:!1},$.value=!0}function ve(a){h.value=a.wc_id,d.value={name:a.name,campaign_type_id:a.campaign_type_id,section_id:a.section_id,is_all_store:!!a.is_applied_to_both_stores,store_id:a.store_id,start_date:a.start_date?new Date(a.start_date):null,end_date:a.end_date?new Date(a.end_date):null},$.value=!0}function fe(){$.value=!1,h.value=null}const be=J(()=>h.value?"Edit Campaign":"Add Campaign"),ye=J(()=>h.value?"Update":"Create");async function he(){if(b.value=!0,!xe()){i.warning("Please correct the errors before saving."),b.value=!1;return}O.value=!0;const a={name:d.value.name,campaign_type_id:d.value.campaign_type_id,section_id:d.value.section_id,store_id:d.value.store_id,is_applied_to_both_stores:d.value.is_all_store,start_date:d.value.start_date?T(d.value.start_date):null,end_date:d.value.end_date?T(d.value.end_date):null};try{if(h.value)if(await o.editCampaign(h.value,a),d.value.is_all_store){const e=o.stores.filter(c=>String(c.store_id)!==String(a.store_id)).map(c=>o.addCampaign({...a,store_id:c.store_id})),p=(await Promise.allSettled(e)).map((c,s)=>c.status==="rejected"?o.stores[s].store_name:null).filter(Boolean);p.length?i.warning(`Campaign updated, but failed to sync to: ${p.join(", ")}`):i.success("Campaign updated and synced to all stores.")}else i.success("Campaign updated."),b.value=!1;else if(d.value.is_all_store){const e=o.stores.map(c=>o.addCampaign({...a,store_id:c.store_id})),p=(await Promise.allSettled(e)).map((c,s)=>c.status==="rejected"?o.stores[s].store_name:null).filter(Boolean);p.length?i.warning(`Campaign added, but failed on: ${p.join(", ")}`):i.success("Campaign added to all stores.")}else await o.addCampaign(a),i.success("Campaign added."),b.value=!1;$.value=!1,await o.loadCampaigns(),j()}catch(e){console.error(e),i.error("Failed to save campaign.")}finally{O.value=!1,b.value=!1}}function we(a){F.value=a,M.value=!0}function _e(a){I.value=a,N.value=!0}function te(a){if(!a)return"";try{const e=new Date(a),u=e.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),p=e.toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",hour12:!0});return`${u} at ${p}`}catch{return a}}async function ke(){if(M.value=!1,!!F.value){S.value=!0;try{await o.archiveCampaign(F.value.wc_id,!0),await o.loadCampaigns(),j(),i.success("Campaign Archived")}catch{i.error("Failed to archive campaign.")}finally{S.value=!1,F.value=null}$.value=!1,h.value=null}}async function Se(){if(N.value=!1,!!I.value){S.value=!0;try{await o.removeCampaign(I.value.wc_id),await o.loadCampaigns(),j(),i.success(`Campaign "${I.value.name}" has been successfully deleted.`)}catch{i.error("Failed to delete campaign.")}finally{S.value=!1,I.value=null}$.value=!1,h.value=null}}function xe(){let a=!0;return Object.keys(f.value).forEach(e=>f.value[e]=null),(!d.value.name||d.value.name.trim()==="")&&(f.value.name="Name is required.",a=!1),d.value.campaign_type_id||(f.value.campaign_type_id="Select a campaign category.",a=!1),d.value.section_id||(f.value.section_id="Select a section.",a=!1),!d.value.is_all_store&&!d.value.store_id&&(f.value.store_id="Select a website unless applying to both websites.",a=!1),d.value.start_date||(f.value.start_date="Start date is required.",a=!1),d.value.end_date||(f.value.end_date="End date is required.",a=!1),d.value.start_date&&d.value.end_date&&new Date(d.value.end_date)<new Date(d.value.start_date)&&(f.value.end_date="End date cannot be earlier than start date.",a=!1),a}return Me(async()=>{await pe(),j()}),(a,e)=>{const u=De,p=$e,c=Ce;return v(),_(c,{blocked:b.value,fullScreen:""},{default:g(()=>[r("div",ut,[r("div",ct,[e[32]||(e[32]=r("h4",{class:"text-gray-200 font-semibold text-lg text-center p-2"}," Website Campaign Calendar - Edisons & Mytopia ",-1)),r("div",mt,[S.value?(v(),L("div",pt,[e[19]||(e[19]=r("p",{class:"text-gray-400 text-lg"}," Loading Gantt Chart... ",-1)),m(l(x),{height:"2rem",width:"70%"}),m(l(x),{height:"2rem",width:"50%"}),m(l(x),{height:"1rem",width:"90%"}),m(l(x),{height:"1rem",width:"85%"}),m(l(x),{height:"1rem",width:"95%"}),r("div",gt,[m(l(x),{height:"100%",borderRadius:"8px"})])])):(v(),_(l(We),{key:1,ref_key:"calendarRef",ref:k,options:Q.value,class:"w-full h-full fc-theme"},null,8,["options"]))]),r("div",vt,[S.value?(v(),L("div",ft,[e[20]||(e[20]=r("p",{class:"text-gray-400 text-lg"}," Loading data table... ",-1)),m(l(x),{height:"2rem",width:"70%"}),m(l(x),{height:"2rem",width:"50%"}),m(l(x),{height:"1rem",width:"90%"}),m(l(x),{height:"1rem",width:"85%"}),m(l(x),{height:"1rem",width:"95%"}),r("div",bt,[m(l(x),{height:"100%",borderRadius:"8px"})])])):(v(),_(p,{key:1,value:de.value,sortField:"start_date",sortOrder:-1,dataKey:"wc_id",paginator:"",rows:5,rowsPerPageOptions:[5,10,20,50],showGridlines:"",scrollable:"",scrollHeight:"500px",stickyHeader:"",tableStyle:"min-width: 60rem;",loading:S.value,class:"p-datatable-sm",tableLayout:"fixed"},{header:g(()=>[r("div",yt,[m(l(Ke),{class:"w-60 relative"},{default:g(()=>[m(l(Ye),null,{default:g(()=>[...e[21]||(e[21]=[r("i",{class:"pi pi-search"},null,-1)])]),_:1}),m(l(ne),{placeholder:"Search",modelValue:P.value,"onUpdate:modelValue":e[0]||(e[0]=s=>P.value=s),class:"w-full"},null,8,["modelValue"])]),_:1}),r("div",ht,[m(l(R),{modelValue:E.value,"onUpdate:modelValue":e[1]||(e[1]=s=>E.value=s),options:l(o).stores,optionLabel:"store_name",optionValue:"store_id",placeholder:"Filter by Website",class:"w-full"},null,8,["modelValue","options"]),E.value?(v(),L("button",{key:0,onClick:e[2]||(e[2]=s=>E.value=null),class:"absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"},[...e[22]||(e[22]=[r("i",{class:"pi pi-times"},null,-1)])])):C("",!0)]),r("div",wt,[m(l(R),{modelValue:B.value,"onUpdate:modelValue":e[3]||(e[3]=s=>B.value=s),options:l(o).sections,optionLabel:"name",optionValue:"section_id",placeholder:"Filter by Section",class:"w-full"},null,8,["modelValue","options"]),B.value?(v(),L("button",{key:0,onClick:e[4]||(e[4]=s=>B.value=null),class:"absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"},[...e[23]||(e[23]=[r("i",{class:"pi pi-times"},null,-1)])])):C("",!0)]),m(l(z),{type:"button",icon:"pi pi-plus",label:"Add Campaign / Promo",size:"small",severity:"success",loading:S.value,onClick:ge},null,8,["loading"])])]),empty:g(()=>[...e[24]||(e[24]=[r("div",{class:"p-4 text-center text-gray-400"}," No Data available. ",-1)])]),default:g(()=>[m(u,{field:"name",header:"Banner Name",class:"w-1/4"},{body:g(({data:s})=>[r("span",null,w(s.name),1)]),_:1}),m(u,{field:"start_date",header:"Start Date",class:"w-1/6"},{body:g(({data:s})=>[r("span",null,w(te(s.start_date)),1)]),_:1}),m(u,{field:"end_date",header:"End Date",class:"w-1/6"},{body:g(({data:s})=>[r("span",null,w(te(s.end_date)),1)]),_:1}),m(u,{field:"store_id",header:"Website",class:"w-1/6"},{body:g(({data:s})=>[r("span",null,w(s.websiteDisplay),1)]),_:1}),m(u,{field:"section_id",header:"Section",class:"w-1/6"},{body:g(({data:s})=>[r("span",null,w(s.section?.name),1)]),_:1}),m(u,{header:"Status",class:"w-1/6"},{body:g(({data:s})=>[r("span",{class:re(["px-2 py-1 rounded text-sm font-medium",ce(s)?"bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400":ee(s)?"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400":"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"])},w(me(s)),3)]),_:1}),m(u,{header:"Action",class:"w-1/6"},{body:g(({data:s})=>[r("div",_t,[m(l(z),{type:"button",icon:"pi pi-pencil",label:"Edit",size:"small",severity:"info",loading:S.value&&h.value===s.wc_id,onClick:D=>ve(s)},null,8,["loading","onClick"])])]),_:1})]),_:1},8,["value","loading"]))]),m(l(Z),{visible:$.value,"onUpdate:visible":e[14]||(e[14]=s=>$.value=s),modal:"",header:be.value,style:{width:"30vw"},class:"bg-white dark:bg-gray-900"},{footer:g(()=>[r("div",xt,[r("div",Ct,[h.value?(v(),_(l(z),{key:0,label:"Archive",icon:"pi pi-folder",severity:"warn",onClick:e[12]||(e[12]=s=>we({...d.value,wc_id:h.value}))})):C("",!0),h.value?(v(),_(l(z),{key:1,label:"Delete",icon:"pi pi-trash",loading:b.value,disabled:b.value,severity:"danger",onClick:e[13]||(e[13]=s=>_e({...d.value,wc_id:h.value}))},null,8,["loading","disabled"])):C("",!0)]),r("div",$t,[m(l(z),{label:"Cancel",severity:"secondary",onClick:fe}),m(l(z),{label:O.value?"Saving...":ye.value,icon:"pi pi-check",severity:"success",disabled:b.value,onClick:he,loading:O.value},null,8,["label","disabled","loading"])])])]),default:g(()=>[r("div",kt,[r("div",null,[e[25]||(e[25]=r("label",{class:"block text-gray-700 dark:text-gray-300 mb-1"},"Name",-1)),m(l(ne),{modelValue:d.value.name,"onUpdate:modelValue":e[5]||(e[5]=s=>d.value.name=s),class:"w-full",placeholder:"Name of the Website Sale / Promotion"},null,8,["modelValue"]),f.value.name?(v(),_(l(A),{key:0,severity:"error",size:"small",variant:"simple"},{default:g(()=>[U(w(f.value.name),1)]),_:1})):C("",!0)]),r("div",null,[e[26]||(e[26]=r("label",{class:"block text-gray-700 dark:text-gray-300 mb-1"},"Campaign Category",-1)),m(l(R),{modelValue:d.value.campaign_type_id,"onUpdate:modelValue":e[6]||(e[6]=s=>d.value.campaign_type_id=s),options:l(o).campaign_types,optionLabel:"campaign_type_name",optionValue:"campaign_type_id",class:"w-full",placeholder:"Campaign Category"},null,8,["modelValue","options"]),f.value.campaign_type_id?(v(),_(l(A),{key:0,severity:"error",size:"small",variant:"simple"},{default:g(()=>[U(w(f.value.campaign_type_id),1)]),_:1})):C("",!0)]),r("div",null,[e[27]||(e[27]=r("label",{class:"block text-gray-700 dark:text-gray-300 mb-1"},"Where do we place this?",-1)),m(l(R),{modelValue:d.value.section_id,"onUpdate:modelValue":e[7]||(e[7]=s=>d.value.section_id=s),options:l(o).sections,optionLabel:"name",optionValue:"section_id",class:"w-full",placeholder:"Section Name"},null,8,["modelValue","options"]),f.value.section_id?(v(),_(l(A),{key:0,severity:"error",size:"small",variant:"simple"},{default:g(()=>[U(w(f.value.section_id),1)]),_:1})):C("",!0)]),r("div",null,[e[29]||(e[29]=r("label",{class:"block text-gray-700 dark:text-gray-300 mb-1"},"What Website?",-1)),r("div",St,[m(l(He),{modelValue:d.value.is_all_store,"onUpdate:modelValue":e[8]||(e[8]=s=>d.value.is_all_store=s),inputId:"all_store",binary:"","true-value":!0,"false-value":!1},null,8,["modelValue"]),e[28]||(e[28]=r("label",{for:"all_store",class:"text-gray-700 dark:text-gray-300 cursor-pointer"},"Apply to Both Websites",-1))]),m(l(R),{modelValue:d.value.store_id,"onUpdate:modelValue":e[9]||(e[9]=s=>d.value.store_id=s),disabled:d.value.is_all_store,options:l(o).stores,optionLabel:"store_name",optionValue:"store_id",class:"w-full",placeholder:"Name of the Website"},null,8,["modelValue","disabled","options"]),f.value.store_id?(v(),_(l(A),{key:0,severity:"error",size:"small",variant:"simple"},{default:g(()=>[U(w(f.value.store_id),1)]),_:1})):C("",!0)]),r("div",null,[e[30]||(e[30]=r("label",{class:"block dark:text-gray-300 mb-1 text-black"},"Start Date",-1)),m(l(ae),{modelValue:d.value.start_date,"onUpdate:modelValue":e[10]||(e[10]=s=>d.value.start_date=s),showTime:"",hourFormat:"12",timePickerMode:"slider",stepMinute:"1",stepSecond:"1",fluid:""},null,8,["modelValue"]),f.value.start_date?(v(),_(l(A),{key:0,severity:"error",size:"small",variant:"simple"},{default:g(()=>[U(w(f.value.start_date),1)]),_:1})):C("",!0)]),r("div",null,[e[31]||(e[31]=r("label",{class:"block text-gray-700 dark:text-gray-300 mb-1"},"End Date",-1)),m(l(ae),{modelValue:d.value.end_date,"onUpdate:modelValue":e[11]||(e[11]=s=>d.value.end_date=s),showTime:"",hourFormat:"12",timePickerMode:"slider",stepMinute:"1",stepSecond:"1",fluid:""},null,8,["modelValue"]),f.value.end_date?(v(),_(l(A),{key:0,severity:"error",size:"small",variant:"simple"},{default:g(()=>[U(w(f.value.end_date),1)]),_:1})):C("",!0)])])]),_:1},8,["visible","header"]),m(l(Z),{visible:M.value,"onUpdate:visible":e[16]||(e[16]=s=>M.value=s),header:"Confirm Archive",modal:!0,closable:!1,style:{width:"400px"}},{footer:g(()=>[m(l(z),{label:"No",severity:"danger",text:"",onClick:e[15]||(e[15]=s=>M.value=!1)}),m(l(z),{label:"Yes",severity:"success",loading:b.value,disabled:b.value,onClick:ke},null,8,["loading","disabled"])]),default:g(()=>[r("p",null,' Are you sure you want to archive the campaign "'+w(F.value?.name)+'"? ',1)]),_:1},8,["visible"]),m(l(Z),{visible:N.value,"onUpdate:visible":e[18]||(e[18]=s=>N.value=s),header:"Delete Campaign",modal:!0,closable:!1,style:{width:"400px"}},{footer:g(()=>[m(l(z),{label:"No",severity:"danger",text:"",onClick:e[17]||(e[17]=s=>N.value=!1)}),m(l(z),{label:"Yes",severity:"success",loading:b.value,disabled:b.value,onClick:Se},null,8,["loading","disabled"])]),default:g(()=>[r("p",null,' Are you sure you want to delete the campaign "'+w(I.value?.name)+'"? ',1)]),_:1},8,["visible"])])])]),_:1},8,["blocked"])}}},Wt=Te(Dt,[["__scopeId","data-v-ba575514"]]);export{Wt as default};
