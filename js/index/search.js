mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		down: { //下拉刷新
			style: mui.os.android ? "circle" : "default"
			//auto: true
		}
	}
});
