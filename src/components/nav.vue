<template>
	<div>
		<div v-if="!isMobile" class="nav">
			<div class="nav-content">
				<el-row :gutter="20">
					<el-col :span="3">
						<router-link to="/">
							<img src="@/assets/logo.png" alt="" />
						</router-link>
					</el-col>
					<el-col :span="16">
						<el-menu
							:router="true"
							:default-active="activeIndex"
							active-text-color="#409eff"
							class="el-menu-demo"
							mode="horizontal"
							@select="handleSelect"
						>
							<el-menu-item
								:router="item.path"
								v-for="(item, index) in list"
								:key="index"
								:index="item.index"
								>{{ item.name }}</el-menu-item
							>
						</el-menu>
					</el-col>
					<el-col v-if="userInfo._id" :span="5">
						<div class="nav-right">
							<el-dropdown @command="handleLogout">
								<span class="el-dropdown-link">
									{{ userInfo.name }}<i class="el-icon-arrow el-icon-right"></i>
								</span>
								<img
									v-if="!userInfo.avatar"
									class="user-img"
									src="@/assets/user.png"
									alt=""
								/>
								<img
									v-if="userInfo.avatar"
									class="user-img"
									:src="userInfo.avatar"
									alt=""
								/>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="logout">登出</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</el-col>
					<el-col v-else :span="4">
						<div class="nav-right">
							<el-button
								size="small"
								type="primary"
								@click="handleClick('login')"
								>登录</el-button
							>
							<el-button
								size="small"
								type="danger"
								@click="handleClick('register')"
								>注册</el-button
							>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
		<div v-else class="nav">
			<div class="nav-mobile">
				<div class="nav-mobile-logo">
					<router-link to="/">
						<img src="@/assets/logo.png" alt=""
					/></router-link>
				</div>
				<div class="title">{{ title }}</div>
				<div class="menu" @click="handleMenu"><i class="el-icon-menu"></i></div>
			</div>
			<div
				v-if="isShow"
				class="nav-mobile-content"
				:class="{
					'enter-sildeUp': enterSlideUp,
					'leave-slideDown': leaveSlideDown
				}"
			>
				<div class="list">
					<div @click="handleClickMenu" class="item">
						<router-link to="/">首页</router-link>
					</div>
					<div class="item" @click="handleClickMenu('/articles')">
						<router-link to="/articles">文章</router-link>
					</div>
					<div class="item" @click="handleClickMenu('/archive')">
						<router-link to="/archive">归档</router-link>
					</div>
					<div class="item" @click="handleClickMenu('/project')">
						<router-link to="/project">项目</router-link>
					</div>
					<div class="item" @click="handleClickMenu('/timeline')">
						<router-link to="/timeline">历程</router-link>
					</div>
					<div class="item" @click="handleClickMenu('/message')">
						<router-link to="/message">留言</router-link>
					</div>
					<div class="item" @click="handleClickMenu('/about')">
						<router-link to="/about">关于</router-link>
					</div>
					<div class="item" @click="handleClickMenu('/login')">
						<span v-if="userInfo._id">{{ userInfo.name }}</span>
						<span v-else>登录</span>
					</div>
					<div
						class="item"
						v-if="!userInfo._id"
						@click="handleClickMenu('/register')"
					>
						注册
					</div>
					<div
						class="item"
						v-if="userInfo._id"
						@click="handleClickMenu('/logout')"
					>
						登出
					</div>
				</div>
			</div>
		</div>
		<div
			v-if="isShow"
			class="mask"
			:class="{ 'mask-fade-out': leaveSlideDown }"
			@click="handleHideMenu"
		></div>
		<RegisterAndLogin
			:visible="visible"
			:isMobile="isMobile"
			:handleFlag="handleFlag"
			@ok="handleOk"
			@cancel="handleCancel"
		></RegisterAndLogin>
	</div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import RegisterAndLogin from '@/components/registerAndLogin.vue'
import { isMobile, getQueryStringByName } from '@/utils/utils'
import { Route } from 'vue-router'
import { UserInfo, NavListItem } from '@/types/index'
import { Loading } from 'element-ui'

