<template>
  <div class="svg-wrap">
    <svg width="300" height="50">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgb(255,0,255);stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="75" y="10" width="150" height="30" fill="url(#grad1)" />
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
  name: "svg-lineargradient1",
  data() {
    return {};
  }
};
</script>


