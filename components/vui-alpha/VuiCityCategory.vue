<template>
  <div class="d-flex align-items-center vui-city-category">
    <span class="me-2 text-secondary fw-bold"
      ><i class="el-icon-location-outline"></i>{{ city.label }}</span
    >
    <vui-tag :label="category.name" :color="category.color" />
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
       return this.place && this.categories.find(
         (category) => category.id === this.place.category
       )
     },

    city() {
      return this.cities.find((city) => city.id === this.place.city)
    },
  },
}
</script>

<style></style>
