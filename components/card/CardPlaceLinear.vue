<template>
  <el-card :body-style="{ padding: '0px' }" shadow="hover">
    <div class="d-flex align-items-center">
      <el-image :src="place.thumbnail.url" fit="cover"></el-image>
      <div
        class="px-2"
        style="min-width: 0"
      >
        <span class="fs-6 mb-1 fw-bold d-block text-truncate">
          {{ place.title }}
        </span>
        <div class="d-flex align-items-center">
          <vui-city-category :place="place" />
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import VuiCityCategory from '@/components/vui-alpha/VuiCityCategory'

export default {
  name: 'CardPlaceLinear',

  props: {
    place: {
      type: Object,
      required: true,
    },
  },

  components: { VuiCityCategory },

  computed: {},
}
</script>

<style scoped lang="scss">
::v-deep .el-image {
  max-width: 80px;
  height: 100%;
  img {
   height: 80px;
   max-height: 150px;
  }
}
</style>
