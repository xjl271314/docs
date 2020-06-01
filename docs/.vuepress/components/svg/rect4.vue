<template>
  <div class="svg-wrap">
    <svg width="400" height="200">
        <rect x="0" y="0" width="200" height="200" style="fill:blue;"/>
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
    background: #CCC;
  }
}
</style>

<script>
export default {
  name: "svg-rect4",
  data() {
    return {};
  }
};
</script>


