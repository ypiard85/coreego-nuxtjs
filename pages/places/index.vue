<template>
  <div>
    <!-- Filtre -->
    <filter-places v-if="filter" @change-search-value="filterSearch" @filter-by-date="byDate = $event"
      @filter-by-city="filterByCity" @filter-by-category="filterByCategory" @filter-by-user="filterByUser"
      :byDate="byDate" :byCity="byCity" :byCategory="byCategory" :byUser="byUser" />
    <!-- Conent -->
    <b-container fluid="sm" v-if="!busy">
      <template v-if="filteredPlaces.length > 0">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" class="mb-2" v-for="(place, i) in filteredPlaces" :key="i">
            <card-place :place="place" />
          </el-col>
        </el-row>
      </template>
      <el-empty description="Aucun lieu trouvé" v-else></el-empty>
      <el-button class="d-block w-100 mt-3" v-if="viewGoNextButton" @click="handleGoNext">Voir plus</el-button>
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
  import { db, auth } from "~/plugins/firebase.js";
  import {
    collection,
    getDocs,
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    startAfter,
    query,
    where,
    limit,
    orderBy
  } from "firebase/firestore";
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
        bySearch: '',
        byAlphabet: false,
        byDate: false,
        byCity: null,
        byCategory: null,
        byUser: null,

        busy: false,

        places: [],
        maxPlaces: null,

      }
    },

    async created() {
      await this.initView()
      await this.initMaxPlaces()
    },

    computed: {
      ...mapGetters('app', {

        cities: 'getCities',
        categories: 'getCategories',
        usersStore: 'getUsers',
      }),

      filteredPlaces(){
        let places = this.places

        if(this.places && this.bySearch.length > 0){
          places = places.filter(place => place.title.toLowerCase().includes(this.bySearch.toLowerCase()))
        }

        if(this.byDate){
          places = places.sort((a,b) => {
              if(a.created_at < b.created_at){
                return -1
              }
          })
        }else{
          places = places.sort((a,b) => {
              if(a.created_at > b.created_at){
                return -1
              }
          })
        }

        return places
      },

      viewGoNextButton(){
        return this.filteredPlaces.length > 0 && this.filteredPlaces.length !== this.maxPlaces
      }

    },

    methods: {

      async filterByCity($event) {
        this.byCity = $event
        await this.initView(false)
      },

      async filterByCategory($event) {
        this.byCategory = $event
        await this.initView(false)
      },

      async filterByUser($event) {
        this.byUser = $event
        await this.initView(false)
      },

      async filterSearch($event) {
        this.bySearch = $event
      },

      async initMaxPlaces() {
        let queryFiltered = []
        if (this.byCity) queryFiltered.push(where('city', '==', this.byCity))
        if (this.byCategory) queryFiltered.push(where('category', '==', this.byCategory))
        if (this.byUser) queryFiltered.push(where('user', '==', this.byUser))

        let documentRef = query(collection(db, "lieux"),
          ...queryFiltered
         )

        let documentSnapshots = await getDocs(documentRef);
        this.maxPlaces = documentSnapshots.docs.length
      },

      async initView(withLoading = true) {
        try {
          if (withLoading) {
            this.busy = true
          }
          let queryFiltered = []

          if (this.byCity) queryFiltered.push(where('city', '==', this.byCity))
          if (this.byCategory) queryFiltered.push(where('category', '==', this.byCategory))
          if (this.byUser) queryFiltered.push(where('user', '==', this.byUser))

          let documentRef = query(collection(db, "lieux"),
            orderBy('created_at', 'desc'),
            ...queryFiltered,
            limit(20))

          let documentSnapshots = await getDocs(documentRef);

          if (!documentSnapshots) {
            throw new Error("impossible de charger les lieux");
          }

          this.places = documentSnapshots.docs.map(doc => {
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

          let queryFiltered = []

          if (this.byCity) queryFiltered.push(where('city', '==', this.byCity))
          if (this.byCategory) queryFiltered.push(where('category', '==', this.byCategory))
          if (this.byUser) queryFiltered.push(where('user', '==', this.byUser))

          // Spécifiez le document à partir duquel commencer la pagination
          const lastDocument = this.places[this.places.length - 1]

          // Créez la requête avec les filtres et les limites appropriés
          const placeRef = query(
            collection(db, 'lieux'),
            orderBy('created_at', 'desc'),
            ...queryFiltered,
            startAfter(lastDocument.updated_at),
            limit(20)
          )

          // Récupérez les documents avec la requête créée
          const documentSnapshots = await getDocs(placeRef)

          // Transformez les documents récupérés en un tableau d'objets de lieu
          const nextPlaces = documentSnapshots.docs.map(doc => {
            return { ...doc.data(), id: doc.id }
          })

          // Ajoutez les lieux récupérés à la liste existante
          this.places = this.places.concat(nextPlaces)

        } catch (error) {
          console.log(error)
        }
      }

    },
  }
</script>

<style lang="scss" scoped="scoped"></style>