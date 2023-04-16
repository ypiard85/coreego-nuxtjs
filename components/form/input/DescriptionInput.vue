<template>
  <el-input
    placeholder="Petite description"
    :rows="10"
    type="textarea"
    :value="value"
    @input="$emit('input', $event)"
  ></el-input>
</template>

<script>
export default {
   name: 'description-input',

   props:{
      value:{
         type: String,
         required: true,
      }
   }
}
</script>