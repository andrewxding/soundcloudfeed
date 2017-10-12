// var socket = io('http://localhost:8080');
//   socket.on('news', function (data) {
//     console.log(data);
//     socket.emit('my other event', { my: 'data' });
//   });
//   socket.on('connect', function(sock){
//     console.log("connected", socket.id);
  
//   })
var app = angular.module('app', ['ngRoute']);
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/home', {
      templateUrl: 'views/index.ejs',
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
      console.log($location.path())
         $http.get('/loggedin').then(
            function(user) {
            //User is Authenticated
              if (user.data !== '0' || $location.path() == '/signup' || $location.path() == '/home') {
                console.log('ALLOW');//, user.data);
                $rootScope.user = user.data;
                if(!$rootScope.first){
                  $rootScope.socket = io.connect('http://localhost:8080');
                    $rootScope.socket.on('connect', function(){
                    console.log("connected", $rootScope.socket.io.engine.id);
                  })
                  $rootScope.socket.emit('new', {user: user.data.local.username});
                  $rootScope.first = true;
                }
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

