<template>
  <div>
    <title-modal
      ClassIcon="el-icon-picture"
      title="Gestion des images"
      class="fs-1"
    />

    <main class="modal__main mt-3" v-if="place">
      <section class="thumbnail__setting">
        <h3 class="border-bottom border-dark">Image de couverture</h3>
        <div class="mt-3 d-flex flex-wrap">
          <el-radio
            v-model="thumbnail"
            class="mb-3"
            v-for="(image, index) in images"
            :key="index"
            @change="updateThumbnail"
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
          group="imagesOrder"
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
        @click="$emit('close')"
        >Fermer</el-button
      >
      <el-button
        icon="el-icon-check"
        type="success"
        @click="onSubmitSettingImages"
        >Valider</el-button
      >
    </footer>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import TitleModal from './_TitleModal.vue'
export default {
  name: 'gestionImages',
  components: { draggable, TitleModal },
  props: {
    place: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      images: null,
      thumbnail: this.place.thumbnail.name,
      imagesOrder: this.place.images,
    }
  },

  created() {
    this.updateThumbnail()
  },

  methods: {
    updateThumbnail() {
      this.images = this.place.images.map((image) => {
        return { ...image, checked: image.name === this.thumbnail }
      })
    },

    async onSubmitSettingImages() {
      let images = this.imagesOrder
      let imageChecked = this.images.find((image) => image.checked)
      let thumbnail = { name: imageChecked.name, url: imageChecked.url }

      try {
        this.$emit('modalBusy', true)
        const placeDocument = this.$fire.firestore
          .collection('lieux')
          .doc(this.$route.params.id)
        await placeDocument.update({
          images: images,
          thumbnail: thumbnail,
        })
        this.$message.success('Images mis à jour')
        this.$emit('load')
        this.$emit('close')
      } catch (error) {
        this.$message.error('erreur de la modification des images : ' + error)
      } finally {
        this.$emit('modalBusy', false)
      }
    },

    //       async onSubmitSettingImages($event) {
    //   try {

    //     this.$emit('modal-busy', true)
    //     const ref = doc(db, "lieux", this.$route.params.id);

    //     await updateDoc(ref, {
    //       images: $event.images,
    //       thumbnail: $event.thumbnail,
    //     })
    //     this.$emit('load-place')
    //     this.$message.success("Images mis à jour");
    //     this.$emit('close-modal')

    //   } catch (error) {
    //     console.log(error)
    //     this.$message.error(error);
    //   } finally {
    //     this.$emit('modal-busy', false)
    //   }
    // },
  },
}
</script>

<style lang="scss" scoped></style>
