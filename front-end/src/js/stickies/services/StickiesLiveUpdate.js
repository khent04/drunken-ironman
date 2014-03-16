angular.module("stickies").factory("StickiesLiveUpdate", function (WebSocket, EventDispatcher) {


    var UPDATE_STICKY_NOTE = "update_sticky_note";
    var DELETE_STICKY_NOTE = "delete_sticky_note";
    var CREATE_STICKY_NOTE = "create_sticky_note";
    var DISCONNECTED = "disconnected";
    var CONNECTED = "connected";

    var UPDATE = "update";
    var DELETE = "delete";
    var CREATE = "create";

    function StickiesLiveUpdate(requestsUUID) {
        var websocket;
        var eventDispatcher;
        var retention;
        var retainedMessages;

        function connect() {
            websocket = new WebSocket("ws:://localhost:9000/api/sticky-notes/live-update");
            websocket.onopen = websocketOnOpen;
            websocket.onerror = websocketOnError;
            websocket.onmessage = websocketOnMessage;
            websocket.onclose = websocketOnClose;
        }

        function initialize() {
            retention = false;
            retainedMessages = [];
            eventDispatcher = new EventDispatcher();
        }

        function handleMessage(message) {
            switch (message.type) {
                case UPDATE :
                    eventDispatcher.dispatch(UPDATE_STICKY_NOTE, message.stickyNote);
                    break;
                case DELETE :
                    eventDispatcher.dispatch(DELETE_STICKY_NOTE, message.stickyNoteId);
                    break;
                case CREATE :
                    eventDispatcher.dispatch(CREATE_STICKY_NOTE, message.stickyNote);
                    break;
                default :
                    break;
            }
        }

        function websocketOnOpen() {
            eventDispatcher.dispatch(CONNECTED);
        }

        function websocketOnError() {
            //TODO
        }

        function websocketOnClose() {
            retainedMessages.length = 0;
            websocket.onopen = null;
            websocket.onerror = null;
            websocket.onmessage = null;
            websocket.onclose = null;
            websocket = null;
            eventDispatcher.dispatch(DISCONNECTED);
        }

        function websocketOnMessage(event) {
            var message;
            try {
                message = JSON.parse(event.data);
                //TODO refactor requestsUUID the filtering part
                //only handle message from other clients
                if (message.requestUUID !== requestsUUID) {
                    if (retention) {
                        retainedMessages.push(message);
                    } else {
                        handleMessage(message);
                    }
                }
            } catch (error) {
                //TODO
            }
        }


        this.addUpdateStickyNoteListener = function (listener) {
            eventDispatcher.addEventListener(UPDATE_STICKY_NOTE, listener);
        };

        this.addDeleteStickyNoteListener = function (listener) {
            eventDispatcher.addEventListener(DELETE_STICKY_NOTE, listener);
        };

        this.addCreateStickyNoteListener = function (listener) {
            eventDispatcher.addEventListener(CREATE_STICKY_NOTE, listener);
        };

        this.addDisconnectedListener = function (listener) {
            eventDispatcher.addEventListener(DISCONNECTED, listener);
        };

        this.addConnectedListener = function (listener) {
            eventDispatcher.addEventListener(CONNECTED, listener);
        };

        this.connect = function () {
            connect();
        };

        this.isConnected = function () {
            return websocket && websocket.readyState <= 1;
        };

        this.disconnect = function () {
            try {
                websocket.close();
            } catch (e) {

            }
        };

        this.startRetention = function () {
            retention = true;
        };

        this.stopRetention = function () {
            for (var i = 0, count = retainedMessages.length; i < count; i++) {
                var message = retainedMessages[i];
                handleMessage(message);
            }
            retainedMessages.length = 0;
            retention = false;
        };

        initialize();


    }

    return StickiesLiveUpdate;

});