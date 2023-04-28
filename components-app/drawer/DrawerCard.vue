<template>
  <div>
    {{ topic.address_name }}
    <div>
      <el-button @click="$emit('marker-target', topic)">Select</el-button>
      <el-button @click="$emit('street-view-target', topic)"
        >StreetView</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'DrawerCard',

  props: {
    topic: {
      type: Object,
    },
  },
}
</script>

<style></style>
