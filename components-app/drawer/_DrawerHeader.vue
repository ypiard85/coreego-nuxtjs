<template>
  <div class="drawer-header py-3">
    <el-image
      class="m-auto"
      :src="LOGO_PATH"
      style="width: 200px; height: auto"
    />
    <!-- <el-button
      class="drawer-header-button"
      variant="default"
      @click="$emit('click')"
    >
      <b-icon icon="list"></b-icon>
    </el-button> -->
  </div>
</template>

<script>
import { LOGO_PATH } from '@/utils/variables.js'
export default {
  name: 'drawer-header',

  data() {
    return {
      LOGO_PATH,
    }
  },
}
</script>

<style scoped lang="scss">
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(175, 170, 170, 0.359);
  &-button {
    border: none;
    font-size: 34px;
    background: transparent;
  }
}
</style>
