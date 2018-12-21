((function _scale() {
	if (window.innerWidth < 370) {
		document.querySelector('meta[name=viewport]').content = 'width=device-width,minimum-scale=0.8,maximum-scale=0.8,initial-scale=0.8,user-scalable=no';
	} else {
		document.querySelector('meta[name=viewport]').content = 'width=device-width,minimum-scale=1.0,maximum-scale=1.0,initial-scale=1,user-scalable=no';
	}
}))();
