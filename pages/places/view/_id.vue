<template>
  <div class="single-place">
    <Middleware :viewPlace="true" />
    <div class="position-relative" v-if="place && !busy">
      <DiaporamaThumb :images="images" class="diapo" />
      <section class="position-relative bg-light py-3">
        <b-container fluid="md">
          <Introduction :place="place" :city="city" :category="category"
            @open-modal-setting-images="handleOpenModalSettingImages" @open-kakao-map="openKakaoMap = true"
            @add-to-carnet="addPlaceToCarnet" @delete-to-carnet="deletePlaceToCarnet" />

          <section class="mt-5" v-if="user">
            <el-button v-if="!inCarnet" type="primary" @click="addPlaceToCarnet" :loading="loadingBtn"
              icon="el-icon-plus">Carnet de route</el-button>
            <el-button v-else type="danger" :loading="loadingBtn" @click="deletePlaceToCarnet"
              icon="el-icon-minus">Carnet de route</el-button>
            <el-dropdown @command="handleCommand" v-if="isAuthPlace" trigger="click">
              <span class="el-dropdown-link">
                <el-button type="info" class="ms-3" icon="el-icon-setting" circle></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-picture-outline" command="openModalPictureSetting">Gérer les
                  photos</el-dropdown-item>
                <el-dropdown-item icon="el-icon-edit" command="goToPlaceEditView">Modifier le lieu</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </section>
        </b-container>
      </section>

      <section role="commentaires">
        <b-container>
          <h5 class="text-blue my-3">Commentaires (5) </h5>
          <el-button @click="openModalCommentaire = true" type="secondary" size="small" class="mb-3">
            Ajouter un commentaire
          </el-button>
          <Commentaires class="single-place_commentaires">
            <template #edit>
              <div class="float-end">
                <el-button type="text" class="me-1" icon="el-icon-edit"></el-button>
                <el-button class="text-danger" type="text" icon="el-icon-delete-solid"></el-button>
              </div>
            </template>
          </Commentaires>
        </b-container>
      </section>

      <el-dialog v-loading="modalBusy" title="Ajouter un commentaire" @close="openModalCommentaire = false"
        :visible="openModalCommentaire" custom-class="modal-commentaire" :append-to-body="true">
        <el-form>
          <el-input :rows="10" type="textarea" v-model="commentaire" />
          <el-button class="mt-3" size="small" :disabled="commentaire.trim() == '' " type="success"
            @click="addCommentaire">Ajouter</el-button>
        </el-form>
      </el-dialog>

      <el-dialog v-loading="modalBusy" :visible="openModalEdit" :fullscreen="true" :append-to-body="true" @close="openModalEdit = false">
        <header class="modal__header" slot="title">
          <div class="modal__header__title fs-2">
            <i class="el-icon-picture"></i>
            <span class="ms-3">Gérer les images</span>
          </div>
        </header>
        <ImagesSettingModal :images="images" :thumbnail="thumbnail" @change-thumbnail="thumbnail = $event"
          @change-images-order="imagesOrder = $event" @on-submit-setting-images="onSubmitSettingImages"
          @close-modal="openModalEdit = false" />
      </el-dialog>

      <el-dialog v-if="openKakaoMap" :visible="openKakaoMap" :fullscreen="true" :append-to-body="true">
        <KakaoMap v-if="openKakaoMap" id="mapmarker" @change-type="
            map.type = $event;
            reloadMap();
          " @change-mode="
            map.mode = $event;
            reloadMap();
          " @close-map="openKakaoMap = false" :lat="map.lat" :long="map.long" :mapType="map.type" :mapMode="map.mode"
          :widthOptions="true" />
      </el-dialog>
      <el-button class="single-place__see-map" @click="openKakaoMap = true" circle type="success"
        icon="el-icon-map-location">
      </el-button>
    </div>
    <slot name="loading" v-else />
  </div>
</template>

