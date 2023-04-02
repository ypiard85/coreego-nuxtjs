<template>
  <div>
    <HeaderPage :isEditMode="isEditMode" />
    <b-container class="mt-3" v-if="placeLoaded" v-loading="busy">
      <el-form
        @submit.native.prevent
        :status-icon="true"
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="place-add_form"
        label-position="top"
      >
      <!-- Remplacer les icon par bootstrap-vue-icons -->
        <el-form-item label="Titre" prop="title">
          <el-input placeholder="Titre du lieu" v-model="form.title"></el-input>
        </el-form-item>
        <input-geopoint
          ref="inputGeopoint"
          :latitude="form.latitude"
          :longitude="form.longitude"
          :errorLocalisation="errorLocalisation"
          :isEditMode="isEditMode"
          :prop="['latitude', 'longitude']"
          @error-localisation="errorLocalisation = $event"
          @change-latitude="form.latitude = $event"
          @change-longitude="form.longitude = $event"
          @open-kakao-map="openKakaoMap = true"
        >
          <template #error>
            <small
              style="margin-top: -10px; font-size: 12px; display: block"
              class="text-danger"
              >Les coordonnées géographiques sont hors Corée Du Sud</small
            >
          </template>
        </input-geopoint>

        <el-row type="flex" class="justify-content-between flex-wrap">
          <el-col :xs="24" :sm="10" :md="10">
            <el-form-item label="Ville">
              <el-select
                placeholder="Ville"
                remote
                v-model="form.city"
                style="width: 100%"
              >
                <el-option
                  v-for="citiesOption in citiesOptions"
                  :key="citiesOption.id"
                  :value="citiesOption.id"
                  :label="citiesOption.label"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="10" :md="10">
            <el-form-item label="Categorie">
              <el-select
                placeholder="Categorie"
                remote
                v-model="form.category"
                style="width: 100%"
              >
                <el-option
                  v-for="categoriesOption in categoriesOptions"
                  :key="categoriesOption.id"
                  :value="categoriesOption.id"
                  :label="categoriesOption.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="Images">
          <vui-files-input
            :required="false"
            :images="form.images"
            id="input-files"
            accept=".jpg, .png, .jpeg"
            @change="onPreviewFiles($event)"
            :previews="previews"
            :multiple="true"
            :trashImage="trashImage"
            @delete-file-preview="deleteFilePreview($event)"
            @delete-current-file="deleteCurrentFile($event)"
            @restore-images="restoreImages"
          />
          <small v-if="!imageValidation" class="text-danger"
            >Veuillez ajouter au moins une image</small
          >
        </el-form-item>

        <el-form-item label="Description" prop="description">
          <el-input
            placeholder="Petite description"
            :rows="10"
            type="textarea"
            v-model="form.description"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="success"
            @click="submitForm('ruleForm')"
            v-if="!isEditMode"
            icon="el-icon-check fw-bold"
          >
            Je crée ce lieu
          </el-button>
          <el-button
            type="success"
            @click="submitForm('ruleForm')"
            v-else
            icon="el-icon-check fw-bold"
          >
            Je modifie ce lieu
          </el-button>
        </el-form-item>
      </el-form>
      <el-dialog
        :visible="openKakaoMap"
        :fullscreen="true"
        :append-to-body="true"
      >
        <kakao-map
          :place="{
            geopoint: {
              _lat: this.form.latitude,
              _long: this.form.longitude,
            },
          }"
          :showCloseBtn="true"
          :showRedirectBtn="false"
          :showTypeOptions="true"
          :showModeOptions="true"
          @close-map="openKakaoMap = false"
        />
      </el-dialog>
    </b-container>
  </div>
</template>
<script>
//Créer un controler pour kakaoMap -> ne plus passer par des fichiers différents

import VuiInput from '~/components/vui-alpha/input/VuiInput'
import VuiOptionsInput from '~/components/vui-alpha/input/VuiOptionsInput'
import VuiFilesInput from '~/components/vui-alpha/input/VuiFilesInput'
import KakaoMap from '~/components/map/KakaoMap'
import { mapGetters } from 'vuex'
import HeaderPage from './HeaderPage'
import { GeoPoint } from 'firebase/firestore'
import InputGeopoint from '@/components/vui-alpha/input/InputGeopoint'
import * as imageConversion from 'image-conversion'

