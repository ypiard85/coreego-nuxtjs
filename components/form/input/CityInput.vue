<template>
  <el-select
    filterable
    placeholder="Provinces"
    :value="value"
    @input="$emit('input', $event)"
  >
    <el-option
      v-for="option in options"
      :key="option.id"
      :value="option.id"
      :label="option.label"

    />
  </el-select>
</template>

<script>
export default {
   name: "city-input",

   props:{
      options:{
         type: Array,
         required: true
      },
      value:{
         required: true
      }
   }
}
</script>

<style></style>
