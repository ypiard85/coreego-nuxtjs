<template>
  <div>
    <form-place :isEditMode="false"/>
  </div>
</template>
<script>
  import FormPlace from './../../components/FormPlace'
  export default {
    name: 'placeAdd',
    middleware: 'authenticated',
    components: {
      FormPlace
    },

  }
</script>
<style lang="scss" scoped>

</style>