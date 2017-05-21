angular.module('tutorialshaala', ['ngRoute', 'angular-jwt']).config(config).run(run);

	function config($httpProvider, $routeProvider, $locationProvider) {
		$httpProvider.interceptors.push(AuthInterceptor);

	  $routeProvider
		.when('/', {
			templateUrl: 'angular-app/main/main.html',
			controller: mainController,
	         controllerAs: 'vm',
			access: {
	  	  	restricted: false
	  	  }
		})
        .when('/tutorials', {
	  		templateUrl: 'angular-app/tutorials/tutorials.html',
	  		controller: tutorialsController,
	         controllerAs: 'vm',
	      access: {
	  	  	restricted: false
	  	  }
	  	})

//------------------------------Devops_Tutorials_API--------------------------------------//
	  	.when('/tutorials/devops_tutorial/continuous_integration/:id', {
	      templateUrl: 'angular-app/tutorials/DevOps/continuous_integration.html',
	      controller: Devops_tutorialController,
	      controllerAs: 'vm',
	      access: {
	  	  	restricted: false
	  	  }
	    })
	    .when('/tutorials/devops_tutorial/configuration_management/:id', {
	      templateUrl: 'angular-app/tutorials/DevOps/configuration_management.html',
	      controller: Devops_tutorialController,
	      controllerAs: 'vm',
	      access: {
	  	  	restricted: false
	  	  }
	    })
	    .when('/tutorials/devops_tutorial/distributed_version_control/:id', {
	      templateUrl: 'angular-app/tutorials/DevOps/distributed_version_control-system.html',
	      controller: Devops_tutorialController,
	      controllerAs: 'vm',
	      access: {
	  	  	restricted: false
	  	  }
	    })

//------------------------------linux_Tutorials_API--------------------------------------//
	  	.when('/tutorials/linux_tutorial/linux_os/:id', {
	      templateUrl: 'angular-app/tutorials/LinuxOS/linux_os_intro.html',
	      controller: Linux_tutorialController,
	      controllerAs: 'vm',
	      access: {
	  	  	restricted: false
	  	  }
	    })
	    .when('/tutorials/linux_tutorial/file_subsystem_managament/:id', {
	      templateUrl: 'angular-app/tutorials/LinuxOS/file_subsystem_managament.html',
	      controller: Linux_tutorialController,
	      controllerAs: 'vm',
	      access: {
	  	  	restricted: false
	  	  }
	    })
	    .when('/tutorials/linux_tutorial/process_management_subsystem/:id', {
	      templateUrl: 'angular-app/tutorials/LinuxOS/process_management_subsystem.html',
	      controller: Linux_tutorialController,
	      controllerAs: 'vm',
	      access: {
	  	  	restricted: false
	  	  }
	    })

//-----------------------------------------------------------------------------------------//
	  	.when('/activate/:token', {
	  		templateUrl: 'angular-app/users/activation/activate.html',
	  		controller: emailController,
	      controllerAs: 'vm',
	  		access: {
	  	  	restricted: false
	  	  }
	  	})
	  	.when('/resend', {
	  		templateUrl: 'angular-app/users/activation/resend.html',
	  		controller: resendController,
	      controllerAs: 'vm',
	  		access: {
	  	  	restricted: false
	  	  }
	  	})
	  	.when('/resetpassword', {
	  		templateUrl: 'angular-app/users/reset/password.html',
	  		controller: passwordController,
	      controllerAs: 'vm',
	  		access: {
	  	  	restricted: false
	  	  }
	  	})
	  	.when('/reset/:token', {
	  		templateUrl: 'angular-app/users/reset/newpassword.html',
	  		controller: resetController,
	      controllerAs: 'vm',
	  		access: {
	  	  	restricted: false
	  	  }
	  	})

//-----------------------------------------------------------------------------------------//
        .when('/about', {
	  		templateUrl: 'angular-app/about/about.html',
	  		controller: contactController,
	      controllerAs: 'vm',
	  		access: {
	  	  	restricted: false
	  	  }
	  	})
	  	.when('/contact', {
	  		templateUrl: 'angular-app/contact/contact.html',
	  		controller: contactController,
	      controllerAs: 'vm',
	  		access: {
	  	  	restricted: false
	  	  }
	  	})
	  	.when('/login', {
			templateUrl: 'angular-app/users/login/login.html',
			controller: LoginController,
			controllerAs: 'vm',
			access: {
	  	  	restricted: false
	  	  }
		})
		.when('/register', {
			templateUrl: 'angular-app/users/register/register.html',
			controller: RegisterController,
			controllerAs: 'vm',
			access: {
	  	  	restricted: false
	  	  }
		})
		.otherwise({
			redirectTo: '/'
		});
		$locationProvider.html5Mode(true).hashPrefix(true);
	}

	function run($rootScope, $location, $window, AuthFactory) {
		$rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
	    	if (nextRoute.access !== undefined && nextRoute.access.restricted && !$window.sessionStorage.token && !AuthFactory.isLoggedIn) {
	     		event.preventDefault();
	        	$location.path('/');
    		}
  		});
	}
