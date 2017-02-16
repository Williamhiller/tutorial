/**
 * 获取参数对象
 */
function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1].split('#')[0];
	}
	return vars;
}

/**
 * 获取参数值
 */
function getUrlVar(name) {
    return getUrlVars()[name];
}

// 渠道ID
var channel = getUrlVar('channel');
// UID
var uid = getUrlVar('uid');
// 邀请码
var invite = getUrlVar('invite');

/**
 * “渠道ID”不为空时，初始化渠道Cookie
 */
if (typeof(channel) != undefined && channel != null && channel != "") {
	//removeCookie(channel);

	var saveDuration = new Date();
	var bSecure = false;

	saveDuration.setDate(saveDuration.getDate() + 30);
	if(window.location.protocol.indexOf("https") != -1){
        bSecure = true;
    }
	
	// 拼装YYY-M-D HH:MM:SS格式时间
	var nowDate,strDate;  
	nowDate = new Date();  
	strDate = nowDate.getFullYear() + "-";	//取年份
	strDate = strDate + (nowDate.getMonth() + 1) + "-";	//取月份
	strDate += nowDate.getDate() + " ";		//取日期
	strDate += nowDate.getHours() + ":";	//取小时
	strDate += nowDate.getMinutes() + ":";	//取分
	strDate += nowDate.getSeconds();		//取秒

	var sValue = strDate + ";" + uid;
	setCookie(channel, sValue, saveDuration, null, "/", bSecure);
}

/**
 * “邀请码”不为空时，初始化 邀请码Cookie
 */
if (typeof(invite) != undefined && invite != null && invite != "") {
	//removeCookie(channel);

	var saveDuration = new Date();
	var bSecure = false;

	saveDuration.setDate(saveDuration.getDate() + 1);
	if(window.location.protocol.indexOf("https") != -1){
        bSecure = true;
    }

	setCookie("inviteCode", invite, saveDuration, null, "/", bSecure);
}