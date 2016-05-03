/**
 * Created by YHB on 14-8-1.
 * 只支持元素是水平布局的元素拖拽,如元素是行内元素,或者元素浮动
 * @author YHB
 * @class usitrip.plugin.HorizontalDragPlugin
 * @extend usitrip.plugin.DragPlugin
 */
Usitrip.ns('usitrip.plugin');
usitrip.plugin.HorizontalDragPlugin  = function(config){
    Usitrip.apply(this, config);
    usitrip.plugin.HorizontalDragPlugin.superclass.constructor.apply(this,arguments);
}


Usitrip.extend(usitrip.plugin.HorizontalDragPlugin, usitrip.plugin.DragPlugin, {

    /**
     * 重写鼠标开始按下的接口
     * @param e
     */
    doMouseDown: function(e){
		var self = this;
		var doc = $(document);
		this.dragTimer = setTimeout($.proxy(function(){
	        var currentSouceEl = $(e.currentTarget || e.srcElement);
	        var innerEl = this.sourceSelector.children();
	        
	        for(var i=0,len=innerEl.length;i<len;i++){
	        	if(innerEl[i] == currentSouceEl[0]){
	        		return ;
	        	}
	        }
	        
	        this.dragEl = currentSouceEl;
	        var width = currentSouceEl.outerWidth(true);
	        var height = currentSouceEl.outerHeight(true);
	
	        var offsetY = currentSouceEl.offset().top;
	        var offsetX = currentSouceEl.offset().left;
	
	        var scrollX = $(window).scrollLeft(),
	            scrollY = $(window).scrollTop();
	
	        var mouseX = e.clientX,
	            mouseY = e.clientY;
	
	        this.disX = mouseX - offsetX,
	        this.disY = mouseY - offsetY;
	
	        var ghostWrap = '<div id="ghostWrap"><div id="ghosetStatus" class="dragghost"></div></div>'
	        $('body').append(ghostWrap);
	        this.ghostEl = $('#ghostWrap');
	        var cloneEl = currentSouceEl.clone();
	        this.ghostEl.append(cloneEl);
	
	    	this.ghostStaus = this.ghostEl.find('#ghosetStatus');
	        var allStyle = this.getElAllStyle(e.srcElement || e.currentTarget);
	
	        cloneEl.css(allStyle);
	
	        cloneEl.css({
	            float:'left',
	            margin: 0
	        });
	
	        this.ghostEl.css({
	            position: 'absolute',
	            top: e.clientY + scrollY + 20,
	            left: e.clientX + scrollX + 10
	        });
	        doc.on('mousemove', $.proxy(this.doMouseMove, self));
	        
	        usitrip.plugin.HorizontalDragPlugin.superclass.doMouseDown.apply(this,arguments);
		}, self), 200);
		
        doc.on('mouseup', $.proxy(this.doMouseUp, self));
        
        $('body').on('selectstart', $.proxy(this.doDragUnSelect, self));
        if(Usitrip.isGecko){
        	$('body').css('-moz-user-select','none');
        };
    },

    /**
     * 重写鼠标移动接口
     * @param e
     */
    doMouseMove: function(e){
    	var scrollX = $(window).scrollLeft(),
        scrollY = $(window).scrollTop();
    	
        this.ghostEl && this.ghostEl.css({
            top: e.clientY + scrollY + 20,
            left: e.clientX + scrollX + 10
        });
        
        var targetEl = $(e.target);
        
        if(this.isBelongtoWrap(targetEl)){ //返回true 表示可以放下
        	this.ghostStaus.removeClass('error').addClass('right');
        } else {
        	this.ghostStaus.removeClass('right').addClass('error');
        }
        usitrip.plugin.HorizontalDragPlugin.superclass.doMouseMove.apply(this,arguments);
    },

    /**
     * 重写拖拽结束接口
     * @param e
     */
    doMouseUp: function(e){
    	clearTimeout(this.dragTimer);
    	this.dragTimer = null;
    	
    	if(!this.dragEl){
    		return ;
    	}
    	
    	var self = this;
    	var targetEl = $(e.target);
    	var brothersEl = this.dragEl.siblings();
    	
    	if(this.isBelongtoWrap(targetEl)){ // 返回true 表示可以放下
        	var minHorDis = 10000;
        	var minDisElPositon = '';
        	
        	var minVerDis = 10000;
        	var minDisElPositon = '';
        	
        	var minDisEl = {};
        	
    		for(var i=0,len=brothersEl.length;i<len;i++){
    			var el = $(brothersEl[i]);
    			var leftDis = Math.abs(el.offset().left - e.clientX - scrollX);
    			var rightDis = Math.abs(el.offset().left - e.clientX - scrollX + el.outerWidth());
    			var topDis = Math.abs(el.offset().top - e.clientY - scrollY);
    			var bottomDis = Math.abs(el.offset().top - e.clientY - scrollY + el.outerHeight());
    			
    			if(leftDis > rightDis && rightDis <= minHorDis){
    				minHorDis = rightDis;
    				minDisElPositon = 'after';
    				if(topDis > bottomDis && bottomDis <= minVerDis){
    					minVerDis = bottomDis;
    					minDisEl = el;
    				} else if(topDis <= minVerDis){
    					minVerDis = topDis;
    					minDisEl = el;
    				}
    			} else if(leftDis <= minHorDis){
    				minHorDis = leftDis;
    				minDisElPositon = 'before';
    				if(topDis > bottomDis && bottomDis <= minVerDis){
    					minVerDis = bottomDis;
    					minDisEl = el;
    				} else if(topDis <= minVerDis){
    					minVerDis = topDis;
    					minDisEl = el;
    				}
    			}
    			
    		}
    		
			if(minDisElPositon == 'before'){
				minDisEl.before(this.dragEl);
			} else {
				minDisEl.after(this.dragEl);
			}
    		
    		this.ghostEl.remove();
    		
        } else {
        	this.ghostEl.animate({ 
	    	    left: this.dragEl.offset().left,
	    	    top: this.dragEl.offset().top,
	    	    opacity: 0
        	}, 800, function(){
        		self.ghostEl.remove();
        	});
        }
    	usitrip.plugin.HorizontalDragPlugin.superclass.doMouseUp.apply(this,arguments);
    	this.destroy(e);
    },
    
    /**
     * @method destroy 销毁事件和元素
     */
    destroy: function(e){
        this.dragEl = null;//销毁拖拽元素，避免粘连鼠标
        $('body').unbind('selectstart', $.proxy(this.doDragUnSelect, self));
        var doc = $(document);
        doc.unbind('mousemove', $.proxy(this.doMouseMove, self));
        doc.unbind('mouseup', $.proxy(this.doMouseUp, self));
    },

    /**
     * @method getElAllStyle 获取所有的样式
     * @params {element} 原生的dom元素
     * @return {Object} 返回所有的样式
     */
    getElAllStyle: function(el){
        var allStyle = el.currentStyle ? el.currentStyle : window.getComputedStyle(el, null);
        var result = {};
        for(var p in allStyle){
            var value = allStyle[p];
            if(Usitrip.isIE && Usitrip.isString(value)){
                result[p] = value;
            } else {
                if(!isNaN(Number(p))){
                    result[value] = $(el).css(value);
                }
            }
        }
        return result;
    },
    
    /**
     * 禁止拖拽时选取文本
     * @method doDragUnSelect
     */
    doDragUnSelect: function(){
    	return false;
    },
    
    /**
     * 判断节点是否属于目标区域
     * @method isBelongtoWrap
     * @params currentTargetEl 要判断的节点
     * @return 
     */
    isBelongtoWrap: function(currentTargetEl){
    	for(var i=0,len=this.targetSelector.length;i<len;i++){
    		var t = this.targetSelector[i];
    		if(t == currentTargetEl[0] && t != this.dragEl[0]){
    			//console.log('true');
    			return true;
    		}
    	}
    	var el = this.targetSelector.has(currentTargetEl);
    	if(el.length > 0 && currentTargetEl[0] != this.dragEl[0]){
    		//console.log('true');
			return true;
    	}
    	//console.log('false');
    	return false;
    }
});