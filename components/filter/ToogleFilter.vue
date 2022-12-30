<template>
  <el-button :size="size" @click="$emit('click')">
    {{label}}
  </el-button>
</template>
<script>
  export default {
    name: 'ToogleFilter',
    props: {
      value: {
        type: Boolean,
        required: false
      },
      label: {
        type: String,
        required: true
      },
      size: {
        type: String,
        required: false,
        default: 'small'
      }
    },
  }
</script>
<style scoped lang="scss">

</style>