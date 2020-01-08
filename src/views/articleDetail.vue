<template>
	<div style="width:100%">
		<div class="article clearfix">
			<div
				v-show="!isLoading"
				:style="{ width: isMobile ? '100%' : '75%' }"
				class="article-left fl"
			>
				<div class="header">
					<h1 class="title">{{ articleDetail.title }}</h1>
					<div class="author">
						<div class="avatar">
							<img class="auth-logo" src="@/assets/userLogo.png" alt="" />
						</div>
						<div class="info">
							<span class="name"
								><span>{{ articleDetail.author }}}</span></span
							>
							<div
								props-data-classes="user-follow-button-header"
								data-author-follow-button=""
							/>
							<div class="meta">
								<span class="public-time">
									{{
										articleDetail.create_time
											? formatTime(articleDetail.create_time)
											: ''
									}}
								</span>
								<span class="wordage">字数{{ articleDetail.numbers }}</span>
								<span class="views-count"
									>阅读{{ articleDetail.meta.views }}</span
								>
								<span class="comments-count"
									>评论{{ articleDetail.meta.comments }}</span
								>
								<span class="likes-count"
									>字数{{ articleDetail.meta.likes }}</span
								>
							</div>
						</div>
						<div class="tags" title="标签">
							<el-tag
								size="mini"
								v-for="(tag, index) in articleDetail.tags"
								:key="index"
								type="success"
								class="tag"
								>{{ tag.name }}</el-tag
							>
						</div>
						<span class="clearfix"></span>
					</div>
				</div>
				<div class="content">
					<div
						class="article-detail"
						id="content"
						v-html="articleDetail.content"
					></div>
				</div>
				<div class="heart">
					<el-button
						type="danger"
						size="large"
						icon="heart"
						:loading="isLoading"
						@click="likeArticle"
						>点赞</el-button
					>
				</div>
				<div class="comment">
					<el-input
						placeholder="文明社会，理性评论"
						type="textarea"
						v-model="content"
					></el-input>
					<el-button
						type="primary"
						style="margin-top:15px"
						:loading="btnLoading"
						@click="handleAddComment"
						>发送</el-button
					>
				</div>
				<!-- 父组件传递数据，监听事件 -->
				<CommentList
					v-if="!isLoading"
					:numbers="articleDetail.meta.comments"
					:list="articleDetail.comments"
					:article_id="articleDetail._id"
					@refreshArticle="refreshArticle"
				/>
			</div>
			<div
				class="article-right fr anchor"
				v-if="!isMobile"
				style="width:23%"
				v-html="articleDetail.toc"
			></div>
			<LoadingCustom v-if="isLoading"></LoadingCustom>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { isMobile, timestampToTime } from '@/utils/utils'
import LoadingCustom from '@/components/loading.vue'
import CommentList from '@/components/commentList.vue'
import markdown from "@/utils/markdown.js"
import { ArticleDetailIF, LikeParams, ArticleDetailParams } from '@/types/index'

declare let document: Document | any

@Component({
	components: {
		LoadingCustom,
		CommentList
	}
})
export default class ArticleDetail extends Vue {
	private btnLoading: boolean = false
	private isLoadEnd: boolean = false
	private isLoading: boolean = false
	private isMobile: boolean = isMobile()
	private content: string = ''
	private params: ArticleDetailParams = {
		id: '',
		//文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
		type: 1
	}
	private articleDetail: ArticleDetailIF = {
		toc: '',
		_id: '',
		author: 'sun',
		category: [],
		comments: [],
		create_time: '',
		desc: '',
		content: '',
		id: 16,
		img_url: '',
		numbers: 0,
		keyword: [],
		like_users: [],
		meta: { views: 0, likes: 0, comments: 0 },
		origin: 0,
		state: 1,
		tags: [],
		title: '',
		update_time: ''
	}

