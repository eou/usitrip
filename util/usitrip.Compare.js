Usitrip.Compare = {
	
	/*
	 *  @nObj {Objext} 新的节点
	 *  @oObj {Objext} 旧的节点
	 *  @type {String} 比较的类型
	 *  @subType {Objext} 如果比较的级别是tr,则subType才生效,为节点内部需要比较的级别
	 *  @subClazz {Objext} 如果比较的级别是tr,则subClazz才生效,为节点内部的需要比较节点的class名,起到一个过滤的作用
	 */
    toCompare: function(nObj, oObj, type, subType, subClazz){
		
        type = type.toLowerCase();
        
        var oldText = '';
        var newText = '';
        
        var len = Math.max(nObj.length, oObj.length);
        for(var i=0; i<len; i++){
			
			if(type === 'tr'){
				nObj[i] && oObj[i] &&Usitrip.Compare.trCompare(nObj[i], oObj[i], subType, subClazz);
			} else {
			
				oldText = jQuery(oObj[i]).text();
				newText = jQuery(nObj[i]).text();
				if(oldText !== newText){
					if(type === 'td'){
						var result = Usitrip.Compare.tdCompare(newText, oldText);
						newText = result[0];
						oldText = result[1];
					} else if(type === 'text'){
						var result = Usitrip.Compare.textCompare(newText, oldText);
						newText = result[0];
						oldText = result[1];
					} else {
						var result = Usitrip.Compare.otherSplitCompare(newText, oldText, type);
						newText = result[0];
						oldText = result[1];
					}
				}
				
				if(typeof(oObj[i])!='undefined' && oldText!=''){
					jQuery(oObj[i]).html(oldText);
				}
				if(typeof(nObj[i])!='undefined' && newText!=''){
					jQuery(nObj[i]).html(newText);
				}
			}
        }
    },
    
    
    tdCompare: function(newText, oldText){
        newText = '<ufo>' + newText + '</ufo>';
		oldText = '<del>' + oldText + '</del>';
        return [newText, oldText];
    },
    
    textCompare: function(newText, oldText){
        var tempNewText = '', tempOldText = '';
        
        for(var j=0,size=Math.max(newText.length, oldText.length);j<size;j++){
            if(typeof(newText[j])!='undefined' && typeof(oldText[j])!='undefined' && newText[j]!=oldText[j]){	//新旧都有但不同
                tempNewText+= '<ufo>' + newText[j] + '</ufo>'
                tempOldText+= '<del>' + oldText[j] + '</del>'
            }else if(typeof(newText[j])=='undefined' && typeof(oldText[j])!='undefined'){	//有旧没有新
                tempOldText+= '<del>' + oldText[j] + '</del>'
            }else if(typeof(newText[j])!='undefined' && typeof(oldText[j])=='undefined'){	//有新没有旧
                tempNewText+= '<ufo>' + newText[j] + '</ufo>'
            }else{	//新旧一样
                tempNewText+= newText[j];
                tempOldText+= oldText[j];
            }
        }
        newText = tempNewText;
        oldText = tempOldText;
        return [newText, oldText];
    },
	
	trCompare: function(newObj, oldObj, subType, subClazz){
		var newObjChild = $(newObj.children).filter('.' + subClazz),
			oldObjChild = $(oldObj.children).filter('.' + subClazz);
		for(var j=0,size=Math.max(newObjChild.length, oldObjChild.length);j<size;j++){
			var newText = $(newObjChild[j]),
				oldText = $(oldObjChild[j]);
			Usitrip.Compare.toCompare(newText, oldText, subType);
		}
	},
    
    otherSplitCompare: function(newText, oldText, splitType){
        var nTexts = newText.split(splitType);
        var oTexts = oldText.split(splitType);
        
        
        var tempNewText = '', tempOldText = '';
        
        for(var j=0,size=Math.max(nTexts.length, oTexts.length); j<Math.max(nTexts.length, oTexts.length); j++){
			if(j == size-1){
				splitType = '';
			}
            if(typeof(nTexts[j])!='undefined' && typeof(oTexts[j])!='undefined' && nTexts[j]!=oTexts[j]){	//新旧都有但不同
                tempNewText+= '<ufo>' + nTexts[j] + '</ufo>' + splitType;
                tempOldText+= '<del>' + oTexts[j] + '</del>' + splitType;
            }else if(typeof(nTexts[j])=='undefined' && typeof(oTexts[j])!='undefined'){	//有旧没有新
                tempOldText+= '<del>' + oTexts[j] + '</del>' + splitType;
            }else if(typeof(nTexts[j])!='undefined' && typeof(oTexts[j])=='undefined'){	//有新没有旧
                tempNewText+= '<ufo>' + nTexts[j] + '</ufo>' + splitType;
            }else{	//新旧一样
                tempNewText+= nTexts[j] + splitType;
                tempOldText+= oTexts[j] + splitType;
            }
        }
        return [tempNewText, tempOldText];
    }
}