/**国家、地区、省份选择模块**/
Usitrip.ns('usitrip.widget');
usitrip.widget.Area = function(config) {
    usitrip.widget.Area.superclass.constructor.apply(this,arguments);
    this.addEvents('beforerender', 'afterrender', 'countrydone', 'provincedone', 'citydone');
    this.initComponent(config);
};

Usitrip.extend(usitrip.widget.Area, usitrip.event.UsitripEvent, {
    /**
     * AJAX请求的URL地址
     *
     * ajaxUrl {String}
     */
    ajaxUrl : '',

    /**
     * 将该组件渲染到的节点
     */
    el: '',

    initValue : {
        data : {},
        country_name : 'country',
        province_name : 'province',
        city_name : 'city',
        defaultCountry : {name: '请选择国家',id:'',func: $.noop},
        defaultProvince : {name: '州/省', id: '',func: $.noop},
        defaultCity : {name: '城市', id: '', func: $.noop}
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
        this.doEvent();
        this.initData();
    },
    /**
     * 初始化已选数据，如果用户已经选了国家省等，则需要找到他的I J值
     */
    initData: function(){
        /**
         * @private alreadyInitData
         * 保存已经初始化的数据标记
         */
        this.alreadyInitData={};
        // 国家的I J
        var country_val,province_val,
            c_i,c_j,p_i,p_j;

        var findIndex = function(arr,id,obj){
            for(var i= 0,len=arr.length;i<len;i++) {
                for(var j= 0,j_len = arr[i].list.length;j<j_len;j++) {
                    if (id == arr[i].list[j].id) {
                        obj.attr('i',i).attr('j',j);
                        i=len;
                        break;
                    }
                }
            }
        };

        /**
         * 预找国家数据
         * @type {*}
         */
        var initCountryData = function(){
            country_val = this.country_input.val();
            if (country_val) {
                if (this.initValue.data.hasOwnProperty('title')) {
                    findIndex(this.initValue.data.tag,country_val,this.country_input);
                    $.proxy(initProvinceData,this)();
                } else {
                    this.ajax({'action':'getCountry'}, $.proxy(function(data,json){
                        if (json) {
                            json.defaultId = country_val;
                            this.show('getCountry',json,false);
                            try{
                                if (this.initValue.data.hasOwnProperty('title') && this.initValue.data.tag) {
                                    findIndex(this.initValue.data.tag,country_val,this.country_input);
                                    $.proxy(initProvinceData,this)();
                                }
                            } catch(e) {
                                throw e.getErrorMessage();
                            }
                        }
                    },this));
                }
            }
        };



        var initProvinceData = function(){
            /**
             * 预找省份数据
             * @type {*}
             */
            province_val = this.province_input.val();
            if (province_val) {
                this.showTag = 'J-province-tab';
                c_i = this.country_input.attr('i');
                c_j = this.country_input.attr('j');
				if(!this.country_input.val() || this.country_input.val() == '0'){
					return ;
				}
                if (this.initValue.data.tag[c_i].list[c_j].hasOwnProperty('data')) {
                    findIndex(this.initValue.data.tag[c_i].list[c_j].data.tag,province_val,this.province_input);
                    $.proxy(initCityData,this)();
                } else {
                    this.ajax({'action':'getProvince','country_id':country_val}, $.proxy(function(data,json){
                        if (json) {
                            json.defaultId = province_val;
                            this.show('getProvince',json,false);
                            try{
                                if (this.initValue.data.tag[c_i].list[c_j].hasOwnProperty('data') && this.initValue.data.tag[c_i].list[c_j].data.tag) {
                                    findIndex(this.initValue.data.tag[c_i].list[c_j].data.tag,province_val,this.province_input);
                                    $.proxy(initCityData,this)();
                                }
                            } catch(e) {
                                throw e.getErrorMessage();
                            }
                        }
                    },this));
                }
            }
        };


        var initCityData = function(){
            var city_val = this.city_input.val();
            if (city_val) {
                this.showTag = 'J-city-tab';
                c_i = this.country_input.attr('i');
                c_j = this.country_input.attr('j');
                p_i = this.province_input.attr('i');
                p_j = this.province_input.attr('j');
                if (this.initValue.data.tag[c_i].list[c_j].data.tag[p_i].list[p_j].hasOwnProperty('data')) {
                    findIndex(this.initValue.data.tag[c_i].list[c_j].data.tag[p_i].list[p_j].data.tag,city_val,this.city_input);
                } else {
                    this.ajax({'action':'getCity','zone_id':province_val}, $.proxy(function(data,json){
                        if (json) {
                            json.defaultId = city_val;
                            this.show('getCity',json,false);
                            try{
                                if (this.initValue.data.tag[c_i].list[c_j].data.tag[p_i].list[p_j].hasOwnProperty('data') && this.initValue.data.tag[c_i].list[c_j].data.tag[p_i].list[p_j].data.tag) {
                                    findIndex(this.initValue.data.tag[c_i].list[c_j].data.tag[p_i].list[p_j].data.tag,city_val,this.city_input);
                                }
                            } catch(e) {
                                throw e.getErrorMessage();
                            }
                        }
                    },this));
                }
            }
        };

        $.proxy(initCountryData,this)();
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
        var opt = {data:{title:''}};
        var content = '<span class="uc-chgplace" id="ucSelectCountry">' +
            '<i>' + this.initValue.defaultCountry.name + '</i>' +
            '<input type="hidden" name="' + this.initValue.country_name + '" value="' + this.initValue.defaultCountry.id + '">' +
            '</span>\n' +
            '<span class="uc-chgplace" id="ucSelectProvince"><i>' + this.initValue.defaultProvince.name + '</i>' +
            '<input type="hidden" name="' + this.initValue.province_name + '" value="' + this.initValue.defaultProvince.id + '"/></span>\n' +
            '<span class="uc-chgplace" id="ucSelectCity"><i>' + this.initValue.defaultCity.name + '</i>' +
            '<input type="hidden" name="' + this.initValue.city_name + '" value="' + this.initValue.defaultCity.id + '"/></span>';

        content += '<div class="ucPlaceDialog J_Country" title="" style="display:none">' +
            '<div class="d_hd">' +
            '<a href="javascript:;" class="close J_CloseCountry">x</a>' +
            '<h4><span class="J-title"></span><span style="display:none;">(按名称开头字母查看，支持方向键"← →"切换字母，"↑ ↓"选择国家，首字母搜索)</span></h4>' +
            '</div>' +
            '<div class="d_cont uifix J-CountryTab">' +
            '</div>' +
            '<div class="place_cont J-CountryCon"></div>' +
            '<div class="d_foot"><a href="javascript:;" class="d_btn J-okCountry">确定</a>' +
            '<a href="javascript:;" class="d_btn J_CloseCountry">取消</a></div>' +
            '</div>';
        $(el).html(content);
    },

    /**
     * 取回数据
     * @param data
     */
    ajax: function(data,callback){
        var me = this;
        $.post(this.ajaxUrl, data, function(json){
            json.defaultId = data.hasOwnProperty('country_id') ? data.country_id : data.hasOwnProperty('zone_id') ? data.zone_id : json.defaultId;
            if(typeof callback == 'function'){
                $.proxy(callback,me)(data.action,json);
            }
        },'json');
    },

    /**
     * ajax 取回数据
     * @param data 要传到服务器去的参数对象
     */
    validation: function(data){
        var tmp;
        switch (data.action) {
            case 'getCountry':
                if (this.initValue.data.hasOwnProperty('title') && this.initValue.data.hasOwnProperty('tag')) {
                    this.show(data.action);
                } else {
                    this.ajax(data,this.show);
                }
                break;
            case 'getProvince':
                var _i = this.country_input.attr('i');
                var _j = this.country_input.attr('j');
                if (!isNaN(_i) && !isNaN(_j)) {
                    try{
                        tmp = this.initValue.data.tag[_i].list[_j];
                        if (tmp.hasOwnProperty('data') && tmp.data.hasOwnProperty('title') && tmp.data.hasOwnProperty('tag')) {
                            this.show(data.action);
                        } else {
                            this.ajax(data,this.show);
                        }
                    } catch (e) {
                        //throw e.getErrorMessage();
                    }
                }
                break;
            case 'getCity':
                var c_i = this.country_input.attr('i');
                var c_j = this.country_input.attr('j');
                var p_i = this.province_input.attr('i');
                var p_j = this.province_input.attr('j');
                if (!isNaN(c_i) && !isNaN(c_j) && !isNaN(p_i) && !isNaN(p_j)) {
                    try{
                        tmp = this.initValue.data.tag[c_i].list[c_j].data.tag[p_i].list[p_j];
                        if (tmp.hasOwnProperty('data') && tmp.data.hasOwnProperty('title') && tmp.data.hasOwnProperty('tag')) {
                            this.show(data.action);
                        } else {
                            data.zone_id && this.ajax(data,this.show);
                        }
                    } catch (e) {
                        //throw e.getErrorMessage();
                    }
                }
                break;
        }
    },

    /**
     * 绑定事件
     */
    doEvent: function(){
        var el = this.el;
        this.areaWrap = $(el).find('.J_Country');
        this.country = $(el).find('#ucSelectCountry');
        this.province = $(el).find('#ucSelectProvince');
        this.city = $(el).find('#ucSelectCity');
        this.closeBtn = $(el).find('.J_CloseCountry');
        this.title = $(el).find('.J-title');
        this.dCountryTab = $(el).find('.J-CountryTab');
        this.dCountryCon = $(el).find('.J-CountryCon');
        this.j_ok = $(el).find('.J-okCountry');
        this.country_input = $(el).find('input[name="' + this.initValue.country_name + '"]');
        this.province_input = $(el).find('input[name="' + this.initValue.province_name + '"]');
        this.city_input = $(el).find('input[name="' + this.initValue.city_name + '"]');

        /**
         * 让整个DIV上的点击都不触发隐藏事件
         */
        this.areaWrap.click(function(event){
            event.stopPropagation();
        });

        /**
         * 点击国家的事件
         */
        this.country.click($.proxy(function(event){
            this.hide();
            this.showTag = 'J-country-tab';
            this.validation({'action':'getCountry'});
            event.stopPropagation();
        },this));

        this.province.click($.proxy(function(event){
            this.hide();
            this.showTag = 'J-province-tab';
            var cid = this.country_input.val();
            this.validation({'action':'getProvince','country_id':cid});
            event.stopPropagation();
        },this));

        this.city.click($.proxy(function(event){
            this.hide();
            this.showTag = 'J-city-tab';
            var cid = this.province_input.val();
            this.validation({'action':'getCity','zone_id':cid});
            event.stopPropagation();
        },this));

        this.closeBtn.click($.proxy(function(event){
            this.hide();
            event.stopPropagation();
        },this));

        /**
         * 选好了点确定时的事件
         */
        this.j_ok.click($.proxy(function(event){
            this.hide();
            var tmp, i, j, pi, pj;
            switch (this.showTag) {
                case 'J-country-tab':
                    tmp = this.areaWrap.find('input[name="' + this.showTag + '_opt"]:checked');
                    if (tmp.length > 0) {
                        if (tmp.val() != this.country_input.val()) {
                            this.province_input.val('').parent().find('i').html('州/省');
                            this.city_input.val('').parent().find('i').html('城市');
                        }
                        this.country_input.val(tmp.val()).attr('i',tmp.attr('i')).attr('j',tmp.attr('j'));
                        this.country_input.parent().find('i').html(tmp.parents('label').text());
                        this.fireEvent('countrydone');
                    }
                    break;
                case 'J-province-tab':
                    i = this.country_input.attr('i');
                    j = this.country_input.attr('j');
                    tmp = this.areaWrap.find('input[name="' + this.showTag + i + j + '_opt"]:checked');
                    if (tmp.length) {
                        if (tmp.val() != this.province_input.val()) {
                            this.city_input.val('').parent().find('i').html('城市');
                        }
                        this.province_input.val(tmp.val()).attr('i',tmp.attr('i')).attr('j',tmp.attr('j'));
                        this.province_input.parent().find('i').html(tmp.parents('label').text());
                        this.fireEvent('provincedone');
                    }
                    break;
                case 'J-city-tab':
                    i = this.country_input.attr('i');
                    j = this.country_input.attr('j');
                    pi = this.province_input.attr('i');
                    pj = this.province_input.attr('j');
                    tmp = this.areaWrap.find('input[name="' + this.showTag + i + j + pi + pj + '_opt"]:checked');
                    if (tmp.length) {
                        this.city_input.val(tmp.val()).attr('i',tmp.attr('i')).attr('j',tmp.attr('j'));
                        this.city_input.parent().find('i').html(tmp.parents('label').text());
                        this.fireEvent('citydone');
                    }
                    break;
            }

            event.stopPropagation();


        },this));

        //TAB选项卡事件
        var me = this;
        this.dCountryTab.delegate('li','click', function(){
            var cls = $(this).parents('div').attr('cls');
            var index =$(this).parents('div').find('li').removeClass('current').index($(this));
            $(this).addClass('current');
            me.dCountryCon.find('.' + cls + ' > div').hide().eq(index).show();
        });

        // 点页面其他地方隐藏窗体
        $(document).click($.proxy(this.hide, this));
    },

    /**
     * 添加数据
     * @param tag
     * @param i
     * @param j
     * @param pi
     * @param pj
     */
    addData: function(tag,i,j,pi,pj) {
        var already,selectIndex,htmlTag,htmlCon,tmp;

        var initHtmlTab = function(arr,tagName) {
            var rtn = '<div class="' + tagName + '" cls="' + tagName + '"><ul class="dCountryTab">';
            for(var i= 0,len=arr.length;i<len;i++) {
                rtn += '<li>' + arr[i].text + '</li>';
            }
            rtn += '</ul></div>';
            return rtn;
        };

        var initHtmlCon = function(arr,selectId,tagName) {
            var rtn = '<div class="' + tagName + '">';
            for(var i= 0,len=arr.length;i<len;i++) {
                rtn += '<div class="dCountryLabel">';
                for(var j= 0,j_len = arr[i].list.length;j<j_len;j++){
                    rtn += '<label for="' + tagName + '_' + i + '_' + j + '">' +
                        '<input type="radio" i="' + i + '" j="' + j + '" id="' + tagName + '_' + i + '_' + j + '" name="' + tagName + '_opt" value="' + arr[i].list[j].id + '"';
                    if (selectId == arr[i].list[j].id) {
                        selectIndex = i;
                    }
                    rtn += '/>' +
                        '<span>' + arr[i].list[j].text + '</span></label>';
                }
                rtn += '</div>';
            }
            rtn += '</div>';
            return rtn;
        };

        switch(tag){
            case 'getCountry':
                tmp = this.initValue.data;
                already = this.alreadyInitData;
                selectIndex = 0;
                htmlTag = initHtmlTab(tmp.tag,this.showTag);
                htmlCon = initHtmlCon(tmp.tag,tmp.defaultId,this.showTag);
                this.dCountryTab.append(htmlTag).children().hide();
                this.dCountryCon.append(htmlCon).children().hide();
                //this.alreadyInitData.country.html_tag = html;
                already.title = tmp.title;
                this.dCountryTab.find('.' + this.showTag).show().find('li').eq(selectIndex).addClass('current');
                // 初始化后的默认选择值
                if (typeof tmp.defaultId != 'undefined' && !isNaN(tmp.defaultId)) {
                    this.dCountryCon.find('.' + this.showTag).show().find('div').eq(selectIndex).show().find('input[value="' + tmp.defaultId + '"]').attr('checked',true);
                }
                break;
            case 'getProvince':
                tmp = this.initValue.data.tag[i].list[j].data;
                already = this.alreadyInitData;

                already.Province = already.Province || [];
                already.Province[i] = already.Province[i] || [];
                already.Province[i][j] = already.Province[i][j] || {};
                selectIndex = 0;
                htmlTag = initHtmlTab(tmp.tag,this.showTag + i + j);
                htmlCon = initHtmlCon(tmp.tag,tmp.defaultId,this.showTag + i + j);
                this.dCountryTab.append(htmlTag).children().hide();
                this.dCountryCon.append(htmlCon).children().hide();
                //this.alreadyInitData.country.html_tag = html;
                already.Province.title = already.Province.title || tmp.title;

                this.dCountryTab.find('.' + this.showTag + i + j).show().find('li').eq(selectIndex).addClass('current');
                // 初始化后的默认选择值
                if (typeof tmp.defaultId != 'undefined') {
                    this.dCountryCon.find('.' + this.showTag + i + j).show().find('div').eq(selectIndex).show().find('input[value="' + tmp.defaultId + '"]').attr('checked',true);
                }
                break;
            case 'getCity':
                var city_data = this.initValue.data.tag[i].list[j].data.tag[pi].list[pj].data;
                already = this.alreadyInitData.Province[i][j];
                already.City = already.City || [];
                already.City[pi] = already.City[pi] || [];
                already.City[pi][pj] = already.City[pi][pj] || {};
                //this.alreadyInitData.Province[i][j].id = this.showTag;
                selectIndex = 0;
                htmlTag = initHtmlTab(city_data.tag,this.showTag + i + j + pi + pj);
                htmlCon = initHtmlCon(city_data.tag,city_data.defaultId,this.showTag + i + j + pi + pj);
                this.dCountryTab.append(htmlTag).children().hide();
                this.dCountryCon.append(htmlCon).children().hide();
                //this.alreadyInitData.country.html_tag = html;
                already.City.title = already.City.title || city_data.title;

                this.dCountryTab.find('.' + this.showTag + i + j + pi + pj).show().find('li').eq(selectIndex).addClass('current');
                // 初始化后的默认选择值
                if (typeof city_data.defaultId != 'undefined') {
                    this.dCountryCon.find('.' + this.showTag + i + j + pi + pj).show().find('div').eq(selectIndex).show().find('input[value="' + city_data.defaultId + '"]').attr('checked',true);
                }
        }
    },


    show: function(tag,data,show){

        /**
         * 显示国家
         */
        var showCountry = function(){
            var tmp = this.initValue.data;
            var already = this.alreadyInitData;
            if (tmp.hasOwnProperty('title') && !already.hasOwnProperty('title')) {
                this.title.html(tmp.title);
                this.addData(tag);
            } else {
                this.title.html(already.title);
                this.dCountryTab.children().hide().parent().find('.' + this.showTag).show();
                this.dCountryCon.children().hide().parent().find('.' + this.showTag).show();
            }
        };

        /**
         * 显示省
         */
        var showProvince = function(i,j){
            var tmp = this.initValue.data.tag[i].list[j].data;
            var already = this.alreadyInitData;
            if (tmp.hasOwnProperty('title') && (!already.hasOwnProperty('Province') || typeof already.Province[i] == 'undefined'
                    || typeof already.Province[i][j] == 'undefined')) {
                this.title.html(tmp.title);
                this.addData(tag,i,j);
            } else {
                this.title.html(already.Province.title);
                this.dCountryTab.children().hide().parent().find('.' + this.showTag + i + j).show();
                this.dCountryCon.children().hide().parent().find('.' + this.showTag + i + j).show();
            }
        };

        /**
         * 显示市
         */
        var showCity = function(c_i,c_j,p_i,p_j) {
            var city_data = this.initValue.data.tag[c_i].list[c_j].data.tag[p_i].list[p_j].data;
            var already = this.alreadyInitData.Province[c_i][c_j];
            if (city_data.hasOwnProperty('title') &&
                (!already.hasOwnProperty('City') || typeof already.City[p_i] == 'undefined'
                    || typeof already.City[p_i][p_j] == 'undefined')) {
                this.title.html(city_data.title);
                this.addData(tag,c_i,c_j,p_i,p_j);
            } else {
                this.title.html(already.City.title);
                this.dCountryTab.children().hide().parent().find('.' + this.showTag + c_i + c_j + p_i + p_j).show();
                this.dCountryCon.children().hide().parent().find('.' + this.showTag + c_i + c_j + p_i + p_j).show();
            }
        };


        switch(tag) {
            case 'getCountry':
                if (data) {
                    this.initValue.data = data;
                }
                $.proxy(showCountry,this)();
                break;
            case 'getProvince':
                var _i = this.country_input.attr('i');
                var _j = this.country_input.attr('j');
                if (data) {
                    this.initValue.data.tag[_i].list[_j].data = data;
                }
                if (this.initValue.data.tag[_i].list[_j].data.hasOwnProperty('tag') && this.initValue.data.tag[_i].list[_j].data.tag.length > 0) {
                    $.proxy(showProvince,this)(_i,_j);
                } else {
                    this.province_input.val('').parent().find('i').html('无');
                    this.city_input.val('').parent().find('i').html('无');
                    return;
                }
                break;
            case 'getCity':
                var c_i = this.country_input.attr('i');
                var c_j = this.country_input.attr('j');
                var p_i = this.province_input.attr('i');
                var p_j = this.province_input.attr('j');
                if (data) {
                    this.initValue.data.tag[c_i].list[c_j].data.tag[p_i].list[p_j].data = data;
                }
                if (this.initValue.data.tag[c_i].list[c_j].data.tag[p_i].list[p_j].data.hasOwnProperty('tag') && this.initValue.data.tag[c_i].list[c_j].data.tag[p_i].list[p_j].data.tag.length > 0) {
                    $.proxy(showCity,this)(c_i,c_j,p_i,p_j);
                } else {
                    this.city_input.val('').parent().find('i').html('无');
                    return;
                }

                break;
        }
        if (show != false) {
            switch(tag){
                case 'getCountry':
                    this.country.css({'background-color':'#09f','border-color':'#09f','color':'#fff'});
                    break;
                case 'getProvince':
                    this.province.css({'background-color':'#09f','border-color':'#09f','color':'#fff'});
                    break;
                case 'getCity':
                    this.city.css({'background-color':'#09f','border-color':'#09f','color':'#fff'});
                    break;
            }
            $(this.el).css('position','relative');
            this.areaWrap.css('z-index','10').show();
        }
    },

    hide: function(){
        $(this.el).css('position','').children('span').css({'background-color':'','border-color':'','color':''});
        this.areaWrap.hide();
    }
});