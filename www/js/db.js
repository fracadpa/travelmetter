"use strict";

var data = angular.module('data', []);

data
	.factory('db',
		function($q, notificator) {
			var db;

			if(window.sqlitePlugin) {
				db = window.sqlitePlugin.openDatabase({name: "rudAppDB"});
			}
			else {
				db = window.openDatabase('rudAppDB', '1.0', 'rudAppDB', 52428800);
			}

			var successWrapper = function(d) {
		        return (function (tx, results) {
		        	var result = [];
					var len = results.rows.length;

					for (var i = 0; i < len; i++) {
						var row = results.rows.item(i);
						result.push(row)
					}

					d.resolve(result)
		        })
		    }

		    var failureWrapper = function(d) {
		        return (function (tx, error) {
		        	handleError(error);

		            d.reject()
		        })
		    }

		    var errorWrapper = function(d) {
		        return (function (error) {
		        	handleError(error);

		            d.reject()
		        })
		    }

		    var handleError = function(error) {
		    	console.log(error.message);

				notificator.showMessage('Ha ocurrido un error. Si el error persiste por favor comuniquese con el administrador del sistema.', true)
			}

			return {
				executeSql: function(sql, params){
					var deferred = $q.defer();

					db.transaction(function (tx) {
		                tx.executeSql(sql, params, successWrapper(deferred), failureWrapper(deferred));
		            }, errorWrapper(deferred));

					return deferred.promise;
				},
				bulkSql: function(command){
					var deferred = $q.defer();

					db.transaction(function (tx) {
						$q.all(_.map(command.values, function(params) {
							var innerDeferred = $q.defer();

							tx.executeSql(command.sql, params, successWrapper(innerDeferred), failureWrapper(innerDeferred));

							return innerDeferred.promise;
						}))
						.then(function() {
							deferred.resolve();
						});
		                
		            }, errorWrapper(deferred));
					
					return deferred.promise;
				}
			}
		});