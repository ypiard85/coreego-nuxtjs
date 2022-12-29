<template>
  <b-form-input
    type="search"
    :value="value"
    @input="handleInputSearch"
    :placeholder="placeholder"
  />
</template>
<script>

export default {
    props:{
        value:{
            type: String,
            required: false,
        },
        placeholder:{
            type: String,
            required: false
        }
    },

    methods:{
        handleInputSearch(value){
            this.$emit('input', value)
        }
    }
};
</script>

<style scoped></style>
