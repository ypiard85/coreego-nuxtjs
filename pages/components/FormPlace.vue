<template>
  <div>
    <HeaderPage :isEditMode="isEditMode" />
    <b-container class="mt-5" v-if="placeLoaded" v-loading="busy">
      <el-form
        @submit.native.prevent
        :status-icon="true"
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="form-place"
        label-position="left"
      >
        <!-- Remplacer les icon par bootstrap-vue-icons -->
        <el-form-item label="Titre" prop="title" class="mb-5">
          <el-input placeholder="Titre du lieu" v-model="form.title"></el-input>
        </el-form-item>

        <input-geopoint
          class="mb-5"
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
            <small class="text-danger px-3">
              <b-icon icon="exclamation-triangle-fill" variant="warning" font-scale="2"></b-icon>
              Veuillez renseigner une localisation en Corée Du Sud
            </small>
          </template>
        </input-geopoint>

        <el-row :gutter="20" class="mb-5">
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Provinces">
              <el-select
                filterable
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

          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Categories">
              <el-select
                placeholder="Categorie"
                 filterable
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

        <el-form-item label="Images" class="mb-5">
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

    let latitudePass = (rule, value, callback) => {
      const regex = /^[0-9.]+$/
      if(!regex.test(value)){
        callback(new Error('Des nombres sont demandés'))
      }else if(value === ''){
        callback(new Error('Le champ ne dois pas être vide'))
      }else{
        callback()
      }
    }

    let longitudePass = (rule, value, callback) => {
      const regex = /^[0-9.]+$/
      if(!regex.test(value)){
        callback(new Error('Des nombres sont demandés'))
      }else if(value === ''){
        callback(new Error('Le champ ne dois pas être vide'))
      }else{
        callback()
      }
    }

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
          { required: true, validator: latitudePass , trigger: 'blur' },
        ],

        longitude: [
          { required: true, validator: longitudePass, trigger: 'blur' },
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
          .msgBoxConfirm('Voulez vous supprimer cette image ? ', {
            title: 'Confirmation',
            size: 'sm',
            buttonSize: 'sm',
            okTitle: 'Supprimer',
            okVariant: 'success',
            cancelVariant: 'danger',
            cancelTitle: 'Annuler',
          })
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

<style lang="scss" scoped>
::v-deep .form-place {
  width: 700px;
  max-width: 100%;
  margin: auto;
  .el-input__inner,
  .el-textarea__inner {
    font-weight: bold;
    color: black;
  }

  label {
    font-weight: bold;
    font-size: 14px;
  }

  .el-form-item{
    &.is-error{
      .el-input__validateIcon{
        font-size: 22px;
        color: #F56C6C;
      }
    }
    &--feedback{
      .el-input__validateIcon{
        font-size: 22px;
        color: green;
      }
    }
  }

  @media (max-width: 768px) {
    .el-form-item {
      display: flex;
      flex-direction: column;

      .el-form-item__content {
        margin-left: 0px !important;
      }
    }
  }
}
</style>
