<template>
  <div class="drawer" :class="{ open: openDrawer }">
    <div class="drawer__content">
      <drawer-header @click="openDrawer = !openDrawer" />

      <!-- template view single topic -->
      <template v-if="viewType === VIEW_SINGLE_TOPIC">
        <drawer-topic :topic="topicSelected" />
      </template>
    </div>
  </div>
</template>

<script>
import DrawerHeader from './_DrawerHeader.vue'
import DrawerTopic from './DrawerTopic.vue'
import { mapActions, mapGetters } from 'vuex'
import {
  VIEW_ALL_TOPICS,
  VIEW_SINGLE_TOPIC,
  ADD_NEW_TOPIC,
} from '@/utils/variables.js'
export default {
  name: 'drawer',

  components: { DrawerHeader, DrawerTopic },

  computed: {
    ...mapGetters('appState', { viewType: 'getViewType' }),
    ...mapGetters('topic', { topicSelected: 'getTopicSelected' }),
  },

  props: {
    topic: {
      type: Object,
    },
  },

  data() {
    return {
      VIEW_SINGLE_TOPIC,
      VIEW_ALL_TOPICS,
      ADD_NEW_TOPIC,
      openDrawer: true,
    }
  },

  methods: {},
}
</script>

<style scoped lang="scss">
.drawer {
  position: fixed;
  left: -330px;
  bottom: 0;
  top: 0;
  z-index: 2000;
  width: 400px;
  &.open {
    left: 0px;
  }

  &__content {
    background: white;
    height: 100%;
    width: 100%;
  }
}
</style>
