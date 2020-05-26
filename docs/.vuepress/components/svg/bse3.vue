<template>
  <div class="svg-wrap">
    <!--二次贝塞尔曲线-->
    <svg width="190px" height="160px" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 80 Q 95 10 180 80" stroke="black" fill="transparent" />
      <!--Points-->
      <circle cx="10" cy="80" r="2" fill="red" />
      <circle cx="95" cy="10" r="2" fill="red" />
      <circle cx="180" cy="80" r="2" fill="red" />
      <line x1="10" y1="80" x2="95" y2="10" style="stroke:rgb(255,0,0);stroke-width:1" />
      <line x1="95" y1="10" x2="180" y2="80" style="stroke:rgb(255,0,0);stroke-width:1" />
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
  name: "svg-bse3",
  data() {
    return {};
  }
};
</script>


