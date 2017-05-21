
angular.module('tutorialshaala').controller('tutorialsController', tutorialsController);

function tutorialsController(DataFactory) {
  var vm = this;
  vm.title = 'MEAN Tutorial_Shaala App';
  DataFactory.devops_tutorialList().then(function(response) {
    // console.log(response);
    vm.devops_tutorials = response.data;
  });

   DataFactory.linux_tutorialList().then(function(response) {
    // console.log(response);
    vm.linux_tutorials = response.data;
  });
}