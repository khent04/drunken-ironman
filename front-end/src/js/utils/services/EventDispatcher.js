angular.module("utils").factory("EventDispatcher", function ($rootScope) {

    function byPriority(a, b) {
        return b.priority - a.priority;
    }

    function EventListener(callback, priority) {

        this.callback = callback;
        this.priority = priority;

    }


    function Propagation() {

        this.stopped = false;

    }

    function Event(propagation, data) {

        this.getData = function () {
            return data;
        };

        this.stopPropagation = function () {
            propagation.stopped = true;
        };

    }

    function EventDispatcher() {

        var listenersByEvents = {};

        function findListener(event, listener) {
            var listeners = listenersByEvents[event];
            var result = {
                index: -1,
                listeners: null,
                exists: false
            };
            if (listeners) {
                result.listeners = listeners;
                for (var i = 0, count = listeners.length; i < count; i++) {
                    if (listeners[i].callback === listener) {
                        result.index = i;
                        result.exists = true;
                        break;
                    }
                }
            }
            return result;
        }

        function listenerExists(event, listener) {
            return findListener(event, listener).exists;
        }

        this.addEventListener = function (eventName, listener, priority) {
            if (!angular.isFunction(listener)) {
                throw new Error("Invalid argument error");
            }
            var result = false;
            if (!listenerExists(eventName, listener)) {
                var listeners = listenersByEvents[eventName] = listenersByEvents[eventName] || [];
                listeners.push(new EventListener(listener, parseInt(priority) || 0));
                listeners.sort(byPriority);
                result = true;
            }
            return result;
        };

        this.removeEventListener = function (eventName, listener) {
            var result = findListener(eventName, listener);
            if (result.exists) {
                result.listeners.splice(result.index, 1);
            }
            return result.exists;
        };


        this.dispatch = function (eventName, data) {
            var propagation = new Propagation();
            var event = new Event(propagation, data);
            var listeners = listenersByEvents[eventName];
            if (listeners) {
                for (var i = 0, count = listeners.length; i < count; i++) {
                    var listener = listeners[i];
                    listener.callback.call(null, event);
                    if (propagation.stopped) {
                        break;
                    }
                }
                if (!$rootScope.$$phase) {
                    $rootScope.$apply();
                }
            }
        };

    }

    return function () {
        return new EventDispatcher();
    };

});