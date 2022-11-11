app.factory('accesTokenInjector', ['userDataService', '$window', function(userDataService, $window) {
    var accesTokenInjector = {
        request: function(config) {
          config.headers['x-access-token'] = userDataService.getTokken();
            return config;
        },response: function(res) {

            if (res.status == 403) {
                $window.location.pathname = "/app-login.html"
            }
            // console.log(res.headers('token'));

            if(res.headers('token')){
                // toaster.clear();
                userDataService.setTokken(res.headers('token'));
                // localStorage.setItem("token", res.headers('token'));
            }

            return res;
        },
        responseError: function(res) {
          // console.log( "response");
          console.log(res);
            if (res.status != "200") {
                $window.location.href = "./app-login.html";
            }
            return res;
            // console.log(res);
        }
    };
    return accesTokenInjector;
}]);

app.filter('inrFilter', function() {
  return function(input, optional1, optional2) {
    var output;
    if(isNaN(input)) {
     return input;
   }

   if(input == 0) {
     return '-';
   }
      return  input.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })

  }
});

app.service('userDataService', ['$window', function($window) {

    if (localStorage.getItem("userData") == undefined) {
        $window.location.href = "./app-login.html"
    }
    this.userData = angular.fromJson(localStorage.getItem("userData"));
    if(!this.userData){
      $window.location.href = "./app-login.html"
    }
    this.invoiceData =   angular.fromJson(localStorage.getItem("invoiceData"));
    if (this.invoiceData ) {
      if( this.userData.data._id !=   this.invoiceData._id){
          // console.log('invoice');
          this.invoiceData =  {"_id" : null, "client_data" : null, "user_data" : null, "product_data" : [], "invoice_data": null};
      }
    }else {
      this.invoiceData =  {"_id" : null, "client_data" : null, "user_data" : null, "product_data" : [], "invoice_data": null};
    }

    if(localStorage.getItem("invoiceData") ){
        this.invoiceData  = angular.fromJson(localStorage.getItem("invoiceData"));
    }
    this.token =  this.userData.token;
    this.getUserData = function() {
        return this.userData;
    }
    this.getUserName = function() {
        return this.userData.data.user_name;
    }

    this.getTokken = function() {
        return this.token ;
    }

    this.setTokken = function(tokn) {
         this.token =tokn ;
         this.userData.token =tokn;
         localStorage.setItem("userData", JSON.stringify(this.userData));
    }

    this.getTaxes = function() {
        return this.userData.data.user_settings.user_tax;
    }

    this.showCurtains = function() {
        document.getElementById("curtains").style.display = "block";
        return null;
    }

    this.getExcel=function(table, name2){

            // $http.post('/excel', {table: table, name : name}).then(function(){}, function(){});



          }
    this.hideCurtains = function() {
        document.getElementById("curtains").style.display = "none";
        return null;
    }

    this.setUserData  = function(userData){
        this.userData.data =  userData;
        localStorage.setItem("userData", JSON.stringify(this.userData));
        return  null;
    }

    this.setUserTC = function(userData){
        this.userData.data.user_settings.user_tc =  userData.user_settings.user_tc;
        localStorage.setItem("userData", JSON.stringify(this.userData));
        return  null;
    }
    this.addUserTax = function(userData){
        this.userData.data.user_settings.user_tax.push(userData);
        localStorage.setItem("userData", JSON.stringify(this.userData));
        return  null;
    }
    this.deleteUserTax = function(id){
        var i=0;
        for(i=0; i< this.userData.data.user_settings.user_tax.length; i++){
            if(this.userData.data.user_settings.user_tax[i]._id ==  id){
              this.userData.data.user_settings.user_tax.splice(i, 1);
            }
        }
        localStorage.setItem("userData", JSON.stringify(this.userData));
        return  null;
    }

    this.getInvoiceData =  function(){
      return this.invoiceData;
    }

    this.setInvoiceClient =  function(clientData){
          this.invoiceData.client_data =  clientData;
          this.invoiceData._id =  this.userData.data._id;
          localStorage.setItem("invoiceData", JSON.stringify(this.invoiceData));
          return null;
    }

    this.setInvoiceUser =  function(userData){
          this.invoiceData.user_data =  userData;
          this.invoiceData._id =  this.userData.data._id;
          localStorage.setItem("invoiceData", JSON.stringify(this.invoiceData));
          return null;
    }

    this.setInvoiceProducts =  function(productData){
          this.invoiceData.product_data =  productData;
          this.invoiceData._id =  this.userData.data._id;
          localStorage.setItem("invoiceData", JSON.stringify(this.invoiceData));
          return null;
    }

    this.setInvoiceData =  function(productData){
          this.invoiceData.invoice_data =  productData;
          this.invoiceData._id =  this.userData.data._id;
          // console.log(JSON.stringify(this.invoiceData));
          localStorage.setItem("invoiceData", JSON.stringify(this.invoiceData));
          return null;
    }

    this.resetInvoiceData = function () {
      this.invoiceData =  {"client_data" : null, "user_data" : null, "product_data" : [], "invoice_data": null};
      localStorage.setItem("invoiceData", JSON.stringify(this.invoiceData));
      return null;
    }


    this.textAreatoHTML  =  function(input, replaceString) {
        // var newline = String.fromCharCode(13, 10);
      var arr =  input.split('\n');

      var str = '';
      for(var i=0; i < arr.length ; i++){
        if(arr[i]!=''){
            str= str + arr[i] + replaceString;
        }
      }
      // console.log(str);
        return str;
      }

    this.roundOff =  function(number){
      return Math.round( parseFloat(number)  * 100) / 100;
    }

    this.percentOff =  function(number, percent){
      percent =  percent / 100;
      number = percent*number;

      return Math.round(parseFloat(number) * 100) / 100;
    }

    this.dateFormat =  function(date){
      var m_names = new Array("Jan", "Feb", "Mar",
              "Apr", "May", "Jun", "Jul", "Aug", "Sep",
              "Oct", "Nov", "Dec");
        var d = new Date(date || Date.now()),
            month = '' + m_names[d.getMonth()],
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('-');
    }

    this.fy = function(date){
      date = new Date(date)
      var m  =  date.getMonth();
      var y  =  date.getFullYear();
      var y2
      if(m < 3){
        y = y-1;
      }
      return y.toString().substr(-2) + '-' + (y+1).toString().substr(-2);
    }

    this.dateQuery =  function(date){
      var m_names = new Array("01", "02", "03",
              "04", "05", "06", "07", "08", "09",
              "10", "11", "12");
        var d = new Date(date || Date.now()),
            month = '' + m_names[d.getMonth()],
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
}]);

var app = angular.module('sp', ['ngRoute', 'ui.bootstrap', 'ui.bootstrap.datetimepicker','autocomplete', 'ngMessages', 'toaster','mwl.confirm'])
    .config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {


        $routeProvider.when('/dashboard', {
            templateUrl: "dashboard.html"
        });
        $routeProvider.when('/product/:page', {
            templateUrl: "product.html"
        });
        $routeProvider.when('/product/:page/:searchString', {
            templateUrl: "product.html"
        });
        $routeProvider.when('/productadd', {
            templateUrl: "productadd.html"
        });
        $routeProvider.when('/productview/:id', {
            templateUrl: "productview.html"
        });
        $routeProvider.when('/client/:page', {
            templateUrl: "client.html"
        });
        $routeProvider.when('/client/:page/:searchString', {
            templateUrl: "client.html"
        });
        $routeProvider.when('/clientadd', {
            templateUrl: "clientadd.html"
        });
        $routeProvider.when('/clientview/:id', {
            templateUrl: "clientview.html"
        });
        $routeProvider.when('/invoice/:page/:type', {
            templateUrl: "invoice.html"
        });
        $routeProvider.when('/invoice/:page/:type/:searchString', {
            templateUrl: "invoice.html"
        });``
        $routeProvider.when('/invoiceadd', {
            templateUrl: "invoiceadd.html"
        });
        $routeProvider.when('/invoiceadd2', {
            templateUrl: "invoiceadd2.html"
        });
        $routeProvider.when('/invoiceadd3', {
            templateUrl: "invoiceadd3.html"
        });
        $routeProvider.when('/invoiceview/:id', {
            templateUrl: "invoiceview.html"
        });
        $routeProvider.when('/invoicereport', {
            templateUrl: "invoicereport.html"
        });
        $routeProvider.when('/account/:page', {
            templateUrl: "account.html"
        });
        $routeProvider.when('/account/:page/:searchString', {
            templateUrl: "account.html"
        });
        $routeProvider.when('/accountview/:id/:page', {
            templateUrl: "accountview.html"
        });
        $routeProvider.when('/accountaddentry/:id', {
            templateUrl: "accountaddentry.html"
        });
        $routeProvider.when('/profile/', {
            templateUrl: "setting.html"
        });
        $routeProvider.when('/settingsadd', {
            templateUrl: "settingsadd.html"
        });
        $routeProvider.when('/password', {
            templateUrl: "password.html"
        });
        $routeProvider.when('/subscribtions', {
            templateUrl: "subscribtions.html"
        });
        $routeProvider.otherwise({
            redirectTo: '/dashboard'
        });

        $httpProvider.interceptors.push('accesTokenInjector');
    }]);



