<template>
  <div>
    <el-button
      size="small"
      :loading="isBusyBtn"
      type="primary"
      @click="onCurrentLocalisation"
    >
      <b-icon icon="compass" />
      Ma localisation
    </el-button>
    <el-button
      :loading="isBusyBtn"
      type="success"
      size="small"
      :disabled="!displayButtonMap"
      @click="openKakaomap = true"
      ><b-icon icon="map" />
      Voir la map
    </el-button>

    <!--  -->
    <template v-if="openKakaomap">
      <el-dialog
        :visible="openKakaomap"
        :fullscreen="true"
        :append-to-body="true"
      >
        <kakao-map
          :place="{
            geopoint: {
              _lat: localisation.latitude,
              _long: localisation.longitude,
            },
          }"
          :displayRoadView="localisation.displayRoadView"
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
import KakaoMap from '../../map/KakaoMap.vue'
import Axios from 'axios'
export default {
  name: 'localisation-buttons',
  components: { KakaoMap },
  props: {
    localisation: {
      type: Object,
      require: false,
      default: () => {},
    },
    isBusyBtn: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      displayKakaoMapButton: false,
      openKakaomap: false,
    }
  },
  computed: {
    displayButtonMap() {
      let display = false
      if(this.localisation.longitude && this.localisation.latitude && this.localisation.value){
        display = [this.localisation.longitude, this.localisation.latitude, this.localisation.value].every(data => data.length)
      }
      return display
    },
  },
  methods: {
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
        .catch((error) => this.$emit('error-localisationSearch', error))
    },

    async verifLocalisation(address) {
      await Axios.get(
        `https://nominatim.openstreetmap.org/search?q=${address}&accept-language=fr&countrycodes=KR&format=json&addressdetails=1`
      )
        .then((response) => {
          if ('data' in response && response.data && response.data.length) {
            const result = response.data[0]
            this.$emit('load-lcoalisation', result.display_name)
            //emit longitude latitude
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

    showError(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          console.log("L'utilisateur a refusé la demande de géolocalisation.")
          break
        case error.POSITION_UNAVAILABLE:
          console.log(
            'Les informations de localisationSearch ne sont pas disponibles.'
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

<style scoped lang="scss"></style>
