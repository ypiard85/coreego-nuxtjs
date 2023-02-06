<template>
  <div class="place-view">
    <Middleware :viewPlace="true" />
    <div class="position-relative" v-if="!busy">
      <DiaporamaThumb :images="images" class="diapo" />
      <section class="position-relative bg-light py-3">
        <b-container fluid="md">
          <Introduction :place="place" :city="city" :category="category" @open-kakao-map="openKakaoMap = true"
            :inCarnet="inCarnet" :isAuthPlace="isAuthPlace" @add-to-carnet="addToCarnet"
            @delete-to-carnet="deleteToCarnet" @command-button="handleCommand" :loadingBtn="loadingBtn" />
        </b-container>
      </section>

      <section role="commentaires">
        <b-container>
          <Comment @open-modal="modal = $event" :comments="comments" @load-comments="loadCommentaires" />
        </b-container>
      </section>

      <Modals :modal="modal" @close-modal="closeModal" :place="place" :images="images"
        :thumbnail="thumbnail" @load-place="hydrateDataPlace" @load-comments="loadCommentaires" />

      <el-button class="place-view__see-map" @click="modal.open = true, modal.name = 'kakaomap' " circle type="success"
        icon="el-icon-map-location">
      </el-button>

    </div>
    <slot name="loading" v-else />
  </div>
</template>

<script>
  import { getDoc, getDocs, setDoc, updateDoc, doc, deleteDoc, addDoc, collection, query, where, orderBy } from "firebase/firestore";
  import { auth, db, storage } from "~/plugins/firebase";
  import Introduction from "../../components/place/Introduction";
  import DiaporamaThumb from "../../components/place/DiaporamaThumb";
  import VuiModal from "~/components/vui-alpha/modal/VuiModal";
  import Comment from '../../components/place/Comment'
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
      Comment
    },

    data() {
      return {
        place: null,

        images: null,

        comments: [],

        modal: {
          open: false,
          name: null,
          title: null
        },

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

      closeModal() {
        this.modal = {
          open: false,
          name: null,
          title: null
        }
      },

      handleCommand(command) {
        if (command === "goToPlaceEditView") {
          this.$router.replace('/places/edit/' + this.place.id);
        } else if (command === "openModalPictureSetting") {
          this.modal.open = true
          this.modal.name = "gestionImages"
        }
      },

      async hydrateDataPlace() {
        try {
          this.busy = true

          const docRef = doc(db, "lieux", this.$route.params.id);
          const docSnap = await getDoc(docRef)
          this.place = docSnap.data();

          let images = [];
          if (this.place) {
            this.place.user = this.users.find(user => user.localId === this.place.user)
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
        const commentairesRef = query(collection(db, "commentaires"), where('placeId', '==', this.$route.params.id),  orderBy('created_at', 'desc'))
        let docs = await getDocs(commentairesRef)
        if (!docs) {
          return false
        } else {
          let comments = []
          docs.forEach(doc => {
            comments.push({ ...doc.data(), id: doc.id })
          });
          this.comments = comments
        }
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
  }
</style>