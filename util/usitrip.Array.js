/**
 * 数组处理
 * @author Howard
 */
(function () {
    Usitrip.Array = function () {

    };
    Usitrip.apply(Usitrip.Array, {
        /**
         * 检查数组中是否存在某个值
         * @param {Mixed} v 要查找的值
         * @param {Array} array 被查找的数组
         * @returns {boolean} 返回true或false
         */
        in_array: function (v, array) {
            if (array.constructor !== Array) {
                return false;
            }
            for (var i in array) {
                if (array[i] == v) {
                    return true;
                }
            }
            return false;
        },


        /**
         * 判断数组中是否包含指定目标
         * @param target
         * @param item
         * @returns {boolean}
         */
        contains: function (target, item) {
            return target.indexOf(item) > -1;
        },


        /**
         * 移除数组中指定位置的元素
         * @param target
         * @param index
         * @returns {boolean}
         */
        removeAt: function (target, index) {
            return !!target.splice(index, 1).length
        },


        /**
         * 移除数组中第一个匹配传参的那个元素，返回布尔值表示成功与否
         * @param target   Array
         * @param item
         * @returns {Boolean}
         */
        remove: function (target, item) {
            var index = target.indexOf(item);
            if (~index) {
                return this.removeAt(target, index);
            }
            return false;
        },


        /**
         * 对数组进行洗牌
         * @param target
         * @returns {Array}
         */
        shuffle: function (target) {
            var j, x, i = target.length;
            for (; i > 0; j = parseInt(Math.random() * i), x = target[--i], target[i] = target[j], target[j] = x) {

            }
            return target;
        },


        /**
         * 从数组中随机抽取出一个元素出来
         * @param target
         * @returns {*}
         */
        random: function (target) {
            return target[Math.floor(Math.random() * target.length)];
        },


        /**
         * 对数组进行平坦化处理，返回一个一维的新数组
         * @param target
         * @returns {Array}
         */
        flatten: function (target) {
            var result = [];
            var _ = this;
            target.forEach(function (item) {
                if (Array.isArray(item)) {
                    result = result.concat((
                        _.flatten(item)
                    ));
                } else {
                    result.push(item);
                }
            });
            return result;
        },


        /**
         * 对数组进行去重操作，返回一个没有重复元素的新数组
         * @param target
         * @returns {Array}
         */
        unique: function (target) {
            var result = [];
            loop: for(var i = 0, n = target.length; i < n ; i++){
                for(var x = i + 1; x < n ; x ++){
                    if(target[x] === target[i]){
                        continue loop;
                    }
                }
                result.push(target[i]);
            }
            return result;
        },

        /**
         * 过滤数组中的null 与undefined,但不影响原数组
         * @param target
         * @returns {*}
         */
        compact: function (target) {
            return target.filter(function(el){
                return el != null;
            });
        },

        /**
         * 取得对象数组中每个元素的指定属性，组成数组返回
         * @param target
         * @param name
         * @returns {Array}
         */
        pluck: function (target, name) {
            var result = [], prop;
            target.forEach(function(item){
                prop = item[name];
                if(prop != null){
                    result.push(prop);
                }
            });
            return result;
        }

    });
})();