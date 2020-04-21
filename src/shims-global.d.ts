//声明文件
declare module '*.vue' {
	import Vue from 'vue';
	export default Vue;
}

//声明全局的window，不然使用window.xx会报错
declare let THREE: any;

declare module 'element-ui/lib/transitions/collapse-transition';
