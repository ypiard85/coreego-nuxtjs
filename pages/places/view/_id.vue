<template>
  <div class="place-view">
    <Middleware :viewPlace="true" />
    <div class="position-relative" v-if="place && !busy">
      <DiaporamaThumb :images="images" class="diapo" />
      <section class="position-relative bg-light py-3">
        <b-container fluid="md">
          <Introduction :place="place" :city="city" :category="category"
            @open-modal-setting-images="handleOpenModalSettingImages" @open-kakao-map="openKakaoMap = true"
            :inCarnet="inCarnet" :isAuthPlace="isAuthPlace" @add-to-carnet="addToCarnet"
            @delete-to-carnet="deleteToCarnet" @command-button="handleCommand" :loadingBtn="loadingBtn" />
        </b-container>
      </section>

      <!-- <section role="commentaires">
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
      </section> -->

      <!-- <el-dialog v-loading="modalBusy" title="Ajouter un commentaire" @close="openModalCommentaire = false"
        :visible="openModalCommentaire" custom-class="modal-commentaire" :append-to-body="true">
        <el-form>
          <el-input :rows="10" type="textarea" v-model="commentaire" />
          <el-button class="mt-3" size="small" :disabled="commentaire.trim() == '' " type="success"
            @click="addCommentaire">Ajouter</el-button>
        </el-form>
      </el-dialog> -->

      <Modals :openModal="openModal" @close-modal="openModal = false; modalName = null"
        :name="modalName"
        :place="place"
        :images="images"
        :thumbnail="thumbnail"
        @load-place="loadPlaces"
        />

      <el-button class="place-view__see-map" @click="openModal = true; modalName = 'kakaomap' " circle type="success"
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
  import Modals from '~/pages/components/place/Modals'
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
      Modals,
      Commentaires
    },

    data() {
      return {
        place: null,

        images: null,

        commentaires: [],

        openModal: false,
        modalName: null,

        commentaire: '',

        carnet: null,

        modalBusy: false,
        busy: false,

        loadingBtn: false,
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
          this.openModal = true;
          this.modalName = 'gestionImages'
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
            this.commentaires.push({ ...doc.data(), id: doc.id })
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

      async addToCarnet() {
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

      async deleteToCarnet() {
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
  .place-view {
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