app.controller("invoice_list",   function($scope, $routeParams, $http, $window, userDataService, toaster) {
    $scope.items = [];
    // userDataService.hideCurtains();
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
    $scope.fy  = userDataService.fy;
    $scope.items = [];
    $scope.searchString = searchString;
    $scope.typeList = ['All', 'Pending', 'Paid', 'Cancel'];
    $scope.type = $routeParams.type;
    $scope.changeType =  function(){
      if (!$scope.searchString) {
          $window.location.href = "#/invoice/1/" + $scope.type;
          return;
      }
      $window.location.href = "#/invoice/1/" +$scope.type + "/"+ $scope.searchString;
    }
    $scope.search = function() {
        if (!$scope.searchString) {
            $window.location.href = "#/invoice/1/" + $scope.type;
            return;
        }
        $window.location.href = "#/invoice/1/" +$scope.type + "/"+ $scope.searchString;
        // pageCalling()
    }

    function pageCalling() {
        $http.get("invoices/" + pageNo + "/" + perPage + "/"+$scope.type+"/" + $scope.searchString)
            .success(function(response) {
              userDataService.hideCurtains();
                if (response.data.length == 0) {
                    $scope.items = [];
                } else {
                    $scope.items = response.data;
                    var total = response.count;
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

app.controller("invoice_step_1", function($scope, $routeParams, $http, $window, userDataService, toaster) {
    userDataService.hideCurtains();
    if (userDataService.getInvoiceData() && userDataService.getInvoiceData().client_data) {
        $scope.clientData = userDataService.getInvoiceData().client_data;
        // console.log($scope.clientData);
    }
    $scope.clients = [];
    $scope.updateList = function(typed) {
        if (!typed) {
            $scope.clients = [];
            return;
        }
        $http.get("clients/search/" + typed)
            .then(function(response) {
                $scope.clients = response.data.result;
            });
    };

    $scope.selectClient = function(selected) {
        // console.log(selected);
        $scope.clientData = selected;
        $scope.clientSelected = '';
    }
    $scope.clearForm = function() {
        $scope.clientData = null;
        userDataService.setInvoiceClient(null);
    }
    $scope.moveToSetp2 = function() {
        if (!$scope.clientData._id) {
            toaster.pop({
                type: 'warning',
                title: 'Please Select Client Using Search',
                body: '',
                showCloseButton: true
            });
            return;
        }
        var clientData = {
                '_id': $scope.clientData._id,
                'client_id': $scope.clientData._id,
                'client_company_name': $scope.clientData.client_company_name,
                'client_name': $scope.clientData.client_name,
                'client_tin': $scope.clientData.client_tin,
                'client_stn': $scope.clientData.client_stn,
                'client_address': $scope.clientData.client_address,
                'client_phone': $scope.clientData.client_phone,
                'client_email': $scope.clientData.client_email
            }
        userDataService.setInvoiceClient(clientData);
        $window.location.href = "#/invoiceadd2";
    }
});

app.controller("invoice_step_2", function($scope, $routeParams, $http, $window, userDataService, toaster) {

    $scope.minDate  = new Date();
    $scope.dateMsg = '(You can select date back untill your last invoice)';
    $scope.dateMsg = '(Checking for last invoice Date)';
    $scope.user_data = {
        user_company_name: userDataService.getUserData().data.user_company_name,
        user_tin: userDataService.getUserData().data.user_tin,
        user_stn: userDataService.getUserData().data.user_stn,
        user_address: userDataService.getUserData().data.user_address,
        user_phone: userDataService.getUserData().data.user_phone,
        user_logo: userDataService.getUserData().data.user_settings.user_logo,
        user_tc:  userDataService.textAreatoHTML(userDataService.getUserData().data.user_settings.user_tc, '\n')
    }
    $scope.invoice_data = {
        number: 0,
        subtotal: 0,
        discount: 0,
        taxTotal: 0,
        grand_total: 0,
        date:new Date(),
        tax_summary: [] //{ tax_name: String, tax_amount: Number }

    }
    if (userDataService.getInvoiceData().user_data &&userDataService.getInvoiceData().user_data.user_tc) {
        $scope.user_data.user_tc = userDataService.textAreatoHTML(userDataService.getInvoiceData().user_data.user_tc, '\n');
    }

    $scope.maxDate = new Date();
    $http.get("invoices/last")
        .then(function(response) {
            userDataService.hideCurtains();
          if(response.data.data[0]){
              $scope.minDate = new Date(response.data.data[0].invoice_data.date);
              $scope.minDate.setHours(0,0,0,1);
              $scope.dateMsg = '(You can select date from '+userDataService.dateFormat(  $scope.minDate)+' till today)';
          }else{

            if($scope.minDate.getMonth() > 2){
              $scope.minDate.setYear(  $scope.minDate.getFullYear() );
              $scope.minDate.setDate(1);
              $scope.minDate.setMonth(3);
            }else{
              $scope.minDate.setYear(  $scope.minDate.getFullYear() -1);
              $scope.minDate.setDate(1);
              $scope.minDate.setMonth(3);
            }
            if($scope.invoice_data.date.getTime() < $scope.minDate.getTime())
                $scope.invoice_data.date  = $scope.minDate;
            if($scope.invoice_data.date.getTime() > $scope.maxDate.getTime())
                $scope.invoice_data.date  = $scope.maxDate;
          }
        });
    $scope.isOpen = false;
    $scope.openCalendar = function(e, picker) {
           if($scope.isOpen) {$scope.isOpen = false;   return}
           if($scope.isOpen2) {$scope.isOpen2 = false;  }
             e.preventDefault();
             e.stopPropagation();
             $scope.isOpen = true;
    };
    $scope.product_data = [];
    if (userDataService.getInvoiceData().product_data.length > 0) {
        $scope.product_data = userDataService.getInvoiceData().product_data;
    }
    if (userDataService.getInvoiceData().client_data) {
        $scope.clientData = userDataService.getInvoiceData().client_data;
    }
    if (userDataService.getInvoiceData().invoice_data) {
        $scope.invoice_data = userDataService.getInvoiceData().invoice_data;
        console.log($scope.invoice_data.date);

        $scope.invoice_data.date = new Date($scope.invoice_data.date);
        console.log($scope.invoice_data.date);

    }

    $scope.saveInvoiceData =  function(){
      console.log($scope.invoice_data.date);
        userDataService.setInvoiceData($scope.invoice_data);
    }
    $scope.products = [];
    $scope.taxes = userDataService.getTaxes();
    $scope.updateList = function(typed) {
        if (!typed) {
            $scope.products = [];
            return;
        }
        $http.get("products/search/" + typed)
            .then(function(response) {
                $scope.products = response.data.data;
            });
    }
    $scope.addProduct = function(selected) {
        for (var i = 0; i < $scope.product_data.length; i++) {
            if (selected._id == $scope.product_data[i]._id) {
                $scope.product_data[i].qty++;
                $scope.calculateRow(i);
                $scope.productSelected = '';
                return;
            }
        }
        var product = {
            _id: selected._id,
            product_name: selected.product_name,
            product_name2: selected.product_name,
            product_desc: selected.product_description,
            qty: 1,
            product_unit: selected.product_unit,
            product_price: selected.product_price,
            discount: 0,
            tax_name: selected.product_tax.type + " @ " + selected.product_tax.rate,
            tax_rate: selected.product_tax.rate,
            product_tax: selected.product_tax,
            sub_total: selected.product_price,
            tax_amount: userDataService.percentOff(selected.product_price, selected.product_tax.rate),
            row_total: userDataService.roundOff(selected.product_price + userDataService.percentOff(selected.product_price, selected.product_tax.rate)),
        }
        $scope.product_data.push(product);
        $scope.productSelected = '';
        $scope.calculateInvoice();
    }// add product

    $scope.calculateRow = function(index) {

        var product = $scope.product_data[index];
        product.discount = userDataService.roundOff(product.discount);
        product.product_price = userDataService.roundOff(product.product_price);
        if (product.discount < 0 || isNaN(product.discount)) {
            product.discount = 0;
        }
        if (product.product_price < 0 || isNaN(product.product_price)) {
            product.product_price = 0;
        }

        if (product.qty < 0 || isNaN(product.qty)) {
            product.qty = 0;
        }
          // tax_name: selected.product_tax.type + " @ " + selected.product_tax.rate,
        product.tax_name = product.product_tax.type+ " @ " +product.product_tax.rate;
        product.tax_rate = product.product_tax.rate;
        var total = (product.qty * product.product_price);
        if (total < product.discount) {
            $scope.product_data[index].discount = 0;
            product.discount = 0;
        }
        // console.log(total);
        product.sub_total = userDataService.roundOff(total - product.discount);
        // console.log(product.sub_total);
        product.tax_amount = userDataService.percentOff(product.sub_total, product.tax_rate);
        product.row_total = userDataService.roundOff(product.sub_total + product.tax_amount);
        $scope.product_data[index] = product;
        $scope.calculateInvoice();
    } // end of calculateRow

    $scope.removeProduct = function(index) {
        $scope.product_data.splice(index, 1);
        $scope.calculateInvoice();
    }

    $scope.calculateInvoice = function() {
        $scope.invoice_data.subtotal = 0;
        $scope.invoice_data.taxTotal = 0;
        $scope.invoice_data.grand_total = 0;
        $scope.invoice_data.tax_summary = [];
        for (var i = 0; i < $scope.product_data.length; i++) {

            $scope.invoice_data.subtotal = userDataService.roundOff($scope.invoice_data.subtotal + $scope.product_data[i].sub_total);
            $scope.invoice_data.taxTotal = userDataService.roundOff($scope.invoice_data.taxTotal + $scope.product_data[i].tax_amount);
            $scope.invoice_data.grand_total = userDataService.roundOff($scope.invoice_data.grand_total + $scope.product_data[i].row_total);

            if($scope.invoice_data.tax_summary.length  < 1){

                    $scope.invoice_data.tax_summary.push({ tax_name: $scope.product_data[i].tax_name, tax_amount: $scope.product_data[i].tax_amount });
                    // console.log($scope.invoice_data.tax_summary[0]);
            }else{
                var notFound =  true;
                for(var j=0; j< $scope.invoice_data.tax_summary.length; j++){

                    if($scope.invoice_data.tax_summary[j].tax_name == $scope.product_data[i].tax_name){
                       $scope.invoice_data.tax_summary[j].tax_amount =  userDataService.roundOff($scope.invoice_data.tax_summary[j].tax_amount + $scope.product_data[i].tax_amount);
                      //  console.log($scope.invoice_data.tax_summary[j]);
                       notFound = false;
                    }

                }
                if(notFound){
                  $scope.invoice_data.tax_summary.push({ tax_name: $scope.product_data[i].tax_name, tax_amount: $scope.product_data[i].tax_amount });
                }
            }
        }
        $scope.invoice_data.grand_total =  $scope.invoice_data.grand_total  - $scope.invoice_data.discount;
        $scope.invoice_data.grand_total = Math.round($scope.invoice_data.grand_total);
        userDataService.setInvoiceProducts($scope.product_data);
        console.log($scope.invoice_data);
        userDataService.setInvoiceData($scope.invoice_data);
    }// end of calculate function


      $scope.moveToSetp3  = function () {
      userDataService.setInvoiceUser($scope.user_data);
      userDataService.setInvoiceProducts($scope.product_data);
      userDataService.setInvoiceData($scope.invoice_data);
      $window.location.href = "#/invoiceadd3";
    }

});

app.controller("invoice_step_3", function($scope, $routeParams, $http, $window, userDataService, toaster) {
    userDataService.hideCurtains();
    $scope.stopForm = true;
    $scope.clientData = userDataService.getInvoiceData().client_data;
    $scope.userData= userDataService.getInvoiceData().user_data;
    $scope.user_tc  = userDataService.textAreatoHTML($scope.userData.user_tc, '<br>');
    $scope.product_data  = userDataService.getInvoiceData().product_data;
    $scope.invoice_data  = userDataService.getInvoiceData().invoice_data;
    $scope.invoice_data['advancePayment'] = false;
    $scope.excessmessage =  false;
    $scope.date  = userDataService.dateFormat($scope.invoice_data.date);
    $http.get("clients/fetch/"+$scope.clientData.client_id)
        .then(function(response) {
          $scope.stopForm = false;
          // $scope.clientData['balance']  = 1;
          // console.log(response.data.message.client_balance);
          // if(response.data.message.client_balance  < 0)
              $scope.clientData['balance'] = response.data.message.client_balance * -1 ;

        });;
    $scope.createInvoice = function() {
      userDataService.showCurtains();
        toaster.pop({
            type: 'warning',
            title: 'Processing Request',
            body: 'Pleas wait',
            showCloseButton: false
        });
        $http({
                method: 'POST',
                url: '/invoices/add',
                data: {
                    'invoiceData': userDataService.getInvoiceData()
                }
            })
            .success(function(data) {
                toaster.clear();
                // console.log(data);
                if (data.success == true) {
                    userDataService.resetInvoiceData();
                    toaster.pop({
                        type: 'success',
                        title: 'Invoice Added',
                        body: '<a href="#/invoiceview/' + data.data._id + '">Click Here to See</a>',
                        showCloseButton: true
                            // closeHtml: '<button>Close</button>'
                    });
                    window.location.href="#/invoice/1";
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

app.controller("invoice_view",   function($scope, $routeParams, $http, $window, $route, userDataService, toaster) {
  $scope.callBack = function(){ $window.history.back()}
  $scope.print = function(){$window.print()}
  $scope.dateFormat =  userDataService.dateFormat;
  $scope.cencelInvoice  = function(){
    $http.get("/invoices/cancel/" + $routeParams.id)
        .success(function(response) {
          $route.reload();
          toaster.pop({
              type: 'success',
              title: 'Invoice Cancelled',
              body: '',
              showCloseButton: true
          });
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

  $http.get("/invoices/fetch/" + $routeParams.id)
      .success(function(response) {
          $scope.clientData = response.data.client_data;
          $scope.userData= response.data.user_data;
          $scope.user_tc  = userDataService.textAreatoHTML($scope.userData.user_tc, '<br>');
          $scope.product_data  = response.data.product_data;
          $scope.invoice_data  = response.data.invoice_data;
            $scope.date  = userDataService.dateFormat(new Date($scope.invoice_data.date));
            console.log($scope.date);
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

  // userDataService.hideCurtains();


});

app.controller("invoice_report", function($scope, $routeParams, $http, $window, $route, userDataService, toaster) {
      userDataService.hideCurtains();
      $scope.isOpen = false;
      $scope.isOpen2 = false;
      $scope.endDate = new Date();
      $scope.startDate = new Date($scope.endDate.getTime() - 30*24*60*60*1000);
      $scope.myDate = new Date();
      $scope.myDate2  = new Date();
      $scope.dataFormat = userDataService.dateFormat;
      $scope.fy  = userDataService.fy;
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
      }

      $scope.searchReport =  function(){
      $scope.taxesHeading =  [];
      $scope.exporTable =  [];
      userDataService.showCurtains();
      $http.get("invoices2/report/" + $scope.startDate + "/"+ $scope.endDate)
            .success(function(response) {
                    $scope.items = response.data;
                    for (var j = 0; j < $scope.items.length; j++) {
                      $scope.items[j]['taxTotal'] = 0;
                      var taxesHeading2 = [];
                      for (var i = 0; i <$scope.items[j].invoice_data.tax_summary.length; i++) {
                       if($scope.taxesHeading.filter(function(o){ return o ==  $scope.items[j].invoice_data.tax_summary[i].tax_name}).length == 0)
                        {      $scope.taxesHeading.push($scope.items[j].invoice_data.tax_summary[i].tax_name); }
                        {      taxesHeading2.push($scope.items[j].invoice_data.tax_summary[i].tax_name); }
                        $scope.items[j]['taxTotal'] +=  $scope.items[j].invoice_data.tax_summary[i].tax_amount;
                      }
                      item = $scope.items[j]
                    }
                    $scope.taxesHeading = $scope.taxesHeading.filter(function(o){return o != "No Tax @ 0"});

                  for (var j = 0; j < $scope.items.length; j++) {
                    item = $scope.items[j]
                    var newObj ={
                        'No': item.invoice_data.number,
                        'FY': $scope.fy(item.invoice_data.date),
                        'Date': $scope.dataFormat(item.invoice_data.date),
                        'Company': item.client_data.client_company_name
                      }

                      for (var i = 0; i <   $scope.taxesHeading.length; i++) {
                        newObj[$scope.taxesHeading[i]] =  $scope.findTax2($scope.taxesHeading[i],item)
                      }

                       newObj['Tax'] =item.taxTotal.toFixed(2);
                       newObj['Amount'] =item.invoice_data.grand_total.toFixed(2);
                         $scope.exporTable.push(newObj);
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

      $scope.findTax  = function(tax, invoice){
        var tax =  invoice.invoice_data.tax_summary.filter(function(o){return o.tax_name == tax})[0];
        if(tax) return '&#8377;' + tax.tax_amount.toFixed(2);
        else return '-';
      }

      $scope.findTax2  = function(tax, invoice){
        var tax =  invoice.invoice_data.tax_summary.filter(function(o){return o.tax_name == tax})[0];

        if(tax) { return '' + tax.tax_amount.toFixed(2); }
        else { return '' + 0; };
      }

      $scope.getexcel = function(){
          if(!$scope.exporTable){ return}
        if($scope.exporTable.length == 0){
          return;
        }
        var cols = [
                      {caption:'No.',type:'number',width:40},
                      {caption:'FY',type:'string',width:40},
                      {caption:'Date',type:'string',width:70},
                      {caption:'Company',type:'string',width:150}

                    ];
                    for (var i = 0; i <   $scope.taxesHeading.length; i++) {
                      cols.push({caption:$scope.taxesHeading[i],type:'number',width:70});
                    }
                    cols.push({caption:'Tax Total',type:'number',width:70});
                    cols.push({caption:'Amount',type:'number',width:70});
        var tableData  = [];
        for (var i = 0; i < $scope.exporTable.length; i++) {
            var o = [];
            o.push($scope.exporTable[i].No);
            o.push($scope.exporTable[i].FY);
            o.push($scope.exporTable[i].Date);
            o.push($scope.exporTable[i].Company);
            for (var j = 0; j <   $scope.taxesHeading.length; j++) {
              o.push($scope.exporTable[i][$scope.taxesHeading[j]]);
            }
            o.push($scope.exporTable[i].Tax);
            o.push($scope.exporTable[i].Amount);
            tableData.push(o);
        }

        toaster.pop({
            type: 'warning',
            title: 'Processing Request',
            body: 'Pleas wait',
            showCloseButton: false
        });
        $http({
              url: '/excel',
              method: "POST",
              data: { table: $scope.exporTable, name : 'Paper Weight Excel Report'}, //this is your json data string
              headers: {
                 'Content-type': 'application/json'
              },
              responseType: 'arraybuffer'
          }).success(function (data, status, headers, config) {
              var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
              var objectUrl = URL.createObjectURL(blob);
              window.open(objectUrl,'Paper Weight Excel Report.xlsx' );

          }).error(function (data, status, headers, config) {
              //upload failed

          });

      }
});
