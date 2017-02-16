/**
 * Created by Williamhiler on 2016/11/4.
 */

angular.module("home.router",["ionic"])
.config(function ($stateProvider) {
    $stateProvider
        .state('tab.home', {  // 主页
            url: '/home',
            cache : false,
            views: {
                'tab_home': {
                    templateUrl: 'html/home/tab_home.html',
                    controller: 'HomeCtrl'
                }
            },
            data : {
                // isLogin : true
            }
        })
        .state('tab.home_banking',{  //展示_消费金融页
             url: "/home/banking",
             cache : false,
             views: {
                 'tab_home': {
                     templateUrl: "html/home/home_banking.html",
                 }
             },
             data : {
                 hideTabs : true
             }
         })
         .state('tab.home_apartment',{  //展示_长租公寓列表页
             url: "/home/apartment",
             cache : false,
             views: {
                 'tab_home': {
                     templateUrl: "html/home/home_apartment.html",
                 }
             },
             data : {
                 hideTabs : true
             }
         })
})