app.controller('LeftCtrl', function($scope, $window, userDataService, $http) {
  $scope.menuOpen = false;
    $scope.$on('$routeChangeSuccess', function(scope, next, current) {
        if(!next.$$route){
          return;
        }
        if($scope.menuOpen){
         $scope.menuOpen = false;
       }
        if (next.$$route.originalPath.indexOf("dashboard") != -1) {
            $scope.section = "dashboard";
        } else if (next.$$route.originalPath.indexOf("product") != -1) {
            $scope.section = "product";
        } else if (next.$$route.originalPath.indexOf("client") != -1) {
            $scope.section = "client";
        } else if (next.$$route.originalPath.indexOf("invoice") != -1) {
            $scope.section = "invoice";
        } else if (next.$$route.originalPath.indexOf("account") != -1) {
            $scope.section = "account";
        } else if (next.$$route.originalPath.indexOf("profile") != -1) {
            $scope.section = "setting";
        } else if (next.$$route.originalPath.indexOf("settingsadd") != -1) {
            $scope.section = "setting";
        } else if (next.$$route.originalPath.indexOf("subscribtions") != -1) {
            $scope.section = "setting";
        }
        else if (next.$$route.originalPath.indexOf("password") != -1) {
            $scope.section = "setting";
        }

    });

    $scope.$on("$routeChangeStart", function(event, next, current) {
        // console.log('Route Change');
        userDataService.showCurtains();
    });
  $scope.userName = userDataService.getUserName();
    $scope.toggleMenu = function() {
           $scope.menuOpen = !$scope.menuOpen;
       }

$http.get('uib/template/datepicker/day.html');
$http.get('uib/template/datepicker/month.html');
$http.get('uib/template/datepicker/year.html');
      //  uib/template/datepicker/day.html
      //  uib/template/datepicker/month.html
      //  uib/template/datepicker/year.html

    $scope.logout= function () {
      localStorage.setItem("userData", "") ;
      $window.location.href = "./app-login.html";
    }
})


