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

    SET_ERREUR_MESSAGE(state, value) {
      state.errorMessage = value;
    },

    UPDATE_IS_LOGED(state, status){
      state.isLogged  = status
    }

  },

  actions: {

    setIsLogged(context, status){
      context.commit('UPDATE_IS_LOGED', status)
    },

    async logout({ commit }) {
      try {
        await signOut(auth);
        commit('UPDATE_IS_LOGED', false)
        window.location.href = "/login";
      } catch (error) {}
    },

    async connectWithGoogle(context) {
      try {
        await signInWithPopup(auth, new GoogleAuthProvider());
        window.location.href = "/";
      } catch (error) {
        console.log("erreur auth 403");
        const errorCode = error.code;
        error.message;
        // The email of the user's account used.
        error.customData.email;
        // The AuthCredential type that was used.
        GoogleAuthProvider.credentialFromError(error);
        if (errorCode === "auth/account-exists-with-different-credential") {
          context.dispatch("fetchErreurMessage", "Cet email est déja utiliser");
        }
      }
    },

    async connectWithFacebook(context) {
      await signInWithPopup(auth, new FacebookAuthProvider())
        .then((result) => {
          // The signed-in user info.
          console.log(result)
          result.user;
          // This gives you a Facebook Access Token. You can use it to access the Facebook API.
          const credential = FacebookAuthProvider.credentialFromResult(result);
          credential.accessToken;
          window.location.href = "/";
        })
        .catch((error) => {
          // Handle Errors here.
          console.log(error)
          const errorCode = error.code;
          error.message;
          // The email of the user's account used.
          error.customData.email;
          // The AuthCredential type that was used.
          FacebookAuthProvider.credentialFromError(error);
          if (errorCode === "auth/account-exists-with-different-credential") {
            context.dispatch(
              "fetchErreurMessage",
              "Cet email est déja utiliser"
            );
          }
        });
    },

    fetchErreurMessage(context, value) {
      context.commit("SET_ERREUR_MESSAGE", value);
    },
  },
};
