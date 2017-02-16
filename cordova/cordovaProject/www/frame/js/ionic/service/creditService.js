/**
 * Created by Williamhiler on 2016/11/4.
 */
angular.module('credit.service',[])

//上传图片
.factory('UploadImageService',["$q",function ($q){  //上传图片

    var getCompressRate = function (allowMaxSize,fileSize) { //计算压缩比例
        var compressRate = 1;

        if(fileSize/allowMaxSize > 4){
            compressRate = 0.5;
        } else if(fileSize/allowMaxSize >3){
            compressRate = 0.6;
        } else if(fileSize/allowMaxSize >2){
            compressRate = 0.7;
        } else if(fileSize > allowMaxSize){
            compressRate = 0.8;
        } else{
            compressRate = 0.9;
        }
        return compressRate;
    };
    //利用canvas压缩图片并返回 base64格式
    this.compress = function (res,fileSize) {
        // console.log(res);
        var derferred = $q.defer();
        var img =new Image(),
            maxW =640 ; //设置最大宽度
        img.onload = function () {
            var cvs = document.createElement( 'canvas'),
                ctx = cvs.getContext( '2d');
            if(img.width > maxW) {
                img.height *= maxW / img.width;
                img.width = maxW;
            }
            cvs.width = img.width;
            cvs.height = img.height;
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            ctx.drawImage(img, 0, 0, img.width, img.height);

            var compressRate = getCompressRate(2,fileSize); //最大1M
            var dataUrl = cvs.toDataURL('image/png', compressRate);
            // document.body.appendChild(cvs);
            derferred.resolve(dataUrl);
        }
        img.src = res;
        return derferred.promise;
    };

    return this;
}]);