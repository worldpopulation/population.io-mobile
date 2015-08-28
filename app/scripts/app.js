angular
.module('populationioApp', [ 'ngRoute', 'duScroll', 'ngResource', 'ui.router', 'ngAnimate', 'ui.bootstrap','ngTouch', 'pascalprecht.translate','popioconfig'])
.config(function ($locationProvider, $urlRouterProvider, $httpProvider, $translateProvider) {

  // $locationProvider.html5Mode(true);

  // cross domain restriction fixes
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $translateProvider.useSanitizeValueStrategy(null);

  $translateProvider.useStaticFilesLoader({
    prefix: 'i18n/',
    suffix: '.json'
  });

})
.run(function ($rootScope) {
  console.log('App is running...');

  var userLanguage = window.navigator.userLanguage || window.navigator.language;
  $rootScope.defaultLanguage = 'EN';
  if(userLanguage.slice(0,2) == 'es'){
    $rootScope.defaultLanguage = 'ES';
  }

  $rootScope.currentPage = 0;
});
