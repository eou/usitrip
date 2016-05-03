/**
 * Created by YHB on 14-8-4.
 */

Usitrip.ns('usitrip.widget');

usitrip.widget.Field = function(config){
    usitrip.widget.Field.superclass.constructor.apply(this, arugments);
    this.addEvents(
        /**
         * @event keydown  键盘按下
         * @params {object} component 当前组件 当前组件
         * @params {object} ev 事件
         */
        'keydown',

        /**
         * @event keyup 键盘按下后弹起
         * @params {object} component 当前组件
         * @params {object} ev
         */
        'keyup',

        /**
         * @event stylechange 当前组件样式发生改变
         * @params {object} component 当前组件
         * @params {object} style 样式对象
         */
        'stylechange',

        /**
         * @event classchange 当前组件的class属性变化
         * @params {object} component 当前组件
         * @params {string} type 三种类型 add remove removeAll
         * @params {string} clazz 新增或者删除的class名
         */
        'classchange',

        /**
         * @event beforedestroy 组件销毁前
         * @params {object} component 当前组件
         */
        'beforedestroy',

        /**
         * @event afterdestroy 组件销毁后
         * @params {object} component 当前组件
         */
        'afterdestroy',

        /**
         * @event beforefocus 组件获得焦点前
         * @params {object} component 当前组件
         */
        'beforefocus',

        /**
         * @event focus 组件获得焦点后
         * @params {object} component 当前组件
         */
        'focus',

        /**
         * @event disabled 组件disabled状态改变
         * @params {object} component 当前组件
         * @params {boolean} disabled
         */
        'disabled',

        /**
         * @event height 组件高度发生改变
         * @params {object} component 当前组件
         * @params {number} height 改变的高度
         */
        'height',

        /**
         * @event pageposition 组件设置相当于窗口的位置
         * @params {object} component 当前组件
         * @params {object} positionObj 相当于窗口位置的值
         */
        'pageposition',

        /**
         * @event position 组件的定位改变
         * @params {object} component 当前组件
         * @params {String} position 组件的定位
         */
        'position',

        /**
         * @event readonly  组件readOnly状态改变
         * @params {object} component 当前组件
         * @params {boolean} readOnly
         */
        'readonly',

        /**
         * @event resize 组件大小改变
         * @params {object} component 当前组件
         * @params {object} size
         */
        'resize',

        /**
         * @event visible 组件可见状态状态改变
         * @params {object} component 当前组件
         * @params {boolean} visible
         */
        'visible',

        /**
         * @event width 组件宽度改变
         * @params {object} component 当前组件
         * @params {number} width
         */
        'width',

        /**
         * @event validate
         * @params {object} component 当前组件
         * @params {String} reg
         */
        'validate',

        /**
         * @event valuechange
         * @params {object} component 当前组件
         * @params {String/Boolean/Number/Object} oldValue
         *  @params {String/Boolean/Number/Object} newValue
         */
        'valuechange'
    );
}

