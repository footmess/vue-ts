<template>
    <div>
        <i v-show="isShowBtn" class="el-icon-arrow-up" @click="topFunction"></i>
    </div>
</template>
<script lang="ts">
import {Vue,Component} from "vue-property-decorator"

@Component
export default class ArrowUp extends Vue {
   private isShowBtn:boolean = false

   mounted () {
       // 当下滑超过100px出现返回顶部按钮
       window.onscroll = ():void => {
           if(window.document.body.scrollTop > 100 || window.document.documentElement.scrollTop > 100) {
               this.isShowBtn = true
           }else {
               this.isShowBtn = false
           }
       }
   }

   private topFunction():void {
       document.body.scrollTop = 0
       document.documentElement.scrollTop = 0
   }
}
</script>
<style lang="scss">
.el-icon-arrow-up {
    position: fixed;
    bottom: 50px;
    right: 40px;
    z-index: 99;
    border: none;
    outline: none;
    background-color: rgb(119, 118, 118);
    cursor: pointer;
    padding: 15px;
    color: white;
    border-radius: 50%;
}
.el-icon-arrow-up:hover {
    background-color: #555
}
</style>