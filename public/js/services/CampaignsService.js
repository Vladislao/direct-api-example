/**
 * Created by Vlad on 12/7/13.
 */

'use strict';

/**
 * Работа с апи яндекс директа
 */
direct.factory('campaignsService', function ($http, $q) {

    var campaigns = [];
    var current;

    var deferred = $q.defer();

    $http.post('/api/', {
        "method": "GetCampaignsList",
        "locale": "ru"
    })
        .success(function(data, response){
            campaigns = data.data;
            deferred.resolve(campaigns);
        });

    function get(){
        return deferred.promise;
    }

    return {
        get: get,
        current: current
    }
});

direct.factory('typeService', function ($http, $q) {
    var types = [{
        "Text": "Спецразмещение",
        "Field":"Premium"
    },{
        "Text": "1-ое место",
        "Field":"FirstPlace"
    }];
    var type = types[0];

    return {
        types: types,
        type: type
    }
});