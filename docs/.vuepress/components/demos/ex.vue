<template>
  <div class="box">
    显示全部内容
    <div class="arrow-down" />
  </div>
</template>

<style scoped lang="scss">
.box {
  padding: 10px;
  background: skyblue;
  color: #fff;
  font-size: 24px;
}
.arrow-down {
  display: inline-block;
  width: 24px;
  height: 1ex;
  background: url("../images/arrow-down.png") no-repeat center / cover;
}
</style>

<script>
export default {
  name: "exDemo1",
  data() {
    return {
      className: "",
    };
  },
  mounted() {},
};
</script>


