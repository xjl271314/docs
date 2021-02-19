<template>
  <div class="box">
    <div class="box1">我的line-height为0,font-size为18px;</div>
    <div class="box2">我的line-height为18px,font-size为0;</div>
  </div>
</template>

<style scoped lang="scss">
.box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  .box1 {
    width: 300px;
    margin-top: 30px;
    margin-bottom: 30px;
    font-size: 18px;
    line-height: 0;
    background: #eee;
    border: 1px solid #ccc;
  }

  .box2 {
    width: 300px;
    font-size: 0;
    line-height: 18px;
    background: #eee;
    border: 1px solid #ccc;
  }
}
</style>

<script>
export default {
  name: "demo1",
  data() {
    return {
      className: "",
    };
  },
  mounted() {},
};
</script>


