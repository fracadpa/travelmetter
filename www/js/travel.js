angular.module('starter.controllers.travel', ['ionic', 'app.generics.helpers','uiGmapgoogle-maps', 'angularMoment', 'underscore'])

.controller('TravelCtrl', function($scope, $ionicLoading, $ionicPopup, uiGmapGoogleMapApi, _, helperServices) {

  //$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
  $scope.isTracking = false;

  var options = { timeout: 31000, enableHighAccuracy: true, maximumAge: 90000 };
  var trackingOptions = { maximumAge: 1000, timeout: 31000, enableHighAccuracy: true  };

  var tracking_data = [];
  var trackId = null;
  var startTrackTime = null;
  var endTrackTime = null;
  var totalDistance = 0;
  var totalTravelTime = 0;

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

  $scope.polys = [];

  $scope.marker = {
                      id: 0,
                      coords: {
                          latitude:  $scope.myLocation.lat,
                          longitude: $scope.myLocation.lng
                      },
                      options: {
                          draggable: false,
                          title: 'BOGOTÁ',
                          animation: 2 // 1: BOUNCE, 2: DROP
                      }
                  };  

  /****** Eventos Y Metodos *****/

  function onGeolocationError(error) {
    alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
  }
  
  function onSuccessCenterOnMe(position) {
       
    $scope.myLocation.lng = position.coords.longitude;
    $scope.myLocation.lat = position.coords.latitude;     
    
    // Centrando Mapa
    $scope.map.center.latitude = $scope.myLocation.lat;
    $scope.map.center.longitude = $scope.myLocation.lng;   
        
    $scope.marker = {
                    id: $scope.marker.length + 1,
                    coords: {
                        latitude:  $scope.myLocation.lat,
                        longitude: $scope.myLocation.lng
                    },
                    options: {
                        draggable: false,
                        title: 'Inicio',
                        animation: 2 // 1: BOUNCE, 2: DROP
                    }
                };      

    $ionicLoading.hide();
  }
  
  $scope.centerOnMe = function() {
    if(!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Obteniendo poscision actual...',
      showBackdrop: true
    });

    navigator.geolocation.getCurrentPosition(onSuccessCenterOnMe, onGeolocationError, options);
  };

  function canAddToTrackData(position) {

    var pos = _.find(tracking_data,function(rw){ return (rw.coords.latitude == position.coords.latitude && rw.coords.longitude == position.coords.longitude) });

    $scope.$apply(function () {
             $scope.msgInfo = JSON.stringify(pos);
        });

    return pos == undefined;
  }

  // Iniciando 
  function onSuccessStartTracking(position) {  

    tracking_data.push(position);
    /*if(canAddToTrackData(position))
    {
      tracking_data.push(position);
    }    

    var currenTime = new Date();    

    if(tracking_data.length > 1)
    {
      totalDistance += helperServices.calculateDistance(tracking_data[tracking_data.length], 
                                         tracking_data[tracking_data.length - 1]);
    }

    totalTravelTime = helperServices.getDiffTime(startTrackTime, currenTime);

    $scope.msglog += 'Distancia Total: '  + totalDistance      + '\n' +
                      'Tiempo Total: '    + totalTravelTime     ;
    $scope.$apply();*/

     $scope.msglog += '.';
     $scope.$apply();
  }

  $scope.startTracking = function() {    
    tracking_data = [];
    totalDistance = 0;
    totalTravelTime = 0;
    $scope.isTracking = true;
    $scope.msglog = '';
    $scope.msgInfo = '';
    startTrackTime = new Date();

    trackId = navigator.geolocation.watchPosition(onSuccessStartTracking, onGeolocationError, trackingOptions);
  };

  $scope.stopTracking = function() {    
    
    if (trackId != null) {
      navigator.geolocation.clearWatch(trackId);
      
      endTrackTime = new Date();

      var s = helperServices.getDiffTime(startTrackTime, endTrackTime);

      // Calcular Valor por tiempo
      var segMinTravel = helperServices.getIntStorageValue("SegMinTravel");
      var mtrMinTravel = helperServices.getIntStorageValue("MtrMinTravel");
      var unitTime = helperServices.getIntStorageValue("UnitTime");
      var unitMtr = helperServices.getIntStorageValue("UnitMtr");
      var segCharge = helperServices.getIntStorageValue("SegCharge");
      var mtrCharge = helperServices.getIntStorageValue("MtrCharge");
      var segMinValueCharge = helperServices.getIntStorageValue("SegMinValueCharge");
      var mtrMinValueCharge = helperServices.getIntStorageValue("MtrMinValueCharge");

      var tt = helperServices.getDateUtil(s, 'hhmmss');

      var totalDistance = helperServices.calculateDistanceFromArray(tracking_data);

      var polyPaths = [];

      var iPath = 0;
      for(iPath = 0; iPath < tracking_data.length; iPath++)
      {
        var posItem = tracking_data[iPath];
        polyPaths.push({latitude:posItem.coords.latitude,longitude:posItem.coords.longitude})
      }

     /* angular.forEach(tracking_data, function(item){
        polyPaths.push({latitude:item.coords.latitude,longitude:item.coords.longitude})
      });    

      if(polyPaths.length = 1)
        polyPaths.push({latitude: 4.758804, longitude: -74.030138});
      */
      var polylines = [
              {
                  id: trackId,
                  path: polyPaths,
                  stroke: {
                      color: '#6060FB',
                      weight: 4
                  },
                  editable: false,
                  draggable: false,
                  geodesic: false,
                  visible: true
              }];

    // Centrando Mapa
    navigator.geolocation.getCurrentPosition(onSuccessCenterOnMe, onGeolocationError, options);

    $scope.polys = polylines;

      if(segMinTravel > tt.totalSeconds)
        tt.totalSeconds = 0;

      if(mtrMinTravel > totalDistance.mtr)
        totalDistance.mtr = 0;

      var ut = tt.totalSeconds / unitTime;
      var umtr = totalDistance.mtr / unitMtr;

      var travel = {
        travelId : trackId,
        totalTime :  s,
        totalTimePrice : (ut * segCharge) + segMinValueCharge,
        totalDistance : totalDistance.mtr,
        totalDistancePrice: (umtr * mtrCharge) + mtrMinValueCharge
      };

      var alertPopup = $ionicPopup.alert({
         title: 'TravelMetter',
         template: 'Viaje Terminado, Tiempo Total: ' + s + ' - <br/>' + JSON.stringify(travel)
      });
      alertPopup.then(function(res) {
         console.log('Datos guardados correctamente');
      });

      trackId = null;

      tracking_data = [];
      $scope.isTracking = false;
      $scope.msglog += 'Terminando TrackId: ' + trackId + '\n';
      $scope.msgInfo += 'Total Posiciones: ' + polyPaths.length + '\n';
    }
  };
})