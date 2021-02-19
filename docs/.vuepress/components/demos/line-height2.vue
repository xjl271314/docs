<template>
  <div class="box">
    <div class="content">
      基于行高实现的内联元素垂直居中,需要使用 vertical-align 辅助实现。
    </div>
  </div>
</template>

<style scoped lang="scss">
.box {
  width: 400px;
  line-height: 80px;
  background: #f0f3f9;
}

.content {
  display: inline-block;
  line-height: 20px;
  margin: 0 20px;
  vertical-align: middle;
}
</style>

<script>
export default {
  name: "demo2",
  data() {
    return {
      className: "",
    };
  },
  mounted() {},
};
</script>


