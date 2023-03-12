import Vuex from 'vuex'
import auth from "./authentification.store";
import {state, mutations, getters, actions} from './app.store'
import middleware from './middleware.store'

export default () => new Vuex.Store({
  modules:{
      app:{
        namespaced: true,
        state: state,
        mutations: mutations,
        getters: getters,
        actions: actions
      },
      auth
  }
})
