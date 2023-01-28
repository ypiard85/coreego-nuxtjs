<template>
  <b-nav-item active="active">
    <NuxtLink to="/" class="navigation__logo d-flex align-items-center" style="width: 150px;">
        <el-image :src="LOGO_PATH" style="width: 100%; height: 100%;" alt="logo coreego"></el-image>
    </NuxtLink>
  </b-nav-item>
</template>

<script>
import {LOGO_PATH} from "~/utils/variables";
  export default{
    data() {
            return {LOGO_PATH};
        },
  }
</script>