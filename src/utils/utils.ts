//常用函数的封装，比如事件的节流(throttle)和防抖(debounce)
export function throttle(fn: Function, delay: number) {
	//last为上一次触发回调的时间，timer是定时器
	let last = 0,
		timer: any = null;
	return function() {
		//保留调用时的this上下文
		let context = this;
		//保留调用时传入的参数
		let args = arguments;
		//记录回调触发的时间 把date转换为number类型
		let now: number = +new Date();
		//判断时间间隔
		if (now - last < delay) {
			clearTimeout(timer);
			timer = setTimeout(function() {
				last = now;
				fn.apply(context, args);
			}, delay);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
}

//添加cookie
export function setCookie(cName: string, value: any, expiredays: any) {
	if (expiredays > 0 && expiredays !== '100') {
		let exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = `${cName}=${escape(value)}${
			expiredays == null ? '' :
			';expires=' + exdate.toUTCString()}`;
	}
	if (expiredays === '100') {
		let exdate = new Date('2220-01-01 00:00:00');
		document.cookie = `${cName}=${escape(value)}${
			expiredays == null ? '' :
			';expires=' + exdate.toUTCString()}`;
	}
}

//查询cookie
export function getCookie(cName: string) {
	if (document.cookie.length > 0) {
		let cStart: number = document.cookie.indexOf(cName + '=');
		if (cStart !== -1) {
			cStart = cStart + cName.length + 1;
			let cEnd: number = document.cookie.indexOf(';', cStart);
			if (cEnd === -1) cEnd = document.cookie.length;
			return document.cookie.substring(cStart, cEnd);
		}
	}
	return '';
}

//删除cookie
export function delCookie(name: string) {
	let exp = new Date();
	exp.setTime(exp.getTime() - 1);
	let cval = getCookie(name);
	if (cval != null) {
		document.cookie = `${name}=${cval};expires=${exp.toUTCString()}`;
	}
}

//清除cookie
export function clearCookie(name: string) {
	setCookie(name, '', -1);
}

//获取querystring的数组
export function getQueryString() {
	//string.prototype.match()  g  =>返回与完整正则表达式匹配的所有结果
	let result = window.location.search.match(new RegExp(`[?&][^?&]+=[^?&]+`, 'g'));
	if (result == null) {
		return '';
	}
	for (let i = 0; i < result.length; i++) {
		result[i] = result[i].substring(1);
	}
	return result;
}

//根据querystring参数名称获取值
export function getQueryStringByName(name: string) {
	//string.prototype.match()  没有g标志  =>返回第一个完整匹配及其捕获组，附加index(匹配结果的开始位置)和input(搜索的字符串)属性
	let result = window.location.search.match(new RegExp(`[?&]${name}=([^&]+)`, 'i'));
	if (result == null || result.length < 1) {
		return '';
	}
	return result[1];
}

//获取页面顶部被卷起来的高度
export function getScrollTop() {
	return Math.max(document.body.scrollTop, document.documentElement.scrollTop);
}

//获取页面文档的总高度
export function getDocumentHeight() {
	return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
}

//获取页面浏览器视口的高度
export function getWindowHeight() {
	//标准模式
	if (document.compatMode === 'CSS1Compat') {
		return document.documentElement.clientHeight;
	}
	return document.body.clientHeight;
	// return
	// 	document.compatMode === 'CSS1Compat' ? document.documentElement.clientHeight :
	// 	document.body.clientHeight;
}

//判断是移动端(true)还是pc端(false)
export function isMobile() {
	if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
		return true;
	} else {
		return false;
	}
}

//格式化日期 yy-mm-dd || yy-mm-dd hh:mm:ss
export function timestampToTime(timestamp: Date | any, flag: boolean) {
	const date = new Date(timestamp);
	const Y = date.getFullYear() + '-';
	const M =
		(
			date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) :
			date.getMonth() + 1) + '-';
	const D =

			date.getDate() < 10 ? '0' + date.getDate() + ' ' :
			date.getDate() + ' ';
	const h =

			date.getHours() < 10 ? '0' + date.getHours() + ':' :
			date.getHours() + ':';
	const m =

			date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' :
			date.getMinutes() + ':';
	const s =

			date.getSeconds() < 10 ? '0' + date.getSeconds() :
			date.getSeconds();
	if (!flag) {
		return Y + M + D;
	}
	return Y + M + D + h + m + s;
}
