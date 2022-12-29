<template>
  <el-carousel
    :interval="2000"
    style="width: 100%"
    :loop="true"
    class="carousel__custom"
  >
    <el-carousel-item v-for="(image, i) in images" :key="i">
      <el-image
        :src="image.url"
        fit="cover"
        style="height: 100%; width: 100%"
      />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { ICON_DIAPO_NEXT_BTN, ICON_DIAPO_PREV_BTN } from "~/utils/variables";
import {
  getDownloadURL,
  ref as storageRef,
  deleteObject,
} from "firebase/storage";
import { storage } from "~/plugins/firebase";

export default {
  props: {
    images: {
      type: Array,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.el-carousel--horizontal {
  overflow: hidden;
}

.carousel__custom {
  height: 30vw;
  max-height: 500px;

  @media screen and (max-width: 500px) {
    height: 50vw;
  }
}

::v-deep .el-carousel__container {
  height: 100%;

  .el-carousel__item {
    height: 100%;
    width: 100%;

    img {
      object-position: bottom;
    }
  }
}
</style>
