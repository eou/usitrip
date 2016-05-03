/**
 * Created by YHB on 14-8-4.
 */

Usitrip.ns('usitrip.widget');

usitrip.widget.TextField = function(config){
    usitrip.widget.TextField.superclass.constructor.apply(this, arugments);

    this.addEvents(
        /**
         * @event keydown
         * @params {object} component
         * @params {object} ev
         */
        'keydown',

        /**
         * @event keyup
         * @params {object} component
         * @params {object} ev
         */
        'keyup');
}

Usitrip.extend(usitrip.widget.TextField, usitrip.widget.Field , {

    /**
     * 渲染
     * @param targetEl
     */
    doRender: function(targetEl){
        usitrip.widget.TextField.superclass.doRender.apply(this, targetEl);
        var html = '<input type="text" class="usi-textfield" style="height:' + this.height + 'px;width:' + this.width + ';">';
        targetEl.html(html);
        this.component = targetEl.child();
        initEvent();
    },

    /**
     * @method setValue 设置值
     * @param value
     */
    setValue: function(value){
        this.component.val(value);
    },

    /**
     * @method getValue 获得值
     * @returns {*}
     */
    getValue: function(){
        return this.component.val(value);
    }
});