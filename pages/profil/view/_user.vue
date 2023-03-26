<template>
  <div class="profil" v-if="user" v-loading="isBusy">
    <header class="profil__header">
      <div class="profil__header--thumbnail">
        <el-image
          v-if="(profil && profil.thumbnail) || thumbnailFile"
          :src="thumbnailFile ? thumbnailFile.url : profil.thumbnail.url"
          style="width: 100%"
        ></el-image>
        <el-image v-else :src="IMAGE_EMPTY"></el-image>
        <vui-single-upload
          v-if="editGranted"
          class="button_upload"
          @change-file="handleUpdateFile($event, 'thumbnailFile')"
          icon="el-icon-edit text-dark"
        />
      </div>
      <b-container>
        <div class="profil__header--user" v-if="user && user.photoURL">
          <div class="profil__header--user-avatar">
            <el-avatar
              v-if="!avatarFile"
              :src="user.photoURL"
              :size="120"
            ></el-avatar>
            <el-avatar v-else :src="avatarFile.url" :size="120"></el-avatar>
            <vui-single-upload
              v-if="editGranted"
              class="button_upload"
              @change-file="handleUpdateFile($event, 'avatarFile')"
              icon="el-icon-edit"
              type="success"
            />
          </div>
          <p class="h5">{{ user.displayName }}</p>
        </div>
      </b-container>
    </header>
    <b-container>
      <div class="row">
        <div class="profil__about mt-3 col-md-12">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>Description</span>
              <el-button
                v-if="editGranted"
                @click="openAbout = !openAbout"
                style="float: right; padding: 3px 0"
                class="text-dark"
                type="text"
                icon="el-icon-edit"
              ></el-button>
            </div>
            <template v-if="!openAbout">
              <div class="text description">
                <p
                  style="white-space: pre-line"
                  v-if="profil && profil.about && profil.about.length"
                  v-html="profil.about"
                ></p>
                <em v-else>Aucune description</em>
              </div>
            </template>
            <template v-else>
              <el-form class="demo-ruleForm">
                <label for="description"
                  ><strong>Parler un peu de vous</strong>
                  <small>[{{ about.length }} - 500 caractères]</small></label
                >
                <div class="mb-3">
                  <small class="text-secondary">code html autorisé</small>
                </div>
                <el-form-item>
                  <el-input
                    type="textarea"
                    @input="inputAbout"
                    id="description"
                    :value="about"
                    rows="10"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="success" size="small" @click="onSubmitAbout"
                    >Modifier</el-button
                  >
                  <el-button
                    type="danger"
                    size="small"
                    @click="openAbout = false"
                    >Annuler</el-button
                  >
                </el-form-item>
              </el-form>
            </template>
          </el-card>
        </div>
      </div>
      <!-- section activités -->
      <div class="row">
        <template v-if="editGranted">
          <div class="col-md-6 mt-5">
            <el-card class="box-card">
              <div
                slot="header"
                class="d-flex justify-content-between align-items-center"
              >
                <span>Mon carnet de route</span>
                <el-button type="success" size="small">Voir la map</el-button>
              </div>
              <div>
                <template v-if="carnets.length">
                  <nuxt-link
                    :to="'/places/view/' + place.id"
                    v-for="(place, index) in carnets"
                    :key="index"
                    class="mb-3 d-block"
                  >
                    <card-place-linear :place="place" />
                  </nuxt-link>
                </template>
                <em v-else>Votre carnet de route est vide</em>
              </div>
            </el-card>
          </div>
        </template>
        <div class="col-md-6 mt-5">
          <el-card class="box-card">
            <div
              slot="header"
              class="d-flex justify-content-between align-items-center"
            >
              <span>Dernier lieux publiés</span>
              <el-button type="success" size="small" @click.stop="watchUserPlaces">Voir plus</el-button>
            </div>
            <div>
              <template v-if="placesPublished.length">
                <nuxt-link
                  :to="'/places/view/' + place.id"
                  v-for="(place, index) in placesPublished"
                  :key="index"
                  class="mb-3 d-block"
                >
                  <card-place-linear :place="place" />
                </nuxt-link>
              </template>
              <em v-else>Aucun lieux publiés</em>
            </div>
          </el-card>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { IMAGE_EMPTY } from '~/utils/variables'
