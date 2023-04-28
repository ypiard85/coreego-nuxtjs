<template>
  <div class="drawer shadow" :class="{ open: openDrawer }">
    <div class="drawer__content">
      <drawer-header @click="openDrawer = !openDrawer" />
      <slot></slot>
    </div>
  </div>
</template>

<script>
import DrawerHeader from './_DrawerHeader.vue'
import DrawerTopic from './DrawerTopic.vue'
// import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'drawer',

  components: { DrawerHeader, DrawerTopic },

  data() {
    return {}
  },

  computed: {},

  props: {
    topic: {
      type: Object,
    },
  },

  data() {
    return {
      openDrawer: true,
    }
  },

  methods: {},
}
</script>

<style scoped lang="scss">
.drawer {
  position: fixed;
  left: 10px;
  top: 10px;
  bottom: 10px;
  background: white;
  border-radius: 5px;
  width: 400px;
}

// .drawer {
//   position: fixed;
//   display: block;
//   left: -330px;
//   bottom: 0;
//   top: 0;
//   z-index: 100;
//   width: 400px;
//   &.open {
//     left: 0px;
//   }

//   &__content {
//     background: white;
//     height: 100%;
//     width: 100%;
//   }
// }
</style>
