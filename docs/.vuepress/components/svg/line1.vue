<template>
  <div class="svg-wrap">
        <svg width="100" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10 H 90 V 90 H 10 L 10 10"/> 
        </svg>
  </div>
</template>

<style scoped lang="scss">
    .svg-wrap{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 50px auto;
        svg{
            background: #CCC;
        }
    }
</style>

<script>
  export default {
    name: 'svg-line1',
    data() {
      return {
       
      }
    }
  }
</script>


