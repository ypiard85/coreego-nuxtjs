<template>
  <div class="home-page">
    <HomeHeader />
    <section v-if="places.length > 0">
      <b-container>
        <p class="label h5 mb-3">Quelques lieux :</p>
        <simple-swiper :max="maxPlace" :slidesPerView="3" :spaceBetween="30" :navigation="false" :pagination="true" :delay="3000" />
      </b-container>
    </section>
    <!-- <AboutUs :categories="categories" /> -->
  </div>
</template>

<script>
  import HomeHeader from './components/home/HomeHeader'
  import AboutUs from './components/home/AboutUs'
  import SimpleSwiper from '@/components/swiper/simpleSwiper'
  import { mapGetters } from 'vuex'
  export default {
    name: 'HomePage',
    components: { HomeHeader, AboutUs, SimpleSwiper },

    computed: {
      ...mapGetters('app', { categories: 'getCategories', places: 'getPlaces' }),

      maxPlace(){
        return this.places.length > 6 ? 6 : this.places.length
      }

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