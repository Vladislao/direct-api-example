'use strict';
/**
 * Работа с апи яндекс директа
 */
direct.factory('reportService', function ($http, $q, $timeout) {

    var reports;
    var deferredReports;

    function GetReports(){
        return $http.post('/api/', {
            "method": "GetReportList",
            "locale": "ru"
        });
    }

    function CreateReport(campaignId, start, end){
        return $http.post('/api/', {
            "method": "CreateNewReport",
            "param": {
                "CampaignID": campaignId,
                "StartDate": start,
                "EndDate": end,
                "TypeResultReport": "xml"
            },
            "locale": "ru"
        });
    }

    function UpdateReports(){
        $timeout(function(){
            ResolveReports().then(function(){
                UpdateReports();
            });
        }, 5000);
    }

    function ResolveReports(){
        deferredReports = $q.defer();
        GetReports().then(function (){
            reports = data.data.data;
            deferredReports.resolve(reports);
        });
        return deferredReports.promise;
    }

    function ReportsResolver(){
        return deferredReports.promise;
    }

    return {
        get: ReportsResolver,
        create: CreateReport
    }
});