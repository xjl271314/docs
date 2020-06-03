<template>
  <div class="svg-wrap">
    <svg width="300" height="30">
      <a xlink:href="https://www.baidu.com" target="_blank">
        <text x="0" y="15" fill="blue">I am superLink text</text>
      </a>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.svg-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
}
</style>

<script>
export default {
  name: "svg-text5",
  data() {
    return {};
  }
};
</script>


