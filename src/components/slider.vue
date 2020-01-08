<template>
	<div class="right slider">
		<img class="right-logo" src="@/assets/userLogo.png" alt="" />
		<div class="title">秦时明月</div>
		<div class="right-content">
			<!-- <div class="item">
				<div class="num">123</div>
				粉丝
			</div>
			<div class="item">
				<div class="num">123</div>
				文章
			</div>
			<div class="item">
				<div class="num">123</div>
				字数
			</div>
			<div class="item">
				<div class="num">123</div>
				收获喜欢
			</div> -->
		</div>
		<div class="tags">
			<div class="title">标签云</div>
			<router-link
				v-for="(item, index) in list"
				:key="index"
				class="item"
				:to="
					`/articles?tags_id=${item._id}&tags_name=${item.name}&category_id=`
				"
				><span :key="item._id">{{ item.name }}</span></router-link
			>
		</div>
		<div class="introduce">
			<div class="title">野狼disco</div>
			<div class="content">
				<img src="@/assets/user.png" alt="前端小白" />
			</div>
		</div>
		<div class="classification">
			<div class="title">七匹狼</div>
			<div class="content">
				<img src="@/assets/tony.png" alt="硬核" />
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Params, TagsData } from '@/types/index'

@Component
export default class Slider extends Vue {
	private isLoadEnd: boolean = false
	private isLoading: boolean = false
	private list: Array<object> = []
	private total: number = 0
	private params: Params = {
		keywords: '',
		pageNum: 1,
		pageSize: 100
	}

	mounted() {
		this.handleSearch()
	}

	private async handleSearch(): Promise<void> {
		this.isLoading = true
		const data: TagsData = this.$https.get(this.$urls.getTagList, {
			params: this.params
		})
		this.isLoading = false

		this.list = [...this.list, ...data.list]
		this.total = data.count
		this.params.pageNum++
		if (this.total === this.list.length) {
			this.isLoadEnd = true
		}
	}
}
</script>
<style lang="scss" scoped>
.slider {
	padding-top: 50px;
}
.right {
	text-align: center;
	.right-logo {
		width: 130px;
		border-radius: 50%;
		animation: mylogo 3s infinite;
	}
	.title {
		font-size: 25px;
		font-weight: bold;
	}
	.right-content {
		padding: 10px 0 20px 0;
		margin-bottom: 10px;
		border-bottom: 1px solid #eee;
		.item {
			display: inline-block;
			padding: 0 10px;
			color: #969696;
			border-right: 1px solid #eee;
			&:last-child {
				border-right: none;
			}
			.num {
				color: #333;
			}
		}
	}
	.introduce {
		margin-bottom: 10px;
		border-bottom: 1px solid #eee;
		.title {
			font-size: 14px;
			color: #969696;
		}
		.content {
			color: #333;
			line-height: 26px;
			text-align: left;
			padding: 20px 0;
		}
		.footer {
			padding-bottom: 10px;
		}
	}
	.tags {
		min-height: 200px;
		padding: 5px 0 20px 0;
		margin-bottom: 10px;
		border-bottom: 1px solid #eeeeee;
		.title {
			font-size: 14px;
			color: #969696;
		}
		.item {
			display: inline-block;
			cursor: pointer;
			padding: 5px 10px;
			border-radius: 5px;
			background-color: #eee;
			color: #333;
			margin: 10px 10px 0 0;
			text-decoration: none;
			&:hover {
				color: #409eff;
			}
		}
	}
	.classification {
		padding: 5px 0 20px 0;
		.title {
			font-size: 14px;
			color: #969696;
		}
	}
	@keyframes mylogo {
		0% {
			transform: rotate(0deg) scale(0.8, 0.8);
			opacity: 1;
		}
		25% {
			transform: rotate(0deg) scale(1, 1);
			opacity: 0.8;
		}
		100% {
			transform: rotate(0deg) scale(0.8, 0.8);
			opacity: 1;
		}
	}
}
</style>