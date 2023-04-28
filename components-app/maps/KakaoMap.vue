<template>
  <div
    class="map-container"
    :class="[{ 'road-view': mapMode == MODE_STREET_VIEW }]"
  >
    <div id="map"></div>
    <div id="roadview"></div>
    <el-button
      type="danger"
      v-if="mapMode == MODE_STREET_VIEW"
      class="position-fixed top-0 start-0"
      @click="$emit('close-road-view')"
      >Fermer</el-button
    >
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  VIEW_ALL_TOPICS,
  VIEW_SINGLE_TOPIC,
  ADD_NEW_TOPIC,
  MODE_MAP_VIEW,
  MODE_STREET_VIEW,
} from '@/utils/variables.js'
import { addMarker } from '@/utils/app.js'
export default {
  name: 'kakao-map',

  props: {
    topics: {
      type: Array,
      required: false,
      default: () => [],
    },
    selectTopic: {
      type: Object,
      required: false,
      default: null,
    },
    mapMode: {
      required: false,
      default: MODE_MAP_VIEW,
    },
  },
  data() {
    return {
      map: null,
      MODE_STREET_VIEW,
    }
  },

  mounted() {
    this.initMap()
    addMarker(this.map, this.topics)
    if (this.mapMode === MODE_STREET_VIEW) {
      this.initRoadMap()
    }
  },

  methods: {
    initMap() {
      this.map = new kakao.maps.Map(
        document.getElementById('map'),
        this.mapOption
      )
      this.map.setMapTypeId(kakao.maps.MapTypeId.HYBRID)
    },

    initRoadMap() {
      var roadviewContainer = document.getElementById('roadview') //로드뷰를 표시할 div
      var roadview = new kakao.maps.Roadview(roadviewContainer) //로드뷰 객체
      var roadviewClient = new kakao.maps.RoadviewClient() //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체

      var position = new kakao.maps.LatLng(
        this.selectTopic.y,
        this.selectTopic.x
      )

      // 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
      roadviewClient.getNearestPanoId(position, 50, function (panoId) {
        console.log(position)
        roadview.setPanoId(panoId, position) //panoId와 중심좌표를 통해 로드뷰 실행
      })
    },
  },

  computed: {
    mapOption() {
      let latitude = 37.566826
      let longitude = 126.570667
      let level = 12
      if (this.topics.length) {
        latitude = this.topics[0].latitude
        longitude = this.topics[0].longitude
      }
      if (this.selectTopic) {
        const { x, y } = this.selectTopic
        longitude = x
        latitude = y
        level = 1
      }

      return {
        center: new kakao.maps.LatLng(
          parseFloat(latitude),
          parseFloat(longitude)
        ),
        level: level,
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

  &.road-view {
    z-index: 1000;
    #map {
      display: none;
    }
    #roadview {
      z-index: 600;
    }
    .el-button {
      z-index: 600;
    }
  }

  #map,
  #roadview {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 600;
  }
}
</style>
