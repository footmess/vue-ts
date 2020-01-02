import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';

Vue.use(Vuex);

const initPageState = () => {
	return {
		// user: {
		// 	username: 'abc',
		// 	password: '123'
		// }
	};
};

const store = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	// state: initPageState(),
	//同步修改
	// mutations: {},
	//异步修改
	// actions: {},
	modules: {
		user
	}
});

export default store;
