angular.module("stickies").factory("StickiesWebService", function ($http) {

    function extractData(promise) {
        return promise.then(function (response) {
            return response.data;
        });
    }

    function StickiesWebService(requestsUUID) {

        this.updateStickyNote = function (stickyNote) {
            return extractData($http({
                method: "POST",
                headers: {requestUUID: requestsUUID},
                url: "/api/sticky-notes",
                data: stickyNote
            }));
        };

        this.deleteStickyNote = function (stickyNote) {
            return extractData($http.delete("/api/sticky-notes/" + stickyNote.id));
        };

        this.createStickyNote = function () {
            return extractData($http.put("/api/sticky-notes"));
        };

        this.loadStickyNotes = function () {
            return extractData($http.get("/api/sticky-notes"));
        };

        this.loadStickyNoteThemes = function () {
            return extractData($http.get("/api/sticky-note-themes"));
        };

    }

    return StickiesWebService;

});