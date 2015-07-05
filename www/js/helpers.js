"use strict";

var helpers = angular.module('app.generics.helpers', [])

helpers
	.service('helperServices',
		function() {

			var getDateUtilFromHHMMSS = function(hhmmss){
				var pieces = hhmmss.split(':'),
				    hour = 0, minute = 0, second = 0;

				if(pieces.length === 3) {
				    hour = parseInt(pieces[0], 10);
				    minute = parseInt(pieces[1], 10);
				    second = parseInt(pieces[2], 10);
				}

				var dto = {
					seconds : second,
					minutes : minute,
					hours : hour,
					totalSeconds : (minute * 60) + second,
					totalMinutes : (hour * 60) + minute
				}

				return dto;
			}
			
			var createGuid = function() {
		        var s = [];
				var hexDigits = "0123456789abcdef";
				for (var i = 0; i < 36; i++) {
				    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
				}
				s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
				s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
				s[8] = s[13] = s[18] = s[23] = "-";

				var uuid = s.join("");
				return uuid;
		    }

		    var toRad = function (value) {
			    var RADIANT_CONSTANT = 0.0174532925199433;
			    return (value * RADIANT_CONSTANT);
		  	}

		  	var getDiffTimeHMS = function (startTime, endTime) {
			    var ms = moment(endTime,"DD/MM/YYYY HH:mm:ss").diff(moment(startTime,"DD/MM/YYYY HH:mm:ss"));
			    var d = moment.duration(ms);
			    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

			    return s;
		  	}

		  	function calculateDistanceKm(starting, ending) {
			    var KM_RATIO = 6371;
			    try {      
			      var dLat = toRad(ending.coords.latitude - starting.coords.latitude);
			      var dLon = toRad(ending.coords.longitude - starting.coords.longitude);
			      var lat1Rad = toRad(starting.coords.latitude);
			      var lat2Rad = toRad(ending.coords.latitude);
			      
			      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
			      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
			      var d = KM_RATIO * c;
			      return d;
			    }
			    catch(e) {
			      return 0;
			    }
			}


			return {				
				newGuid: function()
				{   
					return createGuid();
				},
				getDiffTime: function(startTime, endTime)
				{   
					return getDiffTimeHMS(startTime, endTime);
				},
				getDateUtil: function(date, type)
				{   
					return getDateUtilFromHHMMSS(date);
				},
				calculateDistance: function(starting, ending)
				{   
					var kmtr = calculateDistanceKm(starting, ending);

					return {
						km:kmtr,
						mtr: kmtr * 1000
					};
				},
				calculateDistanceFromArray: function(travelInfo)
				{   
					var calcDist = 0;
      				var iTravelGeoInfo = 0;
      				while (iTravelGeoInfo < travelInfo.length){
						calcDist += calculateDistanceKm(
						                  travelInfo[iTravelGeoInfo],
						                  travelInfo[iTravelGeoInfo + 1]); 
						iTravelGeoInfo++;
					}

					return {
						km: 	calcDist,
						mtr: 	(calcDist * 1000)
					};
				},
				getIntStorageValue: function (key)
		   		{
					var strg = window.localStorage.getItem(key);

					if(strg == undefined)
					{
						strg = 0; 
					}

					return parseInt(strg);
				}
			}
		});