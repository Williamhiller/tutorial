/**
 * Created by Williamhiler on 2016/11/4.
 */

// 目录：  validateService：7  popupService：188  commonService：244  commonRemoteService：358 Cookie:410  UploadImageService:440
angular.module('global.service',['home.service','credit.service','user.service','me.service'])
    .factory('validateService',['$timeout','$ionicPopup',function($timeout,$ionicPopup){
        var format = {
            has: {
                special: /[。~\+\\\/\?\|:\.<>{}()';="]/,
                number: /[0-9]+/,
                letter: /[a-zA-Z]+/,
                lowerletter: /[a-z]+/,
                userName: /^[\u4E00-\u9FA5]{2,5}$/,
                idcard: /(^\d{15}$)|(^\d{17}([0-9]|x|X)$)/
            }
        };
        var validate={
            mobileNo:{
                formats: ["require", "phoneFormat"],
                messages: ["手机号不能为空", "请输入正确的手机号码"]
            },
            tel : {
                formats: ["telFormat"],
                messages: ["请输入正确的电话号码,区号+电话号码,如:021-4009201239"]
            },
            password: {
                formats: ["require", "passwordFormat"],
                messages: ["密码不能为空", "密码需为6-16位字母和数字的组合"]
            },
            phoneCode: {
                formats: ["require", "phoneCodeFormat"],
                messages: ["验证码不能为空", "验证码必须是6位数字"]
            },
            invitationCode: {
                formats: ["require"],
                messages: ["邀请码不能为空"]
            },
            tradePassword:{
                formats: ["require", "tradePasswordFormat"],
                messages: ["交易密码不能为空", "密码需为6-16位字母和数字的组合"]
            },
            amount:{
                formats: ["require", "amountFormat"],
                messages: ["金额不能为空", "金额格式不正确"]
            },
            userName:{
                formats: ["require", "userNameFormat"],
                messages: ["姓名不能为空", "请填写真实姓名"]
            },
            idcard:{
                formats: ["require", "idcardFormat"],
                messages: ["身份证号不能为空", "请填写正确的身份证号"]
            },
            bankcard:{
                formats: ["require", "bankcardFormat"],
                messages: ["银行卡号不能为空", "请填写正确的银行卡号"]
            },
            bankId:{
                formats: ["require"],
                messages: ["请选择所属银行"]
            },
            email:{
                formats: ["require", "emailFormat"],
                messages: ["邮箱不能为空", "请填写正确的邮箱地址"]
            },
            method:{
                baseCheck:function(checkValue,formats,message){
                    for(var i=0;i<formats.length;i++){
                        //动态调用验证
                        if (typeof this[formats[i]] == "function"){
                            if(!this[formats[i]](checkValue)){
                                return message[i];
                            }
                        }
                    }
                    return null;
                },
                require :function(val){
                    return val!=null&&val!="";
                },
                phoneFormat : function(val){
                    var reg = /^(((12[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(147))+\d{8})$/;
                    return val.match(reg)!=null
                },
                telFormat : function(val){
                    var reg = /^\d{2,4}-?\d{3,10}$/;
                    return val.match(reg)!=null;
                },
                passwordFormat : function(val){
                    var reg01 = format.has.special ; //特殊字符
                    var reg02 = format.has.number ;  //数字
                    var reg03 = format.has.letter;  //英文字母
                    return (val.length>=6&&val.length<=16)&& (val.match(reg01)!=null||val.match(reg02)!=null)&&(val.match(reg02)!=null||val.match(reg03)!=null)&&(val.match(reg01)!=null||val.match(reg03)!=null);
                },
                phoneCodeFormat : function(val){
                    return val.length == 6;
                },
                tradePasswordFormat :function(val){
                    var reg01 = format.has.special ; //特殊字符
                    var reg02 = format.has.number ;  //数字
                    var reg03 = format.has.letter;  //英文字母
                    return (val.length>=6&&val.length<=16)&& (val.match(reg01)!=null||val.match(reg02)!=null)&&(val.match(reg02)!=null||val.match(reg03)!=null)&&(val.match(reg01)!=null||val.match(reg03)!=null);
                },
                amountFormat : function(val){
                    val = val.toString();
                    var reg = /^-?([1-9]\d*|[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
                    return val.match(reg)!=null
                },
                userNameFormat : function(val){
                    return val.match(format.has.userName)!=null;
                },
                idcardFormat : function(val){
                    return val.match(format.has.idcard)!=null;
                },
                bankcardFormat : function(val){
                    // 只接受空格、数字和破折号
                    if ( /[^0-9 \-]+/.test(val)) {
                        return false;
                    }
                    var nCheck = 0,
                        nDigit = 0,
                        bEven = false,
                        n, cDigit;

                    val = val.replace(/\D/g, "");

                    // 最小和最大长度验证
                    if (val.length < 13 || val.length > 19) {
                        return false;
                    }
                    for (n = val.length - 1; n >= 0; n--) {
                        cDigit = val.charAt(n);
                        nDigit = parseInt(cDigit, 10);
                        if ( bEven ) {
                            if ((nDigit *= 2) > 9) {
                                nDigit -= 9;
                            }
                        }
                        nCheck += nDigit;
                        bEven = !bEven;
                    }

                    return (nCheck % 10) === 0;
                },
                emailFormat : function(val){
                    var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    return val.match(reg);
                }
            }
        }
        return {
            check: function (validateForm,validateGroup) {
                for (var i = 0; i < validateGroup.length; i++) {
                    //var _validate = validateGroup[i]
                    var checkName = validateGroup[i];
                    var checkValue = validateForm[checkName];
                    var checkValidate = validate[checkName];
                    var formats = checkValidate.formats;
                    var message = checkValidate.messages
                    var err_message = validate.method.baseCheck(checkValue,formats,message);
                    if(err_message!=null){
                        return err_message;
                    }
                }
            },
            showError:function(err_message){
                if(err_message!=null&&err_message!=""){
                    var alertPopup = $ionicPopup.alert({
                        title: '温馨提示!',
                        template: err_message,
                        okText : '确定',
                        okType : 'button-positive'
                    });
                    // alertPopup.then(function (res) {
                    //     // console.log(res)
                    // });
                    $timeout(function() {
                        alertPopup.close(); //1秒后关闭弹出
                    }, 5000);
                    $timeout(function() {
                        document.onclick = function () {
                            alertPopup.close();
                            document.onclick = null
                        }
                    },100);
                    return alertPopup;
                }
            }
        }
    }])
    // 弹出样式
    .factory('popupService',['$ionicPopup',function ($ionicPopup) {
        return {
            alertPopup : function (title,content) {
                var alertPopup = $ionicPopup.alert({
                    title : title,
                    template : content,
                    okText : '确定',
                    okType : 'button-positive'
                });
                return alertPopup;
            },
            confirm : function (title,content) {
                var confirmPopup = $ionicPopup.confirm({
                    title: title,
                    template: content,
                    cancelText: '取消',
                    cancelType: '',
                    okText: '确定',
                    okType: 'button-positive'
                });
                return confirmPopup;
            },
            show : function () {
                var showPopup = $ionicPopup.show({
                    title : "温馨提示！",
                    subTitle : "",
                    template : '<input type="password" ng-model="data.data" maxlength="20">',
                    buttons : [
                        {
                            text : "取消"
                        },
                        {
                            text : "确定",
                            type : "button-positive",
                            onTap: function(e) {
                                if (!$scope.data.data) {
                                    // 不允许用户关闭，
                                    e.preventDefault();
                                } else {
                                    return $scope.data.data;
                                }
                            }
                        }
                    ]
                });
                return showPopup;
            }
        }
    }])
    // 共通Service
    .factory('commonService',['$http','$q','$interval','$timeout','$cookieStore','$ionicPopup','validateService','$rootScope',function($http,$q,$interval,$timeout,$cookieStore,$ionicPopup,validateService,$rootScope) {
        return {
            // 检查是否登录
            isLogin: function () {
                // 声明延后监控
                if($cookieStore.get('userId') != null){
                    return true;
                }else {
                    $http.post($rootScope.domain + "isEcbmLogin.action?time="+Math.random()).success(function(res){
                        if(res.result_code == "000"&&res.data!=null){
                            $cookieStore.put('userId',res.data);
                            return true;
                        }
                    })
                }
                return false;
            },
            // 用户登出
            userLogout: function () {
                // 声明延后监控
                var deffered = $q.defer();
                $http.post($rootScope.domain + "userLogout.action",null,null).success(function(data){
                    deffered.resolve(data);
                }).error(function(data){
                    deffered.reject(data);
                })
                return deffered.promise;
            },
            /**
             * 初始化短信验证码模块
             *
             * @param scope   ：$scope对象（必须）
             * @param smsUrl  ：验证码发送URL（必须）
             */
            smsInit: function (scope, smsUrl) {
                scope.sms = {};
                scope.sms.text		 = "获取验证码";	// 按钮文字
                scope.sms.count		 = 60;			// 当前剩余秒数
                scope.sms.isDisabled = true;		// 是否允许获取验证码
                scope.sms.isSend	 = false;		// 是否获取过短信验证码
                scope.sms.smsUrl   	 = smsUrl;		// 验证码发送URL
                scope.sms.mobileNo   = null;		// 接收验证码手机号码
                scope.sms.voiceSms   = "100000000002";	// 非语音短信(100000000002)；语音短信(100000000001)

                scope.smsSend = function(voiceSms, mobileNo){
                    // 是否允许获取
                    if (scope.sms.isDisabled) {
                        if (voiceSms != null && voiceSms != "" && voiceSms != undefined) {
                            scope.sms.voiceSms = voiceSms;
                        }

                        scope.sms.isDisabled = false;
                        //console.log($.param({"mobile_no": mobileNo, "voice_sms": scope.sms.voiceSms}));
                        $http.post($rootScope.domain + scope.sms.smsUrl, $.param({"mobile_no": mobileNo, "voice_sms": scope.sms.voiceSms})).success(function(result){
                            //console.log(result)
                            if (result != null && result != undefined) {
                                if (!result.error) {
                                    if (result.countDown != null && result.countDown != undefined) {
                                        scope.sms.count = result.countDown;
                                    }

                                    scope.sms.text = "重新获取(" + scope.sms.count +")";

                                    var time = null;
                                    // 停止并初始化定时器，防止多次执行
                                    if (time != null) {
                                        $interval.cancel(time);
                                        time = null;
                                    }

                                    time = $interval(function(){
                                        scope.sms.count --;
                                        scope.sms.text = "重新获取("+scope.sms.count +")";
                                        if(scope.sms.count == 0 ){
                                            scope.sms.text		 = "获取验证码";	// 按钮文字
                                            scope.sms.count		 = 60;			// 当前剩余秒数
                                            scope.sms.isDisabled = true;		// 是否允许获取验证码

                                            $interval.cancel(time);
                                        }
                                    }, 1000);

                                    // 接口是否发送
                                    if (!result.send) {
                                        validateService.showError(result.msg);
                                    } else {
                                        // 如果是语音短信，提示
                                        if ("100000000001" == voiceSms) {
                                            validateService.showError("验证码将通过语音播报（本服务不会产生额外费用，请放心接听）");
                                        }
                                    }

                                    scope.sms.mobileNo = result.mobileNo;
                                    scope.sms.isSend  = true;	// 是否获取过短信验证码
                                } else {
                                    validateService.showError(result.msg);
                                    scope.sms.isDisabled = true;
                                }
                            } else {
                                scope.sms.isDisabled = true;
                            }
                        }).error(function(result){
                            validateService.showError("获取验证码出错，请联系客服");
                            scope.sms.isDisabled = true;
                        });
                    } else {
                        // 如果是语音短信，提示
                        if ("100000000001" == voiceSms) {
                            validateService.showError("请耐心等待" + scope.sms.count + "秒后，再重新获取");
                        }
                    }
                }

                // 停止并初始化定时器
                if (typeof time !='undefined' && time != null) {
                    $interval.cancel(time);
                    time = null;
                }
            }
        }
    }])
    // 共通后台调用Service
    .factory('commonRemoteService', ['$http', '$q','$rootScope', function($http, $q,$rootScope) {
        // 调用远程接口
        this.remote = function(url, paramForm){
            var url = $rootScope.domain + url;
            // 声明延后监控
            var deffered = $q.defer();
            var param = typeof paramForm == 'object' ? $.param(paramForm) : null;
            $http.post(url, param).success(function(result){
                deffered.resolve(result);
                // console.log(result)
            }).error(function(result){
                deffered.reject(result);
            })
            return deffered.promise;
        };
        //判断账户投资准备状态并跳转到相应画面
        this.authAccountState = function(state,toState,toParams){
            var  promise =this.getAuthAccountStatus()
            promise.then(function(data) {
                if('000' == data.result_code ){
                    var authData = data.data;
                    //银行卡未进行
                    if(!('100000000001'==authData.backcard_vf)){
                        //console.log({jumpPage:toState.name,param:toParams})
                        state.go("tab.credit_bindBankcard",{jumpPage:toState.name,param:toParams})
                    }
                    //交易密码未设置
                    else if(!('100000000001'==authData.tradepassword_vf)){
                        state.go("tab.me_tradePassword",{jumpPage:toState.name,param:toParams})
                    }
                    else{
                        toState.data.authAccount = false;
                        state.go(toState,toParams)
                    }
                }else{
                    validateService.showError(data.result_msg);
                }
            });
        };
        //获取账户投资准备状态
        this.getAuthAccountStatus = function(){
            //声明延后监控
            var deffered  = $q.defer();
            $http.post($rootScope.domain + "accountAction!authAccountStatus.action").success(function(data){
                deffered.resolve(data);
            }).error(function(data){
                deffered.reject(data);
            })
            return deffered.promise;
        }
        return this;
    }])
    //禁止乱使用$apply ，防止报错
    .factory('safeApply', [function($rootScope) {
        return function(scope, fn) {
            var phase = scope.$root.$$phase;
            if(phase == '$apply' || phase == '$digest') {
                if (fn) {
                    scope.$eval(fn);
                }
            } else {
                if (fn) {
                    scope.$apply(fn);
                } else {
                    scope.$apply();
                }
            }
        }
    }]);
