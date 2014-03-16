angular.module("utils").factory("JsonLocalStorage", function ($window, $cookies) {


    function LocalStorageStore() {
        var localStorage = $window.localStorage;

        this.setItem = function (key, value) {
            if (angular.isDefined(value)) {
                localStorage.setItem(key, JSON.stringify(value));
            }
        };

        this.getItem = function (key) {
            var result;
            try {
                result = JSON.parse(localStorage.getItem(key));
            } catch (e) {
                result = null;
            }
            return result === null ? undefined : result;
        };

        this.removeItem = function (key) {
            localStorage.removeItem(key);
        };
    }

    function CookieStore() {

        this.setItem = function (key, value) {
            if (angular.isDefined(value)) {
                $cookies[key] = JSON.stringify(value);
            }
        };

        this.getItem = function (key) {
            var result;
            try {
                result = JSON.parse($cookies[key]);
            } catch (e) {
                result = null;
            }
            return result === null ? undefined : result;
        };

        this.removeItem = function (key) {
            $cookies[key] = null;
            delete $cookies[key];
        };

    }

    var service;
    if (angular.isDefined($window.localStorage)) {
        service = new LocalStorageStore();
    } else {
        service = new CookieStore();
    }
    return service;

});
