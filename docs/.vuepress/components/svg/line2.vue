<template>
  <div class="svg-wrap">
    <svg width="300" height="200">
      <line x1="0" y1="0" x2="300" y2="200" style="stroke:rgb(99,99,99);stroke-width:2" />
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
  name: "svg-line2",
  data() {
    return {};
  }
};
</script>


