var _path = "",
	_cropper,
	_bitmapPath = "_doc/headimg/",
	_bitmapSuffix = "jpeg",
	_headimgname = "",
	dirpath = "";
var osshost = 'http://192.168.10.11:8080/muiProject';
mui.init({
	beforeback: function() {
		appPage.closeLogin();
	}
});
mui.plusReady(function() {
//	storage.init();
	localstorageUser=localstorageUserFunc();
//	console.log(JSON.stringify(localstorageUser));
	var imgurl = localstorageUser.imgurl;
	var photodiv = document.getElementById("photo");
	var btn_save = document.getElementById("save");
	photodiv.innerHTML = "<img src='" + imgurl + "' class='defimg'/>";
//	storageUser.log();
	console.log(imgurl);
	document.getElementById("opensel").addEventListener("tap", function() {
		actionSheet();
	});
	btn_save.addEventListener("tap", function() {
		if(_path == "") {
			mui.toast("先选择照片吧");
			actionSheet();
		} else {
			plus.nativeUI.showWaiting("上传图片...");
			uploadMe();
		}
	});
	window.addEventListener('initPage', function(event) {
		var pwc = plus.webview.currentWebview();
		console.log(pwc.id + "不是新开的");
		initPage();
		//appPage.closeLogin();
	});
	window.addEventListener('refreshPage', function(event) {
		var pwc = plus.webview.currentWebview();
		console.log(pwc.id + "刷新页面");
		initPage();
		//appPage.closeLogin();
	});
	//appPage.closeLogin();
});

function actionSheet() {
	if(mui.os.plus) {
		var a = [{
			title: "拍照"
		}, {
			title: "从手机相册选择"
		}];
		plus.nativeUI.actionSheet({
			cancel: "取消",
			buttons: a
		}, function(b) {
			switch(b.index) {
				case 0:
					break;
				case 1:
					getImage();
					break;
				case 2:
					galleryImg();
					break;
				default:
					break;
			}
		})
	}
}

function getImage() {
	var c = plus.camera.getCamera();
	c.captureImage(function(e) {
		console.log("准备拍照3");
		plus.io.resolveLocalFileSystemURL(e, function(entry) {
			compressImage(entry.toLocalURL());
		}, function(e) {
			mui.toast("获取图片失败");
		});
	}, function(s) {
		mui.toast("获取图片失败...");
	},{
        filename: _bitmapPath,
        index: 1
	});
}

function galleryImg() {
	plus.gallery.pick(function(path) {
		compressImage(path);
	}, function(err) {
		var code = err.code; // 错误编码
		var message = err.message; // 错误描述信息
		//$.toast(message)
	}, {
		filter: "image"
	});

};

function compressImage(path) {
	console.log(path);
	var suffix = path.split('.')[1].toLowerCase();
	if(suffix != "png") {
		_bitmapSuffix = "jpeg";
	} else {
		_bitmapSuffix = "png";
	}

	console.log(suffix + "," + _bitmapSuffix)

	document.getElementById("save").setAttribute("style", "");
	var self = this;
	var img = document.createElement("img");
	img.style.display = "none";
	img.id = "img";
	img.src　 = path;
	_path = path;
	plus.nativeUI.showWaiting("读取中...");
	var _date = new Date();
	var _time = _date.getTime();
	img.onload = function() {
		console.log("img读取消耗：" + (new Date().getTime() - _time));
		console.log("宽" + this.width + "高" + this.height);
		var photodiv = document.getElementById("photo");
		photodiv.innerHTML = '<img id="cuteimg" src="' + _path + '" style="display:none;">';
		plus.nativeUI.closeWaiting();
		cutImg();
	}
}

function cutImg() {
	var cuteimg = document.getElementById("cuteimg");
	_cropper = $('#photo #cuteimg').cropper({
		aspectRatio: 1 / 1,
		zoomable: false,
	});
	cuteimg.setAttribute("style", "");
}

function uploadMe() {
	console.log("i am here");
	var result = _cropper.cropper("getCroppedCanvas");
	result.id = "mycanvas";
	$("#canvas1").html(result); //style="display: none;"
	var dataURdataURL;
	try {
		var obj = document.getElementById("mycanvas");
		dataURdataURL = obj.toDataURL('image/' + _bitmapSuffix);
		console.log("我是dataurl:" + dataURdataURL);
	} catch(e) {
		appUI.showTopTip("出错了...");
		plus.nativeUI.closeWaiting();
		console.log("bug " + JSON.stringify(e));
	}
	_headimgname = APP_NAME + '_' + new Date().getTime(); //图片名称,不带后缀
	dirpath = _bitmapPath + _headimgname + "." + _bitmapSuffix;
	var bitmap = new plus.nativeObj.Bitmap("headimg", dirpath);
	if(bitmap) {
		bitmap.clear();
	}
	try {
		bitmap = new plus.nativeObj.Bitmap("headimg");
	} catch(e) {
		mui.toast("出错了...");
		plus.nativeUI.closeWaiting();
		console.log("bug " + JSON.stringify(e));
	}
	console.log("这里3" + dataURdataURL);
	bitmap.loadBase64Data(dataURdataURL, function() {
		console.log("加载Base64图片数据成功");
		bitmap.save(dirpath, {}, function(i) {
			console.log('保存图片成功：' + JSON.stringify(i));
			bitmap.clear();
			start();
		}, function(e) {
			console.log('保存图片失败：' + JSON.stringify(e));
			bitmap.clear();
		});
	}, function() {
		console.log('加载Base64图片数据失败：' + JSON.stringify(e));
		bitmap.clear();
	});
}

function start() {
	var self = this;
	var user = localStorage.getItem("user");
	var userObj = JSON.parse(user);
	var id = userObj.id;
	//创建上传任务
	var task = plus.uploader.createUpload(APP_DOMAIN+"/upload", {
			method: "POST",
			blocksize: 0,
			priority: 10,
			timeout: 10
		},
		function(t, status) {
			plus.nativeUI.closeWaiting();
			plus.uploader.clear();
			console.log(JSON.stringify(t));
			console.log(status);
			if(status == 200 && t && t.responseText) {
				var responseObj = JSON.parse(t.responseText);
				if(responseObj.ecode == 1 ){
					mui.toast("上传成功");
					plus.io.resolveLocalFileSystemURL(dirpath, function(entry) {
						console.log(entry.toLocalURL());
						//更新头像缓存
						userObj.imgurl = entry.toLocalURL();
						localStorage.removeItem("user");
						localStorage.setItem("user",JSON.stringify(userObj));
						mui.fire(plus.webview.getWebviewById("my/user.html"), 'refreshPage');
					});
					mui.back();
				}else{
					mui.toast(responseObj.msg);
				}
			} else {
				mui.toast("上传失败");
			}
		});
	//oss参数配置
	task.addData("id", id);
	task.addFile(dirpath, {
		key: "file",
		name: _headimgname + "." + _bitmapSuffix
	});
	task.start();
}