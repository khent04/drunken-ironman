angular.module("utils").directive("zIndex", function () {

    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var zIndexExpression = attrs["zIndex"];

            function zIndexChange(value) {
                element.css("zIndex", value);
            }

            scope.$watch(zIndexExpression, zIndexChange);

        }
    };

});