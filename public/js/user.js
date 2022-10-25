// REMARK
app.controller("profile_update", function($scope, $http, userDataService, $window, toaster, userDataService) {
    userDataService.hideCurtains();

    $scope.userData = userDataService.getUserData().data;

    $scope.section = "profile";
    $scope.submitForm = function() {

        toaster.pop({
            type: 'warning',
            title: 'Processing Request',
            body: 'Pleas wait',
            showCloseButton: true
        });
        $http({
                method: 'POST',
                url: 'user/update',
                data: {
                    'userData': $scope.userData
                }
            })
            .success(function(data) {
                toaster.clear();
                if (data.success == true) {

                    toaster.pop({
                        type: 'success',
                        title: 'User Profile Saved',
                        // body: '<a href="#/productview/' + data.data._id + '">Click Here to See</a>',
                        showCloseButton: true
                            // closeHtml: '<button>Close</button>'
                    });
                    userDataService.setUserData(data.data);
                    // window.history.back();
                } else {
                    toaster.clear();
                    toaster.pop({
                        type: 'warning',
                        title: 'Somethng Went Wrong',
                        body: data.message,
                        showCloseButton: true
                            // closeHtml: '<button>Close</button>'
                    });
                }
            }).error(function(response) {
                userDataService.hideCurtains();
                toaster.pop({
                    type: 'error',
                    title: 'Error Has Occurred',
                    body: response.message,
                    showCloseButton: true
                });
            });
    }
});


app.controller("settings_update", function($scope, $http, userDataService, $window, toaster, userDataService) {
    userDataService.hideCurtains();
    $scope.section = "settingsadd";
    $scope.userData = userDataService.getUserData().data;

    $scope.submitForm = function() {

        toaster.pop({
            type: 'warning',
            title: 'Processing Request',
            body: 'Pleas wait',
            showCloseButton: true
        });
        $http({
                method: 'POST',
                url: 'user/update',
                data: {
                    'userData': $scope.userData
                }
            })
            .success(function(data) {
                toaster.clear();
                if (data.success == true) {

                    toaster.pop({
                        type: 'success',
                        title: 'User Profile Saved',
                        // body: '<a href="#/productview/' + data.data._id + '">Click Here to See</a>',
                        showCloseButton: true
                            // closeHtml: '<button>Close</button>'
                    });
                    userDataService.setUserTC(data.data);
                    console.log(userDataService.getUserData());
                    // window.history.back();
                } else {
                    toaster.clear();
                    toaster.pop({
                        type: 'warning',
                        title: 'Somethng Went Wrong',
                        body: data.message,
                        showCloseButton: true
                            // closeHtml: '<button>Close</button>'
                    });
                }
            }).error(function(response) {
                userDataService.hideCurtains();
                toaster.pop({
                    type: 'error',
                    title: 'Error Has Occurred',
                    body: response.message,
                    showCloseButton: true
                });
            });
    }

    $scope.deleteUserTax = function(id){
      toaster.pop({
          type: 'warning',
          title: 'Processing Request',
          body: 'Pleas wait',
          showCloseButton: true
      });

      $http({
              method: 'GET',
              url: 'user/settings/removetax/' + id
          })
          .success(function(data) {
              toaster.clear();
              if (data.success == true) {

                  toaster.pop({
                      type: 'success',
                      title: 'Tax has been removed from the list',
                      // body: '<a href="#/productview/' + data.data._id + '">Click Here to See</a>',
                      showCloseButton: true
                          // closeHtml: '<button>Close</button>'
                  });

                  // console.log(data);
                  userDataService.deleteUserTax(id);
                  // console.log(userDataService.getUserData());
                  // window.history.back();
              } else {
                  toaster.clear();
                  toaster.pop({
                      type: 'warning',
                      title: 'Somethng Went Wrong',
                      body: data.message,
                      showCloseButton: true
                          // closeHtml: '<button>Close</button>'
                  });
              }
          }).error(function(response) {
              userDataService.hideCurtains();
              toaster.pop({
                  type: 'error',
                  title: 'Error Has Occurred',
                  body: response.message,
                  showCloseButton: true
              });
          });
    };

    $scope.addUserTax = function(){
      if(!$scope.newTaxType || !$scope.newTaxRate){
        return;
      }
      toaster.pop({
          type: 'warning',
          title: 'Processing Request',
          body: 'Please wait',
          showCloseButton: true
      });
      $http({
              method: 'POST',
              url: 'user/settings/addtax',
              data: {
                  'userData': { "type" :  $scope.newTaxType, 	"rate" : $scope.newTaxRate }
              }
          })
          .success(function(data) {
              toaster.clear();
              if (data.success == true) {

                  toaster.pop({
                      type: 'success',
                      title: 'Tax has been added to the list',
                      // body: '<a href="#/productview/' + data.data._id + '">Click Here to See</a>',
                      showCloseButton: true
                          // closeHtml: '<button>Close</button>'
                  });

                  $scope.newTaxType = '';
                  $scope.newTaxRate  = '';
                  userDataService.addUserTax(data.data);
                  // console.log(userDataService.getUserData());
                  // window.history.back();
              } else {
                  toaster.clear();
                  toaster.pop({
                      type: 'warning',
                      title: 'Somethng Went Wrong',
                      body: data.message,
                      showCloseButton: true
                          // closeHtml: '<button>Close</button>'
                  });
              }
          }).error(function(response) {
              userDataService.hideCurtains();
              toaster.pop({
                  type: 'error',
                  title: 'Error Has Occurred',
                  body: response.message,
                  showCloseButton: true
              });
          });
    }

    $scope.roundOffPrice = function() {
        $scope.newTaxRate= Math.round($scope.newTaxRate * 100) / 100;
    }


    $scope.submitForm2 = function() {
          console.log($scope.selectedFile);
}
});


