<template>
  <div>
    <div id="map-container">
      <div id="map" :class="{ 'in-first': mapMode === MODE_MAP }"></div>
      <div id="streetview"></div>
    </div>
    <div class="buttons-options">
      <div class="buttons-options-mode" v-if="showModeOptions">
        <el-button-group>
          <el-button
            type="primary"
            @click="changeMapMode(MODE_MAP)"
            icon="el-icon-map-location"
            :plain="mapMode != MODE_MAP"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-truck"
            @click="changeMapMode(MODE_STREET_VIEW)"
            :plain="mapMode != MODE_STREET_VIEW"
          ></el-button>
        </el-button-group>
      </div>
      <div
        class="buttons-options-type mt-3"
        v-if="mapMode === MODE_MAP && showTypeOptions"
      >
        <el-button-group class="d-flex flex-column">
          <el-button
            @click="changeMapType(TYPE_ROADMAP)"
            class="border border-3"
            :class="{ 'border-dark': mapType == TYPE_ROADMAP }"
          >
            <img :src="require('./images/plan.png')" alt="" />
          </el-button>
          <el-button
            @click="changeMapType(TYPE_HYBRID)"
            class="border border-3"
            :class="{ 'border-dark': mapType == TYPE_HYBRID }"
          >
            <img :src="require('./images/satelitte.png')" alt="" />
          </el-button>
        </el-button-group>
      </div>
    </div>
    <div id="close-buttons">
      <el-button v-if="showCloseBtn" @click="$emit('close')" type="danger">
        <i class="el-icon-close fw-bold"></i>
        FERMER</el-button
      >
      <nuxt-link v-if="showRedirectBtn" :to="'/profil/view/' + userLogged.uid">
        <el-button type="success">
          <i class="el-icon-refresh-left fw-bold"></i>
          RETOUR AU PROFIL
        </el-button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

