<template>
  <div>
    <div :id="id"></div>
    <template v-if="widthOptions">
      <MapUiOptions
      @change-type="$emit('change-type', $event)"
      @change-mode="$emit('change-mode', $event)"
      :mapType="mapType"
      :mapMode="mapMode"
    />
    <el-button
    style="z-index: 1000"
    type="danger"
    size="mini"
    class="btn__close position-fixed top-0 start-0 m-2"
    @click="$emit('close-map')"
    >FERMER</el-button
    >
    </template>
    <template v-if="isMultiMarker">
      <el-button
      style="z-index: 1000"
      type="success"
      size="mini"
      class="btn__close position-fixed top-0 start-0 m-2"
      @click="backPage"
      icon="el-icon-arrow-left"
      >Revenir en arrière</el-button
      >
    </template>

  </div>
</template>

<script>
import { initMapOption, initMultiMarker } from "./mapUtils";
import MapUiOptions from "./map-ui/MapUiOptions";
import {
  TYPE_ROADMAP,
  TYPE_HYBRID,
  MODE_MAP_VIEW,
  MODE_STREET_VIEW,
} from "~/utils/variables.js";

export default {
  components: { MapUiOptions },
  props: {
    widthOptions: {
      type: Boolean,
      required: true,
      default: true,
    },
    id: {
      type: String,
      required: true,
    },
    lat: {
      required: false,
    },
    long: {
      required: false,
    },
    mapType: {
      type: Number,
      required: false,
      default: 0,
    },
    mapMode: {
      type: Number,
      required: false,
      default: 2,
    },
    isMultiMarker:{
      type: Boolean,
      required: false,
      default: false
    },
    places:{
      type: Array,
      required: false,
      default: null
    }
  },

  data() {
    return {};
  },

  mounted() {
    this.loadMap();
  },

  methods: {
    async loadMap() {
      if(!this.isMultiMarker){
        initMapOption(this.id, this.mapMode, this.mapType, this.lat, this.long);
      }else{
        if(Array.isArray(this.places) && this.places.at(0)){
          initMultiMarker(this.id, this.places)
        }
      }
    },

    backPage(){
      this.$router.back()
    }

  },
};
</script>

<style scoped>
#mapmarker {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1000 !important;
  top: 0;
  left: 0;
  bottom: 0;
}
</style>
