/**
 * Created by YHB on 14-8-4.
 */


/**
 * @class usitrip.widget.Component
 * 该类作为最基本的组件,所有组件都将继承该类,在该类中,提供一系列接口,这些接口将由实现类具体实现
 *
 */
Usitrip.ns('usitrip.widget');
usitrip.widget.Component = function(config){
    usitrip.widget.Component.superclass.constructor.apply(this, arguments);
    this.addEvents(
        /**
         * @event beforerender
         * 组件渲染前
         * @params {object} component
         */
        'beforerender',

        /**
         * @event beforerender
         * 组件渲染后
         * @params {object} component
         */
        'afterrender',

        /**
         * @event beforerender
         * 组件显示前
         * @params {object} component
         */
        'beforeshow',

        /**
         * @event beforerender
         * 组件显示后
         * @params {object} component
         */
        'aftershow',

        /**
         * @event beforehide
         * 组件隐藏前
         * @params {object} component
         */
        'beforehide',

        /**
         * @event aftershow
         * 组件隐藏后
         * @params {object} component
         */
        'afterhide');

    this.initComponent(config);
}

Usitrip.extend(usitrip.widget.Component, usitrip.event.UsitripEvent, {


    /**
     * 给组件设置id
     * @cfg id {String}
     */
    id: null,

    /**
     * 将该组件渲染到的el节点下
     * @cfg el {String}
     */
    el: null,

    /**
     * 初始化值
     */
    value: null,

    /**
     * 组件初始化入口
     * @param config
     */
    initComponent: function(config){
        Usitrip.apply(this, config);
        this.originValue = value;
        this.render();
    },


    /**
     * 组件渲染入口
     */
    render: function(){
        if(this.fireEvent('beforerender', this) === false){
            return ;
        }
        this.doRender($(this.el));
        this.fireEvent('afterrender');
    },

    /**
     * 组件实际渲染
     * @param targetEl
     */
    doRender: function(targetEl){
        var html = '';
        targetEl.html(html);
        this.component = targetEl.child();
    },


    /**
     * @public
     * @method show 显示组件
     */
    show: function(){
        if(this.fireEvent('beforeshow', this) === false){
            return ;
        }
        this.show();
        this.fireEvent('aftershow');
    },

    /**
     * @public
     * @method hide 隐藏组件
     */
    hide: function(){
        if(this.fireEvent('beforehide', this) === false){
            return ;
        }
        this.hide();
        this.fireEvent('afterhide');
    }
});