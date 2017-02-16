/**
 * Created by Williamhiler on 2016/11/4.
 */
angular.module('user.controller', [])
    //注册
    .controller('RegisterCtrl',["$scope","validateService","commonRemoteService","commonService","$rootScope","Cookie","$state","popupService",function($scope,validateService,commonRemoteService,commonService,$rootScope,Cookie,$state,popupService) {
        $scope.register = {};
        $scope.step="one"; //默认第一步
        // 初始化短信验证码模块
        commonService.smsInit($scope, "phoneCode!register.action");

        //step1:填写手机号码后点击下一步
        $scope.next = function(){
            // 表单验证:手机号码格式
            $scope.err_message = validateService.check($scope.register,['mobileNo']);
            // 错误信息提示
            if($scope.err_message != null){
                validateService.showError($scope.err_message);
                return;
            }
            // 手机号码唯一性校验
            var promise = commonRemoteService.remote("mobileVerify.action",angular.copy($scope.register));
            promise.then(function(result) {
                if ("000" == result.result_code) {
                    //电话号码验证通过，继续注册
                    //1、发送短消息
                    $scope.smsSend('100000000002',$scope.register.mobileNo);
                    //2、跳转到第二步
                    $scope.step="two"
                }else{
                    //电话号码验证失败，提示信息
                    // console.log(result)
                    validateService.showError(result.result_msg)
                        .then(function (res) {
                            if (res){
                                $state.go('tab.login');
                            }
                        });
                    return;
                }
            });
        }
        //step1:立即注册按钮
        $scope.doRegister = function () {
            // 表单验证:验证码格式、密码格式
            $scope.err_message = validateService.check($scope.register,['phoneCode','password']);
            // 错误消息显示
            if($scope.err_message != null){
                validateService.showError($scope.err_message);
                return;
            }
            // 注册
            $rootScope.showLoading("注册中...");
            var promise = commonRemoteService.remote("userRegister.action",angular.copy($scope.register));
            promise.then(function(res){
                $rootScope.hideLoading();
                if("000" == res.result_code){
                    if($scope.register.bind == true){
                        commonRemoteService.remote('bindWechatAccount.action',{is_bind_account:true});
                    }
                    $scope.register = {};
                    $scope.sms = {};
                    Cookie.create(null, res.data, null);

                    var title = "账号关联声明",
                        content = "&nbsp;&nbsp;&nbsp;&nbsp;恭喜您注册成功，您可以使用该账号登录上海南相资产管理有限公司旗下的财富农场。您的身份证  银行卡等信息也将同步到财富农场中，请妥善保管账号信息，以免造成不必要的损失。"
                    var alertPopup = popupService.alertPopup(title,content);
                    alertPopup.then(function (res) {
                        if(res){
                            var agreePromise = commonRemoteService.remote("setBindAgreementFlag.action",{is_bind_account:true});
                            agreePromise.then(function (res) {
                                $state.go('tab.home');
                            })
                        }
                    });
                } else {
                    validateService.showError(res.result_msg);
                    return;
                }
            });
        };
    }])
    //登录
    .controller('LoginCtrl',["$scope","validateService","commonRemoteService","$rootScope","$stateParams","$state","Cookie","popupService",function($scope,validateService,commonRemoteService,$rootScope,$stateParams,$state,Cookie,popupService) {
        $scope.user = {};
        $scope.data = {};
        $scope.submit = function () {
            //表单验证
            //手机号码:mobileNo
            //密码:password
            $scope.err_message = validateService.check($scope.user,['mobileNo','password']);
            //验证是否通过
            if($scope.err_message != null){
                validateService.showError($scope.err_message);
                $scope.user.password = null;
                return;
            }
            //开始调用登录方法
            $rootScope.showLoading("登录中...");
            var promise = commonRemoteService.remote("userLogin.action",angular.copy($scope.user));
            promise.then(function(result){
                $rootScope.hideLoading();
                if("000" == result.result_code){
                    Cookie.create(null, result.data.MEMBER_ID, null);
                    if(result.data.HAS_CHECKED_AGREEMENT == false) {
                        var title = "账号关联声明",
                            content = "&nbsp;&nbsp;&nbsp;&nbsp;您已使用上海南相资产管理有限公司旗下的财富农场账号成功登陆，点击确定按钮进行账号关联，您的身份证  银行卡等信息也将同步到时惠分享中，请妥善保管账号信息，以免造成不必要的损失。"
                        var alertPopup = popupService.alertPopup(title,content);
                        alertPopup.then(function (res) {
                            if(res){  //同意提示，如果同意则调用同意接口，下次再登录时不弹出
                                var agreePromise = commonRemoteService.remote("setBindAgreementFlag.action",{is_bind_account:true});
                                agreePromise.then(function (res) {
                                    $state.go('tab.home');
                                })
                            }
                        });
                    }
                    if($stateParams.jumpPage == null || $stateParams.jumpPage == "" || $stateParams.jumpPage == "tab.login"){
                        $state.go('tab.home');
                    }else{
                        $state.go($stateParams.jumpPage, $stateParams.param);
                    }
                } else {
                    validateService.showError(result.result_msg);
                    $scope.user.password = null;
                }
            });
        }
    }])
    //忘记密码
    .controller('ForgetPwdCtrl',["$scope","commonService","validateService","commonRemoteService","$rootScope","$state","Cookie",function($scope,commonService,validateService,commonRemoteService,$rootScope,$state,Cookie) {
        $scope.forgetPwd = {};

        // 初始化短信验证码模块
        commonService.smsInit($scope, "phoneCode!findLoginPwd.action");

        /** 确认 */
        $scope.submit = function () {
            // 表单验证
            $scope.err_message = validateService.check($scope.forgetPwd,['mobileNo','phoneCode','password']);

            // 消息显示
            if($scope.err_message != null){
                validateService.showError($scope.err_message);
                return;
            }
            // 忘记密码
            $rootScope.showLoading("处理中...");
            var promise = commonRemoteService.remote("findPwd.action",angular.copy($scope.forgetPwd));
            promise.then(function(result){
                $rootScope.hideLoading();
                if("000" == result.result_code){
                    $scope.forgetPwd = {};
                    $scope.sms = {};
                    Cookie.destroy();
                    $state.go('tab.login');
                } else {
                    validateService.showError(result.result_msg);
                    return;
                }
            });
        }
    }]);