/**
 * Created by Vlad on 12/7/13.
 */

'use strict';

/**
 * Работа с апи яндекс директа
 */
direct.factory('forecastsService', function ($http, $q) {

//    var forecasts;
    var forecast;
    var pending;

//    var deferredForecasts;
    var deferredForecast;
    var deferredPending;

//    function GetForecasts() {
//        deferredForecasts = $q.defer();
//        $http.post('/api/', {
//            "method": "GetForecastList",
//            "locale": "ru"
//        })
//            .success(function (data) {
//                forecasts = data.data;
//                deferredForecasts.resolve(forecasts);
//            });
//    }

    function GetForecast() {
        deferredForecast = $q.defer();
        $http.post('/api/', {
            "method": "GetForecast",
            "param": pending,
            "locale": "ru"
        })
            .success(function (data) {
                forecast = data.data;
                deferredForecast.resolve(forecast);
            });
        return deferredForecast.promise;
    }

    function Create(phrases) {
        var deferredDelete = $q.defer();
        $http.post('/api/', {
            "method": "GetForecastList",
            "locale": "ru"
        })
            .success(function (data) {
                if (data.data && data.data.length > 0) {
                    $http.post('/api/', {
                        "method": "DeleteForecastReport",
                        "param": data.data[0].ForecastID,
                        "locale": "ru"
                    })
                        .success(function (data) {
                            deferredDelete.resolve();
                        });
                } else {
                    deferredDelete.resolve();
                }
            });
        deferredDelete.promise.then(function () {
            $http.post('/api/', {
                "method": "CreateNewForecast",
                "param": {
                    "Phrases": phrases,
                    "Currency": "RUB"
                },
                "locale": "ru"
            })
                .success(function (data) {
                    pending = data.data;
                    deferredDelete.resolve();
                });
        });
        return deferredDelete.promise;
    }

    function CheckAvailable() {
        deferredPending = $q.defer();
        $http.post('/api/', {
            "method": "GetForecastList",
            "locale": "ru"
        })
            .success(function (data) {
                if (data.data) {
                    for (var i = 0; i < data.data.length; i++) {
                        if (data.data[i].ForecastID == pending) {
                            if (data.data[i].StatusForecast == "Done") {
                                deferredPending.resolve();
                            } else {
                                deferredForecast.reject();
                            }
                            return;
                        }
                    }
                }
                deferredForecast.reject();
            });
        return deferredPending.promise;
    }

//    function DeleteList(){
//        for(var i = 0; i < forecasts.length; i++){
//            $http.post('/api/', {
//                "method": "DeleteForecastReport",
//                "param": forecasts[i].ForecastID,
//                "locale": "ru"
//            });
//        }
//        forecasts = [];
//    }
//
//    function Delete(index) {
//        $http.post('/api/', {
//            "method": "DeleteForecastReport",
//            "param": forecasts[index].ForecastID,
//            "locale": "ru"
//        });
//        forecasts.splice(index, 1);
//    }

//    function GetList() {
//        return deferredForecasts.promise;
//    }

//    function Get(id) {
//        return deferredForecast;
//    }

//    function Update() {
//        GetForecasts();
//    }
//
//    GetForecasts();

    return {
//        getList: GetList,
        get: GetForecast,
        create: Create,
        check: CheckAvailable
//        delete: Delete,
//        deleteList: DeleteList,
//        update: Update
    }
});