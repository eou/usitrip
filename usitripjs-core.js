var Usitrip = U = Usitrip || {};
/**
 * @constructor
 * @author YHB
 */
(function() {
    var global = this,
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString;

    /**
     * @method apply 复制
     * @param object 要覆盖的对象
     * @param config 复制到object对象
     * @param defaults 不是必须的 复制到object对象 会优先复制defaults 如果config中也有该属性,会被config中覆盖掉
     * @returns {*}
     *
     * Usitrip.apply({a:1,b:2},{a:2,c:3},{a:4,d:4})
     * {a: 2, b: 2, d: 4, c: 3}
     */
    Usitrip.apply = function(object, config, defaults) {
        if (defaults) {
            Usitrip.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i;

            for (i in config) {
                object[i] = config[i];
            }
        }
        return object;
    };



    Usitrip.apply(Usitrip, {


        /**
         *
         * @param value 要判断的对象
         * @param allowEmptyString 是否要把空字符串当作空,默认是
         * @returns {boolean|*}
         */
        isEmpty: function(value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (Usitrip.isArray(value) && value.length === 0);
        },

        /**
         * 是否是空的数组
         * @param array
         * @returns {*|boolean}
         */
        isEmptyArray: function(array){
            return array && !array.length;
        },

        /**
         * 是否是数组
         */
        isArray: ('isArray' in Array) ? Array.isArray : function(value) {
            return toString.call(value) === '[object Array]';
        },


        /**
         * 是否是日期类型
         * @param value
         * @returns {boolean}
         */
        isDate: function(value) {
            return toString.call(value) === '[object Date]';
        },


        /**
         * 是否是一个对象
         */
        isObject: (toString.call(null) === '[object Object]') ?
            function(value) {

                return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
            } :
            function(value) {
                return toString.call(value) === '[object Object]';
            },

        /**
         * 是否是一个方法
         * @param value
         * @returns {boolean}
         */
        isFunction: function(value) {
            return toString.call(value) =='[object Function]'
        },


        /**
         * 是否是一个数字
         * @param value
         * @returns {boolean}
         */
        isNumber: function(value) {
            return typeof value === 'number';
        },

        /**
         * 是否是一个字符串
         * @param value
         * @returns {boolean}
         */
        isString: function(value) {
            return typeof value === 'string';
        },

        /**
         * 是否是一个Boolean变量
         * @param value
         * @returns {boolean}
         */
        isBoolean: function(value) {
            return typeof value === 'boolean';
        }
    });

    Usitrip.apply(Usitrip, {


    });


    Usitrip.apply(Usitrip, {
        /**
         * 继承
         */
        extend: (function() {
            var objectConstructor = objectPrototype.constructor,
                inlineOverrides = function(o) {
                    for (var m in o) {
                        if (!o.hasOwnProperty(m)) {
                            continue;
                        }
                        this[m] = o[m];
                    }
                };

            return function(subclass, superclass, overrides) {

                if (Usitrip.isObject(superclass)) {
                    overrides = superclass;
                    superclass = subclass;
                    subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
                        superclass.apply(this, arguments);
                    };
                }

                var F = function() {},
                    subclassProto, superclassProto = superclass.prototype;

                F.prototype = superclassProto;
                subclassProto = subclass.prototype = new F();
                subclassProto.constructor = subclass;
                subclass.superclass = superclassProto;

                if (superclassProto.constructor === objectConstructor) {
                    superclassProto.constructor = superclass;
                }

                subclass.override = function(overrides) {
                    Usitrip.override(subclass, overrides);
                };

                subclassProto.override = inlineOverrides;
                subclassProto.proto = subclassProto;

                subclass.override(overrides);
                subclass.extend = function(o) {
                    return Usitrip.extend(subclass, o);
                };

                return subclass;
            };
        }()),


        /**
         * 覆盖
         * @param target
         * @param overrides
         * @returns {*}
         *Usitrip.override({a:1,b:2},{a:2,c:3})
         *{a: 2, b: 2, c: 3}
         */
        override: function (target, overrides) {
            if (target.$isClass) {
                target.override(overrides);
            } else if (typeof target == 'function') {
                Usitrip.apply(target.prototype, overrides);
            } else {
                var owner = target.self,
                    name, value;

                if (owner && owner.$isClass) {
                    for (name in overrides) {
                        if (overrides.hasOwnProperty(name)) {
                            value = overrides[name];

                            if (typeof value == 'function') {

                                value.$name = name;
                                value.$owner = owner;
                                value.$previous = target.hasOwnProperty(name)
                                    ? target[name]
                                    : callOverrideParent;
                            }

                            target[name] = value;
                        }
                    }
                } else {
                    Usitrip.apply(target, overrides);
                }
            }
            return target;
        }
    });

    Usitrip.apply(Usitrip, {

        namespaceParseCache: [],

        namespaceRewrites: [],

        applyIf: function(object, config) {
            var property;

            if (object) {
                for (property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }

            return object;
        },


        createNamespaces: function() {
            var root = global,
                parts, part, i, j, ln, subLn;

            for (i = 0, ln = arguments.length; i < ln; i++) {
                parts = this.parseNamespace(arguments[i]);

                for (j = 0, subLn = parts.length; j < subLn; j++) {
                    part = parts[j];

                    if (typeof part != 'string') {
                        root = part;
                    } else {
                        if (!root[part]) {
                            root[part] = {};
                        }

                        root = root[part];
                    }
                }
            }

            return root;
        },

        parseNamespace: function(namespace) {

            var cache = this.namespaceParseCache,
                parts,
                rewrites,
                root,
                name,
                rewrite, from, to, i, ln;

            if (this.enableNamespaceParseCache) {
                if (cache.hasOwnProperty(namespace)) {
                    return cache[namespace];
                }
            }

            parts = [];
            rewrites = this.namespaceRewrites;
            root = global;
            name = namespace;

            for (i = 0, ln = rewrites.length; i < ln; i++) {
                rewrite = rewrites[i];
                from = rewrite.from;
                to = rewrite.to;

                if (name === from || name.substring(0, from.length) === from) {
                    name = name.substring(from.length);

                    if (typeof to != 'string') {
                        root = to;
                    } else {
                        parts = parts.concat(to.split('.'));
                    }

                    break;
                }
            }

            parts.push(root);

            parts = parts.concat(name.split('.'));

            if (this.enableNamespaceParseCache) {
                cache[namespace] = parts;
            }

            return parts;
        },

        /**
         * 创建命名空间
         * @cfg {String} spacename 命名空间名称
         * @return {Object} spaceObject 该命名控件对象
         */
        namespace: function(spacename){
            return this.createNamespaces.apply(this, arguments);
        }

    });
    Usitrip.ns = Usitrip.namespace;
})();


