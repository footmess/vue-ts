import Vue from 'vue';
import Component from 'vue-class-component';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/index.ts';
import service from './utils/https';
import urls from './utils/urls';
import mixin from './mixins';
// import './filter';

Vue.mixin(mixin);

// 其他页面在使用 axios||urls 的时候直接  this.$https||urls就可以了
Vue.prototype.$https = service;
Vue.prototype.$urls = urls;

Vue.config.productionTip = false;

Component.registerHooks([ 'beforeRouteEnter', 'beforeRouteLeave', 'beforeRouteUpdate' ]);

new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount('#app');
