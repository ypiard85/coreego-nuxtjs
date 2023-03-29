<template>
  <div>
    <div :id="id"></div>
    <template v-if="widthOptions">
      <MapUiOptions
        @change-type="$emit('change-type', $event)"
        @change-mode="$emit('change-mode', $event)"
        :mapOptions="mapOptions"
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
import MapUiOptions from './map-ui/MapUiOptions'
import {
  TYPE_ROADMAP,
  TYPE_HYBRID,
  MODE_MAP_VIEW,
  MODE_STREET_VIEW,
} from '~/utils/variables.js'

import { mapGetters } from 'vuex'

export default {
  components: { MapUiOptions },
  props: {
    id: {
      type: String,
      reuqired: true,
    },
    widthOptions: {
      type: Boolean,
      required: true,
      default: true,
    },
    mapOptions: {
      type: Object,
      required: false,
      default: () => {},
    },
    isMultiMarker: {
      type: Boolean,
      required: false,
      default: false,
    },
    places: {
      type: Array,
      required: false,
      default: null,
    },
  },

  data() {
    return {}
  },

  mounted() {
    this.loadMap()
  },

  computed: {
    ...mapGetters('app', {
      categories: 'getCategories',
      cities: 'getCities',
    }),

    cityName() {
      return (cityId) => {
        let label = ''
        const cityFind = this.cities.find((city) => city.id === cityId)
        if (cityFind) {
          label = cityFind.label
        }
        return label
      }
    },

    categoryName() {
      return (categoryId) => {
        let label = ''
        const categoryFind = this.categories.find(
          (category) => category.id === categoryId
        )
        console.log(categoryFind)
        if (categoryFind) {
          label = categoryFind.name
        }
        return label
      }
    },

    mapType() {
      let mapType = null
      if (this.mapOptions.type == TYPE_HYBRID) {
        mapType = kakao.maps.MapTypeId.HYBRID
      } else if (this.mapOptions.type === TYPE_ROADMAP) {
        mapType = kakao.maps.MapTypeId.ROADMAP
      }
      return mapType
    },

    mapOption() {
      let mapOption = {}

      if (this.isMultiMarker) {
        mapOption = {
          center: new kakao.maps.LatLng(
            this.places[0].geopoint._lat,
            this.places[0].geopoint._long
          ),
          level: 12,
        }
      } else {
        mapOption = {
          center: new kakao.maps.LatLng(
            this.mapOptions.lat,
            this.mapOptions.long
          ), // 지도의 중심좌표
          level: 6, // 지도의 확대 레벨
        }
      }

      return mapOption
    },
  },

  methods: {
    async loadMap() {
      if (!this.isMultiMarker) {
        if (this.mapOptions.mode == MODE_MAP_VIEW) {
          this.loadMapMarker()
        } else if (this.mapOptions.mode == MODE_STREET_VIEW) {
          this.loadMapStreetView()
        }
      } else {
        if (Array.isArray(this.places)) {
          console.log('is multi marker map')
          this.loadMapMultiMarker()
        }
      }
    },

    loadMapMarker() {
      var mapContainer = document.getElementById(this.id) // 지도를 표시할 div
      var map = new kakao.maps.Map(mapContainer, this.mapOption) // 지도를 생성합니다
      map.setMapTypeId(this.mapType)
      var marker = new kakao.maps.Marker()
      marker.setPosition(map.getCenter())
      return marker.setMap(map)
    },

    loadMapStreetView() {
      var roadviewContainer = document.getElementById(this.id) //로드뷰를 표시할 div
      var roadview = new kakao.maps.Roadview(roadviewContainer) //로드뷰 객체
      var roadviewClient = new kakao.maps.RoadviewClient() //좌표로부터 로드뷰 파노ID를 가져올 로드뷰 helper객체
      var position = new kakao.maps.LatLng(
        this.mapOptions.lat,
        this.mapOptions.long
      )
      // 특정 위치의 좌표와 가까운 로드뷰의 panoId를 추출하여 로드뷰를 띄운다.
      roadviewClient.getNearestPanoId(position, 50, function (panoId) {
        if (panoId) {
          roadview.setPanoId(panoId, position) //panoId와 중심좌표를 통해 로드뷰 실행
        }
        return roadviewClient
      })
    },

    loadMapMultiMarker() {
      var mapContainer = document.getElementById(this.id)
      var map = new kakao.maps.Map(mapContainer, this.mapOption)

      for (let place of this.places) {
        let { _lat, _long } = place.geopoint
        var marker = new kakao.maps.Marker({
          map: map,
          position: new kakao.maps.LatLng(_lat, _long),
        })
        var overlay = new kakao.maps.CustomOverlay({
          content: this.contentHtml(place),
          map: map,
          position: marker.getPosition(),
        })
        let res = kakao.maps.event.addListener(marker, 'click', function () {
          overlay.setMap(map)
        })
        console.log(res)
      }
    },

    contentHtml(place) {
      let content =
        '<div class="wrap">' +
        '    <div class="info">' +
        '        <div class="title text-truncate d-block">' +
        place.title +
        '</div>' +
        '        <div class="body">' +
        '            <div class="img">' +
        `               <img src="${place.thumbnail.url}">` +
        '           </div>' +
        '            <div class="desc">' +
        '                <div class="ellipsis">' +
        this.cityName(place.city) +
        ' - ' +
        this.categoryName(place.category) +
        '</div>' +
        `                <div>
      <a href="https://map.kakao.com/link/to/${place.title},${place.geopoint._lat},${place.geopoint._long}" target="_blank" class="link">Navigation</a>
      <a href="/places/view/${place.id}" class="link">Voir le lieu</a>

      </div>` +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>'

      return content
    },

    backPage() {
      this.$router.back()
    },
  },
}
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
