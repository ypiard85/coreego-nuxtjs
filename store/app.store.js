import { db, auth } from '~/plugins/firebase.js'
// import { MORE_RECENT, MORE_OLDER } from '@/utils/variables.js'
export const state = () => ({
  cities: null,
  categories: null,
  filters: {
    category: null,
    city: null,
    user: null,
    period: 0,
  },

})

export const getters = {
  getCities: (state) => {
    return state.cities
  },

  getCategories: (state) => {
    return state.categories
  },
  getFilters: (state) => {
      return state.filters
  }
}

export const mutations = {
  updateCities(state, cities) {
    state.cities = cities
  },

  updateCategories(state, categories) {
    state.categories = categories
  },

  updateFilter(state, filters){
    state.filters = filters
  }

}

export const actions = {

  setFilters(context, filters){
    context.commit('updateFilter', filters)
  },

  async loadCities(context) {
    const cityDocument = this.$fire.firestore.collection('cities').get()

    await cityDocument
      .then((docs) => {
        if (!docs) {
          throw new Error('Erreur lors du chargement des villes')
        }

        docs.forEach((doc) => {
          let cities = doc.data().cities.map((city, index) => {
            return { id: index + 1, label: city }
          })
          cities = cities.sort((a, b) => (a.label > b.label ? 1 : -1))

          context.commit('updateCities', cities)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  },

  async loadCategories(context) {
    const categorieRef = this.$fire.firestore.collection('categories').get()
    await categorieRef
      .then((docs) => {
        if (!docs) {
          throw new Error('Erreur lors du chargement des catégories')
        }
        docs.forEach((doc) => {
          let categories = doc.data().categories
          categories = categories.sort((a, b) => (a.name > b.name ? 1 : -1))
          context.commit('updateCategories', categories)
        })
      })
      .catch((error) => console.log(error))
  },
}
