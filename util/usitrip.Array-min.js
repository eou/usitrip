!function(){Usitrip.Array=function(){},Usitrip.apply(Usitrip.Array,{in_array:function(v,array){if(array.constructor!==Array)return!1;for(var i in array)if(array[i]==v)return!0;return!1},contains:function(target,item){return target.indexOf(item)>-1},removeAt:function(target,index){return!!target.splice(index,1).length},remove:function(target,item){var index=target.indexOf(item);return~index?this.removeAt(target,index):!1},shuffle:function(target){for(var j,x,i=target.length;i>0;j=parseInt(Math.random()*i),x=target[--i],target[i]=target[j],target[j]=x);return target},random:function(target){return target[Math.floor(Math.random()*target.length)]},flatten:function(target){var result=[],_=this;return target.forEach(function(item){Array.isArray(item)?result=result.concat(_.flatten(item)):result.push(item)}),result},unique:function(target){var result=[];loop:for(var i=0,n=target.length;n>i;i++){for(var x=i+1;n>x;x++)if(target[x]===target[i])continue loop;result.push(target[i])}return result},compact:function(target){return target.filter(function(el){return null!=el})},pluck:function(target,name){var prop,result=[];return target.forEach(function(item){prop=item[name],null!=prop&&result.push(prop)}),result}})}();