app.controller('topbar', function($scope, $http, $window, $location, userDataService) {
    $scope.userName = userDataService.getUserName();
});



app.controller('dashboard', function($scope, $http, $timeout, userDataService) {
    $scope.Chartloader = true;
    // var  datasets = ;

    // $http.get("/chart/salesMonthly/6").then(function(result) {
    //   userDataService.hideCurtains();
    //     // $timeout(function() {
    //         $scope.Chartloader = false;
    //           // console.log(result);
    //         // createDashboardChart(result.data);
    //     // }, 1000)

    //   var obj =  {
    //             "labels": [],
    //             "datasets": [{
    //                 "label": "Sales Figure",
    //                 "fill": true,
    //                 "lineTension": 0.1,
    //                 "backgroundColor": "rgba(75,192,192,0.4)",
    //                 "borderColor": "rgba(75,192,192,1)",
    //                 "borderCapStyle": "butt",
    //                 "borderDash": [],
    //                 "borderDashOffset": 0.0,
    //                 "borderJoinStyle": "miter",
    //                 "pointBorderColor": "rgba(75,192,192,1)",
    //                 "pointBackgroundColor": "#fff",
    //                 "pointBorderWidth": 1,
    //                 "pointHoverRadius": 5,
    //                 "pointHoverBackgroundColor": "rgba(75,192,192,1)",
    //                 "pointHoverBorderColor": "rgba(220,220,220,1)",
    //                 "pointHoverBorderWidth": 2,
    //                 "pointRadius": 1,
    //                 "pointHitRadius": 10,
    //                 "data": [],
    //                 "spanGaps": true
    //             }]
    //         };
    //         for(var i=0; i< result.data.data.length; i++){
    //               obj.labels.push(result.data.data[i].month);
    //               obj.datasets[0].data.push(result.data.data[i].stats);
    //         }

    //         // console.log(obj);

    //           createDashboardChart(obj);


    // });

    $http.get("api/v1/invoices/1/5/All").success(function(response) {
        $scope.items2 = response.data;
            userDataService.hideCurtains();
        });

    // $http.get("api/v1/accounts/1/5").success(function(response) {
    //         $scope.items3 = response.data;
    //             userDataService.hideCurtains();
    //         });



});
