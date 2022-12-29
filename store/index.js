import Vuex from 'vuex'
import auth from "./authentification.store";
import app from './app.store'

export default () => new Vuex.Store({
  modules: {
    auth, app
  }
})