<template>
    <el-button :type="type" @click="$emit('change')" :loading="loadingBtn"
    :icon="icon">{{label}}</el-button>
</template>

<script>

  export default{
    name: 'VuiButtonReverse',

    props:{
      status:{
        type: Boolean,
        required: false,
        default: false
      },
      trueIcon:{
        type: String,
        required: true,
      },
      falseIcon:{
        type: String,
        required: true,
      },
      trueLabel:{
        type: String,
        required: true,
      },
      falseLabel:{
        type: String,
        required: true,
      },
      loadingBtn:{
        type: Boolean,
        required: true
      }
    },

    computed:{
      icon(){
        return this.status ?  this.falseIcon : this.trueIcon
      },
      label(){
        return this.status ? this.falseLabel : this.trueLabel
      },
      type(){
        return this.status ? 'danger' : 'primary'
      }
    },
  }
</script>