<template >
    <div>
      <!-- <Header title="Ajouter un lieu" icon="plus" /> -->
      <form-place :isEditMode="false" />
    </div>
  </template>
  <script>
    // import Header from '@/views/components/Header'
    import FormPlace from './../../components/FormPlace'
  export default {
    name: 'placeAdd',
    components:{FormPlace}
  }
  </script>
  <style lang="">

  </style>