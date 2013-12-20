'use strict';

direct.controller('CampaignsController', function CampaignsController($scope, $modal, campaignsService) {

    $scope.campaigns = campaignsService;
    campaignsService.get().then(function(data){
        $scope.campaigns.all = data;
    });

    $scope.setCurrent = function(campaign){
        campaignsService.current = campaign;
    };

});