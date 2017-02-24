###Phonegap与cordova

PhoneGap 被 Adobe 收购了，但是剥离了核心代码贡献给 Apache Software Foundation，Apache 将这个项目命名为Cordova ，也就是说 PhoneGap 是基于 Cordova 的。实际使用中cordova插件更多一些，所以使用cordova。

<br/>

###安装

1.  安装nodejs https://nodejs.org

2.  安装Cordova CLI      **npm install -g cordova**  Mac安装失败的话加上sudo

3. 安装java JDK

4. 安装Android SDK

<br/>

###创建项目

cordova create hello com.example.hello HelloWorld

cordova create<工程路径><包名><工程名>

<br/>

###打包

**添加平台:** cordova platform add ios

**构建项目(打包):** cordova build

**项目文件位置:** 项目文件夹>platforms>ios>xxx.xcodeproj

<br/>

###配置

**config.xml**文件

1. feature是插件配置，会自动生成

1. Icon和LaunchImage(首屏画面)可以在这配置，也可以在xcode中配置(建议)

1.  进入首页，也可以在CDVAppdelegate.m中

``<content src="index.html" />``

``self.viewController.startPage = @"index.html" ``

1. ``<allow-intent href="*" />`` 配置可访问地址 URLS (不配置无法现实网络图片)

``<access origin="*" />``  配置网络请求地址(发送请求，调用接口)

``<allow-navigation href="*" />`` 配置可以访问并跳转的地址（很少用，可跳转地址）

```

<allow-intent href="http://*/*" />
<allow-intent href="https://*/*" />
<allow-intent href="tel:*" />
<allow-intent href="sms:*" />
<allow-intent href="mailto:*" />
<allow-intent href="geo:*" />
<allow-intent href="itms:*" />
<allow-intent href="itms-apps:*" />
```

```

<!-- 图片 网络请求等 -->
<access origin="http://google.com" />
<access origin="https://google.com" />
<!-- 可访问谷歌子域 maps.google.com -->
<access origin="http://maps.google.com" />

<!-- 所有的子域 google.com -->
<access origin="http://*.google.com" />

<!-- 允许来自谷歌的网络图片 -->
<access origin="content:///*" />

<!-- Don't block any requests -->
<access origin="*" />
```

```

<!-- Allow links to example.com -->
<allow-navigation href="http://example.com/*" />
```

<br/>
###插件的使用和安装

cordova plugin search bar code 查看插件列表（会跳转进入官网）

**例如：** cordova plugin add cordova-plugin-device  （设备API）

**删除插件：**cordova plugin rm

**插件列表：**cordova plugin ls

**插件:(常用)**

1. device: 获取设备硬件和软件信息

1. device-orientation:获取设备手持方向-电子罗盘

1. console:Xcode控制台打印调试

7. contacts:管理手机通讯录

7. splashscreen:实现全屏和添加程序启动界面（可以用X-code自带的）

7. statusbar:手机顶部栏



**statusbar插件:** 安装后在配置文件中配置初始状态

```

<preference name="StatusBarOverlaysWebView" value="true" />
<preference name="StatusBarStyle" value="lightcontent" />
<preference name="StatusBarBackgroundColor" value="#000" />
```

**在项目中调用方法**

不同插件参考官方文档( 下边以device示例)

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

###Icon & LaunchImage 基本切图尺寸参考

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

###外部参考

1. whitelist:  https://github.com/apache/cordova-plugin-whitelist/blob/master/README.md#content-security-policy

1. http://blog.csdn.net/gisxy/article/details/19571245

1. 使用插件: https://www.joshmorony.com/using-cordova-plugins-in-ionic-2-with-ionic-native/



