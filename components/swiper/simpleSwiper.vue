<template>
      <div class="swiper">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
          <!-- Slides -->
          <nuxt-link :to=" '/places/view/' + place.id " class="swiper-slide shadow" v-for="place in placesRandom">
            <el-image fit="cover" :src="place.thumbnail.url"></el-image>
            <strong class="d-block text-truncate text-dark">{{ place.title }} </strong>
            <div class="d-flex">
              <p class="me-2 text-secondary"><i class="el-icon-location-outline"></i>{{ city(place.city).label }}</p>
              <vui-tag :color="category(place.category).color" :label="category(place.category).name" />
            </div>
          </nuxt-link>
        </div>
        <template v-if="navigation">
          <div class="swiper-button-next"></div>
          <div class="swiper-button-prev"></div>
        </template>
        <template v-if="pagination">
          <div class="swiper-pagination"></div>
        </template>
      </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import VuiTag from '@/components/vui-alpha/VuiTag'

  export default {
    name: "home-places",
    components: {VuiTag},
    props: {
      max: {
        required: false,
        type: Number,
        default: 6
      },
      slidesPerView:{
        required: false,
        type: Number,
        default: 3
      },
      spaceBetween:{
        required: false,
        type: Number,
        default: 15
      },
      delay:{
        required: false,
        type: Number,
      },
      pagination:{
        required: false,
        type: Boolean,
        default: true
      },
      navigation:{
        required: false,
        type: Boolean,
        default: true
      },
    },

    data() {
      return {
        modules: []
      }
    },


    mounted() {
      var swiper = new Swiper(".swiper", {
        loop: false,
        slidesPerView: this.slidesPerView,
        spaceBetween: this.spaceBetween,
        autoplay: this.delay ? {
          delay: this.delay,
        } : false,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
        breakpoints: {
        250: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1200: {
          slidesPerView: 3,
        },
        1700: {
          slidesPerView: 4,
        },
      },
      });
    },


    computed: {
      ...mapGetters("app", { places: 'getPlaces', categories: 'getCategories', cities: 'getCities', users: 'getUsers' }),

      category() {
        return categoryId => {
          return this.categories.find(category => category.id === categoryId)
        }
      },
      city() {
        return cityId => {
          return this.cities.find(city => city.id === cityId)
        }
      },

      placesRandom() {
        let places = []

        while (places.length < this.max) {
          var randomNumber = Math.floor(Math.random() * this.places.length);
          if (!places.includes(randomNumber)) {
            places.push(this.places[randomNumber]);
          }
        }

        return places
      }
    }

  }
</script>

<style scoped lang="scss">
  .swiper {
    height: 300px;
  }

  .swiper-wraper {
    height: 100%;
  }

  .swiper-slide {
    height: 200px;
    font-weight: normal;
    border-radius: 10px;
  }

  .swiper-slide .el-image {
    display: block;
    border-radius: 10px;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>