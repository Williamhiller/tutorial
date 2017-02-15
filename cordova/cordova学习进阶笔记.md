http://blog.csdn.net/gisxy/article/details/19571245

####安装

1.  安装nodejs https://nodejs.org

2.  安装Cordova CLI      **npm install -g cordova** Mac安装失败的话加上sudo

3. 安装java JDK

4. 安装Android SDK

####创建项目

cordova create hello com.example.hello HelloWorld

cordova create<工程路径><包名><工程名>

####插件的使用和安装

cordova plugin search bar code 查看插件列表

**例如：** cordova plugin add cordova-plugin-device  （设备API）

**删除插件：**cordova plugin rm

**插件列表：**cordova plugin ls

 **插:(常用)**

1. device: 获取设备硬件和软件信息

1. device-orientation:获取设备手持方向-电子罗盘

1. console:Xcode控制台打印调试

7. contacts:管理手机通讯录

7. splashscreen:实现全屏和添加程序启动界面（可以用X-code自带的）

7. statusbar:手机顶部栏



**使用示例**

安装ngCordova，或直接下载ng-cordova.js http://ngcordova.com/docs/plugins/device/

```

$ionicPlatform.ready(function (){

    var device = $cordovaDevice.getPlatform();

})

```

```

document.addEventListener("deviceready",function (){

    var device = $cordovaDevice.getPlatform();

},false)

```

####Icon & LaunchImage

**Icon**

* 29pt: 1@x 2@x 3@x

* 40pt: 2@x 3@x

* 57pt: 1@x 2@x

* 60pt: 2@x 3@x



**LaunchImage**

* iPhone Portrait ios5-6: 

    1. 1@x-320\*480(iPhone3) 

    1. 2@x-640\*960(iPhone4) 

    1. Retina-640\*1136(iPhone5)



* iPhone Portrait ios8-9: 

    1. HD5.5-1242\*2208(iPhone6P)  

    1. HD4.7-750\*1334(iPhone6)



* iPhone Landscape ios8-9: 

    1. HD5.5-2208\*1242

####外部参考

1. whitelist:  https://github.com/apache/cordova-plugin-whitelist/blob/master/README.md#content-security-policy

1. 使用插件: https://www.joshmorony.com/using-cordova-plugins-in-ionic-2-with-ionic-native/



 
