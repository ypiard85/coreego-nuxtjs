<template>
  <div>
    <main class="modal__main mt-3" v-if="images">
      <section class="thumbnail__setting">
        <h3 class="border-bottom border-dark">Image de couverture</h3>
        <div class="mt-3 d-flex flex-wrap">
          <el-radio
            v-model="selectImage"
            class="mb-3"
            v-for="image in images"
            :key="image.url"
            @change="onClickThumbnailChange(image.name)"
            :label="image.name"
          >
            <el-avatar :size="72" :src="image.url"></el-avatar>
          </el-radio>
        </div>
      </section>
      <section>
        <h3 class="border-bottom border-dark mt-5">Ordre des slides</h3>
        <draggable
          v-model="imagesOrder"
          group="images"
          @change="onChangeOrder"
          class="d-flex flex-wrap"
        >
          <div
            v-for="image in imagesOrder"
            :key="image.url"
            class="rounded me-3 mb-3 shadow"
            style="width: 100px; height: 100px"
          >
            <el-image
              style="width: 100%; height: 100%"
              :src="image.url"
              fit="cover"
            />
          </div>
        </draggable>
      </section>
    </main>
    <footer
      class="d-flex justify-content-between position-sticky bottom-0 bg-white"
    >
      <el-button
        icon="el-icon-close"
        type="danger"
        @click="$emit('close-modal')"
        >Fermer</el-button
      >
      <el-button
        icon="el-icon-check"
        type="success"
        @click="$emit('on-submit-setting-images')"
        >Valider</el-button
      >
    </footer>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  name: 'gestionImages',
  components: { draggable },
  props: {
    images: {
      type: Array,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      imagesArray: null,
      imagesOrder: null,

      selectImage: null,
    };
  },

  created() {
    this.selectImage = this.thumbnail;

    this.imagesOrder = [...this.images];
  },

  methods: {
    onClickThumbnailChange(image) {
      console.log(image);
      this.$emit("change-thumbnail", image);
    },

    hydrateImmagesArray() {
      this.imagesArray = this.images.map((image) => {
        return { ...image, checked: image.name === this.thumbnail };
      });
    },

    onChangeOrder() {
      this.$emit(
        "change-images-order", this.imagesOrder
      );
    },
  },
};
</script>

<style lang="scss" scoped></style>
