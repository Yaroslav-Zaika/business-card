angular.module('app')
  .directive('ctrlEnterSubmit', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        elem.bind('keydown', function(event) {
          var code = event.keyCode || event.which;

          if (code === 13) {
            if (event.ctrlKey) {
              event.preventDefault();
              scope.$apply(attrs.ctrlEnterSubmit);
            }
          }
        });
      }
    }
  });