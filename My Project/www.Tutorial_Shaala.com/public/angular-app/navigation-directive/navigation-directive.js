angular.module('tutorialshaala').directive('tsNavigation', tsNavigation);

function tsNavigation(){
	return {
			restrict: 'E',
		    templateUrl: 'angular-app/navigation-directive/navigation-directive.html' 
        };
}