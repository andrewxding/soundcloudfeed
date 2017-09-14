
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
              if (user.data !== '0' ){//|| $location.path() != '/login') {
                 console.log('ALLOW');//, user.data);
                $rootScope.user = user.data;

                //auth set user
              } else { //User is not Authenticated
                console.log('DENY');
                //$rootScope.errorMessage = 'You need to log in.';
                //deferred.reject();
                event.preventDefault();
                $location.url('/login');
              }
            }
        );

        // console.log($location.path())
        // if ($location.path() != '/login' && !Auth.getCookie("username")){//!Auth.isLoggedIn()) {
        //     console.log('DENY', Auth.getCookie());
        //     event.preventDefault();
        //     $window.location='/login';
            
        // }
    });
}]);
// app.factory('Auth', function(){
//   var user;
//   ///-------------using hardcoded default vals for now
//   return{
//       createCookie : function(name, value, days) {
//         var expires;
//         if (days) {
//             var date = new Date();
//             date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
//             expires = "; expires=" + date.toGMTString();
//         }
//         else {
//             expires = "";
//         }
//         document.cookie = name + "=" + value + expires + "; path=/";
//         user = name;
//         console.log(user);
//       },
//       getCookie: function (cname=user) {
//           var name = cname + "=";
//           var ca = document.cookie.split(';');
//           for(var i = 0; i < ca.length; i++) {
//               var c = ca[i];
//               while (c.charAt(0) == ' ') {
//                   c = c.substring(1);
//               }
//               if (c.indexOf(name) == 0) {
//                   return c.substring(name.length, c.length);
//               }
//           }
//           return "";
//       },
//       setUser : function(aUser){
//           user = aUser;
//           localStorage.setItem("cloudfeed", JSON.stringify(aUser))
//       },
//       getUser : function(){
//           //return user;
//           return JSON.parse(localStorage.getItem("cloudfeed"))
//       },
//       isLoggedIn : function(){
//           return(user)? user : false;
//       }
//     }
// });