<template>
	<el-dialog
		title="登录"
		:width="isMobile ? '90%' : '50%'"
		:visible="dialogVisible"
		@close="cancel"
	>
		<el-form>
			<el-form-item label="邮箱" :label-width="formLabelWidth">
				<el-input
					v-model="params.email"
					placeholder="邮箱"
					autocomplete="off"
				></el-input>
			</el-form-item>
			<el-form-item label="密码" :label-width="formLabelWidth">
				<el-input
					v-model="params.password"
					placeholder="密码"
					autocomplete="off"
				></el-input>
			</el-form-item>
			<el-form-item
				label="昵称"
				:label-width="formLabelWidth"
				v-if="handleFlag === 'register'"
			>
				<el-input
					v-model="params.name"
					placeholder="用户或昵称"
					autocomplete="off"
				></el-input>
			</el-form-item>
			<el-form-item
				label="手机"
				:label-width="formLabelWidth"
				v-if="handleFlag === 'register'"
			>
				<el-input
					v-model="params.phone"
					placeholder="手机号"
					autocomplete="off"
				></el-input>
			</el-form-item>
			<el-form-item
				label="简介"
				:label-width="formLabelWidth"
				v-if="handleFlag === 'register'"
			>
				<el-input
					v-model="params.desc"
					placeholder="个人简介"
					autocomplete="off"
				></el-input>
			</el-form-item>
		</el-form>
		<div class="dialog-footer" slot="footer">
			<el-button type="success" @click="handleOAuth">
				github 授权登录
			</el-button>
			<el-button
				v-if="handleFlag === 'login'"
				:loading="btnLoading"
				type="primary"
				@click="handleOk('login')"
				>登录</el-button
			>
			<el-button
				v-if="handleFlag === 'register'"
				:loading="btnLoading"
				type="primary"
				@click="handleOk('register')"
				>注册</el-button
			>
		</div>
	</el-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import config from '@/utils/config'
import { RegAndLogParams, UserInfo } from '@/types/index'

@Component
export default class RegisterAndLogin extends Vue {
	//ts !表示非null 非undefined
	@Prop({ default: false }) visible!: boolean
	@Prop({ default: false }) handleFlag!: string
	@Prop({ default: false }) isMobile!: string

	//inital data
	private btnLoading: boolean = false
	private loading: boolean = false
	private formLabelWidth: string = this.isMobile ? '40px' : '60px'
	private params: RegAndLogParams = {
		email: '',
		name: '',
		password: '',
		phone: '',
		desc: ''
	}

	//lifecycle hook
	mounted() {}

	//computed
	get dialogVisible(): boolean {
		return this.visible
	}

	//methods
	private handleOAuth(): void {
		//保存授权前的页面链接内容
		let preventHistory: object = {
			name: this.$route.name,
			query: this.$route.query
		}
		//存储json对象前需要转为字符串
		window.sessionStorage.preventHistory = JSON.stringify(preventHistory)
		//导航到GitHub授权页面
		window.location.href = `${config.oauth_url}?client_id=${config.client_id}&redirect_url=${config.redirect_url}`
	}

	private handleOk(): void {
		const reg = new RegExp(
			'^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'
		)
		if (!this.params.email) {
			this.$message({
				message: '邮箱不能为空!',
				type: 'warning'
			})
			return
		} else if (!reg.test(this.params.email)) {
			this.$message({
				message: '请输入正确的邮箱',
				type: 'warning'
			})
			return
		}
		if (this.handleFlag === 'register') {
			if (!this.params.password) {
				this.$message({
					message: '密码不能为空',
					type: 'warning'
				})
				return
			} else if (!this.params.name) {
				this.$message({
					message: '用户名不能为空',
					type: 'warning'
				})
				return
			}
			const re = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/
			if (this.params.phone && !re.test(this.params.phone)) {
				this.$message({
					message: '请输入正确的手机号',
					type: 'warning'
				})
				return
			}
		}
		this.submit()
	}

	//this.$emit()
	@Emit()
	private cancel(): boolean {
		return false
	}
	@Emit('OK')
	private async submit(): Promise<void> {
		let data: any = ''
		this.btnLoading = true
		if (this.handleFlag === 'register') {
			data = await this.$https.post(this.$urls.register, this.params)
		} else {
			data = await this.$https.post(this.$urls.login, this.params)
		}
		this.btnLoading = false

		const userInfo: UserInfo = {
			_id: data._id,
			name: data.name,
			avatar: data.avatar
		}

		//vuex保存用户信息
		this.$store.commit('SAVE_USER', {
			userInfo
		})

		//sessionStorage保存到会话中
		sessionStorage.userInfo = JSON.stringify(userInfo)

		this.$message({
			message: '操作成功',
			type: 'success'
		})
	}
}
</script>
<style lang="scss" scoped>
</style>