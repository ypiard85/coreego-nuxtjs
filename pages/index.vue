<template>
  <div class="home-page">
    Page d'accueil
  </div>
</template>

<script>
  import SimpleSwiper from '@/components/swiper/simpleSwiper'
  import { mapGetters } from 'vuex'
  export default {
    name: 'HomePage',
    components: { SimpleSwiper },

    computed: {
      ...mapGetters('app', { categories: 'getCategories' }),
    }

  }
</script>

<style scoped lang="scss">
  .home-page {

    section {
      margin: 30px 0;
    }

  }
</style>