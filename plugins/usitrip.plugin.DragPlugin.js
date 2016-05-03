/**
 * Created by YHB on 14-8-1.
 * @author YHB
 * @class usitrip.plugin.DragPlugin
 * @extend usitrip.plugin.UsitripEvent
 */
Usitrip.ns('usitrip.plugin');
usitrip.plugin.DragPlugin  = function(config){
    Usitrip.apply(this, config);
    usitrip.plugin.DragPlugin.superclass.constructor.apply(this,arguments);
    this.init(config);

    this.addEvents('startdrag', 'movedrag', 'enddrag');
}


Usitrip.extend(usitrip.plugin.DragPlugin, usitrip.event.UsitripEvent, {

    /**
     * @cgf {jquerEl} sourceSelector
     * 源节点 被拖拽起来的节点
     */
    sourceSelector: null,

    /**
     * @cgf {jquerEl} targetSelector
     * 目标
     */
    targetSelector: null,
    
    /**
     * 拖拽的延时执行
     */
    dragTimer: null,

    /**
     * 初始化中
     * @param cfg
     */
    init: function(cfg){

        var self = this;

        this.ghostEl = null;

        /**
         * 监听鼠标按下事件
         */
        this.sourceSelector.on('mousedown', $.proxy(this.doMouseDown, self));
    },

    /**
     * 定义开始拖拽接口
     * @param e
     */
    doMouseDown: function(e){
    	this.fireEvent('startdrag', this, e);
    },

    /**
     * 定义拖拽移动过程中的接口
     * @param e
     */
    doMouseMove: function(e){
        this.fireEvent('movedrag', this, e);
    },

    /**
     * 定义拖动结束接口
     * @param e
     */
    doMouseUp: function(e){
        this.fireEvent('enddrag', this, e);
    }
});