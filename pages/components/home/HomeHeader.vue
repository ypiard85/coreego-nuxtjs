<template>
  <header class="d-flex align-items-center" :style="{ 'background-image' : 'url(' + IMG_HOME_PAGE_HEADER + ')' }">
    <b-container>
      <div class="header-title">
        <h2 class="text-white">
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
    height: 50vh;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: bottom;

    .header-title {
      width: 500px;
      max-width: 100%;
    }

    h2 {
      text-shadow: 0px 0px 5px black;
    }
  }
</style>