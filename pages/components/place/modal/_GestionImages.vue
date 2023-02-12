<template>
  <div>
    <main class="modal__main mt-3" v-if="place">
      <section class="thumbnail__setting">
        <h3 class="border-bottom border-dark">Image de couverture</h3>
        <div class="mt-3 d-flex flex-wrap">
          <el-radio v-model="thumbnail" class="mb-3" v-for="(image, index) in images" :key="index"
            @change="updateThumbnail" :label="image.name">
            <el-avatar :size="72" :src="image.url"></el-avatar>
          </el-radio>
        </div>
      </section>
      <section>
        <h3 class="border-bottom border-dark mt-5">Ordre des slides</h3>
        <draggable v-model="imagesOrder" group="imagesOrder" class="d-flex flex-wrap">
          <div v-for="image in imagesOrder" :key="image.url" class="rounded me-3 mb-3 shadow"
            style="width: 100px; height: 100px">
            <el-image style="width: 100%; height: 100%" :src="image.url" fit="cover" />
          </div>
        </draggable>
      </section>
    </main>
    <footer class="d-flex justify-content-between position-sticky bottom-0 bg-white">
      <el-button icon="el-icon-close" type="danger" @click="$emit('close-modal')">Fermer</el-button>
      <el-button icon="el-icon-check" type="success" @click="onSubmitSettingImages">Valider</el-button>
    </footer>
  </div>
</template>
<script>
  import draggable from "vuedraggable";
  export default {
    name: 'gestionImages',
    components: { draggable },
    props: {
      place: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        images: null,

        thumbnail: null,
        imagesOrder: null,

      };
    },

    created() {
      this.thumbnail = this.place.thumbnail.name
      this.images = this.place.images
      this.imagesOrder = this.place.images

      this.updateThumbnail()

    },

    methods: {
      updateThumbnail() {
        this.images = this.images.map((image) => {
          return { ...image, checked: image.name === this.thumbnail };
        });
      },

      onSubmitSettingImages() {
        let images = this.imagesOrder
        let imageChecked = this.images.find(image => image.checked)
        let thumbnail = {name: imageChecked.name, url: imageChecked.url}

        this.$emit(
          "on-submit-setting-images", {
          images, thumbnail
        }
        );
      },
    },
  };
</script>

<style lang="scss" scoped></style>