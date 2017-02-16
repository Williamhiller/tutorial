/**
 * Created by Williamhiler on 2016/11/4.
 */
angular.module('user.service',[])
    // 会员注册
    .factory('registerService',['$http','$q',function($http,$q) {
        return {
            // 手机号码唯一性校验
            mobileVerify: function (registerForm) {
                // 声明延后监控
                var deffered = $q.defer();
                $http.post("mobileVerify.action",$.param(registerForm)).success(function(result){
                    deffered.resolve(result);
                }).error(function(data){
                    deffered.reject(result);
                })
                return deffered.promise;
            },
            // 注册是否强制要求邀请码
            inviteCodeRequired: function () {
                // 声明延后监控
                var deffered = $q.defer();
                $http.post("userRegister!inviteCodeRequired.action").success(function(result){
                    deffered.resolve(result);
                }).error(function(data){
                    deffered.reject(result);
                })
                return deffered.promise;
            },
            // 邀请码校验
            inviteVerify: function (registerForm) {
                // 声明延后监控
                var deffered = $q.defer();
                $http.post("inviteVerify.action",$.param(registerForm)).success(function(result){
                    deffered.resolve(result);
                }).error(function(data){
                    deffered.reject(result);
                })
                return deffered.promise;
            },
            // 注册
            register: function (registerForm) {
                // 声明延后监控
                var deffered = $q.defer();
                $http.post("userRegister.action",$.param(registerForm)).success(function(result){
                    deffered.resolve(result);
                }).error(function(data){
                    deffered.reject(result);
                })
                return deffered.promise;
            }
        };
    }])

    // 忘记密码
    .factory('forgetPwdService',['$http','$q',function($http,$q) {
        return {
            // 找回密码
            findPwd: function (findPwdForm) {
                // 声明延后监控
                var deffered = $q.defer();
                $http.post("findPwd.action",$.param(findPwdForm)).success(function(result){
                    deffered.resolve(result);
                }).error(function(data){
                    deffered.reject(result);
                })
                return deffered.promise;
            },
        };
    }])

    // session
    .factory('Cookie',['$cookieStore',function ($cookieStore)  {
        this.create = function (sessionId, userId, userRole) {
            $cookieStore.put('sessionId',sessionId);
            $cookieStore.put('userId',userId);
            $cookieStore.put('userRole',userRole);
        };
        this.destroy = function () {
            $cookieStore.remove('sessionId');
            $cookieStore.remove('userId');
            $cookieStore.remove('userRole');
        };
        return this;
    }]);
