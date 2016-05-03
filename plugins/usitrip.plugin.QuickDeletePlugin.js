/**
 * Created by YHB on 14-7-31.
 */
Usitrip.ns('usitrip.plugin');
usitrip.plugin.QuickDeletePlugin = function(config) {
    usitrip.plugin.QuickDeletePlugin.superclass.constructor.apply(this,arguments);
    this.init(config);
};

Usitrip.extend(usitrip.plugin.QuickDeletePlugin, usitrip.event.UsitripEvent, {

    /*
    * 需要增加快速删除的选择器
    * */
    selector: 'input[type=text]',

    /*
     * 点击删除图标时执行的回调
     */
    _click : null,
    /**
     * 初始化组件
     * @param config
     */
    init: function(config) {
        Usitrip.apply(this, config);
        var oInputs = $(this.selector);
        // 为了兼容原来对输入框的事件响应，此为原来默认要执行的方法
        if(this._click == null) {
            this._click = function(){
                var oInput = $(this).prev();
                oInput.val('');
                $(this).hide();
                oInput.focus();
            }
        }
        this.render(oInputs);
    },

    render: function(oInputs){
        var html = '<div class="quick-delete"></div>';
        var self = this;
        oInputs.each(function() {
            var oInput = $(this);
            if(oInput.attr("readonly") || oInput.attr("disabled")){
            }else{
                var oParent = oInput.parent();
                var oparentPos = oParent.css('position');
                if (oparentPos == 'absolute' || oparentPos == 'fixed') { //绝对定位 或固定定位
                    oParent.wrapInner(function() { //在外面包裹一层作为定位元素
                        return '<div class="quickPosi" />';
                    });
                } else {
                    oParent.css('position', 'relative');
                }
                oInput.after(html);
                var oQuickDelete = oInput.next();
                self.ininEvent(oQuickDelete, oInput)
            }
        });
    },

    /**
     * @private initPosition 初始化位置
     * @oQuickDelete {Object} 快速删除的小按钮
     * @oInput {Object} 输入框
     */
    initPosition: function(oQuickDelete, oInput){

        var marTop = oInput.css('marginTop');
        var paddTop = oInput.css('paddingTop');
        var borderTop = oInput.css('borderTop');
        var posiTop = oInput.position().top;

        marTop = marTop ? parseFloat(marTop) : 0;
        paddTop = paddTop ? parseFloat(paddTop) : 0;
        borderTop = borderTop ? parseFloat(borderTop) : 0;
        posiTop = posiTop ? parseFloat(posiTop) : 0;
        var size = (oInput.height()/oQuickDelete.height() * 100);
        if (size >= 100) size = 100;
        oQuickDelete.css({
            top:  marTop + paddTop + borderTop + posiTop,
            backgroundSize: size + '%'
        });

        var marginLeft = oInput.css('marginLeft');
        var paddingLeft = oInput.css('paddingLeft');
        var borderLeft = oInput.css('borderLeft');
        var posiLeft = oInput.position().left;

        marginLeft = marginLeft ? parseFloat(marginLeft) : 0;
        paddingLeft = paddingLeft ? parseFloat(paddingLeft) : 0;
        borderLeft = borderLeft ? parseFloat(borderLeft) : 0;
        posiLeft = posiLeft ? parseFloat(posiLeft) : 0;

        oQuickDelete.css({
            left: oInput.width() - oQuickDelete.width() * parseFloat(oQuickDelete.css('backgroundSize')) / 100
                + marginLeft + paddingLeft + borderLeft + posiLeft
        });
    },

    /**
     * @private ininEvent 初始化事件
     * @oQuickDelete {Object} 快速删除的小按钮
     * @oInput {Object} 输入框
     */
    ininEvent: function(oQuickDelete, oInput){
        var self = this;
        var tag = oInput.get(0).tagName;
        if(tag == 'INPUT' || tag == 'TEXTAREA') {
            oInput.focusin(function(){
                if($(this).val()){
                    self.initPosition(oQuickDelete, oInput);
                    oQuickDelete.show();
                } else {
                    oQuickDelete.hide();
                }
            });

            oInput.focusout(function(){
                setTimeout(function(){
                    oQuickDelete.hide();
                }, 300);
            });

            oInput.keyup(function(){
                if($(this).val()){
                    self.initPosition(oQuickDelete, oInput);
                    oQuickDelete.show();
                } else {
                    oQuickDelete.hide();
                }
            });
        } else {
            oInput.parent().hover(function(){
                    self.initPosition(oQuickDelete, oInput);
                    oQuickDelete.toggle();
            });

        }
        // 点击删除图标时，执行相应操作
        oQuickDelete.click(self._click);


    }
});