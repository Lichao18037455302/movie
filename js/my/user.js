mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: { //下拉刷新
			callback: pulldownRefresh,
			style: mui.os.android ? "circle" : "default"
			//auto: true
		}
	},
	beforeback: function() {
		appPage.closeLogin();
	}
});

mui.plusReady(function() {
	localstorageUser = localstorageUserFunc();
	//initPage();
	//	document.getElementById("test").addEventListener("tap", function() {
	//		openNew("test.html");
	//	});
	//监听退出,重新绑定检查登录事件
	window.addEventListener("loginOut", function(r) {
		setData();
	});
	window.addEventListener('initPage', function(event) {
		var pwc = plus.webview.currentWebview();
		console.log(pwc.id + "不是新开的");
		localstorageUser = localstorageUserFunc();
		setData();
	});
	window.addEventListener('refreshPage', function(event) {
		var pwc = plus.webview.currentWebview();
		localstorageUser = localstorageUserFunc();
		console.log(pwc.id + "刷新页面"+"，localstorageUser.id："+localstorageUser.id);
		//刷新页面重新下载头像
		if(localstorageUser&&localstorageUser.id){
			plus.downloader.createDownload(APP_DOMAIN+"/download?id="+localstorageUser.id, {
				filename: "_doc/headimg/"
			}, function(d, status) {
				console.log(JSON.stringify(d));
				console.log(status);
				var user = localStorage.getItem("user");
				var userObj = JSON.parse(user);
				if(status == 200) {
					plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
						console.log("下载头像成功：" + entry.toLocalURL());
//						self.refreshImgUrl(entry.toLocalURL()); //路径刷新为本地图片
						userObj.imgurl = entry.toLocalURL();
						localStorage.removeItem("user");
						localStorage.setItem("user",JSON.stringify(userObj));
					});
				} else {
					userObj.imgurl = "";
					localStorage.removeItem("user");
					localStorage.setItem("user",JSON.stringify(userObj));
				}
				initPage();
			}).start();
		}else{
			initPage();
		}
	});
//	checkMsg();
//	setInterval(function() {
//		checkMsg();
//	}, 5000);
});
//下拉刷新具体业务实现
function pulldownRefresh() {
	loadData();
}

function initPage() {
	localstorageUser = localstorageUserFunc();
	setData();
	//appPage.closeLogin();
}

function setData() {
	//获取登录后的用户信息
	var json = {};
	json.data = {
		UId: localstorageUser.id,
		NickName: localstorageUser.nickname || "点我写昵称",
		ImgUrl: localstorageUser.imgurl||"../../images/defuser.jpg",
		Signature: localstorageUser.signature || "点我写签名",
		IsLogin: localstorageUser.IsLogin
	};

	render("#user_warp", "user_view", json);
	//注册监听登录判断事件
	mui("body").off("tap", ".ckecklogin"); //清除原来事件
	mui("body").on("tap", ".ckecklogin", function() {
		var backid = this.getAttribute("data-loginbackid");
		var loginevent = this.getAttribute("data-loginevent");
		if(!localstorageUser.IsLogin) { //未登录	
			if(backid) {
				appPage.openLogin({
					backid: backid
				});
			}

		} else { //已登录
			if(loginevent)
				eval(loginevent);
			//openNew(backid.replace("my/",""))
		}
	});
}

function loadData() {
	console.log("localstorageUser.IsLogin："+localstorageUser.IsLogin);
	if(!localstorageUser.IsLogin) {
		appPage.endPullRefresh(true);
		return;
	}
	appPage.endPullRefresh();
	setData();

}
var loginEvent = {
	editSignature: function() {
		openNew("myEdit.html", {
			field: "signature",
			value: localstorageUser.Signature,
			backid: "my/user.html"
		});
	},
	editNickName: function() {
		openNew("myEdit.html", {
			field: "nickname",
			value: localstorageUser.NickName,
			backid: "my/user.html"
		});
	},
	myMsg: function() {
		openNew("myMsg.html");
	},
	myMatch: function() {
		openNew("myMatch.html");

	},
	myFriends: function() {
		openNew("myFriends.html");
	},
	myInfo: function() {
		openNew("myInfo.html");
	},
	mySetting: function() {
		openNew("mySetting.html");
	},
	upload_headimg: function() {
		openNew("uploadImg.html");
	}
}

function checkMsg() {
	if(localstorageUser.UId > 0) {
		//		request('/Player/getPlayerNoReadNotify', {
		//			playerid: storageUser.UId
		//		}, function(r) {
		//			r.code == 0 ? document.getElementById("msgStatus").setAttribute('class', 'redbadge') : document.getElementById("msgStatus").setAttribute('class', '')
		//		}, false, function() {}, false);
	}
}

//波浪线
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

requestAnimFrame = (function() {
	return function(callback) {
		setTimeout(callback, 18);
	};
})();

//初始角度为0  
var step = 90;
//定义三条不同波浪的颜色  
var lines = [
	"rgba(112,153,249, 0.5)",
	"rgba(112,153,249, 0.7)",
	"rgba(112,153,249, 0.5)"
];

function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	step++;
	//画3个不同颜色的矩形  
	for(var j = lines.length - 1; j >= 0; j--) {
		ctx.fillStyle = lines[j];
		//每个矩形的角度都不同，每个之间相差45度  
		var angle = (step + j * 90) * Math.PI / 180;
		var deltaHeight = Math.sin(angle) * 50 + 30;
		var deltaHeightRight = Math.cos(angle) * 50 + 30;
		ctx.beginPath();
		ctx.moveTo(0, canvas.height / 2 + deltaHeight);
		ctx.bezierCurveTo(canvas.width / 2, canvas.height / 2 + deltaHeight, canvas.width / 2, canvas.height / 2 + deltaHeightRight, canvas.width, canvas.height / 2 + deltaHeightRight);
		ctx.lineTo(canvas.width, canvas.height);
		ctx.lineTo(0, canvas.height);
		ctx.lineTo(0, canvas.height / 2 + deltaHeight);
		ctx.closePath();
		ctx.fill();
	}
	requestAnimFrame(loop);
}
loop();