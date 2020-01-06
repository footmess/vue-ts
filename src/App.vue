<template>
	<div id="app" class="container">
		<Nav v-if="isShowNav"></Nav>
		<div class="layout">
			<router-view></router-view>
			<Slider v-if="isShowSlider"></Slider>
		</div>
		<ArrowUp></ArrowUp>
		<Footer v-show="isShowNav"></Footer>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import Nav from '@/components/nav.vue'
import Slider from '@/components/slider.vue'
import Footer from '@/components/footer.vue'
import ArrowUp from '@/components/arrowUp.vue'
import { isMobile } from '@/utils/utils'

//移动端rem单位适配
if (isMobile()) {
	let width = window.screen.width
	window.document.getElementsByTagName('html')[0].style.fontSize =
		width / 7.5 + 'px'
}

@Component({
	components: {
		Nav,
		Slider,
		Footer,
		ArrowUp
	}
})
export default class App extends Vue {
	private isShowNav: boolean = false
	private isShowSlider: boolean = false
	mounted(): void {
		this.routeChange(this.$route, this.$route)
	}
	@Watch('$route')
	routeChange(val: Route, oldVal: Route): void {
		const referrer: any = document.getElementById('referrer')
		if (val.path === '/') {
			this.isShowNav = false
			referrer.setAttribute('content', 'always')
		} else {
			this.isShowNav = true
			referrer.setAttribute('content', 'never')
		}

		if (
			val.path === 'articles' ||
			val.path === 'archive' ||
			val.path === 'project' ||
			val.path === 'timeline' ||
			val.path === 'message'
		) {
			this.isShowSlider = true
		} else {
			this.isShowSlider = false
		}

		if (isMobile()) {
			this.isShowSlider = false
		}
	}
}
</script>

<style lang="scss">
@import url('./style/index.scss');
@import url('./style/mobile.scss');
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	width: 1200px;
	margin: 0 auto;
	padding-top: 61px;
}
img {
	vertical-align: bottom;
}
</style>
