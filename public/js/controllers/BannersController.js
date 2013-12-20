'use strict';

direct.controller('BannersController',
    function BannersController($scope, $timeout, bannersService, campaignsService, forecastsService, typeService) {

        $scope.banners = bannersService;
        $scope.campaigns = campaignsService;
        $scope.forecasts = forecastsService;
        $scope.typeService = typeService;

        var filter = $scope.filter = {
            "sortBy": "",
            "sortAsc": false
        };

        function SetStats(data){
            $scope.banners.stats = data;
        }

        function SetForecast(data) {
            $scope.forecasts.one = data;
            var clone = data.Phrases.slice(0);
            for (var i = 0; i < $scope.banners.all.length; i++) {
                $scope.banners.all[i].forecast = clone.splice(0, $scope.banners.all[i].Phrases.length);
            }
        }

        function GetBanners(campaignId) {
            return bannersService.get([campaignId])
                .then(function (banners) {
                    $scope.banners.all = banners;
                    return banners;
                });
        }

        function ExtractPhrases(banners) {
            var phrases = [];
            for (var i = 0; i < banners.length; i++) {
                var p = banners[i].Phrases;
                for (var j = 0; j < p.length; j++) {
                    phrases.push(p[j].Phrase);
                }
            }
            return phrases;
        }

        $scope.$watch('campaigns.current', function (newValue, oldValue) {
            if (newValue) {
                GetBanners(newValue.CampaignID)
                    .then(function (banners) {
                        var phrases = ExtractPhrases(banners);
                        forecastsService.create(phrases).then(function (forecast) {
                            SetForecast(forecast);
                        });
                    });
//                bannersService.getStat(newValue.CampaignID, "2013-12-05", "2013-12-11").then(function(stats){
//                    SetStats(stats);
//                });
            }
        });

        $scope.$watch('filter', filterAndSortBanners, true);

        function filterAndSortBanners() {
            if ($scope.banners.all == undefined || $scope.banners.all[0].forecast == undefined)
                return;

            $scope.banners.all.sort(function (a, b) {
                var sA = 0,
                    sB = 0;
                for (var i = 0; i < a.forecast.length; i++) {
                    sA += a.forecast[i][filter.sortBy];
                }
                for (i = 0; i < b.forecast.length; i++) {
                    sB += b.forecast[i][filter.sortBy];
                }
                if (sA > sB) {
                    return filter.sortAsc ? 1 : -1;
                }
                if (sA < sB) {
                    return filter.sortAsc ? -1 : 1;
                }
                return 0;
            });
            for (var i = 0; i < $scope.banners.all.length; i++) {
                var banner = $scope.banners.all[i];
                $scope.banners.all[i].forecast.sort(function (a, b) {
                    if (a[filter.sortBy] > b[filter.sortBy]) {
                        return filter.sortAsc ? 1 : -1;
                    }

                    if (a[filter.sortBy] < b[filter.sortBy]) {
                        return filter.sortAsc ? -1 : 1;
                    }

                    return 0;
                });
            }
        }

        //phrase[typeService.type.Price + "Max"] * phrase[typeService.type.Field + "Clicks"]
        $scope.getTotalCost = function () {
            if ($scope.forecasts.one == undefined) {
                return 0;
            }
            var sum = 0;
            for (var i = 0; i < $scope.forecasts.one.Phrases.length; i++) {
                var phrase = $scope.forecasts.one.Phrases[i];
                sum += phrase[typeService.type.Price + "Max"] * phrase[typeService.type.Field + "Clicks"];
            }
            return sum;
        };

        $scope.getAvgClickCost = function(){
            if ($scope.forecasts.one == undefined) {
                return 0;
            }
            var sum = 0;
            for (var i = 0; i < $scope.forecasts.one.Phrases.length; i++) {
                var phrase = $scope.forecasts.one.Phrases[i];
                sum += phrase[typeService.type.Price + 'Max'];
            }
            return sum / $scope.forecasts.one.Phrases.length;
        }

        $scope.sortBy = function (key) {
            if (filter.sortBy === key) {
                filter.sortAsc = !filter.sortAsc;
            } else {
                filter.sortBy = key;
                filter.sortAsc = true;
            }
        };

    });