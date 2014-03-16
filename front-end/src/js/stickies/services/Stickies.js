angular.module("stickies").service("Stickies", function Stickies(StickiesWebService, StickyNote, StickiesLiveUpdate, UUID, $timeout) {

    var RECONNECT_LIVE_UPDATE_TIMEOUT = 10000;

    var stickies;
    var stickiesWebService;
    var stickiesLiveUpdate;
    var restartLiveUpdateTimeoutPromise;

    function extractStickyNotes(stickyNotes, stickiesWebService) {
        var result = [];
        for (var i = 0, count = stickyNotes.length; i < count; i++) {
            result.push(StickyNote.build(stickyNotes[i], stickiesWebService));
        }
        return result;
    }

    function findStickyNoteById(stickyNotes, id) {
        var result = {found: false};
        for (var i = 0, count = stickyNotes.length; i < count; i++) {
            var stickyNote = stickyNotes[i];
            if (stickyNote.id === id) {
                result.found = true;
                result.stickyNote = stickyNote;
                result.index = i;
                break;
            }
        }
        return result;
    }


    function createListeners(f) {
        return function (event) {
            f.call(null, event.getData());
        }
    }


    function createStickyNote(stickyNote) {
        stickies.stickyNotes.push(StickyNote.build(stickyNote, stickiesWebService));
    }

    function updateStickyNote(stickyNote) {
        var result = findStickyNoteById(stickies.stickyNotes, stickyNote.id);
        if (result.found) {
            result.stickyNote.update(stickyNote);
        }
    }

    function deleteStickyNote(stickyNoteId) {
        var result = findStickyNoteById(stickies.stickyNotes, stickyNoteId);
        if (result) {
            stickies.stickyNotes.splice(result.index, 1);
        }
    }


    function liveUpdateConnected() {
        $timeout.cancel(restartLiveUpdateTimeoutPromise);
        stickies.liveUpdateConnected = true;
        stickiesWebService.loadStickyNotes().then(function (stickyNotes) {
            stickies.stickyNotes = extractStickyNotes(stickyNotes, stickiesWebService);
            stickiesLiveUpdate.stopRetention();
        });
    }

    function liveUpdateDisconnected() {
        stickies.liveUpdateConnected = false;
        restartLiveUpdateTimeoutPromise = $timeout(stickiesLiveUpdate.connect, RECONNECT_LIVE_UPDATE_TIMEOUT);
    }

    function initialize() {
        stickies = {
            liveUpdateConnected: false
        };
        var requestsUUID = UUID();
        stickiesWebService = new StickiesWebService(requestsUUID, "http://localhost:9000");
        stickiesLiveUpdate = new StickiesLiveUpdate(requestsUUID);

        stickiesLiveUpdate.addUpdateStickyNoteListener(createListeners(updateStickyNote));
        stickiesLiveUpdate.addDeleteStickyNoteListener(createListeners(deleteStickyNote));
        stickiesLiveUpdate.addCreateStickyNoteListener(createListeners(createStickyNote));
        stickiesLiveUpdate.addDisconnectedListener(liveUpdateDisconnected);
        stickiesLiveUpdate.addConnectedListener(liveUpdateConnected);
        stickiesLiveUpdate.startRetention();
        stickiesLiveUpdate.connect();

        stickiesWebService.loadStickyNoteThemes().then(function (themes) {
            stickies.themes = themes;
        });

    }

    this.addStickyNote = function () {
        stickiesWebService.createStickyNote();
    };

    this.deleteStickyNote = function (stickyNote) {
        var index = stickies.indexOf(stickyNote);
        if (index !== -1) {
            stickies.splice(index, 1);
        }
    };

    this.publish = function (scope, publishName) {
        scope[publishName] = stickies;
    };

    this.toggleLiveUpdateConnection = function () {
        if (stickiesLiveUpdate.isConnected()) {
            stickiesLiveUpdate.disconnect();
        } else {
            stickiesLiveUpdate.connect();
        }
    };

    initialize();

});