Usitrip.extend(usitrip.widget.Field, usitrip.widget.Component , {

    /**
     * @cfg {String} reg
     * 输入时的验证正则
     */
    reg: null,


    /**
     * @cfg {number} height
     * 组件的初始化高度
     */
    height: 24,


    /**
     * @cfg {number} width
     * 组件的初始化宽度
     */
    width: 120,

    doRender: function(targetEl){
        usitrip.widget.Field.superclass.doRender.apply(this, targetEl);
    },

    initEvent: function(){
        usitrip.widget.Field.superclass.initEvent.apply(this, targetEl);
        this.component.keydown(function(ev){
            if(this.fireEvent('keydown', this, ev) === false) {
                return;
            }
        });

        this.component.keyup(function(ev){
            this.fireEvent('keyup', this, ev);
        });
    },

    /**
     * @method setStyle 给组件设置样式
     * @param style {Object} 样式
     */
    setStyle: function(style){
        this.component.css(style);
        this.fire('stylechange', this, style);
    },

    /**
     * @method addClass 增加CLASS
     * @param clazz {String} class名
     */
    addClass: function(clazz){
        this.component.addClass(clazz);
        this.fireEvent('classchange', this, 'add', clazz);
    },

    /**
     * @method removeClass 删除Class
     * @param clazz {String} class名
     */
    removeClass: function(clazz){
        this.component.removeClass(clazz);
        this.fireEvent('classchange', this, 'remove', clazz);
    },

    /**
     * @method removeAllClass 删除所有的class样式
     */
    removeAllClass: function(){
        this.component.removeAllClass();
        this.fireEvent('classchange', this, 'removeall');
    },

    /**
     * @method destroy 销毁组件,同时绑定的事件都将销毁
     */
    destroy: function(){
        if(this.fireEvent('beforedestroy', this) === false) {
            return;
        }
        this.component.remove();
        this.fireEvent('afterdestroy', this);
    },


    /**
     * @method focus 让组件获取焦点
     */
    focus: function(){
        if(this.fireEvent('beforefocus', this) === false) {
            return;
        }
        this.component.focus();
        this.fireEvent('focus', this)
    },

    /**
     * @method getHeight 获取组件的高度
     * @returns {number} 返回组件的高度
     */
    getHeigh: function(){
        return this.component.height();
    },

    /**
     * @method getWidth 获取组件的宽度
     * @returns {number} 返回组件的宽度
     */
    getWidth: function(){
        return this.component.width();
    },

    /**
     * @method getId 获取组件的ID
     * @returns {number} 返回组件的ID
     */
    getId: function(){
        return this.component.att('id');
    },

    /**
     * @method getClass 获取组件的Class
     * @returns {number} 返回组件的Class
     */
    getClass: function(){
        return this.component.att('class');
    },

    /**
     * @method getPosition 获取组件的定位
     * @returns {number} 返回组件的定位
     */
    getPosition: function(){
        return this.component.css('position');
    },

    /**
     * @method getOutSize 获取组件的尺寸(包含边距)
     * @returns {{width: *, height: *}}
     */
    getOutSize: function(){
        return {
            width: this.component.outerWidth(),
            height: this.component.outerHeight()
        }
    },

    /**
     * @method getSize 获取组件的尺寸(不包含边距)
     * @returns {{width: *, height: *}}
     */
    getSize: function(){
        return {
            width: this.component.width(),
            height: this.component.height()
        }
    },

    /**
     * @method isDirty 是否是脏数据(修改过的)
     * @returns {boolean}
     */
    isDirty: function(){
        if(this.getValue() === this.originValue){
            return false;
        } else {
            return true;
        }
    },

    /**
     * @method isVisible 组件是否是显示的
     * @returns {boolean}
     */
    isVisible: function(){
        return this.component.is(':show');
    },

    /**
     * @method 重置数据
     */
    reset: function(){
        this.fireEvent('reset', this);
    },

    /**
     * @method setDisabled 设置组件disabled状态
     * @param disabled {boolean}
     */
    setDisabled: function(disabled){
        this.component.attr('disabled', !!disabled);
        this.fireEvent('disabled', this, disabled);
    },

    /**
     * @method setHeight 设置组件的高度
     * @param height {number}
     */
    setHeight: function(height){
        this.component.css('height', height);
        this.fireEvent('height', this, height);
    },

    /**
     * @method setPagePosition 设置组件相对于当前页面的样式
     * @param positionObj 包括 left 和 top 的值
     */
    setPagePosition: function(positionObj){
        this.component.css(positionObj);
        this.fireEvent('pageposition', this, positionObj);
    },

    /**
     * @method setPosition 设置元素的定位
     * @param position {String}
     */
    setPosition: function(position){
        this.component.css('position', position);
        this.fireEvent('position', this, position);
    },

    /**
     * @method setReadOnly 设置组件的只读
     * @param readOnly {boolean}
     */
    setReadOnly: function(readOnly){
        this.component.css('readOnly', !!readOnly);
        this.fireEvent('readonly', this, readOnly);
    },

    /**
     * @method setSize 设置组件的宽高
     * @param size {Object} 包括width和height两个属性
     */
    setSize: function(size){
        this.component.css(size);
        this.fireEvent('resize', this, size);
    },

    /**
     * @method setVisible 设置组件是否可见
     * @param visible {boolean}
     */
    setVisible: function(visible){
        this.component.css('visibility', visible ? 'visible' : 'hidden');
        this.fireEvent('visible', this, visible);
    },

    /**
     * @method setWidth 设置组件的宽度
     * @param width {number}
     */
    setWidth: function(width){
        this.component.width(width);
        this.fireEvent('width', this, width);
    },

    /**
     * @method vilidate 在输入的时候的验证
     * @param reg 需要验证的正则表达式,如没有则获取当前组件的reg属性
     */
    validate: function(reg){
        reg = reg || this.reg;
        this.fireEvent('validate', this, reg);
    },

    /**
     * @method setValue 设置值
     * @value {obj} value
     */
    setValue: function(value){
        var oldValue = this.getValue();
        this.value = value;
        this.fireEvent('valuechange', this, oldValue, value);
    },

    /**
     * @method getValue 获取组件的值
     * @returns {obj}
     */
    getValue: function(){
        return this.value;
    }
});