import {
  VIEW_ALL_TOPICS,
  VIEW_SINGLE_TOPIC,
  ADD_NEW_TOPIC,
} from '@/utils/variables.js'

export default {
  namespaced: true,

  state: {
    viewType: VIEW_ALL_TOPICS,
  },

  getters: {
    getViewType(state) {
      return state.viewType
    },
  },

  mutations: {
   UPDATE_VIEW_TYPE(state, viewType) {
      state.viewType = viewType
    },
  },

  actions: {
   setViewType(context, viewType) {
      context.commit('UPDATE_VIEW_TYPE', viewType)
    },
  },
}
