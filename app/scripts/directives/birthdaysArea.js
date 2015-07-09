(function () {
    'use strict';

    angular.module('populationioApp')
      .directive('birthdaysChart', ['$filter', 'ProfileService',
          function ($filter, ProfileService) {
              return {
                  restrict: 'E',
                  scope: {
                      continentsData: '=',
                      worldData: '='
                  },
                  link: function ($scope, element) {




                  };
          }]);

}());
