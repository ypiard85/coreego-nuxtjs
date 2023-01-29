<template>
  <div>
    <el-card class="box-card"  shadow="never">
      <div slot="header">
        <slot name="edit" />
        <div class="d-flex align-items-center">
          <el-avatar class="me-3" src="https://firebasestorage.googleapis.com/v0/b/coreego-35f6d.appspot.com/o/avatars%2FSuaYK1w1rVUT0Fb720WVTkOD4j4273242?alt=media&token=83e35f12-fecb-4fd1-b06d-cf7dd0b16e01" />
          <p class="fw-bold text-blue">Yoann piard</p>
        </div>
        <small class="time text-secondary"> Lundi 1 janvier 2022 à 20:10 </small>
      </div>
      <div class="bottom text item">
        Ce lieux est vraiment à visiter, hier je suis allé à cette endroit, c'est vraiment incroyable
      </div>
    </el-card>
  </div>
</template>

<script>
  export default{
    name: 'commentaire',

    data(){
      return{

      }
    }

  }
</script>

<style scoped lang="scss">
 ::v-deep .el-card__header{
    padding: 10px 20px;
  }
</style>