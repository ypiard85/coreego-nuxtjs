<template>
  <div>
    <place-form :isEditMode="false" />
  </div>
</template>
<script>
import PlaceForm from '../../../components/form/PlaceForm.vue'
  export default {
    name: 'placeAdd',
    components: {
      PlaceForm
    },

  }
</script>
<style lang="scss" scoped>

</style>