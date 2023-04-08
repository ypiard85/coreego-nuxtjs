<template>
  <div>
    <!-- Filtre -->
    <filter-places @update-filters="updateFilters" :filters="filters" />
    <!-- Conent -->
    <b-container fluid="sm">
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
            <nuxt-link v-if="!busy" :to="'/places/view/' + place.id">
              <card-place :place="place" />
            </nuxt-link>
            <b-skeleton
              animation="wave"
              style="min-height: 300px; pointer-events: none"
              v-else
            ></b-skeleton>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import VuiSearchInput from '~/components/vui-alpha/input/VuiSearchInput'
import CardPlace from '~/components/card/CardPlace'
import FilterPlaces from '../components/FilterPlaces'
import { MORE_RECENT, MORE_OLDER } from '@/utils/variables.js'

export default {
  name: 'places',

  props: {},

  components: {
    VuiSearchInput,
    CardPlace,
    FilterPlaces,
  },
  data() {
    return {
      byDate: false,

      busy: false,

      places: [],
      maxPlaces: null,
    }
  },

  async created() {
    await this.loadView(true)
    await this.initMaxPlaces()
  },

  computed: {
    ...mapGetters('app', {
      cities: 'getCities',
      categories: 'getCategories',
      filters: 'getFilters',
    }),

    viewGoNextButton() {
      return this.places.length > 0 && this.places.length !== this.maxPlaces
    },
  },

  methods: {
    ...mapActions('app', ['setFilters']),

    async updateFilters($event) {
      this.busy = true

      let filters = this.filters

      for (const filterKey of Object.keys($event)) {
        filters[filterKey] = $event[filterKey]
      }

      this.setFilters(filters)

      await this.loadView(false)
      this.busy = false
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
        .orderBy('created_at', this.filters.period === MORE_RECENT  ?  'desc' : 'asc')

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
        .orderBy('updated_at', this.filters.period === MORE_RECENT ? 'desc' : 'asc')

      documentRef = this.queryFiltered(documentRef)

      let documentSnapshots = await documentRef.get()
      this.maxPlaces = documentSnapshots.docs.length
    },

    async loadView(withLoading = true) {
      if(withLoading){
       this.$router.app.$emit('viewLoading', true)
      }
      try {
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
      }
      if(withLoading){
        this.$router.app.$emit('viewLoading', false)
      }
    },

    async handleGoNext() {
      try {
        // Spécifiez le document à partir duquel commencer la pagination
        this.busy = true

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
      } finally {
        this.busy = false
      }
    },
  },
}
</script>

<style lang="scss" scoped="scoped"></style>
