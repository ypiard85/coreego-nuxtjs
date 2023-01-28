<template>
  <header class="d-flex align-items-center" :style="{ 'background-image' : 'url(' + IMG_HOME_PAGE_HEADER + ')' }">
    <b-container class="d-flex flex-column align-items-center justify-content-between">
      <div class="header-title shadow rounded">
        <h2 class="text-center w-100 text-white">
          Découvrir la Corée Du Sud n'a jamais été aussi facile
        </h2>
      </div>
      <nuxt-link to="/places">
        <el-button class="mt-3" type="success" native-type="link">
          Voir les lieux disponibles
        </el-button>
      </nuxt-link>
    </b-container>
  </header>
</template>

<script>
  import { IMG_HOME_PAGE_HEADER } from '~/utils/variables'
  export default {
    name: 'home-header',
    data() {
      return {
        IMG_HOME_PAGE_HEADER,
      }
    }
  }
</script>

<style lang="scss" scoped>
  header {
    height: 60vh;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    backdrop-filter: blur(5px);

    .header-title {
      width: 500px;
      max-width: 100%;
      margin: auto;
      background: $blue-principal;
      padding: 10px;
    }

    h2 {
      text-shadow: 0px 0px 5px black;
    }
  }
</style>