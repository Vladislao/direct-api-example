/**
 * Created by Vlad on 12/7/13.
 */

'use strict';

/**
 * Работа с апи яндекс директа
 */
direct.factory('forecastsService', function ($http, $q, $timeout) {

    // data
    var forecast;

    // api functions
    function GetForecast(id) {
        return $http.post('/api/', {
            "method": "GetForecast",
            "param": id,
            "locale": "ru"
        });
    }

    function GetForecastList() {
        return $http.post('/api/', {
            "method": "GetForecastList",
            "locale": "ru"
        });
    }

    function DeleteForecastReport(id) {
        return $http.post('/api/', {
            "method": "DeleteForecastReport",
            "param": id,
            "locale": "ru"
        });
    }

    function CreateNewForecast(phrases) {
        return $http.post('/api/', {
            "method": "CreateNewForecast",
            "param": {
                "Phrases": phrases
            },
            "locale": "ru"
        });
    }

    // resolvers
    // yandex quest:
    // get list -> check if any -> delete -> create new -> wait until done -> get it finally
    function GetNewForecastResolver(phrases) {
        return GetForecastList()
            .then(function (data) {
                var list = data.data.data;
                if (list && list.length > 0) {
                    return DeleteForecastReport(list[0].ForecastID);
                }
            })
            .then(function () {
                return CreateNewForecast(phrases);
            })
            .then(function (data) {
                return WaitAvailableResolver(data.data.data);
            })
            .then(function (pending) {
                return GetForecast(pending);
            })
            .then(function (data) {
                forecast = data.data.data;
                return forecast;
            });
    }

    function WaitAvailableResolver(pending) {
        return $timeout(function () {
            return CheckAvailableResolver(pending)
                .then(function () {
                    return pending;
                }, function () {
                    return WaitAvailableResolver(pending);
                });
        }, 1000);
    }

    function CheckAvailableResolver(pending) {
        return GetForecastList().then(function (data) {
            var list = data.data.data;
            for (var i = 0; i < list.length; i++) {
                if (list[i].ForecastID == pending) {
                    if (list[i].StatusForecast == "Done") {
                        return;
                    } else {
                        return $q.reject();
                    }
                }
            }
            return $q.reject();
        });
    }

    return {
        get: GetForecast,
        create: GetNewForecastResolver
    }
});