export const system = uni.getSystemInfoSync();

export const appid = '';

export const terminalVersion = '1.0.0';

export const baseUrl = process.env.NODE_ENV == 'development' ? '' : '';

export const customerUrl = '';

export function getTokenStorage(type = 'token') {
	let key = type;
	return uni.getStorageSync(key) || '';
}

export function setTokenStorage(val, type = 'token') {
	let key = type;
	return uni.setStorageSync(key, val);
}

export function removeTokenStorage(type = 'token') {
	let key = type;
	return uni.removeStorageSync(key);
}

export function setUserinfoStorage(info) {
	return uni.setStorageSync('userinfo', info);
}

export function getUserinfoStorage() {
	return uni.getStorageSync('userinfo') || {};
}

export function showTip(text, icon = "none", duration = 1500) {
	uni.showToast({
		title: text,
		icon: icon,
		duration: duration,
	})
}

export function showLoading(text, mask = true) {
	uni.showLoading({
		title: text,
		mask: mask,
	})
}

/**
 * 显示模态弹窗
 * @param content 提示的标题
 */
export function showConfirm(content, showCancel = true) {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: '提示',
			content: content,
			showCancel: showCancel,
			cancelText: '取消',
			confirmText: '确定',
			success: function(res) {
				resolve(res)
			}
		})
	})
}

export function checkLogin() {
	let info = getUserinfoStorage();
	if (!info.Token) {
		showTip('请先登录');
		uni.navigateTo({
			url: "/pages/login/login"
		})
		throw new Error(401);
	}
}

export function openCustomer() {
	// #ifdef H5
	window.open(customerUrl)
	// #endif
	// #ifndef H5

	// #endif
}

export function isWeixinWeb() {
	// #ifdef H5
	var ua = window.navigator.userAgent.toLowerCase();
	return /micromessenger/.test(ua);
	// #endif
	return false;
}

export function getPayType() {
	let list = [{
			name: '微信支付',
			icon: '../../static/images/wx_pay.png',
			type: 'weixin',
			show: true,
		},
		{
			name: '支付宝支付',
			icon: '../../static/images/ali_pay.png',
			type: 'alipay',
			show: true,
		},
	];
	// #ifdef MP-WEIXIN
	list[1].show = false;
	// #endif
	return list.filter(item => {
		return item.show;
	})
}

//获取页面在栈中位置
export function getPageHistory(route, key, value) {
	let delta = 0,
		idx = 0;
	let pages = getCurrentPages(),
		len = pages.length;
	route = route.replace(/^\//, '');
	for (let i = len; i > 0; i--) {
		if (pages[i - 1].route == route) {
			if (!key) {
				delta = idx;
				break;
			}
			if (pages[i - 1].options[key] == value) {
				delta = idx;
				break;
			}
		}
		idx += 1;
	}
	return {
		total: len,
		delta: delta,
	};
}