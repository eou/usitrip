/*! www.usitrip.com 2015-08-12 08:08:48 */
!function(){Usitrip.Array=function(){},Usitrip.apply(Usitrip.Array,{in_array:function(a,b){if(b.constructor!==Array)return alert("array不是数组！"),!1;for(var c in b)if(b[c]==a)return!0;return!1}})}(),Usitrip.Compare={toCompare:function(a,b,c,d,e){c=c.toLowerCase();for(var f="",g="",h=Math.max(a.length,b.length),i=0;h>i;i++)if("tr"===c)a[i]&&b[i]&&Usitrip.Compare.trCompare(a[i],b[i],d,e);else{if(f=jQuery(b[i]).text(),g=jQuery(a[i]).text(),f!==g)if("td"===c){var j=Usitrip.Compare.tdCompare(g,f);g=j[0],f=j[1]}else if("text"===c){var j=Usitrip.Compare.textCompare(g,f);g=j[0],f=j[1]}else{var j=Usitrip.Compare.otherSplitCompare(g,f,c);g=j[0],f=j[1]}"undefined"!=typeof b[i]&&""!=f&&jQuery(b[i]).html(f),"undefined"!=typeof a[i]&&""!=g&&jQuery(a[i]).html(g)}},tdCompare:function(a,b){return a="<ufo>"+a+"</ufo>",b="<del>"+b+"</del>",[a,b]},textCompare:function(a,b){for(var c="",d="",e=0,f=Math.max(a.length,b.length);f>e;e++)"undefined"!=typeof a[e]&&"undefined"!=typeof b[e]&&a[e]!=b[e]?(c+="<ufo>"+a[e]+"</ufo>",d+="<del>"+b[e]+"</del>"):"undefined"==typeof a[e]&&"undefined"!=typeof b[e]?d+="<del>"+b[e]+"</del>":"undefined"!=typeof a[e]&&"undefined"==typeof b[e]?c+="<ufo>"+a[e]+"</ufo>":(c+=a[e],d+=b[e]);return a=c,b=d,[a,b]},trCompare:function(a,b,c,d){for(var e=$(a.children).filter("."+d),f=$(b.children).filter("."+d),g=0,h=Math.max(e.length,f.length);h>g;g++){var i=$(e[g]),j=$(f[g]);Usitrip.Compare.toCompare(i,j,c)}},otherSplitCompare:function(a,b,c){for(var d=a.split(c),e=b.split(c),f="",g="",h=0,i=Math.max(d.length,e.length);h<Math.max(d.length,e.length);h++)h==i-1&&(c=""),"undefined"!=typeof d[h]&&"undefined"!=typeof e[h]&&d[h]!=e[h]?(f+="<ufo>"+d[h]+"</ufo>"+c,g+="<del>"+e[h]+"</del>"+c):"undefined"==typeof d[h]&&"undefined"!=typeof e[h]?g+="<del>"+e[h]+"</del>"+c:"undefined"!=typeof d[h]&&"undefined"==typeof e[h]?f+="<ufo>"+d[h]+"</ufo>"+c:(f+=d[h]+c,g+=e[h]+c);return[f,g]}},function(){Usitrip.Date=function(){},Usitrip.apply(Usitrip.Date,{delayDate:function(a,b){var c=this.strToDate(a);return c.setDate(c.getDate()+b),c.getFullYear()+"-"+Usitrip.Number.lpadZero(c.getMonth()+1)+"-"+Usitrip.Number.lpadZero(c.getDate())},strToDate:function(a){if(a instanceof Date)return a;if(!/^\d{4}-[01]\d-[0123]\d$/.test(a))return new Date;var b,c=a.split("-");return b=new Date(c[0],c[1]-1,c[2])}})}(),function(){Usitrip.Number=function(){},Usitrip.apply(Usitrip.Number,{lpadZero:function(a){return 10>a?"0"+a:a},strToNumber:function(a){var b=a.replace(/[^0-9\.]+/gi,"");return parseFloat(b)}})}();