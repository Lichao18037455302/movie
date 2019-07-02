//api连接前缀
var APP_DOMAIN = 'http://172.20.10.9:8080/muiProject';
var APP_NAME="muiProject";
//为true输出日志
var debug = true;









//页面回弹
var sw = document.getElementsByClassName(".mui-scroll-wrapper.scroll");
if(sw) {
	mui('.mui-scroll-wrapper.scroll').scroll();
}



/**
 * 登录后缓存中的用户信息
 * */
var localstorageUser;
var localstorageUserFunc = function(){
	var obj={};
	var userStr = localStorage.getItem("user");//用户信息
	if(userStr){
		obj = JSON.parse(userStr);
	}
	return obj;
}

//ui设置
var appUI = {
	showWaiting: function() {
		plus.nativeUI.showWaiting();
	},
	closeWaiting: function() {
		plus.nativeUI.closeWaiting()
	},
	setDisabled: function(self) {
		self.setAttribute("disabled", "disabled");
	},
	removeDisabled: function(self) {
		self.removeAttribute("disabled");
	},
	countDown: function(date) {
		if(!date) {
			var obj = {
				day: 0,
				hour: 0,
				minute: 0,
				second: 0
			};
			return obj;
		}

		var arydates = new Array();
		arydates = date.split(' ')[0].split('-');
		var arytimes = new Array();
		arytimes = date.split(' ')[1].split(':');
		var date1 = new Date(arydates[0], parseInt(arydates[1]) - 1, arydates[2], arytimes[0], arytimes[1], arytimes[2]);

		var timediff = Math.floor(date1.getTime() - new Date().getTime()) / 1000;

		if(timediff < 0) {
			var obj = {
				day: 0,
				hour: 0,
				minute: 0,
				second: 0
			};
			return obj;
		}

		var days = Math.floor(timediff / 86400);
		timediff -= days * 86400;
		var hours = Math.floor(timediff / 3600) % 24;
		timediff -= hours * 3600;
		var minutes = Math.floor(timediff / 60) % 60;
		timediff -= minutes * 60;
		var seconds = Math.floor(timediff % 60);

		var obj = {
			day: days,
			hour: hours+days*24,
			minute: minutes,
			second: seconds
		};
		return obj;
	},
	showTopTip: function(msg) { //头部显示提示信息
		if(msg && msg != "") {
			var tip = document.getElementById("toptip");
			var haveTip = tip != undefined;
			if(haveTip) {
				tip.setAttribute("class", "showend");
			} else {
				tip = document.createElement("div");
				tip.id = "toptip";
				var node;
				if(document.body.children[0]) {
					node = document.body.children[0];
					document.body.insertBefore(tip, node); //插入到body第一个元素之前
				} else {
					document.body.appendChild(tip);
				}
			}
			tip.innerText = msg;
			tip.setAttribute("class", "show");
			setTimeout(function() {
				tip.setAttribute("class", "showend");
			}, "3000");
		}
	}

}

