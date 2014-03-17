angular.module("app").config(function ($httpProvider) {

    $httpProvider.interceptors.push(function ($q,JamHttpRequests) {
        return {
            'request': function (config) {
                if(JamHttpRequests.isActive()){
                    config.url = "http://foo.bar.com/";
                }
                return config;
            }
        };
    });

});

