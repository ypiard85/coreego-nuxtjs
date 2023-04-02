<template>
  <div>
    <label class="el-form-item__label">Localisation</label>
    <div>
        <el-button
          title="géolocalisation"
          :loading="isBusy"
          type="primary"
          @click="onCurrentLocalisation"
          icon="el-icon-discover"
        />
        <el-button
          type="success"
          disabled
          icon="el-icon-map-location text-white"
          v-if="!visibleKakaoMapBtn"
          @click="$emit('open-kakao-map', true)"
        ></el-button>
    </div>

    <!-- <el-col :xs="24" :sm="10" :md="10">
        <el-form-item :prop="prop[0]">
          <el-input placeholder="33.450701" label="latitude" :value="latitude" @input="$emit('change-latitude', $event)"
            @blur="loadValidGeopoint">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="10" :md="10">
        <el-form-item :prop="prop[1]">
          <label class="el-form-item__label">* Longitude</label>
          <el-input placeholder="126.570667" :value="longitude" @input="$emit('change-longitude', $event)"
          @blur="loadValidGeopoint">
          <el-button class="bg-info" slot="append" icon="el-icon-map-location text-white" v-if="visibleKakaoMapBtn"
          @click="$emit('open-kakao-map', true)"></el-button>
        </el-input>
      </el-form-item>
    </el-col> -->
    <!-- <el-form-item :prop="prop[0]">
          <el-input placeholder="33.450701" label="latitude" :value="latitude" @input="$emit('change-latitude', $event)"
            @blur="loadValidGeopoint">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="10" :md="10">
        <el-form-item :prop="prop[1]">
          <label class="el-form-item__label">* Longitude</label>
          <el-input placeholder="126.570667" :value="longitude" @input="$emit('change-longitude', $event)"
          @blur="loadValidGeopoint">
          <el-button class="bg-info" slot="append" icon="el-icon-map-location text-white" v-if="visibleKakaoMapBtn"
          @click="$emit('open-kakao-map', true)"></el-button>
        </el-input>
      </el-form-item> -->
    <!-- <div>
    <slot name="error" v-if="errorLocalisation" />
  </div> -->
  </div>
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
      isBusy: false,
    }
  },

  methods: {
    async loadValidGeopoint(activeAuto = false) {
      this.$emit('error-localisation', false)
      if ((this.latitude != '' && this.longitude != '') || activeAuto) {
        try {
          this.isBusy = true
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
          this.isBusy = false
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
              alert('Geolocation has been disabled on this page')
            } else {
              alert('Unable to find your position, try again later.')
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
