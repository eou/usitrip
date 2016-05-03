Usitrip.ns('usitrip.widget');
usitrip.widget.Lang = function(config) {
    usitrip.widget.Lang.superclass.constructor.apply(this,arguments);
    this.addEvents('beforerender', 'afterrender');//绑定事件
    this.initComponent(config);//初始化构造函数
};

Usitrip.extend(usitrip.widget.Lang, usitrip.event.UsitripEvent, {

    /**
     * 将该组件渲染到的节点
     */
    el: '',

    initValue : {
        data : {},
        Langs:[{code:'zh',
               directory:'chinese',
               id:'2',
               name:"简体中文"
        }]

    },

    /**
     * 构造函数
     * @param config
     */
    initComponent: function(config) {
        Usitrip.apply(this.initValue, config.initValue);
        Usitrip.apply(config.initValue, this.initValue);
        Usitrip.apply(this,config);
        this.render(this.el);
    },

    /**
     * 演染主入口
     */
    render:function(el){
        if (this.fireEvent('beforerender',this) === false) {
            return;
        }
        this.doRender(el);
        this.fireEvent('afterrender');
    },

    /**
     * 演染操作
     * @param el
     */
    doRender: function(el) {
        var arr = this.initValue.cp;
        var langs = this.initValue.Langs;
        for(var i = 0, lena = arr.length;i<lena;i++){
            var cla = arr[i];
            var par = $(el).find(cla).parent();
            var clone = par.html();
            par.html('');
            for(var j = 0,len = langs.length;j<len; j++){
                par.append(clone);
                var last = par.children().last();
                switch(i){
                    case 0:last.html(langs[j].name);break;
                    case 1:last.attr('langid',langs[j].id);
                        break;
                };
            }
        };

    }
});