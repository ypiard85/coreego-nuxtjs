<template>
    <b-container class="d-flex align-items-center justify-content-center mt-5">
      <b-card style="width: 500px; max-width: 100%">
        <template #header>
          <h1 class="fs-5" style="color: white">Connexion (remplacer css par element ui)</h1>
        </template>
        <b-card-body>
          <b-button
            type="button"
            @click="handleGoogleLogin"
            class="w-100 py-3 fw-bold"
            variant="danger"
            size="sm"
          >
            Se connecter avec google
          </b-button>
          <b-button
            type="button"
            class="w-100 mt-3 py-3 fw-bold"
            @click="handleFacebookLogin"
            variant="primary"
            size="sm"
          >
            Se connecter avec Facebook
          </b-button>
        </b-card-body>
      </b-card>
    </b-container>
  </template>

  <script>
  import { mapActions, mapGetters } from "vuex";

  export default {
    components: {

    },

    computed: {
      ...mapGetters("auth",{ errorAuth: "getErrorMessage" }),
    },

    methods: {

      ...mapActions("auth",{
        googleAuth: "connectWithGoogle",
        facebookAuth: "connectWithFacebook",
      }),

      handleGoogleLogin() {
        this.googleAuth();
      },

      handleFacebookLogin() {
        this.facebookAuth();
      },

    },
  };
  </script>

  <style lang="scss" scoped>
  .card-header {
    background-color: $blue-principal!important;
  }
  </style>
