<template>
    <el-tag effect="dark" :style="{'background': color, 'border': 'none'}" > {{ label }}</el-tag>
</template>
<script>
export default {
    name: "tag",
    props:{
        color:{
            type: String,
            required: false,
            default: 'blue'
        },
        label:{
            type: String,
            required: true,
            default: ''
        }
    }
}
</script>
<style lang="">

</style>