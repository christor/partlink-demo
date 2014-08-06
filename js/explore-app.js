(function(){
	var app = angular.module('explorePanel', []);
	var data =[];

	// for viewing
	app.controller("TotalController", ['$scope', function($scope){
		$scope.focus = function(niin){
			$scope.information = data[niin];
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

	// for getting json data
	app.controller("InfoController", function($scope){
		$scope.create = function(number){
			data[number] = {};
			data[number].cageInfo = [];
			
		};
		$scope.descriptionInfo = function(info, number){
			//console.log(number);
			data[number].descriptions = (info.results.bindings[0].description.value);
			//console.log(data[number].description);
			current_view = number;
			this.number2 = current_view;			
		};
		$scope.downloadInfo = function(info, number){

		};
		$scope.buyInfo = function(info, number){
			//console.log(number);
			data[number].cageInfo.push(info.results.bindings[0]);
			//console.log(info);
			//console.log(info.results.bindings[0]);
		};
		$scope.specInfo = function(info, number){
			console.log(info);
		}

	});
})();