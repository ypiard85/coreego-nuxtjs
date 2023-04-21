<template>
   <div class="drawer-topic">
      <section class="drawer-topic__diapo">
            <el-image :src="topic.images[0]" fit="cover"></el-image>
      </section>
      {{topic.title}}
   </div>
</template>

<script>
export default {
   name: 'drawer-topic',

   props:{
      topic:{
         type: Object,
         required: true
      }
   }
}
</script>

<style scoped lang="scss">
::v-deep .drawer-topic{
      &__diapo{
         height: 200px;
         width: 100%;
         .el-image{
            height: 100%;
            width: 100%;
            img{
               object-position: center;
            }
         }
      }
   }
</style>