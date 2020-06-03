<template>
  <div class="svg-wrap">
    <svg width="300" height="100">
        <text x="0" y="15" fill="black" transform="rotate(30 20,40)">I am transform svg text</text>
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
  name: "svg-text2",
  data() {
    return {};
  }
};
</script>


