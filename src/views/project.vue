<template>
	<div class="project left">
		<el-row :gutter="20">
			<el-col
				:span="isMobile ? 24 : 12"
				class="el-col-pointer"
				v-for="(item, index) in list"
				:key="index"
				style="maring-bottom:20px"
			>
				<a :href="item.url" target="_blank" ref="noopener noreferrer">
					<el-card shadow="hover">
						<img :src="item.img" alt="" class="image" />
						<div class="content">
							<h4>{{ item.title }}</h4>
							<p>{{ item.content }}</p>
							<span>{{ timestampToTime(item.start_time) }}--</span>
							<span>{{ timestampToTime(item.end_time) }}</span>
						</div>
					</el-card>
				</a>
			</el-col>
		</el-row>
		<LoadingCustom v-if="isLoading"></LoadingCustom>
		<LoadEnd v-if="isLoadEnd"></LoadEnd>
	</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import LoadingCustom from '@/components/loading.vue'
import LoadEnd from '@/components/loadEnd.vue'
import {
	timestampToTime,
	getScrollTop,
	getDocumentHeight,
	getWindowHeight,
	isMobile
} from '@/utils/utils'
import { Params, ProjectList, ProjectsData } from '@/types/index'
@Component({
	components: {
		LoadingCustom,
		LoadEnd
	}
})
export default class Project extends Vue {
	private isLoadEnd: boolean = false
	private isLoading: boolean = false
	private isMobile: boolean = isMobile()
	private list: Array<ProjectList> = []
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
		const data: ProjectsData = await this.$https.get(
			this.$urls.getProjectList,
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
.project {
  overflow: hidden;
  padding: 40px 0;
  .el-col-pointer {
    cursor: pointer;
  }
  .content p {
    height: 70px;
    text-overflow: ellipsis;
  }
  .image {
    width: 100%;
    height: 250px;
  }
}
</style>