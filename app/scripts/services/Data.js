'use strict';

angular.module('populationioApp')
  .factory('Data', function ($resource) {
    return $resource('scripts/services/data.json');
  });
