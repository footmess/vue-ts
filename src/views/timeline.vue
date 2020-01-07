<template>
	<div class="timeline left">
		<el-timeline>
			<el-timeline-item
				v-for="(item, index) in list"
				:key="index"
				:color="item.state === 1 ? 'green' : item.state === 3 ? 'red' : ''"
				placement="top"
				hide-timestamp
			>
				<el-card>
					<h3>{{ item.title }}</h3>
					<p>{{ item.content }}</p>
					<p>
						<span>{{ timestampToTime(item.start_time) }}--</span>
						<span>{{ timestampToTime(item.end_time) }}</span>
					</p>
				</el-card>
			</el-timeline-item>
		</el-timeline>
		<LoadingCustom v-if="isLoading"></LoadingCustom>
		<LoadEnd v-if="isLoadEnd"></LoadEnd>
	</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
	timestampToTime,
	getScrollTop,
	getDocumentHeight,
	getWindowHeight
} from '@/utils/utils'
import LoadingCustom from '@/components/loading.vue'
import LoadEnd from '@/components/loadEnd.vue'
import { Params, TimelineList, TimelinesData } from '@/types/index'
@Component({
	components: {
		LoadingCustom,
		LoadEnd
	}
})
export default class Timeline extends Vue {
	private isLoadEnd: boolean = false
	private isLoading: boolean = false
	private list: Array<TimelineList> = []
	private total: number = 0
	private params: Params = {
		keywords: '',
		pageNum: 1,
		pageSize: 10
	}

	mounted() {
		this.handleSearch()
		window.onscroll = () => {
			if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 150) {
				if (this.isLoadEnd === false && this.isLoading === false) {
					this.handleSearch()
				}
			}
		}
	}

	private async handleSearch(): Promise<void> {
		this.isLoading = true
		const data: TimelinesData = await this.$https.get(
			this.$urls.getTimeAxisList,
			{
				params: this.params
			}
		)
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
.timeline {
	padding: 40px 0;
	.year {
		font-size: 34px;
		font-weight: bold;
		color: #000;
	}
	a {
		text-decoration: none;
	}
	.title {
		color: #333;
		&:hover {
			color: #1890ff;
		}
	}
}
</style>