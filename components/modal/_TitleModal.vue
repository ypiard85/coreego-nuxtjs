<template>
  <header class="modal__header" slot="title">
    <div class="modal__header__title">
      <i :class="ClassIcon"></i>
      <span class="ms-3">{{ title }}</span>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    ClassIcon: {
      type: String,
      required: false,
      default: '',
    },
    title: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>

<style scoped lang="scss">
.modal__header {
  position: absolute;
  top: 0;
}
</style>
