/**
 * Created with JetBrains WebStorm.
 * User: YHB
 * Date: 14-3-27
 * Time: 下午6:31
 * To change this template use File | Settings | File Templates.
 */

(function () {
    Usitrip.String = function () {

    };
    Usitrip.apply(Usitrip.String, {


        /**
         * 将各种浏览器里的颜色值转换成#RRGGBB的格式
         * @param str {string|color}
         * @returns {#RRGGBB}
         */
        formatColor: function(str){
            // 将正则表达式预创建，可提高效率
            var reg1 = /^\#[\da-f]{6}$/i,
                reg2 = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i,
                keyword = {
                    black: '#000000',
                    silver: '#c0c0c0',
                    gray: '#808080',
                    white: '#ffffff',
                    maroon: '#800000',
                    red: '#ff0000',
                    purple: '#800080',
                    fuchsia: '#ff00ff',
                    green: '#008000',
                    lime: '#00ff00',
                    olive: '#808000',
                    yellow: '#ffff0',
                    navy: '#000080',
                    blue: '#0000ff',
                    teal: '#008080',
                    aqua: '#00ffff'
                };

            return function(str){
                var color = str.valueOf();
                if(reg1.test(color)) {
                    // #RRGGBB 直接返回
                    return color;
                } else if(reg2.test(color)) {
                    // 非IE中的 rgb(0, 0, 0)
                    for (var s, i=1, color="#"; i<4; i++) {
                        s = parseInt(RegExp["\x24"+ i]).toString(16);
                        color += ("00"+ s).substr(s.length);
                    }
                    return color;
                } else if(/^\#[\da-f]{3}$/.test(color)) {
                    // 简写的颜色值: #F00
                    var s1 = color.charAt(1),
                        s2 = color.charAt(2),
                        s3 = color.charAt(3);
                    return "#"+ s1 + s1 + s2 + s2 + s3 + s3;
                }else if(keyword[color])
                    return keyword[color];

                return '';
            }
        }(),



        /**
         * 去掉字符串中的html标签
         * @param str {string}
         * @returns {string|*}
         */
        stripTags : function(str) {
            return (str || '').replace(/<[^>]+>/g, '');
        },




        /**
         * 将目标字符串进行驼峰化处理
         * @param str {string}
         * @returns {*}
         */
        toCamelCase : function (str) {
            var source = str.valueOf();
            if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
                return source;
            }
            return source.replace(/[-_][^-_]/g, function (match) {
                return match.charAt(1).toUpperCase();
            });
        },


        /**
         * 转换为下划线风格
         * @param str {string}
         * @returns {string}
         */
        underscored : function(str){
            return str.replace(/([a-z\d/]) ([A-Z])/g,'$1_$2' ).replace(/\-/g,'_' ).toLowerCase();
        },


        /**
         * 转换为连字符风格
         * @param str {string}
         * @returns {string|*}
         */
        dasherize: function(str){
            return this.underscored(str ).replace(/_/g,'-');
        },


        /**
         * 首字母大写
         * @param str {string}
         * @returns {string}
         */
        capitalize: function(str){
            return str.charAt(0 ).toUpperCase() + str.substring(1 ).toLowerCase();
        },


        /**
         * 获取目标字符串在gbk编码下的字节长度
         * @param str {string}
         * @returns {*}
         * 获取字符在gbk编码下的字节长度, 实现原理是认为大于127的就一定是双字节。如果字符超出gbk编码范围, 则这个计算不准确
         */
        getByteLength : function (str) {
            return str.replace(/[^\x00-\xff]/g, 'ci').length;
        },




        /**
         * 将目标字符串中常见全角字符转换成半角字符
         * @param str {string}
         * @returns {*}
         */
        toHalfWidth : function (str) {
            return str.replace(/[\uFF01-\uFF5E]/g,
                function(c){
                    return String.fromCharCode(c.charCodeAt(0) - 65248);
                }).replace(/\u3000/g," ");
        },


        /**
         * 删除目标字符串两端的空白字符
         * @param str {string}
         * @returns {*}
         */
        trim: function(str){
            var trimer = new RegExp('(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)', 'g');
            return function(str){
                return str.replace(trimer, '');
            }
        }(),


        /**
         * 为目标字符串添加wbr软换行
         * @param str {string}
         * @returns {*}
         */
        wbr : function (str) {
            return str.replace(/(?:<[^>]+>)|(?:&#?[0-9a-z]{2,6};)|(.{1})/gi, '$&<wbr>')
                .replace(/><wbr>/g, '>');
        },


        /**
         * 将字符串经过html转义得到适合在页面中显示的内容，如将< 替换为 &lt
         * @param str {string}
         * @returns {*}
         */
        escapeHTML : function(str){
            return str.replace(/&/g,'&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g,'&gt;')
                .replace(/"/g,"$quot;")
                .replace(/'/g,"&#39;");
        },


        /**
         * 将字符创中的html实体字符串还原为对应字符
         * @param str {string}
         * @returns {*}
         */
        unescapeHTML : function(str){
            return str.replace(/&quot;/g,'"')
                .replace(/&lt;/g,'<')
                .replace(/&gt;/g,'>')
                .replace(/&amp;/g,'&')
                .replace(/$#([\d]+);/g, function($0, $1){
                    return String.fromCharCode(parseInt($1, 10));
                })
        },


        /**
         * 将字符串安全格式化为正则表达式的源码
         * @param str {string}
         * @returns {*}
         */
        escapeRegExp : function(str){
            return str.replace(/([-.*+?^${}()|[\]\/\\])/g,'\\$1');
        },


        /**
         * 对字符串进行截断处理，当超过限定长度，默认添加三个点号或者其他的什么
         * @param str {string}
         * @param length {number}
         * @param truncation {string}
         * @returns {string}
         */
        truncate :function( str, length, truncation){
            length = length || 30;
            truncation =  truncation === void(0) ? '...':truncation;
            return str.length > length  ?
                str.slice(0, length - truncation.length) + truncation : String(str);
        }

    });
})();