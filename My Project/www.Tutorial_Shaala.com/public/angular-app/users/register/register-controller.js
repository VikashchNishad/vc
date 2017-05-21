angular.module('tutorialshaala').controller	('RegisterController', RegisterController);

function RegisterController($http) {
	var vm = this;
	
    vm.isSuccesRegister = false;
    

	vm.register = function() {
		var user = {
			username: vm.username,
			password: vm.password,
			email: vm.email,
			name: vm.name
		};

		if(!vm.username || !vm.password || !vm.email || !vm.name){
			vm.error = 'Please add a Username, a Email, a Name and Password.';
		} else{
			if(vm.password !== vm.passwordRepeat){
				vm.error = 'Please make sure the passwords match.';
			} else{
				$http.post('/api/users/register', user).then(function(response){
					vm.isSuccesRegister = true;	                   
	                   vm.error = false;
					vm.message = response.data.message;
					if(response.data.success){
					console.log(result);
					vm.message = response.data.message;	
					}

				}).catch(function(error){
					console.log(error.data.message);
					vm.error = error.data.message;
					
				});
			}
		}
	}
};