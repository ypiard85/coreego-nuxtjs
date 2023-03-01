<template>
  <div>
    <!-- Filtre -->
    <filter-places
      v-if="filter"
      @change-search-value="search = $event"
      @filter-by-date="byDate = $event"
      @filter-by-city="byCity = $event"
      @filter-by-category="byCategory = $event"
      @filter-by-user="byUser = $event"
      :byDate="byDate"
      :byCity="byCity"
      :byCategory="byCategory"
      :byUser="byUser"
    />
    <!-- Conent -->
    <b-container fluid="sm" v-if="places">
      <template v-if="places.length > 0">
        <el-row :gutter="10">
          <el-col
            :xs="24"
            :sm="12"
            :md="12"
            :lg="8"
            class="mb-2"
            v-for="(place, i) in places"
            :key="i"
          >
            <card-place :place="place" />
          </el-col>
        </el-row>
      </template>
      <el-empty description="Aucun lieu trouvé" v-else></el-empty>
    </b-container>
    <slot name="loading" v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VuiSearchInput from '~/components/vui-alpha/input/VuiSearchInput'
import CardPlace from '~/components/card/CardPlace'
import FilterPlaces from '../components/FilterPlaces'
import { mapActions } from 'vuex'

export default {
  name: 'places',

  props: {
    filter: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  components: {
    VuiSearchInput,
    CardPlace,
    FilterPlaces,
  },
  data() {
    return {
      search: '',
      byAlphabet: false,
      byDate: false,
      byCity: null,
      byCategory: null,
      byUser: null,

      busy: false,
    }
  },

  computed: {
    ...mapGetters('app', {
      placesStore: 'getPlaces',
      cities: 'getCities',
      categories: 'getCategories',
      usersStore: 'getUsers',
    }),

    places() {
      let places = [...this.placesStore]

      if(this.search.length > 0){
        places = places.filter((place) =>
        place.title.toLowerCase().includes(this.search.toLowerCase())
        )
      }

      if (this.byCity) {
        places = places.filter((place) => place.city === this.byCity)
      }

      if (this.byCategory) {
        places = places.filter(
          (place) => place.category === this.byCategory
        )
      }

      if (this.byUser) {
        places = places.filter(
          (place) => place.user.localId === this.byUser
        )
      }

      if (this.byDate) {
        places = places.sort(function (a, b) {
          if (a.created_at > b.created_at) {
            return -1
          }
        })
      } else if (!this.byDate) {
        places = places.sort(function (a, b) {
          if (a.created_at < b.created_at) {
            return -1
          }
        })
      }

      return places
    },
  },

  methods: {
    ...mapActions('app', ['loadPlaces']),
  },
}
</script>

<style lang="scss" scoped="scoped"></style>