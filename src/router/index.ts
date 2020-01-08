import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/home.vue';

Vue.use(VueRouter);

// 路由懒加载先等等 ，后续采坑
// 设置路由懒加载 加载首页时会加载全部路由组件
// 默认情况下，一个 Vue CLI 应用会为所有作为 async chunk 生成的 JavaScript 文件 (通过动态 import() 按需 code splitting 的产物) 自动生成 prefetch 提示。
// https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
const routes = [
	{
		path: '/',
		name: 'home',
		component: Home
	},
	{
		path: '/archive',
		name: 'archive',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "archive" */ '../views/archive.vue')
	},
	{
		path: '/articles',
		name: 'articles',
		component: () => import(/* webpackChunkName: "articles" */ '../views/articles.vue')
	},
	{
		path: '/timeline',
		name: 'timeline',
		component: () => import(/* webpackChunkName: "timeline" */ '../views/timeline.vue')
	},
	{
		path: '/project',
		name: 'project',
		component: () => import(/* webpackChunkName: "project" */ '../views/project.vue')
	},
	{
		path: '/message',
		name: 'message',
		component: () => import(/* webpackChunkName: "message" */ '../views/message.vue')
	},
	{
		path: '/about',
		name: 'about',
		component: () => import(/* webpackChunkName: "about" */ '../views/articleDetail.vue')
	},
	{
		path: '/articleDetail',
		name: 'articleDetail',
		component: () => import(/* webpackChunkName: "articleDetail" */ '../views/articleDetail.vue')
	}
];

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

export default router;
