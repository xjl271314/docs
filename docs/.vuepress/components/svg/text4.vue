<template>
  <div class="svg-wrap">
    <svg with="300" height="80">
      <text x="10" y="20" style="fill:green;">
        Several lines:
        <tspan x="30" y="45">First line</tspan>
        <tspan x="30" y="70">Second line</tspan>
      </text>
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
  name: "svg-text4",
  data() {
    return {};
  }
};
</script>


