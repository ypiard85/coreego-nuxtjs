import { db, auth } from "~/plugins/firebase.js";
import { signOut } from "firebase/auth";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";


export default {
  namespaced: true,
  state: {
    user: null,
    errorMessage: "",
    isLogged : false,
  },

  getters: {

    getErrorMessage(state) {
      return state.errorMessage;
    },
    getIsLogged(state) {
      return state.isLogged;
    },

  },

  mutations: {
    ON_AUTH_STATE_CHANGED_MUTATION: (state, {authUser, claims}) => {
      console.log(authUser)
      const {uid, email, emailVerified} = authUser
      state.user = {uid, email, emailVerified}
    },

    SET_ERREUR_MESSAGE(state, value) {
      state.errorMessage = value;
    },

    UPDATE_IS_LOGED(state, status){

      state.isLogged  = status
    }

  },

  actions: {
    onAuthStateChangedAction: (context, {authUser, claims}) => {
      if (!authUser) {
        console.log('appel ici fonction', authUser)
        // claims = null
        // Perform logout operations
        context.commit('UPDATE_IS_LOGED', false)
        context.commit('ON_AUTH_STATE_CHANGED_MUTATION', null)
      } else {
        console.log('appel ici cef fonction', authUser)
        context.commit('UPDATE_IS_LOGED', true)
        context.commit('ON_AUTH_STATE_CHANGED_MUTATION', authUser)
        // Do something with the authUser and the claims object...
      }
    },

    setIsLogged(context, status){
      context.commit('UPDATE_IS_LOGED', status)
    },

    fetchErreurMessage(context, value) {
      context.commit("SET_ERREUR_MESSAGE", value);
    },

  },
};
