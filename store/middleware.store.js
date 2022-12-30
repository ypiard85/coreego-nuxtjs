export default {
  namespaced: true,
  state: {
    canEdit: false
  },
  getters: {
    getCanEdit(state){
        return state.canEdit
    }
  },
  mutations: {
    updateCanEdit(state, status){
        state.canEdit = status
    }
  },
  actions: {
    setCanEdit(context, status){
        context.commit('updateCanEdit', status)
    }
  },
};
