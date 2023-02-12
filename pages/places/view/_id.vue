<template>
  <div class="place-view">
    <Middleware :viewPlace="true" />
    <div class="position-relative" v-if="!busy">
      <DiaporamaThumb :images="place.images" class="diapo" />
      <section class="position-relative bg-light py-3">
        <b-container fluid="md">
          <Introduction
            :place="place"
            :user="user"
            :isAuthPlace="isAuthPlace"
            @open-kakao-map="openKakaoMap = true"
            @command-button="handleCommand"
            />
        </b-container>
      </section>

      <section role="commentaires">
        <b-container>
          <Comment @open-modal="modal = $event" :comments="comments" @load-comments="loadCommentaires" />
        </b-container>
      </section>

      <Modals :modal="modal" @close-modal="closeModal" :place="place"
        @load-place="reloadPlace" @load-comments="loadCommentaires" />

      <el-button class="place-view__see-map" @click="modal.open = true, modal.name = 'kakaomap' " circle type="success"
        icon="el-icon-map-location">
      </el-button>

    </div>
    <slot name="loading" v-else />
  </div>
</template>

<script>
  import { getDoc, getDocs, doc, addDoc, collection, query, where, orderBy } from "firebase/firestore";
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


  import MapUiOptions from "~/components/map/map-ui/MapUiOptions";
  import { mapGetters, mapActions } from "vuex";
  import { getImageUrl } from '~/utils/request.js'
  import Middleware from '~/pages/components/Middleware'
  import Modals from '~/pages/components/place/Modals'
  export default {
    name: "place",
    components: {
      Introduction,
      DiaporamaThumb,
      MapUiOptions,
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
        return auth ? auth.currentUser : null
      },

      isAuthPlace() {
        return (
          this.user ? this.place && this.place.user.localId == this.user.uid : false
        );
      },

    },

    async created() {
      await this.hydrateDataPlace();
      await this.loadCommentaires()
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
          this.$router.replace('/places/edit/' + this.$route.params.id);
        } else if (command === "openModalPictureSetting") {
          this.modal.open = true
          this.modal.name = "gestionImages"
        }
      },

      async reloadPlace(){
        await this.loadPlaces()
        await this.hydrateDataPlace()
      },

      async hydrateDataPlace() {
        try {
          this.busy = true

          const docRef = doc(db, "lieux", this.$route.params.id);
          const docSnap = await getDoc(docRef)
          this.place = docSnap.data();

          if (this.place) {
            this.place.user = this.users.find(user => user.localId === this.place.user)
          }

        } catch (error) {
          console.log(error)
        } finally {
          this.busy = false
        }
      },

      async loadCommentaires() {
        const commentairesRef = query(collection(db, "commentaires"), where('placeId', '==', this.$route.params.id), orderBy('created_at', 'desc'))
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