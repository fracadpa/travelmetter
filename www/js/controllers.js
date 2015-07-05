angular.module('starter.controllers', ['ionic','uiGmapgoogle-maps'])

.controller('SearchCtrl', function($scope, $ionicLoading, uiGmapGoogleMapApi) {

  //$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
  $scope.isTracking = false;

  var options = { timeout: 31000, enableHighAccuracy: true, maximumAge: 90000 };
  var trackingOptions = { maximumAge: 1000, timeout: 2000, enableHighAccuracy: true  };

  var tracking_data = [];
  var trackId = null;

  $scope.myLocation = {
    lng : '-74.039142',
    lat: '4.699967'
  }

  $scope.map = {
    center: {
      latitude: $scope.myLocation.lat,
      longitude: $scope.myLocation.lng
    },
    zoom: 14,
    pan: 1
  };

  $scope.marker = {
                      id: 0,
                      coords: {
                          latitude:  $scope.myLocation.lat,
                          longitude: $scope.myLocation.lng
                      },
                      options: {
                          draggable: false,
                          title: 'The KVK Blog',
                          animation: 2 // 1: BOUNCE, 2: DROP
                      }
                  };  
  
  function onSuccessCenterOnMe(position) {
       
    $scope.myLocation.lng = position.coords.longitude;
    $scope.myLocation.lat = position.coords.latitude;     
    
    // Centrando Mapa
    $scope.map.center.latitude = $scope.myLocation.lat;
    $scope.map.center.longitude = $scope.myLocation.lng;   
    $scope.$apply();        
    $scope.marker = {
                    id: $scope.marker.length + 1,
                    coords: {
                        latitude:  $scope.myLocation.lat,
                        longitude: $scope.myLocation.lng
                    },
                    options: {
                        draggable: false,
                        title: 'The KVK Blog',
                        animation: 2 // 1: BOUNCE, 2: DROP
                    }
                };      

    $ionicLoading.hide();
  }

  function onErrorCenterOnMe(error) {
    alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
  }    

  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Obteniendo poscision actual...',
      showBackdrop: true
    });

    navigator.geolocation.getCurrentPosition(onSuccessCenterOnMe, onErrorCenterOnMe, options);
  };

  // Iniciando 
  function onSuccessStartTracking(position) {  
    tracking_data.push(position);
    $scope.msglog += 'Latitude: '  + position.coords.latitude      + '<br />' +
                        'Longitude: ' + position.coords.longitude     + '<br />' +
                        '<hr />';   
    $scope.$apply();     
  }

  function onErrorStartTracking(error) {
      alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
  }    

  $scope.startTracking = function() {    
    tracking_data = [];
    $scope.isTracking = true;
    $scope.msglog = '';
    trackId = navigator.geolocation.watchPosition(onSuccessStartTracking, onErrorStartTracking, trackingOptions);
  };

  $scope.stopTracking = function() {    
    tracking_data = [];
    $scope.isTracking = false;
    $scope.msglog += 'Terminando TrackId: ' + trackId + '\n';
    if (trackId != null) {
            navigator.geolocation.clearWatch(trackId);
            trackId = null;
        }
  };
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
