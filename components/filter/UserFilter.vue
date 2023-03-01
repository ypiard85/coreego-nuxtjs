<template>
  <el-select id="user" no-data-text="Aucun utilisateur trouvé" v-model="value" @clear="options = [], $emit('clear-tag')"
    @change="$emit('change', $event)" clearable="clearable" filterable="filterable" remote="remote"
    reserve-keyword="reserve-keyword" placeholder="Selectionner un utilisateur" :remote-method="remoteMethod"
    :loading="loading">
    <el-option style="height: 100%" class="filter_user_option" v-for="user in options" :key="user.localId"
      :label="user.displayName" :value="user.localId">
      <el-avatar :src="user.photoUrl" class="me-3" />
      <span>{{ user.displayName }}</span>
    </el-option>
  </el-select>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'userFilter',

    props: {
      userName: {
        required: false
      }
    },

    data() {
      return {
        options: [],
        list: [],
        value: null,
        loading: false
      }
    },

    computed: {
      ...mapGetters('app', { users: 'getUsers' })
    },

    created(){
      this.value = this.userName
    },

    mounted() {
      this.list = [...this.users]
    },

    methods: {
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.options = this.list.filter(item => {
              return item.displayName.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
      },
    }

  }
</script>

<style lang="scss" scoped>
  .filter_user_option {
    padding-top: 5px;
    padding-bottom: 5px;
    display: flex;
    align-items: center;
  }
</style>