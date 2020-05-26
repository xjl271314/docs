<template>
  <div class="svg-wrap">
    <svg width="190" height="160" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M130 110 C 120 140, 180 140, 170 110" stroke="black" fill="transparent" />
      <circle cx="130" cy="110" r="2" fill="red" />
      <circle cx="120" cy="140" r="2" fill="red" />
      <line x1="130" y1="110" x2="120" y2="140" style="stroke:rgb(255,0,0);stroke-width:2" />
      <circle cx="180" cy="140" r="2" fill="red" />
      <circle cx="170" cy="110" r="2" fill="red" />
      <line x1="180" y1="140" x2="170" y2="110" style="stroke:rgb(255,0,0);stroke-width:2" />
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
  name: "svg-bse1",
  data() {
    return {};
  }
};
</script>


