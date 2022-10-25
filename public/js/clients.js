app.controller("client_list", function($scope, $routeParams, $http,$window, userDataService, toaster) {
    $scope.items = [];
    var perPage = 10;
    var pageNo = $routeParams.page;
    $scope.pageNo  = parseInt(pageNo);
    var searchString = $routeParams.searchString;
    $scope.searchString = $routeParams.searchString;
    $scope.pageLocation  = 'Showing Page No ' +  pageNo;
    if(!searchString){
      searchString = "";
    }
    $scope.searchString = searchString;
    $scope.search = function() {
      if (!$scope.searchString) {
                $window.location.href="#/client/1/";
              return;
          }
            $window.location.href="#/client/1/"+$scope.searchString;
    }

    function pageCalling() {
        $http.get("clients/" + pageNo + "/" + perPage + "/" + $scope.searchString)
            .success(function(response) {
              userDataService.hideCurtains();
                if (response.result.length == 0) {
                    $scope.items = [];
                } else {
                    $scope.items = response.result;
                    var total = response.totalCount;
                    var pagesNumber = Math.ceil(total / perPage);
                    $scope.pages = [];
                    $scope.pageLocation  = $scope.pageLocation + ' of ' + pagesNumber;
                    for (var i = 1; i <= pagesNumber; i++) {
                        if (i == pageNo) {
                            $scope.pages.push({
                                "number": i,
                                "active": true
                            });
                        } else {
                            $scope.pages.push({
                                "number": i,
                                "active": false
                            });
                        }
                    }
                }
                if($routeParams.searchString){
                  $scope.pageLocation  = $scope.pageLocation + ' of search ' + $scope.searchString;
                }
                userDataService.hideCurtains();
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
    pageCalling();
});

// REMARK
app.controller("client_add", function($scope, $http, userDataService, $window, toaster, userDataService) {
    userDataService.hideCurtains();


    $scope.roundOffPrice = function() {
        $scope.productData.product_price = Math.round($scope.productData.product_price * 100) / 100;
    }
    $scope.submitForm = function() {
        // console.log($scope.productData);
        userDataService.showCurtains();
        toaster.pop({
            type: 'warning',
            title: 'Processing Request',
            body: 'Pleas wait',
            showCloseButton: true
        });
        $http({
                method: 'POST',
                url: 'clients/add',
                data: {
                    'clientData': $scope.clientData
                }
            })
            .success(function(data) {
                toaster.clear();
                if (data.success == true) {

                    toaster.pop({
                        type: 'success',
                        title: 'Client Added',
                        body: '<a href="#/clientview/' + data.data._id + '">Click Here to See</a>',
                        showCloseButton: true
                            // closeHtml: '<button>Close</button>'
                    });
                    window.history.back();
                } else {
                    userDataService.hideCurtains();
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


app.controller("client_update", function($scope,$route, $routeParams, $http, userDataService, $window, toaster, userDataService) {
    userDataService.hideCurtains();
    var id = $routeParams.id;

    $http.get("clients/fetch/" + id)
        .success(function(response) {
            $scope.clientData = response.message;

        }).error(function(response) {

            toaster.pop({
                type: 'error',
                title: 'Error Has Occurred',
                body: response.message,
                showCloseButton: true
            });
        });
        $scope.submitForm = function() {
          userDataService.showCurtains();
            toaster.pop({
                type: 'warning',
                title: 'Processing Request',
                body: 'Pleas wait',
                showCloseButton: true
            });

            $http({
                    method: 'POST',
                    url: 'clients/update/',
                    data: {
                        'clientData': $scope.clientData
                    }
                })
                .success(function(data) {
                    toaster.clear();
                    if (data.success == true) {
                      $route.reload();
                        toaster.pop({
                            type: 'success',
                            title: 'Client Saved',
                            showCloseButton: true
                        });

                    } else {
                      userDataService.hideCurtains();
                        toaster.pop({
                            type: 'warning',
                            title: 'Somethng Went Wrong',
                            body: data.message,
                            showCloseButton: true
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
