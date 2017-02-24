/**
 * Created by Williamhiler on 2016/11/4.
 */
angular.module("user.router",["ionic"])
    .config(function ($stateProvider) {
        $stateProvider
            .state('tab.login',{ //登录
                url: "/login",
                cache: false,
                views : {
                    "tab_me" : {
                        templateUrl: 'html/user/login.html',
                        controller : "LoginCtrl"
                    }
                }
            })
            .state('tab.register',{ //注册
                url: "/login/register",
                views : {
                    "tab_me" : {
                        templateUrl: 'html/user/register.html',
                        controller : "RegisterCtrl"
                    }
                }
            })
            .state('tab.forgetPassword',{ //忘记密码
                url: "/login/forgetPassword",
                cache : false,
                views : {
                    "tab_me" : {
                        templateUrl: 'html/user/forgetPassword.html',
                        controller : "ForgetPwdCtrl"
                    }
                }
            })
            .state('tab.login_agreement',{ //服务协议
                url: "/login/agreement",
                // cache : false,
                views : {
                    "tab_me" : {
                        templateUrl: 'html/user/login_agreement.html'
                    }
                },
                data : {
                    hideTabs : true
                }
            })
            .state('tab.register_agreement',{ //注册服务协议
                url: "/login/register/agreement",
                views : {
                    "tab_me" : {
                        templateUrl: 'html/user/register_agreement.html'
                    }
                },
                data : {
                    hideTabs : true
                }
            })
    })