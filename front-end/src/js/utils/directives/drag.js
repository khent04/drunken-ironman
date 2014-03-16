angular.module("utils").directive("drag", function ($window, $document) {

    var MOUSE_RIGHT_BUTTON = 2;
    var DRAGGED = "dragged";
    var MOUSE_DOWN = "mousedown";
    var MOUSE_UP = "mouseup";
    var MOUSE_MOVE = "mousemove";
    var DRAG_START = "drag_start";
    var DRAG_END = "drag_end";

    return {
        restrict: "A",
        require: "positionable",
        controller: function () {

            var excludedTargets = [];

            function rawElement(element) {
                return element[0];
            }

            this.excludeElement = function (element) {
                excludedTargets.push(rawElement(element));
            };

            this.rawElementIsNotExcluded = function (target) {
                return excludedTargets.indexOf(target) === -1;
            };

        },
        link: function (scope, element, attrs, positionableController) {
            var mouseX;
            var mouseY;
            var dx;
            var dy;
            var animationFrameRequestId;
            var controller;

            function initialize() {
                element.on(MOUSE_DOWN, elementMouseDown);
                controller = element.controller("drag");
            }

            function windowMouseMove(event) {
                dx += event.clientX - mouseX;
                dy += event.clientY - mouseY;
                mouseX = event.clientX;
                mouseY = event.clientY;
                animationFrameRequestId = $window.requestAnimationFrame(update);
            }

            function update() {
                scope.$apply(function () {
                    positionableController.increasePositionX(dx);
                    positionableController.increasePositionY(dy);
                    dx = dy = 0;
                });
            }

            function windowElementMouseUp() {
                element.removeClass(DRAGGED);
                $window.cancelAnimationFrame(animationFrameRequestId);
                $document.off("mousemove", windowMouseMove);
                $document.off("mouseup", windowElementMouseUp);
                scope.$emit(DRAG_END);
            }

            function canStartDrag(event) {
                return (event.button < MOUSE_RIGHT_BUTTON) && controller.rawElementIsNotExcluded(event.target);
            }

            function elementMouseDown(event) {
                if (canStartDrag(event)) {
                    element.addClass(DRAGGED);
                    mouseX = event.clientX;
                    mouseY = event.clientY;
                    dx = dy = 0;
                    animationFrameRequestId = $window.requestAnimationFrame(update);
                    $document.on(MOUSE_MOVE, windowMouseMove);
                    $document.on(MOUSE_UP, windowElementMouseUp);
                    scope.$emit(DRAG_START);
                }
            }

            initialize();

        }
    };

});