<template>
    <header class="bg-light py-5">
      <b-container>
        <h1 class="text-blue fs-3">
          <i :class="`el-icon-${iconTitle}`" class="fw-bold" ></i>
          {{ textTitle }}</h1>
      </b-container>
    </header>
</template>

<script>
  export default{
    name: "headerPage",
    props:{
      isEditMode:{
        type: Boolean,
        required: true
      }
    },

    computed:{
        textTitle(){
          return this.isEditMode ? 'Editer le lieu' : 'Ajouter un lieu'
        },

        iconTitle(){
          return this.isEditMode ? 'edit' : 'plus'
        }
    }

  }
</script>