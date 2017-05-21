angular.module('tutorialshaala').controller('Devops_tutorialController', Devops_tutorialController);

function Devops_tutorialController($route, $routeParams, $window, DataFactory, AuthFactory, jwtHelper) {
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
   
  DataFactory.devops_tutorialDisplay(id).then(function(response) {
    vm.devops_tutorial = response.data;
  });
  


  vm.isLoggedIn = function() {
    if (AuthFactory.isLoggedIn) {
      return true;
    } else {
      return false;
    }
  };

  vm.addComment = function() {

     if( vm.isLoggedIn() ){
    var token = jwtHelper.decodeToken($window.sessionStorage.token);
    var username = token.username;

    var postData = {
      name: username,
      devops_comment: vm.devops_comment
    };
    if (vm.devops_commentForm.$valid) {
      DataFactory.postDevops_comment(id, postData).then(function(response) {
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
