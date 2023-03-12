<template>
  <div>
    <KakaoMap
      v-if="!map.reload"
      id="mapmarker"
      @change-type="
        map.type = $event
        reloadmap()
      "
      @change-mode="
        map.mode = $event
        reloadmap()
      "
      @close-map="$emit('close')"
      :lat="map.lat"
      :long="map.long"
      :mapType="map.type"
      :mapMode="map.mode"
      :widthOptions="true"
    />
  </div>
</template>

<script>
import KakaoMap from '@/components/map/KakaoMap'
export default {
  name: 'kakaoMapModal',

  components: { KakaoMap },
  props: {
    place: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      map: {
        lat: this.place.geopoint._lat,
        long: this.place.geopoint._long,
        type: 0,
        mode: 2,
        reload: false,
      },
    }
  },

  methods: {
    reloadmap() {
      this.map.reload = true
      this.$nextTick(() => {
        this.map.reload = false
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
