app.controller("account_list", function($scope, $routeParams, $http, $window, userDataService, toaster) {
  $scope.items = [];
  var perPage = 10;
  var pageNo = $routeParams.page;
  $scope.pageNo = parseInt(pageNo);
  var searchString = $routeParams.searchString;
  $scope.searchString = $routeParams.searchString;
  $scope.pageLocation = 'Showing Page No ' + pageNo;
  if (!searchString) {
      searchString = "";
  }
  $scope.dataFormat = userDataService.dateFormat;
  $scope.items = [];
  $scope.searchString = searchString;
  $scope.search = function() {
      if (!$scope.searchString) {
          $window.location.href = "#/account/1/";
          return;
      }
      $window.location.href = "#/account/1/"+ $scope.searchString;
  }



  function pageCalling() {
      $http.get("clientaccounts/" + pageNo + "/" + perPage + "/" + $scope.searchString)
          .success(function(response) {
              userDataService.hideCurtains();
              if (response.data.length == 0) {
                  $scope.items = [];
              } else {
                  $scope.items = response.data;

                  var total = response.totalCount;
                  var pagesNumber = Math.ceil(total / perPage);
                  $scope.pages = [];
                  $scope.pageLocation = $scope.pageLocation + ' of ' + pagesNumber;
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
              if ($routeParams.searchString) {
                  $scope.pageLocation = $scope.pageLocation + ' after searching for ' + $scope.searchString;
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

app.controller("account_view", function($scope, $routeParams, $http, $window, userDataService, toaster) {
  $scope.items = [];
  userDataService.hideCurtains();
  $scope.dateFormat =  userDataService.dateFormat;
  var perPage = 10;
  var pageNo = $routeParams.page;
  $scope.pageNo = parseInt(pageNo);
  // $scope.myDate = new Date();
  $scope.myDate2 = new Date();
  $scope.myDate = new Date($scope.myDate2.getTime() - 30*24*60*60*1000);
      $scope.isOpen = false;
      $scope.isOpen2 = false;

      $scope.openCalendar = function(e, picker) {
        if($scope.isOpen) {$scope.isOpen = false;   return}
        if($scope.isOpen2) {$scope.isOpen2 = false;  }
          e.preventDefault();
          e.stopPropagation();

          $scope.isOpen = true;
      };

      $scope.openCalendar2 = function(e, picker) {
        if($scope.isOpen) {$scope.isOpen = false;   }
        if($scope.isOpen2) {$scope.isOpen2 = false;  return}

          e.preventDefault();
          e.stopPropagation();
          $scope.isOpen2 = true;
      };

      $scope.search = function(){
        if(!$scope.searchString){
           pageCalling();
             $scope.searchMessage  ='';
           return;
        }
        toaster.pop({
            type: 'warning',
            title: 'Processing',
            body: '',
            showCloseButton: true
        });

            $http.get("/accounts/search/"+$scope.clientData._id +'/' + $scope.searchString).success(function(response){
              toaster.clear();
              $scope.searchMessage  ='Search Result in Remarks';
              $scope.items = response.data;
              for (var i = $scope.items.length-1; i >-1; i--) {
                if($scope.searchString)
                  $scope.items[i]['entry_balance']  =  0;
               }
                $scope.pages = [];
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
      $scope.searchFunction = function(){
          // console.log($scope.myDate);
          // console.log($scope.myDate2);
        if(!$scope.myDate || !$scope.myDate2 ){
          // console.log('return');
            $scope.searchMessage  ='';
          return;
        }
        $scope.searchMessage  ='Search Result Between Dates';
        var search = '';
        if($scope.searchString){
          search =   $scope.searchString + '/';
            $scope.searchMessage  ='Search Result Between Dates and Remarks';
        }
        var startDate=  userDataService.dateQuery($scope.myDate );
        var endDate=  userDataService.dateQuery($scope.myDate2 );
        toaster.pop({
            type: 'warning',
            title: 'Processing',
            body: '',
            showCloseButton: true
        });

            $http.get("/accounts/search/"+$scope.clientData._id +'/' +search + startDate + '/' + endDate).success(function(response){
              toaster.clear();
              $scope.items = response.result;
              var balanceOld = response.balanceOld;
              for (var i = $scope.items.length-1; i >-1; i--) {
                if($scope.searchString)
                  $scope.items[i]['entry_balance']  =  0;
                else
                 {$scope.items[i]['entry_balance']  =  balanceOld + $scope.items[i].entry_amount_out - $scope.items[i].entry_amount_in;
                 balanceOld =   $scope.items[i]['entry_balance'];}
               }
                $scope.pages = [];
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



      $scope.clientData = { "client_company_name" : 'Loading', "client_balance" : 0};
      $http.get("/clients/fetch/" + $routeParams.id).success(function(response){
        if(response.success)
          {$scope.clientData = response.message;}
          else {
            toaster.pop({
                type: 'warning',
                title: 'Failed',
                body: response.message,
                showCloseButton: true
            });
          }
      });

      function pageCalling() {
          $http.get("accounts/" + $routeParams.id  + "/" + pageNo + "/" + perPage )
              .success(function(response) {
                  if (response.result.length == 0) {
                      $scope.items = [];
                  } else {
                      $scope.items = response.result;
                      var total = response.count;
                      var pagesNumber = Math.ceil(total / perPage);
                      $scope.pages = [];
                      var balanceOld = response.balanceOld;
                      for (var i = $scope.items.length-1; i >-1; i--) {
                         $scope.items[i]['entry_balance']  =  balanceOld + $scope.items[i].entry_amount_out - $scope.items[i].entry_amount_in;
                         balanceOld =   $scope.items[i]['entry_balance'];
                       }
                      $scope.pageLocation = $scope.pageLocation + ' of ' + pagesNumber;
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
                  if ($routeParams.searchString) {
                      $scope.pageLocation = $scope.pageLocation + ' after searching for ' + $scope.searchString;
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


app.controller("account_entry", function($scope, $routeParams, $http, $window, userDataService, toaster) {
  $scope.items = [];
  $scope.myDate2 = new Date();
  $scope.isOpen = false
  $scope.today= new Date()
  $scope.openCalendar2 = function(e, picker) {
    if($scope.isOpen) {$scope.isOpen = false;   }
    if($scope.isOpen2) {$scope.isOpen2 = false;  return}

      e.preventDefault();
      e.stopPropagation();
      $scope.isOpen = true;
  };
  $scope.txnTypes = ['Cash', 'Cheque', 'NEFT', 'RTGS' , 'Others', 'UPI'];
  $scope.txnSelected = $scope.txnTypes[0];
  userDataService.hideCurtains();
  $scope.dateFormat =  userDataService.dateFormat;
  $scope.entryType = 1;
  $scope.remark2 ='';
  $scope.stopForm = false;
  $scope.amount = 0.00;
  $scope.accountData = {
            client_id     :"",
            client_name     :"",
            client_company      :"",
            entry_date      :"",
            entry_transaction_number     : "",
            entry_remarks     : "",
            entry_type      : "User",
            entry_amount_in     :0,
            entry_amount_out      :0,
            entry_balance     :0,
            invoice_list : null
      }
      $http.get("/invoices/unpaid/" + $routeParams.id).success(function(response){
          $scope.invoices = response.data;
          $scope.invoices2 =response.data;
          for (var i = 0; i < $scope.invoices.length; i++) {
            $scope.invoices[i]['amount'] = 0;
          }
      });

              $http.get("/clients/fetch/" + $routeParams.id).success(function(response){
                userDataService.hideCurtains();

                if(response.success)
                  {$scope.clientData = response.message;
                      $scope.accountData.client_id =  $scope.clientData._id;
                      $scope.accountData.client_name =  $scope.clientData.client_name;
                      $scope.accountData.client_company =  $scope.clientData.client_company_name;
                  }
                  else {
                    toaster.pop({
                        type: 'warning',
                        title: 'Failed',
                        body: response.message,
                        showCloseButton: true
                    });
                  }
              });

              $scope.dateChanged = function(){
                // $scope.amount = 0;
                // $scope.advance =0;
                $scope.calculateBalance();
                var NewDate = new Date($scope.myDate2);
                NewDate.setDate(NewDate.getDate() + 1);
                // console.log(NewDate);
                $scope.invoices =  $scope.invoices2.filter(function(o){ return new Date(o.invoice_data.date).getTime() < NewDate.getTime()});
                for (var i = 0; i < $scope.invoices.length; i++) {
                  $scope.invoices[i]['amount'] = 0;
                }
                $scope.amount = 0;
                $scope.advance =0;
              }



            $scope.calculateBalance = function() {
              $scope.stopForm = false;
              // $scope.alertMessage =  'Please enter valid number.';
                    if (isNaN($scope.amount)) {
                        $scope.amount = 0;
                        $scope.stopForm = true;
                        $scope.alertMessage =  'Please enter valid number.';
                    }
                    if ($scope.amount<=0) {
                        $scope.amount = 0;
                        $scope.stopForm = true;
                        $scope.alertMessage =  'Please enter value more than 0.';
                    }
                    if ($scope.entryType == 1) {
                        // $scope.remark2 = '';
                        $scope.accountData.entry_balance    = $scope.clientData.client_balance - $scope.amount;
                        $scope.accountData.entry_amount_in  = $scope.amount;
                        $scope.accountData.entry_amount_out = 0;
                        $scope.advance = $scope.amount;
                          $scope.inviDistribution();
                        // $scope.remark2 = $scope.remark2  + 'Advance of &#8377;' + $scope.advance;
                    } else {
                        $scope.accountData.entry_balance     = $scope.clientData.client_balance + $scope.amount;
                        $scope.accountData.entry_amount_in   = $scope.amount*-1;
                        $scope.accountData.entry_amount_out  = 0;

                    }
                }

                $scope.inviDistribution = function () {
                  $scope.advance = $scope.amount;
                  $scope.stopForm = false;
                  $scope.remark2='';
                  for (var i = 0; i < $scope.invoices.length; i++) {

                    if(!$scope.invoices[i].amount || $scope.invoices[i].amount < 0) $scope.invoices[i].amount =0;

                    if($scope.invoices[i].amount > $scope.invoices[i].invoice_data.balance){
                        $scope.invoices[i].amount = $scope.invoices[i].invoice_data.balance;
                      }
                          $scope.advance -= $scope.invoices[i].amount;
                  }

                  if($scope.advance <  0){
                    $scope.stopForm = true;
                    $scope.alertMessage =  'Amount distributed amogn Invoices is exceeding  Amount Received, Please check !';
                  }

                }

                $scope.submitForm = function() {
                  if($scope.amount == 0){
                    return;
                  }

                    $scope.accountData.entry_remarks2  =    $scope.accountData.entry_remarks;
                  if($scope.entryType == 1) {
                    for (var i = 0; i < $scope.invoices.length; i++) {

                      if($scope.invoices[i].amount > 0)
                          $scope.remark2 =   $scope.remark2 + ' '+ $scope.invoices[i].invoice_data.number + ',';
                    }
                      $scope.accountData.invoice_list   =  $scope.invoices.filter(function(o){ return o.amount > 0});
                      if($scope.accountData.invoice_list.length > 0){
                        $scope.remark2 =  'For Invoices :' + $scope.remark2.substring(0, $scope.remark2.length - 1) + '. ';
                      }
                      if($scope.advance >  0){
                        $scope.remark2 = $scope.remark2  + 'Advance of &#8377;' + $scope.advance;
                      }
                      if ($scope.accountData.entry_remarks) {
                        $scope.accountData.entry_remarks  =  $scope.remark2 + '. User: ' + $scope.accountData.entry_remarks;
                      }else{
                      $scope.accountData.entry_remarks  =  $scope.remark2 + '.';
                      }
                  }

                  // console.log($scope.accountData);
                  // return;
                    if($scope.txnSelected == 'Cash')    $scope.accountData.entry_transaction_number = 'Cash';
                    if($scope.txnSelected == 'Cheque')  $scope.accountData.entry_transaction_number = 'Cheque No. '+ $scope.accountData.entry_transaction_number ;
                    if($scope.txnSelected == 'NEFT')    $scope.accountData.entry_transaction_number = 'NEFT Txn No. '+ $scope.accountData.entry_transaction_number ;
                    if($scope.txnSelected == 'RTGS')    $scope.accountData.entry_transaction_number = 'RTGS Txn No. '+ $scope.accountData.entry_transaction_number ;
                    if($scope.txnSelected == 'UPI')     $scope.accountData.entry_transaction_number =  'UPI Txn No.' + $scope.accountData.entry_transaction_number ;
                    if($scope.txnSelected == 'Others')  $scope.accountData.entry_transaction_number =  'Other ' + $scope.accountData.entry_transaction_number ;
                    toaster.pop({
                        type: 'warning',
                        title: 'Processing Request',
                        body: 'Please wait',
                        showCloseButton: true
                    });
                    $scope.accountData.entry_date = $scope.myDate2;
                    $http({
                            method: 'POST',
                            url: 'accounts/add',
                            data: {
                                'accountData': $scope.accountData
                            }
                        })
                        .success(function(data) {
                            toaster.clear();
                            if (data.success == true) {

                                toaster.pop({
                                    type: 'success',
                                    title: 'Accounts Entry Done',
                                    body: '',
                                    showCloseButton: true
                                        // closeHtml: '<button>Close</button>'
                                });
                                window.location.href= "#/accountview/" + $scope.clientData._id +"/1";
                            } else {
                                $scope.accountData.entry_remarks  =    $scope.accountData.entry_remarks2;
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
                              $scope.accountData.entry_remarks  =    $scope.accountData.entry_remarks2;
                            toaster.pop({
                                type: 'error',
                                title: 'Error Has Occurred',
                                body: response.message,
                                showCloseButton: true
                            });
                        });
                }

});
