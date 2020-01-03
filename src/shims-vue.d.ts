import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import { Store } from 'vuex';

declare module 'vue/types/vue' {
	interface Vue {
		$router: VueRouter;
		$route: Route;
		$store: Store<any>;

		//全局挂载的变量
		$https: any;
		$urls: any;
	}
}
