var ws = null,
	wo = null;
var scan = null,
	domready = false;
// H5 plus事件处理
function plusReady() {
	if(ws || !window.plus || !domready) {
		return;
	}
	// 获取窗口对象
	ws = plus.webview.currentWebview();
	wo = ws.opener();
	// 开始扫描
	ws.addEventListener('show', function() {
		scan = new plus.barcode.Barcode('bcid');
		scan.onmarked = onmarked;
		scan.start();
	}, false);
	// 显示页面并关闭等待框
	ws.show('pop-in');
	//wo.evalJS('closeWaiting()');
}
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}
// 监听DOMContentLoaded事件
document.addEventListener('DOMContentLoaded', function() {
	domready = true;
	plusReady();
}, false);


// 二维码扫描成功
function onmarked(type, result, file) {
	switch(type) {
		case plus.barcode.QR:
			type = 'QR';
			break;
		case plus.barcode.EAN13:
			type = 'EAN13';
			return;
		case plus.barcode.EAN8:
			type = 'EAN8';
			return;
		default:
			type = '其它' + type;
			return;
	}
	console.log(JSON.stringify(result));
	if(result.startsWith("http")) {
		plus.runtime.openURL(result);
	} else {
		alert('无效的二维码！');
		mui.back();
	}
}


// 从相册中选择二维码图片 
function scanPicture() {
	plus.gallery.pick(function(path) {
		plus.barcode.scan(path, onmarked, function(error) {
			plus.nativeUI.alert('无法识别此图片');
		});
	}, function(err) {
		console.log('Failed: ' + err.message);
	});
}