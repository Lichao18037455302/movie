mui.init({
	beforeback: function() {
		appPage.closeLogin();
	}
});
mui.plusReady(function() {
	localstorageUser = localstorageUserFunc();
	//判断是否登录
	if(localstorageUser.IsLogin) {

		document.getElementById("myAccount").addEventListener("tap", function() {
			openNew("myAccount.html");
		})
		document.getElementById("aboutApp").addEventListener("tap", function() {
			openNew("aboutApp.html");
		})
//		document.getElementById("clearCache").addEventListener("tap", function() {
//			appUI.showWaiting();
//			temporaryStorage.clear();
//			//删除下载目录
//			plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
//				console.log("fsname=" + fs.name);
//				// 创建读取目录信息对象 
//				var directoryReader = fs.root.createReader();
//				directoryReader.readEntries(function(entries) {
//					var entry, headimgreader, headimgentries, headentry;
//					for(var i = 0; i < entries.length; i++) {
//						entry = entries[i];
//						console.log("i name=" + entry.name)
//						if(entry.name == "headimg") {
//							headimgreader = entry.createReader();
//							headimgreader.readEntries(function(headimgentries) {
//								for(var j = 0; j < headimgentries.length; j++) {
//									headentry = headimgentries[j];
//									console.log(headentry.name);
//									headentry.remove();
//								}
//							});
//							break;
//						}
//
//						//entry.remove();
//					}
//
//				}, function(e) {
//					alert("Read entries failed: " + e.message);
//				});
//			}, function(e) {
//				alert("Request file system failed: " + e.message);
//			});
//
//			appUI.closeWaiting();
//			mui.alert('清理成功', '通知', function() {
//				//info.innerText = '你刚关闭了警告框';
//			});
//		})
		document.getElementById("loginOut").addEventListener("tap", function() {
			var btnArray = ['否', '是'];
			mui.confirm('退出后您将不能查看个人数据，确定退出？', '', btnArray, function(e) {
				if(e.index == 1) {
					//appUI.showWaiting();
					localstorageUser = null;
					localStorage.removeItem("user");
					plus.storage.clear();
					mui.fire(plus.webview.getWebviewById("my/user.html"), 'refreshPage');
//					plus.oauth.getServices(function(services) {
//						for(var i in services) {
//							var service = services[i];
//							console.log("我是" + service.id)
//							if(service.id == "qq" || service.id == "weixin") {
//								console.log(service.id)
//								//								var isInstalled = plusIsInstalled(service.id);
//								//								if(isInstalled) {
//								service.logout(function(e) {
//									console.log("注销成功")
//								}, function(e) {
//									console.log("注销失败")
//								});
//								//}
//
//							}
//						}
//					});
					setTimeout(function() {
						//console.log("关闭了")
						//appUI.closeWaiting();
						mui.back();
					}, 800);

				}
			})

		});

	}
	//appPage.closeLogin();
})