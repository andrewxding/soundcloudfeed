app.controller("activityCtrl",[ '$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    //make this an onload for the page
    $rootScope.socket.on('activity', function(data){
      console.log(data);
    })
    $http.get('/api/activity').then(
          function(res) {
          	//console.log('response', res);
            if (res.data){
               console.log(res.data);
               $scope.songs = res.data;

              //auth set user
            } else { //some kind of error
              console.log('DENY');
              event.preventDefault();
            }
          },
          function(res){
          	//some kind of error
          	console.log('ACTIVITY GET ERROR');
          });
 }]);
app.controller('loginCtrl', [ '$scope', '$window', '$rootScope', '$location', function ($scope, $window, $rootScope, $location) {
  //submit

  $scope.login = function () {
    console.log("Loggin in request")
    // Ask to the server, do your job and THEN set the user
    $.ajax({//create an ajax request to load_page.php
                type: "POST",
                url: "http://localhost:8080/api/login",
                data:{"username": $scope.username, "password": $scope.password},
                success: function(data) {
                    if (data.user) {
                       console.log(data);
                       $window.location = '/stream';
                    }
                    else {
                      alert('Successfully not posted.');
                      $location.path('/login');
                    }
                }
            });

  };
}])

app.controller('profileCtrl', ['$scope',  '$routeParams', '$http', '$rootScope', function ($scope, $routeParams, $http, $rootScope) {

  	$http.get('/api/'+$routeParams.username).then(
          function(res) {
          	//console.log('response', res);
            if (res.data){
                console.log(res.data);
                $scope.user = res.data;
                var arr = $scope.user.followers
				if($scope.user.username == $rootScope.user.local.username)
               		$scope.following = 0;
			  	else if (arr.indexOf($rootScope.user.local.username) > -1)
			  		$scope.following = 1;
			  	else
			  		$scope.following = -1;


            } else { //some kind of error
              console.log('User Not Found');
            }
          },
          function(res){
          	//some kind of error
          	console.log('ACTIVITY GET ERROR');
          }
    );

    $scope.follow = function(){
    	$http({
	  		method: "PATCH",
	  		url: '/follow/'+$routeParams.username,
	  		data: JSON.stringify($rootScope.user)
	  	})
    	.then(
    		function(res){
    			$scope.following = 1;
    		},function(res){
          		console.log('FOLLOW ERROR');
          	}
    	);
    }
    $scope.unfollow = function(){
    	$http({
	  		method: "PATCH",
	  		url: '/unfollow/'+$routeParams.username,
	  		data: JSON.stringify($rootScope.user)
	  	})
    	.then(
    		function(res){
    			$scope.following = -1;
    		},function(res){
          		console.log('FOLLOW ERROR');
          	}
    	);
    }
  	//TODO: add some $watch on something https://www.sitepoint.com/understanding-angulars-apply-digest/ for follow unfollow
}]);

app.controller('mainCtrl', ['$scope',  '$location', '$rootScope', function ($scope, $location, $rootScope) {
  console.log("main");
    // $rootScope.socket = io.connect('http://localhost:8080');
    //   $rootScope.socket.on('connect', function(){
    //   console.log("connected", $rootScope.socket.io.engine.id);
    //  })
      // socket.emit('register', { my: 'data' });
}]);