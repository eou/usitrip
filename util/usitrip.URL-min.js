usitrip.URLTools=function(opt){this["default"]={loc_hash:unescape(location.hash),loc_hostname:unescape(location.hostname),loc_href:unescape(location.href),loc_search:unescape(location.search),loc_pathname:unescape(location.pathname),separator:""!=unescape(location.search)?"&":"/",connector:""!=unescape(location.search)?"=":"-"},this.options=$.extend({},this["default"],opt)},URLTools.prototype={GetQueryString:function(name,string){var reg=new RegExp("(^|&|/)"+name+"(=|-)([^&|/]*)(&|/|$)"),r=string.substr(1).match(reg);return null!=r?r:null},concat:function(url,keyword,data){var O={};O.data=data.sort(function(a,b){return a-b}).toString(),O.A_url=url.split(this["default"].separator);for(var el in O.A_url)O.A_url[el].indexOf(keyword+this["default"].connector)>-1&&(O.A_url[el]=keyword+this["default"].connector+O.data);return O.A_url.join(this["default"].separator)},clearSelected:function(url,keyword,data){var O={};O.A_data_id=data,O.A_url=url.split(this["default"].separator),O.A_rt=new Array,O.reg=this.GetQueryString(keyword,url),O.A_val=O.reg[3].split(",");for(var i in O.A_val){for(var j in O.A_data_id)if(O.A_val[i]==O.A_data_id[j]){O.A_val[i]="";break}""!=O.A_val[i]&&O.A_rt.push(O.A_val[i])}return 0==O.A_rt.length?O.S_replace=O.reg[0].charAt(0):O.S_replace=O.reg[0].replace(O.reg[3],O.A_rt.toString()),url.replace(O.reg[0],O.S_replace)}};