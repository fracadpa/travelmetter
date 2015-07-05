angular.module('starter.controllers.settings', ['ionic', 'app.generics.helpers'])

.controller('SettingsCtrl', function($scope, $ionicLoading, $ionicPopup, helperServices) {

    $scope.globalSettings = {
      segMinTravel : helperServices.getIntStorageValue("SegMinTravel"),
      mtrMinTravel : helperServices.getIntStorageValue("MtrMinTravel"),
      unitTime : helperServices.getIntStorageValue("UnitTime"),
      unitMtr : helperServices.getIntStorageValue("UnitMtr"),
      mtrCharge : helperServices.getIntStorageValue("MtrCharge"),
      segCharge : helperServices.getIntStorageValue("SegCharge"),
      segMinValueCharge : helperServices.getIntStorageValue("SegMinValueCharge"),
      mtrMinValueCharge : helperServices.getIntStorageValue("MtrMinValueCharge"),
    };

    $scope.saveSettings = function(globalSettings) {

      $scope.loading = $ionicLoading.show({
        content: 'Obteniendo poscision actual...',
        showBackdrop: true
      });

      window.localStorage.setItem("SegMinTravel", globalSettings.segMinTravel);
      window.localStorage.setItem("MtrMinTravel", globalSettings.mtrMinTravel);
      window.localStorage.setItem("UnitTime", globalSettings.unitTime);
      window.localStorage.setItem("UnitMtr", globalSettings.unitMtr);
      window.localStorage.setItem("MtrCharge", globalSettings.mtrCharge);
      window.localStorage.setItem("SegCharge", globalSettings.segCharge);
      window.localStorage.setItem("SegMinValueCharge", globalSettings.segMinValueCharge);
      window.localStorage.setItem("MtrMinValueCharge", globalSettings.mtrMinValueCharge);

      $ionicLoading.hide();

      var alertPopup = $ionicPopup.alert({
         title: 'TravelMetter',
         template: 'Datos guardados correctamente!'
      });
      alertPopup.then(function(res) {
         console.log('Datos guardados correctamente');
      });
    };
})