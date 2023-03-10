<template>
  <div class="profil mb-5" v-loading="isBusy">
    <Middleware :userProfil="true" />
    <div class="profil__header" v-if="user && avatarUrl">
      <div class="profil__header--thumbnail">
        <el-image
          v-if="!thumbnail"
          :src="couvertureUrl"
          style="width: 100%"
        ></el-image>
        <el-image v-else="v-else" :src="thumbnail.url"></el-image>
        <vui-single-upload
          v-if="isAuthProfil"
          class="button_upload"
          @change-file="handleFileCouverture"
          icon="el-icon-edit text-dark"
        />
      </div>

      <b-container>
        <section class="profil__header--user">
          <div class="profil__header--user-avatar" v-if="avatarUrl">
            <el-avatar v-if="!avatar" :src="avatarUrl" :size="120"></el-avatar>
            <el-avatar
              :size="120"
              v-else="v-else"
              :src="avatar.url"
            ></el-avatar>
            <vui-single-upload
              v-if="isAuthProfil"
              class="button_upload"
              @change-file="handleFileAvatar"
              icon="el-icon-plus"
              type="success"
            />
          </div>
          <p class="h5">{{ user.displayName }}</p>
        </section>

        <section class="profil--about mt-3">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="fw-bold">A propos</span>
              <el-button
                v-if="isAuthProfil"
                @click="openAbout = !openAbout"
                style="float: right; padding: 3px 0"
                class="text-dark"
                type="text"
                icon="el-icon-edit"
              ></el-button>
            </div>
            <div class="text" v-if="!openAbout">
              <p
                v-if="profil && 'about' in profil && profil.about.length > 0"
                style="white-space: pre-line"
              >
                {{ profil.about }}
              </p>
              <em v-else>Aucune description</em>
            </div>
            <el-form class="demo-ruleForm" v-else="v-else">
              <el-form-item label="Parler un peu de vous">
                <el-input type="textarea" v-model="about" rows="10"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="success"
                  size="small"
                  :disabled="isChangedAbout"
                  @click="onSubmitAbout"
                  >Modifier</el-button
                >
              </el-form-item>
            </el-form>
          </el-card>
        </section>

        <section class="profil--places-published mt-3">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span class="fw-bold">Lieux publi??s</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                v-if="placeAll(null).length"
                @click="visibleDialogPlace = true"
                >Voir tous</el-button
              >
            </div>
            <template v-if="placeAll(null).length">
              <nuxt-link
                :to="'/places/view/' + place.id"
                :underline="false"
                v-for="(place, i) in placeAll(5)"
                :key="i"
                class="profil--places-published__content p-2"
              >
                <div class="d-flex align-items-center mw-100">
                  <el-image
                    :src="place.thumbnail.url"
                    class="rounded me-3"
                    fit="cover"
                  ></el-image>
                  <div
                    class="profil--places-published__content--title"
                    style="min-width: 0"
                  >
                    <span class="fs-6 mb-1 fw-bold d-block text-truncate">{{
                      place.title
                    }}</span>
                    <div class="d-flex align-items-center">
                      <span class="me-3">
                        <i class="el-icon-location-outline" />
                        {{ city(place.city).label }}
                      </span>
                      <vui-tag
                        :label="category(place.category).name"
                        :color="category(place.category).color"
                      />
                    </div>
                  </div>
                </div>
              </nuxt-link>
            </template>
            <em v-else>Aucun lieu publi??</em>
          </el-card>
        </section>
      </b-container>

      <el-dialog
        :title="'Lieux de : ' + user.displayName"
        :fullscreen="true"
        :visible="visibleDialogPlace"
        @close="visibleDialogPlace = false"
      >
        <template v-if="places.at(0)">
          <el-row :gutter="10">
            <el-col
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              class="mb-2"
              v-for="(place, i) in placeAll(null)"
              :key="i"
            >
              <card-place :place="place" />
            </el-col>
          </el-row>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { IMAGE_EMPTY } from '~/utils/variables'
import VuiSingleUpload from '@/components/vui-alpha/input/VuiSingleUpload'
import * as imageConversion from 'image-conversion'
import VuiTag from '~/components/vui-alpha/VuiTag'
import {
  getDownloadURL,
  ref as storageRef,
  deleteObject,
  uploadBytesResumable,
} from 'firebase/storage'
import { auth, db, storage, updateProfileUser } from '~/plugins/firebase'
import ViewPlaces from '~/pages/places/index'
import {
  doc,
  setDoc,
  addDoc,
  collection,
  GeoPoint,
  updateDoc,
} from 'firebase/firestore'
import { deleteImage } from '@/utils/request'
import Middleware from '~/pages/components/Middleware'

