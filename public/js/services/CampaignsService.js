/**
 * Created by Vlad on 12/7/13.
 */

'use strict';

/**
 * Работа с апи яндекс директа
 */
direct.factory('campaignsService', function ($http, $q) {

    // data
    var campaigns = [];
    var current;

    // deferred
    var deferredCampaignsList = $q.defer();

    // functions
    function GetCampaignsList() {
        return $http.post('/api/', {
            "method": "GetCampaignsList",
            "locale": "ru"
        });
    }

    // resolve once (update)
    function ResolveOnce(){
        GetCampaignsList().then(function (data) {
            campaigns = data.data.data;
            deferredCampaignsList.resolve(campaigns);
        });
    }

    // resolvers
    function CampaignsListResolver(){
        return deferredCampaignsList.promise;
    }

    ResolveOnce();
    return {
        get: CampaignsListResolver,
        current: current
    }
});

direct.factory('typeService', function () {
    var types = [
        {
            "Text": "Спецразмещение",
            "Field": "Premium",
            "Price": "Premium"
        },
        {
            "Text": "Нижний блок",
            "Field": "FirstPlace",
            "Price": ""
        }
    ];
    var type = types[0];

    return {
        types: types,
        type: type
    }
});