<template>
  <div>
    <KakaoMap
      :key="reloadMap"
      id="mapmarker"
      @change-type="
        mapOptions.type = $event
        reloadmap()
      "
      @change-mode="
        mapOptions.mode = $event
        reloadmap()
      "
      @close-map="$emit('close')"
      :mapOptions="mapOptions"
    />
  </div>
</template>

<script>
import KakaoMap from '@/components/map/KakaoMap'
export default {
  name: 'kakaoMapModal',

  components: { KakaoMap },
  props: {
    geopoint: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      mapOptions: {
        lat: this.geopoint.lat,
        long: this.geopoint.long,
        type: 0,
        mode: 2,
      },
      reloadMap: 0
    }
  },

  methods: {
    reloadmap() {
      this.reloadMap++
    },
  },
}
</script>

<style scoped lang="scss"></style>
