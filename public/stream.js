
var app = angular.module('app', ['ngRoute']);
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      //access: {restricted: true}
    })
    .when('/login', {
      templateUrl: 'views/login.ejs',
      controller: "loginCtrl"
      //access: {restricted: true}
    })
    .when('/signup', {
      templateUrl: 'views/signup.ejs'
    })
    .when('/stream', {
      templateUrl: 'views/activity.html',
      controller: "activityCtrl"
    })
    .when('/profile/:username', {
      templateUrl: 'views/profile.ejs',
      controller: 'profileCtrl',
      controllerAs: 'pc'
    })
     .otherwise({
       redirectTo: '/'
     });
});

app.run(['$rootScope', '$location', '$window', '$http', function ($rootScope, $location, $window, $http) {
    $rootScope.$on('$routeChangeStart', function (event) {
         $http.get('/loggedin').then(
            function(user) {
            //User is Authenticated
              if (user.data !== '0' || $location.path() == '/signup') {
                 console.log('ALLOW');//, user.data);
                $rootScope.user = user.data;

                //auth set user
              } else { //User is not Authenticated
                console.log('DEN111Y', $location.path());
                //$rootScope.errorMessage = 'You need to log in.';
                //deferred.reject();
                event.preventDefault();
                $location.url('/login');
              }
            }
        );

    });
}]);
