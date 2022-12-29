<template>
  <div
    :style="{ height: size + 'px', width: size + 'px', background: color }"
    class="bullet"
  ></div>
</template>
<script>
export default {
  props: {
    size: {
      type: Number,
      required: false,
      default: 24,
    },

    color: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.bullet {
  border-radius: 50%;
}
</style>
