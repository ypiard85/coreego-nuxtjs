<template>
  <div>
    <!-- Filtre -->
    <filter-places
      v-if="filter"
      @update-filters="updateFilters"
      :filteredCity="filters.city"
      :filteredCategory="filters.category"
      :filteredUser="filters.user"
      :filteredDate="filters.date"
      :filteredSearch="filters.search"
    />
    <!-- Conent -->
    <b-container fluid="sm" v-if="!busy">
      <template v-if="filteredPlaces.length > 0">
        <el-row :gutter="10">
          <el-col
            :xs="24"
            :sm="12"
            :md="12"
            :lg="8"
            class="mb-2"
            v-for="(place, i) in filteredPlaces"
            :key="i"
          >
            <card-place :place="place" />
          </el-col>
        </el-row>
      </template>
      <el-empty description="Aucun lieu trouvé" v-else></el-empty>
      <el-button
        class="d-block w-100 mt-3"
        v-if="viewGoNextButton"
        @click="handleGoNext"
        >Voir plus</el-button
      >
    </b-container>
    <slot name="loading" v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VuiSearchInput from '~/components/vui-alpha/input/VuiSearchInput'
import CardPlace from '~/components/card/CardPlace'
import FilterPlaces from '../components/FilterPlaces'
import { db } from '~/plugins/firebase.js'
import {
  collection,
  getDocs,
  startAfter,
  query,
  where,
  limit,
  orderBy,
} from 'firebase/firestore'
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
      byDate: false,

      filters: {
        search: '',
        category: null,
        city: null,
        user: null,
        date: false,
      },

      busy: false,

      places: [],
      maxPlaces: null,
    }
  },

  async created() {
    await this.loadView()
    await this.initMaxPlaces()
  },

  computed: {
    ...mapGetters('app', {
      cities: 'getCities',
      categories: 'getCategories',
    }),

    filteredPlaces() {
      let places = this.places

      if (this.places && this.filters.search.length) {
        places = places.filter((place) =>
          place.title.toLowerCase().includes(this.filters.search.toLowerCase())
        )
      }

      places = places.sort((a, b) =>
        this.filters.date && a.created_at < b.created_at ? 1 : -1
      )

      return places
    },

    viewGoNextButton() {
      return (
        this.filteredPlaces.length > 0 &&
        this.filteredPlaces.length !== this.maxPlaces
      )
    },

    queryFiltered() {
      let queryFiltered = []
      if (this.filters.city)
        queryFiltered.push(where('city', '==', this.filters.city))
      if (this.filters.category)
        queryFiltered.push(where('category', '==', this.filters.category))
      if (this.filters.user)
        queryFiltered.push(where('user', '==', this.filters.user))

      return queryFiltered
    },
  },

  methods: {
    async updateFilters(filters) {
      for (const filterKey of Object.keys(filters)) {
        this.filters[filterKey] = filters[filterKey]
      }
      await this.loadView()
    },

    async initMaxPlaces() {
      let documentRef = query(collection(db, 'lieux'), ...this.queryFiltered)

      let documentSnapshots = await getDocs(documentRef)
      this.maxPlaces = documentSnapshots.docs.length
    },

    async loadView(withLoading = true) {
      try {
        if (withLoading) {
          this.busy = true
        }

        let documentRef = query(
          collection(db, 'lieux'),
          orderBy('created_at', 'desc'),
          ...this.queryFiltered,
          limit(20)
        )

        let documentSnapshots = await getDocs(documentRef)

        if (!documentSnapshots) {
          throw new Error('impossible de charger les lieux')
        }

        this.places = documentSnapshots.docs.map((doc) => {
          return { ...doc.data(), id: doc.id }
        })

        await this.initMaxPlaces()
      } catch (error) {
        console.log(error)
      } finally {
        if (withLoading) {
          this.busy = false
        }
      }
    },

    async handleGoNext() {
      try {
        // Spécifiez le document à partir duquel commencer la pagination
        const lastDocument = this.places[this.places.length - 1]

        // Créez la requête avec les filtres et les limites appropriés
        const placeRef = query(
          collection(db, 'lieux'),
          orderBy('created_at', 'desc'),
          ...this.queryFiltered,
          startAfter(lastDocument.updated_at),
          limit(20)
        )

        // Récupérez les documents avec la requête créée
        const documentSnapshots = await getDocs(placeRef)

        // Transformez les documents récupérés en un tableau d'objets de lieu
        const nextPlaces = documentSnapshots.docs.map((doc) => {
          return { ...doc.data(), id: doc.id }
        })

        // Ajoutez les lieux récupérés à la liste existante
        this.places = this.places.concat(nextPlaces)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped="scoped"></style>
