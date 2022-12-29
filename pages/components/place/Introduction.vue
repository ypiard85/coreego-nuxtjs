<template>
  <div v-if="place">
    <section class="introduction__header">
      <div class="d-flex">
        <el-link
          class="me-2"
          icon="el-icon-location-outline"
          :underline="false"
          >{{ city.label }}</el-link
        >
        <vui-tag :label="category.label" :color="category.color" />
      </div>
      <router-link to="/" class="text-blue mt-3 d-inline-flex align-items-center">
        <el-avatar
        :src="place.user.photoUrl"
        class="me-3"
        ></el-avatar>
        <span class="fw-bold">{{ place.user.displayName }}</span>
      </router-link>
      <h1 class="fs-3 mt-3">{{ place.title }}</h1>
    </section>
      <!-- description -->
      <section class="mt-3 introduction__description" style="white-space: pre-line">
          {{ place.description }}
      </section>
    </div>
</template>

<script>
  import VuiTag from '@/components/vui-alpha/VuiTag'
export default {
  components: {VuiTag},

  props: {
    place: {
      required: true,
    },
    inCarnet: {
      type: Boolean,
    },
    loadingBtn: {
      type: Boolean,
    },
    city: {
      type: Object,
    },
    category: {
      type: Object,
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .nav-tabs {
  border-bottom: 0px solid transparent;
  .nav-link.active {
    border-color: transparent;
    border-bottom: 3px solid black;
  }
}
</style>
