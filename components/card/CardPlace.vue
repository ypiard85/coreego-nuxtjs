<template>
    <nuxt-link
      v-if="place"
      :to="'/places/view/'+ place.id "
    >
      <el-card :body-style="{ padding: '0px' }" class="shadow">
        <el-image
          :src="place.thumbnailUrl"
          fit="cover"
          style="height: 200px; width: 100%"
        />
        <div style="padding: 14px">
          <strong class="d-block text-truncate">{{ place.title }} </strong>
          <div class="bottom clearfix mt-3">
            <div class="d-flex">
              <el-link
                class="me-2"
                icon="el-icon-location-outline"
                :underline="false"
                >{{ city.label }}</el-link
              >
              <vui-tag :color="category.color" :label="category.label" />
            </div>
          </div>
        </div>
      </el-card>
    </nuxt-link>
    <b-skeleton
      animation="wave"
      style="height: 500px; pointer-events: none"
      v-else
    ></b-skeleton>
  </template>

  <script>
  import {mapGetters} from 'vuex';
  import { getDownloadURL, ref as storageRef, deleteObject } from "firebase/storage";
  import { storage } from "~/plugins/firebase";
  import VuiTag from '@/components/vui-alpha/VuiTag'

  export default {
    name: "CardPlace",

    components: {VuiTag},

    props: {
      place: {
        type: Object,
        required: false,
      },
    },

    computed:{
      ...mapGetters("app", { places: 'getPlaces', categories: 'getCategories', cities: 'getCities', users: 'getUsers'}),

      category(){
        return this.categories.find(category => category.id === this.place.category)
      },
      city(){
        return this.cities.find(city => city.id === this.place.city)
      },
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
