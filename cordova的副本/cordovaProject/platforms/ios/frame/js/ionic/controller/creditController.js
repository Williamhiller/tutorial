/**
 * Created by Williamhiler on 2016/11/4.
 */
angular.module('credit.controller', [])
// 账户首页
    .controller('CreditCtrl', ["$scope","commonRemoteService","validateService",function (scope,commonRemoteService,validateService){
        //引导 绑卡完善信息
        scope.data = {};
        var promise = commonRemoteService.remote("getMemberCreditState.action");
        promise.then(function(result) {
            // console.log(result)
            if(result.result_code == '000'){
                scope.data = result.data;
            }else{
                validateService.showError(result.result_msg)
            }
        })
    }])
    //个人信息
    .controller('PersonalCtrl', ["$scope","commonRemoteService","validateService","$ionicModal","safeApply","$ionicActionSheet",function (scope,commonRemoteService,validateService,$ionicModal,safeApply,$ionicActionSheet){
        //引导 绑卡完善信息
        scope.data = {};
        scope.options = {};
        var step = scope.step = {
            page : "one",
            picture : {
                fore : "0",
                back : "0",
                handID : "0"
            }
        };
        var promise = commonRemoteService.remote("getMemberCreditAction.action");
        promise.then(function (result) {
            if(result.result_code == "000"){
                scope.data = result.data;
                // 获取关系选择列表
                var opPromise = commonRemoteService.remote("getCodeStringOptions.action",{cs_type:2406})
                opPromise.then(function (result) {
                    if(result.result_code == "000"){
                        safeApply(scope,function () {
                            scope.options = result.data;
                        })
                    }
                })
            }else {
                validateService.showError(result.result_msg);
            }
        });
        scope.checkPic = function () {
            var msg;
            if(scope.data.pictureInfo.foreground_pic_level == "0"){
                msg = "请上传身份证正面照片"
            }else if(scope.data.pictureInfo.background_pic_level == "0"){
                msg = "请上传身份证反面照片"
            }else if(scope.data.pictureInfo.holdID_pic_level == "0"){
                msg = "请上传手持身份证照片"
            }else {
                msg = "身份证信息更新成功"
            };
            validateService.showError(msg);
        }
        scope.submit = function() {
            var data = scope.data;
            var params = {
                company : data.job.company,
                tel : data.job.tel,
                title : data.job.title,
                relation : data.emergency_person.relation,
                name : data.emergency_person.name,
                mobile : data.emergency_person.mobile
            };
            var selfinfo = {};
            var validateParams = [];
            if(params.tel && params.tel!=null){
                if(params.mobile){
                    selfinfo.tel = params.tel;
                    selfinfo.mobileNo = params.mobile;
                    validateParams = ['tel','mobileNo'];
                }else {
                    selfinfo.tel = params.tel;
                    validateParams = ['tel'];
                }
                scope.err_message = validateService.check(selfinfo,validateParams);
            }else if (params.mobile&&params.mobile!=null){
                selfinfo.mobileNo = params.mobile;
                scope.err_message = validateService.check(selfinfo,['mobileNo']);
            }
            // 错误信息提示
            if(scope.err_message != null){
                validateService.showError(scope.err_message);
                return;
            }
            var promise = commonRemoteService.remote('submitMemberCreditAction.action',params);
            promise.then(function (res) {
                if(res.result_code == "000") {
                    validateService.showError("信息更新成功")
                }else {
                    validateService.showError(res.result_msg)
                }
            })
        }
        $ionicModal.fromTemplateUrl('handExample-modal.html', {
            scope : scope,
            animation : 'slide-scale-out'
        }).then(function(modal) {
            scope.modal = modal;
        });
        scope.showModal = function () {
            scope.modal.show();
        }

        scope.hideModal = function(data) {
            scope.modal.hide();
        };
        // 清除模型
        scope.$on('$destroy', function() {
            scope.modal.remove();
        });
        scope.select = function () {
            //console.log(scope.options)
            var buttons = [];
            for(i in scope.options){
                buttons[i] = {};
                buttons[i].text = scope.options[i].cs_value;
            }
            var hideSheet = $ionicActionSheet.show({
                buttons: buttons,
                cancelText: '取消',
                buttonClicked: function(index) {
                    scope.data.emergency_person.relation = scope.options[index].cs_key;
                    return true;
                }
            });
        }

    }])

    //绑定银行卡
    .controller('BindBankCardCtrl',["$scope","$rootScope","commonRemoteService","validateService","commonService","$ionicModal","$stateParams","$state",function($scope,$rootScope,commonRemoteService,validateService,commonService,$ionicModal,$stateParams,$state){
        // 获取页面初始化数据
        // $rootScope.showLoading();
        var promise = commonRemoteService.remote("authBankCard.action", angular.copy($scope.validate));
        promise.then(function(result){
            $scope.validate = {};
            $rootScope.hideLoading();
            if("000" == result.result_code){
                $scope.validate = result.data;
            } else {
                validateService.showError(result.result_msg);
                return;
            }
        });
        // 初始化短信验证码模块
        commonService.smsInit($scope, "phoneCode!bankCard.action");

        // 所属银行列表初始化
        $ionicModal.fromTemplateUrl('bankCardList-modal.html', {
            scope : $scope,
            animation : 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        /** 银行列表（显示/隐藏） */
        $scope.openBankList = function() {
            $scope.modal.show();
        };
        $scope.hideBankList = function() {
            $scope.modal.hide();
        };

        /** 银行选择 */
        $scope.bankSelect = function(data) {
            if ($scope.validate.bankId != data.bankId) {
                $scope.validate.bankcard = null;
            }

            $scope.validate.bankId   = data.bankId;
            $scope.validate.bankImg  = data.bankImg;
            $scope.validate.bankName = data.bankName;

            $scope.modal.hide();
        };

        // 清除模型
        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });
        // 隐藏模型
        $scope.$on('modal.hide', function() {
        });
        // 移动模型
        $scope.$on('modal.removed', function() {
        });
        //console.log($stateParams)
        /** 确认 */
        $scope.submit = function () {
            $("#bankcard_bind_btn").unbind();
            // 持卡人信息校验
            if (!$scope.validate.authIdCardFlag) {
                // 表单验证
                $scope.err_message = validateService.check($scope.validate,['userName','idcard']);

                // 消息显示
                if($scope.err_message != null){
                    validateService.showError($scope.err_message);
                    $("#bankcard_bind_btn").bind('click',$scope.submit);
                    return;
                }
            }

            // 表单验证
            //  $scope.err_message = validateService.check($scope.validate,['bankId','bankcard','mobileNo','phoneCode']);

            // 消息显示 （宝付测试)
            //  if($scope.err_message != null){
            //      validateService.showError($scope.err_message);
            //      $("#bankcard_bind_btn").bind('click',$scope.submit);
            //       return;
            //   }

            // 银行卡绑定
            $rootScope.showLoading("银行卡绑定中...");
            var promise = commonRemoteService.remote("authBankCard!submit.action", angular.copy($scope.validate));
            promise.then(function(result){
                $rootScope.hideLoading();
                //console.log(result)
                if("000" == result.result_code){
                    $scope.validate = {};
                    //console.log($stateParams)
                    if($stateParams.jumpPage == null || $stateParams.jumpPage == ""){
                        // 绑定成功进入账户安全画面
                        $state.go('tab.credit_bankCardSuccess');
                    }else{
                        $state.go($stateParams.jumpPage, $stateParams.param);
                    }
                } else {
                    validateService.showError(result.result_msg);
                    $("#bankcard_bind_btn").bind('click',$scope.submit);
                    return;
                }
            });
        }


    }])