@Component({
	components: {
		RegisterAndLogin
	}
})
export default class Nav extends Vue {
	private visible: boolean = false
	private handleFlag: string = ''
	private title: string = '首页'
	private list: Array<NavListItem> = [
		{
			index: '1',
			path: '/',
			name: '首页'
		},
		{
			index: '2',
			path: '/articles',
			name: '文章'
		},
		{
			index: '3',
			path: '/archive',
			name: '归档'
		},
		{
			index: '4',
			path: '/project',
			name: '项目'
		},
		{
			index: '5',
			path: '/timeline',
			name: '历程'
		},
		{
			index: '6',
			path: '/message',
			name: '留言'
		},
		{
			index: '7',
			path: '/about',
			name: '关于'
		}
	]
	private activeIndex: string = '0'
	private enterSlideUp: boolean = false
	private leaveSlideDown: boolean = false
	private isShow: boolean = false
	private isMobile: boolean = isMobile()

	mounted() {
		//授权登录的有code参数
		this.routeChange(this.$route, this.$route)
		const code: string = getQueryStringByName('code')
		if (code) {
			//调用method方法
			this.getUser(code)
		}
	}

	//computed属性
	get userInfo(): UserInfo {
		let userInfo: UserInfo = {
			_id: '',
			name: '',
			avatar: ''
		}
		if (window.sessionStorage.userInfo) {
			//sessionstorage读取json字符串需转为对象
			userInfo = JSON.parse(window.sessionStorage.userInfo)
			//把session中的数据保存到vuex
			this.$store.commit('SAVE_USER', { userInfo })
		}
		if (this.$store.state.user.userInfo) {
			userInfo = this.$store.state.user.userInfo
		}
		return userInfo
	}

	@Watch('$route')
	routeChange(val: Route, oldVal: Route): void {
		for (let i = 0; i < this.list.length; i++) {
			const item: NavListItem = this.list[i]
			if (item.path === val.path) {
				this.activeIndex = `${i + 1}`
				this.title = item.name
				break
			}
		}
	}

	private handleClickMenu(route: string): void {
		this.isShow = false
		if (route === '/login') {
			this.handleFlag = 'login'
			this.visible = true
		}
		if (route === '/register') {
			this.handleFlag = 'register'
			this.visible = true
		}
		if (route === '/logout') {
			this.handleLogout()
		}
	}
	private handleMenu(): void {
		this.isShow = true
		this.enterSlideUp = true
	}
	private handleHideMenu(): void {
		this.enterSlideUp = false
		this.leaveSlideDown = true
		setTimeout(() => {
			this.leaveSlideDown = false
			this.isShow = false
		}, 300)
	}

	private async getUser(code: string): Promise<void> {
		const loading: any = Loading.service({
			lock: true,
			text: 'Loading',
			spinner: 'el-icon-loading',
			background: 'rgba(255,255,255,0.7)'
		})
		const data: UserInfo = await this.$https.post(
			this.$urls.getUsers,
			{ code },
			{ withCredentials: true }
		)
		loading.close()

		const userInfo: UserInfo = {
			_id: data._id,
			name: data.name,
			avatar: data.avatar
		}
		this.$store.commit('SAVE_USER', { userInfo })
		window.sessionStorage.userInfo = JSON.stringify(userInfo)
		this.$message({
			message: '操作成功',
			type: 'success'
		})

		let preventHistory = JSON.parse(window.sessionStorage.preventHistory)

		if (preventHistory) {
			this.$router.push({
				path: preventHistory.name,
				query: preventHistory.query
			})
		}
	}

	private handleLogout(): void {
		window.sessionStorage.userInfo = ''
		this.$store.commit('SAVE_USER', {
			userInfo: {
				_id: '',
				name: '',
				avatar: ''
			}
		})
	}

	private handleClick(value: string): void {
		this.handleFlag = value
		this.visible = true
	}

	private handleCancel(value: boolean): void {
		this.visible = value
	}

	private handleOk(value: boolean): void {
		this.visible = value
	}

	private handleSelect(val: string, oldVal: string): void {
		this.activeIndex = val
	}
}
</script>
<style lang="scss" scoped>
</style>