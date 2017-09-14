
// (function(){
//   var gem = { name: 'Azurite', price: 2.95 };
//   var app = angular.module('gemStore', []);

//   app.controller('StoreController', function($scope, $http){
//     this.products = [{ name: 'Azurite', price: 2.95 },{ name: 'Azurite', price: 2.95 },{ name: 'Azurite', price: 2.95 }];
//     $http.get('http://localhost:8080/activity',headers:{"Authorization": "ilovescotchscotchyscotchscotch"})
//     .then(function(response){
//     	console.log(response.body.songs);
//     	this.songs = response.body.songs;
//     });
//   });
// })();// 


var app = angular.module('app', ['ngRoute']);
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl: '../views/a.html',
      //access: {restricted: true}
    })
    .when('/home', {
      redirectTo: '/views/home.html',
      //access: {restricted: true}
    })
    // .otherwise({
    //   redirectTo: '/'
    // });
});
app.run();//function ($rootScope, $location, $route, AuthService) {});
