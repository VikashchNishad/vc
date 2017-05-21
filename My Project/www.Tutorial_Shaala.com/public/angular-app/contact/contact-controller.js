angular.module('tutorialshaala').controller('contactController', contactController);

function contactController($http, $location, $route, $timeout) {
	var vm = this;

	 vm.isSuccesMassage = false;


	  vm.contact = function() {
	  		var contact_data = {
	  			contactName: vm.name,
	  			contactEmail: vm.email,
	  			contactMsg: vm.comments
	  		}

	  		if(!vm.name || !vm.email || !vm.comments){
					vm.error = 'Please add a name, a email and a Massage.';
			} else {
				$http.post('/api/contact', contact_data).then(function(response){
					if(response.data.success){
					vm.message = response.data.message;;
					vm.error = "";	  
					vm.isSuccesMassage = true;
					$timeout(function() {
                            $route.reload();
                        }, 4000);
                }
				}).catch(function(error){
					vm.error = 'Something went worng try again!;';
					console.log(error);
				});
            }
         }
}
	  	
	  