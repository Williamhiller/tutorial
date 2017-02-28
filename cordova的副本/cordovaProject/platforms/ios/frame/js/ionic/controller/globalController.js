/**
 * Created by Williamhiler on 2016/11/4.
 */
angular.module('global.controller', ['home.controller','credit.controller','me.controller','user.controller','message.controller'])
// 定义全局变量
.run(["$rootScope","$location",function ($rootScope,$location){
    $rootScope.subPageHref = function(url){
        //console.log()
    };
}])