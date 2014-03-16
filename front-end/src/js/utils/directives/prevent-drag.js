angular.module("utils").directive("preventDrag", function () {

    return {
        restrict: "A",
        require: "^drag",
        link: function (scope, element, attrs, dragController) {
            dragController.excludeElement(element);
        }
    };

});