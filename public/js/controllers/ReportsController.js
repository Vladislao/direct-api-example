'use strict';
/**
 * Created by Vlad on 12/15/13.
 */
direct.controller('CampaignsController',
    function CampaignsController($scope, $modal, campaignsService, reportService) {

        var reports = reportService;

        reports.get().then(function(data){
            reports.all = data;
        });

    });