<template>
    <el-input
      id="title"
      placeholder="Titre du lieu"
      @input="$emit('input', $event)"
      :value="value"
      maxlength="50"
      show-word-limit
    />
</template>

<script>
export default {
  name: 'title-form',

  props: {
    value: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped lang="scss"></style>
