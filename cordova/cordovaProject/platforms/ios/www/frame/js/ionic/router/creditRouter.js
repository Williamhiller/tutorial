/**
 * Created by Williamhiler on 2016/11/4.
 */

angular.module("credit.router",["ionic"])
    .config(function ($stateProvider) {
        $stateProvider
            .state('tab.credit', {
                url: '/credit',
                cache : false,
                views: {
                    'tab_credit': {
                        templateUrl: 'html/credit/tab_credit.html',
                        controller: 'CreditCtrl'
                    }
                },
                data : {
                    isLogin : true,
                    isOuterStage : true
                }
            })
            .state('tab.credit_bindBankcard',{  //绑定银行卡
                url: "/credit/bankcard",
                cache : false,
                views: {
                    'tab_credit': {
                        templateUrl: "html/credit/credit_bindBankcard.html",
                        controller: "BindBankCardCtrl"
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                },
                params:{
                    jumpPage:null,
                    param:{}
                }
            })
            .state('tab.credit_personal',{  //完善个人信息
                url: "/credit/personal",
                cache : false,
                views: {
                    'tab_credit': {
                        templateUrl: "html/credit/credit_personal.html",
                        controller: 'PersonalCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                }
            })

         .state('tab.credit_bankCardSuccess',{  //绑卡成功
             url: "/credit/bankcard/success",
             cache : false,
             views: {
                 'tab_credit': {
                     templateUrl: "html/credit/credit_bankCardSuccess.html"
                 }
             },
             data : {
                 hideTabs : true,
                 isLogin : true
             }
         })
    })