(function(){

        Usitrip.apply(Usitrip, {
            userAgent: navigator.userAgent.toLowerCase()
        });

        var check = function(regex){
                return regex.test(Usitrip.userAgent);
            },
            isStrict = document.compatMode == "CSS1Compat",
            version = function (is, regex) {
                var m;
                return (is && (m = regex.exec(Usitrip.userAgent))) ? parseFloat(m[1]) : 0;
            },
            docMode = document.documentMode,
            isOpera = check(/opera/),
            isOpera10_5 = isOpera && check(/version\/10\.5/),
            isChrome = check(/\bchrome\b/),
            isWebKit = check(/webkit/),
            isSafari = !isChrome && check(/safari/),
            isSafari2 = isSafari && check(/applewebkit\/4/),
            isSafari3 = isSafari && check(/version\/3/),
            isSafari4 = isSafari && check(/version\/4/),
            isSafari5_0 = isSafari && check(/version\/5\.0/),
            isSafari5 = isSafari && check(/version\/5/),
            isIE = !isOpera && check(/msie/),
            isIE7 = isIE && ((check(/msie 7/) && docMode != 8 && docMode != 9 && docMode != 10) || docMode == 7),
            isIE8 = isIE && ((check(/msie 8/) && docMode != 7 && docMode != 9 && docMode != 10) || docMode == 8),
            isIE9 = isIE && ((check(/msie 9/) && docMode != 7 && docMode != 8 && docMode != 10) || docMode == 9),
            isIE10 = isIE && ((check(/msie 10/) && docMode != 7 && docMode != 8 && docMode != 9) || docMode == 10),
            isIE6 = isIE && check(/msie 6/),
            isGecko = !isWebKit && check(/gecko/),
            isGecko3 = isGecko && check(/rv:1\.9/),
            isGecko4 = isGecko && check(/rv:2\.0/),
            isGecko5 = isGecko && check(/rv:5\./),
            isGecko10 = isGecko && check(/rv:10\./),
            isFF3_0 = isGecko3 && check(/rv:1\.9\.0/),
            isFF3_5 = isGecko3 && check(/rv:1\.9\.1/),
            isFF3_6 = isGecko3 && check(/rv:1\.9\.2/),
            isWindows = check(/windows|win32/),
            isMac = check(/macintosh|mac os x/),
            isLinux = check(/linux/),
            isAndroid = check(/android/),
            isIpad = check(/ipad/),
            isIphone = check(/iphone/),
            isX11 = check(/x11/),
            chromeVersion = version(true, /\bchrome\/(\d+\.\d+)/),
            firefoxVersion = version(true, /\bfirefox\/(\d+\.\d+)/),
            ieVersion = version(isIE, /msie (\d+\.\d+)/),
            operaVersion = version(isOpera, /version\/(\d+\.\d+)/),
            safariVersion = version(isSafari, /version\/(\d+\.\d+)/),
            webKitVersion = version(isWebKit, /webkit\/(\d+\.\d+)/),
            isSecure = /^https/i.test(window.location.protocol);

        Usitrip.apply(Usitrip, {

            isStrict: isStrict,


            isIEQuirks: isIE && (!isStrict && (isIE6 || isIE7 || isIE8 || isIE9)),


            isOpera : isOpera,


            isOpera10_5 : isOpera10_5,


            isWebKit : isWebKit,


            isChrome : isChrome,


            isSafari : isSafari,


            isSafari3 : isSafari3,


            isSafari4 : isSafari4,


            isSafari5 : isSafari5,


            isSafari5_0 : isSafari5_0,



            isSafari2 : isSafari2,


            isIE : isIE,


            isIE6 : isIE6,


            isIE7 : isIE7,


            isIE7m : isIE6 || isIE7,


            isIE7p : isIE && !isIE6,


            isIE8 : isIE8,


            isIE8m : isIE6 || isIE7 || isIE8,


            isIE8p : isIE && !(isIE6 || isIE7),


            isIE9 : isIE9,


            isIE9m : isIE6 || isIE7 || isIE8 || isIE9,


            isIE9p : isIE && !(isIE6 || isIE7 || isIE8),


            isIE10 : isIE10,


            isIE10m : isIE6 || isIE7 || isIE8 || isIE9 || isIE10,


            isIE10p : isIE && !(isIE6 || isIE7 || isIE8 || isIE9),


            isGecko : isGecko,


            isGecko3 : isGecko3,


            isGecko4 : isGecko4,


            isGecko5 : isGecko5,


            isGecko10 : isGecko10,


            isFF3_0 : isFF3_0,


            isFF3_5 : isFF3_5,


            isFF3_6 : isFF3_6,


            isFF4 : 4 <= firefoxVersion && firefoxVersion < 5,


            isFF5 : 5 <= firefoxVersion && firefoxVersion < 6,


            isFF10 : 10 <= firefoxVersion && firefoxVersion < 11,


            isLinux : isLinux,


            isWindows : isWindows,


            isMac : isMac,

            isAndroid:isAndroid,

            isIpad:isIpad,

            isIphone:isIphone,

            isX11: isX11,


            chromeVersion: chromeVersion,


            firefoxVersion: firefoxVersion,


            ieVersion: ieVersion,


            operaVersion: operaVersion,


            safariVersion: safariVersion,


            webKitVersion: webKitVersion,


            isSecure: isSecure
        });
})();

