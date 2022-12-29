<template lang="">
  <div role="group">
    <label :for="id">{{ capitalize(label) }}</label>
        <b-form-input
        :id="id"
        @input="$emit('input', $event)"
        @blur="$emit('input-blur')"
        :required="required"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        trim
        :state="validation"
        >
        <b-button>felzmfj</b-button>
      </b-form-input>
    <!-- state = computed qui return true ou false pour la verification -->
    <!-- <!-- v-model="name" -->
    <b-form-invalid-feedback :id="id + '-feedback'" v-if="!validation">
      {{ errorText }}
    </b-form-invalid-feedback>
    <b-form-text id="input-live-help" v-if="helper">{{ helper }}</b-form-text>
  </div>
</template>
<script>
import { capitalize } from "@/utils/filter.js";

export default {
  props: {
    value: {
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: false,
      default: "text",
    },
    required: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
    errorText: {
      type: String,
      required: false,
      default: null,
    },
    validation: {
      required: false,
      default: null,
    },
    helper: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      capitalize,
    };
  },

  methods: {},
};
</script>
<style lang=""></style>
