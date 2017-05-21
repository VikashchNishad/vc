angular.module('tutorialshaala').factory('DataFactory', DataFactory);

function DataFactory($http) {
	  return {
       
           
	    devops_tutorialList: devops_tutorialList,
	    devops_tutorialDisplay: devops_tutorialDisplay, 
	    postDevops_comment: postDevops_comment,

	    linux_tutorialList: linux_tutorialList,
	    linux_tutorialDisplay: linux_tutorialDisplay, 
	    postLinux_comment: postLinux_comment


	  };

//-----------------------Devops_Tutorial Factory---------------------------------------------//
	  function devops_tutorialList() {
	    return $http.get('/api/devops_tutorials').then(complete).catch(failed);
	  }

	  function devops_tutorialDisplay(id) {
	    return $http.get('/api/devops_tutorials/' + id).then(complete).catch(failed);
	  }

	  function postDevops_comment(id, devops_comment) {
    	return $http.post('/api/devops_tutorials/' + id + '/devops_comments', devops_comment).then(complete).catch(failed);
  	  }

//-----------------------Linux_Tutorial Factory---------------------------------------------//

  function linux_tutorialList() {
	    return $http.get('/api/linux_tutorials').then(complete).catch(failed);
	  }

	  function linux_tutorialDisplay(id) {
	    return $http.get('/api/linux_tutorials/' + id).then(complete).catch(failed);
	  }

	  function postLinux_comment(id, linux_comment) {
    	return $http.post('/api/linux_tutorials/' + id + '/linux_comments', linux_comment).then(complete).catch(failed);
  	  }




//-------------------------------------------------------------------------------------------//
	 
	 function complete(response) {
	    return response;
	  }

	  function failed(error) {
	    console.log(error.statusText);
	  }
}