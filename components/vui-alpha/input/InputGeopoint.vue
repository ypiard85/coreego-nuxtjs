<template>
  <div>
    <el-row type="flex">
      <el-col :md="12">
        <el-form-item :prop="prop[0]">
          <span class="el-form-item__label">* Latitude</span>
          <el-input
            placeholder="33.450701"
            label="latitude"
            :value="latitude"
            @input="$emit('change-latitude', $event)"
            @blur="loadValidGeopoint"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item :prop="prop[1]">
          <span class="el-form-item__label">* Longitude</span>
          <el-input
            placeholder="126.570667"
            :value="longitude"
            @input="$emit('change-longitude', $event)"
            @blur="loadValidGeopoint"
          >
            <el-button
              class="bg-info"
              slot="append"
              icon="el-icon-map-location text-white"
              v-if="visibleKakaoMapBtn"
              @click="$emit('open-kakao-map', true)"
            ></el-button>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <slot name="error" v-if="errorLocalisation" />
  </div>
</template>
<script>
  import Axios from 'axios'
export default {
  name: "inputGeopoint",
  props: {
    longitude: {
      required: true,
    },
    latitude: {
      required: true,
    },
    errorLocalisation:{
      type: Boolean,
      required: false,
      default: false
    },
    isEditMode: {
      type: Boolean,
      required: true,
    },
    prop: {
      required: true,
    },
  },

  data(){
    return{
      visibleKakaoMapBtn: false
    }
  },

  methods: {
   async loadValidGeopoint() {
      this.$emit("error-localisation", false);
      if (this.latitude != "" && this.longitude != "") {
        try {
          await Axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.latitude}&lon=${this.longitude}&zoom=18&addressdetails=1`
          ).then((res) => {
            console.log(res)
            if (
              res &&
              res.data &&
              res.data.address &&
              res.data.address.country_code === "kr"
            ) {
              this.visibleKakaoMapBtn = true
            } else {
              this.visibleKakaoMapBtn = false
              this.$emit("error-localisation", true);
            }
          });
        } catch (error) {
          this.visibleKakaoMapBtn = false
          this.$emit("error-localisation", true);
        }
      }

    },
  },
};
</script>
<style lang="scss"></style>
