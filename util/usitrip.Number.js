/**
 * Created with JetBrains WebStorm.
 * User: YHB
 * Date: 14-3-27
 * Time: 下午6:31
 * To change this template use File | Settings | File Templates.
 */

(function(){
    Usitrip.Number = function(){

    };
    Usitrip.apply(Usitrip.Number, {
        /**
         * 数字左补零
         * @param {Number} x 要补零的数字
         * @return {String} 返回补零后的字符串
         */
        lpadZero: function(x){
            return x < 10 ? '0'+x : x ;
        },
        /**
         * 将会计学意义上的数值转换成js能识别的数值
         * @param str 如：$58,978.00
         * @return {Number} 返回js能识别的数字。如：58978.00
         */
		strToNumber: function (str){
		    var num = str.replace(/[^0-9\.]+/gi,'');
            return parseFloat(num);
		}
    });
})();