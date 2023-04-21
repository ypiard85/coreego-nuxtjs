<template>
  <div class="app-container">
    <kakao-map  />
    <Nuxt />
  </div>
</template>

<script>
import KakaoMap from '../components-app/maps/KakaoMap.vue'
import {mapActions} from 'vuex'
export default {
  components: { KakaoMap },
  name: 'layout',

  data() {
    return {

    }
  },

  methods:{
    ...mapActions('topic', ['setTopics'])
  },

  async created(){
    await this.setTopics()
  },

  computed: {},
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
