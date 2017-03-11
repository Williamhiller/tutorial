# 1px? 0.5px!

*前一段时间刚开发完一个项目，但总感觉界面样式怪怪的，虽然表面上看起来和设计稿是一样的，可是就是没设计稿那种感觉，而且莫名还有一种山寨的气息，让我感到很郁闷，找来找去终于发现罪魁祸首——border线宽的问题。*

####问题产生的原因

关于设备像素的基础知识，建议去看 [《A pixer is not a pixer is not a pixer》](http://www.quirksmode.org/blog/archives/2010/04/a_pixel_is_not.html)。

简单来说就是手机屏幕分辨率越来越高了，同样大小的一个手机，它的实际物理像素数更多了。现在做移动端开发时一般都要加上一个``<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">``这种，来禁止缩放，这样在不同手机上显示就一样了。这种情况下我们做一个1px的border时，这个1px实际就是css像素，在2倍分辨率的手机上那就是占用了2个设备像素(device pixer)，在3倍尺寸就是占3个设备像素。但是呢，设计师在PS或sketch中进行设计时设计的像素肯定是按设备像素来的(*其实就跟字体一个原理，设计稿字体大小是28px，但实际代码却是14px*)，所以严格来说设计师希望你呈现的那个边框宽度，就是0.5px的css像素。

####解决办法

**1. 利用css3新属性scale**

其实现的关键就是利用before或after伪元素，宽高同时设为200%，然后再缩放0.5，自然就是0.5px了

代码如下：

```

.scale_border {
    positon : relative;
}
.scale_border::after {
    content : "";
    width : 200%;
    height : 200%;
    position : absolute;
    top : 0;
    left : 0;
    border : 1px solid #dedede;
    -webkit-transform : scale(0.5);
            transform : scale(0.5);
    -webkit-transform-origin : 0 0;
            transform-origin : 0 0;
    box-sizing: border-box;
}

```

<br/>

**2. 利用background-image**

如果你问切图直接用背景图可不可以？当然可以，虽说这种方法比较笨吧，但也是一种方法。

但我要说的是另外一种--利用背景渐变linear-gradient来实现，具体代码如下：

```

.bg_border {
    background-image : linear-gradient(0deg,red,red 50%,transparent 50%);
    background-size: 100% 1px;
    background-repeat: no-repeat;
}

```

**分析：**linear-gradient默认方向从上到下，从0deg到50%的地方颜色是边框颜色，然后下边一半颜色就是透明了-没颜色。中间之所以两个50%写在一起，是因为这样就不会有颜色过渡的渐变效果了，看起来更像一条线，泾渭分明；  然后最关键的是下边的background-size: 100% 1px，就是宽度100%，但高度是1px，注意这里的1px自然是css像素了，加上上边的background-image，实际效果就是一半有颜色，一半那不就是0.5px,然后再去掉repeat，就实现了。

同理如果要写border-left或border-right一样的原理，只需改变方向就可以了。

**缺点：** 只能做但方向的border，如果有个按钮要加，而且还有圆角，那就无能为力了



<br/>

**利用rem做单位**

首先对rem还不太了解的同学，请点这里[《web app变革之rem》](https://isux.tencent.com/web-app-rem.html)

简单来讲，为了完美自适应，rem是一个很好的解决方案，原理就是在刚加载的时候用js判断屏幕分辨率，根据不同的分辨率动态为html设置不同font-size大小，设置meta的viewport标签。

如果你觉得麻烦的话，那可以简单一些，直接引用淘宝的flexible.js，看其源代码的话会发现其实很简短，其核心代码就更少了，在这里我仅提取其部分代码来做分析，如果感兴趣请自行百度。

```

var doc = windows.document;
var docEl = doc.documentElement;
var metaEl = doc.createElement('meta');
var devicePixelRatio = window.devicePixelRatio;
var dpr = 0, scale = 0;


if(devicePixelRatio == 1){
    dpr = 1;
}else if (devicePixelRatio == 2){
    dpr = 2;
}else if (devicePixelRatio == 3){
    dpr = 3;
}
scale = 1/dpr;

metaEl.setAttribute('name', 'viewport');
metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
docEl.firstElementChild.appendChild(metaEl);

function refreshRem(){
    var width = docEl.getBoundingClientRect().width;
    if (width / dpr > 540) {
        width = 540 * dpr;
    }
    var rem = width / 10;
    docEl.style.fontSize = rem + 'px';
    flexible.rem = win.rem = rem;
};
refreshRem();

```

解释一下，就是先获取设备缩放比devicePixelRatio；然后根据缩放比来设定viewport的值，这样导致的结果就是无论是哪个设备，1px所表示的永远是1个设备像素，即该设备的最小像素，用法就更简单了


```

//直接使用px就能实现

.rem_border {
    border : 1px solid #dedede;
}

```

**优点：** 目前最优解决方案，兼容性强，即使有导圆角也能轻松应付

**缺点：** 对旧项目改动较大，不易改动



持续测试中～

