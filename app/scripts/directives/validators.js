var MONTH_REGEXP = /(January|February|March|April|May|June|July|August|September|October|November|December)/i;

angular.module('populationioApp')
  .directive('validateMonth', function (Countries) {
      return {
          require: 'ngModel',
          link: function (scope, elm, attrs, ctrl) {
              ctrl.$parsers.unshift(function (viewValue) {
                  if (MONTH_REGEXP.test(viewValue)) {
                      // it is valid
                      ctrl.$setValidity('validateMonth', true);
                      ctrl.$modelValue = moment().month(viewValue).format('MM');
                      ctrl.$viewValue = viewValue.capitalize();
                      ctrl.$render();
                      return viewValue;
                  } else {
                      // it is invalid, return undefined (no model update)
                      ctrl.$setValidity('validateMonth', false);
                      return viewValue;
                  }
              });
          }
      };
  });

angular.module('populationioApp')
  .directive('validateCountry', function () {
      return {
          require: 'ngModel',
          link: function (scope, elm, attrs, ctrl) {
              ctrl.$parsers.unshift(function (viewValue) {
                  if (!viewValue) {
                      ctrl.$setValidity('validateCountry', false);
                      return undefined;
                  }
                  if (_.filter(Countries, function (v) {
                        return v.POPIO_NAME.toLowerCase() == viewValue.toLowerCase()
                    }).length) {
                      ctrl.$setValidity('validateCountry', true);
                      ctrl.$modelValue = viewValue.capitalize();
                      ctrl.$viewValue = viewValue.capitalize();
                      ctrl.$render();
                      return viewValue;
                  } else {
                      ctrl.$setValidity('validateCountry', false);
                      return viewValue;
                  }
              });
          }
      };
  });

angular.module('populationioApp')
  .directive('validateDay', function () {
      return {
          require: 'ngModel',
          link: function (scope, elm, attrs, ctrl) {
              ctrl.$parsers.unshift(function (viewValue) {
                  if (parseInt(viewValue, 0) && parseInt(viewValue, 0) > 0 && parseInt(viewValue, 0) < 32) {
                      // it is valid
                      ctrl.$setValidity('validateDay', true);
                      ctrl.$modelValue = ctrl.$viewValue = parseInt(viewValue, 0).toString();
                      ctrl.$render();

                      return parseInt(viewValue);
                  } else {
                      // it is invalid, return undefined (no model update)
                      ctrl.$setValidity('validateDay', false);
                      return undefined;
                  }
              });
          }
      };
  });
angular.module('populationioApp')
  .directive('validateYear', function () {
      return {
          require: 'ngModel',
          link: function (scope, elm, attrs, ctrl) {
              ctrl.$parsers.unshift(function (viewValue) {
                  if (parseInt(viewValue, 0) && parseInt(viewValue, 0) > 1919 && parseInt(viewValue, 0) <= new Date().getFullYear() - 1) {
                      // it is valid
                      ctrl.$setValidity('validateYear', true);
                      ctrl.$modelValue = ctrl.$viewValue = parseInt(viewValue, 0).toString();
                      ctrl.$render();

                      return parseInt(viewValue, 0);
                  } else {
                      // it is invalid, return undefined (no model update)
                      ctrl.$setValidity('validateYear', false);
                      return undefined;
                  }
              });
          }
      };
  });
