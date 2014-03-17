angular.module("bootstrap-ui").directive("modal", function ($templateCache, $compile) {

    var MODAL = "modal";

    return {
        restrict: "A",
        templateUrl: "/templates/bootstrap-ui/directives/modal.template.html",
        replace: true,
        controller: function ($scope, $element, $attrs) {
            var modalContent;
            var modalScope;
            var containerElement;

            function initialize() {
                var publishName = $attrs[MODAL];
                if (angular.isDefined($scope[publishName])) {
                    throw new Error("Oops...");
                }
                $scope[publishName] = this;
                containerElement = $element.children().children();
            }

            function closeModal() {
                modalContent.remove();
                modalScope.$destroy();
                modalContent = null;
                modalScope = null;
                $element.css("display", "none");
            }

            this.show = function (context, templateId) {
                var scope = $scope.$new(true);
                angular.forEach(context, function (value, key) {
                    scope[key] = value;
                });
                scope.close = closeModal;
                var template = $templateCache.get(templateId);
                var templateElement = angular.element(template);
                $compile(templateElement)(scope);
                containerElement.append(templateElement);
                modalContent = templateElement;
                modalScope = scope;
                $element.css("display", "block");
            };

            this.close = function () {
                closeModal();
            };

            initialize.bind(this)();

        }
    };

});