export default {
  name: 'profil',

  components: {
    VuiSingleUpload,
    VuiTag,
    ViewPlaces,
    Middleware,
  },

  data() {
    return {
      IMAGE_EMPTY,

      profil: null,
      editName: null,

      thumbnail: null,
      avatar: null,
      // displayName: "",
      about: '',

      thumbnailBusy: false,
      avatarBusy: false,
      isBusy: false,

      // ouverture
      openAbout: false,
      visibleDialogPlace: false,
    }
  },

  created() {
    this.hydrateProfil()
  },

  computed: {
    ...mapGetters('app', {
      users: 'getUsers',
      places: 'getPlaces',
      categories: 'getCategories',
      cities: 'getCities',
    }),

    user() {
      return this.users.find((user) => user.localId === this.$route.params.user)
    },

    category() {
      return (categoryId) => {
        return this.categories.find((category) => category.id === categoryId)
      }
    },

    isAuthProfil() {
      return this.user && this.user.localId === this.$route.params.user
    },

    city() {
      return (cityId) => {
        return this.cities.find((city) => city.id === cityId)
      }
    },

    placeAll() {
      return (slice) => {
        let results = this.places.filter(
          (place) => place.user.localId === this.$route.params.user
        )
        if (slice != null) {
          return results.slice(0, slice)
        } else {
          return results
        }
      }
    },

    couvertureUrl() {
      if (this.profil && this.profil.thumbnail) {
        return this.profil.thumbnail.url
      } else {
        return IMAGE_EMPTY
      }
    },

    avatarUrl() {
      if (this.profil && this.profil.avatar) {
        return this.profil.avatar.url
      } else {
        return this.user.photoUrl
      }
    },

    isChangedAbout() {
      if (this.profil && 'about' in this.profil) {
        return this.profil.about.trim() === this.about.trim()
      } else {
        return this.about.trim().length === 0
      }
    },
  },

  methods: {
    ...mapActions('app', ['loadProfil', 'loadUsers']),

    hydrateProfil() {
      Promise.resolve(this.loadProfil(this.$route.params.user))
        .then((res) => {
          this.profil = {
            ...res,
          }

          if (res && 'about' in res) {
            this.about = res.about
          }
        })
        .catch((error) => console.log('redirection home'))
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
                console.log('annulation edit')
                this[sectionEdit] = null
              }
            })
        })
        .catch((error) => console.log(error))
    },

    async submitThumbnail(fileName) {
      if (this.profil && this.profil.thumbnail) {
        await deleteImage('couvertures', this.profil.thumbnail.name)
      }
      const PICTURE_REF = storageRef(storage, 'couvertures/' + fileName)
      await uploadBytesResumable(PICTURE_REF, this.thumbnail.file)
      let PICTURE_URL = await getDownloadURL(PICTURE_REF)
      await setDoc(doc(db, 'profils', this.$route.params.user), {
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
        await this.hydrateProfil()
        this.isBusy = false
        this.openAbout = false
        this.$message.success('Profil mis ?? jour avec succ??s')
      } catch (error) {
        console.log(error)
      }
    },

    async submitAvatar(fileName) {
      if (this.profil.avatar) {
        await deleteImage('avatars', this.profil.avatar.name)
      }

      const PICTURE_REF = storageRef(storage, 'avatars/' + fileName)
      await uploadBytesResumable(PICTURE_REF, this.avatar.file)
      await getDownloadURL(PICTURE_REF)
        .then((url) => {
          var user = auth.currentUser
          updateProfileUser(this.user.displayName, url)

          setDoc(doc(db, 'profils', this.$route.params.user), {
            ...this.profil,
            avatar: {
              name: fileName,
              url: url,
            },
          })

          updateDoc(doc(db, 'users', this.$route.params.user), {
            photoUrl: url,
          })
        })
        .catch((error) => console.log(error))
    },

    async handleFileCouverture($event) {
      this.isBusy = true
      await this.changeFile($event.target.files[0], 'thumbnail')
      this.isBusy = false
    },

    async handleFileAvatar($event) {
      this.isBusy = true
      await this.changeFile($event.target.files[0], 'avatar')
      this.isBusy = false
    },

    async onSubmit(section) {
      let fileName =
        this.user.localId + Math.floor(Math.random() * (80000 - 1000) + 1000)
      this.isBusy = true
      try {
        if (section === 'thumbnail') {
          await this.submitThumbnail(fileName)
        } else if (section === 'avatar') {
          await this.submitAvatar(fileName)
        }
        await this.hydrateProfil()

        this.isBusy = false
        this.$message.success('Profil mis ?? jour avec succ??s')
      } catch (error) {
        this.$message.error(error)
        this.isBusy = false
      }
    },
  },
}
</script>

<style lang="scss" scoped="scoped">
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
          border: 5px solid white;
        }
      }
    }
  }

  &--about {
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
