/**
 * Created by Williamhiler on 2016/11/4.
 */
angular.module("me.router",["ionic"])
    .config(function ($stateProvider) {
        $stateProvider
            .state('tab.me', {  // 主页
                url: '/me',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/tab_me.html',
                        controller: 'MeCtrl'
                    }
                }
            })
            .state('tab.me_moneylist', {  // 资金流水
                url: '/me/moneylist',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_moneylist.html',
                        controller: 'MeMoneyListCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                }
            })
            .state('tab.me_repayList', {  // 还款明细列表
                url: '/me/repayList',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_repayList.html',
                        controller: 'RepayListCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                }
            })
            .state('tab.me_repay', {  // 还款
                url: '/me/repay?inst_order_id&repay_period',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_repay.html',
                        controller: 'RepayCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                }
            })
            .state('tab.me_repay_result', {  // 还款结果页，成功待确认失败
                url: '/me/repay/result/:payment_order_id',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_repay_result.html',
                        controller: 'RepayResultCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                },
                params:{
                    inst_order_id:null,
                    repay_period:null
                }
            })
            .state('tab.me_repayRecord', {  // 还款记录
                url: '/me/repayRecord',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_repayRecord.html',
                        controller: 'RepayRecordCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                }
            })
            .state('tab.me_order', {  // 我的订单
                url: '/me/order',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_order.html',
                        controller: 'OrderCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                },
                params : {
                    anchor : null
                }
            })
            .state('tab.me_order_detail',{  //订单详情
                url: "/me/order/detail?inst_order_id",
                cache : false,
                views: {
                    'tab_me': {
                        templateUrl: "html/me/me_order_detail.html",
                        controller: 'OrderDetailCtrl'
                    }
                },
                data : {
                    hideTabs : true
                }
            })
            .state('tab.me_order_plan', {  // 我的订单计划
                url: '/me/order/plan?inst_order_id&preiod&is_raise&sod_total_amt&sod_repayment_amt',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_order_plan.html',
                        controller: 'OrderPlanCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                }
            })
            .state('tab.me_order_progress', {  // 我的订单 申请进度
                url: '/me/order/progress?inst_order_id',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_order_progress.html',
                        controller: 'OrderProgressCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                }
            })
            .state('tab.me_order_success', {  // 我的订单 分期确认成功
                url: '/me/order/success',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_order_success.html',
                        // controller: 'OrderSuccessCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                }
            })
            .state('tab.me_agreement', {  // 订单详情 委托服务协议
                url: '/me/order/me_agreement?inst_order_id',
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_agreement.html',
                        controller: 'OrderAgreementCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                }
            })
            .state('tab.me_recharge',{  //充值
                url: "/me/recharge",
                cache : false,
                views: {
                    'tab_me': {
                        templateUrl: "html/me/me_recharge.html",
                        controller: 'RechargeCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true,
                    authAccount:true
                }
            })
            .state('tab.me_withdraw',{  //提现
                url: "/me/withdraw",
                cache : false,
                views: {
                    'tab_me': {
                        templateUrl: "html/me/me_withdraw.html",
                        controller: 'WithdrawCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true,
                    authAccount:true
                }
            })
            .state('tab.me_withdraw_result', {  // 提现结果页
                url: '/me/withdraw/result:withdraw_amt',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_withdraw_result.html',
                        controller: 'WithdrawSuccessCtrl'
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                },
                params:{
                    withdraw_amt:null,
                    times:null
                }
            })
            .state('tab.me_bankcard', {  //我的银行卡
                url: '/me/bankcard',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_bankcard.html',
                        controller: 'MeBankcardCtrl'
                    }
                }
            })
            .state('tab.me_set', {  // 设置
                url: '/me/set',
                cache:false,
                views: {
                    'tab_me': {
                        templateUrl: 'html/me/me_set.html',
                        controller: 'MeSetCtrl'
                    }
                },
                data : {
                    hideTabs : false,
                    isLogin : true
                }
            })
            .state('tab.me_resetTradePassword',{  //重置交易密码
                url: "/me/set/resetTradePassword",
                cache : false,
                views: {
                    'tab_me': {
                        templateUrl: "html/me/me_set_resetTradePassword.html",
                        controller: 'ResetTradePasswordCtrl'
                    }
                },
                data : {
                    hideTabs : false,
                    isLogin : true
                }
            })
            .state('tab.me_tradePassword',{  //交易密码设置
                url: "/me/set/tradePassword",
                cache : false,
                views: {
                    'tab_me': {
                        templateUrl: "html/me/me_set_tradePassword.html",
                        controller: 'TradePasswordCtrl'
                    }
                },
                data : {
                    hideTabs : false,
                    isLogin : true
                },
                params:{
                    jumpPage:null,
                    param:{}
                }
            })
            .state('tab.me_help',{  //帮助中心
                url: "/me/help",
                cache : false,
                views: {
                    'tab_me': {
                        templateUrl: "html/me/me_help.html",
                        // controller: 'HelpCtrl'
                    }
                },
                data : {
                    hideTabs : true
                }
            })
            .state('tab.me_aboutus',{  //关于我们
                url: "/me/aboutus",
                cache : false,
                views: {
                    'tab_me': {
                        templateUrl: "html/me/me_aboutus.html",
                    }
                },
                data : {
                    hideTabs : true
                }
            })
            .state('tab.me_feedback',{  //关于我们 反馈
                url: "/me/aboutus/feedback",
                cache : false,
                views: {
                    'tab_me': {
                        templateUrl: "html/me/me_feedback.html",
                        controller : "FeedbackCtrl"
                    }
                },
                data : {
                    hideTabs : true,
                    isLogin : true
                }
            })
            .state('tab.me_aboutShfx',{  //关于我们 关于时惠分享
                url: "/me/aboutus/shfx",
                views: {
                    'tab_me': {
                        templateUrl: "html/me/me_aboutShfx.html"
                    }
                },
                data : {
                    hideTabs : true
                }
            })
    })