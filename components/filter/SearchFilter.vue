<template>
  <el-input placeholder="Rechercher un lieu" :value="value" @input="$emit('input', $event)" trim="trim" clearable="clearable"/>
</template>

<script>
  export default {
    name: "SearchFilter",
    props: {
      value: {
        type: String,
        required: false,
        default: ''
      }
    }

  }
</script>

<style lang=""></style>
