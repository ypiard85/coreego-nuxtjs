<template>
   <el-button  circle :icon="icon" :type="type" size="small">
      <input type="file" @change="$emit('change-file', $event)" accept=".png, .jpg, .jpeg" class="position-absolute top-0 end-0 start-0 bottom-0" />
   </el-button >
</template>
<script>
export default {
   props:{
      icon:{
         type: String,
         required: false,
         default: null
      },
      type:{
      type: String,
      required: false,
   }
   },
}
</script>
<style lang="scss" scoped >

   button{
      position: relative;

      input{
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      }

   }


</style>