	//缓存时间
	private cacheTime: number = 0
	//评论次数
	private times: number = 0
	//点赞次数
	private likeTimes: number = 0

	mounted(): void {
		this.params.id = this.$route.query.article_id
		if (this.$route.path === '/about') {
			this.params.type = 3
		}
		this.handleSearch()
	}

	refreshArticle(): void {
		this.handleSearch()
	}

	//提交评论
	private async handleAddComment(): Promise<void> {
		if (!this.articleDetail._id) {
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
		await this.$https.post(this.$urls.addComment, {
			article_id: this.articleDetail._id,
			user_id,
			content: this.content
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
		this.handleSearch()
	}

	//在组件销毁前重置meta
	//后续改用vue-meta重构
	beforeDestroy() {
		document.title = 'title'
		document.getElementById('keywords').setAttribute('content', '关键字')
		document.getElementById('description').setAttribute('content', '描述')
	}

	private async handleSearch(): Promise<void> {
		this.isLoading = true
		const data: any = await this.$https.post(
			this.$urls.getArticleDetail,
			this.params
		)
		this.isLoading = false

		this.articleDetail = data
		const article = markdown.marked(data.content)
		article.then((res: any) => {
			this.articleDetail.content = res.content
			this.articleDetail.toc = res.toc
		})
		let keyword = data.keyword.join(',')
		let description = data.desc
		let title = data.title
		document.title = title
		document.getElementById('keywords').setAttribute('content', keyword)
		document.getElementById('description').setAttribute('content', description)
	}

	async likeArticle(): Promise<void> {
		if (!this.articleDetail._id) {
			this.$message({
				message: '该文章不存在',
				type: 'warning'
			})
			return
		}
		if (this.likeTimes > 0) {
			this.$message({
				message: '已点过赞',
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

		let params: LikeParams = {
			id: this.articleDetail._id,
			user_id
		}
		await this.$https.post(this.$urls.likeArticle, params)
		this.isLoading = false

		this.likeTimes++
		++this.articleDetail.meta.likes
		this.$message({
			message: '操作成功',
			type: 'success'
		})
	}
}
</script>
<style lang="scss" scoped>
.anchor {
	display: block;
	// stickyn粘性定位
	position: sticky;
	top: 213px;
	margin-top: 213px;
	border-left: 1px solid #eeeeee;
	.anchor-ul {
		position: relative;
		top: 0;
		max-width: 250px;
		border: none;
		box-shadow: 0 0px 0px #ffffff;
		li.active {
			color: #009a61;
		}
	}
	a {
		color: #333;
	}
}
.article {
	width: 100%;
	.header {
		.title {
			margin: 20px 0 0;
			text-align: center;
			font-size: 34px;
			font-weight: bold;
		}
		.author {
			position: relative;
			margin: 30px 0 40px;
			padding-left: 50px;
			.avatar {
				position: absolute;
				left: 0;
				top: 0;
				width: 48px;
				height: 48px;
				vertical-align: middle;
				display: inline-block;
				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.info {
				float: left;
				vertical-align: middle;
				// display: inline-block;
				margin-left: 8px;
				a {
					color: #333;
				}
			}
			.name {
				margin-right: 3px;
				font-size: 16px;
				vertical-align: middle;
			}
			.meta {
				margin-top: 5px;
				font-size: 12px;
				color: #969696;
				span {
					padding-right: 5px;
				}
			}
			.tags {
				float: right;
				padding-top: 15px;
				// padding-right: 20px;
				.tag {
					// padding: 0 10px;
					margin-left: 5px;
					border-right: 2px solid #eee;
				}
			}
		}
	}
	.content {
		min-height: 300px;
	}
}
.heart {
	height: 60px;
	text-align: center;
	margin: 50px;
}
.loader {
	color: rgb(226, 44, 44);
	text-align: center;
	padding: 50px;
	font-size: 16px;
}
.clearfix {
	clear: both;
}
</style>