<script>
  import { getDoc, getDocs, setDoc, updateDoc, doc, deleteDoc, addDoc, collection, query, where } from "firebase/firestore";
  import { auth, db, storage } from "~/plugins/firebase";
  import Introduction from "../../components/place/Introduction";
  import DiaporamaThumb from "../../components/place/DiaporamaThumb";
  import VuiModal from "~/components/vui-alpha/modal/VuiModal";
  import Commentaires from '../../components/place/Commentaires'
  import {
    getDownloadURL,
    ref as storageRef,
    deleteObject,
  } from "firebase/storage";

  import KakaoMap from "~/components/map/KakaoMap";
  import MapUiOptions from "~/components/map/map-ui/MapUiOptions";
  import { mapGetters, mapActions } from "vuex";
  import ImagesSettingModal from "~/components/modal/ImagesSettingModal";
  import { getImageUrl } from '~/utils/request.js'
  import Middleware from '~/pages/components/Middleware'

  export default {
    name: "place",
    components: {
      Introduction,
      DiaporamaThumb,
      KakaoMap,
      MapUiOptions,
      ImagesSettingModal,
      VuiModal,
      Middleware,
      Commentaires
    },

    data() {
      return {
        place: null,

        images: null,
        commentaires: [],
        thumbnail: null,
        imagesOrder: null,

        openModalEdit: false,
        openModalCommentaire: false,

        commentaire: '',

        carnet: null,

        modalBusy: false,
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

      user() {
        return auth && auth.currentUser
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
        try {
          this.busy = true
          this.place = this.places.find((place) => place.id === this.$route.params.id);
          let images = [];
          if (this.place) {
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

            this.carnet = Array.isArray(this.carnetPlace) ? this.carnetPlace : [];

            await this.loadCommentaires()

          }

        } catch (error) {
          console.log(error)
        } finally {
          this.busy = false
        }
      },

      async loadCommentaires() {
        const commentairesRef = query(collection(db, "commentaires"), where('placeId', '==', this.$route.params.id))
        let docs = await getDocs(commentairesRef)
        if (!docs) {
          return false
        } else {
          docs.forEach(doc => {
              this.commentaires.push({...doc.data(), id: doc.id })
          });
        }
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
        try {
          this.loadingBtn = true;
          this.carnet.push(this.$route.params.id);
          await setDoc(doc(db, "carnets", this.user.uid), {
            places: this.carnet
          })
          this.$message.success('Ce lieu à été ajouter à votre carnet de route')
          await this.loadCarnet(this.user.uid)
        } catch (error) {
          console.log(error)
        } finally {
          this.loadingBtn = false;
        }
      },

      async deletePlaceToCarnet() {
        try {
          this.loadingBtn = true;
          this.carnet = this.carnet.filter((placeId) => placeId != this.$route.params.id);
          await setDoc(doc(db, "carnets", this.user.uid), {
            places: this.carnet
          })
          this.$message.success('Ce lieu à été supprimer de votre carnet de route')
          await this.loadCarnet(this.user.uid)
        } catch (error) {
          console.log(e);
        } finally {
          this.loadingBtn = false;
        }
      },

      async onSubmitSettingImages() {
        try {
          this.modalBusy = true;
          const ref = doc(db, "lieux", this.$route.params.id);

          let thumbnailUrl = this.place.thumbnailUrl
          if (this.thumbnail !== this.place.thumbnail) {
            thumbnailUrl = await getImageUrl(this.thumbnail)
          }
          await updateDoc(ref, {
            images: this.imagesOrder,
            thumbnail: this.thumbnail,
            thumbnailUrl: thumbnailUrl
          })
          await this.loadPlaces();
          this.$message.success("Images mis à jour");
          this.openModalEdit = false;

        } catch (error) {
          this.$message.error("Une erreur est survenue");
        } finally {
          this.modalBusy = false;
        }
      },

      async addCommentaire() {
        try {
          this.modalBusy = true
          await addDoc(collection(db, "commentaires"), {
            placeId: this.$route.params.id,
            user: auth.currentUser.uid,
            content: this.commentaire,
            created_at: new Date()
          });
          this.openModalCommentaire = false
          this.$message.success("Commentaire ajouté")
        } catch (error) {
          console.log(error)
        } finally {
          this.modalBusy = false
        }

      }

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

    &_commentaires:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  ::v-deep .modal-commentaire {
    width: 800px;
    max-width: 90%;
  }
</style>