<template>
  <div class="svg-wrap">
    <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="none"
        stroke="lightgrey"
        d="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"
      />

      <circle r="5" fill="red">
        <animateMotion
          dur="10s"
          repeatCount="indefinite"
          path="M20,50 C20,-50 180,150 180,50 C180-50 20,150 20,50 z"
        />
      </circle>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.svg-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  width: 200px;
  height: 100px;
  svg {
    width: 100%;
    background: transparent;
    fill: rgb(random(255), random(255), random(255));
  }
}
</style>

<script>
export default {
  name: "svg-animate3",
  data() {
    return {};
  }
};
</script>


