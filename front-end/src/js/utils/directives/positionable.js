angular.module("utils").directive("positionable", function ($parse) {

    var POSITION_X_ATTRIBUTE = "px";
    var POSITION_Y_ATTRIBUTE = "py";
    var PX = "px";
    var POSITION_X_DEFAULT_VALUE = 0;
    var POSITION_Y_DEFAULT_VALUE = 0;


    return {
        restrict: "A",
        controller: function positionable($scope, $element, $attrs) {
            var positionXGetter;
            var positionXSetter;
            var positionYGetter;
            var positionYSetter;

            function positionXChange(value) {
                $element.css("left", value + PX);
            }

            function positionYChange(value) {
                $element.css("top", value + PX);
            }

            function initialize() {
                var positionXExpression = $attrs[POSITION_X_ATTRIBUTE];
                var positionYExpression = $attrs[POSITION_Y_ATTRIBUTE];
                positionXGetter = $parse(positionXExpression);
                positionXSetter = positionXGetter.assign;
                positionYGetter = $parse(positionYExpression);
                positionYSetter = positionYGetter.assign;
                if (angular.isUndefined(positionXGetter($scope))) {
                    positionXSetter($scope, POSITION_X_DEFAULT_VALUE);
                }
                if (angular.isUndefined(positionYGetter($scope))) {
                    positionYSetter($scope, POSITION_Y_DEFAULT_VALUE);
                }
                $scope.$watch(positionXExpression, positionXChange);
                $scope.$watch(positionYExpression, positionYChange);
            }

            this.setPositionX = function (value) {
                if (angular.isNumber(value)) {
                    positionXSetter($scope, value);
                }
            };

            this.setPositionY = function (value) {
                if (angular.isNumber(value)) {
                    positionYSetter($scope, value);
                }
            };

            this.increasePositionX = function (value) {
                if (angular.isNumber(value)) {
                    positionXSetter($scope, positionXGetter($scope) + value);
                }
            };

            this.increasePositionY = function (value) {
                if (angular.isNumber(value)) {
                    positionYSetter($scope, positionYGetter($scope) + value);
                }
            };

            initialize();


        }
    };

});