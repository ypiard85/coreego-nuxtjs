<template>
  <div class="single-place">
    <div class="position-relative" v-if="place && place.thumbnailUrl">
      <DiaporamaThumb :images="images" class="diapo" />
      <section class="position-relative bg-light py-3">
        <b-container fluid="md">
          <Introduction
            :place="place"
            :city="city"
            :category="category"
            @open-modal-setting-images="handleOpenModalSettingImages"
            @open-kakao-map="openKakaoMap = true"
            @add-to-carnet="addPlaceToCarnet"
            @delete-to-carnet="deletePlaceToCarnet"
          />

          <section class="mt-5" v-if="user">
            <el-button
              v-if="!inCarnet"
              type="primary"
              @click="addPlaceToCarnet"
              :loading="loadingBtn"
              icon="el-icon-plus"
              >Ajouter</el-button
            >
            <el-button
              v-else
              type="danger"
              :loading="loadingBtn"
              @click="deletePlaceToCarnet"
              icon="el-icon-minus"
              >Supprimer</el-button
            >
            <el-dropdown
              @command="handleCommand"
              v-if="isAuthPlace"
              trigger="click"
            >
              <span class="el-dropdown-link">
                <el-button
                  type="info"
                  class="ms-3"
                  icon="el-icon-setting"
                  circle
                ></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  icon="el-icon-picture-outline"
                  command="openModalPictureSetting"
                  >Gérer les photos</el-dropdown-item
                >
                <el-dropdown-item
                  icon="el-icon-edit"
                  command="goToPlaceEditView"
                  >Modifier le lieu</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </section>
        </b-container>
      </section>

      <el-dialog
        :visible="openModalEdit"
        :fullscreen="true"
        :append-to-body="true"
        @close="openModalEdit = false"
      >
        <header class="modal__header" slot="title">
          <div class="modal__header__title fs-2">
            <i class="bi bi-images"></i>
            <span class="ms-3">Gérer les images</span>
          </div>
        </header>
        <ImagesSettingModal
          :images="images"
          :thumbnail="thumbnail"
          @change-thumbnail="thumbnail = $event"
          @change-images-order="imagesOrder = $event"
          @on-submit-setting-images="onSubmitSettingImages"
          @close-modal="openModalEdit = false"
          :busy="busy"
        />
      </el-dialog>

      <el-dialog
        v-if="openKakaoMap"
        :visible="openKakaoMap"
        :fullscreen="true"
        :append-to-body="true"
      >
        <KakaoMap
          v-if="openKakaoMap"
          id="mapmarker"
          @change-type="
            map.type = $event;
            reloadMap();
          "
          @change-mode="
            map.mode = $event;
            reloadMap();
          "
          @close-map="openKakaoMap = false"
          :lat="map.lat"
          :long="map.long"
          :mapType="map.type"
          :mapMode="map.mode"
          :widthOptions="true"
        />
      </el-dialog>
      <el-button
        class="single-place__see-map"
        @click="openKakaoMap = true"
        circle
        type="success"
        icon="el-icon-map-location"
      ></el-button>
    </div>
    <slot name="loading" v-else />
  </div>
</template>

