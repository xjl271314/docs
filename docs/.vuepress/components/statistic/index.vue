<template>
  <div class="statistic-container">
    <span>访问量：{{ this.visitNum }}</span>
    <span>点赞量：{{ this.likeNum }}</span>
    <button @click="handleLike" :disabled="isDisabled">点赞</button>
  </div>
</template>
<script>
  export default {
    name: 'statistic',
    data(){
      return{
        key:'cfba00864a7da46d',
        visitNum: 0,
        likeNum: 0,
        isDisabled: false,
      }
    },
    methods:{
      handleLike(){
        ViLike.like(this.key,(like)=>{
          // 点赞数即时更新
          this.likeNum = like
          // 点击后按钮状态应为Disabled
          this.isDisabled = true
        })
      }
    },
    mounted() {
      console.log('page-editor')
      ViLike.get(this.key,(visit,like,islike)=>{
        // 访问量
        this.visitNum = visit
        // 点赞数
        this.likeNum = like
        // 点赞按钮逻辑
        if (islike){
          this.isDisabled = true
        }
      });
    },
  }
</script>