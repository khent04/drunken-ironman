angular.module("bootstrap-ui").directive("dateInput", function ($locale, $parse) {
    //TODO handle invalid date input (31 february)
    //TODO weak code... refactor...

    function extractYears(k) {
        var result = [];
        var year = (new Date()).getFullYear();
        while (k--) {
            result.push({label: year, value: year});
            year--;
        }
        return result;
    }

    function extractMonths() {
        var result = [];
        var months = $locale.DATETIME_FORMATS.MONTH;
        for (var i = 0, count = months.length; i < count; i++) {
            var month = months[i];
            result.push({value: i, label: month});
        }
        return result;
    }

    function extractDays() {
        var result = [];
        var k = 32;
        while (--k > 0) {
            result.push({value: k, label: k});
        }
        return result;
    }


    var YEARS = extractYears(10);
    var MONTHS = extractMonths();
    var DAYS = extractDays();


    return {
        restrict: "A",
        templateUrl: "/templates/bootstrap-ui/directives/date-input.template.html",
        scope: true,
        link: function (scope, element, attrs) {

            var dateGetter = $parse(attrs["dateInput"]);
            var dateSetter = dateGetter.assign;

            function initialize() {
                scope.years = YEARS;
                scope.months = MONTHS;
                scope.days = DAYS;
                var date = new Date(dateGetter(scope));
                scope.year = date.getFullYear();
                scope.month = date.getMonth();
                scope.day = date.getDate();
                scope.$watch("year", updateDate);
                scope.$watch("month", updateDate);
                scope.$watch("day", updateDate);
            }

            function updateDate() {
                var newDate = new Date(scope.year, scope.month, scope.day).getTime();
                if (newDate !== dateGetter(scope)) {
                    dateSetter(scope, newDate);
                    scope.$eval(attrs.onChange);
                }
            }

            initialize();

        }
    };

});