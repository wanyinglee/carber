(this.webpackJsonpcarber=this.webpackJsonpcarber||[]).push([[0],{112:function(t,e,n){},113:function(t,e,n){},208:function(t,e,n){"use strict";n.r(e);var a=n(0),r=n.n(a),c=n(22),i=n.n(c),o=(n(112),n(38)),s=n(74),u=(n(113),n(51)),b=n.n(u),d=n(211),p=(n(132),n(43)),f=[{title:"Symbol",dataIndex:"symbol",key:"symbol"},{title:"Price",dataIndex:"price",key:"price",render:function(t,e,n){return Number(t).toFixed(1)}},{title:"Spot Price",dataIndex:"spotPrice",key:"spotPrice",render:function(t,e,n){return Number(t).toFixed(1)}},{title:"Basis",dataIndex:"basis",key:"basis",render:function(t,e,n){return"".concat((100*t).toFixed(1),"%")}}],l=function(){var t=Object(a.useState)([]),e=Object(s.a)(t,2),n=e[0],r=e[1],c=Object(a.useState)([]),i=Object(s.a)(c,2),u=(i[0],i[1],function(){return b.a.get("https://dapi.binance.com/futures/data/basis?pair=BTCUSD&contractType=PERPETUAL&period=5m&limit=1")}),l=function(){return b.a.get("https://dapi.binance.com/futures/data/basis?pair=BTCUSD&contractType=CURRENT_QUARTER&period=5m&limit=1")},m=function(){return b.a.get("https://dapi.binance.com/futures/data/basis?pair=BTCUSD&contractType=NEXT_QUARTER&period=5m&limit=1")},T=function(t,e){var n=new Date,a=31536e3/((new Date(2021,5,25,16)-n)/1e3),r=31536e3/((new Date(2021,8,24,16)-n)/1e3);switch(t){case"PERPETUAL":return Math.pow(1+Number(e),1095)-1;case"CURRENT_QUARTER":return Math.pow(1+Number(e),a)-1;case"NEXT_QUARTER":return Math.pow(1+Number(e),r)-1;default:return 0}};return Object(a.useEffect)((function(){Promise.all([u(),l(),m()]).then((function(t){var e=[].concat(Object(o.a)(t[0].data),Object(o.a)(t[1].data),Object(o.a)(t[2].data));r(e.map((function(t){return{symbol:t.contractType,price:t.futuresPrice,spotPrice:t.indexPrice,basis:T(t.contractType,t.basisRate)}})))}));var t=setInterval((function(){Promise.all([u(),l(),m()]).then((function(t){var e=[].concat(Object(o.a)(t[0].data),Object(o.a)(t[1].data),Object(o.a)(t[2].data));r(e.map((function(t){return{symbol:t.contractType,price:t.futuresPrice,spotPrice:t.indexPrice,basis:T(t.contractType,t.basisRate)}})))}))}),3e4);return function(){return clearInterval(t)}}),[]),Object(p.jsx)("div",{className:"App",children:n.length&&Object(p.jsx)(d.a,{dataSource:n,columns:f})})},m=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,212)).then((function(e){var n=e.getCLS,a=e.getFID,r=e.getFCP,c=e.getLCP,i=e.getTTFB;n(t),a(t),r(t),c(t),i(t)}))};i.a.render(Object(p.jsx)(r.a.StrictMode,{children:Object(p.jsx)(l,{})}),document.getElementById("root")),m()}},[[208,1,2]]]);
//# sourceMappingURL=main.b23da2e8.chunk.js.map