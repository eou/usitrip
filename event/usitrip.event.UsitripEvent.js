/**
 * Created with JetBrains WebStorm.
 * User: YHB
 * Date: 14-4-9
 * Time: 上午9:49
 * To change this template use File | Settings | File Templates.
 */

Usitrip.ns('usitrip.event');
(function(){

    usitrip.event.UsitripEvent = function(config){
        this.eventHash = {};
        var lis ;
        if(config && ( lis = config.listeners)){
        	var scope = lis['scope'] || window;
        	for(var p in lis){
        		if (p !== 'scope'){
        			this.on(p, lis[p], scope);
        		}
        	}
        }
    }
    usitrip.event.UsitripEvent.fn = usitrip.event.UsitripEvent.prototype;

    /**
     * @method addEvents 增加事件
     * @param eventName 增加的事件名
     */
    usitrip.event.UsitripEvent.fn.addEvents = function(eventName){
        if(Usitrip.isArray(eventName)){
            for(var i= 0,len=eventName.length;i<len;i++){
                var name = eventName[i].toLowerCase();
                var handles = this.eventHash[name];
                if(!handles){
                    this.eventHash[name] = [];
                }
            }
        } else if(Usitrip.isString(eventName)){
            var handles = this.eventHash[eventName];
            if(!handles){
                this.eventHash[eventName.toLowerCase()] = [];
            }
        }
    }

    /**
     * method removeEvents 移除事件
     * @param eventName 移除事件名
     */
    usitrip.event.UsitripEvent.fn.removeEvents = function(eventName){
        if(Usitrip.isArray(eventName)){
            for(var i= 0,len=eventName.length;i<len;i++){
                delete this.eventHash[eventName[i]];
            }
        } else if(Usitrip.isString(eventName)){
            delete this.eventHash[eventName];
        }
    }


    /**
     * 增加事件的绑定
     * @param eventName 需要绑定的事件名
     * @param eventFn 事件触发后的回调
     * @param scope 执行的作用域
     */
    usitrip.event.UsitripEvent.fn.addListenerEvent = function(eventName, eventFn, scope){
        eventName = eventName.toLowerCase();
        var eventFns = this.eventHash[eventName];
        if(Usitrip.isEmpty(eventFns) || Usitrip.isEmptyArray(eventFns)){
            this.eventHash[eventName] = [];
        }
        this.eventHash[eventName].push({
            fn: eventFn,
            scope: scope
        });
    }

    /**
     * 触发事件
     * @param eventName 触发事件
     * @param scope 事件触发的作用域
     */
    usitrip.event.UsitripEvent.fn.fireEvent = function(eventName, scope){
        eventName = eventName.toLowerCase();
        var eventFns = this.eventHash[eventName];
        var options = [];
        for(var i= 2,len=arguments.length;i<len;i++){
            options.push(arguments[i]);
        }

        if(!Usitrip.isEmpty(eventFns) && !Usitrip.isEmptyArray(eventFns)){
            var fn , callScope;
            for(var i= 0,len=eventFns.length;i<len;i++){
                fn = eventFns[i].fn;
                callScope = eventFns[i].scope;
                fn.apply(callScope || scope || this, options);
            }
        }
    }

    UsitripEvent = usitrip.event.UsitripEvent;
    UsitripEvent.eventHash = {};
    UsitripEvent.on = usitrip.event.UsitripEvent.fn.on = usitrip.event.UsitripEvent.fn.addListenerEvent;
    UsitripEvent.un = usitrip.event.UsitripEvent.fn.removeEvents;
    UsitripEvent.fireEvent = usitrip.event.UsitripEvent.fn.fireEvent;
    UsitripEvent.addEvents = usitrip.event.UsitripEvent.fn.addEvents;

})();

