<template>
  <b-modal
    v-model="open"
    :modal-class="[fullscreen && 'fullscreen']"
    hide-header
    hide-footer
  >
    <span @click="open = false" class="close__modal__icon text-blue"
      ><i class="bi bi-x-lg"></i
    ></span>
    <slot />
  </b-modal>
</template>
<script>
export default {
  props: {
    fullscreen: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      open: false,
    };
  },

  methods: {
    openModal() {
      this.open = true;
    },
    closeModal(){
      this.open = false
    }
  },
};
</script>

<style scoped lang="scss">
.modal {
  .close__modal__icon {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    z-index: 10;

    i {
      font-size: 28px;
    }
  }
  &.fullscreen .modal-dialog {
    max-width: 100%;
    margin: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100vh;
    display: flex;
    position: fixed;
    z-index: 100000;
  }
}
</style>
