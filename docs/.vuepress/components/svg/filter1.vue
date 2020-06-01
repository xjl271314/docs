<template>
  <div class="svg-wrap">
    <svg width="200" height="100"> 
      <defs>
        <filter id="f1" x="0" y="0">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
        </filter>
      </defs>
      <rect x="60" y="10" width="80" height="80" stroke="green" stroke-width="3" fill="yellow" filter="url(#f1)" />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.svg-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  svg{
      background: #ccc;
  }
}
</style>

<script>
export default {
  name: "svg-filter1",
  data() {
    return {};
  }
};
</script>


