<template>
  <el-row :gutter="20">
    <div class="px-3 mb-3">
      <label class="el-form-item__label d-block w-100 mb-3 border-bottom"
        >Localisation</label
      >
      <div>
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
          :disabled="!visibleKakaoMapBtn"
          @click="$emit('open-kakao-map', true)"
          ><b-icon icon="map" />
          Voir la map
        </el-button>
      </div>
    </div>
    <el-col :xs="24" :sm="12" :md="12">
      <el-form-item :prop="prop[0]" label="Latitude">
        <el-input
          placeholder="33.450701"
          label="latitude"
          :value="latitude"
          @input="$emit('change-latitude', $event)"
          @blur="loadValidGeopoint"
        />
      </el-form-item>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12">
      <el-form-item :prop="prop[1]" label="Longitude">
        <el-input
          placeholder="126.570667"
          :value="longitude"
          @input="$emit('change-longitude', $event)"
          @blur="loadValidGeopoint"
        />
      </el-form-item>
    </el-col>
    <slot name="error" v-if="errorLocalisation" />
  </el-row>
</template>

<script>
import Axios from 'axios'
export default {
  name: 'inputGeopoint',
  props: {
    longitude: {
      required: true,
    },
    latitude: {
      required: true,
    },
    errorLocalisation: {
      type: Boolean,
      required: false,
      default: false,
    },
    isEditMode: {
      type: Boolean,
      required: true,
    },
    prop: {
      required: true,
    },
  },

  data() {
    return {
      visibleKakaoMapBtn: false,
      isBusyMap: false,
      isBusyLocalisation: false
    }
  },

  methods: {
    async loadValidGeopoint(activeAuto  = false) {
      this.$emit('error-localisation', false)
      const regex = /^[0-9.]+$/
      if (
        (this.latitude !== '' &&
          this.longitude !== '' &&
          regex.test(this.latitude) &&
          regex.test(this.longitude)) || activeAuto
      ) {
        try {
          this.isBusyMap = true
          await Axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.latitude}&lon=${this.longitude}&zoom=18&addressdetails=1`
          ).then((res) => {
            console.log(res)
            if (
              res &&
              res.data &&
              res.data.address &&
              res.data.address.country_code === 'kr'
            ) {
              this.visibleKakaoMapBtn = true
            } else {
              this.visibleKakaoMapBtn = false
              this.$emit('error-localisation', true)
            }
          })
        } catch (error) {
          this.visibleKakaoMapBtn = false
          this.$emit('error-localisation', true)
        } finally {
          this.isBusyMap = false
        }
      }
    },

    async onCurrentLocalisation() {
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            let currentPosition = position.coords

            this.$emit('change-latitude', currentPosition.latitude)
            this.$emit('change-longitude', currentPosition.longitude)
          },
          (error) => {
            // check if the user denied geolocation, or if there was any other problem
            if (error.code == error.PERMISSION_DENIED) {
              alert('La géolocalisation a été désactivée sur cette page')
            } else {
              alert('Impossible de trouver votre position, réessayez plus tard.')
            }
          },
          {
            timeout: 10000,
          }
        )

        setTimeout(() => {
          this.loadValidGeopoint(true)
        }, 10)
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>
<style lang="scss"></style>
