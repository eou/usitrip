/**
 * Created by X_PP on 2015/12/16.
 */
/*
 * 关于usitrip  URL链接处理
 * www.usitrip.com的url分类比较多
 *
 * 搜索的链接样式(旅游线路，景点门票，酒店)：?mod=advanced_search_result&type_id=type_id&w=&search_in_description=1&language_encoding=gb2312&attractions=4,5
 * 当地游：east-coast/rg-25,24,33/
 * 团购： com/group_buys/index/attractions-66,71/tabs-group_buy/stock-1.html
 * */

usitrip.URLTools = function(opt){
    this.default = {
        loc_hash : unescape(location.hash),//  ＃PART2
        loc_hostname : unescape(location.hostname),//  www.w3cschool.cc
        loc_href : unescape(location.href),//  http://www.w3cschool.cc/test.htm＃PART2
        loc_search: unescape(location.search),//  ?email=someone@ example.com
        loc_pathname:unescape(location.pathname),//  /jsref/prop-loc-pathname.html a=3&a1=5


        //separator:/\?/.test(this.loc_href)?'&':'/',//分隔符
        separator:(unescape(location.search)!='' ? "&" : "/"),//获取分隔符
        connector:(unescape(location.search)!='' ? "=" : "-")//获取链接符
    };
    this.options = $.extend({},this.default,opt);
};
URLTools.prototype = {
    /**
     * 获取链接中的参数，如搜索中，GetQueryString('type_id')---->type_id
     * @param name  需要查找的字符串名称
     * @returns {*} 返回一个数组
     * @constructor
     */
    GetQueryString: function (name,string) {
        //console.log(this);
        var reg = new RegExp("(^|&|/)" + name + "(=|-)([^&|/]*)(&|/|$)");
        var r = string.substr(1).match(reg);
        if (r != null)return r;
        return null;
    },

    concat:function(url,keyword,data){
        var O = {};
        O.data = data.sort(function(a,b){return a-b}).toString();//将data排序
        O.A_url = url.split(this.default.separator);
        for(var el in O.A_url){
            if(O.A_url[el].indexOf(keyword+this.default.connector)>-1){
                O.A_url[el] = keyword+this.default.connector+ O.data;
            }
        }
        return O.A_url.join(this.default.separator)
    },


    /**
     * 去掉已选择项
     * @param url 传入需要修改的string
     * @param keyword  需要修改的关键字
     * @param data  需要修改的数据
     * @returns {*|O.rtnS}  返回修改之后的string
     */
    clearSelected:function(url,keyword,data){
        var O = {};
        O.A_data_id = data;//.split(',');//将传进来的数据切割
        O.A_url = url.split(this.default.separator);//将url进行切割
        O.A_rt = new Array();
        O.reg = this.GetQueryString(keyword,url);  //正则匹配相应的关键字
        O.A_val = O.reg[3].split(',');  //将匹配到的数据进行切割

        for(var i in  O.A_val){//去掉要删除的val
            for(var j in O.A_data_id){
                if(O.A_val[i]==O.A_data_id[j]){
                    O.A_val[i]='';
                    break;
                }
            }
            if(O.A_val[i]!=''){
                O.A_rt.push(O.A_val[i]);
            }
        }
        if(O.A_rt.length == 0){
            O.S_replace = O.reg[0].charAt(0);
        }else{
            O.S_replace = O.reg[0].replace(O.reg[3],O.A_rt.toString());
        }
        return  url.replace(O.reg[0],O.S_replace);


    }
};



