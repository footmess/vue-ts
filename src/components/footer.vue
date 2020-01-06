<template>
	<div class="footer">足球小将 @2020 Create by tony</div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Footer extends Vue {}
</script>
<style lang="scss" scoped>
.footer {
	text-align: center;
	font-size: 20px;
	font-weight: bold;
}
</style>