<script>
import { getDoc, setDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { auth, db, storage } from "~/plugins/firebase";
import Introduction from "../../components/place/Introduction";
import DiaporamaThumb from "../../components/place/DiaporamaThumb";
import VuiModal from "~/components/vui-alpha/modal/VuiModal";
import {
  getDownloadURL,
  ref as storageRef,
  deleteObject,
} from "firebase/storage";

import KakaoMap from "~/components/map/KakaoMap";
import MapUiOptions from "~/components/map/map-ui/MapUiOptions";
import { mapGetters, mapActions } from "vuex";
import ImagesSettingModal from "~/components/modal/ImagesSettingModal";
import {getImageUrl} from '~/utils/request.js'
export default {
  name: "place",
  components: {
    Introduction,
    DiaporamaThumb,
    KakaoMap,
    MapUiOptions,
    ImagesSettingModal,
    VuiModal
  },

  data() {
    return {
      images: null,
      thumbnail: null,
      imagesOrder: null,

      openModalEdit: false,

      carnet: null,

      busy: false,

      loadingBtn: false,
      openKakaoMap: false,

      map: {
        lat: null,
        long: null,
        type: 0,
        mode: 2,
        reload: false,
      },
    };
  },

  computed: {
    ...mapGetters("app", {
      places: "getPlaces",
      users: "getUsers",
      carnetPlace: "getCarnet",
      cities: "getCities",
      categories: "getCategories",
    }),

    user(){
      return auth && auth.currentUser
    },

    place() {
      return this.places.find((place) => place.id === this.$route.params.id);
    },

    inCarnet() {
      if (this.user) {
        return (
          Array.isArray(this.carnet) &&
          this.carnet.length > 0 &&
          this.carnet.includes(this.$route.params.id)
        );
      }
    },

    isAuthPlace() {
      return (
        this.user && this.place && this.place.user.localId === this.user.uid
      );
    },

    category() {
      return this.categories.find(
        (category) => category.id === this.place.category
      );
    },
    city() {
      return this.cities.find((city) => city.id === this.place.city);
    },
  },

  async created() {
    await this.hydrateDataPlace();
  },

  methods: {
    ...mapActions("app", ["loadPlaces", 'loadCarnet']),

    handleCommand(command) {
      console.log(command);
      if (command === "goToPlaceEditView") {
        this.$router.replace('/places/edit/' + this.place.id);
      } else if (command === "openModalPictureSetting") {
        this.openModalEdit = true;
      }
    },

    async hydrateDataPlace() {
      let images = [];
      for (const image of this.place.images) {
        const PICTURE_REF = storageRef(storage, "lieux/" + image);
        if (PICTURE_REF) {
          const PICTURE = await getDownloadURL(PICTURE_REF);
          this.imagesOrder = this.place.images;
          images.push({ name: image, url: PICTURE });
        }
      }
      this.images = images;
      this.thumbnail = this.place.thumbnail;
      this.map.lat = this.place.geopoint._lat;
      this.map.long = this.place.geopoint._long;

      this.carnet = Array.isArray(this.carnetPlace) ? this.carnetPlace : []  ;
    },

    handleOpenModalSettingImages() {
      this.$refs.modalSettingImages.openModal();
    },

    loadingTrue() {
      this.loading = true;
    },

    loadingFalse() {
      this.loading = false;
    },

    reloadMap() {
      this.openKakaoMap = false;
      this.$nextTick(() => {
        this.openKakaoMap = true;
      });
    },

    async addPlaceToCarnet() {
      this.carnet.push(this.$route.params.id);
      this.loadingBtn = true;
      await setDoc(doc(db, "carnets", this.user.uid), {
        places: this.carnet,
      })
        .then(async () => {
          this.loadingBtn = false;
          await this.loadCarnet(this.user.uid)
          this.$message.success('Ce lieu à été ajouter à votre carnet de route')
        })
        .catch((e) => {
          console.log(e);
          this.loadingBtn = false;
        });
    },

    async deletePlaceToCarnet() {
      this.carnet = this.carnet.filter((placeId) => placeId != this.$route.params.id);
      this.loadingBtn = true;
      await setDoc(doc(db, "carnets", this.user.uid), {
        places: this.carnet,
      })
        .then(async () => {
          await this.loadCarnet(this.user.uid)
          this.loadingBtn = false;
          this.$message.success('Ce lieu à été supprimer de votre carnet de route')
        })
        .catch((e) => {
          console.log(e);
          this.loadingBtn = false;
        });
    },

    async onSubmitSettingImages() {
      this.busy = true;
      const ref = doc(db, "lieux", this.$route.params.id);

      let thumbnailUrl = this.place.thumbnailUrl
      if(this.thumbnail !== this.place.thumbnail ){
        thumbnailUrl = await getImageUrl(this.thumbnail)
      }

      await updateDoc(ref, {
        images: this.imagesOrder,
        thumbnail: this.thumbnail,
        thumbnailUrl: thumbnailUrl
      })
        .then(async () => {
          this.busy = false;
          await this.loadPlaces();
          this.$notify.success({
            title: "Images",
            message: "Gestion des images mis à jour",
          });
          this.openModalEdit = false;
        })
        .catch((err) => {
          this.$notify.error({
            title: "Erreur",
            message: "Une erreur est survenue",
          });
          this.busy = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.single-place {
  &__see-map {
    font-size: 24px;
    position: fixed;
    right: 10px;
    bottom: 10px;
  }
}
</style>
