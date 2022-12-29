<template >
    <div>
        <label :for="id"> {{ label }} </label>
        <b-form-textarea
        :value="value"
        :required="required"
        :id="id"
        :placeholder="placeholder"
        :rows="rows"
        @input="$emit('input', $event)"
      ></b-form-textarea>
    </div>
</template>
<script>
export default {
    props:{
        value:{
            type: String
        },
        id:{
            type: String,
            required: true
        },
        label:{
            type: String,
            required: true
        },
        placeholder:{
            type: String,
            required: true
        },
        rows:{
            type: Number
        },
        required:{
            type: Boolean,
            required: false,
            defualt: false
        }
    }
}
</script>
<style lang="">

</style>