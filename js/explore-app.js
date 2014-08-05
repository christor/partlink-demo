(function(){
	var app = angular.module('explorePanel', []);
	var data =[];

	app.controller("TotalController", ['$scope', function($scope){
		$scope.focus = function(niin){
			$scope.information = data[niin].description;
		};
	}])
	// for controlling the tab behavior
	app.controller("TabController", function(){
		this.tab = 1;
		this.isSet = function(checkTab){
			return this.tab === checkTab;
		};

		this.setTab = function(setTab){
			this.tab = setTab;
		};
	});
	app.controller("InfoController", function($scope){
		$scope.descriptionInfo = function(info, number, $scope){
			data[number] = {};
			data[number].description = (info.results.bindings[0].description.value);
			//console.log(data[number].description);
			current_view = number;
			this.number2 = current_view;			
		}
		$scope.downloadInfo = function(info, number){
			console.log(info);
		};
		$scope.buyInfo = function(info, number){
			console.log(info);
		};

	});
})();