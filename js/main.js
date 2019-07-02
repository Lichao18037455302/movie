var closeLoad = false;
mui.init();
var showMenu = false,
	showPop = "";

var subPages = ["index/home.html", "news/news.html", "movies/movies.html","my/user.html"];
var subPagesLoad = [false, false, false, false];
var subPageStyle = {
	top: '0',
	bottom: '51px',
	zindex: '0',
	position: 'relative'
}
var self, pkbtn_def, pkbtn_activity, defstyle, deftxt, activetxt, activestyle, activeTab, targetTab, firstPage, tabindex;
mui.plusReady(function() {
	self = plus.webview.currentWebview();
//	storage.init();
	plus.navigator.setStatusBarBackground('#fff');
	plus.navigator.setStatusBarStyle('dark');

	for(var i = 0; i < subPages.length; i++) {
		var sub = plus.webview.create(subPages[i], subPages[i], subPageStyle);
		if(i == 0) {
			firstPage = sub;
		}
		self.append(sub);
	}
	plus.webview.show(subPages[0]);

	//底部切換
	activeTab = "index/home.html";
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		targetTab = this.dataset.href;
		tabindex = this.dataset.index;
		if(targetTab == 'my/user.html') {
			plus.navigator.setStatusBarBackground('#4B9CF6');
			plus.navigator.setStatusBarStyle('light');
		} else {
			plus.navigator.setStatusBarBackground('#fff');
			plus.navigator.setStatusBarStyle('dark');
		}
		if(targetTab == activeTab) {
			return;
		}

		console.log("我是第" + tabindex + ",targetTab=" + targetTab +",subPagesLoad[tabindex]="+subPagesLoad[tabindex])
		plus.webview.show(targetTab); //显示页面
		if(subPagesLoad[tabindex] == false) {
			mui.fire(plus.webview.getWebviewById(targetTab), 'refreshPage'); //初次刷新页面
			subPagesLoad[tabindex] = true;
		}
		//隐藏当前;
		plus.webview.hide(activeTab);
		//更改当前活跃的选项卡
		activeTab = targetTab;
	});

	//监听popover的状态，用于按下Back的时候逻辑处理
	mui('body').on('shown', '.mui-popover', function(e) {
		//		plus.nativeUI.closeWaiting();
		showPop = true
	})

	//首页返回键处理 逻辑：1秒内，连续两次按返回键，则退出应用；
	var first = null;
	mui.back = function() {
		if(showPop || showMenu) {
			if(showPop) {
				mui('#mainPopoverEl').popover('hide')
				showPop = false
			}
			showMenu ? closeMenu() : void(0);
		} else {
			if(!first) {
				first = new Date().getTime();
				mui.toast('再按一次会退出哦');
				setTimeout(function() {
					first = null;
				}, 1000);
			} else {
				if(new Date().getTime() - first < 1000) {
					plus.runtime.quit();
				}
			}
		}
	};
})