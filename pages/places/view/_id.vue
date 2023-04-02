<template>
  <div class="place-view">
    <!-- <Middleware :viewPlace="true" /> -->
    <div class="position-relative" v-if="!busy">
      <diaporama-thumb :images="place.images" class="diapo" />
      <section class="position-relative bg-light py-3">
        <b-container fluid="md">
          <!-- Introduction du lieu -->
          <div class="place-view-introduction">
            <vui-city-category :place="place" />
            <vui-user :link="true" :userUid="place.user" class="mt-3" />
            <h1 class="fs-3 mt-3">{{ place.title }}</h1>
            <p style="white-space: pre-line">{{ place.description }}</p>
          </div>
          <!-- Bouttons d'action -->
          <div class="place-view-buttons-action mt-3" v-if="currentUser">
            <vui-boolean-button
              :status="placePresentInCarnet"
              true-icon="el-icon-plus"
              false-icon="el-icon-minus"
              true-label="Carnet de route"
              false-label="Carnet de route"
              :loadingBtn="loadingBtn"
              @change="updateCarnet"
            />
            <setting-dropdown
              v-if="isAuthPlace"
              @command-button="handleCommand"
            />
          </div>
        </b-container>
      </section>

      <section role="commentaires">
        <b-container fluid="md">
          <comment
            @open-modal="modal = $event"
            :comments="comments"
            @click="openCommentModal"
            @load="loadComments"
          />
        </b-container>
      </section>

      <template v-if="modal.open">
        <el-dialog
          :append-to-body="true"
          :title="modal.title"
          :visible="modal.open"
          :fullscreen="modal.fullscreen"
          :custom-class="modal.customClass"
          @close="resetModalDatas"
        >
          <template v-if="modal.name === 'images'">
            <GestionImagesModal
              :place="place"
              @modal-busy="modalBusy = $event"
              @close="resetModalDatas"
              @load="loadPlace"
            />
          </template>
          <template v-if="modal.name === 'kakaomap'">
            <kakao-map
              :place="place"
              :showCloseBtn="true"
              :showRedirectBtn="false"
              :showTypeOptions="true"
              :showModeOptions="true"
              @close-map="resetModalDatas"
            />
          </template>
          <template v-if="modal.name === 'comments'">
            <comment-modal
              @modal-busy="modalBusy = $event"
              @load="loadComments"
              @close="resetModalDatas"
            />
          </template>
        </el-dialog>
      </template>

      <el-button
        class="place-view__see-map"
        @click="openKakaoMap"
        circle
        type="success"
        icon="el-icon-map-location"
      >
      </el-button>
    </div>
    <slot name="loading" v-else />
  </div>
</template>

<script>
import DiaporamaThumb from '../../components/place/DiaporamaThumb'
import SettingDropdown from '@/pages/components/place/_SettingDropdown'
import Comment from '../../components/place/Comment'

