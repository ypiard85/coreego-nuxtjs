<template>
    <div>
      <!-- <Header title="Editer un lieu" icon="pencil" /> -->
      <form-place :isEditMode="true" :place="place" :placeLoaded="placeLoaded" />
    </div>
  </template>
  <script>
//   import Header from "~/components/Header";
  import FormPlace from "./../../components/FormPlace";
  import {auth} from '~/plugins/firebase';
  import {mapGetters, mapActions} from 'vuex';

  export default {
    name: 'placeEdit',
    components: { FormPlace },

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
        let currentPlace = this.places.find(
          (place) => place.id === this.$route.params.id
        );
        if (
          !currentPlace ||
          (this.user && currentPlace.user.localId !== this.user.uid)
        ) {
          this.$router.replace('/places/add');
        } else {
          this.place = currentPlace;
        }
      },
    }

  };
  </script>
  <style lang="scss" scoped></style>
