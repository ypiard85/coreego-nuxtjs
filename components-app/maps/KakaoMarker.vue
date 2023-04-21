<template></template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  VIEW_ALL_TOPICS,
  VIEW_SINGLE_TOPIC,
  ADD_NEW_TOPIC,
} from '@/utils/variables.js'
export default {
  name: 'kakaoMarker',

  props: {
    map: {
      required: true,
    },
    topic: {
      type: Object,
    },
  },

  data() {
    return {
      marker: null,
    }
  },

    computed: {
    ...mapGetters('topic', { selectedTopic: 'getTopicSelected' }),
    size() {
      let size = 35
      if (this.selectedTopic && this.selectedTopic.id === this.topic.id) {
        size = 50
      }
      return size
    },
  },

  mounted() {
    this.marker = new kakao.maps.Marker({
      map: this.map,
      position: new kakao.maps.LatLng(
        this.topic.localisation.latitude,
        this.topic.localisation.longitude
      ),

      image: new kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
        new kakao.maps.Size(35, 35)
      )
    })

    // Ajouter un écouteur de clic pour afficher l'infowindow lorsque le marqueur est cliqué
    kakao.maps.event.addListener(this.marker, 'click', () => {
      this.setViewType(VIEW_SINGLE_TOPIC)
      this.setTopicSelected(this.topic)
    })
  },

  methods: {
    ...mapActions('appState', ['setViewType']),
    ...mapActions('topic', ['setTopicSelected']),
  },


}
</script>

<style></style>