import VuiSingleUpload from '@/components/vui-alpha/input/VuiSingleUpload'
import * as imageConversion from 'image-conversion'
import VuiTag from '~/components/vui-alpha/VuiTag'
import { auth, db, updateProfileUser } from '~/plugins/firebase'
import ViewPlaces from '~/pages/places/index'
import { doc, setDoc } from 'firebase/firestore'
import Middleware from '~/pages/components/Middleware'
import CardPlaceLinear from '@/components/card/CardPlaceLinear.vue'

export default {
  name: 'profil',

  components: {
    VuiSingleUpload,
    VuiTag,
    ViewPlaces,
    Middleware,
    CardPlaceLinear,
  },

  data() {
    return {
      isBusy: false,
      //hydrater lors de l'initialisation de la view
      user: null,
      profil: null,
      carnets: [],
      placesPublished: [],

      thumbnailFile: null,
      avatarFile: null,

      IMAGE_EMPTY,

      about: '',

      thumbnailBusy: false,
      avatarBusy: false,

      // ouverture
      openAbout: false,
      visibleDialogPlace: false,
    }
  },

  async created() {
    await this.initView()
  },

  computed: {
    ...mapGetters('app', {
      categories: 'getCategories',
      cities: 'getCities',
      filters: 'getFilters'
    }),

    category() {
      return (categoryId) => {
        return this.categories.find((category) => category.id === categoryId)
      }
    },

    editGranted() {
      return (
        this.$fire.auth.currentUser &&
        this.user &&
        this.$fire.auth.currentUser.uid === this.user.uid
      )
    },

    city() {
      return (cityId) => {
        return this.cities.find((city) => city.id === cityId)
      }
    },
  },

  methods: {
    ...mapActions('app', ['setFilters'] ),

    watchUserPlaces(){
        let filters = Object.assign(this.filters)
        filters['user'] = this.$route.params.user
        this.setFilters(filters)
        this.$router.replace('/places')
    },

    async initView() {
      this.$router.app.$emit('viewLoading', true)
      try {
        const userDocumentRef = await this.$fire.firestore
          .collection('users')
          .doc(this.$route.params.user)
          .get()

        const profilDocumentRef = await this.$fire.firestore
          .collection('profils')
          .doc(this.$route.params.user)
          .get()

        const carnetDocumentRef = await this.$fire.firestore
          .collection('carnets')
          .doc(this.$route.params.user)
          .get()

        const placesDocumentRef = await this.$fire.firestore
          .collection('lieux')
          .where('user', '==', this.$route.params.user)
          .orderBy('updated_at', 'desc')
          .limit(2)

        if (profilDocumentRef.exists) {
          this.profil = profilDocumentRef.data()

          if (this.profil.about) {
            this.about = this.profil.about
          }
        }

        if (carnetDocumentRef.exists) {
          const placeIds = carnetDocumentRef.data().places
          let carnets = []

          if (placeIds && placeIds.length > 0) {
            for (let placeId of placeIds) {
              const place = await this.getPlaceById(placeId)
              carnets.push(place)
            }
          }
          this.carnets = carnets
        }

        if (placesDocumentRef) {
          const documentPlacesSnapShots = await placesDocumentRef.get()

          if (documentPlacesSnapShots) {
            this.placesPublished = documentPlacesSnapShots.docs.map((doc) => {
              return { ...doc.data(), id: doc.id }
            })
          }
          // this.placesPublished.push()
        }

        this.user = userDocumentRef.data()
      } catch (error) {
        console.log(error)
      }
      this.$router.app.$emit('viewLoading', false)
    },

    inputAbout($event) {
      if ($event.length <= 500) {
        this.about = $event
      }
    },

    getPlaceById(placeId) {
      return new Promise((resolve, reject) => {
        this.$fire.firestore
          .collection('lieux')
          .doc(placeId)
          .get()
          .then((response) => {
            if (response.exists) {
              resolve({ ...response.data(), id: response.id })
            }
          })
          .catch((error) => {
            reject("Le document n'a pas pu être chargé")
          })
      })
    },

    async handleUpdateFile($event, name) {
      try {
        await this.changeFile($event.target.files[0], name)
      } catch (error) {
        console.log(error)
      }
    },

    changeFile(image, sectionEdit) {
      imageConversion
        .compressAccurately(image, 200)
        .then((res) => {
          this[sectionEdit] = {
            file: res,
            url: URL.createObjectURL(res),
          }
          this.$bvModal
            .msgBoxConfirm('Voullez vous modifier cette image ? ', {
              size: 'sm',
              buttonSize: 'sm',
              okVariant: 'success',
              okTitle: 'Oui',
              cancelTitle: 'Non',
            })
            .then((res) => {
              if (res) {
                this.onSubmit(sectionEdit)
              } else {
                this[sectionEdit] = null
              }
            })
        })
        .catch((error) => console.log(error))
    },

    async submitThumbnail(fileName) {
      if (this.profil && this.profil.thumbnail) {
        const profilCurrentDocumentRef = this.$fire.storage.ref(
          'couvertures/' + this.profil.thumbnail.name
        )
        await profilCurrentDocumentRef.delete()
      }
      const profilDocumentRef = this.$fire.storage.ref(
        'couvertures/' + fileName
      )
      await profilDocumentRef.put(this.thumbnailFile.file)
      let PICTURE_URL = await profilDocumentRef.getDownloadURL()
      await this.$fire.firestore
        .collection('profils')
        .doc(this.user.uid)
        .set({
          ...this.profil,
          thumbnail: {
            name: fileName,
            url: PICTURE_URL,
          },
        })
    },

    async onSubmitAbout() {
      this.isBusy = true
      try {
        await setDoc(doc(db, 'profils', this.$route.params.user), {
          ...this.profil,
          about: this.about,
        })

        this.isBusy = false
        this.openAbout = false
        this.$message.success('Profil mis à jour avec succès')
        await this.initView()
      } catch (error) {
        console.log(error)
      }
    },

    async submitAvatar(fileName) {
      if (this.profil.avatar) {
        const profilCurrentStorageRef = this.$fire.storage.ref(
          'avatars/' + this.profil.avatar.name
        )
        await profilCurrentStorageRef.delete()
      }

      const profilStorageRef = this.$fire.storage.ref('avatars/' + fileName)
      await profilStorageRef.put(this.avatarFile.file)
      const PICTURE_URL = await profilStorageRef.getDownloadURL()

      await updateProfileUser(this.$fire.auth.photoURL, PICTURE_URL)

      const profilDocumentRef = this.$fire.firestore
        .collection('profils')
        .doc(this.$route.params.user)

      const userDocumentRef = this.$fire.firestore
        .collection('users')
        .doc(this.$route.params.user)

      await profilDocumentRef.set({
        ...this.profil,
        avatar: {
          name: fileName,
          url: PICTURE_URL,
        },
      })

      await userDocumentRef.set({
        ...this.user,
        photoURL: PICTURE_URL,
      })
    },

    async onSubmit(section) {
      let fileName =
        this.user.uid + Math.floor(Math.random() * (80000 - 1000) + 1000)
      this.isBusy = true
      try {
        if (section === 'thumbnailFile') {
          await this.submitThumbnail(fileName)
        } else if (section === 'avatarFile') {
          await this.submitAvatar(fileName)
        }
        await this.initView()
        this.$message.success('Profil mis à jour avec succès')
      } catch (error) {
        console.log(error)
        this.$message.error(error)
      } finally {
        this.isBusy = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .profil {
  &__header {
    &--thumbnail {
      height: 300px;
      position: relative;

      .el-image {
        height: 100%;
        width: 100%;

        img {
          object-fit: cover;
          object-position: center;
        }
      }

      .button_upload {
        position: absolute;
        top: 20px;
        right: 20px;

        > span {
          margin-left: 0;
        }
      }
    }

    &--user {
      margin-top: -80px;
      margin-left: 50px;
      position: relative;

      &-avatar {
        width: max-content;
        position: relative;

        .button_upload {
          position: absolute;
          bottom: 20px;
          right: 0;

          > span {
            margin-left: 0;
          }
        }

        .el-avatar {
          border: 8px solid white;
        }
      }
    }
  }

  &__about {
    .text {
      max-height: 300px;
      overflow-y: auto;
    }
  }

  &--places-published {
    .el-image {
      min-width: 50px;
      max-width: 50px;
      height: 50px;
    }

    &__content:not(:last-child) {
      margin-bottom: 10px;
    }

    &__content {
      display: flex;
      align-items: center;
      align-content: center;

      &:hover {
        background: $gray-light;
      }
    }
  }
}
</style>
