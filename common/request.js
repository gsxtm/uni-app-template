import {
	baseUrl,
	getSignInfo,
	showConfirm,
} from "./index.js"
import store from "../store/index.js";

console.log(store,'store')

export default {
	/*
		common: 配置请求头及默认的请求方法
		request：请求 支持get/post请求
		get: 单独get请求
		post: 单独post请求
	*/
	// 全局配置
	common: {
		// 根路径
		baseUrl: baseUrl,
		// 配置请求头
		header: {
			'content-type': "application/json",
		},
		// 请求数据
		data: {},
		// 请求方式
		method: 'GET',
		// 返回的数据形式
		dataType: 'json',
		// 超时时间
		timeout: 20000,
	},


	// 请求返回promise
	request(options = {}) {
		// 组织参数 
		options.url = this.common.baseUrl + options.url;
		options.header = Object.assign({}, this.common.header, options.header || {});
		options.data = options.data || {};// this.common.data
		if(!options.noSign) {
			options.data = getSignInfo(options.data,options.signNoToken);
		}
		options.method = options.method || this.common.method
		options.dataType = options.dataType || this.common.dataType
		options.timeout = options.timeout || this.common.timeout
		// 需要token或者登陆凭证验证可通过这里进行验证
		return new Promise((res, rej) => {
			//请求中
			uni.request({
				...options,
				success: result => {
					let code = result.data && typeof result.data == 'object' ? result.data.Code : null;
					if(code == 403 || code == 401 || code == 406){
						uni.hideLoading({
							noConflict: true,
						})
						let pages = getCurrentPages()
						let url = pages[pages.length-1].$page.fullPath;
						url = encodeURIComponent(url);
						showConfirm('登录状态已过期，请重新登录',false).then(res => {
						  if (res.confirm) {
						    store.dispatch('clearLogin').then(res => {
						      uni.reLaunch({ url: '/pages/login/login?url='+ url })
						    })
						  }
						})
						rej(result.data)
					}else if( (result.statusCode != 200 && result.statusCode != 201) || 
						(code != null && result.data.Code != 200)) {
						uni.hideLoading({
							noConflict: true
						})
						uni.showToast({
							title: result.data.Message || '接口异常',
							icon: "none"
						})
						rej(result.data)
						return result;
					}
					res(result.data)
					return result;
				},
				fail: (err) => {
					uni.showToast({
						title: err.message || '接口异常',
						icon: "none"
					})
					uni.hideLoading({noConflict: true})
					rej(err)
				}
			});
		})
	},

	// get请求  url ：请求地址 data:请求参数  options: 请求的其他配置参数
	get(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},

	// POST请求  url ：请求地址 data:请求参数  options: 请求的其他配置参数
	post(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	},
	
	// PUT请求  url ：请求地址 data:请求参数  options: 请求的其他配置参数
	put(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'PUT'
		return this.request(options)
	},
	
	// DELETE请求  url ：请求地址 data:请求参数  options: 请求的其他配置参数
	delete(url, data, options = {}) {
		options.url = url
		options.data = data
		options.method = 'DELETE'
		return this.request(options)
	},

	file(url, options = {}) {
		return new Promise((resolve,reject)=>{
			uni.uploadFile({
				url: baseUrl + url,
				filePath: options.file,
				name: options.name || 'file',
				formData: options.data || {},
				success: (uploadFileRes) => {
					resolve(uploadFileRes)
				},
				fail:(uploadErr) => {
					uni.hideLoading()
					reject(uploadErr)
				}
			});
		})
	},

}
