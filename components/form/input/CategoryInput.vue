<template>
  <el-select
    filterable
    placeholder="Categories"
    :value="value"
    @input="$emit('input', $event)"
  >
    <el-option
      v-for="option in options"
      :key="option.id"
      :value="option.id"
      :label="option.name"
    />
  </el-select>
</template>

<script>
export default {
   name: "category-input",

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
