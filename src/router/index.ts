import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/home.vue';

Vue.use(VueRouter);

// 路由懒加载先等等 ，后续采坑
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
