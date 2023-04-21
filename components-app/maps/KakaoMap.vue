<template>
  <div class="map-container">
    <div id="map"></div>

    <KakaoMarker
      v-for="(topic, index) in topics"
      :key="index"
      :map="map"
      :topic="topic"
      @view-topic="$emit('view-topic', $event)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  VIEW_ALL_TOPICS,
  VIEW_SINGLE_TOPIC,
  ADD_NEW_TOPIC,
} from '@/utils/variables.js'
import KakaoMarker from './KakaoMarker.vue'

export default {
  name: 'kakao-map',
  components: { KakaoMarker },
  data() {
    return {
      map: null,
      mapMode: 1,
      mapType: kakao.maps.MapTypeId.ROADMAP,
    }
  },

  created() {},

  mounted() {
    this.map = new kakao.maps.Map(
      document.getElementById('map'),
      this.mapOption
    )
  },

  methods: {},

  computed: {
    ...mapGetters('topic', { topics: 'getTopics' }),
    mapOption() {
      return {
        center: new kakao.maps.LatLng(37.56187822824851, 126.94683630963316),
        level: 12,
      }
    },
  },
}
</script>

<style scoped lang="scss">
.map-container {
  position: fixed;
  width: 100vw;
  height: 100vh;

  #map,
  #streetview {
    width: 100%;
    height: 100%;
  }
}
</style>
