angular.module('tutorialshaala').controller('emailController', emailController).controller('resendController', resendController);

function emailController($http, $routeParams, $timeout, $location) {
	var vm = this;
	var token = $routeParams.token;
 
     $http.put('/api/activate/' + token).then(function(response){
			
			    if(response.data.success){
                   vm.Msg = response.data.message; // If not successful, grab message from JSON object and redirect to login page
               // Redirect after 2000 milliseconds (2 seconds)
                   $timeout(function() {
                    $location.path('/login');
                }, 6000);
			 } 
		}).catch(function(error){
			console.log(error);
			vm.error = error.data.message;
			$timeout(function() {
                    $location.path('/login');
                }, 6000);
		});

}


function resendController($http){
    var vm = this;
     vm.errSend = true; 
    vm.checkCredentials = function(){
	  	if(vm.username && vm.password){
	  		var user = {
	  			username: vm.username,
	  			password: vm.password
	  		}
              
          
	  		$http.post('/api/resend', user).then(function(response){
	  			if(response.data.success){
	  				 $http.put('/api/resend', user).then(function(response) {
                       if (response.data.success) {
                       	   vm.errSend = false;
                       	    vm.errorMsg = false;
                            vm.successMsg = response.data.message; // If successful, grab message from JSON object           
                        }
	  				 }).catch(function(error){
	  			     vm.errorMsg = error.data.message;
	  		     });
	  			} 
	  		}).catch(function(error){
	  			
                vm.errorMsg = error.data.message; // If credentials do not match, display error from JSON object
	  		});
	  	}
	  }

}