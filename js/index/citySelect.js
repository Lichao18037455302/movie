mui.init();
var city = "未知";
//历史记录
var cityListStorage = localStorage.getItem("cityListStorage")||"";//可以设置缓存存放
var cityList = cityListStorage.split(",");


var picker = new mui.PopPicker({
	layer: 2
});

mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	try {
		city = self.info.city;
	} catch(e) {
		//TODO handle the exception
	}
//	storage.init();
//	if(city != "未知") {
//		appSearchHistory.searchCity.update(city);
//	}
	//区域三级联动
	picker.setData(cityData3);

	mui(".cut")[0].addEventListener("tap", function() {
		picker.show(function(selectItems) {
			console.log(JSON.stringify(selectItems));
			if(typeof(selectItems[0].text) == "undefined") {
				province = "未知";
			} else {
				province = selectItems[0].text;
			}
			if(typeof(selectItems[1].text) == "undefined") {
				city = "未知";
			} else {
				city = selectItems[1].text;
			}
			mui("#city")[0].value = "当前：" + city;
//			appSearchHistory.searchCity.update(city);
			cityListStorage = localStorage.getItem("cityListStorage")||"";
			cityListStorage = city+","+cityListStorage;
			var citys = [];
			for (var j=0;j<cityListStorage.split(",").length;j++) {
				if(j<5){
					citys[j]=cityListStorage.split(",")[j];
				}
			}
			localStorage.setItem("cityListStorage",citys.join(","));
		})
	})

	mui("#city")[0].value = "当前：" + city;

	//完成
	mui("header").on("tap", "#comment",function() {
		if(city == "未知") {
			mui.toast("请选择城市！");
			return;
		}
		plus.storage.setItem('whether', true);
		mui.fire(plus.webview.getWebviewById('index/home.html'), "citySelect", {
			city: city
		});
		mui.back();
	})

	
	for(var i = 0; i < cityList.length; i++) {
		document.getElementById("cityList").innerHTML += "<span class='item'>" + cityList[i] + "</span>"
	}
	//清除历史
	document.getElementById("delete").addEventListener("tap", function() {
		localStorage.removeItem("cityListStorage");
		document.getElementById("cityList").innerHTML = "";
	})
	//最近访问
	mui(".stoList").on("tap", "span", function() {
		var cityname = this.innerHTML;
		plus.storage.setItem('whether', true);
		mui.fire(plus.webview.getWebviewById('index/home.html'), "citySelect", {
			city: cityname
		});
		mui.back();
	})

})