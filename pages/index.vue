<template>
  <div>
    <kakao-map
      ref="kakaomap"
      :topics="topics"
      :selectTopic="selectTopic"
      :mapMode="mapMode"
      v-if="displayKakaomap"
      @close-road-view="closeRoadView"
    />
    <drawer>
      <template v-if="viewType === VIEW_ALL_TOPICS">
        <DrawerAddTopic
          @query-result="handleQueryResult"
          :selectTopic="selectTopic"
          @marker-target=";(selectTopic = $event), reloadMap()"
          @street-view-target="handleDisplayStreetView"
        />
      </template>
    </drawer>
  </div>
</template>

<script>
import Drawer from '../components-app/drawer/Drawer.vue'
import KakaoMap from '../components-app/maps/KakaoMap.vue'
import {
  VIEW_ALL_TOPICS,
  VIEW_SINGLE_TOPIC,
  ADD_NEW_TOPIC,
  TYPE_ROADMAP,
  TYPE_HYBRID,
  MODE_MAP_VIEW,
  MODE_STREET_VIEW,
} from '@/utils/variables.js'
import DrawerAddTopic from '../components-app/drawer/DrawerAddTopic.vue'
export default {
  name: 'HomePage',
  components: { KakaoMap, Drawer, DrawerAddTopic },

  data() {
    return {
      VIEW_ALL_TOPICS,
      VIEW_SINGLE_TOPIC,
      ADD_NEW_TOPIC,
      MODE_MAP_VIEW,
      MODE_STREET_VIEW,

      viewType: VIEW_ALL_TOPICS,
      mapMode: MODE_MAP_VIEW,
      kakaomapIndex: 1,
      topics: [],
      selectTopic: null,
      displayKakaomap: true,
    }
  },

  created() {},

  methods: {
    reloadMap() {
      this.displayKakaomap = false
      this.$nextTick(() => {
        this.displayKakaomap = true
      })
    },

    closeRoadView(){
      this.reloadMap()
      this.mapMode = MODE_MAP_VIEW
    },

    handleDisplayStreetView($event){
      this.reloadMap()
      this.selectTopic = $event
      this.mapMode = MODE_STREET_VIEW
      console.log( this.selectTopic)
    },

    handleQueryResult(querySearch) {
      this.reloadMap()
      this.topics = querySearch.map((query) => {
        return { ...query, latitude: query.y, longitude: query.x }
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
