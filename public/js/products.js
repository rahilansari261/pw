app.controller("product_list", function($scope, $routeParams, $http,$window, userDataService, toaster) {
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
                $window.location.href="#/product/1/";
              return;
          }
            $window.location.href="#/product/1/"+$scope.searchString;
    }

    function pageCalling() {
        $http.get("products/" + pageNo + "/" + perPage + "/" + $scope.searchString)
            .success(function(response) {

                if (response.data.length == 0) {
                    $scope.items = [];
                } else {
                    $scope.items = response.data;
                    var total = response.count;
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
                  $scope.pageLocation  = $scope.pageLocation + ' after searching for ' + $scope.searchString;
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
app.controller("product_add", function($scope, $http, userDataService, $window, toaster, userDataService) {
    userDataService.hideCurtains();
    $scope.taxes = userDataService.getTaxes();
    $scope.productData = {
        product_tax: userDataService.getTaxes()[0],
        product_price: 0.00
    };

    $scope.roundOffPrice = function() {
        $scope.productData.product_price = Math.round($scope.productData.product_price * 100) / 100;
    }
    $scope.submitForm = function() {
        // console.log($scope.productData);
        userDataService.showCurtains();
        toaster.pop({
            type: 'warning',
            title: 'Processing Request',
            body: 'Please wait',
            showCloseButton: true
        });
        $http({
                method: 'POST',
                url: 'products/add',
                data: {
                    'productData': $scope.productData
                }
            })
            .success(function(data) {
                toaster.clear();
                if (data.success == true) {

                    toaster.pop({
                        type: 'success',
                        title: 'Product Added',
                        body: '<a href="#/productview/' + data.data._id + '">Click Here to See</a>',
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


app.controller("product_update", function($scope, $routeParams, $http, userDataService, $window, toaster, userDataService, $route) {
    userDataService.hideCurtains();
    var id = $routeParams.id;
    $scope.taxes = userDataService.getTaxes();
    $http.get("products/fetch/" + id)
        .success(function(response) {
            $scope.productData = response.data;

        }).error(function(response) {
            // userDataService.hideCurtains();
            toaster.pop({
                type: 'error',
                title: 'Error Has Occurred',
                body: response.message,
                showCloseButton: true

            });

        });

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
                    url: 'products/update/',
                    data: {
                        'productData': $scope.productData
                    }
                })
                .success(function(data) {
                    toaster.clear();
                    userDataService.hideCurtains();
                    if (data.success == true) {
                      $route.reload();
                        toaster.pop({
                            type: 'success',
                            title: 'Product Saved',

                            showCloseButton: true
                                // closeHtml: '<button>Close</button>'
                        });
                        // window.history.back();
                    } else {
                        ss
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
