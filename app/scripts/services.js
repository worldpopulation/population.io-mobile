(function () {
  'use strict';

  angular.module('populationioApp')
    .factory('Data', function ($resource) {
      return $resource('scripts/data.json');
    });
}());