export default {
  name: 'place-form',
  components: {
    VuiInput,
    VuiOptionsInput,
    VuiFilesInput,
    KakaoMap,
    InputGeopoint,
    HeaderPage,
  },

  props: {
    isEditMode: {
      type: Boolean,
      required: true,
    },
    place: {
      required: false,
    },
    placeLoaded: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data() {
    return {
      busy: false,
      errorLocalisation: false,
      previews: [],

      trashImage: [],

      form: {
        title: null,
        latitude: null,
        longitude: null,
        city: null,
        category: null,
        images: [],
        thumbnail: null,
        thumbnailUrl: null,
        description: null,
      },

      rules: {
        title: {
          required: true,
          message: 'Le champ ne dois pas être vide',
          trigger: 'blur',
        },

        latitude: [
          { required: true, message: 'Le champ ne dois pas être vide' },
        ],

        longitude: [
          { required: true, message: 'Le champ ne dois pas être vide' },
        ],

        description: {
          required: true,
          message: 'Le champ ne dois pas être vide',
          trigger: 'blur',
        },
      },
      openKakaoMap: false,
    }
  },

  computed: {
    ...mapGetters('app', {
      cities: 'getCities',
      categories: 'getCategories',
      places: 'getPlaces',
    }),

    mapOption() {
      return {
        ...this.mapOptions,
        lat: this.form.latitude,
        long: this.form.longitude,
      }
    },

    imageValidation() {
      return (
        this.previews.length > 0 ||
        (this.form.images && this.form.images.length > 0)
      )
    },

    user() {
      return this.$fire.auth.currentUser ? this.$fire.auth.currentUser : null
    },

    citiesOptions() {
      return [...this.cities]
    },
    categoriesOptions() {
      return [...this.categories]
    },
  },

  async created() {
    await this.hydrateForm()

    if (this.isEditMode && this.$refs['inputGeopoint']) {
      this.$refs.inputGeopoint.loadValidGeopoint()
    }
  },

  methods: {
    onPreviewFiles($event) {
      for (let file of $event.target.files) {
        imageConversion
          .compressAccurately(file, 200)
          .then((res) => {
            this.previews.push({ file: res, url: URL.createObjectURL(res) })
          })
          .catch((error) => console.log(error))
      }
    },

    deleteFilePreview(image) {
      this.previews = this.previews.filter((preview, i) => i !== image)
    },

    deleteCurrentFile($event) {
      try {
        this.$bvModal
          .msgBoxConfirm('Voulez vous supprimer cette image ? ')
          .then((val) => {
            if (val) {
              this.trashImage.push($event)
              this.form.images = this.form.images.filter(
                (image) => image.name !== $event.name
              )
            }
          })
      } catch (error) {
        console.log(error)
      }
    },

    restoreImages() {
      this.form.images = this.form.images.concat(this.trashImage)
      this.trashImage = []
    },

    async hydrateForm() {
      let formData = {
        title: null,
        latitude: null,
        longitude: null,
        city: null,
        category: null,
        images: [],
        thumbnail: null,
        description: null,
      }

      if (this.isEditMode && this.place) {
        formData.title = this.place.title
        formData.latitude = this.place.geopoint._lat.toString()
        formData.longitude = this.place.geopoint._long.toString()
        formData.city = this.place.city
        formData.category = this.place.category
        formData.description = this.place.description
        formData.thumbnail = this.place.thumbnail
        formData.images = this.place.images
      } else {
        formData.title = ''
        formData.latitude = ''
        formData.longitude = ''
        formData.city = this.cities[0].id
        formData.category = this.categories[0].id
      }

      //On applique les datas formatés à l'objet form
      for (const formKey of Object.keys(formData)) {
        this.form[formKey] = formData[formKey]
      }
    },

    async submitForm(formName) {
      this.busy = true

      const lieuDocument = this.$fire.firestore.collection('lieux')

      this.$refs[formName].validate(async (valid) => {
        if (!valid || !this.imageValidation || this.errorLocalisation) {
          this.$message.error('Veuillez vérifier votre formulaire')
          this.busy = false
        } else {
          try {
            let images = []
            if (this.previews.length > 0) {
              for (let preview of this.previews) {
                let fileName =
                  this.user.uid +
                  Math.floor(Math.random() * (80000 - 1000) + 1000)
                //upload images
                const FILE_PATH = this.$fire.storage.ref('lieux/' + fileName)
                await FILE_PATH.put(preview.file)
                const IMGAGE_URL = await FILE_PATH.getDownloadURL()

                images.push({
                  name: fileName,
                  url: IMGAGE_URL,
                })
              }
            }

            if (!this.isEditMode) {
              let formData = this.formData()
              formData.images = images
              formData.thumbnail = images[0]

              await lieuDocument.add(formData)

              this.$message.success('Lieu ajouté')
              this.$router.push('/')
            } else {
              if (this.trashImage && this.trashImage.length > 0) {
                for (let trashImage of this.trashImage) {
                  const IMG_PATH = this.$fire.storage.ref(
                    'lieux/' + trashImage.name
                  )
                  await IMG_PATH.delete()
                }
              }

              let formData = this.formData()

              formData.images = this.form.images.concat(images)
              formData.images
              let findThumbnail = formData.images.find(
                (image) => image.name === this.place.thumbnail.name
              )

              if (!findThumbnail) {
                formData.thumbnail = formData.images[0]
              } else {
                formData.thumbnail = this.place.thumbnail
              }

              const documentSnapShot = lieuDocument.doc(this.$route.params.id)
              await documentSnapShot.set(formData)
              this.$message.success('Lieu modifié')

              this.$router.replace('/places/view/' + this.$route.params.id)
            }
          } catch (error) {
            this.$message.error(error)
            console.log(error)
          } finally {
            this.busy = false
          }
        }
      })
    },

    formData() {
      return {
        title: this.form.title,
        description: this.form.description,
        city: this.form.city,
        category: this.form.category,
        geopoint: new GeoPoint(this.form.latitude, this.form.longitude),
        premium: false,
        statut: false,
        user: this.user.uid,
        created_at: new Date(),
        updated_at: new Date(),
      }
    },

    reloadMap() {
      this.mapOptions.openMap = false
      this.$nextTick(() => {
        this.mapOptions.openMap = true
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
