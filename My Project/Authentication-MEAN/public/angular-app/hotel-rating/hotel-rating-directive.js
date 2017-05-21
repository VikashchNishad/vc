/*angular.module('meanhotel').directive('hotelRating', hotelRating);

function hotelRating(){
	return{
	restrict: 'E', // Directive is used as a element....
	template: '<span ng-repeat="star in vm.stars track by $index" class="glyphicon glyphicon-star">{{ star }}</span>',
	bindToController: true,     // Binding this directive to controller....
	controller: 'HotelController',
	controllerAs: 'vm',
	scope: {
		stars: '@'
	 }
	}	
}
*/
angular.module('meanhotel').component('hotelRating', {    //No need to binding controller...
  bindings: {
    stars: '='
  },
  template: '<span ng-repeat="star in vm.stars track by $index" class="glyphicon glyphicon-star">{{ star }}</span>',
  controller: 'HotelController',
  controllerAs: 'vm'
});