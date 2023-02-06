<template>
  <el-dialog
    :custom-class="customClass"
  v-loading="busy" :title="modal.title" :visible="modal.open" :fullscreen="fullscreen" :append-to-body="true" @close="$emit('close-modal')">
    <template v-if="modal.name">
      <template v-if="modal.name == 'gestionImages' ">
        <GestionImagesModal
        :images="images"
        :place="place"
        :thumbnail="thumbnail" @modal-busy="busy = $event"
        @close-modal="$emit('close-modal')"
        @load-place="$emit('load-place') "
        />
      </template>

    <template v-if="modal.name == 'kakaomap' && modal.open ">
      <KakaoModal :place="place" @close-modal="$emit('close-modal')" />
    </template>

    <template v-if="modal.name == 'comment' && modal.open ">
        <CommentModal
        @modal-busy="busy = $event"
        @close-modal="$emit('close-modal')"
        @load-comments="$emit('load-comments')"
        />
    </template>

    </template>
  </el-dialog>
</template>

<script>
  import GestionImagesModal from './modal/GestionImagesModal'
  import KakaoModal from './modal/KakaoModal'
  import CommentModal from './modal/CommentModal'
  export default {
    name: 'modals',
    components: { GestionImagesModal, KakaoModal,CommentModal },
    props: {
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
      },
      modal:{
        type: Object,
        required: false,
        default: () => {}
      }
    },

    data(){
      return{
        busy: false,
      }
    },

    computed:{
      fullscreen(){
        return ['gestionImages', 'kakaomap'].includes(this.modal.name)
      },
      customClass(){
        return this.modal.name == 'comment' ? 'modal-commentaire' : ''
      }
    }

  }

</script>

<style scoped lang="scss">
  ::v-deep .modal-commentaire {
    width: 800px;
    max-width: 90%;
  }
</style>