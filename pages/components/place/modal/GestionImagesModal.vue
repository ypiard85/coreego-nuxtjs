<template>
  <div>
    <!-- titre personalisé de la modal -->
    <header class="modal__header" slot="title">
      <div class="modal__header__title fs-2">
        <i class="el-icon-picture"></i>
        <span class="ms-3">Gérer les images</span>
      </div>
    </header>

    <GestionImages :place="place" @change-thumbnail="thumbnailValue = $event"
      @change-images-order="imagesOrder = $event" @on-submit-setting-images="onSubmitSettingImages($event)"
      @close-modal="$emit('close-modal')" />

  </div>
</template>

<script>
  import GestionImages from './_GestionImages.vue'
  import { db } from "~/plugins/firebase";
  import { doc, updateDoc } from "firebase/firestore";
  import { getImageUrl } from '~/utils/request.js'

  export default {
    name: "gestionImagesModal",

    components: { GestionImages },

    props: {
      place: {
        type: Object,
        required: true
      }
    },

    data() {
      return {
        images: null,
        thumbnail: null
      }
    },

    methods: {
      async onSubmitSettingImages($event) {
        try {

          this.$emit('modal-busy', true)
          const ref = doc(db, "lieux", this.$route.params.id);

          await updateDoc(ref, {
            images: $event.images,
            thumbnail: $event.thumbnail,
          })
          this.$emit('load-place')
          this.$message.success("Images mis à jour");
          this.$emit('close-modal')

        } catch (error) {
          console.log(error)
          this.$message.error(error);
        } finally {
          this.$emit('modal-busy', false)
        }
      },
    }

  }

</script>

<style scoped lang="scss">
  header {
    position: absolute;
    top: 0;
  }
</style>