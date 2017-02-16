// Ionic Starter App

angular.module('global',['global.router','global.controller','global.service','global.directive']);
angular.module('starter', ['ionic','global','ngCookies','ionic-native-transitions'])
    .run(["$rootScope","$state",'$location','$cookies','$ionicPlatform','$window','$ionicLoading','$ionicViewSwitcher','$ionicHistory','$timeout',"commonRemoteService","$stateParams","commonService",function($rootScope,$state,$location,$cookies,$ionicPlatform,$window,$ionicLoading,$ionicViewSwitcher,$ionicHistory,$timeout,commonRemoteService,$stateParams,commonService){
        "use strict";
        $rootScope.stateGo = function(statename,base){
            if(!base) {
                $state.go(statename);
                // $ionicViewSwitcher.nextDirection("forward");
                return;
            }
            $state.go(statename,base);
        };
        $rootScope.back = function (state){
            // 检测是否保存有上一个页面的信息  即是否刷新过当前页面
            if(!state){
                $ionicHistory.backView()?$ionicHistory.goBack():$state.go("tab."+$location.path().split('/')[1])
            }else {
                $state.go(state);
            }
            // $ionicViewSwitcher.nextDirection("back")
        };
        $rootScope.showLoading = function(message,timeout) {
            $ionicLoading.show({
                template: message === null? '拼命加载中...':message,
                duration: timeout  //n毫秒后关闭
            });
        };
        $rootScope.hideLoading = function(){
            $ionicLoading.hide();
        };
        //解决浮点数不精确问题
        $rootScope.formatCurrency = function(num) {
            if(num===null){
                num = 0;
            }
            num = Math.floor(num*100+0.50000000001);
            return num/100 ;
        };
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            //如果需要登录则检测登录状态
            var isLogin = commonService.isLogin();
            if(!angular.isUndefined(toState.data)&& toState.data.isLogin&& !isLogin) {
                event.preventDefault();
                if(toState.data.isOuterStage){
                    $state.go('tab.me');
                    return;
                }
                $state.go('tab.login',{jumpPage:fromState.name,param:fromParams});
                return;
            }
            //是否隐藏tabs
            if(!angular.isUndefined(toState.data)&& toState.data.hideTabs){
                $rootScope.hideTabs = true;
            }else{
                $rootScope.hideTabs = false;
            }
            //是否需要投资交易验证
            if(!angular.isUndefined(toState.data)&& toState.data.authAccount){
                event.preventDefault();
                commonRemoteService.authAccountState($state,toState,toParams,event);
            }
        });
        $rootScope.$on('$stateChangeSuccess', function(){
            $timeout(function () {
                document.title = $ionicHistory.currentTitle()||"时惠分享";
                var i = document.createElement('iframe');
                i.src = 'html/tabs.html';
                i.style.display = 'none';
                i.onload = function() {
                    setTimeout(function(){
                        i.remove();
                    }, 9);
                };
                document.body.appendChild(i);
            },10);
        });
        //判断是否是微信登录
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            $rootScope.isWechat = true;
        } else {
            $rootScope.isWechat = false;
        }

    }])
    .factory('AuthInterceptor', ['$rootScope','$q','Cookie','$location','$window',function ($rootScope,$q,Cookie,$location,$window){
        return {
            responseError: function (response) {
                // 如果未登录则清空Cookie

                // console.log(response)
                if ("401" == response.status) {
                    // console.log(response)
                    Cookie.destroy()
                    $window.location.href = "#/login";
                    $window.location.reload()
                }
                return response;
            }
        };
    }])
    // 自定义过滤器
    .filter("splitBy", [function () {
        return function (input, type, value) {
            function phone(type) {
                return type = type || " ", input.replace(/\s/g, "").replace(/(\d{3})/, "$1" + type).replace(/(\d{4})/, "$1" + type)
            }
            function bankcard(type) {
                return type = type || " ", input.replace(/\s/g, "").replace(/(\d{4})/g, "$1" + type)
            }
            //手机号码格式处理
            function phoneReplace(type) {
                return type = input.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3");
            }
            //身份证号格式处理
            function iDcardReplace(type) {
                return type = input.replace(/(\d)(\d+)([\d|x])/i,"$1************$3");
            }
            //姓名格式处理
            function realnameReplace(type){
                return type = input.substr(0,input.length-1).replace(/[\u4E00-\u9FA5]/g,"*") + input.substr(input.length-1,input.length);
            }
            //数字向下取值
            function floor(type) {
                return type = Math.floor(input);
            }
            //中文小括号转换英文过滤
            function parenthesis(type) {
                return type = input.replace(/[\uff08]/g,"(").replace(/[\uff09]/g,")")
            }
            //时间格式处理
            function translateTime(type) {
                var h = parseInt(input/60/60);
                var m = parseInt((input-h*3600)/60);
                var s = parseInt((input-h*3600)%60);
                return type = h +"小时"+ m +"分钟"+ s +"秒"
            };
            function numToCny(type) {
                var num = input;
                var strOutput = "";
                var strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分';
                if(num.toString().length>12){
                    num = num.substring(0,11);
                }
                num += "00";
                var intPos = num.indexOf('.');
                if (intPos >= 0) {
                    num = num.substring(0, intPos) + num.substr(intPos + 1, 2);
                }
                strUnit = strUnit.substr(strUnit.length - num.length);
                for (var i=0; i < num.length; i++) {
                    strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(num.substr(i, 1), 1) + strUnit.substr(i, 1);
                }
                var type = strOutput.replace(/^零角零分$/, '零元').replace(/零角零分$/, '整').replace(/零[仟佰拾]/g, '零').replace(/零{2,}/g, '零').replace(/零([亿|万])/g, '$1').replace(/零+元/, '元').replace(/亿零{0,3}万/, '亿').replace(/^元/, "零元");
                return type;
            };
            return input = input ? "" + input : "", "phone" == type ? phone(value) : "bankcard" == type ? bankcard(value) : "phoneReplace" == type ? phoneReplace(value) :"realnameReplace" == type ? realnameReplace(value) : "iDcardReplace" == type ? iDcardReplace(value) : "floor" == type ? floor(value) :"parenthesis" == type?parenthesis(value):"numToCny" == type?numToCny(value):"";

        };
    }])
// 安卓tabs自动在上边 设置统一在底部
    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider,$httpProvider,$ionicNativeTransitionsProvider) {
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');

        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');

        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');
        $httpProvider.defaults.timeout = 120000;
        //监听httpresponse
        $httpProvider.interceptors.push('AuthInterceptor');
        $httpProvider.defaults.headers.post = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        };
        $ionicNativeTransitionsProvider.setDefaultOptions({
            duration: 400,
            slowdownfactor: 4,
            iosdelay: -1,
            androiddelay: -1,
            winphonedelay: -1,
            fixedPixelsTop: 0,
            fixedPixelsBottom: 0,
            triggerTransitionEvent: '$ionicView.afterEnter',
            backInOppositeDirection: false
        });
    });

