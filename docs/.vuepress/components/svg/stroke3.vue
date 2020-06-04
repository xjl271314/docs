<template>
  <div class="svg-wrap">
    <svg width="300" height="70">
      <g fill="none" stroke="black" stroke-width="6">
        <path stroke-linecap="butt" d="M5 20 l215 0" />
        <path stroke-linecap="round" d="M5 40 l215 0" />
        <path stroke-linecap="square" d="M5 60 l215 0" />
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
  name: "svg-stroke3",
  data() {
    return {};
  }
};
</script>


