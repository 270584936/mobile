!function(t){function e(i){if(o[i])return o[i].exports;var a=o[i]={exports:{},id:i,loaded:!1};return t[i].call(a.exports,a,a.exports,e),a.loaded=!0,a.exports}var o={};return e.m=t,e.c=o,e.p="",e(0)}({0:function(t,e,o){t.exports=o(14)},14:function(t,e,o){o(22)},22:function(t,e){!function(e,o,i,a){var n="-globalCache-lastModifyTime";e.appTool=e._T={initGlobalCacheConfig:function(t,o){e.localStorage&&t.globalCache&&1==t.globalCache?appTool.getRemoteData({rpc:"alipay.smartcard.card.config",data:{cardType:t.cardType,configKey:"buyTicket.datacache.check"},success:function(a){if(a&&a.success&&a.lastModified!=i){var r=a.lastModified>0?a.lastModified:(new Date).getTime();e.localStorage.setItem(t.cardType+n,r)}o()},error:function(t){console.warn("GET CONFIG:",t),o()}}):(e.localStorage.setItem(t.cardType+n,(new Date).getTime()),o())},getRemoteData:function(t,o){var a=o===i?!1:o,n=t.cardType||"",r="-"+(t.skey||t.rpc),s="@|@",l=null;return a&&(l=_T.getCacheValue(n,r,s),l&&0==l.expired&&l.cacheValue&&null!==l.cacheValue)?(console.warn("USE localCache",l.expired,l.cacheValue),void(t.success&&t.success(l.cacheValue))):(appTool.showTitleLoading(),void AlipayJSBridge.call("rpc",{operationType:t.rpc,requestData:[t.data],disableLimitView:!0},function(o){if(appTool.hideTitleLoading(),console.info("RPC:",t.rpc,t.data,o),!_T.isEmptyObject(o)&&o.success&&t.success){if(o.success&&e.localStorage&&a){var m=o.lastModified!=i&&o.lastModified>0?o.lastModified:(new Date).getTime();e.localStorage.setItem(n+r,JSON.stringify(o)+(s+m))}t.success&&t.success(o)}else a&&l&&l.cacheValue&&null!==l.cacheValue?(console.warn("USE STORAGE DATA:",t.rpc,t.data,l.cacheValue),t.success&&t.success(l.cacheValue)):t.error?t.error(o):_T.commonErrorForGetRemote(o)}))},postRemoteData:function(t){appTool.showLoading(),AlipayJSBridge.call("rpc",{operationType:t.rpc,requestData:[t.data],disableLimitView:!0},function(e){console.warn("RPC:",t.rpc,t.data,e),appTool.hideLoading(),!_T.isEmptyObject(e)&&e.success&&t.success?t.success(e):t.error?t.error(e):_T.commonErrorForPostRemote(e)})},getCacheValue:function(t,o,i){var a=[],r=0,s=null;if(e.localStorage){var l=e.localStorage.getItem(t+o),m=e.localStorage.getItem(t+n);null!=l&&(a=l.split(i),l=a[0]||null,r=1*a[1]||0),console.info("get cache data time: glastModifyTime-"+m+",lastModifyTime-"+r);var c=m&&m>r;try{s=appTool.strToJson(l)}catch(d){s=null}}return{expired:c,cacheValue:s}},commonErrorForPostRemote:function(t){t&&t.tips?ant.toast({text:t.tips}):!t||"10"!=t.error&&"11"!=t.error?t&&"1002"==t.error&&(_T.compareVersion("9.3.1")<0||_T.compareVersion("9.5")>=0)?ant.toast({text:t.errorMessage||"\u987e\u5ba2\u592a\u591a\uff0c\u5ba2\u5b98\u8bf7\u7a0d\u5019"}):ant.toast({text:t.errorMessage||"\u7cfb\u7edf\u6b63\u5fd9",type:"fail"}):ant.toast({text:t.errorMessage||"\u7f51\u7edc\u4e0d\u7ed9\u529b",type:"fail"})},commonErrorForGetRemote:function(t){if(t&&t.tips)appTool.jumpErrorPage(t.tips,"",!0);else if(!t||"10"!=t.error&&"11"!=t.error)if(t&&"1002"==t.error&&(_T.compareVersion("9.3.1")<0||_T.compareVersion("9.5")>=0)){var o=encodeURIComponent("\u5730\u94c1\u8d2d\u7968"),i=encodeURIComponent(e.location),a="https://ds.alipay.com/fd-iitpcony/index.html?title="+o+"&reloadUrl="+i;e.location.replace(a)}else appTool.jumpErrorPage();else appTool.jumpErrorPage("\u7f51\u7edc\u4e0d\u7ed9\u529b","",!0)},isEmptyObject:function(t){var e;for(e in t)return!1;return!0},typeName:function(t){return Object.prototype.toString.call(t).replace(/\[object (\w+)\]/,"$1").toLowerCase()},doCall:function(t){t&&ant.confirm({title:t,message:"",okButton:"\u62e8\u6253",cancelButton:"\u53d6\u6d88"},function(o){o.ok&&(e.location="tel:"+t)})},strToJson:function(t){var e=new Function("return "+t)();return e},getParam:function(t){var o=t.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]"),i="[\\?&]"+o+"=([^&#]*)",a=new RegExp(i),n=a.exec(e.location.href);return null===n?"":n[1]},toQueryString:function(t){var e=[];if("object"==typeof t)for(var o in t)t.hasOwnProperty(o)&&e.push(o+"="+encodeURIComponent(t[o]));return e.join("&")},toQueryData:function(t){for(var e,o={},i=t.split("&"),a=0;a<i.length;a++)e=i[a].split("="),e[1]=decodeURIComponent(e[1]),e[1]="true"===e[1]?!0:"false"===e[1]?!1:e[1],o[e[0]]=e[1];return o},tmplCache:{},tmpl:function(t,e){var i=/\W/.test(t)?new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+t.replace(/[\r\t\n]/g," ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');"):this.tmplCache[t]=this.tmplCache[t]||this.tmpl(o.getElementById(t).innerHTML);return e?i(e):i},setElemDisabled:function(t,e){var o="undefined"==typeof e?!0:e,i="disabled",a="am-mode",n=t.attr(a),r=new RegExp(" ?"+i+"|"+i+" ?","g");n=null===n?"":n,o?(t.attr(i,i),r.test(n)||t.attr(a,n+" "+i)):t.removeAttr(i).attr(a,n.replace(r,""))},tips:function(t,e,o){ant.toast({text:t||"\u7f51\u7edc\u4e0d\u7ed9\u529b",type:o||"none",duration:e||3e3})},gotoPage:function(t,o,i){switch(o&&_T.setPageData(o,t),i){case"pushWindow":ant.pushWindow({url:t,param:{showOptionMenu:"NO"}});break;case"location":e.location=t;break;default:ant.popTo({url:t},function(e){e.error&&ant.pushWindow({url:t,param:{showOptionMenu:"NO"}})})}},setPageData:function(t,o){e.localStorage.setItem("pageData_"+o,JSON.stringify(t))},getPageData:function(t){var o=t||function(){var t=e.location.href;return t=t.substr(t.lastIndexOf("/")+1)}();return JSON.parse(e.localStorage.getItem("pageData_"+o)||"{}")},setSessionData:function(t){AlipayJSBridge.call("setSessionData",{data:{testArray:[{a:1},{a:2}],testJson:{a:[{a:1},{a:2}]},testObject:{a:1}}})},getSessionData:function(t,e){AlipayJSBridge.call("getSessionData",{keys:["testArray","testJson","testObject"]},function(t){console.log("get:",t)})},showTitleLoading:function(){AlipayJSBridge.call("showTitleLoading")},hideTitleLoading:function(){AlipayJSBridge.call("hideTitleLoading")},showLoading:function(t){AlipayJSBridge.call("showLoading",{text:t||"\u52a0\u8f7d\u4e2d",delay:200})},hideLoading:function(){AlipayJSBridge.call("hideLoading")},jumpErrorPage:function(t,o,i,n,r){t=t||"\u670d\u52a1\u5668\u6253\u778c\u7761\u4e86",o=o||"",n=n||"\u91cd\u65b0\u52a0\u8f7d",i||(o=o||"\u6ca1\u6709\u83b7\u53d6\u5230\u4fe1\u606f"),ant.hideOptionMenu();var s='<style>body,html{height:100%}</style><div class="am-page-result"><div class="am-page-result-wrap"><div class="am-page-result-pic am-icon" am-mode="am-page-empty"></div><div class="am-page-result-title">'+t+"</div>"+(o?'<div class="am-page-result-brief">'+o+"</div>":"")+'<div class="am-page-result-button"><button type="button" class="am-button" am-mode="white" data-target="'+(r||"")+'">'+n+"</button></div></div></div>";a("body").html(s).height("100%"),a(".am-page-result .am-page-result-button .am-button").off("click").on("click",function(t){t.preventDefault(),a(this).data("target")?ant.pushWindow({url:a(this).data("target"),param:{showOptionMenu:"NO"}}):e.location.reload()}),a("html").height("100%")},compareVersion:function(t){var e=navigator.userAgent.match(/AlipayClient\/(.*)/),o=e&&e.length?e[1]:"",i=o.split(".");t=t.split(".");for(var a,n,r=0;r<i.length;r++){if(a=parseInt(t[r],10)||0,n=parseInt(i[r],10)||0,a>n)return-1;if(n>a)return 1}return 0}},t.exports=e.appTool}(window,document,void 0,Yocto)}});