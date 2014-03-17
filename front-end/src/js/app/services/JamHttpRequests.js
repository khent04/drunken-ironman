angular.module("app").service("JamHttpRequests", function JamHttpRequests() {

    var state = false;

    this.enable = function () {
        state = true;
    };

    this.disable = function () {
        state = false;
    };

    this.isActive = function () {
        return state;
    };


});