export default {
  namespaced: true,

  state: {
    searchParams:{
      city: null,
      category: null,
      title: ''
    }
  },

  getters: {
    getSearchParams(state){
      return state.searchParams
    }
  },

  mutations: {
    updateSearchParams(state, params){
      state.searchParams = params
    }
  },

  actions: {
      setSearchParams(context, params){
        context.commit('updateSearchParams', params)
      }
  },
}
