/**
 * Created by Williamhiler on 2016/11/4.
 */
angular.module("message.controller",[])
    .controller("MessageCtrl",["$scope","commonRemoteService","$rootScope","validateService","$state",function($scope,commonRemoteService,$rootScope,validateService,$state){

        var scope = $scope.scope = {
            params : {
                page : 1,
                rows : 10
            },
            animation : false,
            hasMore : false
        };
        $scope.data = {};
        $scope.data.showDelete = false;
        $scope.data.showDeleteText = '删除';
        $scope.showDeleteFun = function () {
            $scope.data.showDelete = !$scope.data.showDelete;
            if($scope.data.showDelete){
                $scope.data.showDeleteText = '取消'
            }else {
                $scope.data.showDeleteText = '删除'
            }
        }
        //下拉刷新
        $scope.doRefresh = function() {
            scope.hasMore = false;
            scope.params.page = 1;
            var promise = commonRemoteService.remote("searchProMessage.action",scope.params);
            promise.then(function(result){
                //console.log(result)
                if(result.rows.result_code == "000"){
                    $rootScope.hideLoading();
                    scope.hasMore = result.hasNextPage;
                    $scope.messageList = result.rows.data;
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
            scope.params.page = $scope.messageList==null?1:scope.params.page+1;
            var promise = commonRemoteService.remote("searchProMessage.action",scope.params);
            promise.then(function(result){
                if(result.rows.result_code == "000"){
                    scope.hasMore = result.hasNextPage;
                    if($scope.messageList!=null){
                        $scope.messageList = $scope.messageList.concat(result.rows.data);
                    }else{
                        $scope.messageList = result.data;
                    }
                }else{
                    validateService.showError(result.rows.result_msg);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };
        //删除信息
        $scope.deleteItem = function (item) {
            //console.log(item.MSG_ID)
            var promise = commonRemoteService.remote("deleteProMessage.action",{msg_id:item.MSG_ID});
            promise.then(function (result) {
                if(result.result_code == "000"){
                    $scope.messageList.splice($scope.messageList.indexOf(item), 1);
                }else {
                    validateService.showError(result.result_msg);
                }
            })
        };
        //一键置为已读
        $scope.setAllRead = function () {
            var promise = commonRemoteService.remote("updateAllRead.action");
            promise.then(function (result) {
                if(result.result_code == "000"){
                    $scope.messageList = $scope.messageList.map(function (e) {
                        e.HAS_READ = '100000000001';
                        return e;
                    })
                }else {
                    validateService.showError(result.result_msg);
                }
            })
        };
    }])
    .controller("MessageDetailCtrl",["$scope","$stateParams","commonRemoteService","validateService",function($scope,$stateParams,commonRemoteService,validateService){
        var promise = commonRemoteService.remote("readProMessage.action",{msg_id:$stateParams.msg_id});
        promise.then(function (result) {
            if(result.result_code == "000"){
                $scope.msg = result.data;
            }else {
                validateService.showError(result.result_code);
            }
        })
    }]);

