app.controller('mainCtrl', function($scope, $location, $rootScope){
	$rootScope.lowerConnection = function() {
		$scope.coneccaoLenta = true;
	}
});