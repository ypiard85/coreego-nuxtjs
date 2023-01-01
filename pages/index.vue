<template>
  <div class="home-page">
    <header role="header de la page d'accueil" class="d-flex align-items-center">
        <b-container>
          <p class="text">
            Avec COREEGO il n'a jamais était aussi facile de visiter la Corée Du Sud.<br>
            Partager, cliquer, découvrer
          </p>
        </b-container>
    </header>
  </div>
</template>

<script>
export default {
  name: 'HomePage',


  computed:{
    descriptionSite(){
      return ''
    }
  }

}
</script>

<style scoped lang="scss">
  .home-page{
    header{
      min-height: 300px;
      background-color: gray;
    }
  }
</style>
