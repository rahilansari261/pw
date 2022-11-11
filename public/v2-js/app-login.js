var app = angular.module('sp', ['ngRoute'])
localStorage.setItem('userData', '')
app.controller('loginCtrl', function ($scope, $http, $window) {
  $scope.userData = { user_email: '', user_password: '' }
  $scope.login = { userData: $scope.userData }
  localStorage.setItem('userData', null)
  $scope.processing = false
  // $scope.message = 'Logging In';
  $scope.processForm = function () {
    $scope.processing = true
    $scope.message = 'Logging In...'
    $scope.fail = false
    $http({
      method: 'POST',
      url: 'api/v1/users/login',
      data: $scope.userData,
    }).success(function (data) {
      if (data.success == true) {
        localStorage.setItem('userData', JSON.stringify(data))
        $window.location.href = './home.html#/'
      } else {
        $scope.processing = false
        $scope.fail = true
        // console.log(data);
        $scope.message = data.message
        if (data.code == 132) {
          $scope.showRenew = true
          sessionStorage.setItem('token', data.token)
        }
      }
    })
  }
})
