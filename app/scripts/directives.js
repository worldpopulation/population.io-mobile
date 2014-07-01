(function () {
  'use strict';

  angular.module('populationioApp')
    .directive('share', function ($location) {
      return {
        link: function ($scope, elem, attrs) {
          $scope.$watch(function() {
            return $location.absUrl();
          }, function(url) {
            _update(encodeURIComponent(url));
          });

          var _update = function(url) {
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
    })
    ;
}());

