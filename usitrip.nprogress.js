/**
 * Created by 509 on 2016/5/3.
 * 634878427@qq.com
 */
//这个 为了样式上与需求一致，采用了width  现在不支持ie 7,8

(function() {

    window.NProgress = function(options) {
        var _this = this;
        this.id = new Date() - 0 + "_" + Math.floor(Math.random() * 1000); //获取id
        this.Settings = $.extend({}, this.Settings, options);
        this.queue = (function() {
            var pending = [];

            function next() {
                var fn = pending.shift();
                if (fn) {
                    fn(next);
                }
            }

            return function(fn) {
                pending.push(fn);
                if (pending.length == 1) next();
            };
        })();
    }
    NProgress.prototype = {
        constructor: NProgress,
        Settings: {
            minimum: 0.1, //最小值
            speed: 600,
            trickle: true, //是否慢慢的移动 （涓流）
            trickleRate: 0.15, //涓流速率
            trickleSpeed: 600, //涓流时间间隔
            barSelector: '[role="bar"]',
            parent: 'body', //默认是在body下
            barheight: 9, //加载条的高度
            barcolor: "#fc8723", //加载条的颜色
            template: '<div class="bar" role="bar" style="width:0%;z-index:1001;top:0;left:0;"></div>'
        },
        status: null, //状态：未加载null  加载中，typeof status = "number"

        /**
         * 返回状态
         */
        isStarted: function() {
            return typeof this.status === 'number';
        },

        /**
         * 开始
         */
        start: function() {
            var _this = this;
            if (!this.status) this.set(0); //如果没有加载则设置为新的开始

            var work = function() {
                setTimeout(function() {
                    if (!_this.status) return;
                    _this.trickle();
                    work();
                }, _this.Settings.trickleSpeed);
            };

            if (this.Settings.trickle) work(); //如果涓流，则会自动慢慢加载

            return this;
        },

        /**
         * 设置具体的值
         * @param {Object} n
         */
        set: function(n) {
            var _this = this
            var started = this.isStarted();

            n = this.clamp(n, this.Settings.minimum, 1);
            this.status = (n === 1 ? null : n); //如果是1 表示要结束了

            var progress = this.render(!started),
                bar = $(progress).find(this.Settings.barSelector),
                speed = this.Settings.speed;

            this.queue(function(next) {

                bar.animate({
                    'width': _this.toBarPerc(n) + '%'
                }, speed);

                if (n === 1) {
                    setTimeout(function() {
                        _this.remove();
                        next();
                    }, speed);
                } else {
                    setTimeout(next, speed);
                }
            });

            return this;
        },

        /**
         * 结束
         * @param {Object} force
         */
        done: function(force) {
            if (!force && !this.status) return this;
            return this.set(1);
        },

        /**
         * 生成一个大于当前进度的值
         * @param {Object} amount
         */
        inc: function(amount) {
            var n = this.status;

            /**
             * 如果没有开始，则开始，
             * 开始了，生成一个大于当前进度值的值
             */
            if (!n) {
                return this.start();
            } else {
                if (typeof amount !== 'number') {
                    amount = (1 - n) * this.clamp(Math.random() * n, 0.1, 0.97);
                }

                n = this.clamp(n + amount, 0, 0.97);
                return this.set(n);
            }
        },

        /**
         * 涓流
         */
        trickle: function() {
            return this.inc(Math.random() * this.Settings.trickleRate);
        },

        /**
         * 渲染
         */
        render: function() {
            if (this.isRendered()) return $('#nprogress' + this.id) //已经渲染，返回该渲染dom

            //没有渲染，则加载相应的dom结构

            var progress = $('<div/>', {
                "id": 'nprogress' + this.id,
                "class":'nprogress',
                "html": this.Settings.template
            });
            progress.css({
                "pointer-events": "none",
                "height":this.Settings.barheight,
                "border-radius":this.Settings.barheight/2+"px"
            });

            /**
             * 找到该dom 结构的加载条
             */
            var bar = progress.find(this.Settings.barSelector),
                parent = $(this.Settings.parent);
            bar.css({
                "height": this.Settings.barheight + "px",
                "background": this.Settings.barcolor,
                "border-radius":this.Settings.barheight/2 + "px"
            });

            if (parent.target != document.body) {
                bar.css({
                    position: "absolute"
                });
                parent.css({
                    'overflow': 'hidden',
                    'position': 'relative'
                });
            } else {
                bar.css({
                    position: "fixed"
                });
            }

            parent.append(progress);
            return progress;
        },

        remove: function() {
            var _this = this;
            $('#nprogress' + this.id).find(this.Settings.barSelector).animate({
                "width": "100%"
            }, 100, function() {
                $('#nprogress' + _this.id).remove();
            });
            //$('#nprogress' + this.id).remove();
        },

        /**
         * 是否渲染
         * 通过是否可以找到对应的已渲染的dom id
         */
        isRendered: function() {
            return !!document.getElementById('nprogress' + this.id);
        },

        clamp: function(n, min, max) {
            if (n < min) return min;
            if (n > max) return max;
            return n;
        },
        toBarPerc: function(n) {
            return  n * 100;
        }
    }
})();