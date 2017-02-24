/**
 * Created by Williamhiler on 2016/11/4.
 */
angular.module("me.controller",[])
/** 我的页面 **/
.controller("MeCtrl",["$scope","commonService","commonRemoteService","validateService",function(scope,commonService,commonRemoteService,validateService){
    scope.data = {};
    scope.isLogin = commonService.isLogin();
    if(scope.isLogin){
        var promise = commonRemoteService.remote('getMyAccountInfo.action');
        promise.then(function (res) {
            if(res.result_code == "000"){
                scope.data = res.data;
            }else {
                validateService.showError(res.result_msg);
            }
        });
    }
}])
/** 还款列表 */
.controller("RepayListCtrl",["$scope","commonRemoteService","validateService",function(scope,commonRemoteService,validateService){
    scope.data = {};
    var promise = commonRemoteService.remote('getMyPayingInstOrder.action');
    promise.then(function (res) {
        if(res.result_code == "000"){
            scope.data = res.data;
        }else {
            validateService.showError(res.result_msg);
        }
    });
}])
/** 还款 */
.controller("RepayCtrl",["$scope","$rootScope","commonRemoteService","validateService","$stateParams","$state","popupService","$ionicHistory",function(scope,$rootScope,commonRemoteService,validateService,$stateParams,$state,popupService,$ionicHistory){
    scope.data = {};
    scope.repay = {};
    scope.repay.method = "account";
    var validatePromise = commonRemoteService.remote('validateRepayPeriod.action',{inst_order_id:$stateParams.inst_order_id});
    validatePromise.then(function (res) {
        if(res.result_code === "000"){
            if($stateParams.repay_period != res.data.REPAYING_PERIOD){
                popupService.alertPopup('温馨提示',"当前有待确认订单，请耐心等待确认完毕再进行本期还款").then(function (res) {
                    if(res){
                        $ionicHistory.goBack();
                    }
                })
            }
        }else {
            validateService.showError(res.result_msg)
        }
    })
    //初始化页面信息
    var params = {inst_order_id:$stateParams.inst_order_id,repay_period:$stateParams.repay_period};
    //console.log(params)
    var promise = commonRemoteService.remote('getPeriodPaymentConfirmPage.action',params);
    promise.then(function (res) {
        //console.log(res)
        if(res.result_code == "000"){
            scope.data = res.data;
        }else {
            validateService.showError(res.result_msg);
        }
    });
    scope.submit = function () {
        if(scope.data.ACCOUNT_AMT<scope.data.TOTAL_AMT) {
            validateService.showError("账户余额不足，请充值");
            return
        }
        if(scope.repay.method == "account"){
            //console.log(params)
            $rootScope.showLoading("正在还款...")
            commonRemoteService.remote('paybackOrderWithSaccount.action',params).then(function (res) {
                //console.log(res)
                $rootScope.hideLoading();
                if(res.result_code == "000"){
                    $state.go('tab.me_repay_result',params)
                }else {
                    validateService.showError(res.result_msg)
                }
            })
        }else {
            commonRemoteService.remote('paybackOrderCreate.action',params).then(function (res) {
                //console.log(res)
                if(res.result_code == "000"){
                    var bfdata = res.data.bfpay_data
                    $("#back_url").val(bfdata.back_url)
                    $("#data_content").val(bfdata.data_content)
                    $("#data_type").val(bfdata.data_type)
                    $("#input_charset").val(bfdata.input_charset)
                    $("#language").val(bfdata.language)
                    $("#member_id").val(bfdata.member_id)
                    $("#terminal_id").val(bfdata.terminal_id)
                    $("#txn_sub_type").val(bfdata.txn_sub_type)
                    $("#txn_type").val(bfdata.txn_type)
                    $("#version").val(bfdata.version)
                    $("#FormSub").attr("action", bfdata.bf_address);
                    //console.log(bfdata)
                    $("#FormSub").submit();
                }else {
                    validateService.showError(res.result_msg)
                }
            })
        }

    }
}])
/** 还款结果 还款成功-还款待确认-还款失败 */
.controller("RepayResultCtrl",["$scope","commonRemoteService","validateService","$stateParams",function(scope,commonRemoteService,validateService,$stateParams){
    scope.data = {};
    //console.log($stateParams.payment_order_id)
    if(!$stateParams.payment_order_id){
        var params = {inst_order_id:$stateParams.inst_order_id,repay_period:$stateParams.repay_period}
        var promise = commonRemoteService.remote('getSaccountOrderRepayResult.action',params);
        promise.then(function (res) {
            if(res.result_code == "000"){
                scope.data = res.data;
            }else {
                validateService.showError(res.result_msg)
            }
        })
    }else {
        var promise = commonRemoteService.remote('getOrderRepayResult.action',{payment_order_id:$stateParams.payment_order_id});
        promise.then(function (res) {
            //console.log(res);
            if(res.result_code == "000"){
                scope.data = res.data;
            }else {
                validateService.showError(res.result_msg)
            }
        })
    }
}])
/** 我的订单 */
.controller("OrderCtrl",["$scope","$rootScope","commonRemoteService","validateService","$stateParams","RepaymentUtilService","$ionicSlideBoxDelegate","RepaymentUtilInit",function(scope,$rootScope,commonRemoteService,validateService,$stateParams,RepaymentUtilService,$ionicSlideBoxDelegate,RepaymentUtilInit){
    scope.data = {};
    scope.step = $stateParams.anchor != null?$stateParams.anchor:$rootScope.anchor?$rootScope.anchor:0;
    scope.repay = {};
    scope.showItems = false;
    scope.slideChange = function (index) {
        scope.step = index;
        $ionicSlideBoxDelegate.slide(index);
        $rootScope.anchor = index;
    };
    scope.setData = function (data) {
        // 全部订单
        scope.data[0]=data;
        //待确认订单
        scope.data[1] = data.filter(function (item) {
            return item.sod_main_state == '241900000001'&&item.left_time>0;
        });
        //审核中订单
        scope.data[2] = data.filter(function (item) {
            return item.sod_main_state == '241900000002';
        });
        //还款中
        scope.data[3] = data.filter(function (item) {
            return item.sod_main_state == '241900000006'&&(item.bcase_repay_id || item.plan_count==0&&!item.bcase_repay_id)
        });
        //已结束
        scope.data[4] = data.filter(function (item) {
            var state = item.sod_main_state;
            return state == '241900000003'||state =='241900000004'||state =='241900000005'||item.left_time<0 || state=='241900000006'&&(item.bcase_repay_id==null)&&item.plan_count!=0;
        });
    }
    var promise = commonRemoteService.remote('myInstallmentOrderPage.action');
    promise.then(function (res) {
        //console.log(res)
        if(res.result_code == "000"){
            scope.setData(res.data);

            res.data = res.data.map(function (item) {
                item = RepaymentUtilInit.init(scope,item);
                return item;
            });
            scope.setData(res.data);
            scope.showItems = true;
        }else {
            validateService.showError(res.result_msg);
        }
    });
}])
/** 我的订单详情 */
.controller("OrderDetailCtrl",["$scope","commonRemoteService","validateService","$stateParams","$rootScope","popupService","$state","RepaymentUtilService","RepaymentUtilInit",function(scope,commonRemoteService,validateService,$stateParams,$rootScope,popupService,$state,RepaymentUtilService,RepaymentUtilInit){
    scope.data = {};
    scope.repay = {};
    scope.init = function () {
        commonRemoteService.remote('getInstOrderDetail.action',{inst_order_id:$stateParams.inst_order_id}).then(function (res) {
            if(res.result_code == "000"){
                scope.data = res.data;
                scope.repay.preiod = res.data.cod_apply_preiod?res.data.cod_apply_preiod:res.data.sod_max_installment; //初始化显示分期数
                scope.changePreiod();
            }else {
                validateService.showError(res.result_msg)
            }
        });
    };
    scope.init();
    scope.confirm = function () {
        commonRemoteService.remote('getMemberCreditState.action').then(function (res) {
            if(res.result_code == "000"){
                //console.log(res)
                if(!res.data.IS_FINISHED_BANKCARD){
                    popupService.confirm('提示','您尚未绑定银行卡，点击去绑定银行卡').then(function (res) {
                        if(res){
                            $state.go('tab.credit_bindBankcard')
                        }
                    });
                    return ;
                }
                $rootScope.showLoading('正在提交，请耐心等待...')
                //console.log($stateParams.inst_order_id,scope.repay.preiod,scope.data.cod_apply_preiod)
                var confirm_terms;
                if(scope.data.cod_apply_preiod&&scope.data.cod_apply_preiod!=null){
                    confirm_terms = scope.data.cod_apply_preiod;
                }else {
                    confirm_terms = scope.repay.preiod;
                }
                //console.log($stateParams.inst_order_id,confirm_terms)
                var promise = commonRemoteService.remote('confirmInstOrder.action',{inst_order_id:$stateParams.inst_order_id,confirm_terms:confirm_terms});
                promise.then(function (res) {
                    $rootScope.hideLoading();
                    //console.log(res);
                    if(res.result_code == "000"){
                        scope.init();
                    }else {
                        validateService.showError(res.result_msg)
                    }
                })
            }else {
                validateService.showError(res.result_msg)
            }
        })
    }
    scope.giveUp = function () {
        var confirmPopup = popupService.confirm('提示','是否要放弃订单？放弃后订单将失效，不能再重新申请分期');
        confirmPopup.then(function(res) {
            if(res) {
                var promise = commonRemoteService.remote('discardInstOrder.action',{inst_order_id:$stateParams.inst_order_id});
                promise.then(function (res) {
                    //console.log(res);
                    if(res.result_code == "000"){
                        scope.init();
                    }else {
                        validateService.showError(res.result_msg)
                    }
                })
            }
        });
    };
    scope.changePreiod = function () {
        RepaymentUtilInit.init(scope);
    };
    scope.stateGoPlan = function () {
        var data = scope.data;
        var is_raise = 0;
        if(data.sod_main_state == '241900000006' && data.plan_count==0 && !data.bcase_repay_id) {
            is_raise = 1;
        }
        var params = {
            inst_order_id:data.inst_order_id,
            preiod:scope.repay.preiod,
            sod_total_amt:data.sod_total_amt,
            sod_repayment_amt:data.sod_repayment_amt,
            is_raise : is_raise
        };
        $state.go('tab.me_order_plan',params)

    }
}])
/** 我的订单计划 */
.controller("OrderPlanCtrl",["$scope","commonRemoteService","$stateParams","popupService","$state","validateService",function(scope,commonRemoteService,$stateParams,popupService,$state,validateService){
    scope.data = {};
    scope.percent = 0;
    scope.is_raise = $stateParams.is_raise;
    var promise = commonRemoteService.remote('getRepaymentPlanList.action',{inst_order_id:$stateParams.inst_order_id});
    promise.then(function (res) {
        // console.log(res)
        if(res.result_code == "000"){
            scope.data = res.data;
            if(res.data.order.SOD_MAIN_STATE == "241900000001"){
                commonRemoteService.remote('getInstOrderDetail.action',{inst_order_id:$stateParams.inst_order_id}).then(function (res) {
                    if(res.result_code == "000"){
                        var preiod = $stateParams.preiod;
                        scope.data.order = {
                            MERCHANT_NAME : res.data.merchant_name,
                            TOTAL_PERIOD:preiod,
                            UNPAID_PERIOD : preiod,
                            TOTAL_AMT :$stateParams.sod_total_amt,
                            UNPAID_TOTAL_AMT : $stateParams.sod_total_amt,
                            HAS_PAIDBACK_AMT : 0
                        };
                        scope.data.planList = [];
                        var date = new Date(res.data.sod_start_date).getTime();
                        var preiodTime = res.data.sod_term_days/preiod * 24*60*60*1000;
                        for(var i=0;i<preiod;i++){
                            scope.data.planList[i] = {};
                            scope.data.planList[i].PAY_DATE = {};
                            if(res.data.sod_industry_type.substr(7,1)==1) {
                                date = new Date(date);
                                date.setMonth(date.getMonth()+1);
                                date = date.getTime();
                            }else {
                                date += preiodTime;
                            }
                            scope.data.planList[i].PAY_DATE.time = date;
                            if(i == preiod-1){
                                scope.data.planList[i].PAY_AMT = $stateParams.sod_total_amt - $stateParams.sod_repayment_amt*i;
                            }else {
                                scope.data.planList[i].PAY_AMT = $stateParams.sod_repayment_amt;
                            }
                        }
                    }else {
                        validateService.showError(res.result_msg)
                    }
                });
            }
        }else {
            validateService.showError(res.result_msg)
        }
    });
    scope.payOff = function (period) {
        var index = period-2;
        if(index >= 0 && (scope.data.planList[index].REPAY_STATUS == '151400000001' || scope.data.planList[index].REPAY_STATUS == '151400000003')){
            popupService.alertPopup("提示","请优先最近一期进行还款");
            return
        }else {
            var item = scope.data.planList[period-1];
            if(item.IS_TODO_PAY == null&&item.IS_ADVANCED_PAY == '100000000001'){
                var confirm = popupService.alertPopup("提示","是否要提前还款，提前还款利息正常计算");
                confirm.then(function (res) {
                    if(res){
                        //console.log($stateParams.inst_order_id , period)
                        $state.go('tab.me_repay',{inst_order_id:$stateParams.inst_order_id,repay_period:period})
                    }
                })
            }else {
                $state.go('tab.me_repay',{inst_order_id:$stateParams.inst_order_id,repay_period:period})
            }
        }
    }
}])
/** 我的订单进度 */
.controller("OrderProgressCtrl",["$scope","commonRemoteService","validateService","$stateParams",function(scope,commonRemoteService,validateService,$stateParams){
    scope.data = {};
    //console.log($stateParams.inst_order_id)
    var promise = commonRemoteService.remote('queryOrderProgress.action',{inst_order_id:$stateParams.inst_order_id});
    promise.then(function (res) {
        //console.log(res);
        if(res.result_code == "000"){
            scope.data = res.data;
        }else {
            validateService.showError(res.result_msg)
        }
    })

}])
/** 平台委托服务协议 */
    .controller("OrderAgreementCtrl",["$scope","commonRemoteService","validateService","$stateParams",function(scope,commonRemoteService,validateService,$stateParams){
        scope.data = {};
        //console.log($stateParams.inst_order_id);
        var promise = commonRemoteService.remote('queryCommissionAgreementData.action',{inst_order_id:$stateParams.inst_order_id});
        promise.then(function (res) {
            //console.log(res);
            if(res.result_code == "000"){
                scope.data = res.data;
            }else {
                validateService.showError(res.result_msg)
            }
        })

    }])
