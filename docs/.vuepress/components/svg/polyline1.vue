<template>
  <div class="svg-wrap">
    <svg width="300" height="200">
        <polyline points="100,100 100,120 120,120 120,140 140,140 140,160"
style="fill:none;stroke:red;stroke-width:2"/>
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
  name: "svg-polyline1",
  data() {
    return {};
  }
};
</script>


