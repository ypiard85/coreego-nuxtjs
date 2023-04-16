<template>
  <el-select :value="value" @input="$emit('input', $event)">
    <el-option label="--Pas de pointage--" :value="null" />
    <el-option
      :label="option.title"
      :value="option.id"
      :key="option.id"
      v-for="option in options"
    />
  </el-select>
</template>

<script>
export default {
  name: 'pointage-form',
  props: {
    value: {
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped lang="scss"></style>
