/**
 * Created by Williamhiler on 2016/11/4.
 */

angular.module("message.router",["ionic"])
    .config(function ($stateProvider) {
        $stateProvider
            .state('tab.message', { //消息页面
                url: '/message',
                cache : false,
                views: {
                    'tab_message': {
                        templateUrl: 'html/message/tab_message.html',
                        controller: 'MessageCtrl'
                    }
                },
                data : {
                    isLogin : true,
                    isOuterStage : true
                }
            })
            .state('tab.message_detail', { //消息详情
                url: '/message/detail/:msg_id',
                // cache : false,
                views: {
                    'tab_message': {
                        templateUrl: 'html/message/message_detail.html',
                        controller: 'MessageDetailCtrl'
                    }
                },
                data : {
                    isLogin : true
                }
            })
    })