//页面对象
var appPage = {
	//获取页面参数
	getParam: function(name) {
		var currPage = plus.webview.currentWebview();
		if(mui.os.plus) {
			//log(currPage.id + "的全部参数=" + JSON.stringify(currPage));
			if(currPage.info)
				return currPage.info[name] || null;
			else
				return null;
		} else {
			return null;
		}
	},
	//关闭当前页
	close: function() {
		var currPage = plus.webview.currentWebview();
		plus.webview.close(currPage);
	},
	//关闭当前页，并跳转到指定页
	closeAndBackUrl: function(url, param) {
		var currPage = plus.webview.currentWebview();
		plus.webview.close(currPage);
		openNew(url, param);
	},
	registerCheckLoginEvent: function() { //需检测登录状态并绑定事件的地方
		this.initCheckLoginEvent(); //初始化检测登录事件	

		//var ckpageid=["my/user.html","","","","",""];

	},
	initCheckLoginEvent: function() { //初始化检测登录事件	
		var self = this;
		mui("body").off("tap", ".ckecklogin"); //清除原来事件
		mui("body").on("tap", ".ckecklogin", function() {
			var backid = this.getAttribute("data-loginbackid");
			var loginevent = this.getAttribute("data-loginevent");
			var localstorageUser=localstorageUserFunc();
			if(!localstorageUser.IsLogin) { //未登录	
				if(backid) {
					self.openLogin({
						backid: backid
					});
				}

			} else { //已登录
				if(loginevent)
					eval(loginevent);
				//openNew(backid.replace("my/",""))
			}
		});
	},
	closeLogin: function() { //验证登录的页，window initpage事件里要检测关闭登录页
		var _login = plus.webview.getWebviewById("login/login.html");
		var _mobileLogin = plus.webview.getWebviewById("login/mobileLogin.html");
		var _reg = plus.webview.getWebviewById("login/reg.html");
		var _setPwd = plus.webview.getWebviewById("login/setPwd.html");
		var _forgetPwd = plus.webview.getWebviewById("login/forgetPwd.html");
		var needClose = _login || _mobileLogin || _reg || _setPwd || _forgetPwd;

		if(needClose) {
			//setTimeout(function() {
			if(_login) {
				_login.close();
				console.log("关闭了:_login");
			}
			if(_mobileLogin) {
				_mobileLogin.close();
				console.log("关闭了:_mobileLogin");
			}
			if(_reg) {
				_reg.close();
				console.log("关闭了:_reg");
			}
			if(_setPwd) {
				_setPwd.close();
				console.log("关闭了:_setPwd");
			}
			if(_forgetPwd) {
				_forgetPwd.close();
				console.log("关闭了:_forgetPwd");
			}

			//}, 1000);
		}

	},
	openLogin: function(param) { //打开登录页
		openNew("../login/login.html", param);
	},
	loginBack: function(backid, backurl) { //登录成功，执行跳转或刷新页面操作
		var localstorageUser= localstorageUserFunc();
		if(localstorageUser.IsLogin) {
			var backpage = plus.webview.getWebviewById(backid);
			console.log("backid=" + backid + " backurl" + backurl);
			if(backpage) { //存在，先刷新
				console.log("存在:" + backurl)
				mui.fire(backpage, 'refreshPage', {
					comepage: "login"
				});
			} else {
				console.log("不存在" + backurl)
			}
			//页面刷新完，执行跳转或重新打开
			if(backid == "my/user.html") {
				mui.back();
			} else {
				console.log("不存在打开我:" + backurl)
				openNew(backurl, {
					comepage: "login"
				});
			}
			mui.fire(plus.webview.getWebviewById("my/user.html"), 'refreshPage');
		}
	},
	closeAllPage: function(backid, ckprevpage) { //退出登录，关闭所有打开的二级页面，main下打开的二级除外

		var allpage = plus.webview.all(),
			pageid, str, currpage = plus.webview.currentWebview();
		ckprevpage = ckprevpage || false; //是否检测前一页，如果关闭时候是前一页，延迟关闭，否则会导致未打开新页面，就已关闭前一页，打开页面也会失败
		for(var i = 0; i < allpage.length; i++) {
			pageid = allpage[i].id;
			console.log("webview" + i + ": " + pageid);

			if(pageid == "HBuilder" || pageid == "cn.kayou110.kidapp") {
				//alert(pageid)
			} else if(pageid == "index/home.html" || pageid == "main.html") {

			} else if(pageid == "pk/pk.html" || pageid == "tool/tool.html" || pageid == "my/user.html" || pageid == "bbs/bbs.html" || pageid == "bbs/bbsIndex.html" || pageid == "bbs/bbsChannel.html") {
				console.log("刷新了：" + pageid);
				mui.fire(plus.webview.getWebviewById(pageid), 'refreshPage');
			} else {
				console.log("关闭了：" + pageid);
				allpage[i].close();
			}
		}
	},
	imgInit: function() { //图片加载
		var url, wh, arr, w, h, isok, isdefuserimg, cls, whstr, src, model;
		mui(".loadthumb").each(function() {
			cls = this.getAttribute("class") || "";
			isok = cls.replace(/\s/g, '').length != 0 && cls.indexOf("loadok") != -1;
			isdefuserimg = cls.replace(/\s/g, '').length != 0 && cls.indexOf("defuserimg") != -1;
			if(isok)
				return;
			this.setAttribute("onerror", "javascript:this.src='../../images/nopic.jpg';");

			url = this.getAttribute("data-url");
			if(isdefuserimg && url.trim() == "") {
				this.src = "../../images/defuser.jpg";
				return;
			} else if(url.trim() == "") {
				this.src = "../../images/nopic.jpg";
				return;
			}
			wh = this.getAttribute("data-wh");
			model = this.getAttribute("data-model") || "m_mfit";
			arr = wh.split(",");
			w = arr[0];
			h = arr[1];
			whstr = "", src = "";
			if(w != "") {
				whstr += ',w_' + w;
			}
			if(h != "") {
				whstr += ',h_' + h;
			}
			if(whstr == "") {
				src = url;
			} else if(url.indexOf(".aliyuncs.com") != -1) {
				if(w != "" && h != "") {//表示固定尺寸
					model = 'm_pad';
				}
				src = url + '?x-oss-process=image/resize,' + model + whstr;
			} else {
				src = url;
			}
			this.setAttribute("onload", "javascript:appPage.imgLoadCallback(this,'" + cls + "');");
			this.src = src;
			console.log("," + w + "," + h + " " + this.src)
		});
	},
	imgLoadCallback: function(obj, cls) {
		//alert(cls);
		obj.setAttribute("class", cls.replace("loadthumb", "loadok")); //移除缩略图处理样式，添加处理完成样式
	},
	imgPreviewInit: function() { //图片预览初始化
		mui(".preview").each(function() {

		});
	},
	endPullRefresh: function(stopup, id) { //上拉加载、下拉刷新动画结束
		//stopup 上拉加载
		//stopdown 下拉刷新
		//是否重置插件
		//id 容器id
		if(id == undefined) //容器id
			id = "pullrefresh";

		setTimeout(function() {
			//停止下拉刷新
			mui('#' + id).pullRefresh().endPulldownToRefresh(true);
			//重置
			mui('#' + id).pullRefresh().refresh(true);
			if(stopup != undefined) { //不为空表示，页面包含 上拉加载事件
				//停止上拉加载
				mui('#' + id).pullRefresh().endPullupToRefresh(stopup);
			}

		}, 1000);
	},
	enablePullRefresh: function(enable, id) { //禁用、启用上拉加载、下拉刷新
		if(id == undefined) //容器id
			id = "pullrefresh";
		if(enable) { //禁用
			//mui('#' + id).pullRefresh().endPulldown(true);
			mui('#' + id).pullRefresh().disablePullupToRefresh(); //禁用上拉加载			
		} else { //启用
			mui('#' + id).pullRefresh().enablePullupToRefresh(); //启用上拉加载
			mui('#' + id).pullRefresh().refresh(true);
		}
	}
};

