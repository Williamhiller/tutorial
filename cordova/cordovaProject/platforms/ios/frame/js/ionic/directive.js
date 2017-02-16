/**
 * Created by Williamhiler on 2016/11/17.
 */

angular.module('global.directive',[])
//上传图片directive
    .directive('uploadImg', ['$parse','UploadImageService','commonRemoteService','$rootScope', function ($parse,UploadImageService,commonRemoteService,$rootScope) {
        return {
            restrict: 'EA',
            replace : true,
            scope : {
                text : "="
            },
            template : '<input type="file" accept="image/*" capture="camera" name="">',
            link: function(scope, element,attr) {
                element.bind('change', function(){
                    var name = element[0].files[0].name;
                    var type = attr.uploadtype;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        UploadImageService.compress(e.target.result,fileSize)
                            .then(function (result) {
                                var param = {
                                    fileName : name,
                                    uploadType : type,
                                    fileContent : result
                                };
                                $rootScope.showLoading('上传中');
                                commonRemoteService.remote('uploadPictureAction.action',param).then(function (res) {
                                    $rootScope.hideLoading();
                                    if(res.result_code == "000"){
                                        scope.text = "1";
                                    }else {
                                        scope.text = "5";
                                    }
                                });
                            });
                    };
                    reader.readAsDataURL(element[0].files[0]);
                    var fileSize = Math.round(element[0].files[0].size/1024/1024) ; //以M为单位

                });
            }
        };
    }])
    .directive('uploadHead', ['$parse','UploadImageService','commonRemoteService','$rootScope', function ($parse,UploadImageService,commonRemoteService,$rootScope) {
        return {
            restrict: 'EA',
            replace : true,
            scope : {
                text : "="
            },
            template : '<input type="file" accept="image/*" capture="camera" name="">',
            link: function(scope, element) {
                element.bind('change', function(){
                    var name = element[0].files[0].name;
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        UploadImageService.compress(e.target.result,fileSize)
                            .then(function (result) {
                                var param = {
                                    fileName : name,
                                    fileContent : result
                                };
                                $rootScope.showLoading('上传中');
                                commonRemoteService.remote('setMyHeadImg.action',param).then(function (res) {
                                    $rootScope.hideLoading();
                                    if(res.result_code == "000"){
                                        scope.text = res.data.head_img_url;
                                    }else {
                                        validateService.showError(res.result_msg)
                                    };
                                });
                            });
                    };
                    reader.readAsDataURL(element[0].files[0]);
                    var fileSize = Math.round(element[0].files[0].size/1024/1024) ; //以M为单位

                });
            }
        };
    }])
    //输入框清空
    .directive('inputclear', ['safeApply','$timeout',function(safeApply,$timeout) {
        return {
            restrict : 'EA',
            replace : true,
            transclude : true,
            scope : {
                text : '='
            },
            template : '<i ng-click="clear()" ng-show="showClear" class="icon icon-clear f-16"></i>',
            link : function(scope, element, attrs) {
                scope.showClear = false;
                var input = element.parent().find("input");
                function isShow() {
                    if("" != scope.text){
                        scope.showClear = true
                    }else {
                        scope.showClear = false;
                    }
                }
                input.on('input',function () {
                    safeApply(scope,isShow);
                });
                input.on('focus',function () {
                    var target = this;
                    $timeout(function () {
                        // input[0].scrollIntoView(false);
                        target.scrollIntoViewIfNeeded();
                    },100)
                    safeApply(scope,isShow);
                });
                input.on('blur',function () {
                    safeApply(scope,function () {
                        scope.showClear = false;
                    });
                });
                scope.clear = function(){
                    scope.text = "";
                    safeApply(scope,isShow);
                };
            }
        };
    }])
    //没有记录的显示
    .directive('blank',[function () {
        return{
            restrict   : 'EA',
            replace    : true,
            transclude : true,
            scope : {},
            template : '<div class="Blank_page text-center">' +
                            '<img src="frame/images/pic_blank.png">' +
                            '<p class="f-16 l-height2">暂无相关数据</p>' +
                        '</div>'
        };
    }])    
        
    //密码明文和密文
    .directive('eyeicon', function() {
        return {
            restrict : 'EA',
            replace : true,
            transclude : true,
            scope : {
            },
            template : '<i ng-click="showPwd()" class="icon f-18" ng-class="{true:\'icon-passwordon\',false:\'icon-passwordoff\'}[pwdShow]"></i>',
            link : function(scope, element, attrs) {
                scope.pwdShow = false; //默认闭眼
                var text = element.parent().find("input");
                scope.showPwd = function(){
                    scope.pwdShow = !scope.pwdShow;
                    text[0].type = scope.pwdShow? "text":"password";
                }
            }
        };
    })
    //向上滑动显示效果
    .directive('showUp',['$ionicGesture', function($ionicGesture) {
        return {
            restrict : 'EA',
            replace : true,
            transclude : false,
            scope : {
            },
            link : function(scope, element) {
                element.addClass('show-up');
                var height = window.screen.height;
                scope.toggle = function () {
                    var oTop = element.offset().top;
                    if (oTop <= height-40) {
                        element.addClass('show');
                    } else {
                        element.removeClass('show');
                    }
                };
                scope.toggle();
                $ionicGesture.on('scroll',function () {
                    scope.toggle()
                },element.parents('.scroll-content'));
            }
        };
    }])
    //时间倒计时
    .directive('countDown',["$interval",function($interval) {
        return {
            restrict : 'EA',
            replace : true,
            scope : {
                time : '='
            },
            template : '<span class="c-orange" ng-bind="time_text"></span>',
            link : function(scope) {
                var time = parseInt(scope.time);
                $interval(function () {
                    time--;
                    scope.time--
                    var h = parseInt(time/60/60);
                    var m = parseInt((time-h*3600)/60);
                    var s = parseInt((time-h*3600)%60);
                    var arr = [h,m,s];
                    var countDown = arr.map(function (n) {
                        n = n.toString();
                        return n[1] ? n : '0' + n
                    }).join(":");
                    scope.time_text = countDown;
                },1000)
            }
        };
    }])
    //图片懒加载
    .directive('imgLazyLoad',["$interval",function($interval) {
        return {
            restrict : 'EA',
            link : function(scope,element,attr) {
                var img = new Image();
                img.src = attr.lazySrc;
                img.onload = function() {
                    element.attr('src',this.src)
                }
            }
        };
    }]);