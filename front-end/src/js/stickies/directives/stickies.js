angular.module("stickies").directive("stickies", function () {

    return {
        restrict: "A",
        scope: {
            stickies: "=",
            onEditStickyNoteMeta: "&"
        },
        templateUrl: "/templates/stickies/directives/stickies.template.html",
        replace: true,
        controller: function ($scope) {

            function findBiggestZIndex(stickyNotes) {
                var result = 1;
                for (var i = 0, count = stickyNotes.length; i < count; i++) {
                    result = Math.max(result, stickyNotes[i].zIndex || 0);
                }
                return result;
            }

            function putStickyNoteOnTop(focusedStickyNote) {
                var stickyNotes = $scope.stickies;
                var biggestZIndex = findBiggestZIndex(stickyNotes);
                for (var i = 0, count = stickyNotes.length; i < count; i++) {
                    var stickyNote = stickyNotes[i];
                    stickyNote.zIndex--;
                }
                focusedStickyNote.zIndex = biggestZIndex;
            }

            $scope.mouseDown = function (stickyNote) {
                putStickyNoteOnTop(stickyNote);
            };

        }
    };

});