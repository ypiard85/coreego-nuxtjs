<template>
  <div class="place-view">
    <!-- <Middleware :viewPlace="true" /> -->
    <div class="position-relative" v-if="!busy">
      <DiaporamaThumb :images="place.images" class="diapo" />
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
              @command-button="$emit('command-button', $event)"
            />
          </div>
          <!-- <Introduction
            :place="place"
            :user="user"
            :isAuthPlace="isAuthPlace"
            @open-kakao-map="openKakaoMap = true"
            @command-button="handleCommand"
          /> -->
        </b-container>
      </section>

      <!-- <section role="commentaires">
        <b-container>
          <Comment
            @open-modal="modal = $event"
            :comments="comments"
            @load-comments="loadCommentaires"
          />
        </b-container>
      </section> -->

      <!-- <Modals
        :modal="modal"
        @close-modal="closeModal"
        :place="place"
        @load-place="reloadPlace"
        @load-comments="loadCommentaires"
      /> -->

      <el-button
        class="place-view__see-map"
        @click=";(modal.open = true), (modal.name = 'kakaomap')"
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
import {
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
  collection,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { auth, db } from '~/plugins/firebase'
import Introduction from '../../components/place/Introduction'
import DiaporamaThumb from '../../components/place/DiaporamaThumb'
import SettingDropdown from '@/pages/components/place/_SettingDropdown'
import VuiModal from '~/components/vui-alpha/modal/VuiModal'
import Comment from '../../components/place/Comment'

import MapUiOptions from '~/components/map/map-ui/MapUiOptions'
import { mapGetters, mapActions } from 'vuex'
import Middleware from '~/pages/components/Middleware'
import Modals from '~/pages/components/place/Modals'
import VuiCityCategory from '@/components/vui-alpha/VuiCityCategory'
import VuiUser from '../../../components/vui-alpha/VuiUser.vue'
import VuiBooleanButton from '../../../components/vui-alpha/VuiBooleanButton'

export default {
  name: 'place',
  components: {
    Introduction,
    DiaporamaThumb,
    VuiCityCategory,
    VuiBooleanButton,
    MapUiOptions,
    VuiModal,
    Middleware,
    Modals,
    Comment,
    VuiUser,
    SettingDropdown,
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
      },

      commentaire: '',

      modalBusy: false,
      busy: false,

      loadingBtn: false,
    }
  },

  computed: {
    ...mapGetters('app', {
      cities: 'getCities',
      categories: 'getCategories',
    }),

    currentUser() {
      return auth ? auth.currentUser.uid : null
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
    ...mapActions('app', ['loadPlaces', 'loadCarnet']),

    closeModal() {
      this.modal = {
        open: false,
        name: null,
        title: null,
      }
    },

    handleCommand(command) {
      if (command === 'goToPlaceEditView') {
        this.$router.replace('/places/edit/' + this.$route.params.id)
      } else if (command === 'openModalPictureSetting') {
        this.modal.open = true
        this.modal.name = 'gestionImages'
      }
    },

    async reloadPlace() {
      await this.loadPlaces()
      await this.hydrateDataPlace()
    },

    async loadView() {
      try {
        this.busy = true

        const placeDocumentRef = doc(db, 'lieux', this.$route.params.id)
        const commentDocumentRef = query(
          collection(db, 'commentaires'),
          where('placeId', '==', this.$route.params.id),
          orderBy('created_at', 'desc')
        )

        const carnetDocumentRef = doc(db, 'carnets', this.currentUser)

        let [place, comments, carnet] = await Promise.all([
          getDoc(placeDocumentRef),
          getDocs(commentDocumentRef),
          getDoc(carnetDocumentRef),
        ])

        if (place.exists()) {
          this.place = place.data()
        }

        if (carnet.exists()) {
          this.carnet = carnet.data().places
        }

        if (comments) {
          comments.forEach((comment) => {
            this.comments.push({ ...comment.data(), id: comment.id })
          })
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.busy = false
      }
    },

    async updateCarnet() {
      try {
        this.loadingBtn = true

        if (this.placePresentInCarnet) {
          this.carnet = this.carnet.filter(
            (placeId) => placeId !== this.$route.params.id
          )
        } else {
          this.carnet.push(this.$route.params.id)
        }

        if (this.carnet.length > 0) {
          await setDoc(doc(db, 'carnets', this.currentUser), {
            places: [...this.carnet],
          })
          this.$message.success(
            this.placePresentInCarnet
              ? 'Lieu ajouté dans votre carnet de route'
              : 'Lieu supprimé de votre carnet de route'
          )
        } else {
          await deleteDoc(doc(db, 'carnets', this.currentUser))
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
</style>
