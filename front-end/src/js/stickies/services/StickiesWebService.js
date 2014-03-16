angular.module("stickies").factory("StickiesWebService", function ($http) {

    function extractData(promise) {
        return promise.then(function (response) {
            return response.data;
        });
    }

    function StickiesWebService(requestsUUID, basePath) {

        this.updateStickyNote = function (stickyNote) {
            return extractData($http({
                method: "POST",
                headers: {requestUUID: requestsUUID},
                url: basePath + "/api/sticky-notes",
                data: stickyNote
            }));
        };

        this.deleteStickyNote = function (stickyNote) {
            return extractData($http.delete(basePath + "/api/sticky-notes/" + stickyNote.id));
        };

        this.createStickyNote = function () {
            return extractData($http.put(basePath + "/api/sticky-notes"));
        };

        this.loadStickyNotes = function () {
            return extractData($http.get(basePath + "/api/sticky-notes"));
        };

        this.loadStickyNoteThemes = function () {
            return extractData($http.get(basePath + "/api/sticky-note-themes"));
        };

    }

    return StickiesWebService;

});