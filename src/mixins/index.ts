// https://github.com/vuejs/vue-class-component#using-mixins
import { timestampToTime } from '@/utils/utils';

//全局混入，为timestampToTime指定默认true
let mixin = {
	methods: {
		formatTime(value: string | Date): string {
			return timestampToTime(value, true);
		}
	}
};

export default mixin;
