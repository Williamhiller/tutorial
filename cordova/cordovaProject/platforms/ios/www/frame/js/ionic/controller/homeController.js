/**
 * Created by Williamhiler on 2016/11/4.
 */

angular.module('home.controller', [])
    .controller('HomeCtrl',['$scope','commonRemoteService','$rootScope','validateService','commonService','safeApply','RepaymentUtilInit','$cordovaDevice','$ionicPlatform',function(scope,commonRemoteService,$rootScope,validateService,commonService,safeApply,RepaymentUtilInit,$cordovaDevice,$ionicPlatform){
        scope.data={};
        // 轮播图
        commonRemoteService.remote("searchBannerAction.action").then(function(result){
            scope.slide = result;
        });
        // 订单显示
        var promise = commonRemoteService.remote("searchStageOrder.action");
        promise.then(function (res) {
            //console.log(res)
            if(res.result_code == "000"){
                // console.log(res)
                scope.data = res.data;
                res.data.orderlist = res.data.orderlist.map(function (item) {
                    RepaymentUtilInit.init(scope,item);
                    return item;
                })
            }
        })
    }])
