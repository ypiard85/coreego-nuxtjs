<template>
  <nuxt-link class="mt-3 d-inline-flex align-items-center" :to="`/profil/view/${user.localId}`"
    :style="{'pointer-events' :  link ? 'auto' : 'none'}"
  >
    <el-avatar
    :src="user.photoUrl"
    class="me-3"
    ></el-avatar>
    <span class="fw-bold text-blue">{{ user.displayName }}</span>
  </nuxt-link>
</template>

<script>
  export default{
    name: 'Avatar',

    props:{
      user:{
        type: Object,
        required: false,
      },
      link:{
        type: Boolean,
        required: false,
        default: false,
      }
    },

  }
</script>

<style lang="scss" scoped>

</style>