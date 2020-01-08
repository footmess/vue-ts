<template>
	<el-dialog title="评论" width="60%" :visible="dialogVisible" @close="cancel">
		<el-form>
			<el-form-item>
				<el-input
					type="textarea"
					v-model="content"
					placeholder="文明社会，理性评论"
					autocomplete="off"
				></el-input>
			</el-form-item>
		</el-form>
		<div class="dialog-footer" slot="footer">
			<el-button type="default" @click="cancel">取消</el-button>
			<el-button type="primary" @click="handleOk">确认</el-button>
		</div>
	</el-dialog>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import config from '@/utils/config'
import { ToUser } from '@/types/index'

@Component
export default class Comment extends Vue {
	@Prop({ default: false }) visible!: boolean
	@Prop({ default: '' }) comment_id!: string
	@Prop({ default: '' }) article_id!: string
	@Prop({ default: {} }) to_user!: ToUser

	//初始化变量
	private btnLoading: boolean = false
	private content: string = ''
	private cacheTime: number = 0
	//留言次数
	private times: number = 0

	//计算属性
	get dialogVisible(): boolean {
		return this.visible
	}

	//$emit
	@Emit()
	cancel() {}

	@Emit('handleOk')
	private async handleOk(): Promise<void> {
		if (!this.article_id) {
			this.$message({
				message: '该文章不存在',
				type: 'error'
			})
			return
		}
		if (this.times > 2) {
			this.$message({
				message: '您今天留言的次数已经用完，明天再来留言吧!',
				type: 'warning'
			})
			return
		}

		//记录评论时间
		let now = new Date()
		let nowTime = now.getTime()
		if (nowTime - this.cacheTime < 6000) {
			this.$message({
				message: '您评论太过频繁，1 分钟后再来留言吧！',
				type: 'warning'
			})
			return
		}

		if (!this.content) {
			this.$message({
				message: '请输入内容',
				type: 'warning'
			})
			return
		}

		//查看session中是否存在用户信息
		let user_id = ''
		if (sessionStorage.userInfo) {
			let userInfo = JSON.parse(sessionStorage.userInfo)
			user_id = userInfo._id
		} else {
			this.$message({
				message: '登录才能评论，请先登录',
				type: 'warning'
			})
			return
		}

		this.btnLoading = true
		await this.$https.post(this.$urls.addThirdComment, {
			article_id: this.article_id,
			user_id,
			content: this.content,
			comment_id: this.comment_id,
			to_user: JSON.stringify(this.to_user)
		})
		//提交完毕
		this.btnLoading = false
		this.times++
		this.cacheTime = nowTime
		this.content = ''
		this.$message({
			message: '操作成功',
			type: 'success'
		})
	}
}
</script>
<style lang="scss" scoped>
</style>