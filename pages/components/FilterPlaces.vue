<template>
  <div class="filter-places py-3 my-3">
    <b-container fluid="sm">
      <p>Filtres :</p>

      <search-filter v-model="search" @input="$emit('change-search-value', $event)" />

      <section class="mt-3">
        <toogle-filter :value="textstatus" :label="textstatus ? 'Z - A' : 'A - Z' " @click="onChangeTextStatus" />
        <toogle-filter :value="dateStatus" :label="dateStatus ? 'Du plus anciens' : 'Du plus résents' "
          @click="onChangeDateStatus" />
        <el-button size="small" icon="el-icon-s-operation" @click="openDialog = true">
          Filtre avancé
        </el-button>
      </section>

      <el-dialog title="Filtre avancé" :visible="openDialog" class="filter-places__dialog" top="5vh"
        @close="openDialog = false" :destroy-on-close="true" :append-to-body="true">
        <section>
          <el-form label-position="top">
            <el-form-item label="Province" class="w-100">
              <el-select name="Province" remote="remote" :value="city" class="w-100" @input="onChangeCity"
                clearable="clearable" placeholder="Selectioner une province">
                <el-option v-for="city in cities" :key="city.id" :label="city.label" :value="city.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Catégorie" class="w-100">
              <div class="d-flex align-items-center">
                <el-select name="Catégorie" class="w-100" remote="remote" :value="category" @input="onChangeCategory"
                  clearable="clearable" placeholder="Selectioner une catégorie">
                  <el-option v-for="category in categories" :key="category.id" :label="category.label"
                    :value="category.id"></el-option>
                </el-select>
                <!-- <vui-bullet :color="colorCategory" v-if="colorCategory" class="ms-3"/> -->
              </div>
            </el-form-item>
            <el-form-item label="Utilisateur" class="w-100">
              <user-filter class="w-100" @clear-tag="userName = null" :userName="userName" @change="onChangeUser" />
            </el-form-item>



          </el-form>
        </section>
      </el-dialog>


    </b-container>
  </div>
</template>
<script>
  import VuiBullet from "~/components/vui-alpha/VuiBullet";
  import SearchFilter from '~/components/filter/SearchFilter'
  import ToogleFilter from '~/components/filter/ToogleFilter'
  import UserFilter from '~/components/filter/UserFilter'
  import { mapGetters } from 'vuex'

  export default {
    name: "filter-places",
    components: {
      VuiBullet,
      SearchFilter,
      ToogleFilter,
      UserFilter
    },

    data() {
      return {
        search: '',
        textstatus: false,
        dateStatus: false,

        userName: null,

        city: null,
        category: null,

        openDialog: false,
      };
    },

    computed: {
      ...mapGetters('app', { cities: 'getCities', categories: 'getCategories', users: 'getUsers' })
    },


    methods: {
      onChangeTextStatus() {
        this.textstatus = !this.textstatus
        this.$emit('change-text-status', this.textstatus)
      },
      onChangeDateStatus() {
        this.dateStatus = !this.dateStatus
        this.$emit('change-date-status', this.dateStatus)
      },

      onChangeCity($event) {
        this.city = $event
        $event === "" && (this.city = null)
        this.$emit('change-city', this.city)
      },

      onChangeCategory($event) {
        this.category = $event
        $event === '' && (this.category = null)
        this.$emit('change-category', this.category)
      },

      onChangeUser($event){
        let result = this.users.find(user => user.localId === $event)
        if(result){
          this.userName = result.displayName
        }
        this.$emit('change-user-value', $event)
      }

    }

  };
</script>

<style lang="scss" scoped="scoped">
  .filter-places {
    .el-button+.el-button {
      margin: 0;
    }
  }

  ::v-deep .el-dialog {
    width: 500px !important;
    margin: auto;
    max-width: 100%;
  }
</style>