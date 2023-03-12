<template>
  <div class="d-flex align-items-center vui-city-category">
    <span class="me-2 text-secondary city d-flex align-items-center">
      <i class="el-icon-location-outline me-1"></i>
      {{ city.label }}
    </span>
    <vui-tag class="category" :label="category.name" :color="category.color" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VuiTagVue from './VuiTag.vue'
export default {
  name: 'VuiCityCategory',

  components: {
    VuiTagVue,
  },

  props: {
    place: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  computed: {
    ...mapGetters('app', { categories: 'getCategories', cities: 'getCities' }),

    category() {
      return (
        this.place &&
        this.categories.find((category) => category.id === this.place.category)
      )
    },

    city() {
      return this.cities.find((city) => city.id === this.place.city)
    },
  },
}
</script>

<style scoped lang="scss">
  .vui-city-category{
    .city{
        i{
          font-weight: bold;
          font-size: 24px;
        }
      }
      .category{

      }

  }
</style>
