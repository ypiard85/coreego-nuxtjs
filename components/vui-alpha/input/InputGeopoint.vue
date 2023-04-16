<template>
  <div>
    <el-form-item>
      <label class="el-form-item__label" for="localisation">
        <b-icon icon="pin-map-fill" />
        Adresse / Recherche / Coordonnées GPS
      </label>
      <div class="mb-3">
        <el-button
          size="small"
          :loading="isBusyMap"
          type="primary"
          @click="onCurrentLocalisation"
        >
          <b-icon icon="compass" />
          Ma localisation
        </el-button>
        <el-button
          :loading="isBusyMap"
          type="success"
          size="small"
          :disabled="!displayKakaoMapButton"
          @click="openKakaomap = true"
          ><b-icon icon="map" />
          Voir la map
        </el-button>
      </div>
      <el-autocomplete
        id="localisation"
        ref="localisation-input"
        class="w-100"
        v-model="localisation"
        :fetch-suggestions="querySearchAsync"
        placeholder="Thurday party hongdae"
        @input="handleResetLocalisation"
        @select="handleSelectLocalisation"
      >
      </el-autocomplete>
    </el-form-item>
    <template v-if="openKakaomap">
      <el-dialog
        :visible="openKakaomap"
        :fullscreen="true"
        :append-to-body="true"
      >
        <kakao-map
          :place="{
            geopoint: {
              _lat: this.formObject.latitude,
              _long: this.formObject.longitude,
            },
          }"
          :showCloseBtn="true"
          :showRedirectBtn="false"
          :showTypeOptions="true"
          :showModeOptions="true"
          @close="openKakaomap = false"
        />
      </el-dialog>
    </template>
  </div>
</template>

<script>
import Axios from 'axios'
import { mapGetters } from 'vuex'
import KakaoMap from '../../map/KakaoMap.vue'
export default {
  name: 'inputGeopoint',
  components: { KakaoMap },
  props: {
    formObject: {
      type: Object,
      required: false,
      default: null,
    },
    isEditMode: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      isBusyMap: false,
      isBusyLocalisation: false,

      openKakaomap: false,
      localisation: '',
      timeout: null,
    }
  },

  computed: {
    ...mapGetters('app', { cities: 'getCities' }),

    displayKakaoMapButton() {
      return (
        this.localisation.length &&
        this.formObject.latitude &&
        this.formObject.latitude.length &&
        this.formObject.longitude &&
        this.formObject.longitude.length
      )
    },
  },

  methods: {
    async querySearchAsync(queryString, cb) {
      this.isBusyMap = true
      try {
        const request = await Axios.get(
          `https://nominatim.openstreetmap.org/search?q=${queryString}&accept-language=fr&countrycodes=KR&format=json&addressdetails=1`
        )
        if ('data' in request && request.data) {
          console.log(request.data)
          let result = request.data.map((data) => {
            return {
              value: data.display_name,
              longitude: data.lon,
              latitude: data.lat,
              city: data.address.city,
            }
          })
          setTimeout(() => {
            cb(result)
          }, 1000)
          clearTimeout(this.timeout)
        }
      } catch (error) {
        console.log(error)
      }
      this.isBusyMap = false
    },

    handleResetLocalisation() {
      this.$emit('update-address', null)
      this.$emit('update-latitude', null)
      this.$emit('update-longitude', null)
    },

    handleSelectLocalisation(item) {
      this.$emit('update-address', item.value)
      this.$emit('update-latitude', item.latitude)
      this.$emit('update-longitude', item.longitude)
      let cityFind = item && this.cities.find(
        (city) => city.label.toLowerCase() === item.city.toLowerCase()
      )

      if (cityFind) {
        this.$emit('update-city', cityFind.id)
      }
    },

    async verifLocalisation(address) {
      await Axios.get(
        `https://nominatim.openstreetmap.org/search?q=${address}&accept-language=fr&countrycodes=KR&format=json&addressdetails=1`
      )
        .then((response) => {
          if ('data' in response && response.data && response.data.length) {
            const result = response.data[0]
            this.localisation = result.display_name
            //emit longitude latitude
            if (this.$refs['localisation-input']) {
              this.$refs['localisation-input'].focus()
            }
          } else {
            throw new Error(
              'Seules les localisations basées en Corée du Sud sont acceptés.'
            )
          }
        })
        .catch((error) => {
          console.log(error)
          this.$message.error(error.message)
        })
    },

    async showPosition(position) {
      var lat = position.coords.latitude
      var lng = position.coords.longitude

      await Axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
      )
        .then((response) => {
          if (response && 'data' in response && response.data) {
            this.verifLocalisation(response.data.display_name)
          }
        })
        .catch((error) => this.$emit('error-localisation', error))
    },

    showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("L'utilisateur a refusé la demande de géolocalisation.")
          break
        case error.POSITION_UNAVAILABLE:
          console.log(
            'Les informations de localisation ne sont pas disponibles.'
          )
          break
        case error.TIMEOUT:
          console.log('La demande de géolocalisation a expiré.')
          break
        case error.UNKNOWN_ERROR:
          console.log("Une erreur inconnue s'est produite.")
          break
      }
    },

    onCurrentLocalisation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.showPosition,
          this.showError,
          {
            enableHighAccuracy: true,
          }
        )
      } else {
        console.log(
          "La géolocalisation n'est pas prise en charge par ce navigateur."
        )
      }
    },
  },
}
</script>
<style lang="scss"></style>
