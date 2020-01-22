import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from 'element-ui';

interface ResponseData {
	code: number;
	data?: any;
	message: string;
}

//创建axios实例
let service: AxiosInstance | any;
if (process.env.NODE_ENV === 'development') {
	service = axios.create({
		//api的base_url
		baseURL: 'http://39.106.93.60:9527/api/',
		//请求超时时间
		timeout: 50000
	});
} else {
	//生产环境
	service = axios.create({
		baseURL: 'http://39.106.93.60:9527/api/',
		timeout: 50000
	});
}

//请求拦截器
service.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		return config;
	},
	(error: any) => {
		//do sth with request error
		console.log({ error });
		return Promise.reject(error);
	}
);

//响应拦截器
service.interceptors.response.use(
	(response: AxiosResponse) => {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		if (response.status === 200) {
			const data: ResponseData = response.data;
			if (data.code === 0) {
				return data.data;
			} else {
				Message({
					message: data.message,
					type: 'error'
				});
			}
		} else {
			Message({
				message: '网络错误',
				type: 'error'
			});
			return Promise.reject(new Error(response.data.message || 'Error'));
		}
		// return response;
	},
	(error: any) => {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return Promise.reject(error);
	}
);

export default service;