/** 还款记录 */
.controller("RepayRecordCtrl",["$scope","commonRemoteService","validateService","$rootScope",function(scope,commonRemoteService,validateService,$rootScope){
    scope.data = {};
    $rootScope.showLoading();
    var promise = commonRemoteService.remote("getMyHavePaidbackCapitalLiquid.action");
    promise.then(function(result){
        $rootScope.hideLoading();
        //console.log(result)
        if('000' == result.result_code){
            scope.data = result.data;
        }else{
            validateService.showError(result.result_msg);
        }
    });
}])
/** 充值画面 */
.controller('RechargeCtrl',["$scope","commonRemoteService","validateService","$rootScope",function ($scope,commonRemoteService,validateService,$rootScope){

    $scope.rechargeForm ={};
    $scope.bfdata = {};
    $scope.hideCapital = true;

    $scope.blur = function(){
        $scope.rechargeForm.amount=$rootScope.formatCurrency($scope.rechargeForm.amount)
        if($scope.rechargeForm.amount == null||$scope.rechargeForm.amount<$scope.data.RECHARGE_MIN_AMT_VIP||isNaN($scope.rechargeForm.amount)){
            $scope.rechargeForm.amount = $scope.data.RECHARGE_MIN_AMT_VIP;
        }
        $scope.rechargeForm.amount =parseFloat($scope.rechargeForm.amount).toFixed(2)-0
    }

    $scope.submit = function(){
        //表单验证
        $scope.err_message = validateService.check($scope.rechargeForm,['amount']);
        //充值金额验证
        $scope.err_message = $scope.err_message==null? parseFloat($scope.rechargeForm.amount) > $scope.data.single_max? "充值金额不能大于"+$scope.data.bankname+"单笔限额" : $scope.err_message : $scope.err_message;
        //充值金额验证
        $scope.err_message = $scope.err_message==null? parseFloat($scope.rechargeForm.amount) < $scope.data.RECHARGE_MIN_AMT_VIP? "充值金额不能小于"+$scope.data.RECHARGE_MIN_AMT_VIP+"元" : $scope.err_message : $scope.err_message;
        // 消息显示
        if($scope.err_message != null){
            validateService.showError($scope.err_message);
            return;
        }
        $scope.blur();
        var param = {
            recharge_amt:$scope.rechargeForm.amount
        }
        //创建充值订单
        $rootScope.showLoading("正在处理充值订单...")
        var promise = commonRemoteService.remote("rechargeOrderAction!rechargeCreate.action",param);
        promise.then(function(result){
            $rootScope.hideLoading()
            //console.log(result)
            if("000" == result.result_code){
                var bfdata = result.data.bfpay_data
                $("#back_url").val(bfdata.back_url)
                $("#data_content").val(bfdata.data_content)
                $("#data_type").val(bfdata.data_type)
                $("#input_charset").val(bfdata.input_charset)
                $("#language").val(bfdata.language)
                $("#member_id").val(bfdata.member_id)
                $("#terminal_id").val(bfdata.terminal_id)
                $("#txn_sub_type").val(bfdata.txn_sub_type)
                $("#txn_type").val(bfdata.txn_type)
                $("#version").val(bfdata.version)
                $("#FormSub").attr("action", bfdata.bf_address);
                //console.log(bfdata)
                $("#FormSub").submit();
            } else {
                validateService.showError(result.result_msg);
            }
        });
    }
    //充值准备数据
    var promise = commonRemoteService.remote("accountAction!rechargeReady.action")
    promise.then(function(result){
        //console.log(result)
        if("000" == result.result_code){
            $scope.data = result.data
        } else {
            validateService.showError(result.result_msg);
        }
    });
}])
/** 我的银行卡 */
.controller('MeBankcardCtrl',["$scope","commonRemoteService","validateService",function($scope,commonRemoteService,validateService){
    var promise = commonRemoteService.remote("accountAction!getBankCardInfo.action");
    promise.then(function(result){
        if('000' == result.result_code){
            $scope.data = result.data;
        }else{
            validateService.showError(result.result_msg);
        }
    });
}])
/** 设置 */
.controller('MeSetCtrl',["$scope","commonRemoteService","validateService","commonService","Cookie","$state",function(scope,commonRemoteService,validateService,commonService,Cookie,$state){
    scope.data = {};
    commonRemoteService.remote('getMyProfile.action').then(function (res) {
        if(res.result_code = "000"){
            //console.log(res)
            scope.data = res.data;
        }else {
            validateService.showError(res.result_msg)
        }
    });
    scope.bindWechat = function (param) {
        var promise = commonRemoteService.remote('bindWechatAccount.action',{is_bind_account:param});
        promise.then(function (res) {
            //console.log(res)
            //console.log(param)
            if(res.result_code == "000"){
                scope.data.is_bind_wechat_account = param;
                validateService.showError(param?'绑定成功':"解绑成功");
            }else {
                validateService.showError(res.result_msg);
            }
        })
    }
    scope.isLogin = false;
    scope.isLogin = commonService.isLogin();
    // 会员登出
    scope.userLogout = function () {
        // 调用后台
        var promise = commonService.userLogout();
        promise.then(function (result) {
            Cookie.destroy(); //清空cookie
            $state.go('tab.login');
        });
    };
}])
/**账户提现画面*/
.controller('WithdrawCtrl',['$rootScope','$scope','$state','validateService','commonRemoteService',function($rootScope,$scope,$state,validateService,commonRemoteService){
    $scope.item = {};
    $scope.times = '';
    //var times = '';
    $rootScope.showLoading()
    commonRemoteService.remote('withdrawReady.action').then(function(result){
        $rootScope.hideLoading()
        if("000" == result.result_code){
            $scope.data = result.data
        } else {
            validateService.showError(result.result_msg);
        }
    });

    $scope.withdrawForm = {}

    $scope.withdrawAll = function() {
        $scope.withdrawForm.amount = $scope.data.balance_amt
    }
    $scope.blur = function(){
        $scope.withdrawForm.amount=$rootScope.formatCurrency($scope.withdrawForm.amount)
        if($scope.withdrawForm.amount == null||$scope.withdrawForm.amount<$scope.data.DRAWINGS_SINGLE_MIN_AMOUNT||isNaN($scope.withdrawForm.amount)){
            $scope.withdrawForm.amount = $scope.data.DRAWINGS_SINGLE_MIN_AMOUNT
        }
        $scope.withdrawForm.amount =parseFloat($scope.withdrawForm.amount).toFixed(2)-0
    }
    $scope.submit = function(){
        //表单验证
        $scope.err_message = validateService.check($scope.withdrawForm,['amount']);
        //提现金额是否超过余额
        $scope.err_message = $scope.err_message==null? parseFloat($scope.withdrawForm.amount) > $scope.data.balance_amt? "提现金额不能超过账户余额" : $scope.err_message : $scope.err_message;
        //提现金额是否大于最小提现金额
        $scope.err_message = $scope.err_message==null? parseFloat($scope.withdrawForm.amount) < $scope.data.DRAWINGS_SINGLE_MIN_AMOUNT? "最小提现金额为"+$scope.data.DRAWINGS_SINGLE_MIN_AMOUNT+"元" : $scope.err_message : $scope.err_message;
        //提现次数是否超过限额
        $scope.err_message = $scope.err_message==null? $scope.data.can_withdraw_count<=0? "每日最大提现次数"+$scope.data.DRAWINGS_DAY_MAX_COUNT+"次" : $scope.err_message : $scope.err_message;
        //提现金额是否超过限额
        $scope.err_message = $scope.err_message==null? parseFloat($scope.withdrawForm.amount) > $scope.data.can_withdraw_amt? ("每日最大提现限额为"+$scope.data.DRAWINGS_DAY_MAX_AMOUNT+"元，今日剩余额度为:"+($scope.data.can_withdraw_amt>0?$scope.data.can_withdraw_amt:0)+"元") : $scope.err_message : $scope.err_message;
        // 消息显示
        if($scope.err_message != null){
            validateService.showError($scope.err_message);
            return;
        }
        $scope.blur()
        var param = {
            withdraw_amt:$scope.withdrawForm.amount,
            tradePassword:$scope.withdrawForm.tradePassword,
            times:$scope.times
        }
        $rootScope.showLoading()
        var promise = commonRemoteService.remote('createWithdrawTran.action',param);
        promise.then(function(result){
            $rootScope.hideLoading()
            if("ERR_CREATE_WITHDRAW_001" == result.result_code){
                //交易密码错误的提示
                $scope.pwd_message = result.result_msg
                validateService.showError($scope.pwd_message);
            }else{

                if("000" == result.result_code) {
                    function fun_submit(){
                        var date1 = new Date();
                        var date2 = new Date(date1);
                        date2.setDate(date1.getDate()+7);
                        $scope.times = date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate()+"  "+date2.getHours()+":"+date2.getMinutes()+":"+date2.getSeconds();
                        // alert(times);
                    }
                    fun_submit();
                    //console.log($scope.times)
                    $state.go('tab.me_withdraw_result',{withdraw_amt:$scope.withdrawForm.amount,times:$scope.times}) //到提现成功画面
                }
                else {
                    validateService.showError("系统繁忙，请稍后再试");
                }
            }
        });
    }
}])
/** 提现成功页面*/
.controller('WithdrawSuccessCtrl',['$scope','$stateParams','$rootScope','commonRemoteService',function ($scope,$stateParams,$rootScope,commonRemoteService) {
    $scope.item = {};
    commonRemoteService.remote('withdrawReady.action').then(function(result){
        $rootScope.hideLoading()
        if("000" == result.result_code){
            $scope.data = result.data
        } else {
            validateService.showError(result.result_msg);
        }
    });
    $scope.withdraw_amt = $stateParams.withdraw_amt;
    $scope.times = $stateParams.times;

}])
/** 交易密码设置 */
.controller('TradePasswordCtrl',["$scope","commonService","commonRemoteService","validateService","$state","$stateParams","$rootScope",function ($scope,commonService,commonRemoteService,validateService,$state,$stateParams,$rootScope){
    $scope.tradePwd = {};
    commonRemoteService.remote("accountAction!authAccountStatus.action").then(function(result){
        if("000" == result.result_code){
            $scope.data = result.data;
        } else {
            validateService.showError(result.result_msg);
        }
    });

    //设置交易密码
    $scope.setPwd = function () {
        // 表单验证
        $scope.err_message = validateService.check($scope.tradePwd,['tradePassword']);
        //交易密码和确认密码是否一致
        $scope.err_message = $scope.err_message==null? $scope.tradePwd.tradePassword  == $scope.tradePwd.confirm_tradePassword ?null:"两次密码输入不一致": $scope.err_message;
        // 消息显示
        if($scope.err_message != null){
            validateService.showError($scope.err_message);
            return;
        }

        $rootScope.showLoading()
        var promise = commonRemoteService.remote("accountAction!tradePasswordSet.action",angular.copy($scope.tradePwd));
        promise.then(function(result){
            $rootScope.hideLoading()
            if("000" == result.result_code){
                $scope.tradePwd = {};
                validateService.showError("设置交易密码成功").then(function (res) {
                    if(res) {
                        if($stateParams.jumpPage==null ||$stateParams.jumpPage == ""){
                            $state.go('tab.me');
                        }else{
                            $state.go($stateParams.jumpPage,$stateParams.param);
                        }
                    }
                })
            } else {
                validateService.showError(result.result_msg);
            }
        });
    }
    // 初始化短信验证码模块
    commonService.smsInit($scope, "phoneCode!modifyTradePwd.action");
    //修改交易密码
    $scope.modifyPwd = function () {
        if($scope.tradePwd.old_tradePassword == null||$scope.tradePwd.old_tradePassword==""){
            validateService.showError("请输入旧交易密码");
            return;
        }
        // 表单验证
        $scope.err_message = validateService.check($scope.tradePwd,['tradePassword','phoneCode']);
        // 消息显示
        if($scope.err_message != null){
            validateService.showError($scope.err_message);
            return;
        }

        $rootScope.showLoading()
        var  promise =commonRemoteService.remote("accountAction!tradePasswordModify.action",angular.copy($scope.tradePwd))
        promise.then(function(result){
            $rootScope.hideLoading()
            if("000" == result.result_code){
                $scope.tradePwd = {};
                validateService.showError("修改交易密码成功").then(function (res) {
                    if(res) {
                        if($stateParams.jumpPage==null ||$stateParams.jumpPage == ""){
                            //认证成功进入账户安全画面
                            $state.go('tab.me');
                        }else{
                            $state.go($stateParams.jumpPage);
                        }
                    }
                })
            } else {
                validateService.showError(result.result_msg);
            }
        });
    }
}])
/** 交易密码重置 */
.controller('ResetTradePasswordCtrl',["$scope","commonService","commonRemoteService","validateService","$state",function ($scope,commonService,commonRemoteService,validateService,$state){
    var promise = commonRemoteService.remote("accountAction!authAccountStatus.action");
    promise.then(function(result){
        if("000" == result.result_code){
            if(!(result.data.certification_vf!=null&& "100000000001" == result.data.certification_vf)){
                validateService.showError("请先进行身份认证");
            }
        } else {
            validateService.showError(result.result_msg);
        }
    });

    $scope.forgetPwd={};
    // 初始化短信验证码模块
    commonService.smsInit($scope, "phoneCode!resetTradePwd.action");
    $scope.submit = function(){
        $scope.err_message = validateService.check($scope.forgetPwd,['idcard','tradePassword','phoneCode'])
        if($scope.err_message!=null){
            validateService.showError($scope.err_message);
            return;
        }
        //进行交易密码重置验证
        var  promise =commonRemoteService.remote("accountAction!tradePasswordReset.action",angular.copy($scope.forgetPwd))
        promise.then(function(data){
            if(data.result_code == "000"){
                validateService.showError("重置交易密码成功").then(function (res) {
                    if(res) $state.go('tab.me')
                })
            }else{
                validateService.showError(data.result_msg)
            }

        });
    }

}])
/** 资金流水 */
.controller('MeMoneyListCtrl',["$scope","commonRemoteService","validateService","$rootScope",function($scope,commonRemoteService,validateService,$rootScope){
    $scope.items = {};

    var scope = $scope.scope = {
        params : {
            page : 1,
            rows : 10
        },
        hasMore : false
    };
    //下拉刷新
    $scope.doRefresh = function() {
        scope.hasMore = false;
        scope.params.page = 1;
        var promise = commonRemoteService.remote("getMyCapitalLiquid.action",scope.params);
        promise.then(function(result){
            if(result.rows.result_code == "000"){
                $rootScope.hideLoading();
                scope.hasMore = result.hasNextPage;
                $scope.items = result.rows.data;
            }else{
                validateService.showError(result.rows.result_msg);
            }
            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    //初始化，进入页面执行一次
    $scope.doRefresh();

    //滑动加载更多
    $scope.doMore = function() {
        scope.params.page = $scope.items==null?1:scope.params.page+1;
        var promise = commonRemoteService.remote("getMyCapitalLiquid.action",scope.params);
        promise.then(function(result){
            if(result.rows.result_code == "000"){
                scope.hasMore = result.hasNextPage;
                if($scope.items!=null){
                    $scope.items = $scope.items.concat(result.rows.data);
                }else{
                    $scope.items = result.data;
                }
            }else{
                validateService.showError(result.rows.result_msg);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };
}])
/** 意见反馈 */
.controller('FeedbackCtrl',["$scope","commonRemoteService","validateService","$state","$ionicPopup",function (scope,commonRemoteService,validateService,$state,$ionicPopup) {
    scope.data = {};

    scope.submit = function () {
        var promise = commonRemoteService.remote('addTMemberProblem.action',{content:scope.data.feedback});
        promise.then(function (res) {
            //console.log(res)
            if(res.result_code = "000"){
                $ionicPopup.alert({
                    title : "温馨提示！",
                    template : "提交成功！谢谢您的宝贵意见！",
                    okText : '确定',
                    okType : 'button-positive'
                }).then(function () {
                    $state.go('tab.me');
                })
            }else {
                validateService.showError(res.result_msg)
            }
        })
    }
}])



