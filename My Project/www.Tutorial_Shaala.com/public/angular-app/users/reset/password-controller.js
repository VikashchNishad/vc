angular.module('tutorialshaala').controller('passwordController', passwordController).controller('resetController', resetController);

function passwordController($http,$location) {
	var vm = this;
     vm.disable = false;
     vm.responseMsg = 'Please Enter Username';
     vm.sendPassword = function(){
	  	if(vm.username){
	  		var user = {
	  			username: vm.username,
	  		}
	  		$http.put('/api/resetpassword', user).then(function(response){
	  			if(response.data.success){
                   vm.responseMsg = response.data.message;
                   vm.error = "";
                   vm.disable = true;
                   console.log(response.data.message); 
	  			} 
	  		}).catch(function(error){
	  			console.log(error.data.message);
	  			vm.error = error.data.message;
	  		});
	  	}
	  }
}


function resetController($http, $routeParams, $scope, $timeout, $location) {
	var vm = this;
    var token = $routeParams.token;
        vm.hide = true; // Hide form until token can be verified to be valid
        // Function to check if token is valid and get the user's info from database (runs on page load)
       $http.get('/api/resetpassword/' + token).then(function(response) {
            // Check if user was retrieved
            if (response.data.success) {
                vm.hide = false; // Show form
                vm.message = 'Please enter a new password'; // Let user know they can enter new password = false;
                vm.error = "";
                $scope.username = response.data.user.username; // Save username in scope for use in savePassword() function
            } 
        }).catch(function(error){
	  			console.log(error.data.message);
	  			vm.error = error.data.message; // Grab error message from JSON object
	  	});

	  	 // Function to save user's new password to database
        vm.savePassword = function() {

		if(!vm.password){
			vm.error = 'Please add new Password.';
		} else{
			if(vm.password !== vm.passwordRepeat){
				vm.error = 'Please make sure the passwords match.';
			} else{
                userData = {
                username: $scope.username, // Grab username from $scope
                password: vm.password
                };
                
                // Run function to save user's new password to database
                $http.put('/api/savepassword', userData).then(function(response) {
             // Check if password was saved to database
                    if (response.data.success) {
                        vm.hide = true;
                        vm.message = response.data.message; // Grab success message from JSON object and redirect
                        vm.error = "";
                        // Redirect to login page after 2000 milliseconds (2 seconds)
                        $timeout(function() {
                            $location.path('/login');
                        }, 5000);
                    } 
                }).catch(function(error){
                    console.log(error.data.message);
		  			vm.error = error.data.message; // Grab error message from JSON object
	  		    });
            

			}
		}
	}
}

