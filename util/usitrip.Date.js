/**
 * Created with JetBrains WebStorm.
 * User: YHB
 * Date: 14-3-27
 * Time: 下午6:31
 * To change this template use File | Settings | File Templates.
 */

(function () {
    Usitrip.Date = function () {

    };
    Usitrip.apply(Usitrip.Date, {
        /**
         * 日期加、减天数得出新日期
         * @param {String} sdate 原始日期 YYYY-MM-DD
         * @param {Number} days 要加的天数，如果是负数则为减
         * @returns {string} 返回新日期
         */
        delayDate: function (sdate, days) {
            var date = this.strToDate(sdate);
            date.setDate(date.getDate() + days);
            return date.getFullYear() + '-' + Usitrip.Number.lpadZero(date.getMonth() + 1) + '-' + Usitrip.Number.lpadZero(date.getDate());
        },

        /**
         * @method strToDate 字符串转变为日期
         * @param str
         * @returns {*} 返回字符串
         */
        strToDate: function (str) {
            if (str instanceof Date) {
                return str;
            }
            if (!/^\d{4}-[01]\d-[0123]\d$/.test(str)) {
                return new Date();
            }
            //if(Usitrip.isIE){
            var date = str.split('-'), tempDate;
            //if(Usitrip.isIE8m){
            //    tempDate = new Date(date[0], date[1] - 1, date[2]);
            //} else {
            tempDate = new Date(date[0], date[1] - 1, date[2]);
            //if(tempDate === "NaN-NaN-NaN"){
            //    tempDate = new Date(date[0], date[1] - 1, date[2]);
            //}
            //}
            return tempDate;
            //}
            //return new Date(str);
        },

        /**
         * 穿入两个data类型的日期，返回相隔多少天
         * @param start {date}
         * @param finish {date}
         * @returns {number}
         */
        getDatePeriod: function (start, finish) {
            return Math.abs(start * 1 - finish * 1) / 60 / 60 / 1000 / 24;
        },

        /**
         * 传入一个Date类型的日期，求出它所在月的第一天
         * @param date
         * @returns {Date}
         */
        getFirstDataInMonth: function (date) {
            return new Date(date.getFullYear(), date.getMonth(), 1);
        },

        /**
         * 传入一个Date类型的日期，求出它所在月的最后一天
         * @param date
         * @returns {Date}
         */
        getLastDateInMonth: function (date) {
            return new Date(date.getFullYear(), date.getMonth(), 0);
        },

        /**
         * 传入一个Date类型的日期，求出它所在季度的第一天
         * @param date
         * @returns {Date}
         */
        getFirstDateInQuerter: function (date) {
            return new Date(date.getFullYear(), ~~(date.getMonth() / 3) * 3, 1);
        },

        /**
         * 传入一个Date类型的日期，求出它所在季度的最后一天
         * @returns {Date}
         */
        getLastDateInQuerter: function (date) {
            return new Date(date.getFullYear(), ~~(date.getMonth() / 3) * 3, 0);
        },

        /**
         * 判断是否为闰年
         * @returns {boolean}
         */
        isLeapYear: function (date) {
            return new Date(date.getFullYear(), 2, 0).getDate() == 29;
        },


        /**
         * 返回当前月份的天数
         * @param date
         * @returns {number}
         */
        getDaysInMonth: function (date) {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        }


    });
})();
