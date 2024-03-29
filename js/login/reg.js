mui.init();
mui.plusReady(function() {
	//initOauth();
//	storage.init();

	var btn_sendvalidcode = document.getElementById("btn_sendvalidcode");
	var btn_ok = document.getElementById("btn_ok");
	var inpt_username = document.getElementById("inpt_username");
	var inpt_password = document.getElementById("inpt_password");
	var inpt_mobile = document.getElementById("inpt_mobile");
	var inpt_validcode = document.getElementById("inpt_validcode");
	var ckb_agree = document.getElementById("ckb_agree");

	if(ismobileno(inpt_mobile.value)) {
		appUI.removeDisabled(btn_sendvalidcode);
	}

	//发送验证码
	btn_sendvalidcode.addEventListener("tap", function() {
		if(inpt_mobile.value.trim() == "") {
			appUI.showTopTip("请输入手机号");
			//mui.toast("请输入手机号");
			//inpt_mobile.focus();
		} else if(!ismobileno(inpt_mobile.value)) {
			appUI.showTopTip("手机号格式不正确");
			//mui.toast("手机号格式不正确");
		} else {
			appUI.setDisabled(btn_sendvalidcode);
			//模拟获取验证码
			inpt_validcode.value =(""+Math.random()).substr(2,6);
			appUI.removeDisabled(btn_sendvalidcode);
		}
	});

	//协议勾选
	ckb_agree.addEventListener("tap", function() {
		if(this.checked) {
			appUI.showTopTip("宝宝，同意下服务条款呗");
			//mui.toast("宝宝，同意下服务条款呗");
		}
	});
	//下一步
	btn_ok.addEventListener("tap", function() {
		if(inpt_username.value.trim()==""){
			appUI.showTopTip("请输入用户名");
		}else if(inpt_password.value.trim()==""){
			appUI.showTopTip("请输入密码");
		}else if(inpt_mobile.value.trim() == "") {
			appUI.showTopTip("请输入手机号");
			//mui.toast("请输入手机号");
			//inpt_mobile.focus();
		} else if(!ismobileno(inpt_mobile.value)) {
			appUI.showTopTip("手机号格式不正确");
			//mui.toast("手机号格式不正确");
		} else if(inpt_validcode.value.trim() == "") {
			appUI.showTopTip("请输入验证码");
			//mui.toast("请输入验证码");
			//inpt_pwd.focus();
		} else if(!ckb_agree.checked) { //当前为true点击了为false
			appUI.showTopTip("宝宝，同意下服务条款呗");
			//mui.toast("宝宝，同意下服务条款呗");
		} else {
			appUI.setDisabled(btn_ok);
			request("/reg", {
				mobile: inpt_mobile.value,
				username: inpt_username.value,
				password:inpt_password.value
			}, function(json) {
				appUI.removeDisabled(btn_ok);
				if(json.ecode == 1) {
					//注册成功 打开登录页面
					mui.toast(json.msg);
					mui.back();
				} else {
					appUI.showTopTip(json.msg);
					//mui.toast(json.msg);
				}
			},null,function(){
				appUI.removeDisabled(btn_ok);
			});
		}
	})
	//	//输入手机号
	//	inpt_mobile.addEventListener("keyup", function() {
	//		btnDisabled(false);
	//	})
	//	//手机号失去焦点
	//	inpt_mobile.addEventListener("blur", function() {
	//		btnDisabled(false);
	//	})
	//	//输入验证码
	//	inpt_validcode.addEventListener("keyup", function() {
	//		btnDisabled(false);
	//	})
	//	//验证码失去焦点
	//	inpt_validcode.addEventListener("blur", function() {
	//		btnDisabled(false);
	//	})
	//服务条款
	document.getElementById("servicedesc").addEventListener("tap", function() {
		openNew("../my/myMsgDetail.html", {
			id: 1
		});
	});
});

//function btnDisabled(isShowMsg) {
//	var btn_sendvalidcode = document.getElementById("btn_sendvalidcode");
//	var btn_ok = document.getElementById("btn_ok");
//	var val_mobileinpt = document.getElementById("inpt_mobile").value;
//	var val_validcodeinpt = document.getElementById("inpt_validcode").value;
//	var ckb_agree = document.getElementById("ckb_agree");
//
//	var ck_ok = true,
//		ck_sendvalidcode = true;
//
//	if(val_mobileinpt.length != 11) {
//		if(isShowMsg)
//			appUI.showTopTip("手机号码长度不正确");
//		//mui.toast("手机号码长度不正确");
//		ck_ok = false;
//		ck_sendvalidcode = false;
//	} else if(!ismobileno(val_mobileinpt)) {
//		if(isShowMsg)
//			appUI.showTopTip("手机号码格式不正确");
//		//mui.toast("手机号码格式不正确");
//		ck_ok = false;
//		ck_sendvalidcode = false;
//	} else if(val_validcodeinpt.length != 6) {
//		if(isShowMsg)
//			appUI.showTopTip("验证码长度不正确");
//		//mui.toast("验证码长度不正确");
//		ck_ok = false;
//	}
//	if(ck_ok) {
//		appUI.removeDisabled(btn_ok);
//	} else {
//		appUI.setDisabled(btn_ok);
//	}
//
//	if(ck_sendvalidcode && btn_sendvalidcode.innerHTML.indexOf("重新") == -1) {
//		appUI.removeDisabled(btn_sendvalidcode);
//	} else {
//		appUI.setDisabled(btn_sendvalidcode);
//	}
//
//}