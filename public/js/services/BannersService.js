/**
 * Created by Vlad on 12/7/13.
 */

/**
 * Работа с апи яндекс директа
 */
direct.factory('bannersService', function ($http, $q) {

    // data
    var banners;
    var bannerStats;

    // basic functions
    function GetBannersStat(campaign, start, end){
        return $http.post('/api/', {
            "method": "GetBannersStat",
            "param": {
                "CampaignID": campaign,
                "StartDate": start,
                "EndDate": end
            },
            "locale": "ru"
        });
    }

    function GetBanners(campaigns) {
        return $http.post('/api/', {
            "method": "GetBanners",
            "param": {
                "CampaignIDS": campaigns,
                "GetPhrases": "WithPrices"
            },
            "locale": "ru"
        });
    }

    // resolvers
    function BannersStatResolver(campaign, start, end){
        return GetBannersStat(campaign, start, end).then(function(data){
            bannerStats = data.data.data;
            return bannerStats;
        });
    }

    function BannersResolver(campaigns){
        return GetBanners(campaigns).then(function(data){
            // faceplate
            banners = data.data.data;
            return banners;
        });
    }

    return {
        get: BannersResolver,
        getStat: BannersStatResolver
    }
});