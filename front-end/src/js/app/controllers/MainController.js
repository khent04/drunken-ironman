angular.module("app").controller("MainController", function ($scope, Stickies, JamHttpRequests) {


    function initialize() {
        Stickies.publish($scope, "stickies");
    }

    $scope.addStickyNote = function () {
        Stickies.addStickyNote();
    };

    $scope.editStickyNoteMeta = function (stickyNote) {
        $scope.modal.show({
            stickyNote: stickyNote,
            themes: $scope.stickies.themes
        }, "editStickyNoteModal");
    };

    $scope.toggleLiveUpdateConnection = function () {
        Stickies.toggleLiveUpdateConnection();
    };

    $scope.toggleHttpRequestsJamming = function () {
        if (JamHttpRequests.isActive()) {
            JamHttpRequests.disable();
        } else {
            JamHttpRequests.enable();
        }
        $scope.httpRequestJammingIsActive = JamHttpRequests.isActive();
    };


    initialize();

});