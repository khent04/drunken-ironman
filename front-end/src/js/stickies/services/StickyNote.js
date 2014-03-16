angular.module("stickies").factory("StickyNote", function () {

    function StickyNote(stickiesWebService, id, text, themeId, px, py, createdAt, updatedAt) {

        this.id = id;
        this.text = text;
        this.themeId = themeId;
        this.px = px;
        this.py = py;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;

        this.save = function () {
            stickiesWebService.updateStickyNote(this);
        };

        this.update = function (data) {
            this.text = data.text;
            this.themeId = data.themeId;
            this.px = data.px;
            this.py = data.py;
            this.createdAt = data.createdAt;
            this.updatedAt = data.updatedAt;
        };

        this.delete = function () {
            stickiesWebService.deleteStickyNote(this);
        };

    }

    StickyNote.build = function (data, stickiesWebService) {
        return new StickyNote(
            stickiesWebService,
            data.id,
            data.text,
            data.themeId,
            data.px,
            data.py,
            data.createdAt,
            data.updatedAt
        );
    };

    return StickyNote;

});