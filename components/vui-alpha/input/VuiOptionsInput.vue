<template>
  <div role="group" class="d-flex flex-column">
    <label :for="id">{{ label }}</label>
    <b-form-select
      :id="id"
      class="form-control"
      @input="$emit('input', $event)"
      :options="options"
      :value="value"
      value-field="id"
      text-field="label"
      disabled-field="notEnabled"
    ></b-form-select>
  </div>
</template>
<script>
import { capitalize } from "@/utils/filter.js";
export default {
  props: {
    value: {
      required: true,
    },
    id:{
      type: String
    },
    options: {
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
};
</script>
<style lang=""></style>
