<template>
  <div v-if="place">
    <section class="introduction__header">
      <div class="d-flex">
        <p class="me-2 text-secondary"><i class="el-icon-location-outline"></i>{{ city.label }}</p>
        <vui-tag :label="category.label" :color="category.color" />
      </div>
      <Avatar :user="place.user" :link="true" />
      <h1 class="fs-3 mt-3">{{ place.title }}</h1>
    </section>
    <!-- description -->
    <section class="my-2 introduction__description" style="white-space: pre-line">
      {{ place.description }}
    </section>

    <section class="mt-5" v-if="isLogged">
      <el-button v-if="!inCarnet" type="primary" @click="$emit('add-to-carnet')" :loading="loadingBtn"
        icon="el-icon-plus">Carnet de route</el-button>
      <el-button v-else type="danger" :loading="loadingBtn" @click="$emit('delete-to-carnet')"
        icon="el-icon-minus">Carnet de route</el-button>

      <setting-dropdown :isAuthPlace="isAuthPlace" @command-button="$emit('command-button', $event)" />

    </section>

  </div>
</template>

<script>
  import VuiTag from '@/components/vui-alpha/VuiTag'
  import Avatar from '@/components/Avatar'
  import SettingDropdown from './_SettingDropdown'
  import { mapGetters } from 'vuex'
  export default {
    components: { VuiTag, Avatar, SettingDropdown },

    props: {
      place: {
        required: true,
      },
      inCarnet: {
        type: Boolean,
      },
      loadingBtn: {
        type: Boolean,
        required: false,
        default: false
      },
      city: {
        type: Object,
      },
      category: {
        type: Object,
      },
      isAuthPlace: {
        type: Boolean,
        required: true,
        default: false,
      },
      inCarnet: {
        type: Boolean,
        required: true,
        default: false,
      }
    },

    computed: {
      ...mapGetters('auth', { isLogged: 'getIsLogged' })
    }
  };
</script>

<style scoped lang="scss">
  ::v-deep .nav-tabs {
    border-bottom: 0px solid transparent;

    .nav-link.active {
      border-color: transparent;
      border-bottom: 3px solid black;
    }
  }
</style>