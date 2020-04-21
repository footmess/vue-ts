<template>
	<div class="left clearfix">
		<h3 v-if="params.tag_id" class="left-title">{{ tag_name }} 相关的文章：</h3>
		<ul class="articles-list" id="list">
			<transition-group name="el-fade-in">
				<li class="item" v-for="(item, index) in articlesList" :key="index">
					<a :href="`${href}${article._id}`" target="_blank">
						<img
							:data-src="article.img_url"
							data-has-lazy-src="false"
							src="@/assets/bg.png"
							alt="文章封面"
							class="wrap-img img-blur-done"
						/>
						<div class="content">
							<h4 class="title">{{ article.title }}</h4>
							<p class="abstract">{{ article.desc }}</p>
							<div class="meta">
								<span>查看 {{ article.meta.views }}</span>
								<span>评论 {{ article.meta.comments }}</span>
								<span>赞 {{ article.meta.likes }}</span>
								<span v-if="article.create_time" class="time">{{
									formatTime(article.create_time)
								}}</span>
							</div>
						</div>
					</a>
				</li>
			</transition-group>
		</ul>
		<loading-custom v-if="isLoading" />
		<load-end v-if="isLoadEnd" />
	</div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import LoadingCustom from '@/components/loading.vue'
import LoadEnd from '@/components/loadEnd.vue'
import { ArticlesParams, ArticlesData } from '@/types/index'
import {
	throttle,
	getQueryStringByName,
	getScrollTop,
	getDocumentHeight,
	getWindowHeight,
	timestampToTime
} from '@/utils/utils'

//获取可视区域的高度   (clientheight=padding+height-横向滚动轴高度)
const viewHeight =
	window.innerHeight ||
	document.documentElement.clientHeight ||
	document.body.clientHeight
//用throttle包装scroll的回调
const lazyload = throttle(() => {
	const imgs = document.querySelectorAll('#list .item img')
	//num用来标记当前显示哪一张图片
	let num = 0
	for (let i = num; i < imgs.length; i++) {
		//可视区域高度减去元素距离可视区域顶部的高度
		let distance = viewHeight - imgs[i].getBoundingClientRect().top
		let imgItem: any = imgs[i]
		//如果可视区域高度大于元素距离可视区域的高度，说明在可视区域内
		if (distance > 100) {
			//把data-src赋值给src显示图片
			let hasLaySrc = imgItem.getAttribute('data-has-lazy-src')
			if (hasLaySrc === 'false') {
				imgItem.src = imgItem.getAttribute('data-src')
				imgItem.setAttribute('data-has-lazy-src', 'true')
			}
			//前i张图片已经加载，下次从第i+1张开始检查
			num = i + 1
		}
	}
}, 1000)
@Component({
	components: {
		LoadingCustom,
		LoadEnd
	}
})
export default class Articles extends Vue {
	private isLoadEnd: boolean = false
	private isLoading: boolean = false
	private articlesList: Array<object> = []
	private total: number = 0
	private tag_name: string = decodeURI(getQueryStringByName('tag_name'))
	private params: ArticlesParams = {
		keyword: '',
		likes: '',
		state: 1,
		tag_id: getQueryStringByName('tag_id'),
		category_id: getQueryStringByName('category_id'),
		pageNum: 1,
		pageSize: 10
	}
	private href: string =
		process.env.NODE_ENV === 'development'
			? 'http://localhost:3001/articleDetail?article_id='
			: 'https:url'

	mounted(): void {
		this.handleSearch()
		window.onscroll = () => {
			if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 150) {
				if (this.isLoadEnd === false && this.isLoading === false) {
					this.handleSearch()
				}
			}
		}
		document.addEventListener('scroll', lazyload)
	}

	@Watch('$route')
	routeChange(val: Route, oldVal: Route): void {
		this.tag_name = decodeURI(getQueryStringByName('tag_name'))
		this.params.tag_id = getQueryStringByName('tag_id')
		this.params.category_id = getQueryStringByName('category_id')
		this.articlesList = []
		this.params.pageNum = 1
		this.handleSearch()
	}

	private async handleSearch(): Promise<void> {
		this.isLoading = true
		const data: ArticlesData = await this.$https.get(
			this.$urls.getArticleList,
			{
				params: this.params
			}
		)
		this.isLoading = false
		this.articlesList = [...this.articlesList, ...data.list]
		this.total = data.count
		this.params.pageNum++
		this.$nextTick(() => {
			lazyload()
		})
		if (data.list.length === 0 || this.total === this.articlesList.length) {
			this.isLoadEnd = true
			//事件注销
			//这里可能会有问题 this
			// document.removeEventListener('scroll',() => {})
			document.removeEventListener('scroll', lazyload)
			window.onscroll = null
		}
	}
}
</script>
<style lang="scss" scoped>
.left {
	.articles-list {
		margin: 0;
		padding: 0;
		list-style: none;
		.title {
			color: #333;
			margin: 7px 0 4px;
			display: inherit;
			font-size: 18px;
			font-weight: 700;
			line-height: 1.5;
		}
		.item > div {
			padding-right: 140px;
		}
		.item .wrap-img {
			position: absolute;
			top: 50%;
			margin-top: -50px;
			right: 0;
			width: 125px;
			height: 100px;
			img {
				width: 100%;
				height: 100%;
				border-radius: 4px;
				border: 1px solid #f0f0f0;
			}
		}
		li {
			line-height: 20px;
			position: relative;
			padding: 15px 0;
			padding-right: 150px;
			border-bottom: 1px solid #f0f0f0;
			word-wrap: break-word;
			cursor: pointer;
			&:hover {
				.title {
					color: #f0f0f0;
				}
			}
			.abstract {
				min-height: 30px;
				margin: 0 0 8px;
				font-size: 13px;
				line-height: 24px;
				color: #555;
			}
			.meta {
				padding-right: 0 !important;
				font-size: 12px;
				font-weight: 400;
				line-height: 20px;
				a {
					margin-right: 10px;
					color: #b4b4b4;
					&:hover {
						transition: 0.1s ease-in;
					}
				}
				span {
					margin-right: 10px;
					color: #666;
				}
			}
		}
	}
}
</style>