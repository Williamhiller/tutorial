# 关于text-align你知道多少？

*项目中有一个段落需要两端对齐，本以为text-align:justufy就可以了，结果发现在火狐浏览器中居然无效，一度以为是兼容性问题（后来发现是自己写法问题），一口气研究了个遍，特在此分享一下*

**关于段落的属性**
1. text-indent : 首行文字缩进，值可以是各种符合规范的值如px,em,rem甚至%号,cm,mm等；不过有一个巧妙的用处就是可以是负值,适当的运用可以实现“悬挂缩进”的效果，一般制作协议页面时用的较多
1. text-align : left | center | right | justify |inherit 文本属性对其属性，控制整个段落
1. text-decoration : none 去掉下划线  || underline 加上下划线 || line-through 加上删除线
1. text-transform（控制字母的大小写）
	* captilize（文本中的每个单词以大写字母开头）
	* uppercase（仅有大写字母）
	* dowercase（仅有小写字母）
1. letter-spacing（字符间隔）：用PX等定义字符间的固定空间（允许使用负值）	
1. word-spacing（字间隔）：length 
1. white-space（处理元素内的空白）：
	* pre（保留空白、保留换行符、不允许自动换行）
	* nowrap（合并空白、忽略换行符、不允许自动换行）
	* pre-wrap（保留空白、保留换行符、允许自动换行） 
	* pre-line（合并空白、保留换行符、允许自动换行）
1.  line-height（行高）：
	* number（设置数字，此数字会与当前的字体尺寸相乘来设置行间距） 
	* length（用PX等设置固定的行间距)
	* %（基于当前字体尺寸的百分比行间距）
1. Direction（方向）：ltr（默认。文本方向从左到右）、rtl（文本方向从右到左） 	
1. word-break: normal（使用浏览器默认的换行规则。）|break-all（允许在单词内换行。）|keep-all（只能在半角空格或连字符处换行。）

IE 
1. text-justify : auto |inter-word | newspaper | distribute | distribute-all-lines | inter-ideograph
	* auto：允许浏览器用户代理确定使用的两端对齐法则 ；
	* inter-word：通过增加字之间的空格对齐文本。该行为是对齐所有文本行最快的方法。它的两端对齐行为对段落的最后一行无效 ；
	* newspaper ：通过增加或减少字或字母之间的空格对齐文本。是用于拉丁文字母表两端对齐的最精确格式
	* distribute：处理空格很像newspaper，适用于东亚文档。尤其是泰国
	* distribute-all-lines：两端对齐行的方式与distribute相同，也同样不包含两段对齐段落的最后一行。适用于表意字文档
	* inter-ideograph：为表意字文本提供完全两端对齐。他增加或减少表意字和词间的空格

<br/>
####text-indent
段落首行缩进，事实上可以负缩进以实现“悬挂缩进”的效果。什么是“悬挂缩进”，其实html的ul和ol标签的list-style其实是自带这种效果的，但一般我们样式重置都会首先将这种给重置掉，导致ul和ol和div一个效果了，不过使用时可以自己设置。但是ul和ol也有一个缺点，就是不能自定义，只能使用提供的属性里的，像阿拉伯数字，罗马数字等，假如你想使用一个自定义的就没什么办法了，例如 1） 2） 3）等，你怎么实现，所以使用text-indent是一个不错的选择，但需要注意的是使用时负值有可能会导致首字母超出界外，所以一般要配合padding-left来使用。

<br/>
####text-align
**left** 左对齐 如果不设置任何属性的话则默认左对齐，但子元素其实默认时inherit继承属性的，即如果父元素如果有设置则继承父元素属性
**center** 剧中对齐 与html5的<center>标签还是有一些区别的，<center>标签是将整个元素都居中，而center 属性仅仅是将文字居中
**rught** 右对齐 
**justify** 左右对齐，什么意思呢，用过photoshop的都知道，里边关于文字就有一个左右对齐，这样从视觉上比较好看一些
**inherit** 继承，默认属性，但整个文档应该是默认左对齐

**巧妙用法** 不要以为text-align仅仅是处理文字的，恰当使用可以起到意想不到的效果，如：布局，虽说text-align不能处理div但inline-block是可以的，分析一下并不难理解inline-block虽说有块元素的特性它事实依然是行内元素，只是有固定形态的行内元素而已。
具体用法：可以将子元素设置为display:inlne-block属性，然后使用text-align:center,就能达到居中的效果，再也不用什么margin: 0 auto了，也许你会问，这有意义吗，不一样吗，但如果我让你将两个图片居中呢，三个呢？css实现的方法千千万万，但这是一个思路，一个相对简便的方法，当然这样做也有它的缺点，就是inline-block属性的话会导致里边元素的默认布局方式跟你预想的不太一样，这就是inline-block 的介绍了，有兴趣的可以自己研究
移动端布局：justify,利用justify可以实现左右对齐的效果，将元素全都设置成inline-block属性，它会自动左右对齐，实现各种表格的效果，但一般会有一个问题，就是最后一行的问题，可以最后一行末尾添加一个空元素，设置为宽度100%就可以了。利用的好的话甚至可以实现部分flex的效果