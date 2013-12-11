/**
 * Created by Vlad on 12/7/13.
 */

/**
 * Работа с апи яндекс директа
 */
direct.factory('bannersService', function ($http, $q) {

    var banners = [];
    var deferred = $q.defer();

    function GetBanners(campaigns) {
        $http.post('/api/', {
            "method": "GetBanners",
            "param": {
                "CampaignIDS": campaigns,
                "GetPhrases": "WithPrices"
            },
            "locale": "ru"
        })
            .success(function (data, response) {
                banners = data.data;
                deferred.resolve(banners);
            });
    }

    function get(campaigns) {
        if (campaigns == undefined) {
            return deferred.promise;
        }
        else {
            deferred = $q.defer();
            GetBanners(campaigns);
            return deferred.promise;
        }
    }

    return {
        get: get
    }
});