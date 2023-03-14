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

    viewGoNextButton() {
      return this.places.length > 0 && this.places.length !== this.maxPlaces
    },
  },

  methods: {
    async updateFilters(filters) {
      for (const filterKey of Object.keys(filters)) {
        this.filters[filterKey] = filters[filterKey]
      }
      await this.loadView()
    },

    queryFiltered(document) {
      if (this.filters.city)
        document = document.where('city', '==', this.filters.city)
      if (this.filters.category)
        document = document.where('category', '==', this.filters.category)
      if (this.filters.user)
        document = document.where('user', '==', this.filters.user)

      return document
    },

    async getDocumentSnapShots(goNext = false) {
      let documentRef = this.$fire.firestore
        .collection('lieux')
        .limit(20)
        .orderBy('created_at', this.filters.date !== null ? 'asc' : 'desc')

      if (goNext) {
        const lastDocument = this.places[this.places.length - 1]
        documentRef = documentRef.startAfter(lastDocument.updated_at)
      }

      documentRef = this.queryFiltered(documentRef)

      let documentSnapshots = await documentRef.get()

      return documentSnapshots
    },

    async initMaxPlaces() {
      let documentRef = this.$fire.firestore
        .collection('lieux')
        .orderBy('created_at', this.filters.date ? 'asc' : 'desc')

      documentRef = this.queryFiltered(documentRef)

      let documentSnapshots = await documentRef.get()
      this.maxPlaces = documentSnapshots.docs.length
    },

    async loadView(withLoading = true) {
      try {
        if (withLoading) {
          this.busy = true
        }

        let documentSnapShots = await this.getDocumentSnapShots()

        if (!documentSnapShots) {
          throw new Error('impossible de charger les lieux')
        }

        this.places = documentSnapShots.docs.map((doc) => {
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

        let documentSnapShots = await this.getDocumentSnapShots(true)

        // Créez la requête avec les filtres et les limites appropriés

        // Transformez les documents récupérés en un tableau d'objets de lieu
        const nextPlaces = documentSnapShots.docs.map((doc) => {
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
