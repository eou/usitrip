/**
 * Created by lwkai on 2014-10-29.
 */

/**
 * 后台倍数插件
 */
Usitrip.ns('usitrip.plugin');
usitrip.plugin.MultiplePlugin  = function(config){
    Usitrip.apply(this, config);
    usitrip.plugin.MultiplePlugin.superclass.constructor.apply(this,arguments);
    this.init(config);
};


Usitrip.extend(usitrip.plugin.MultiplePlugin, usitrip.event.UsitripEvent, {

    /**
     * 事件对象
     */
    btnEl : null,

    /**
     * 需要算的对象
     */
    selector : null,

    /**
     * 每个对象的被乘数属性名称，必须写在对象元素上
     */
    multiplied:null,

    /**
     * 倍数对象(乘数对象：一个输入文本框)
     */
    multiplicand : null,

    init : function(cfg) {
        var self = this;
        this.btnEl.live('click',function(){
            var oTarget = $(self.selector);
            oTarget.each(function(index,el){
                self.setValue($(this),self.multiplicand.val());
            });
        });
    },

    setValue : function(obj,val) {
        var multip = obj.attr(this.multiplied);
        if (!isNaN(multip) && !isNaN(val)) {
            obj.val(parseFloat((parseFloat(multip) * val).toFixed(3)).toFixed(2));
        }
    }

});