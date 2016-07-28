angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $scope, $state) {
  var userId = localStorage.getItem('userId');
  if(userId == null || userId == 0){
    $state.go('login');
  }

  $scope.logout = function(){
    localStorage.setItem('userId', 0);
    $state.go('login');
  }
})

.controller('LoginCtrl', function($scope, $cordovaToast, $state, $ionicHistory, $http) {
  $scope.input = {};
  $scope.login = function(){
    data = {'mobile_number' : '63' + $scope.input.mobileNumber};
    validateUser = $http.post('http://headsup-app.cloudapp.net/api/v1/users/validate', data);
    validateUser.success(function(result){
      if (result.user_id == 0){
        $cordovaToast.showShortBottom('Mobile Number is not yet registered.');
      }else{
        localStorage.setItem('userId', result.user_id);
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.categories');
      }
    });

    validateUser.error(function (err){
      alert(JSON.stringify(err));
      $cordovaToast.showShortBottom('Connection Error');
    });
  }
})

.controller('AlertsCtrl', function($scope, $http) {
  $scope.alerts = [];
  $scope.weatherAlerts = [];
  $scope.trafficAlerts = [];
  $scope.mrtAlerts = [];
  var userId = localStorage.getItem('userId');
  getAllAlerts();

  $scope.doRefresh = function() {
    getAllAlerts();
  };

  function getAllAlerts(){
    getAlerts = $http.get('http://headsup-app.cloudapp.net/api/v1/alerts/'+userId);
    getAlerts.success(function(result){
      alerts = result.data;
      trafficAlerts = [];
      weatherAlerts = [];
      mrtAlerts = [];
      for (i in alerts){
        set_date = new Date(alerts[i].set_date);
        alerts[i].set_date = set_date.toLocaleTimeString();
        
        if(alerts[i].category_id == '1'){      
          weatherAlerts.push(alerts[i]);
        }

        if(alerts[i].category_id == '2'){
          trafficAlerts.push(alerts[i]);
        }

        if(alerts[i].category_id == '3'){
          mrtAlerts.push(alerts[i]);
        }

        $scope.weatherAlerts = weatherAlerts;
        $scope.trafficAlerts = trafficAlerts;
        $scope.mrtAlerts = mrtAlerts;

      }
    });

    getAlerts.error(function(err){
      $cordovaToast.showShortBottom('Connection Error');
    });

    getAlerts.finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  

})

.controller('AlertCtrl', function($scope, $stateParams) {
})

.controller('CreateAlertCtrl', function($scope, $stateParams, $cordovaDatePicker, $cordovaToast, $http, $state, $ionicHistory) {
  $scope.alert = {};
  $scope.alert.name = 'Sample Alert';
  $scope.alert.lineName = 'Edsa';
  $scope.alert.pointName = 'Balintawak';
  $scope.alert.repeat = "1";
  $scope.alert.location = "";
  $scope.categoryId = $stateParams.categoryId;
  var userId = localStorage.getItem('userId');
  var location = 'Default';
  
  $scope.createAlert = function(form){
    if(!form.$valid) {
      $cordovaToast.showShortBottom('All Fields are required');
      return false;
    }
    if($stateParams.categoryId == 1){
      location = $scope.alert.location;
    }

    if($stateParams.categoryId == 2){
      location = $scope.alert.lineName +'-'+ $scope.alert.pointName;
    }

    data = {
        'user_id' : userId,
        'category_id' : $stateParams.categoryId,
        'name' : $scope.alert.name,
        'location' : location,
        'set_date' : combineDateAndTime($scope.alert.date, $scope.alert.time),
        'repetition_id' : $scope.alert.repeat
    }

    createAlert = $http.post('http://headsup-app.cloudapp.net/api/v1/alerts', data);
    createAlert.success(function (result){
      if (result.success) {
        $cordovaToast.showShortBottom('Successfully saved');
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go('app.alerts');
      }else{
        alert(JSON.stringify(result));
        $cordovaToast.showShortBottom('Connection Error');
      }
    });

    createAlert.error(function (err){
      alert(JSON.stringify(err));
      $cordovaToast.showShortBottom('Connection Error');
    });
    
  }

  $scope.updateLineName = function(lineName){
    $scope.alert.lineName = lineName;
  }

  combineDateAndTime = function(date, time) {
       timeString = time.getHours() + ':' + time.getMinutes();

       var year = date.getFullYear();
       var month = date.getMonth() + 1; // Jan is 0, dec is 11
       var day = date.getDate();
       var dateString = '' + year + '-' + month + '-' + day;
       var combined = new Date(dateString + ' ' + timeString);

       return combined;
    }
})

.controller('CategoriesCtrl', function($scope) {
  $scope.categories = [
    { title: 'Weather', source: 'DOST', id: 1, image : 'http://image.flaticon.com/icons/svg/178/178342.svg'},
    { title: 'Road Traffic', source: 'MMDA', id: 2, image : 'http://image.flaticon.com/icons/svg/139/139755.svg'},
    { title: 'Mrt Service Status', source: 'DOTC', id: 3, image: 'http://image.flaticon.com/icons/svg/171/171249.svg' },
  ];
});

