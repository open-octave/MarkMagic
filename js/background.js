(()=>{var J=Object.create;var _=Object.defineProperty;var M=Object.getOwnPropertyDescriptor;var j=Object.getOwnPropertyNames;var k=Object.getPrototypeOf,w=Object.prototype.hasOwnProperty;var A=(c,a)=>()=>(a||c((a={exports:{}}).exports,a),a.exports);var L=(c,a,g,e)=>{if(a&&typeof a=="object"||typeof a=="function")for(let r of j(a))!w.call(c,r)&&r!==g&&_(c,r,{get:()=>a[r],enumerable:!(e=M(a,r))||e.enumerable});return c};var b=(c,a,g)=>(g=c!=null?J(k(c)):{},L(a||!c||!c.__esModule?_(g,"default",{value:c,enumerable:!0}):g,c));var y=A((O,d)=>{(function(){function c(e){e=e.replace(/^h([0-6])\.(.*)$/gm,function(v,m,l){return Array(parseInt(m)+1).join("#")+l}),e=e.replace(/([*_])(.*)\1/g,function(v,m,l){var t=m==="*"?"**":"*";return t+l+t}),e=e.replace(/\{\{([^}]+)\}\}/g,"`$1`"),e=e.replace(/\?\?((?:.[^?]|[^?].)+)\?\?/g,"<cite>$1</cite>"),e=e.replace(/\+([^+]*)\+/g,"<ins>$1</ins>"),e=e.replace(/\^([^^]*)\^/g,"<sup>$1</sup>"),e=e.replace(/~([^~]*)~/g,"<sub>$1</sub>"),e=e.replace(/-([^-]*)-/g,"-$1-"),e=e.replace(/\{code(:([a-z]+))?\}([^]*)\{code\}/gm,"```$2$3```"),e=e.replace(/\[(.+?)\|(.+)\]/g,"[$1]($2)"),e=e.replace(/\[(.+?)\]([^\(]*)/g,"<$1>$2"),e=e.replace(/{noformat}/g,"```"),lines=e.split(/\r?\n/gm),lines_to_remove=[];for(var r=0;r<lines.length;r++)if(line_content=lines[r],seperators=line_content.match(/\|\|/g),seperators!=null){lines[r]=lines[r].replace(/\|\|/g,"|"),console.log(seperators),header_line="";for(var h=0;h<seperators.length-1;h++)header_line+="|---";header_line+="|",lines.splice(r+1,0,header_line)}e="";for(var r=0;r<lines.length;r++)e+=lines[r]+`
`;return e}function a(e){var r="J2MBLOCKPLACEHOLDER",h=[],v=0;e=e.replace(/`{3,}(\w+)?((?:\n|.)+?)`{3,}/g,function(f,o,s){var n="{code";o&&(n+=":"+o),n+="}"+s+"{code}";var $=r+v+++"%%";return h.push({key:$,value:n}),$}),e=e.replace(/^(.*?)\n([=-])+$/gm,function(f,o,s){return"h"+(s[0]==="="?1:2)+". "+o}),e=e.replace(/^([#]+)(.*?)$/gm,function(f,o,s){return"h"+o.length+"."+s}),e=e.replace(/([*_]+)(.*?)\1/g,function(f,o,s){var n=o.length===1?"_":"*";return n+s+n}),e=e.replace(/^(\s*)- (.*)$/gm,function(f,o,s){var n=2;return o.length>0&&(n=parseInt(o.length/4)+2),Array(n).join("-")+" "+s});var m={cite:"??",del:"-",ins:"+",sup:"^",sub:"~"};e=e.replace(new RegExp("<("+Object.keys(m).join("|")+")>(.*?)</\\1>","g"),function(f,o,s){var n=m[o];return n+s+n}),e=e.replace(/~~(.*?)~~/g,"-$1-"),e=e.replace(/`([^`]+)`/g,"{{$1}}"),e=e.replace(/\[([^\]]+)\]\(([^)]+)\)/g,"[$1|$2]"),e=e.replace(/<([^>]+)>/g,"[$1]");for(var l=0;l<h.length;l++){var t=h[l];e=e.replace(t.key,t.value)}lines=e.split(/\r?\n/gm),lines_to_remove=[];for(var l=0;l<lines.length;l++)line_content=lines[l],line_content.match(/\|---/g)!=null&&(lines[l-1]=lines[l-1].replace(/\|/g,"||"),lines.splice(l,1));e="";for(var l=0;l<lines.length;l++)e+=lines[l]+`
`;return e}var g={toM:c,toJ:a};try{window.J2M=g}catch{d.exports=g}})()});var R=b(y());})();
