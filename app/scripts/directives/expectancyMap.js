(function () {
    'use strict';

    angular.module('populationioApp')
      .directive('expectancyMap', function ($rootScope, ProfileService, Countries, $filter) {
          return {
              restrict: 'E',
              scope: {
                  countryRef: '=',
                  countryRel: '='
              },
              link: function ($scope, element) {

                  $scope.$watch('countryRef', function (data) {
                      if (data) {
                        console.log(data);
                      }
                  });

                  $scope.$watch('countryRel', function (data) {
                      if (data) {
                      console.log(data);
                      }
                  });


                  ;
              }
          };
      })
    ;

}
()
)
;
