<template>
  <div>
    <HeaderPage :isEditMode="isEditMode" />
    <b-container class="mt-2" v-if="placeLoaded" v-loading="busy">
      <el-form
        ref="ruleForm"
        label-position="top"
        :rules="rules"
        :model="form"
        status-icon
      >
        <!--  -->
        <el-form-item>
          <label class="el-form-item__label" for="pointages">
            <b-icon icon="pin-fill" />
            Ajouter depuis mes pointages
          </label>
          <pointage-input
            class="w-100"
            :options="[{ id: 1, title: 'premier titre' }]"
            v-model="pointageValue"
            @input="pointageValue = $event"
          />
        </el-form-item>
        <!--  -->
        <el-form-item prop="title">
          <label class="el-form-item__label" for="title">
            <b-icon icon="text-left" />
            Titre
          </label>
          <title-input @input="form.title = $event" v-model="form.title" />
        </el-form-item>

        <el-form-item prop="localisation">
          <label class="el-form-item__label" for="localisation">
            <b-icon icon="pin-map-fill" />
            Adresse / Recherche / Coordonnées GPS
          </label>
          <localisation-input
            prop="localisation"
            :isEditMode="isEditMode"
            :localisation="form.localisation"
            @update-localisation="form.localisation = $event"
          />
        </el-form-item>

        <el-form-item v-if="cities" prop="city">
          <label class="el-form-item__label" for="provinces">
            <b-icon icon="image-alt" />
            Provinces
          </label>
          <city-input
            id="provinces"
            class="w-100"
            :options="cities"
            v-model="form.city"
            @input="form.city = $event"
          />
        </el-form-item>

        <el-form-item v-if="categories" prop="category">
          <label class="el-form-item__label" for="categories">
            <b-icon icon="folder" />
            Categories
          </label>
          <category-input
            class="w-100"
            :options="categories"
            v-model="form.category"
            @input="form.category = $event"
          />
        </el-form-item>

        <el-form-item prop="images">
          <label class="el-form-item__label" for="images">
            <b-icon icon="image" />
            Images
          </label>
          <files-input
            :required="false"
            :images="form.images"
            accept=".jpg, .png, .jpeg"
            @change="onPreviewFiles($event)"
            :previews="previews"
            :trashImage="trashImage"
            @delete-file-preview="deleteFilePreview($event)"
            @delete-current-file="deleteCurrentFile($event)"
            @restore-images="restoreImages"
          />
        </el-form-item>

        <el-form-item prop="description">
          <label class="el-form-item__label" for="description">
            <b-icon icon="text-left" />
            Description
          </label>
          <description-input
            @input="form.description = $event"
            v-model="form.description"
          />
        </el-form-item>

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
      </el-form>
    </b-container>
  </div>
</template>
<script>
//Créer un controler pour kakaoMap -> ne plus passer par des fichiers différents

import VuiInput from '~/components/vui-alpha/input/VuiInput'
import KakaoMap from '~/components/map/KakaoMap'
import { mapGetters } from 'vuex'
import HeaderPage from '@/pages/components/HeaderPage'
import { GeoPoint } from 'firebase/firestore'
import InputGeopoint from '@/components/vui-alpha/input/InputGeopoint'
import * as imageConversion from 'image-conversion'
import TitleInput from './input/TitleInput.vue'
import PointageInput from './input/PointageInput.vue'
import LocalisationInput from './input/LocalisationInput.vue'
import CategoryInput from './input/CategoryInput.vue'
import CityInput from './input/CityInput.vue'
import FilesInput from './input/FilesInput.vue'
import DescriptionInput from './input/DescriptionInput.vue'

export default {
  name: 'place-form',
  components: {
    VuiInput,
    KakaoMap,
    InputGeopoint,
    HeaderPage,
    TitleInput,
    PointageInput,
    LocalisationInput,
    CityInput,
    CategoryInput,
    FilesInput,
    DescriptionInput
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
    let validatorLocalisation = (rule, value, callback) => {
      if (
        this.form.localisation.value.length &&
        this.form.localisation.latitude.length &&
        this.form.localisation.longitude.length
      ) {
        callback()
      } else {
        callback(new Error('Veuillez selectionnez une adresse'))
      }
    }

    let validationImages = (rule, value, callback) => {
      if (this.form.images.length) {
        callback()
      } else {
        callback(new Error('Veuillez ajouter 1 image au minimum'))
      }
    }

    let validationTexte = (rule, value, callback) => {
      if(value.trim().length){
         callback()
      } else {
        callback(new Error('Ce champ ne doit pas être vide'))
      }
    }

    return {
      busy: false,
      errorLocalisation: false,

      pointageOptions: [],
      pointageValue: null,
      previews: [],
      trashImage: [],

      form: {
        title: '',
        localisation: {},
        city: null,
        category: null,
        images: [],
        thumbnail: null,
        thumbnailUrl: null,
        description: '',
      },
      openKakaoMap: false,

      rules: {
        localisation: {
          required: true,
          validator: validatorLocalisation,
          trigger: ['blur', 'change'],
        },
        title: [
         {required: true, validator: validationTexte, trigger: ['blur', 'change']},
          { max: 50, message: 'Ce champ doit pas dépasser 50 caractères' },
        ],
        images: { required: true, validator: validationImages },
        description: {required: true, validator: validationTexte, trigger: ['blur', 'change']},
        city: {required: true, message: 'Ce champ ne doit pas être vide' },
        category: {required: true, message: 'Ce champ ne doit pas être vide' }
      },
    }
  },

  computed: {
    ...mapGetters('app', {
      cities: 'getCities',
      categories: 'getCategories',
    }),

    imageValidation() {
      return (
        this.previews.length > 0 ||
        (this.form.images && this.form.images.length > 0)
      )
    },

    user() {
      return this.$fire.auth.currentUser ? this.$fire.auth.currentUser : null
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
        localisation: {},
        city: null,
        category: null,
        images: [],
        thumbnail: null,
        description: '',
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
        formData.localisation = {
          value: '',
          latitude: '',
          longitude: '',
          displayRoadView: false,
        }
        formData.city = this.cities && this.cities[0].id
        formData.category = this.categories && this.categories[0].id
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
  },
}
</script>

<style lang="scss" scoped>
// ::v-deep .form-place {
//   width: 700px;
//   max-width: 100%;
//   margin: auto;
//   .el-input__inner,
//   .el-textarea__inner {
//     font-weight: bold;
//     color: black;
//   }

//   label {
//     font-weight: bold;
//     font-size: 14px;
//   }

//   .el-form-item {
//     &.is-error {
//       .el-input__validateIcon {
//         font-size: 22px;
//         color: #f56c6c;
//       }
//     }
//     &--feedback {
//       .el-input__validateIcon {
//         font-size: 22px;
//         color: green;
//       }
//     }
//   }

// @media (max-width: 768px) {
//   .el-form-item {
//     display: flex;
//     flex-direction: column;

//     .el-form-item__content {
//       margin-left: 0px !important;
//     }
//   }
// }
// }
</style>
