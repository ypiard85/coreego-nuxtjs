<template>
    <div>
      <!-- <Header title="Editer un lieu" icon="pencil" /> -->
      <Middleware :editPlace="true" />
      <form-place :isEditMode="true" :place="place" :placeLoaded="placeLoaded" />
    </div>
  </template>
  <script>
//   import Header from "~/components/Header";
  import FormPlace from "./../../components/FormPlace";
  import {auth} from '~/plugins/firebase';
  import {mapGetters, mapActions} from 'vuex';
  import Middleware from '~/pages/components/Middleware'

  export default {
    name: 'placeEdit',
    middleware: 'authenticated',
    components: { FormPlace, Middleware },

    data(){
      return{
        place: null
      }
    },

    computed:{
      ...mapGetters("app", {
        places: "getPlaces",
      }),

      user(){
        return (auth && auth.currentUser) &&  auth.currentUser
      },

      placeLoaded(){
        let isLoad = false
        if(this.place){
          isLoad = true
        }
        return isLoad
      }
    },

    created(){
      this.loadCurrentPlace()
    },

    methods:{
      loadCurrentPlace() {
        this.place = this.places.find((place) => place.id === this.$route.params.id)
      },
    }

  };
  </script>
  <style lang="scss" scoped></style>
