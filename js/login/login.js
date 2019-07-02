var backid = "main.html";
var backurl = "../" + backid;

//mui.init({
//	beforeback: function() {
//		appPage.loginBack(backid,backurl)
//	}
//});
mui.plusReady(function() {

	initOauth();
//	storage.init();

	backid = appPage.getParam("backid") || "main.html";
	backurl = "../" + backid;

	var btn_login = document.getElementById("btn_login");
	var inpt_username = document.getElementById("inpt_username");
	var inpt_pwd = document.getElementById("inpt_pwd");

//	storageUser = kidstorageuser.getInstance();
	//	inpt_mobile.value = storageUser.UserName;

	//弹出软键盘
	//	var showKeyboard = function() {
	//		if(mui.os.ios) {
	//			var webView = plus.webview.currentWebview().nativeInstanceObject();
	//		    webView.plusCallMethod({"setKeyboardDisplayRequiresUserAction":false});
	//		    setTimeout(function(){
	//		    	storageUser.UserName==''?inpt_mobile.focus():inpt_pwd.focus();
	//		    },100);
	//		} else {
	//			var Context = plus.android.importClass("android.content.Context");
	//		    var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
	//		    var main = plus.android.runtimeMainActivity();
	//		    var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
	//		    imm.toggleSoftInput(0,InputMethodManager.SHOW_FORCED);
	//		    setTimeout(function(){
	//		    	storageUser.UserName==''?inpt_mobile.focus():inpt_pwd.focus();
	//		    },100);
	//		}
	//	};
	//	showKeyboard();

	btn_login.addEventListener("tap", function() {
		//模拟登陆
//		var data = {
//			PlayerId: 1,
//			Mobile: 13800000000,
//			NickName: 'admin',
//			imgurl: "../../images/defuser.jpg",
//			SelfdomSign: '',
//			//cityid:data.CityId
//		}
//
//		storageUser.login(data);
//		storageUser.log();
//		appPage.loginBack(backid, backurl);
//		return;

		if(inpt_username.value.trim() == "") {
			appUI.showTopTip("请输入用户名");
			//mui.toast("请输入手机号");
			//inpt_mobile.focus();
		}  else if(inpt_pwd.value.trim() == "") {
			appUI.showTopTip("请输入密码");
			//mui.toast("请输入密码");
			//inpt_pwd.focus();
		} else {

//			var md5pwd = md5(inpt_pwd.value || "");
			appUI.setDisabled(btn_login);
			request("/login", {
				username: inpt_username.value,
				password: inpt_pwd.value
			}, function(json) {
				appUI.removeDisabled(btn_login);
				if(json.ecode == 1) {

					var data = json.data;
					console.log(JSON.stringify(data));
					//处理登录逻辑
					data.IsLogin = "1";
					localStorage.setItem("user",JSON.stringify(data));
					console.log(JSON.stringify(data));
					console.log("backid:"+backid+" backurl:"+backurl);
					appPage.loginBack(backid, backurl);
				} else {
					mui.toast(json.msg);
				}
			}, true, function() {
				appUI.removeDisabled(btn_login);
			});
		}
	});

	//注册
	document.getElementById("btn_reg").addEventListener("tap", function() {
		openNew("reg.html");
	});

	//忘记密码
	document.getElementById("btn_forgetpwd").addEventListener("tap", function() {
		openNew("forgetPwd.html");
	});
	//手机登录
	document.getElementById("btn_mobilelogin").addEventListener("tap", function() {
		openNew("mobileLogin.html", {
			backid: backid
		});
	});

})