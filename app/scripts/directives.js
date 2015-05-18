(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('share', ['$location',
      function ($location) {
        return {
          link: function ($scope, elem, attrs) {
            $scope.$watch(function () {
              return $location.absUrl();
            }, function (url) {
              _update(encodeURIComponent(url));
            });

            var _update = function (url) {
              var link = '#';
              switch (attrs.share) {
                case 'twitter':
                  link = 'http://twitter.com/intent/tweet?text=' + attrs.shareTitle + '%20' + url;
                  break;
                case 'facebook':
                  link = 'http://facebook.com/sharer.php?u=' + url;
                  break;
                case 'linkedin':
                  link = 'http://www.linkedin.com/shareArticle?mini=true&url=' + url + '&title=' + attrs.shareTitle;
                  break;
              }
              attrs.$set('href', link);
            }
          }
        };
      }])
    .directive('stoptab', ['$location',
      function ($location) {
        return function (scope, element, attrs) {
          element.bind("keydown keypress", function (event) {
            if (event.which === 9) {
              element.blur()
              event.preventDefault();
            }
          });
        };
      }])
      .directive('compileUnsafe', function ($compile) {
            return function (scope, element, attr) {
              scope.$watch(attr.compileUnsafe, function (val, oldVal) {
                if (!val || (val === oldVal && element[0].innerHTML)) return;
                element.html(val);
                $compile(element)(scope);
              })}})
  ;
}());
