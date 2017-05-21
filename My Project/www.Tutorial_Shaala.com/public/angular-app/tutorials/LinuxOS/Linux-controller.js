angular.module('tutorialshaala').controller('Linux_tutorialController', Linux_tutorialController);

function Linux_tutorialController($route, $routeParams, $window, DataFactory, AuthFactory, jwtHelper) {
  var vm = this;
  var id = $routeParams.id;
  vm.isSubmitted = false;

   DataFactory.devops_tutorialList().then(function(response) {
    // console.log(response);
    vm.devops_tutorials = response.data;
  });

   DataFactory.linux_tutorialList().then(function(response) {
    // console.log(response);
    vm.linux_tutorials = response.data;
  });

  DataFactory.linux_tutorialDisplay(id).then(function(response) {
    vm.linux_tutorial = response.data;
  });


  vm.isLoggedIn = function() {
    if (AuthFactory.isLoggedIn) {
      return true;
    } else {
      return false;
    }
  };

  vm.add_Linux_Comment = function() {

     if( vm.isLoggedIn() ){
    var token = jwtHelper.decodeToken($window.sessionStorage.token);
    var username = token.username;

    var postData = {
      name: username,
      linux_comment: vm.linux_comment
    };
    if (vm.linux_commentForm.$valid) {
      DataFactory.postLinux_comment(id, postData).then(function(response) {
        if (response.status === 200) {
          $route.reload();
        }
      }).catch(function(error) {
        console.log(error);
      });
    } else {
      vm.isSubmitted = true;
    }

  } else {
    vm.error = "Please Login!"
  }
  };

}
