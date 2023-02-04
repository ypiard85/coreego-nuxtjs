<template>
  <el-dropdown @command="$emit('command-button', $event)" v-if="isAuthPlace" trigger="click">
    <span class="el-dropdown-link">
      <el-button type="info" class="ms-3" icon="el-icon-setting" circle></el-button>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item icon="el-icon-picture-outline" command="openModalPictureSetting">Gérer les
        photos</el-dropdown-item>
      <el-dropdown-item icon="el-icon-edit" command="goToPlaceEditView">Modifier le lieu</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  export default {
    name: 'settingDropdown',

    props: {
      isAuthPlace: {
        type: Boolean,
        required: true,
        default: false,
      },
    }


  }
</script>