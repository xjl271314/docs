<template>
  <div class="svg-wrap">
    <svg width="300" height="70">
      <g fill="none" stroke="black" stroke-width="4">
        <path stroke-dasharray="5 5" d="M5 20 l215 0" />
        <path stroke-dasharray="10 10" d="M5 40 l215 0" />
        <path stroke-dasharray="20 10 5 5 5 10" d="M5 60 l215 0" />
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
  name: "svg-stroke4",
  data() {
    return {};
  }
};
</script>


