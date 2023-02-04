<template>
  <el-dialog v-loading="busy" :visible="openModal" :fullscreen="true" :append-to-body="true" @close="$emit('close-modal')">
    <template v-if="name">
      <template v-if="name == 'gestionImages' ">
        <GestionImagesModal
        :images="images"
        :place="place"
        :thumbnail="thumbnail" @modal-busy="busy = $event"
        @close-modal="$emit('close-modal')"
        @load-place="$emit('load-place') "
        />
      </template>

    <template v-if="name == 'kakaomap' && openModal ">
      <KakaoModal :place="place" @close-modal="$emit('close-modal')" />
    </template>

    </template>
  </el-dialog>
</template>

<script>
  import GestionImagesModal from './modal/GestionImagesModal'
  import KakaoModal from './modal/KakaoModal'

  export default {
    name: 'modals',
    components: { GestionImagesModal, KakaoModal },
    props: {
      openModal: {
        type: Boolean,
        required: true,
        default: false
      },
      name: {
        required: false,
        default: null
      },
      images: {
        type: Array,
      },
      thumbnail: {
        type: String,
        required: true,
      },
      place:{
        type: Object,
        required: true
      }
    },

    data(){
      return{
        busy: false,
      }
    }

  }

</script>

<style scoped lang="scss">

</style>