Usitrip.ns('Usitrip.net');
/**
 * usitripjs.net.Url 处理对象
 * @param {string} url 要处理的网址
 * @constructor
 */
(function() {
    Usitrip.net.Url = function(url) {
        this.url = url || window.location.href;
    }

    Usitrip.net.Url.prototype = {
        /**
         * 取得网址的GET参数，与PHP的相同
         * @return {Object|false}
         */
        getParame : function() {
            var string = this.url.replace(/.+\?/, '').replace(/\#+.{0,}/, '')
                || null;
            return this.parse(string);
        },
        /**
         * 取得#号后面的锚点参数，返回字符串
         * @return {array|false}
         */
        getAnchor : function() {
            var string = this.url.split("#")[1] || null;
            return string;
        },

        parse : function(string) {
            if (string != null) {
                var Parames = {};
                var strs = string.split('&');
                for ( var i = 0; i < strs.length; i++) {
                    Parames[strs[i].split("=")[0]] = unescape(strs[i]
                        .split("=")[1]);
                }
                return Parames;
            }
            return false;
        }
    }
})();

Usitrip.ns('Usitrip.Service');
/**
 * Usitrip.Service usitripJs 请求服务封装类
 * @constructor
 */
(function(){
    Usitrip.Service.call = function(params, callback){
        var url = params['url'] || '',
            postType = params['postType'] || 'post',
            dateType = params['dateType'] || 'json',
            async = params['async'] || true ;

        $.ajax();
    }
})();



(function(){
	if (!Array.prototype.indexOf)
	{
	  Array.prototype.indexOf = function(elt /*, from*/)
	  {
		var len = this.length >>> 0;
		var from = Number(arguments[1]) || 0;
		from = (from < 0)
			 ? Math.ceil(from)
			 : Math.floor(from);
		if (from < 0)
		  from += len;
		for (; from < len; from++)
		{
		  if (from in this &&
			  this[from] === elt)
			return from;
		}
		return -1;
	  };
	}
})();