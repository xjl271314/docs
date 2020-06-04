<template>
  <div class="svg-wrap">
    <svg width="300" height="70">
      <g fill="none">
        <path stroke="red" d="M5 20 l215 0" />
        <path stroke="blue" d="M5 40 l215 0" />
        <path stroke="black" d="M5 60 l215 0" />
      </g>
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
  name: "svg-stroke1",
  data() {
    return {};
  }
};
</script>


