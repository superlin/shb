//util
(function (window) {
	function $(selector) {
    	return typeof selector === 'string' ? document.querySelector(selector) : selector;
	}
	
	function on(ele, funs, callback) {
		funs = funs.split(" ");
		funs.forEach(function (fun) {
		  fun = fun.trim();
		  if (!!fun) {
		    $(ele).addEventListener(fun, callback);
		  }
		});
	}
	
	function addClass(ele, c) {
		$(ele).classList.add(c);
	}
	
	function rmClass(ele, c) {
		$(ele).classList.remove(c);
	}
	
	function noop() {}
	
	function ajaxReq(options) {
		if (!options.url || typeof options.url !== 'string') {
			options.fail('url错误');
			return;
		}
		
		var url = options.url;
		var method = options.method || 'GET';
		var data = options.data || {};
		var fail = options.fail || noop;
		var success = options.success || noop;
		
		if (method === 'GET') {
			var str = [];
			for (var key in data) {
				str.push(key + "=" + encodeURIComponent(data[key]));
			}
			if (str.length >= 1) {
				url += ('?'+str.join("&"));
			}
			data = '';
		} else {
			var form = new FormData();
			for (var key in data) {
				form.append(key, data[key]);
			}
			data = form;
		}
		
		var req = new XMLHttpRequest();
		req.open(method, url, true);
		req.timeout = 30*1000;
		req.send(data);
		req.onload = function () {
			if (req.status === 200) {
				success(req.response);
			} else {
				fail('响应错误');
			} 
		};
		req.onerror = function () {
			fail('请求失败');
		};
		req.ontimeout = function () {
			fail('请求超时');
		};
	}
	
	var _ = {
		addClass: addClass,
		rmClass: rmClass,
		on: on,
		$: $,
		ajaxReq: ajaxReq
	};
	
	window._ = _;
})(window);


// logic
function search() {
	var txt = _.$('#search-txt').value.trim();
	if (!txt) {
		_.rmClass('.search-error', 'hide');
	} else {
		_.ajaxReq({
			url: '/search',
			data: {
				txt: txt
			}
		});
		_.addClass('.result', 'slide-out');
	}
}

_.on(document, 'DOMContentLoaded', function () {
	var sch_txt = _.$('#search-txt');
	
	_.on('#search-btn', 'click', search);
	
	
	_.on(sch_txt, 'keyup', function (ev) {
		if (ev.keyCode === 13) {
			search();
		}
	});
	
	_.on(sch_txt, 'focus', function () {
		_.addClass('.search-error', 'hide');
	});
});