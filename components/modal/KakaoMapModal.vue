<template>
  <div>
    <KakaoMap
      v-if="!mapOptions.reload"
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
      mapOptions: {
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
      this.mapOptions.reload = true
      this.$nextTick(() => {
        this.mapOptions.reload = false
      })
    },
  },
}
</script>

<style scoped lang="scss"></style>
