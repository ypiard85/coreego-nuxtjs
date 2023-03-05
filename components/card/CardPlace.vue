<template>
  <nuxt-link v-if="place && user" :to="'/places/view/'+ place.id ">
    <el-card :body-style="{ padding: '0px' }" class="shadow">
      <div class="d-flex align-items-center py-2 ps-2 bg-light">
        <el-avatar class="me-2" :src="user.photoUrl"></el-avatar>
        <span class="fw-bold text-blue">{{user.displayName}}</span>
      </div>
      <el-image :src="place.thumbnail.url" fit="cover" style="height: 200px; width: 100%" />
      <div style="padding: 14px" class="bg-light">
        <strong class="d-block text-truncate">{{ place.title }} </strong>
        <div class="bottom clearfix mt-3">
          <div class="d-flex">
            <p class="me-2 text-secondary">
              <i class="el-icon-location-outline"></i>
              {{ city.label }}
            </p>
            <vui-tag :color="category.color" :label="category.name" />
          </div>
          <div class="mt-2">
            <small>{{ timeAgo }} </small>
          </div>
        </div>
      </div>
    </el-card>
  </nuxt-link>
  <b-skeleton animation="wave" style="height: 500px; pointer-events: none" v-else></b-skeleton>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { getDownloadURL, ref as storageRef, deleteObject } from "firebase/storage";
  import { storage } from "~/plugins/firebase";
  import { auth, db } from '~/plugins/firebase'
  import {
    doc,
    setDoc,
    addDoc,
    collection,
    deleteDoc,
    getDoc,
    GeoPoint,
    updateDoc,
  } from "firebase/firestore";
  import moment from 'moment'
  import VuiTag from '@/components/vui-alpha/VuiTag'

  export default {
    name: "CardPlace",

    components: { VuiTag },

    props: {
      place: {
        type: Object,
        required: false,
      },
    },

    data(){
      return{
        user: null
      }
    },

    async created(){
      await this.getUser()
    },

    methods:{
      async getUser(){
        let userReference = doc(db, "users", this.place.user )
        let userDocument = await getDoc(userReference)
        this.user = userDocument.data()
      }
    },

    computed: {
      ...mapGetters("app", { places: 'getPlaces', categories: 'getCategories', cities: 'getCities', users: 'getUsers' }),


      category() {
        return this.categories.find(category => category.id === this.place.category)
      },

      city() {
        return this.cities.find(city => city.id === this.place.city)
      },

      timeAgo() {
        return moment(new Date(this.place.created_at.seconds * 1000)).locale('fr').fromNow()
      }

    },
  };
</script>

<style scoped lang="scss">
  .card__place {
    width: 100%;
    max-width: 100%;

    .card__image {
      width: 100%;
      max-width: 100%;
      height: 180px;

      img {
        width: 100%;
        max-width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: bottom;
      }
    }

    .card__category {
      font-size: 12px;
    }

    .card__content {
      width: 100%;
    }
  }
</style>