import MapUiOptions from '~/components/map/map-ui/MapUiOptions'
import { mapGetters, mapActions } from 'vuex'
import Middleware from '~/pages/components/Middleware'
import VuiCityCategory from '@/components/vui-alpha/VuiCityCategory'
import VuiUser from '@/components/vui-alpha/VuiUser.vue'
import VuiBooleanButton from '@/components/vui-alpha/VuiBooleanButton'
import GestionImagesModal from '@/components/modal/GestionImagesModal'
import KakaoMapModal from '@/components/modal/KakaoMapModal.vue'
import CommentModal from '@/components/modal/CommentModal'
import KakaoMap from '../../../components/map/KakaoMap.vue'
export default {
  name: 'singlePlace',
  components: {
    DiaporamaThumb,
    VuiCityCategory,
    VuiBooleanButton,
    MapUiOptions,
    Middleware,
    KakaoMapModal,
    CommentModal,
    Comment,
    VuiUser,
    SettingDropdown,
    GestionImagesModal,
    KakaoMap,
  },

  data() {
    return {
      place: null,
      comments: [],
      carnet: [],

      modal: {
        open: false,
        name: null,
        title: null,
        fullscreen: false,
        customClass: null,
      },
      modalBusy: false,
      loadingBtn: false,

      commentaire: '',
      busy: false,
    }
  },

  computed: {
    ...mapGetters('app', {
      cities: 'getCities',
      categories: 'getCategories',
    }),

    currentUser() {
      return this.$fire.auth ? this.$fire.auth.currentUser.uid : null
    },

    isAuthPlace() {
      return this.place.user === this.currentUser
    },

    placePresentInCarnet() {
      let inCarnet = false

      if (
        this.currentUser &&
        Array.isArray(this.carnet) &&
        this.carnet.includes(this.$route.params.id)
      ) {
        inCarnet = true
      }
      return inCarnet
    },
  },

  async created() {
    await this.loadView()
  },

  methods: {
    resetModalDatas() {
      this.modal = {
        open: false,
        name: null,
        title: null,
        fullscreen: false,
        customClass: null,
      }
    },

    openKakaoMap() {
      this.modal = {
        open: true,
        name: 'kakaomap',
        title: null,
        fullscreen: true,
        customClass: null,
      }
    },

    openCommentModal() {
      this.modal = {
        open: true,
        name: 'comments',
        title: 'Ajouter un commentaire',
        fullscreen: false,
        customClass: 'comment-modal',
      }
    },

    handleCommand(command) {
      if (command === 'goToPlaceEditView') {
        this.$router.replace('/places/edit/' + this.$route.params.id)
      } else if (command === 'openModalPictureSetting') {
        this.modal = {
          open: true,
          name: 'images',
          title: null,
          fullscreen: true,
          customClass: null,
        }
      }
    },

    async loadView() {
      try {
        this.$router.app.$emit('viewLoading', true)
        this.busy = true
        await this.loadPlace()
        await this.loadComments()
        await this.loadCarnet()
      } catch (error) {
        console.log(error)
      } finally {
        this.busy = false
        this.$router.app.$emit('viewLoading', false)
      }
    },

    async loadPlace() {
      try {
        const documentRef = await this.$fire.firestore
          .collection('lieux')
          .doc(this.$route.params.id)
          .get()

        if (documentRef.exists) {
          this.place = documentRef.data()
        }
      } catch (error) {}
    },

    async loadCarnet() {
      try {
        const carnetDocumentRef = await this.$fire.firestore
          .collection('carnets')
          .doc(this.currentUser)
          .get()

        if (carnetDocumentRef.exists) {
          this.carnet = await carnetDocumentRef.data().places
        }
      } catch (error) {
        console.log(error)
      }
    },

    async loadComments() {
      try {
        const commentDocumentRef = await this.$fire.firestore
          .collection('commentaires')
          .where('placeId', '==', this.$route.params.id)
          .orderBy('created_at', 'desc')
          .get()

        let comments = []
        commentDocumentRef.docs.forEach((comment) => {
          if (comment.exists) {
            comments.push({ ...comment.data(), id: comment.id })
          }
        })
        this.comments = comments
      } catch (error) {
        console.log(error)
      }
    },

    async updateCarnet() {
      try {
        this.loadingBtn = true

        let carnetDocument = this.$fire.firestore
          .collection('carnets')
          .doc(this.currentUser)

        if (this.placePresentInCarnet) {
          this.carnet = this.carnet.filter(
            (placeId) => placeId !== this.$route.params.id
          )
        } else {
          this.carnet.push(this.$route.params.id)
        }

        if (this.carnet.length > 0) {
          await carnetDocument.set({
            places: [...this.carnet],
          })

          this.$message.success(
            this.placePresentInCarnet
              ? 'Lieu ajouté dans votre carnet de route'
              : 'Lieu supprimé de votre carnet de route'
          )
        } else {
          await carnetDocument.delete()
          this.$message.success('Lieu supprimé de votre carnet de route')
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.loadingBtn = false
      }
    },
  },
}
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

::v-deep .comment-modal {
  width: 500px;
  max-width: 100%;
}
</style>