const MODE_MAP = 1
const MODE_STREET_VIEW = 2
const TYPE_ROADMAP = 1
const TYPE_HYBRID = 3
export default {
  name: 'KakaoMap',

  props: {
    showCloseBtn: {
      type: Boolean,
      required: false,
      default: true,
    },
    showRedirectBtn: {
      type: Boolean,
      required: false,
      default: false,
    },
    showTypeOptions: {
      type: Boolean,
      required: false,
      default: true,
    },
    showModeOptions: {
      type: Boolean,
      required: false,
      default: true,
    },
    place: {
      type: Object,
      required: false,
      default: null,
    },
    places: {
      type: Array,
      require: false,
      default: null,
    },
  },

  data() {
    return {
      MODE_MAP,
      MODE_STREET_VIEW,
      TYPE_HYBRID,
      TYPE_ROADMAP,
      mapMode: MODE_MAP,
      map: null,
      mapType: kakao.maps.MapTypeId.ROADMAP,
      overlays: [],
      openCard: null,
    }
  },
  mounted() {
    // Créez une nouvelle instance de la carte
    this.map = new kakao.maps.Map(
      document.getElementById('map'),
      this.mapOption
    )
    var roadview = new kakao.maps.Roadview(
      document.getElementById('streetview')
    )
    var roadviewClient = new kakao.maps.RoadviewClient()
    var position = new kakao.maps.LatLng(this.geopoint.lat, this.geopoint.long)
    roadviewClient.getNearestPanoId(position, 50, function (panoId) {
      if (panoId) {
        roadview.setPanoId(panoId, position) //panoId와 중심좌표를 통해 로드뷰 실행
      }
    })

    if (this.place) {
      var marker = new kakao.maps.Marker()
      marker.setPosition(this.map.getCenter())
      marker.setMap(this.map)
    } else if (this.places) {
      for (let place of this.places) {
        var marker = new kakao.maps.Marker({
          map: this.map,
          position: new kakao.maps.LatLng(
            place.geopoint._lat,
            place.geopoint._long
          ),
        })

        const overlay = new kakao.maps.CustomOverlay({
          content: this.markerCardHtml(place),
          map: this.map,
          position: marker.getPosition(),
        })

        this.overlays.push(overlay)
        // 마커를 클릭했을 때 커스텀 오버레이를 표시합니다
        kakao.maps.event.addListener(marker, 'click', () => {
          this.overlays.forEach((overlay) => {
            overlay.setMap(null)
          })
          overlay.setMap(this.map)
        })
      }
    }
  },
  methods: {
    changeMapType(type) {
      if (type === TYPE_HYBRID) {
        this.mapType = kakao.maps.MapTypeId.HYBRID
      } else if (type === TYPE_ROADMAP) {
        this.mapType = kakao.maps.MapTypeId.ROADMAP
      }
      this.map.setMapTypeId(this.mapType)
    },

    changeMapMode(mode) {
      this.mapMode = mode
    },

    markerCardHtml(place) {
      var content = `
        <div class="wrap">
          <div class="info">
           <div class="title text-truncate d-block">
            ${place.title}
           </div>
           <div class="body">
            <div class="img">
              <img src="${place.thumbnail.url}">
            </div>
            <div class="desc mt-1 ">
              <div class="d-flex flex-column mb-2">
                <span class="d-flex align-items-center mb-2 h6">
                  <i class="el-icon-location-outline"></i>
                  <span>${this.city(place.city).label}</span>
                </span>
                <span class="px-1 align-self-start text-white fw-bold" style="background-color: ${
                  this.category(place.category).color
                }; border-radius: 8px" >${
        this.category(place.category).name
      }</span>
              </div>
              <div>
                <a class="el-button el-button--success p-1 el-button--small me-1" href="https://map.kakao.com/link/to/${place.title},${
        place.geopoint._lat
      },${place.geopoint._long}"
                target="_blank" class="link">
                  <span class="el-icon-map-location"></span>
                  ouvrir GPS
                </a>
                    <a class="el-button el-button--primary p-1 el-button--small" href="/places/view/${
                      place.id
                    }" class="link"><span class="el-icon-view me-1"></span>voir le lieu</a>
              </div>
            </div>
           </div>
          </div>
        </div>
      `
      return content
    },
  },
  computed: {
    ...mapGetters('app', { cities: 'getCities', categories: 'getCategories' }),
    ...mapGetters('auth', { userLogged: 'getUserLogged' }),

    city() {
      return (cityId) => {
        let city = null
        let cityFind = this.cities.find((city) => city.id === cityId)
        if (cityFind) {
          city = cityFind
        }
        return city
      }
    },

    category() {
      return (categoryId) => {
        let category = null
        let categoryFind = this.categories.find(
          (category) => category.id === categoryId
        )
        if (categoryFind) {
          category = categoryFind
        }
        return category
      }
    },

    mapOption() {
      return {
        center: new kakao.maps.LatLng(this.geopoint.lat, this.geopoint.long),
        level: this.places ? 12 : 3,
      }
    },

    geopoint() {
      let geopoint = {}
      if (this.place) {
        geopoint = {
          lat: this.place.geopoint._lat,
          long: this.place.geopoint._long,
        }
      } else if (this.places) {
        geopoint = {
          lat: this.places[0].geopoint._lat,
          long: this.places[0].geopoint._long,
        }
      }
      return geopoint
    },
  },
}
</script>

<style scoped lang="scss">
#map-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
#map,
#streetview {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
}

#map {
  z-index: 10;

  &.in-first {
    z-index: 950;
  }
}

#streetview {
  z-index: 900;
}

.buttons-options {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;

  &-type {
    display: flex;
    justify-content: flex-end;
    .el-button {
      padding: 0;
      width: fit-content;
    }
    img {
      width: 50px;
      height: 50px;
    }
  }
}

#close-buttons {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}
</style>