app.controller("poassword_change", function($scope, $http, userDataService, $window, toaster, userDataService) {
    userDataService.hideCurtains();
    $scope.section = "password";
    $scope.submitForm = function(){
      console.log($scope.passwordData);
      $http({
              method: 'POST',
              url: 'user/passwordchange/',
              data: {
                  'passwordData': $scope.passwordData
              }
          })
          .success(function(data) {
              toaster.clear();
              if (data.success == true) {

                  toaster.pop({
                      type: 'success',
                      title: data.message,
                      // body: '<a href="#/productview/' + data.data._id + '">Click Here to See</a>',
                      showCloseButton: true
                          // closeHtml: '<button>Close</button>'
                  });

                  $scope.newTaxType = '';
                  $scope.newTaxRate  = '';
                  userDataService.addUserTax(data.data);
                  // console.log(userDataService.getUserData());
                  // window.history.back();
              } else {
                  toaster.clear();
                  toaster.pop({
                      type: 'warning',
                      title: 'Error Has Occurred',
                      body: data.message,
                      showCloseButton: true
                          // closeHtml: '<button>Close</button>'
                  });
              }
          }).error(function(response) {
              userDataService.hideCurtains();
              toaster.pop({
                  type: 'error',
                  title: 'Error Has Occurred',
                  body: response.message,
                  showCloseButton: true
              });
          });

    }

});

app.controller("setting_subscription", function($scope, $http, userDataService, $window, toaster, userDataService) {
    userDataService.hideCurtains();
    $scope.section    =  "subscribtions";
    $scope.userData   =  userDataService.getUserData().data;
    $scope.dateFormat =  userDataService.dateFormat;

      //TODO get the user data from server and show it here !
    $scope.renewSubscriptionPage =  function(){
      sessionStorage.setItem('token', userDataService.getTokken());
      //TODO  move to other subscirbtion page
      $window.location.href="renew.html";
    }

});
