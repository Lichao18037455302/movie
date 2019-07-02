var  city, timerobj, timer, swiper;
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: { //下拉刷新
			callback: pulldownRefresh,
			style: mui.os.android ? "circle" : "default"
		}
	}
});

mui.plusReady(function() {
//	storage.init();
	//注册登录事件
//	appPage.registerCheckLoginEvent();

	initPage();

	//赛事详情页
	mui("body").on("tap", ".matchInfo", function() {
		mui.toast("点击进入赛事详情页",2000);
	})

	//店铺详情页
	mui("#nearstore_warp").on("tap", ".storeinfo", function() {
		mui.toast("点击进入店铺详情页",2000);
	})

	//套牌详情页
	mui("#cardgroup_warp").on("tap", ".cardgroupdetail", function() {
		mui.toast("点击进入套牌详情页",2000);
	})

	//新闻详情页
	mui("#news_warp").on("tap", ".newsinfo", function() {
		mui.toast("点击进入新闻详情页",2000);
	})
	//热门头条详情页
	document.getElementById("topic_warp").addEventListener('tap', function() {
		mui.toast("点击进入热门头条详情页",2000);
	})

	//城市选择
	document.getElementById("city").addEventListener("tap", function() {
		openNew("citySelect.html", {
			city: this.innerHTML
		});
	});

	//搜索
	document.getElementById("search").addEventListener("tap", function() {
		mui.openWindow({
			url: "search.html",
			id: "index/search.html",
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				aniShow: "none", //页面显示动画，默认为”slide-in-right“；
				event: 'titleUpdate', //页面显示时机，默认为titleUpdate事件时显示
				extras: {} //窗口动画是否使用图片加速
			},
			waiting: {
				autoShow: false, //自动显示等待框，默认为true
			}
		})
	})

	//官方资讯等二级
	mui(".navig").on("tap", "div", function() {
		if(this.dataset.href) {
			openNew(this.dataset.href);
		}
	})

	//官方资讯
	document.getElementById("newslist").addEventListener("tap", function() {
		mui.toast("点击了官方资讯",2000);
	})

	//参与比赛二级
	//	document.getElementById("participation").addEventListener("tap", function() {
	//		openNew("../pk/fightForJoin.html");
	//	})
	//店铺换一组
	document.getElementById("changestore").addEventListener("tap", function() {
		mui.toast("点击了店铺换一组",2000);
	})
	//赛事换一组
	document.getElementById("changematch").addEventListener("tap", function() {
		mui.toast("点击了赛事换一组",2000);
	})

})

function initPage() {
	plus.geolocation.getCurrentPosition(function(position) {
		document.getElementById("city").innerText = position.address.city;
		console.log('位置信息++++：'+JSON.stringify(position));
		plus.storage.setItem('location',true);
	}, function(e) {
		var btnArray = ['否', '是'];
		mui.confirm('定位失败，是否请手动选择城市?', '', btnArray, function(e) {
			if (e.index == 1) {
				openNew('citySelect.html');
			}else{
				if(!plus.storage.getItem('whether')){
					//取消手动定位，默认设置上海
					document.getElementById("city").innerText = "上海市",
					plus.storage.setItem('location',false);
					mui.fire(plus.webview.getWebviewById('index/home.html'),"citySelect",{
						city:'上海市'
					});
				}
			}
		})
	}, {
		geocode: true
	});

	swiper = new Swiper('.swiper-container', {
		autoplay: 3000, //可选选项，自动滑动
		pagination: '.swiper-pagination',
		loop: true,
		autoplayDisableOnInteraction: false,
	});
	loadData();
}
//下拉刷新具体业务实现
function pulldownRefresh() {
	loadData();
}
//一次性拉取数据
function loadData() {
	showSigleMatch() ;
	appPage.endPullRefresh();
}

//单条报名中赛事绑定显示
function showSigleMatch() {
	document.getElementById("siglematch_warp").style.display = 'block';
	timerobj = appUI.countDown("2019-1-1 11:01:00");
	if(timerobj.hour == "0" && timerobj.minute == "0" && timerobj.second == "0") { //倒计时结束
		window.clearInterval(timer); //清除定时器	
		return;
	}
	//倒计时
	timer = setInterval(function() {
		timerobj = appUI.countDown("2019-1-1 11:01:00");
		//log(JSON.stringify(timerobj));
		if(timerobj.hour == "0" && timerobj.minute == "0" && timerobj.second == "0") { //倒计时结束
			window.clearInterval(timer); //清楚定时器			
			return;
		}
		document.getElementById("timer_h").innerText = timerobj.hour < 10 ? "0" + timerobj.hour : timerobj.hour;
		document.getElementById("timer_m").innerText = timerobj.minute < 10 ? "0" + timerobj.minute : timerobj.minute;
		document.getElementById("timer_s").innerText = timerobj.second < 10 ? "0" + timerobj.second : timerobj.second;
	}, 1000);
}

//自定义监听城市选择
window.addEventListener("citySelect", function(event) {
	document.getElementById("city").innerHTML = event.detail.city;
	loadData();
})