//公共js文件

var PAY_DOMAIN = ''

/**
 * 打印日志
 */

//function log(data) {
//	if(debug) {
//		if(typeof(data) == "object") {
//			console.log(JSON.stringify(data)); //console.log(JSON.stringify(data, null, 4));
//		} else {
//			console.log(data);
//		}
//	}
//}

/**
 * @description 调试用的时间戳
 * @author suwill
 * @param {none} 不需要参数
 * @example mklog()
 */
function mklog() {
	var date = new Date(); //新建一个事件对象
	var seperator1 = "/"; //日期分隔符
	var seperator2 = ":"; //事件分隔符
	var month = date.getMonth() + 1; //获取月份
	var strDate = date.getDate(); //获取日期
	var ss = date.getSeconds(); //获取秒
	if(month >= 1 && month <= 9) { //判断月份
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	if(ss >= 0 && ss <= 9) {
		ss = "0" + ss;
	}
	var ms = date.getMilliseconds();
	if(ms >= 10 && ms <= 100) {
		ms = '0' + ms;
	} else if(ms >= 0 & ms <= 9) {
		ms = '00' + ms;
	}
	var currentdate = ('2' + date.getYear() - 100) + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + ":" + ss + "'" + ms;
	//	var currentdate = date.getHours() + seperator2 + date.getMinutes() + ":" + ss + "'" + ms;

	return currentdate + '|';
}
/**
 * @description 返回所有窗口的艾迪
 * @author suwill
 * @param {none} 不需要参数
 * @example mkwv();
 */
function mkwv() {
	var wvs = plus.webview.all(); //循环显示当前webv
	var t1 = "|debug:当前共有" + wvs.length + "个webview\n";
	var t2 = "";
	for(var i = 0; i < wvs.length; i++) {
		t2 += "|webview" + i + "|id:" + wvs[i].id + "|@url:" + wvs[i].getURL().substr(82) + '\n';
	}
	return t1 + t2;
}

var waitingStyle = {
	style: "black",
	color: "#FF0000",
	background: "rgba(0,0,0,0)",
	loading: {
		icon: "../../images/loading.png",
		display: "inline"
	}
}

/**
 * @description 新开窗口
 * @param {URIString} target  需要打开的页面的地址
 * @param {Object} parm 传递的对象
 * @param {Boolean} autoShow 是否自动显示
 * @example openNew({URIString});
 * */
function openNew(target, parm, autoShow) {
	var currPageId = plus.webview.currentWebview().id;
	var id = "main.html"; //除了一级目录，其它目录id组成结构为：二级文件夹/页面.html
	if(currPageId != undefined) {
		var sp_xg = target.split("/");
		if(sp_xg.length == 3) //target结构为 ../二级文件夹/页面.html,表示跨文件夹打开页面
		{
			id = sp_xg[1] + "/" + sp_xg[2];
		} else if(sp_xg.length == 2) { //target结构为 二级文件夹/页面.html，表示html下一级目录打开页面
			id = target;
		} else { //同级打开页面，需从currpageid中拿取二级文件夹名
			var curr_sp_xg = currPageId.split("/");
			id = curr_sp_xg[0] + "/" + sp_xg[0];
		}
	}
	var isAutoShow = autoShow || true;
	console.log("currPageId=" + currPageId + " target=" + target + " id=" + id + " parm=" + JSON.stringify(parm) + " isAutoShow=" + isAutoShow);
	mui.openWindow({
		url: target,
		id: id,
		show: {
			autoShow: isAutoShow, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'pop-in',
			duration: 200
		},
		waiting: {
			autoShow: true,
			options: waitingStyle
		},
		extras: {
			info: parm
		}
	})
}
//var b=md5('13644656698+123123');
//var a=md5.hex('13644656698+123123');
//log(a);
//log(b);

function md5sign(parm) {
	var signstr = "";
	for(var p in parm) {
		signstr += "+" + parm[p];
	}
	signstr = signstr.replace("+", "");
	//log(signstr);
	var md5str = md5(signstr);
	return md5str;
}
/**
 * @description 获取数据
 * @param {URIString} method  需要请求数据的接口地址
 * @param {Object} parm 提交的参数
 * */
function request(method, parm, callback, showwait, errcallback, completecallback,shownetmsg) {
	showwait = showwait == undefined ? false : showwait; //若需要显示等到，传递true
	shownetmsg = shownetmsg == undefined ? true : shownetmsg;
	if(showwait)
		appUI.showWaiting();
	mui.ajax(APP_DOMAIN + method, {
		data: parm,
		dataType: 'json', //要求服务器返回json格式数据
		type: 'GET', //HTTP请求类型，要和服务端对应，要么GET,要么POST
		timeout: 60000, //超时时间设置为6秒；
		beforeSend: function() {
			console.log(mklog() + '【AJAX:-->】【' + method + '】【P=' + JSON.stringify(parm) + '】');
			setRequestMsg("加载中...");
		},
		success: function(data) {
//			alert(method+data)
			console.log(mklog() + '【AJAX:OK!】' + method + '】【响应：' + JSON.stringify(data) + '】');
			if(data) {
				setRequestMsg("");
				console.log(mklog() + '【AJAX:OK!】【' + method + '】【合法数据：' + JSON.stringify(data) + '】');
				callback(data);
			} else {
				setRequestMsg("服务器繁忙,请稍后再试");
			}
		},
		error: function(xhr, type, errorThrown) { //失败，打一下失败的类型，主要用于调试和用户体验
			console.log(mklog() + '【AJAX:ERR!】【' + method + '】错误');
			console.log(xhr.responseText + " " + xhr.status + " " + xhr.statusText)
			if(showwait)
				appUI.closeWaiting();
			console.log(xhr.status)
			console.log(mklog() + '【AJAX:ERR】【' + method + '】错误T:' + type + '|H:' + errorThrown);
			if(type == 'timeout' || type == 'abort') {
				setRequestMsg("请求超时：请检查网络");
				if(shownetmsg)
					mui.toast("请求超时：请检查网络：" + type)
			} else {
				setRequestMsg("服务器累了");
				if(shownetmsg)
					mui.toast("服务器累了：" + type)
			}
			if(errcallback) {
				errcallback();
			}
		},
		complete: function() {
			//setRequestMsg("");
			console.log(mklog() + '【AJAX:END】【' + method + '】【命令执行完成】');
			if(showwait)
				appUI.closeWaiting();
			if(completecallback){
				completecallback();
			}
		}
	}); //ajax end
} //获取数据结束
function setRequestMsg(msg) {
	var arr = mui(".nodata");
	if(arr) {
		for(var i = 0; i < arr.length; i++) {
			arr[i].innerText = msg;
		}
	}
}
/**
 * @description 获取数据
 * @param {String} payType  支付类型微信还是支付宝
 * @param {Object} parm 提交的参数
 * */
function getPayData(payType, parm, callback) {
	//	log(JSON.stringify(parm))
	mui.ajax(PAY_DOMAIN + payType, {
		data: parm,
		dataType: 'json', //要求服务器返回json格式数据
		type: 'GET', //HTTP请求类型，要和服务端对应，要么GET,要么POST
		timeout: 5000, //超时时间设置为3秒；
		beforeSend: function() {
			console.log(mklog() + '【AJAX:-->】【U=' + PAY_DOMAIN + payType + '】');
			console.log(mklog() + '【AJAX:-->】【P=' + JSON.stringify(parm) + '】');
		},
		success: function(data) {
			//			log(mklog() + '【AJAX:OK!】【响应：' + JSON.stringify(data) + '】');
			if(data.result == 0) {

				callback(data);
			} else {
				console.log(mklog() + '【接口提示：】' + data.detail);
				mui.toast('温馨提示：' + data.detail)
			}
			//核心写在这里
		},
		error: function(xhr, type, errorThrown) { //失败，打一下失败的类型，主要用于调试和用户体验
			console.log(mklog() + '【AJAX:ERR】-|T:' + type + '|H:' + errorThrown);
			if(type == 'timeout' || type == 'abort') {
				mui.toast("请求超时：请检查网络")
			}
		},
		complete: function() {
			console.log(mklog() + '【AJAX:END】【命令执行完成】');
		}
	}); //ajax end
} //获取数据结束

/**
 * @description 根据模板渲染指定节点
 * @param {NodeSelector} selector 要插入的节点选择器
 * @param {String} tpl 需要渲染模板的名称
 * @param {Object} data 传入的阿贾克斯回来的数据
 * @param {Boolean} type 仅在上拉时为真
 * */
function render(selector, tpl, data, type) {
	type = arguments[3] || false;
	//	log('Render:[D:' + selector + '|M:' + tpl + '|T:' + type + '|D:' + JSON.stringify(data).length)
	var elem = document.querySelector(selector);
	var html = template(tpl, data);
	if(type) {
		elem.innerHTML += html;
	} else {
		elem.innerHTML = html;
	}
}
/**
 * @description 为Array扩展contains方法
 * @param {String} str 需要是否已经在数组中存在的那个值
 * @example if(Arr.contains('str')); //返回true||false
 * */
Array.prototype.contains = function(str) {
	var i = this.length;
	while(i--) {
		if(this[i] === str) {
			return true;
		}
	}
	return false;
}
/*替换空格*/
　
String.prototype.trim = function() {　　
	return this.replace(/(^\s*)|(\s*$)/g, "");　　
}　　
String.prototype.ltrim = function() {　　
	return this.replace(/(^\s*)/g, "");　　
}　　
String.prototype.rtrim = function() {　　
	return this.replace(/(\s*$)/g, "");　　
}

/*是否为手机号*/
function ismobileno(num) {
	var mobile = num;
	var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
	var isPhone = /^(?:(?:0\d{2,3})-)?(?:\d{7,8})(-(?:\d{3,}))?$/;;

	//如果为1开头则验证手机号码  
	if(mobile.substring(0, 1) == 1) {
		if(!isMobile.exec(mobile) && mobile.length != 11) {
			return false;
		} else {
			return true;
		}
	} else {

		return false;
	}
	return true;
}

/**
 * @description 短信验证倒计时
 * @param {String} o 绑定的对象
 */
var wait = 60;

function time(o) {
	if(wait == 0) {

		o.removeAttribute("disabled");
		//o.classList.remove('mui-disabled');
		o.innerHTML = "获取验证码";
		wait = 60;
	} else {
		o.setAttribute("disabled", true);
		//o.classList.add('mui-disabled');
		o.innerHTML = "重新发送(" + wait + ")";
		wait--;
		setTimeout(function() {
			time(o)
		}, 1000)
	}
}

/**
 * @description 检查支付通道
 * @param {Object} pc 需要被检查的支付通道
 * @example checkPaymentChannels({Object});
 * @example {"channel":{"id":"wxpay","description":"微信","serviceReady":true}
 * */
function checkPaymentChannels(pc) {

	if(!pc.serviceReady && pc.serviceReady != undefined) {
		var txt = null;
		switch(pc.id) {
			case 'alipay':
				txt = '检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？';
				break;
			default:
				txt = '系统未安装“' + pc.description + '”服务，无法使用' + pc.description + '支付';
				break;
		}
		console.log(txt)
		mui.toast(txt)
	}
}
///**
// * @description 加密订单供生成订单号用
// * @param {Array} o 需要加密的商城基本信息pBase数组
// * @example sunHomeOrderTobase({Array});
// * */
function sunHomeOrderTobase64(o) {
	//	log('加密订单获取到的数组：' + JSON.stringify(o))
	var tArr = []
	for(var i = 0; i < o.length; i++) {
		var t = {
			"itemId": parseInt(o[i].itemId),
			"itemName": o[i].itemName.toString(),
			"unitPrice": parseFloat(o[i].unitPrice),
			"itemCount": parseInt(o[i].itemCount)
		}
		tArr.push(t)
	}
	var b = new Base64()
	return b.encode(JSON.stringify(tArr))
}
/**
 * @description 获取格式化之后的当前时间
 * */
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if(month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
		" " + date.getHours() + seperator2 + date.getMinutes() +
		seperator2 + date.getSeconds();
	return currentdate;
}
//保留两位小数
function stringtoDecimal2(x) {
	var f = parseFloat(x);
	if(isNaN(f)) {
		return false;
	}
	var f = Math.round(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if(rs < 0) {
		rs = s.length;
		s += '.';
	}
	while(s.length <= rs + 2) {
		s += '0';
	}
	return s;
}

//
///*showAPI配置参数*/
//var appid = "19297"
//var sign = "cf606a68a01f45d196b0061a1046b5b3"
//var baseUrl = "https://route.showapi.com/582-2?"
//
//
//// 获取当前时间 yyyyMMddHHmmss
//function getDataStr(){
//	var date = new Date();
//	var year = date.getFullYear();
//	var mouth = date.getMonth() + 1;
//	var day = date.getDate();
//	var hour = date.getHours();
//	var minute = date.getMinutes();
//	var second = date.getSeconds();
//	if(mouth < 10){ /*月份小于10  就在前面加个0*/
//		mouth = String(String(0) + String(mouth));
//	}
//	if(day < 10){ /*日期小于10  就在前面加个0*/
//		day = String(String(0) + String(day));
//	}
//	if(hour < 10){ /*时小于10  就在前面加个0*/
//		hour = String(String(0) + String(hour));
//	}
//	if(minute < 10){ /*分小于10  就在前面加个0*/
//		minute = String(String(0) + String(minute));
//	}
//	if(second < 10){ /*秒小于10  就在前面加个0*/
//		second = String(String(0) + String(second));
//	}
//	
//	var currentDate = String(year) + String(mouth) + String(day) + String(hour) + String(minute) + String(second);
//	log('currentDate = ' + currentDate);
//	return currentDate;
//}

function plusIsInstalled(id) {
	if(id === 'qihoo' && mui.os.plus) {
		return true;
	}
	if(mui.os.android) {
		var main = plus.android.runtimeMainActivity();
		var packageManager = main.getPackageManager();
		var PackageManager = plus.android.importClass(packageManager)
		var packageName = {
			"qq": "com.tencent.mobileqq",
			"weixin": "com.tencent.mm",
			"sinaweibo": "com.sina.weibo"
		}
		try {
			return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
		} catch(e) {}
	} else {
		switch(id) {
			case "qq":
				var TencentOAuth = plus.ios.import("TencentOAuth");
				return TencentOAuth.iphoneQQInstalled();
			case "weixin":
				var WXApi = plus.ios.import("WXApi");
				return WXApi.isWXAppInstalled()
			case "sinaweibo":
				var SinaAPI = plus.ios.import("WeiboSDK");
				return SinaAPI.isWeiboAppInstalled()
			default:
				break;
		}
	}
}