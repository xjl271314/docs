<template>
  <div class="flex-center">
    <div ref="light" class="traffic-light" :class="[className]" />
  </div>
</template>

<style scoped lang="scss">
.flex-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.traffic-light {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  transition: all 0.45s;
}

.green {
  background: green;
}

.red {
  background: red;
}

.yellow {
  background: yellow;
}
</style>

<script>
export default {
  name: "trafficLight",
  data() {
    return {
      className: "",
    };
  },
  mounted() {
    const $light = this.$refs.light;
    let that = this;

    //   const fn = function (){
    //       that.className= "green";
    //       setTimeout(()=>{
    //           that.className= "yellow";
    //           setTimeout(()=>{
    //               that.className= "red";
    //               setTimeout(()=>{
    //                  fn();
    //               },2000)
    //           },1000)
    //       }, 3000)

    //   }

    const fn = function () {
      that.className = "green";
      setTimeout(() => {
        return new Promise((res, rej) => {
          that.className = "yellow";
          res(
            setTimeout(() => {
              return new Promise((res, rej) => {
                that.className = "red";
                setTimeout(() => {
                  res(fn());
                }, 2000);
              });
            }, 1000)
          );
        });
      }, 3000);
    };

    fn();
  },
};
</script>


