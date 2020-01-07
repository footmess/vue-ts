<template>
	<div class="load-end">--------- 我也是有底线的啦 ---------</div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class LoadEnd extends Vue {}
</script>
<style lang="scss" scoped>
.load-end {
	text-align: center;
	padding: 30px;
}
</style>