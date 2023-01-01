<template>
    <div>
        <el-dialog :fullscreen="true" :visible="true" :show-close="false" v-if="places">
          <KakaoMap
          id="mapmarker"
          :width-options="false"
          :isMultiMarker="true"
          :places="places"
          />
        </el-dialog>
        <el-empty description="Votre carnet de route est vide" v-else></el-empty>
      </div>
    </div>
  </template>

  <script>
  import KakaoMap from "~/components/map/KakaoMap";
  import { mapGetters } from "vuex";
  import {
    getDownloadURL,
    ref as storageRef,
    deleteObject,
  } from "firebase/storage";
  import { storage } from "~/plugins/firebase";

  export default {
    name: "carnetDeRoute",
    components: { KakaoMap },

    data() {
      return {
        places: null,
      };
    },

    async created() {
      await this.loadPlaces();
    },

    computed: {
      ...mapGetters("app", {
        carnets: "getCarnet",
        placesStore: "getPlaces",
        categories: "getCategories",
        cities: "getCities",
      }),
    },

    methods: {
      async loadPlaces() {
        if (this.carnets && this.carnets.length > 0) {
          let placesStore = this.placesStore.filter((place) =>
            this.carnets.includes(place.id)
          );
          let places = [];
          for (let place of placesStore) {
            const PICTURE_REF = storageRef(storage, "lieux/" + place.thumbnail);
            const PICTURE = await getDownloadURL(PICTURE_REF);
            places.push({
              ...place,
              cityName: this.cities[place.city].label,
              categoryName: this.categories[place.category].label,
            });
          }
          this.places = places;
        }
      },
    },
  };
  </script>

  <style scoped lang="scss">
  ::v-deep .wrap {
    position: absolute;
    left: 0;
    bottom: 40px;
    width: 288px;
    height: 132px;
    margin-left: -144px;
    text-align: left;
    overflow: hidden;
    font-size: 12px;
    font-family: "Malgun Gothic", dotum, "돋움", sans-serif;
    line-height: 1.5;

    * {
      padding: 0;
      margin: 0;
    }

    .info {
      width: 286px;
      height: 120px;
      border-radius: 5px;
      border-bottom: 2px solid #ccc;
      border-right: 1px solid #ccc;
      overflow: hidden;
      background: #fff;

      &:nth-child(1) {
        border: 0;
        box-shadow: 0px 1px 2px #888;
      }

      .title {
        padding: 5px 0 0 10px;
        height: 30px;
        background: $blue-principal;
        color: white;
        border-bottom: 1px solid #ddd;
        font-size: 15px;
        font-weight: bold;
      }

      .body {
        position: relative;
        overflow: hidden;
      }

      .desc {
        position: relative;
        margin: 13px 0 0 90px;
        height: 75px;

        .ellipsis {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .jibun {
          font-size: 11px;
          color: #888;
          margin-top: -2px;
        }
      }

      .img {
        position: absolute;
        top: 6px;
        left: 5px;
        width: 73px;
        height: 71px;
        border: 1px solid #ddd;
        color: #888;
        overflow: hidden;

        img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

      }

      .link {
        color: #5085bb;
      }
    }
  }
  </style>
