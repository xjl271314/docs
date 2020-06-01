<template>
  <div class="svg-wrap">
    <svg width="320" height="300">
      <polygon
        points="220,100 300,210 170,250"
        style="fill:#cccccc;stroke:#000000;stroke-width:1"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.svg-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  svg {
    background: #ccc;
  }
}
</style>

<script>
export default {
  name: "svg-polygon1",
  data() {
    return {};
  }
};
</script>


